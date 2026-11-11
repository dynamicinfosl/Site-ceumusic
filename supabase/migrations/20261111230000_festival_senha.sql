-- Senha da inscrição: guardada só como hash (PBKDF2-SHA256, calculado na função do festival).
-- O painel vê apenas se existe senha, nunca o hash.
alter table public.festival_registrations
  add column if not exists password_hash text,
  add column if not exists password_set_at timestamptz;

grant select (password_set_at) on public.festival_registrations to authenticated;

-- Acessos abertos com e-mail e senha. Cada aparelho recebe o próprio link, sem derrubar os outros.
create table public.festival_sessions (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.festival_registrations (id) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default now()
);
create index festival_sessions_registration on public.festival_sessions (registration_id);
alter table public.festival_sessions enable row level security;
revoke all on public.festival_sessions from anon, authenticated;

-- Comprovante de pagamento do participante. Quem tem o link privado da inscrição (o token)
-- consulta só os dados do próprio comprovante; o restante da tabela continua fechado.
create function public.festival_receipt(p_token text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'number', r.number,
    'full_name', r.full_name,
    'artistic_name', r.artistic_name,
    'cpf_masked', '***.' || substr(r.cpf, 4, 3) || '.' || substr(r.cpf, 7, 3) || '-**',
    'payer_name', coalesce(r.guardian_name, r.full_name),
    'amount_cents', r.amount_cents,
    'status', r.status,
    'paid_at', r.paid_at,
    'pix_id', r.pix_id,
    'created_at', r.created_at
  )
  from public.festival_registrations r
  where p_token ~ '^[a-f0-9]{64}$'
    and (
      r.token_hash = encode(sha256(convert_to(p_token, 'UTF8')), 'hex')
      or exists (
        select 1 from public.festival_sessions s
        where s.registration_id = r.id and s.token_hash = encode(sha256(convert_to(p_token, 'UTF8')), 'hex')
      )
    )
    and r.status = 'paid';
$$;
revoke all on function public.festival_receipt(text) from public;
grant execute on function public.festival_receipt(text) to anon, authenticated;
