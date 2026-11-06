-- Antes, qualquer pessoa com a chave pública podia alterar o conteúdo do site.
-- Agora a leitura segue pública e a escrita exige estar na lista de administradores.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Quem já tinha conta no momento desta migração vira administrador.
insert into public.admin_users (user_id)
select id from auth.users
on conflict do nothing;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['about_section', 'artists', 'contact_info', 'hero_videos', 'news', 'releases', 'social_links', 'videos_gallery']
  loop
    execute format('drop policy if exists "Admin All Access" on public.%I', table_name);
    execute format('create policy "Admins can write" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', table_name);
    execute format('revoke insert, update, delete, truncate on public.%I from anon', table_name);
  end loop;
end $$;
