import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Check, Copy, Crown, KeyRound, Link2, Loader2, Mail, MessageCircle, Plus, Save, Trash2, X } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { initialsOf, PERMISSION_GROUPS, useAccess } from '../../utils/access';
import { Field, inputClass, LoadingPanel, MessageBanner } from './components/PanelControls';
import type { PanelMessage } from './components/useOrderedList';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  is_master: boolean;
  is_system: boolean;
}

interface UserRow {
  user_id: string;
  email: string;
  full_name: string;
  job_title: string;
  avatar_url: string;
  status: 'pending' | 'active' | 'blocked';
  role_id: string | null;
  created_at: string;
}

interface InviteRow {
  id: string;
  email: string | null;
  note: string;
  created_at: string;
  expires_at: string;
  used_at: string | null;
  revoked_at: string | null;
}

interface PasswordRequest {
  id: string;
  user_id: string;
  created_at: string;
  expires_at: string;
}

type Tab = 'users' | 'invites' | 'passwords' | 'roles';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
const formatDate = (value: string) => dateFormatter.format(new Date(value));

const STATUS_LABELS = { pending: 'Pendente', active: 'Ativo', blocked: 'Bloqueado' };
const STATUS_CLASSES = {
  pending: 'bg-yellow-500/15 text-yellow-400',
  active: 'bg-green-500/15 text-green-400',
  blocked: 'bg-red-500/15 text-red-400',
};

const primaryButton = 'bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50';
const secondaryButton = 'bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50';
const dangerButton = 'p-2 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30';

function UserCard({ user, roles, myPermissions, myId, onChanged, onMessage }: {
  user: UserRow;
  roles: Role[];
  myPermissions: string[];
  myId: string;
  onChanged: () => Promise<void>;
  onMessage: (message: PanelMessage) => void;
}) {
  const [roleId, setRoleId] = useState(user.role_id ?? '');
  const [jobTitle, setJobTitle] = useState(user.job_title);
  const [busy, setBusy] = useState(false);

  const currentRole = roles.find((role) => role.id === user.role_id);
  const isSelf = user.user_id === myId;
  const isMasterUser = !!currentRole?.is_master;
  const isManageable = !isSelf && !isMasterUser && (currentRole?.permissions ?? []).every((permission) => myPermissions.includes(permission));
  const assignableRoles = roles.filter((role) => !role.is_master && role.permissions.every((permission) => myPermissions.includes(permission)));

  const applyAccess = async (status: UserRow['status'], successText: string) => {
    if (!supabase) return;
    if (status === 'active' && !roleId) {
      onMessage({ type: 'error', text: `Escolha o nível de ${user.full_name || user.email} antes de aprovar.` });
      return;
    }
    setBusy(true);
    const { error } = await supabase.rpc('update_user_access', { p_user: user.user_id, p_role: roleId || null, p_status: status, p_job_title: jobTitle.trim() });
    if (error) {
      onMessage({ type: 'error', text: error.message });
    } else {
      await onChanged();
      onMessage({ type: 'success', text: successText });
    }
    setBusy(false);
  };

  const handleRemove = async () => {
    if (!supabase) return;
    if (!window.confirm(`Remover a conta de ${user.full_name || user.email}? Esta ação não pode ser desfeita.`)) return;
    setBusy(true);
    const { data, error } = await supabase.functions.invoke('user-access', { body: { action: 'delete_user', user_id: user.user_id } });
    if (error || data?.error) {
      onMessage({ type: 'error', text: data?.error ?? 'Não foi possível remover o usuário.' });
    } else {
      await onChanged();
      onMessage({ type: 'success', text: 'Usuário removido.' });
    }
    setBusy(false);
  };

  return (
    <div className={`bg-[#0A0A0A] border rounded-2xl p-5 ${user.status === 'pending' ? 'border-yellow-500/30' : 'border-white/10'}`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#0EA8A0] to-[#C45C2F] flex items-center justify-center shrink-0">
          {user.avatar_url ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" /> : <span className="font-bold text-sm">{initialsOf(user.full_name, user.email)}</span>}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate flex items-center gap-2">
            {user.full_name || 'Sem nome'}
            {isSelf && <span className="text-xs font-normal text-white/50">(você)</span>}
          </p>
          <p className="text-sm text-white/50 truncate">{user.email}</p>
        </div>
        {isMasterUser ? (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0EA8A0]/15 text-[#0EA8A0] flex items-center gap-1 shrink-0">
            <Crown className="w-3 h-3" /> Master
          </span>
        ) : (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${STATUS_CLASSES[user.status]}`}>{STATUS_LABELS[user.status]}</span>
        )}
      </div>

      {isManageable ? (
        <div className="mt-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Nível de permissão">
              <select value={roleId} onChange={(event) => setRoleId(event.target.value)} className={`${inputClass} bg-[#0A0A0A]`}>
                <option value="">Escolha um nível</option>
                {assignableRoles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Função">
              <input type="text" value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} placeholder="Ex: Assessoria de imprensa" className={inputClass} />
            </Field>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {user.status === 'pending' && (
              <button type="button" disabled={busy} onClick={() => applyAccess('active', `${user.full_name || user.email} aprovado.`)} className={primaryButton}>
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Aprovar
              </button>
            )}
            {user.status === 'active' && (
              <>
                <button type="button" disabled={busy} onClick={() => applyAccess('active', 'Alterações salvas.')} className={primaryButton}>
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar
                </button>
                <button type="button" disabled={busy} onClick={() => applyAccess('blocked', 'Usuário bloqueado.')} className={secondaryButton}>Bloquear</button>
              </>
            )}
            {user.status === 'blocked' && (
              <button type="button" disabled={busy} onClick={() => applyAccess('active', 'Usuário desbloqueado.')} className={primaryButton}>Desbloquear</button>
            )}
            <button type="button" disabled={busy} onClick={handleRemove} aria-label={`Remover ${user.full_name || user.email}`} className={`${dangerButton} ml-auto`}>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-white/50">
          {[currentRole?.name, user.job_title].filter(Boolean).join(' · ')}
          {isSelf && ' — seus dados ficam em Meu perfil.'}
        </p>
      )}
    </div>
  );
}

function InvitesTab({ onMessage }: { onMessage: (message: PanelMessage) => void }) {
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [days, setDays] = useState(7);
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('invites')
      .select('id, email, note, created_at, expires_at, used_at, revoked_at')
      .order('created_at', { ascending: false });
    if (error) onMessage({ type: 'error', text: error.message });
    else setInvites(data ?? []);
  }, [onMessage]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setCopied(false);
    const { data, error } = await supabase.rpc('create_invite', { p_email: email, p_note: note, p_days: days });
    if (error) {
      onMessage({ type: 'error', text: error.message });
    } else {
      setLink(`${window.location.origin}/convite/${data.token}`);
      setEmail('');
      setNote('');
      await load();
    }
    setBusy(false);
  };

  const handleRevoke = async (id: string) => {
    if (!supabase || !window.confirm('Cancelar este convite? O link deixa de funcionar.')) return;
    const { error } = await supabase.rpc('revoke_invite', { p_invite: id });
    if (error) onMessage({ type: 'error', text: error.message });
    else await load();
  };

  const handleCopy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
  };

  const inviteText = link ? `Você foi convidado para o painel da Céu Music. Faça seu cadastro por este link: ${link}` : '';

  const statusOf = (invite: InviteRow) => {
    if (invite.used_at) return { label: 'Usado', className: 'bg-green-500/15 text-green-400' };
    if (invite.revoked_at) return { label: 'Cancelado', className: 'bg-white/10 text-white/50' };
    if (new Date(invite.expires_at) < new Date()) return { label: 'Expirado', className: 'bg-white/10 text-white/50' };
    return { label: 'Aberto', className: 'bg-yellow-500/15 text-yellow-400' };
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold">Novo convite</h2>
        <div className="grid sm:grid-cols-[2fr_2fr_1fr] gap-3">
          <Field label="E-mail (opcional)" hint="Se preencher, só este e-mail poderá usar o convite.">
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} />
          </Field>
          <Field label="Observação (opcional)" hint="Só para você identificar o convite.">
            <input type="text" value={note} onChange={(event) => setNote(event.target.value)} className={inputClass} />
          </Field>
          <Field label="Validade">
            <select value={days} onChange={(event) => setDays(Number(event.target.value))} className={`${inputClass} bg-[#0A0A0A]`}>
              <option value={1}>1 dia</option>
              <option value={7}>7 dias</option>
              <option value={30}>30 dias</option>
            </select>
          </Field>
        </div>
        <button type="submit" disabled={busy} className={primaryButton}>
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />} Gerar link de convite
        </button>

        {link && (
          <div className="p-4 rounded-xl border border-[#0EA8A0]/30 bg-[#0EA8A0]/5 space-y-3" role="status">
            <p className="text-sm font-semibold">Link criado. Envie agora: por segurança, ele não aparece de novo.</p>
            <p className="text-xs break-all text-white/70 font-mono">{link}</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleCopy} className={secondaryButton}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copiado' : 'Copiar'}
              </button>
              <a href={`https://wa.me/?text=${encodeURIComponent(inviteText)}`} target="_blank" rel="noopener noreferrer" className={secondaryButton}>
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <a href={`mailto:?subject=${encodeURIComponent('Convite para o painel da Céu Music')}&body=${encodeURIComponent(inviteText)}`} className={secondaryButton}>
                <Mail className="w-4 h-4" /> E-mail
              </a>
            </div>
          </div>
        )}
      </form>

      <div className="space-y-2">
        {invites.length === 0 && <p className="text-white/50 text-center py-8">Nenhum convite criado ainda.</p>}
        {invites.map((invite) => {
          const status = statusOf(invite);
          return (
            <div key={invite.id} className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4 flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{invite.email || invite.note || 'Convite aberto'}</p>
                <p className="text-xs text-white/50">
                  Criado em {formatDate(invite.created_at)} · vale até {formatDate(invite.expires_at)}
                  {invite.email && invite.note && ` · ${invite.note}`}
                </p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${status.className}`}>{status.label}</span>
              {status.label === 'Aberto' && (
                <button type="button" onClick={() => handleRevoke(invite.id)} className="text-xs text-white/50 hover:text-red-400 transition-colors shrink-0">
                  Cancelar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PasswordRequestsTab({ requests, users, roles, myPermissions, myId, onChanged, onMessage }: {
  requests: PasswordRequest[];
  users: UserRow[];
  roles: Role[];
  myPermissions: string[];
  myId: string;
  onChanged: () => Promise<void>;
  onMessage: (message: PanelMessage) => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);

  const resolve = async (request: PasswordRequest, approve: boolean, label: string) => {
    if (!supabase) return;
    const question = approve
      ? `Aprovar a troca de senha de ${label}?\n\nConfirme antes com a pessoa, por telefone ou WhatsApp, se foi ela quem pediu. Qualquer um que saiba o e-mail pode fazer este pedido.`
      : `Recusar o pedido de ${label}?`;
    if (!window.confirm(question)) return;
    setBusyId(request.id);
    const { error } = await supabase.rpc(approve ? 'approve_password_request' : 'reject_password_request', { p_id: request.id });
    if (error) {
      onMessage({ type: 'error', text: error.message });
    } else {
      await onChanged();
      onMessage({ type: 'success', text: approve ? `Senha de ${label} alterada. As sessões abertas foram encerradas.` : 'Pedido recusado.' });
    }
    setBusyId(null);
  };

  if (requests.length === 0) {
    return <p className="text-white/50 text-center py-8">Nenhum pedido de troca de senha.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 text-sm text-yellow-200">
        Qualquer pessoa que saiba o e-mail pode fazer este pedido. Antes de aprovar, confirme com o dono da conta por telefone ou WhatsApp.
      </div>
      {requests.map((request) => {
        const user = users.find((item) => item.user_id === request.user_id);
        const label = user?.full_name || user?.email || 'esta pessoa';
        const role = roles.find((item) => item.id === user?.role_id);
        const manageable = request.user_id !== myId && !role?.is_master && (role?.permissions ?? []).every((permission) => myPermissions.includes(permission));
        const expired = new Date(request.expires_at) < new Date();
        return (
          <div key={request.id} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 flex flex-wrap items-center gap-4">
            <KeyRound className="w-5 h-5 text-[#0EA8A0] shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate">{label}</p>
              <p className="text-sm text-white/50 truncate">{user?.email}</p>
              <p className="text-xs text-white/50 mt-1">Pedido em {formatDate(request.created_at)} · {expired ? 'expirado' : `vale até ${formatDate(request.expires_at)}`}</p>
            </div>
            {manageable ? (
              <div className="flex items-center gap-2">
                {!expired && (
                  <button type="button" disabled={busyId === request.id} onClick={() => resolve(request, true, label)} className={primaryButton}>
                    {busyId === request.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Aprovar troca
                  </button>
                )}
                <button type="button" disabled={busyId === request.id} onClick={() => resolve(request, false, label)} className={secondaryButton}>
                  <X className="w-4 h-4" /> Recusar
                </button>
              </div>
            ) : (
              <p className="text-sm text-white/50">{request.user_id === myId ? 'Outro administrador precisa analisar.' : 'Sem permissão para analisar.'}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RoleCard({ role, userCount, myPermissions, isMyRole, onChanged, onMessage, onCancelNew }: {
  role: Role;
  userCount: number;
  myPermissions: string[];
  isMyRole: boolean;
  onChanged: () => Promise<void>;
  onMessage: (message: PanelMessage) => void;
  onCancelNew?: () => void;
}) {
  const [name, setName] = useState(role.name);
  const [description, setDescription] = useState(role.description);
  const [permissions, setPermissions] = useState(role.permissions);
  const [busy, setBusy] = useState(false);

  const isNew = !role.id;
  const hasForeignPermission = role.permissions.some((permission) => !myPermissions.includes(permission));
  const locked = role.is_master || isMyRole || hasForeignPermission;

  const toggle = (key: string) => {
    setPermissions((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  };

  const handleSave = async () => {
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.rpc('save_role', { p_id: role.id || null, p_name: name, p_description: description, p_permissions: permissions });
    if (error) {
      onMessage({ type: 'error', text: error.message });
    } else {
      await onChanged();
      onMessage({ type: 'success', text: 'Nível salvo.' });
      onCancelNew?.();
    }
    setBusy(false);
  };

  const handleDelete = async () => {
    if (!supabase || !window.confirm(`Remover o nível "${role.name}"?`)) return;
    setBusy(true);
    const { error } = await supabase.rpc('delete_role', { p_id: role.id });
    if (error) {
      onMessage({ type: 'error', text: error.message });
    } else {
      await onChanged();
      onMessage({ type: 'success', text: 'Nível removido.' });
    }
    setBusy(false);
  };

  const lockReason = role.is_master
    ? 'O nível Master tem todas as permissões e não pode ser alterado.'
    : isMyRole
      ? 'Este é o seu nível. Outra pessoa com permissão precisa alterá-lo.'
      : hasForeignPermission
        ? 'Este nível tem permissões que você não possui.'
        : null;

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 grid sm:grid-cols-2 gap-3">
          <Field label="Nome do nível">
            <input type="text" value={name} disabled={locked} onChange={(event) => setName(event.target.value)} className={`${inputClass} disabled:opacity-60`} />
          </Field>
          <Field label="Descrição">
            <input type="text" value={description} disabled={locked} onChange={(event) => setDescription(event.target.value)} className={`${inputClass} disabled:opacity-60`} />
          </Field>
        </div>
        {!isNew && <span className="text-xs text-white/50 whitespace-nowrap pt-1">{userCount} {userCount === 1 ? 'usuário' : 'usuários'}</span>}
      </div>

      {lockReason && <p className="text-sm text-white/50">{lockReason}</p>}

      {!role.is_master && (
        <div className="grid sm:grid-cols-2 gap-6">
          {PERMISSION_GROUPS.map((group) => (
            <fieldset key={group.label}>
              <legend className="text-sm font-semibold mb-2">{group.label}</legend>
              <div className="space-y-2">
                {group.items.map((item) => {
                  const unavailable = !myPermissions.includes(item.key);
                  return (
                    <label key={item.key} className={`flex items-center gap-2 text-sm ${locked || unavailable ? 'text-white/40' : 'text-white/80 cursor-pointer'}`}>
                      <input type="checkbox" checked={permissions.includes(item.key)} disabled={locked || unavailable} onChange={() => toggle(item.key)} className="w-4 h-4 accent-[#0EA8A0]" />
                      {item.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      )}

      {!locked && (
        <div className="flex items-center gap-2">
          <button type="button" disabled={busy} onClick={handleSave} className={primaryButton}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar nível
          </button>
          {isNew && <button type="button" onClick={onCancelNew} className={secondaryButton}>Cancelar</button>}
          {!isNew && !role.is_system && (
            <button type="button" disabled={busy} onClick={handleDelete} aria-label={`Remover o nível ${role.name}`} className={`${dangerButton} ml-auto`}>
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function UsersPage() {
  const { access, can } = useAccess();
  const tabs: { key: Tab; label: string; visible: boolean }[] = [
    { key: 'users', label: 'Usuários', visible: can('users') },
    { key: 'invites', label: 'Convites', visible: can('users') },
    { key: 'passwords', label: 'Trocas de senha', visible: can('users') },
    { key: 'roles', label: 'Níveis de permissão', visible: can('roles') },
  ];
  const visibleTabs = tabs.filter((tab) => tab.visible);

  const [tab, setTab] = useState<Tab>(visibleTabs[0]?.key ?? 'users');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [passwordRequests, setPasswordRequests] = useState<PasswordRequest[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<PanelMessage | null>(null);
  const [creatingRole, setCreatingRole] = useState(false);

  const canSeeUsers = can('users');

  const load = useCallback(async () => {
    if (!supabase) return;
    const [rolesResult, usersResult, requestsResult] = await Promise.all([
      supabase.from('roles').select('*').order('created_at', { ascending: true }),
      canSeeUsers ? supabase.from('profiles').select('*').order('created_at', { ascending: false }) : Promise.resolve({ data: [], error: null }),
      canSeeUsers
        ? supabase.from('password_requests').select('id, user_id, created_at, expires_at').eq('status', 'open').order('created_at', { ascending: false })
        : Promise.resolve({ data: [], error: null }),
    ]);
    if (rolesResult.error || usersResult.error || requestsResult.error) {
      setMessage({ type: 'error', text: `Não foi possível carregar: ${(rolesResult.error ?? usersResult.error ?? requestsResult.error)?.message}` });
    } else {
      setRoles(rolesResult.data ?? []);
      setUsers((usersResult.data ?? []) as UserRow[]);
      setPasswordRequests((requestsResult.data ?? []) as PasswordRequest[]);
    }
    setLoading(false);
  }, [canSeeUsers]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingPanel />;

  const pendingUsers = users.filter((user) => user.status === 'pending');
  const otherUsers = users.filter((user) => user.status !== 'pending');
  const myRoleId = roles.find((role) => role.name === access.role_name)?.id;

  const userCard = (user: UserRow) => (
    <UserCard key={`${user.user_id}-${user.role_id}-${user.status}`} user={user} roles={roles} myPermissions={access.permissions} myId={access.user_id} onChanged={load} onMessage={setMessage} />
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Usuários</h1>
        <p className="text-white/50 mt-1">Convide pessoas, aprove cadastros e defina o que cada uma pode fazer.</p>
      </div>

      <div role="tablist" aria-label="Seções de usuários" className="flex flex-wrap gap-1 border-b border-white/10">
        {visibleTabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => {
              setTab(key);
              setMessage(null);
            }}
            className={`-mb-px px-4 py-2.5 text-sm border-b-2 transition-colors flex items-center gap-2 ${tab === key ? 'border-[#0EA8A0] text-white font-medium' : 'border-transparent text-white/60 hover:text-white'}`}
          >
            {label}
            {key === 'users' && pendingUsers.length > 0 && (
              <span className="text-[11px] font-bold bg-yellow-500 text-black rounded-full px-1.5 min-w-[1.25rem] text-center">{pendingUsers.length}</span>
            )}
            {key === 'passwords' && passwordRequests.length > 0 && (
              <span className="text-[11px] font-bold bg-yellow-500 text-black rounded-full px-1.5 min-w-[1.25rem] text-center">{passwordRequests.length}</span>
            )}
          </button>
        ))}
      </div>

      <MessageBanner message={message} />

      {tab === 'users' && (
        <div className="space-y-6">
          {pendingUsers.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-bold">Aguardando aprovação</h2>
              {pendingUsers.map(userCard)}
            </section>
          )}
          <section className="space-y-3">
            {pendingUsers.length > 0 && <h2 className="text-lg font-bold">Equipe</h2>}
            {otherUsers.map(userCard)}
          </section>
        </div>
      )}

      {tab === 'invites' && <InvitesTab onMessage={setMessage} />}

      {tab === 'passwords' && (
        <PasswordRequestsTab requests={passwordRequests} users={users} roles={roles} myPermissions={access.permissions} myId={access.user_id} onChanged={load} onMessage={setMessage} />
      )}

      {tab === 'roles' && (
        <div className="space-y-4">
          {roles.map((role) => (
            <RoleCard
              key={`${role.id}-${role.permissions.join()}-${role.name}`}
              role={role}
              userCount={users.filter((user) => user.role_id === role.id).length}
              myPermissions={access.permissions}
              isMyRole={role.id === myRoleId}
              onChanged={load}
              onMessage={setMessage}
            />
          ))}
          {creatingRole ? (
            <RoleCard
              role={{ id: '', name: '', description: '', permissions: [], is_master: false, is_system: false }}
              userCount={0}
              myPermissions={access.permissions}
              isMyRole={false}
              onChanged={load}
              onMessage={setMessage}
              onCancelNew={() => setCreatingRole(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setCreatingRole(true)}
              className="w-full py-4 border-2 border-dashed border-white/10 hover:border-[#0EA8A0]/30 hover:bg-[#0EA8A0]/5 rounded-2xl flex items-center justify-center gap-2 text-white/50 hover:text-[#0EA8A0] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Novo nível
            </button>
          )}
        </div>
      )}
    </div>
  );
}
