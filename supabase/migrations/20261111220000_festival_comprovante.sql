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
    and r.token_hash = encode(sha256(convert_to(p_token, 'UTF8')), 'hex')
    and r.status = 'paid';
$$;
revoke all on function public.festival_receipt(text) from public;
grant execute on function public.festival_receipt(text) to anon, authenticated;
