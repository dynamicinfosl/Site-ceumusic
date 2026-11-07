import { useState, type FormEvent } from 'react';
import { Loader2, Save } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { useAccess } from '../../utils/access';
import MediaUpload from './components/MediaUpload';
import { Field, inputClass, MessageBanner } from './components/PanelControls';
import type { PanelMessage } from './components/useOrderedList';

const MIN_PASSWORD = 8;

export default function ProfilePage() {
  const { access, reload } = useAccess();
  const [fullName, setFullName] = useState(access.full_name);
  const [phone, setPhone] = useState(access.phone);
  const [avatarUrl, setAvatarUrl] = useState(access.avatar_url);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<PanelMessage | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<PanelMessage | null>(null);

  const handleSaveProfile = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    if (!fullName.trim()) {
      setProfileMessage({ type: 'error', text: 'Informe seu nome.' });
      return;
    }
    setSavingProfile(true);
    setProfileMessage(null);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim(), phone: phone.trim(), avatar_url: avatarUrl })
      .eq('user_id', access.user_id);
    if (error) {
      setProfileMessage({ type: 'error', text: `Não foi possível salvar: ${error.message}` });
    } else {
      await reload();
      setProfileMessage({ type: 'success', text: 'Perfil salvo.' });
    }
    setSavingProfile(false);
  };

  const handleChangePassword = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    if (newPassword.length < MIN_PASSWORD) {
      setPasswordMessage({ type: 'error', text: `A nova senha precisa ter pelo menos ${MIN_PASSWORD} caracteres.` });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'A confirmação não é igual à nova senha.' });
      return;
    }
    setSavingPassword(true);
    setPasswordMessage(null);

    // Confirma a senha atual antes de trocar, caso a sessão tenha ficado aberta em outro lugar.
    const { error: currentError } = await supabase.auth.signInWithPassword({ email: access.email, password: currentPassword });
    if (currentError) {
      setPasswordMessage({ type: 'error', text: 'A senha atual está incorreta.' });
      setSavingPassword(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordMessage({ type: 'error', text: `Não foi possível trocar a senha: ${error.message}` });
    } else {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMessage({ type: 'success', text: 'Senha alterada.' });
    }
    setSavingPassword(false);
  };

  const buttonClass = 'bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-black px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50';
  const cardClass = 'bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4';

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Meu perfil</h1>
        <p className="text-white/50 mt-1">Seus dados e sua senha de acesso ao painel.</p>
      </div>

      <form onSubmit={handleSaveProfile} className={cardClass}>
        <h2 className="text-xl font-bold">Dados pessoais</h2>
        <MessageBanner message={profileMessage} />
        <div className="grid sm:grid-cols-[10rem_minmax(0,1fr)] gap-6">
          <MediaUpload onUploadComplete={setAvatarUrl} currentUrl={avatarUrl} type="image" path="avatars" label="Foto" />
          <div className="space-y-4">
            <Field label="Nome">
              <input type="text" required autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} className={inputClass} />
            </Field>
            <Field label="Telefone">
              <input type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className={inputClass} />
            </Field>
          </div>
        </div>
        <button type="submit" disabled={savingProfile} className={buttonClass}>
          {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar perfil
        </button>
      </form>

      <section className={cardClass}>
        <h2 className="text-xl font-bold">Acesso</h2>
        <p className="text-sm text-white/50">Estes dados são definidos por um administrador.</p>
        <dl className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="text-white/50">E-mail</dt>
            <dd className="mt-1 break-all">{access.email}</dd>
          </div>
          <div>
            <dt className="text-white/50">Nível</dt>
            <dd className="mt-1">{access.role_name ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-white/50">Função</dt>
            <dd className="mt-1">{access.job_title || '—'}</dd>
          </div>
        </dl>
      </section>

      <form onSubmit={handleChangePassword} className={cardClass}>
        <h2 className="text-xl font-bold">Trocar senha</h2>
        <MessageBanner message={passwordMessage} />
        <Field label="Senha atual">
          <input type="password" required autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className={inputClass} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nova senha" hint={`Pelo menos ${MIN_PASSWORD} caracteres.`}>
            <input type="password" required autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className={inputClass} />
          </Field>
          <Field label="Confirmar nova senha">
            <input type="password" required autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={inputClass} />
          </Field>
        </div>
        <button type="submit" disabled={savingPassword} className={buttonClass}>
          {savingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
          Trocar senha
        </button>
      </form>
    </div>
  );
}
