-- Sincronizada a partir do banco de produção: aplicada em 2026-11-10 fora deste repositório.
-- Idempotência da inscrição e do Pix.
--
-- request_id: identificador que o formulário gera a cada envio. Se a conexão cair
-- depois que o servidor criou a inscrição, o reenvio do mesmo formulário devolve a
-- inscrição já criada em vez de abrir outra.
--
-- pix_renewing_until: trava curta enquanto um Pix vencido é trocado por outro, para
-- que duas consultas ao mesmo tempo (duas abas, rede lenta) não gerem dois Pix.
--
-- previous_pix_id: o Pix substituído. A conferência do pagamento olha os dois, para
-- não perder um pagamento feito no código antigo bem na hora da troca.

alter table public.festival_registrations
  add column if not exists request_id uuid unique,
  add column if not exists pix_renewing_until timestamptz,
  add column if not exists previous_pix_id text;
