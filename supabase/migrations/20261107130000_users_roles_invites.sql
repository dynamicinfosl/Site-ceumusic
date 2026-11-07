-- Usuários, níveis de permissão e convites do painel.
-- As regras ficam no banco: a tela só mostra o que o banco já permite.

create extension if not exists pgcrypto with schema extensions;

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null default '',
  permissions text[] not null default '{}',
  is_master boolean not null default false,
  is_system boolean not null default false,
  created_at timestamptz not null default now()
);
-- Só existe um nível master
create unique index roles_single_master on public.roles (is_master) where is_master;

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  job_title text not null default '',
  phone text not null default '',
  avatar_url text not null default '',
  status text not null default 'pending' check (status in ('pending', 'active', 'blocked')),
  role_id uuid references public.roles (id) on delete restrict,
  invited_by uuid references auth.users (id) on delete set null,
  approved_by uuid references auth.users (id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.invites (
  id uuid primary key default gen_random_uuid(),
  -- Guardamos só o hash: o link aparece uma única vez, para quem criou o convite
  token_hash text not null unique,
  email text,
  note text not null default '',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz,
  used_by uuid references auth.users (id) on delete set null,
  revoked_at timestamptz
);

alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.invites enable row level security;

revoke all on public.roles, public.profiles, public.invites from anon, authenticated;

-- Níveis iniciais
insert into public.roles (name, description, permissions, is_master, is_system) values
  ('Master', 'Dono do sistema. Tem acesso a tudo e não pode ser alterado.', '{}', true, true),
  ('Administrador', 'Gerencia o conteúdo, os usuários e os níveis de permissão.', array['hero','about','artists','releases','videos','news','contact','settings','users','roles'], false, true),
  ('Editor', 'Edita o conteúdo do site, sem acesso a usuários e configurações.', array['hero','about','artists','releases','videos','news','contact'], false, false);

-- Permissões -----------------------------------------------------------------

create function public.all_permissions()
returns text[] language sql immutable set search_path = '' as $$
  select array['hero','about','artists','releases','videos','news','contact','settings','users','roles'];
$$;

create function public.current_permissions()
returns text[] language sql stable security definer set search_path = '' as $$
  select coalesce((
    select case when r.is_master then public.all_permissions() else r.permissions end
    from public.profiles p
    join public.roles r on r.id = p.role_id
    where p.user_id = auth.uid() and p.status = 'active'
  ), '{}'::text[]);
$$;

create function public.has_permission(p_permission text)
returns boolean language sql stable security definer set search_path = '' as $$
  select p_permission = any (public.current_permissions());
$$;

-- Quem tem acesso ao painel pode enviar arquivos, inclusive a própria foto.
create function public.can_upload()
returns boolean language sql stable security definer set search_path = '' as $$
  select cardinality(public.current_permissions()) > 0;
$$;

-- Ninguém gerencia a si mesmo, o master ou quem tem permissões que ele não tem.
create function public.can_manage_user(p_user uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select public.has_permission('users')
    and p_user <> auth.uid()
    and exists (
      select 1
      from public.profiles p
      left join public.roles r on r.id = p.role_id
      where p.user_id = p_user
        and coalesce(r.is_master, false) = false
        and coalesce(r.permissions, '{}') <@ public.current_permissions()
    );
$$;

create function public.get_my_access()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'user_id', p.user_id, 'email', p.email, 'full_name', p.full_name, 'job_title', p.job_title,
    'phone', p.phone, 'avatar_url', p.avatar_url, 'status', p.status,
    'role_name', r.name, 'is_master', coalesce(r.is_master, false),
    'permissions', public.current_permissions()
  )
  from public.profiles p
  left join public.roles r on r.id = p.role_id
  where p.user_id = auth.uid();
$$;

-- Ações -----------------------------------------------------------------------

create function public.update_user_access(p_user uuid, p_role uuid, p_status text, p_job_title text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  new_role public.roles;
begin
  if not public.can_manage_user(p_user) then
    raise exception 'Você não pode alterar este usuário.' using errcode = '42501';
  end if;
  if p_status not in ('pending', 'active', 'blocked') then
    raise exception 'Situação inválida.';
  end if;
  if p_role is not null then
    select * into new_role from public.roles where id = p_role;
    if not found then
      raise exception 'Nível não encontrado.';
    end if;
    if new_role.is_master or not (new_role.permissions <@ public.current_permissions()) then
      raise exception 'Você não pode conceder este nível.' using errcode = '42501';
    end if;
  elsif p_status = 'active' then
    raise exception 'Escolha um nível para aprovar o usuário.';
  end if;

  update public.profiles
  set role_id = p_role,
      status = p_status,
      job_title = coalesce(p_job_title, ''),
      approved_by = case when p_status = 'active' and approved_at is null then auth.uid() else approved_by end,
      approved_at = case when p_status = 'active' and approved_at is null then now() else approved_at end
  where user_id = p_user;
end;
$$;

create function public.create_invite(p_email text, p_note text, p_days integer)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  raw_token text := encode(extensions.gen_random_bytes(32), 'hex');
  new_id uuid;
begin
  if not public.has_permission('users') then
    raise exception 'Você não pode criar convites.' using errcode = '42501';
  end if;
  if p_days is null or p_days not between 1 and 30 then
    raise exception 'O convite deve valer de 1 a 30 dias.';
  end if;

  insert into public.invites (token_hash, email, note, created_by, expires_at)
  values (
    encode(extensions.digest(raw_token, 'sha256'), 'hex'),
    nullif(lower(trim(coalesce(p_email, ''))), ''),
    coalesce(p_note, ''),
    auth.uid(),
    now() + make_interval(days => p_days)
  )
  returning id into new_id;

  return jsonb_build_object('id', new_id, 'token', raw_token);
end;
$$;

create function public.revoke_invite(p_invite uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.has_permission('users') then
    raise exception 'Você não pode cancelar convites.' using errcode = '42501';
  end if;
  update public.invites set revoked_at = now() where id = p_invite and used_at is null and revoked_at is null;
end;
$$;

create function public.save_role(p_id uuid, p_name text, p_description text, p_permissions text[])
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  existing public.roles;
  my_role uuid;
  saved_id uuid;
begin
  if not public.has_permission('roles') then
    raise exception 'Você não pode alterar níveis.' using errcode = '42501';
  end if;
  if trim(coalesce(p_name, '')) = '' then
    raise exception 'Dê um nome ao nível.';
  end if;
  if not (coalesce(p_permissions, '{}') <@ public.all_permissions()) then
    raise exception 'Permissão inválida.';
  end if;
  if not (coalesce(p_permissions, '{}') <@ public.current_permissions()) then
    raise exception 'Você não pode conceder uma permissão que não tem.' using errcode = '42501';
  end if;

  if p_id is null then
    insert into public.roles (name, description, permissions)
    values (trim(p_name), coalesce(p_description, ''), coalesce(p_permissions, '{}'))
    returning id into saved_id;
    return saved_id;
  end if;

  select * into existing from public.roles where id = p_id;
  if not found then
    raise exception 'Nível não encontrado.';
  end if;
  select role_id into my_role from public.profiles where user_id = auth.uid();
  if existing.is_master or existing.id = my_role or not (existing.permissions <@ public.current_permissions()) then
    raise exception 'Você não pode alterar este nível.' using errcode = '42501';
  end if;

  update public.roles
  set name = trim(p_name), description = coalesce(p_description, ''), permissions = coalesce(p_permissions, '{}')
  where id = p_id;
  return p_id;
exception
  when unique_violation then
    raise exception 'Já existe um nível com este nome.';
end;
$$;

create function public.delete_role(p_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  existing public.roles;
begin
  if not public.has_permission('roles') then
    raise exception 'Você não pode alterar níveis.' using errcode = '42501';
  end if;
  select * into existing from public.roles where id = p_id;
  if not found then
    raise exception 'Nível não encontrado.';
  end if;
  if existing.is_system or not (existing.permissions <@ public.current_permissions()) then
    raise exception 'Este nível não pode ser removido.' using errcode = '42501';
  end if;
  if exists (select 1 from public.profiles where role_id = p_id) then
    raise exception 'Há usuários neste nível. Troque o nível deles antes de remover.';
  end if;
  delete from public.roles where id = p_id;
end;
$$;

-- Nenhuma função fica disponível para visitantes
revoke all on function
  public.all_permissions(), public.current_permissions(), public.has_permission(text), public.can_upload(),
  public.can_manage_user(uuid), public.get_my_access(), public.update_user_access(uuid, uuid, text, text),
  public.create_invite(text, text, integer), public.revoke_invite(uuid),
  public.save_role(uuid, text, text, text[]), public.delete_role(uuid)
from public, anon;

grant execute on function
  public.all_permissions(), public.current_permissions(), public.has_permission(text), public.can_upload(),
  public.can_manage_user(uuid), public.get_my_access(), public.update_user_access(uuid, uuid, text, text),
  public.create_invite(text, text, integer), public.revoke_invite(uuid),
  public.save_role(uuid, text, text, text[]), public.delete_role(uuid)
to authenticated;

-- Leitura e edição direta -----------------------------------------------------

grant select on public.roles to authenticated;
create policy "Managers can read roles" on public.roles for select to authenticated
  using (public.has_permission('users') or public.has_permission('roles'));

grant select on public.profiles to authenticated;
create policy "Read own or managed profiles" on public.profiles for select to authenticated
  using (user_id = auth.uid() or public.has_permission('users'));

-- O próprio usuário edita só estes campos; nível, função e situação passam pelas regras acima.
grant update (full_name, phone, avatar_url) on public.profiles to authenticated;
create policy "Update own profile" on public.profiles for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

grant select (id, email, note, created_by, created_at, expires_at, used_at, used_by, revoked_at) on public.invites to authenticated;
create policy "Managers can read invites" on public.invites for select to authenticated
  using (public.has_permission('users'));

-- Contas novas nascem pendentes, sem acesso, mesmo se vierem de fora do convite.
create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (user_id) do nothing;
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.handle_user_email_change()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.profiles set email = coalesce(new.email, '') where user_id = new.id;
  return new;
end;
$$;
revoke all on function public.handle_user_email_change() from public, anon, authenticated;
create trigger on_auth_user_email_changed after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();

-- Contas existentes -----------------------------------------------------------

insert into public.profiles (user_id, email, status)
select id, coalesce(email, ''), 'pending' from auth.users
on conflict (user_id) do nothing;

do $$
begin
  update public.profiles
  set status = 'active',
      role_id = (select id from public.roles where is_master),
      approved_at = now()
  where lower(email) = 'gabrieldesouza100@gmail.com';
  if not found then
    raise exception 'A conta master não foi encontrada.';
  end if;
end $$;

-- Escrita no conteúdo passa a depender da permissão de cada seção -------------

do $$
declare
  item record;
begin
  for item in
    select * from (values
      ('hero_videos', 'hero'), ('about_section', 'about'), ('artists', 'artists'), ('releases', 'releases'),
      ('videos_gallery', 'videos'), ('news', 'news'), ('contact_info', 'contact'), ('social_links', 'contact')
    ) as map(table_name, permission)
  loop
    execute format('drop policy if exists "Admins can write" on public.%I', item.table_name);
    execute format(
      'create policy "Write with permission" on public.%I for all to authenticated using (public.has_permission(%L)) with check (public.has_permission(%L))',
      item.table_name, item.permission, item.permission
    );
  end loop;
end $$;

-- O texto da página Sobre é salvo com as configurações, mas pertence à seção Sobre.
drop policy if exists "Admins can write" on public.site_settings;
create policy "Write with permission" on public.site_settings for all to authenticated
  using (public.has_permission('settings') or (key = 'about_page' and public.has_permission('about')))
  with check (public.has_permission('settings') or (key = 'about_page' and public.has_permission('about')));
