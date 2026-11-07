import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../../utils/supabase';

type InviteState = 'checking' | 'open' | 'invalid' | 'done';

const MIN_PASSWORD = 8;
const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mt-1 text-white focus:border-[#0EA8A0] transition-colors outline-none disabled:opacity-60';

export default function InvitePage() {
  const { token } = useParams();
  const [state, setState] = useState<InviteState>('checking');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [lockedEmail, setLockedEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function check() {
      if (!supabase) {
        setState('invalid');
        return;
      }
      const { data, error: requestError } = await supabase.functions.invoke('user-access', { body: { action: 'check_invite', token } });
      if (requestError || !data?.valid) {
        setState('invalid');
        return;
      }
      if (data.email) {
        setEmail(data.email);
        setLockedEmail(true);
      }
      setState('open');
    }
    check();
  }, [token]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    if (password.length < MIN_PASSWORD) {
      setError(`A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres.`);
      return;
    }
    if (password !== confirmPassword) {
      setError('A confirmação não é igual à senha.');
      return;
    }
    setSending(true);
    setError(null);
    const { data, error: requestError } = await supabase.functions.invoke('user-access', {
      body: { action: 'accept_invite', token, full_name: fullName, email, password },
    });
    if (requestError || !data?.ok) {
      setError(data?.error ?? 'Não foi possível concluir o cadastro. Tente novamente.');
    } else {
      setPassword('');
      setConfirmPassword('');
      setState('done');
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0EA8A0]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C45C2F]/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        <h1 className="text-3xl font-bold tracking-tight text-center mb-8">
          Céu Music <span className="text-[#0EA8A0]">Admin</span>
        </h1>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
          {state === 'checking' && (
            <p className="flex items-center justify-center gap-2 text-white/60" aria-live="polite">
              <Loader2 className="w-5 h-5 animate-spin" /> Conferindo o convite…
            </p>
          )}

          {state === 'invalid' && (
            <div className="text-center">
              <AlertCircle className="w-10 h-10 text-white/40 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Convite indisponível</h2>
              <p className="text-white/60">Este link não é válido, expirou ou já foi usado. Peça um novo a quem convidou você.</p>
            </div>
          )}

          {state === 'done' && (
            <div className="text-center" role="status">
              <CheckCircle2 className="w-10 h-10 text-[#0EA8A0] mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Cadastro enviado</h2>
              <p className="text-white/60 mb-6">Agora é só aguardar a aprovação de um administrador. Depois disso, entre com o e-mail e a senha que você criou.</p>
              <Link to="/admin/login" className="text-[#0EA8A0] hover:text-white transition-colors font-semibold">
                Ir para o login
              </Link>
            </div>
          )}

          {state === 'open' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">Crie seu acesso</h2>
                <p className="text-sm text-white/60 mt-1">Você foi convidado para o painel da Céu Music.</p>
              </div>

              {error && (
                <div role="alert" className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <label className="block text-sm text-white/70">
                Nome completo
                <input type="text" required autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} className={inputClass} />
              </label>
              <label className="block text-sm text-white/70">
                E-mail
                <input type="email" required autoComplete="email" value={email} disabled={lockedEmail} onChange={(event) => setEmail(event.target.value)} className={inputClass} />
              </label>
              <label className="block text-sm text-white/70">
                Senha
                <input type="password" required autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} />
                <span className="block text-xs text-white/40 mt-1">Pelo menos {MIN_PASSWORD} caracteres.</span>
              </label>
              <label className="block text-sm text-white/70">
                Confirmar senha
                <input type="password" required autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={inputClass} />
              </label>

              <button type="submit" disabled={sending} className="w-full bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {sending && <Loader2 className="w-5 h-5 animate-spin" />}
                Enviar cadastro
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
