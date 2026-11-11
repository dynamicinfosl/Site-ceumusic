-- Financeiro do Festival: a conta AbacatePay é da plataforma e a Céu é uma subconta.
-- Cada Pix de inscrição é dividido: a parte da Céu vai para a subconta e a taxa da
-- plataforma fica na conta principal. A Céu vê e saca só o saldo da subconta.

create or replace function public.all_permissions()
returns text[] language sql immutable set search_path = '' as $$
  select array['hero','about','artists','releases','videos','news','contact','settings','festival','finance','users','roles'];
$$;

create function public.is_master()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles p join public.roles r on r.id = p.role_id
    where p.user_id = auth.uid() and p.status = 'active' and r.is_master
  );
$$;
revoke all on function public.is_master() from public, anon;
grant execute on function public.is_master() to authenticated;

-- Configuração única, visível só para o Master. A escrita passa pela função do festival.
create table public.festival_payment_config (
  id smallint primary key default 1 check (id = 1),
  subaccount_id text,
  subaccount_name text,
  subaccount_tax_id text,
  commission_bps integer not null default 350 check (commission_bps between 0 and 5000),
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);
insert into public.festival_payment_config (id) values (1);
alter table public.festival_payment_config enable row level security;
revoke all on public.festival_payment_config from anon, authenticated;
grant select on public.festival_payment_config to authenticated;
create policy "Master can read payment config" on public.festival_payment_config for select to authenticated
  using (public.is_master());

-- Divisão aplicada no Pix de cada inscrição, em centavos
alter table public.festival_registrations
  add column if not exists split_partner_cents integer,
  add column if not exists split_platform_cents integer;
grant select (split_partner_cents, split_platform_cents) on public.festival_registrations to authenticated;

-- Saques da subconta da Céu. O external_id é a chave de idempotência na AbacatePay.
create table public.festival_withdrawals (
  id uuid primary key default gen_random_uuid(),
  external_id uuid not null unique default gen_random_uuid(),
  amount_cents integer not null check (amount_cents >= 100),
  fee_cents integer,
  status text not null default 'processing' check (status in ('processing', 'complete', 'failed')),
  transfer_id text,
  receipt_url text,
  error text,
  dev_mode boolean not null default false,
  requested_by uuid references auth.users (id) on delete set null,
  requested_by_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index festival_withdrawals_created on public.festival_withdrawals (created_at desc);
create index festival_withdrawals_requested_by on public.festival_withdrawals (requested_by);
alter table public.festival_withdrawals enable row level security;
revoke all on public.festival_withdrawals from anon, authenticated;
grant select on public.festival_withdrawals to authenticated;
create policy "Finance team can read withdrawals" on public.festival_withdrawals for select to authenticated
  using (public.has_permission('finance'));
