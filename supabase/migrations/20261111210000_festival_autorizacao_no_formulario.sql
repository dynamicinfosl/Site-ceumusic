-- Enquanto o envio de e-mails (Resend) não estiver configurado, a autorização do responsável
-- legal vale pelo aceite feito no próprio formulário (registrado em festival_consents com IP e
-- data). Assim a inscrição de menores não trava esperando um e-mail que não sai.
-- Quando o Resend estiver pronto, basta remover este gatilho para voltar à confirmação por e-mail:
--   drop trigger festival_guardian_in_form on public.festival_registrations;
create function public.festival_guardian_in_form()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.guardian_name is not null and new.guardian_confirmed_at is null then
    new.guardian_confirmed_at := now();
  end if;
  return new;
end;
$$;
revoke all on function public.festival_guardian_in_form() from public, anon, authenticated;

create trigger festival_guardian_in_form
  before insert on public.festival_registrations
  for each row execute function public.festival_guardian_in_form();
