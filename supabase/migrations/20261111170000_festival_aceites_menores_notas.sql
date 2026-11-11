-- Festival de Verão: regulamento versionado, aceites com prova, menores, coautores,
-- notas por jurado, entregas do Pacote e registro dos e-mails enviados.

-- 1) Versões publicadas do regulamento e do aviso de privacidade.
-- Cada vez que o painel salva um texto diferente, nasce uma nova versão. Quem se inscreveu
-- fica ligado à versão que aceitou, que continua acessível por link permanente.
create table public.festival_documents (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('regulation', 'privacy')),
  version integer not null,
  content text not null,
  sha256 text not null,
  published_at timestamptz not null default now(),
  unique (kind, version)
);
alter table public.festival_documents enable row level security;
create policy "Anyone can read festival documents" on public.festival_documents for select using (true);
revoke all on public.festival_documents from anon, authenticated;
grant select on public.festival_documents to anon, authenticated;

create function public.festival_publish_documents()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_kind text;
  v_text text;
  v_hash text;
  v_last text;
begin
  if new.key <> 'festival' then
    return new;
  end if;
  foreach v_kind in array array['regulation', 'privacy'] loop
    v_text := btrim(coalesce(new.value ->> v_kind, ''));
    continue when v_text = '';
    v_hash := encode(sha256(convert_to(v_text, 'UTF8')), 'hex');
    select sha256 into v_last from public.festival_documents where kind = v_kind order by version desc limit 1;
    continue when v_last = v_hash;
    insert into public.festival_documents (kind, version, content, sha256)
    values (
      v_kind,
      coalesce((select max(version) from public.festival_documents where kind = v_kind), 0) + 1,
      v_text,
      v_hash
    );
  end loop;
  return new;
end;
$$;
revoke all on function public.festival_publish_documents() from public, anon, authenticated;

create trigger festival_publish_documents
  after insert or update of value on public.site_settings
  for each row execute function public.festival_publish_documents();

-- Publica o que já estiver salvo
update public.site_settings set value = value where key = 'festival';

-- 2) Novos dados da inscrição
alter table public.festival_registrations
  add column if not exists birth_date date,
  add column if not exists coauthors text not null default '',
  add column if not exists guardian_name text,
  add column if not exists guardian_cpf text,
  add column if not exists guardian_email text,
  add column if not exists guardian_phone text,
  add column if not exists guardian_relation text,
  add column if not exists guardian_token_hash text unique,
  add column if not exists guardian_confirmed_at timestamptz,
  add column if not exists regulation_id uuid references public.festival_documents (id),
  add column if not exists privacy_id uuid references public.festival_documents (id);

create index if not exists festival_registrations_regulation_idx on public.festival_registrations (regulation_id);
create index if not exists festival_registrations_privacy_idx on public.festival_registrations (privacy_id);

grant select (
  birth_date, coauthors, guardian_name, guardian_cpf, guardian_email, guardian_phone, guardian_relation,
  guardian_confirmed_at, regulation_id, privacy_id
) on public.festival_registrations to authenticated;

-- 3) Registro de cada aceite (só inclusão: uma revogação é uma nova linha com granted = false)
create table public.festival_consents (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.festival_registrations (id) on delete cascade,
  consent text not null check (consent in ('terms', 'authorship', 'internal_use', 'publicity', 'marketing', 'guardian_terms')),
  granted boolean not null,
  actor text not null check (actor in ('participant', 'guardian')),
  regulation_id uuid references public.festival_documents (id),
  privacy_id uuid references public.festival_documents (id),
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index festival_consents_registration on public.festival_consents (registration_id, created_at);
create index festival_consents_regulation_idx on public.festival_consents (regulation_id);
create index festival_consents_privacy_idx on public.festival_consents (privacy_id);
alter table public.festival_consents enable row level security;
create policy "Festival team can read consents" on public.festival_consents for select to authenticated
  using (public.has_permission('festival'));
revoke all on public.festival_consents from anon, authenticated;
grant select on public.festival_consents to authenticated;

-- 4) Ficha de avaliação: uma por jurado e por inscrição
create table public.festival_scores (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.festival_registrations (id) on delete cascade,
  -- Se a conta do jurado for apagada, a ficha fica (com o e-mail) como prova da avaliação
  judge_id uuid default auth.uid() references auth.users (id) on delete set null,
  judge_email text,
  interpretation smallint not null check (interpretation between 0 and 25),
  composition smallint not null check (composition between 0 and 25),
  technique smallint not null check (technique between 0 and 20),
  identity smallint not null check (identity between 0 and 15),
  coherence smallint not null check (coherence between 0 and 15),
  total smallint generated always as (interpretation + composition + technique + identity + coherence) stored,
  strengths text not null default '' check (char_length(strengths) <= 2000),
  improvements text not null default '' check (char_length(improvements) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (registration_id, judge_id)
);
create index festival_scores_judge_idx on public.festival_scores (judge_id);

-- O jurado é sempre quem está logado; o cliente não escolhe em nome de quem avalia.
create function public.festival_scores_stamp()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.judge_id := auth.uid();
  new.judge_email := auth.jwt() ->> 'email';
  new.updated_at := now();
  if tg_op = 'UPDATE' then
    new.registration_id := old.registration_id;
    new.created_at := old.created_at;
  end if;
  return new;
end;
$$;
create trigger festival_scores_stamp before insert or update on public.festival_scores
  for each row execute function public.festival_scores_stamp();

alter table public.festival_scores enable row level security;
create policy "Festival team can read scores" on public.festival_scores for select to authenticated
  using (public.has_permission('festival'));
create policy "Judges score ready videos" on public.festival_scores for insert to authenticated
  with check (
    judge_id = (select auth.uid())
    and public.has_permission('festival')
    and exists (
      select 1 from public.festival_registrations r
      where r.id = festival_scores.registration_id and r.status = 'paid' and r.video_status = 'ready'
    )
  );
create policy "Judges update own scores" on public.festival_scores for update to authenticated
  using (judge_id = (select auth.uid()) and public.has_permission('festival'))
  with check (judge_id = (select auth.uid()) and public.has_permission('festival'));
revoke all on public.festival_scores from anon, authenticated;
grant select, insert, update on public.festival_scores to authenticated;

-- Média por inscrição, para o ranking do painel
create view public.festival_score_summary with (security_invoker = true) as
select
  registration_id,
  count(*)::integer as judges,
  round(avg(total), 2) as total,
  round(avg(interpretation), 2) as interpretation,
  round(avg(composition), 2) as composition,
  round(avg(technique), 2) as technique,
  round(avg(identity), 2) as identity,
  round(avg(coherence), 2) as coherence
from public.festival_scores
group by registration_id;
revoke all on public.festival_score_summary from anon, authenticated;
grant select on public.festival_score_summary to authenticated;

-- 5) Entregas do Pacote que não podem ficar públicas (link do grupo, materiais).
-- site_settings é público; isto aqui só a equipe e a função do festival leem.
create table public.festival_package (
  id smallint primary key default 1 check (id = 1),
  group_url text not null default '',
  materials jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);
insert into public.festival_package (id) values (1) on conflict do nothing;
alter table public.festival_package enable row level security;
create policy "Festival team manages package" on public.festival_package for all to authenticated
  using (public.has_permission('festival'))
  with check (public.has_permission('festival'));
revoke all on public.festival_package from anon, authenticated;
grant select, update on public.festival_package to authenticated;

-- 6) E-mails já enviados: cada aviso sai uma única vez por inscrição
create table public.festival_email_log (
  registration_id uuid not null references public.festival_registrations (id) on delete cascade,
  kind text not null,
  sent_at timestamptz not null default now(),
  primary key (registration_id, kind)
);
alter table public.festival_email_log enable row level security;
create policy "Festival team can read email log" on public.festival_email_log for select to authenticated
  using (public.has_permission('festival'));
revoke all on public.festival_email_log from anon, authenticated;
grant select on public.festival_email_log to authenticated;
