-- Troca de senha aprovada por um administrador.
-- Guardamos só o hash da senha desejada, apagado assim que o pedido é resolvido.

create table public.password_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  password_hash text,
  status text not null default 'open' check (status in ('open', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '3 days',
  resolved_by uuid references auth.users (id) on delete set null,
  resolved_at timestamptz
);
-- Um pedido aberto por pessoa: um novo substitui o anterior
create unique index password_requests_one_open on public.password_requests (user_id) where status = 'open';

alter table public.password_requests enable row level security;
revoke all on public.password_requests from anon, authenticated;
-- O hash nunca é legível pelo painel
grant select (id, user_id, status, created_at, expires_at, resolved_at) on public.password_requests to authenticated;
create policy "Managers can read password requests" on public.password_requests for select to authenticated
  using (public.has_permission('users'));

-- can_manage_user impede aprovar o próprio pedido e o de quem tem mais permissões.
create function public.approve_password_request(p_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  request public.password_requests;
begin
  select * into request from public.password_requests where id = p_id for update;
  if not found or request.status <> 'open' then
    raise exception 'Este pedido não está mais aberto.';
  end if;
  if not public.can_manage_user(request.user_id) then
    raise exception 'Você não pode aprovar este pedido.' using errcode = '42501';
  end if;
  if request.expires_at < now() or request.password_hash is null then
    raise exception 'Este pedido expirou. Peça para a pessoa solicitar de novo.';
  end if;

  update auth.users set encrypted_password = request.password_hash, updated_at = now() where id = request.user_id;
  -- Encerra as sessões abertas com a senha antiga
  delete from auth.sessions where user_id = request.user_id;

  update public.password_requests
  set status = 'approved', password_hash = null, resolved_by = auth.uid(), resolved_at = now()
  where id = p_id;
end;
$$;

create function public.reject_password_request(p_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  request public.password_requests;
begin
  select * into request from public.password_requests where id = p_id for update;
  if not found or request.status <> 'open' then
    raise exception 'Este pedido não está mais aberto.';
  end if;
  if not public.can_manage_user(request.user_id) then
    raise exception 'Você não pode recusar este pedido.' using errcode = '42501';
  end if;

  update public.password_requests
  set status = 'rejected', password_hash = null, resolved_by = auth.uid(), resolved_at = now()
  where id = p_id;
end;
$$;

revoke all on function public.approve_password_request(uuid), public.reject_password_request(uuid) from public, anon;
grant execute on function public.approve_password_request(uuid), public.reject_password_request(uuid) to authenticated;
