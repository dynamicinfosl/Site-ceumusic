-- Sincronizada a partir do banco de produção: aplicada em 2026-11-10 fora deste repositório.
alter table public.festival_registrations add column if not exists raffle_code text unique;

create table public.festival_raffle_orders (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  registration_id uuid not null references public.festival_registrations (id) on delete restrict,
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text not null,
  buyer_cpf text not null,
  quantity smallint not null check (quantity between 1 and 10),
  amount_cents integer not null check (amount_cents > 0),
  status text not null default 'pending_payment' check (status in ('pending_payment', 'paid', 'expired', 'refund_needed')),
  pix_id text,
  pix_br_code text,
  pix_qr text,
  pix_expires_at timestamptz,
  payment_dev_mode boolean not null default false,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.festival_raffle_tickets (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.festival_registrations (id) on delete restrict,
  slot smallint not null check (slot between 1 and 10),
  number integer not null unique,
  status text not null default 'available' check (status in ('available', 'reserved', 'sold')),
  order_id uuid references public.festival_raffle_orders (id) on delete set null,
  sold_at timestamptz,
  created_at timestamptz not null default now(),
  unique (registration_id, slot)
);

create table public.festival_raffle_draws (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.festival_raffle_tickets (id),
  ticket_number integer not null,
  order_id uuid references public.festival_raffle_orders (id),
  sold_count integer not null,
  sold_numbers_sha256 text not null,
  actor_id uuid references auth.users (id) on delete set null,
  actor_email text,
  note text,
  created_at timestamptz not null default now()
);

create index festival_raffle_orders_registration on public.festival_raffle_orders (registration_id, created_at desc);
create index festival_raffle_orders_pending on public.festival_raffle_orders (status) where status = 'pending_payment';
create index festival_raffle_tickets_order on public.festival_raffle_tickets (order_id);
create index festival_raffle_tickets_status on public.festival_raffle_tickets (status);

alter table public.festival_raffle_orders enable row level security;
alter table public.festival_raffle_tickets enable row level security;
alter table public.festival_raffle_draws enable row level security;

create policy "Festival team can read raffle orders"
  on public.festival_raffle_orders for select to authenticated
  using (public.has_permission('festival'));
create policy "Festival team can read raffle tickets"
  on public.festival_raffle_tickets for select to authenticated
  using (public.has_permission('festival'));
create policy "Festival team can read raffle draws"
  on public.festival_raffle_draws for select to authenticated
  using (public.has_permission('festival'));

revoke all on public.festival_raffle_orders, public.festival_raffle_tickets, public.festival_raffle_draws from anon, authenticated;
grant select on public.festival_raffle_tickets, public.festival_raffle_draws to authenticated;
grant select (
  id, registration_id, buyer_name, buyer_email, buyer_phone, buyer_cpf, quantity, amount_cents,
  status, payment_dev_mode, paid_at, created_at, updated_at
) on public.festival_raffle_orders to authenticated;
grant select (raffle_code) on public.festival_registrations to authenticated;

create function public.festival_raffle_ensure_tickets(p_registration_id uuid)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_number integer;
  v_code text;
begin
  select number, raffle_code into v_number, v_code
  from public.festival_registrations
  where id = p_registration_id and status = 'paid'
  for update;
  if v_number is null then
    return null;
  end if;
  if v_code is null then
    loop
      v_code := substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
      exit when not exists (select 1 from public.festival_registrations where raffle_code = v_code);
    end loop;
    update public.festival_registrations set raffle_code = v_code where id = p_registration_id;
  end if;
  insert into public.festival_raffle_tickets (registration_id, slot, number)
  select p_registration_id, slot, (v_number - 1) * 10 + slot
  from generate_series(1, 10) as slot
  on conflict (registration_id, slot) do nothing;
  return v_code;
end;
$$;

create function public.festival_raffle_release_expired()
returns integer language plpgsql security definer set search_path = '' as $$
declare
  v_count integer;
begin
  with expired as (
    update public.festival_raffle_orders
    set status = 'expired', pix_br_code = null, pix_qr = null, updated_at = now()
    where status = 'pending_payment'
      and coalesce(pix_expires_at, created_at + interval '15 minutes') < now() - interval '10 minutes'
    returning id
  )
  update public.festival_raffle_tickets t
  set status = 'available', order_id = null
  from expired
  where t.order_id = expired.id and t.status = 'reserved';
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

create function public.festival_raffle_reserve(p_order_id uuid, p_quantity integer)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  v_registration uuid;
  v_ids uuid[];
begin
  perform public.festival_raffle_release_expired();
  select registration_id into v_registration from public.festival_raffle_orders where id = p_order_id;
  if v_registration is null then
    return false;
  end if;
  select array_agg(id) into v_ids from (
    select id from public.festival_raffle_tickets
    where registration_id = v_registration and status = 'available'
    order by slot
    limit p_quantity
    for update skip locked
  ) available;
  if coalesce(array_length(v_ids, 1), 0) < p_quantity then
    return false;
  end if;
  update public.festival_raffle_tickets set status = 'reserved', order_id = p_order_id where id = any (v_ids);
  return true;
end;
$$;

create function public.festival_raffle_cancel_order(p_order_id uuid)
returns void language sql security definer set search_path = '' as $$
  update public.festival_raffle_tickets set status = 'available', order_id = null
  where order_id = p_order_id and status = 'reserved';
  delete from public.festival_raffle_orders where id = p_order_id and status = 'pending_payment' and pix_id is null;
$$;

create function public.festival_raffle_mark_paid(p_order_id uuid)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_status text;
  v_quantity integer;
  v_reserved integer;
begin
  select status, quantity into v_status, v_quantity
  from public.festival_raffle_orders where id = p_order_id for update;
  if v_status is null then
    return null;
  end if;
  if v_status in ('paid', 'refund_needed') then
    return v_status;
  end if;
  select count(*) into v_reserved
  from public.festival_raffle_tickets where order_id = p_order_id and status = 'reserved';
  if v_status = 'pending_payment' and v_reserved = v_quantity then
    update public.festival_raffle_tickets set status = 'sold', sold_at = now()
    where order_id = p_order_id and status = 'reserved';
    update public.festival_raffle_orders
    set status = 'paid', paid_at = now(), pix_br_code = null, pix_qr = null, updated_at = now()
    where id = p_order_id;
    return 'paid';
  end if;
  update public.festival_raffle_tickets set status = 'available', order_id = null
  where order_id = p_order_id and status = 'reserved';
  update public.festival_raffle_orders
  set status = 'refund_needed', paid_at = now(), pix_br_code = null, pix_qr = null, updated_at = now()
  where id = p_order_id;
  return 'refund_needed';
end;
$$;

create function public.festival_raffle_draw(p_actor_id uuid, p_actor_email text, p_note text default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_count integer;
  v_hash text;
  v_index integer;
  v_ticket public.festival_raffle_tickets;
  v_draw_id uuid;
begin
  lock table public.festival_raffle_tickets in share row exclusive mode;
  select count(*), encode(sha256(convert_to(coalesce(string_agg(number::text, ',' order by number), ''), 'UTF8')), 'hex')
  into v_count, v_hash
  from public.festival_raffle_tickets where status = 'sold';
  if v_count = 0 then
    return jsonb_build_object('error', 'Nenhum ticket vendido para sortear.');
  end if;
  v_index := (('x' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))::bit(48)::bigint % v_count)::integer;
  select * into v_ticket from public.festival_raffle_tickets
  where status = 'sold' order by number offset v_index limit 1;
  insert into public.festival_raffle_draws (ticket_id, ticket_number, order_id, sold_count, sold_numbers_sha256, actor_id, actor_email, note)
  values (v_ticket.id, v_ticket.number, v_ticket.order_id, v_count, v_hash, p_actor_id, p_actor_email, nullif(trim(p_note), ''))
  returning id into v_draw_id;
  return jsonb_build_object('ok', true, 'draw_id', v_draw_id, 'ticket_number', v_ticket.number, 'sold_count', v_count);
end;
$$;

revoke all on function
  public.festival_raffle_ensure_tickets(uuid),
  public.festival_raffle_release_expired(),
  public.festival_raffle_reserve(uuid, integer),
  public.festival_raffle_cancel_order(uuid),
  public.festival_raffle_mark_paid(uuid),
  public.festival_raffle_draw(uuid, text, text)
from public, anon, authenticated;
