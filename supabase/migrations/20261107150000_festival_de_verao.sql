-- Festival de Verão: inscrições pagas por Pix e envio do vídeo.
-- Visitantes não acessam a tabela; tudo passa pela função "festival".

create table public.festival_registrations (
  id uuid primary key default gen_random_uuid(),
  number integer generated always as identity unique,
  -- Hash do link privado da inscrição; o link em si fica só com o participante
  token_hash text not null unique,
  full_name text not null,
  artistic_name text not null default '',
  email text not null,
  phone text not null,
  cpf text not null,
  city text not null default '',
  state text not null default '',
  song_title text not null,
  terms_accepted_at timestamptz not null,
  status text not null default 'pending_payment' check (status in ('pending_payment', 'paid', 'canceled')),
  amount_cents integer not null check (amount_cents >= 100),
  pix_id text,
  pix_br_code text,
  pix_qr text,
  pix_expires_at timestamptz,
  payment_dev_mode boolean not null default false,
  paid_at timestamptz,
  video_uid text,
  video_status text not null default 'none' check (video_status in ('none', 'uploading', 'processing', 'ready', 'error')),
  video_duration numeric,
  video_embed_url text,
  video_uploaded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index festival_registrations_cpf on public.festival_registrations (cpf);
create index festival_registrations_email on public.festival_registrations (lower(email));

alter table public.festival_registrations enable row level security;
revoke all on public.festival_registrations from anon, authenticated;

-- Nova permissão do painel
create or replace function public.all_permissions()
returns text[] language sql immutable set search_path = '' as $$
  select array['hero','about','artists','releases','videos','news','contact','settings','festival','users','roles'];
$$;
update public.roles set permissions = array_append(permissions, 'festival')
where name = 'Administrador' and not ('festival' = any (permissions));

grant select (
  id, number, full_name, artistic_name, email, phone, cpf, city, state, song_title, terms_accepted_at,
  status, amount_cents, payment_dev_mode, paid_at, video_uid, video_status, video_duration, video_embed_url,
  video_uploaded_at, created_at, updated_at
) on public.festival_registrations to authenticated;
create policy "Festival team can read registrations" on public.festival_registrations for select to authenticated
  using (public.has_permission('festival'));

-- As configurações do festival ficam em site_settings, na chave "festival"
drop policy if exists "Write with permission" on public.site_settings;
create policy "Write with permission" on public.site_settings for all to authenticated
  using (
    public.has_permission('settings')
    or (key = 'about_page' and public.has_permission('about'))
    or (key = 'festival' and public.has_permission('festival'))
  )
  with check (
    public.has_permission('settings')
    or (key = 'about_page' and public.has_permission('about'))
    or (key = 'festival' and public.has_permission('festival'))
  );

insert into public.site_settings (key, value) values ('festival', '{
  "registration_open": false,
  "fee_cents": 0,
  "deadline": "",
  "max_video_minutes": 10,
  "tagline": "Sua música merece brilhar.",
  "about": "O Festival de Verão é um concurso de música que procura novas vozes e novas canções. Celebramos o artista independente, sem perder a seriedade de quem entrega um prêmio que muda carreiras.",
  "prizes": [
    {"title": "Mentoria", "text": "Acompanhamento com Samuel Messias."},
    {"title": "3 músicas gravadas", "text": "Produção no estúdio da Céu Music."},
    {"title": "Lançamento", "text": "Estratégias para lançar as músicas."}
  ],
  "regulation": "",
  "site_url": "https://festivaldeverao.ceumusic.com.br",
  "banner": {"enabled": true, "title": "Festival de Verão", "text": "Inscrições para o concurso de música da Céu. Sua música merece brilhar."}
}'::jsonb)
on conflict (key) do nothing;
