-- Sincronizada a partir do banco de produção: aplicada em 2026-11-10 fora deste repositório.
create table public.festival_video_evaluations (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null unique references public.festival_registrations (id) on delete cascade,
  evaluator_id uuid references auth.users (id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'in_review', 'approved', 'rejected')),
  rejection_reason text,
  analysis_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.festival_audit_log (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid references public.festival_registrations (id) on delete cascade,
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index festival_audit_log_registration on public.festival_audit_log (registration_id, created_at desc);
create index festival_video_evaluations_status on public.festival_video_evaluations (status);

alter table public.festival_video_evaluations enable row level security;
alter table public.festival_audit_log enable row level security;

create policy "Festival team can read video evaluations"
  on public.festival_video_evaluations for select to authenticated
  using (public.has_permission('festival'));

create policy "Festival team can read audit log"
  on public.festival_audit_log for select to authenticated
  using (public.has_permission('festival'));

revoke all on public.festival_video_evaluations, public.festival_audit_log from anon, authenticated;
grant select on public.festival_video_evaluations, public.festival_audit_log to authenticated;

create view public.festival_video_queue with (security_invoker = true) as
select
  r.id,
  r.number,
  r.full_name,
  r.artistic_name,
  r.song_title,
  r.city,
  r.state,
  r.email,
  r.phone,
  r.created_at,
  r.status as registration_status,
  r.video_duration,
  r.video_embed_url,
  r.video_uploaded_at,
  coalesce(e.status, 'pending') as evaluation_status,
  e.rejection_reason,
  e.analysis_notes,
  e.evaluator_id,
  e.updated_at as evaluated_at
from public.festival_registrations r
left join public.festival_video_evaluations e on e.registration_id = r.id
where r.video_status = 'ready' and r.status <> 'canceled';

revoke all on public.festival_video_queue from anon, authenticated;
grant select on public.festival_video_queue to authenticated;

create function public.festival_evaluate_video(
  p_registration_id uuid,
  p_actor_id uuid,
  p_actor_email text,
  p_action text,
  p_reason text default null,
  p_notes text default null
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_from text;
  v_to text;
begin
  if p_action not in ('analyze', 'approve', 'reject', 'undo', 'save_notes') then
    return jsonb_build_object('error', 'Ação inválida.');
  end if;

  if p_action in ('analyze', 'approve', 'reject') and not exists (
    select 1 from public.festival_registrations
    where id = p_registration_id and video_status = 'ready' and status <> 'canceled'
  ) then
    return jsonb_build_object('error', 'Este vídeo não está disponível para avaliação.');
  end if;

  insert into public.festival_video_evaluations (registration_id)
  values (p_registration_id)
  on conflict (registration_id) do nothing;

  select status into v_from
  from public.festival_video_evaluations
  where registration_id = p_registration_id
  for update;

  v_to := case
    when p_action = 'analyze' and v_from = 'pending' then 'in_review'
    when p_action = 'approve' and v_from in ('pending', 'in_review') then 'approved'
    when p_action = 'reject' and v_from in ('pending', 'in_review') then 'rejected'
    when p_action = 'undo' and v_from in ('approved', 'rejected') then 'pending'
    else v_from
  end;

  if v_to = v_from and p_action <> 'save_notes' then
    return jsonb_build_object('ok', true, 'changed', false, 'status', v_from);
  end if;

  update public.festival_video_evaluations
  set status = v_to,
      evaluator_id = p_actor_id,
      rejection_reason = case
        when p_action = 'reject' then nullif(btrim(p_reason), '')
        when p_action = 'undo' then null
        else rejection_reason
      end,
      analysis_notes = coalesce(p_notes, analysis_notes),
      updated_at = now()
  where registration_id = p_registration_id;

  insert into public.festival_audit_log (registration_id, actor_id, action, details)
  values (
    p_registration_id,
    p_actor_id,
    'video_' || p_action,
    jsonb_strip_nulls(jsonb_build_object(
      'from', v_from,
      'to', v_to,
      'actor_email', p_actor_email,
      'reason', nullif(btrim(p_reason), ''),
      'notes', p_notes
    ))
  );

  return jsonb_build_object('ok', true, 'changed', true, 'status', v_to);
end;
$$;

revoke all on function public.festival_evaluate_video(uuid, uuid, text, text, text, text) from public, anon, authenticated;
grant execute on function public.festival_evaluate_video(uuid, uuid, text, text, text, text) to service_role;
