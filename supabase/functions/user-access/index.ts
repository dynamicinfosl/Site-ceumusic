import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import bcrypt from "https://esm.sh/bcryptjs@2.4.3";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
const admin = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '', {
  auth: { persistSession: false, autoRefreshToken: false },
});

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// O painel lê o motivo em "error"; por isso as respostas esperadas usam status 200.
const reply = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN = /^[a-f0-9]{64}$/;
const INVALID_INVITE = 'Este convite não é válido ou já foi usado. Peça um novo link.';

async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function findOpenInvite(token: unknown) {
  if (typeof token !== 'string' || !TOKEN.test(token)) return null;
  const { data } = await admin
    .from('invites')
    .select('id, email, created_by')
    .eq('token_hash', await hashToken(token))
    .is('used_at', null)
    .is('revoked_at', null)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();
  return data;
}

async function acceptInvite(body: Record<string, unknown>) {
  const fullName = String(body.full_name ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');

  if (!fullName) return reply({ error: 'Informe seu nome.' });
  if (!EMAIL.test(email)) return reply({ error: 'Informe um e-mail válido.' });
  if (password.length < 8) return reply({ error: 'A senha precisa ter pelo menos 8 caracteres.' });

  const invite = await findOpenInvite(body.token);
  if (!invite) return reply({ error: INVALID_INVITE });
  if (invite.email && invite.email !== email) {
    return reply({ error: 'Use o e-mail para o qual este convite foi criado.' });
  }

  // Reserva o convite antes de criar a conta, para ele não ser usado duas vezes.
  const usedAt = new Date().toISOString();
  const { data: claimed } = await admin
    .from('invites')
    .update({ used_at: usedAt })
    .eq('id', invite.id)
    .is('used_at', null)
    .is('revoked_at', null)
    .select('id');
  if (!claimed?.length) return reply({ error: INVALID_INVITE });

  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error || !created.user) {
    await admin.from('invites').update({ used_at: null }).eq('id', invite.id);
    const exists = error?.message?.toLowerCase().includes('already');
    return reply({ error: exists ? 'Já existe uma conta com este e-mail.' : 'Não foi possível concluir o cadastro. Tente novamente.' });
  }

  // A conta nasce pendente, sem nível: só um administrador libera o acesso.
  await admin.from('profiles').update({ full_name: fullName, invited_by: invite.created_by }).eq('user_id', created.user.id);
  await admin.from('invites').update({ used_by: created.user.id }).eq('id', invite.id);

  return reply({ ok: true });
}

// A resposta é sempre a mesma, para não revelar quais e-mails têm conta.
// O Master fica de fora: senão, um admin poderia pedir a troca da senha dele e aprovar sozinho.
async function requestPasswordChange(body: Record<string, unknown>) {
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');

  if (!EMAIL.test(email)) return reply({ error: 'Informe um e-mail válido.' });
  if (password.length < 8) return reply({ error: 'A senha precisa ter pelo menos 8 caracteres.' });

  // O hash vem antes da busca para o tempo de resposta ser igual com ou sem conta.
  const passwordHash = await bcrypt.hash(password, 10);

  const { data: profile, error: lookupError } = await admin
    .from('profiles')
    .select('user_id, status, roles(is_master)')
    .eq('email', email)
    .maybeSingle();
  if (lookupError) throw lookupError;

  const role = profile?.roles as { is_master?: boolean } | null | undefined;
  if (!profile || profile.status === 'blocked' || role?.is_master) return reply({ ok: true });

  const { error: clearError } = await admin.from('password_requests').delete().eq('user_id', profile.user_id).eq('status', 'open');
  if (clearError) throw clearError;
  const { error: insertError } = await admin.from('password_requests').insert({ user_id: profile.user_id, password_hash: passwordHash });
  if (insertError) throw insertError;

  return reply({ ok: true });
}

async function deleteUser(req: Request, body: Record<string, unknown>) {
  const authorization = req.headers.get('Authorization');
  const target = String(body.user_id ?? '');
  if (!authorization || !target) return reply({ error: 'Não autorizado.' });

  const caller = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false },
  });
  const { data: allowed, error: checkError } = await caller.rpc('can_manage_user', { p_user: target });
  if (checkError || allowed !== true) return reply({ error: 'Você não pode remover este usuário.' });

  const { error } = await admin.auth.admin.deleteUser(target);
  if (error) return reply({ error: 'Não foi possível remover o usuário.' });
  return reply({ ok: true });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return reply({ error: 'Método não permitido.' }, 405);

  try {
    const body = await req.json();
    switch (body.action) {
      case 'check_invite': {
        const invite = await findOpenInvite(body.token);
        return reply(invite ? { valid: true, email: invite.email } : { valid: false, error: INVALID_INVITE });
      }
      case 'accept_invite':
        return await acceptInvite(body);
      case 'request_password_change':
        return await requestPasswordChange(body);
      case 'delete_user':
        return await deleteUser(req, body);
      default:
        return reply({ error: 'Ação desconhecida.' }, 400);
    }
  } catch (error) {
    console.error(error);
    return reply({ error: 'Erro inesperado. Tente novamente.' }, 500);
  }
});
