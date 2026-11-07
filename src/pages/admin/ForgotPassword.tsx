import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../../utils/supabase';

const MIN_PASSWORD = 8;
const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mt-1 text-white focus:border-[#0EA8A0] transition-colors outline-none';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    if (password.length < MIN_PASSWORD) {
      setError(`A nova senha precisa ter pelo menos ${MIN_PASSWORD} caracteres.`);
      return;
    }
    if (password !== confirmPassword) {
      setError('A confirmação não é igual à nova senha.');
      return;
    }
    setSending(true);
    setError(null);
    const { data, error: requestError } = await supabase.functions.invoke('user-access', {
      body: { action: 'request_password_change', email, password },
    });
    if (requestError || !data?.ok) {
      setError(data?.error ?? 'Não foi possível enviar o pedido. Tente novamente.');
    } else {
      setPassword('');
      setConfirmPassword('');
      setSent(true);
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
          {sent ? (
            <div className="text-center" role="status">
              <CheckCircle2 className="w-10 h-10 text-[#0EA8A0] mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Pedido enviado</h2>
              <p className="text-white/60 mb-6">
                Se houver uma conta com este e-mail, um administrador vai analisar o pedido. Sua senha atual continua valendo até a aprovação. Fale com um administrador para agilizar.
              </p>
              <Link to="/admin/login" className="text-[#0EA8A0] hover:text-white transition-colors font-semibold">
                Voltar para o login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">Esqueci minha senha</h2>
                <p className="text-sm text-white/60 mt-1">Escolha uma nova senha. Ela passa a valer quando um administrador aprovar o pedido.</p>
              </div>

              {error && (
                <div role="alert" className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <label className="block text-sm text-white/70">
                E-mail da sua conta
                <input type="email" required autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} />
              </label>
              <label className="block text-sm text-white/70">
                Nova senha
                <input type="password" required autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} />
                <span className="block text-xs text-white/40 mt-1">Pelo menos {MIN_PASSWORD} caracteres.</span>
              </label>
              <label className="block text-sm text-white/70">
                Confirmar nova senha
                <input type="password" required autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={inputClass} />
              </label>

              <button type="submit" disabled={sending} className="w-full bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {sending && <Loader2 className="w-5 h-5 animate-spin" />}
                Enviar pedido
              </button>
              <p className="text-center">
                <Link to="/admin/login" className="text-sm text-white/60 hover:text-white transition-colors">
                  Voltar para o login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
