-- Sincronizada a partir do banco de produção: aplicada em 2026-11-10 fora deste repositório.
alter table public.festival_registrations enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'festival_registrations'
      and policyname = 'Festival team can read registrations'
  ) then
    create policy "Festival team can read registrations"
      on public.festival_registrations
      for select
      to authenticated
      using (public.has_permission('festival'));
  end if;
end
$$;
