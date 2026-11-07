-- Campos que antes só existiam no código e agora são editados pelo painel.

alter table public.artists
  add column if not exists short_bio text,
  add column if not exists photo_position text not null default '50% 50%',
  add column if not exists followers jsonb not null default '{}'::jsonb,
  add column if not exists songs jsonb not null default '[]'::jsonb,
  add column if not exists videos jsonb not null default '[]'::jsonb,
  -- Mantém funcionando os links antigos, como /artista/1
  add column if not exists legacy_id integer unique;

alter table public.releases
  add column if not exists genre text,
  add column if not exists streams text,
  add column if not exists featured boolean not null default false,
  add column if not exists video_url text;

-- Segundo do vídeo do YouTube em que a prévia começa, quando não há clipe enviado.
alter table public.hero_videos add column if not exists preview_start integer not null default 0;
alter table public.videos_gallery add column if not exists preview_start integer not null default 0;

-- Textos gerais do site, um registro por assunto.
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;

drop policy if exists "Public Read Access" on public.site_settings;
create policy "Public Read Access" on public.site_settings for select using (true);

drop policy if exists "Admins can write" on public.site_settings;
create policy "Admins can write" on public.site_settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

revoke insert, update, delete, truncate on public.site_settings from anon;
