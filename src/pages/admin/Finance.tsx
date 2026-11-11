import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowDownToLine,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Lock,
  Receipt,
  RefreshCw,
  ShieldCheck,
  Split,
} from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { useAccess } from '../../utils/access';
import { Field, inputClass, LoadingPanel, MessageBanner } from './components/PanelControls';
import type { PanelMessage } from './components/useOrderedList';

// Financeiro do Festival: a parte da Céu em cada inscrição paga cai na conta da Céu
// na AbacatePay (subconta). Daqui a equipe acompanha cada valor e saca para o CNPJ.

interface Withdrawal {
  id: string;
  amount_cents: number;
  fee_cents: number | null;
  status: 'processing' | 'complete' | 'failed';
  receipt_url: string | null;
  error: string | null;
  dev_mode: boolean;
  requested_by_email: string | null;
  created_at: string;
}

interface Entry {
  number: number;
  paid_at: string;
  amount_cents: number;
  split_partner_cents: number;
  payment_dev_mode: boolean;
}

interface Overview {
  configured: boolean;
  is_master: boolean;
  commission_bps: number;
  subaccount: { name: string | null; tax_id: string | null } | null;
  balance: { available: number; blocked: number; dev_mode: boolean } | null;
  balance_error: string | null;
  entries: Entry[];
  withdrawals: Withdrawal[];
}

// Custo de cada saque, cobrado pela AbacatePay e descontado do valor sacado
const WITHDRAW_FEE_CENTS = 80;
// Mesma conta feita pelo servidor ao gerar o Pix
const PIX_COST_RESERVE_CENTS = 80;

const money = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const date = (value: string) => new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
const percent = (bps: number) => `${(bps / 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`;
const formatTaxId = (value: string | null) => {
  const digits = (value ?? '').replace(/\D/g, '');
  if (digits.length === 14) return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  if (digits.length === 11) return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  return value ?? '';
};
// "1.234,56" ou "1234.56" → centavos
const parseMoney = (value: string) => {
  const clean = value.replace(/[^\d,.]/g, '');
  const normalized = clean.includes(',') ? clean.replace(/\./g, '').replace(',', '.') : clean;
  const number = Number(normalized);
  return clean && Number.isFinite(number) ? Math.round(number * 100) : NaN;
};
const splitOf = (amount: number, bps: number) => {
  const platform = Math.round((amount * bps) / 10000);
  const partner = Math.min(amount - platform, amount - PIX_COST_RESERVE_CENTS);
  return { partner, platform: amount - partner };
};

const STATUS: Record<Withdrawal['status'], { label: string; className: string }> = {
  processing: { label: 'Processando', className: 'bg-amber-500/10 text-amber-400' },
  complete: { label: 'Enviado', className: 'bg-green-500/10 text-green-400' },
  failed: { label: 'Não enviado', className: 'bg-red-500/10 text-red-400' },
};

async function callFestival(body: Record<string, unknown>) {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { data, error } = await supabase.functions.invoke('festival', { body });
  if (data?.error) throw new Error(data.error);
  if (error) throw new Error('Não foi possível falar com o servidor agora.');
  return data;
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-white/10 bg-white/[0.03] p-6 ${className}`}>{children}</section>;
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-4 py-3 border-t border-white/5 first:border-t-0">
      <dt className="text-xs text-white/45 shrink-0">{label}</dt>
      <dd className="text-sm text-white/90 sm:text-right break-words">{children}</dd>
    </div>
  );
}

// Só aparece antes da conta existir, e só para o Master.
function CreateAccount({ onDone }: { onDone: (message: PanelMessage) => void }) {
  const [name, setName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await callFestival({ action: 'payment_setup', step: 'create_subaccount', name, tax_id: taxId });
      onDone({ type: 'success', text: 'Conta da Céu criada. A partir de agora cada inscrição paga já é dividida.' });
    } catch (error) {
      onDone({ type: 'error', text: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="border-[#0EA8A0]/30 bg-[#0EA8A0]/5">
      <h2 className="text-lg font-bold">Criar a conta da Céu</h2>
      <p className="text-sm text-white/50 mt-1">Use a razão social e o CNPJ da Céu. Os saques só poderão ir para a chave Pix deste CNPJ.</p>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end mt-5">
        <Field label="Razão social">
          <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} required maxLength={100} />
        </Field>
        <Field label="CNPJ">
          <input className={inputClass} value={taxId} onChange={(event) => setTaxId(event.target.value)} required inputMode="numeric" placeholder="00.000.000/0000-00" />
        </Field>
        <button type="submit" disabled={busy} className="bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-black px-5 py-2.5 rounded-xl font-bold disabled:opacity-50 flex items-center gap-2 justify-center">
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          Criar conta
        </button>
      </form>
    </Card>
  );
}

export default function FinanceAdmin() {
  const { can } = useAccess();
  if (!can('finance')) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Financeiro</h1>
        <MessageBanner message={{ type: 'error', text: 'Seu nível de acesso não inclui o Financeiro. Peça a liberação ao administrador.' }} />
      </div>
    );
  }
  return <FinanceContent />;
}

function FinanceContent() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [registrationFee, setRegistrationFee] = useState<number | null>(null);
  const [loadedAt, setLoadedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [message, setMessage] = useState<PanelMessage | null>(null);
  const [amount, setAmount] = useState('');
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [checking, setChecking] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setOverview(await callFestival({ action: 'finance_overview' }));
      setLoadedAt(new Date());
      setLoadError(null);
    } catch (error) {
      setLoadError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    supabase
      ?.from('site_settings')
      .select('value')
      .eq('key', 'festival')
      .maybeSingle()
      .then(({ data }) => {
        const fee = Number((data?.value as { fee_cents?: number } | null)?.fee_cents);
        if (Number.isInteger(fee) && fee >= 100) setRegistrationFee(fee);
      });
  }, [load]);

  const review = (event: FormEvent) => {
    event.preventDefault();
    const cents = parseMoney(amount);
    if (!Number.isInteger(cents) || cents < 100) {
      setMessage({ type: 'error', text: 'Informe um valor de pelo menos R$ 1,00.' });
      return;
    }
    if (overview?.balance && cents > overview.balance.available) {
      setMessage({ type: 'error', text: `O valor é maior que o disponível para saque (${money(overview.balance.available)}).` });
      return;
    }
    setMessage(null);
    setPendingAmount(cents);
  };

  const confirmWithdraw = async () => {
    if (pendingAmount == null) return;
    setWithdrawing(true);
    try {
      const result = await callFestival({ action: 'finance_withdraw', amount_cents: pendingAmount });
      if (result.status === 'complete') setMessage({ type: 'success', text: 'Saque enviado para a conta da Céu. O comprovante está na lista de saques.' });
      else if (result.status === 'failed') setMessage({ type: 'error', text: result.error ?? 'O saque não foi enviado. O valor continua no saldo.' });
      else setMessage({ type: 'error', text: result.error ?? 'O saque está em processamento. Use "Conferir" em instantes.' });
      setAmount('');
      setPendingAmount(null);
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setWithdrawing(false);
      await load();
    }
  };

  const check = async (id: string) => {
    setChecking(id);
    try {
      const result = await callFestival({ action: 'finance_check_withdraw', id });
      if (result.error) setMessage({ type: 'error', text: result.error });
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setChecking(null);
      await load();
    }
  };

  if (loadError && !overview) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Financeiro</h1>
        <MessageBanner message={{ type: 'error', text: loadError }} />
      </div>
    );
  }
  if (!overview) return <LoadingPanel />;

  const header = (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <p className="text-xs font-medium text-[#0EA8A0]">Festival de Verão</p>
        <h1 className="text-3xl font-bold mt-1">Financeiro da Céu Music</h1>
        <p className="text-white/50 mt-1 max-w-2xl">Cada inscrição paga é dividida no momento do pagamento. A parte da Céu cai direto na conta da Céu e pode ser sacada por aqui.</p>
      </div>
      <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
        <button type="button" onClick={load} disabled={loading} className="border border-white/15 hover:bg-white/5 px-4 py-2 rounded-xl text-sm flex items-center gap-2 disabled:opacity-60">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
        {loadedAt && <span className="text-[11px] text-white/35">Atualizado às {loadedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>}
      </div>
    </div>
  );

  if (!overview.configured) {
    return (
      <div className="space-y-8">
        {header}
        <MessageBanner message={message} />
        {overview.is_master ? (
          <CreateAccount onDone={(result) => { setMessage(result); load(); }} />
        ) : (
          <Card className="text-center text-white/60">A conta da Céu ainda está sendo preparada. Assim que estiver pronta, o saldo das inscrições aparece aqui.</Card>
        )}
      </div>
    );
  }

  const testMode = !!overview.balance?.dev_mode;
  const realEntries = overview.entries.filter((entry) => entry.payment_dev_mode === testMode);
  const realWithdrawals = overview.withdrawals.filter((item) => item.dev_mode === testMode);
  const totalPaid = realEntries.reduce((sum, entry) => sum + entry.amount_cents, 0);
  const totalReceived = realEntries.reduce((sum, entry) => sum + entry.split_partner_cents, 0);
  const totalWithdrawn = realWithdrawals.filter((item) => item.status === 'complete').reduce((sum, item) => sum + item.amount_cents, 0);
  const inProgress = realWithdrawals.filter((item) => item.status === 'processing').reduce((sum, item) => sum + item.amount_cents, 0);
  const hasProcessing = overview.withdrawals.some((item) => item.status === 'processing');
  const balanceTotal = overview.balance ? overview.balance.available + overview.balance.blocked : null;
  const difference = balanceTotal == null ? null : totalReceived - totalWithdrawn - inProgress - balanceTotal;
  const companyName = overview.subaccount?.name ?? 'Céu Music';
  const cnpj = formatTaxId(overview.subaccount?.tax_id ?? null);
  const example = registrationFee ? { amount: registrationFee, ...splitOf(registrationFee, overview.commission_bps) } : null;

  const cards = [
    { label: 'Disponível para saque', value: overview.balance ? money(overview.balance.available) : '—', hint: 'Pode ser sacado agora', accent: true },
    { label: 'Em liberação', value: overview.balance ? money(overview.balance.blocked) : '—', hint: 'Pagamentos recentes, liberados em breve' },
    { label: 'Recebido no festival', value: money(totalReceived), hint: `${realEntries.length} inscriç${realEntries.length === 1 ? 'ão paga' : 'ões pagas'}` },
    { label: 'Já sacado', value: money(totalWithdrawn), hint: `${realWithdrawals.filter((item) => item.status === 'complete').length} saque(s) enviados` },
  ];

  return (
    <div className="space-y-8">
      {header}
      <MessageBanner message={message} />
      {overview.balance_error && <MessageBanner message={{ type: 'error', text: overview.balance_error }} />}
      {testMode && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
          Modo de teste: os valores são simulados e o saque não fica disponível.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#0EA8A0]/15 text-[#0EA8A0] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold leading-tight">Conta de recebimento</h2>
                <p className="text-xs text-white/45 mt-0.5">Onde fica o dinheiro da Céu</p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${testMode ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400'}`}>
              <BadgeCheck className="w-3.5 h-3.5" />
              {testMode ? 'Modo de teste' : 'Conta ativa'}
            </span>
          </div>
          <dl className="mt-5">
            <InfoRow label="Titular">{companyName}</InfoRow>
            <InfoRow label="CNPJ"><span className="tabular-nums">{cnpj}</span></InfoRow>
            <InfoRow label="Pagamentos processados por">AbacatePay</InfoRow>
            <InfoRow label="Destino dos saques">Chave Pix do CNPJ {cnpj}</InfoRow>
          </dl>
          <div className="mt-5 flex gap-3 rounded-xl bg-white/[0.04] p-4">
            <Lock className="w-4 h-4 text-[#0EA8A0] shrink-0 mt-0.5" />
            <p className="text-xs text-white/60 leading-relaxed">
              Este saldo é da Céu Music. O saque só pode ser enviado para a chave Pix do CNPJ da Céu: o sistema não tem como mandar o dinheiro para outra conta.
            </p>
          </div>
        </Card>

        <section className="lg:col-span-2 rounded-2xl border border-[#0EA8A0]/40 bg-[#0EA8A0]/[0.08] p-6 flex flex-col">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#0EA8A0]/20 text-[#0EA8A0] flex items-center justify-center shrink-0">
              <Split className="w-5 h-5" />
            </div>
            <h2 className="font-bold">Taxa da plataforma</h2>
          </div>
          <p className="mt-5 text-5xl font-bold tracking-tight tabular-nums">{percent(overview.commission_bps)}</p>
          <p className="text-sm text-white/60 mt-1">por inscrição paga. Todo o restante é da Céu.</p>
          {example && (
            <dl className="mt-5 rounded-xl bg-black/25 p-4 text-sm space-y-2">
              <div className="flex justify-between gap-4"><dt className="text-white/55">Inscrição</dt><dd className="tabular-nums">{money(example.amount)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-white/55">Taxa da plataforma</dt><dd className="tabular-nums text-white/70">− {money(example.platform)}</dd></div>
              <div className="flex justify-between gap-4 border-t border-white/10 pt-2 font-semibold"><dt>Para a Céu</dt><dd className="tabular-nums text-[#0EA8A0]">{money(example.partner)}</dd></div>
            </dl>
          )}
          <p className="text-xs text-white/45 mt-auto pt-4">A divisão é automática, no momento em que o Pix é pago. Cada saque tem custo de {money(WITHDRAW_FEE_CENTS)}.</p>
        </section>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-2xl p-5 border ${card.accent ? 'border-[#0EA8A0]/40 bg-[#0EA8A0]/10' : 'border-white/10 bg-white/[0.03]'}`}>
            <p className="text-xs text-white/50">{card.label}</p>
            <p className="text-2xl font-bold mt-2 tabular-nums">{card.value}</p>
            <p className="text-[11px] text-white/40 mt-1">{card.hint}</p>
          </div>
        ))}
      </div>

      {difference != null && (
        <Card>
          <div className="flex items-center gap-2">
            <h2 className="font-bold">Conferência do saldo</h2>
            {difference === 0 ? (
              <span className="inline-flex items-center gap-1 text-xs text-green-400"><CheckCircle2 className="w-3.5 h-3.5" /> Tudo confere</span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-amber-400"><AlertTriangle className="w-3.5 h-3.5" /> Diferença de {money(Math.abs(difference))}</span>
            )}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-center text-sm">
            <div><p className="text-xs text-white/45">Recebido nas inscrições</p><p className="font-semibold tabular-nums">{money(totalReceived)}</p></div>
            <span className="hidden sm:block text-white/30">=</span>
            <div><p className="text-xs text-white/45">Já sacado</p><p className="font-semibold tabular-nums">{money(totalWithdrawn)}</p></div>
            <span className="hidden sm:block text-white/30">+</span>
            <div><p className="text-xs text-white/45">Saque em andamento</p><p className="font-semibold tabular-nums">{money(inProgress)}</p></div>
            <span className="hidden sm:block text-white/30">+</span>
            <div><p className="text-xs text-white/45">Saldo na conta</p><p className="font-semibold tabular-nums">{money(balanceTotal ?? 0)}</p></div>
          </div>
          {difference !== 0 && (
            <p className="text-xs text-white/50 mt-4">
              {difference < 0
                ? 'O saldo está maior que as inscrições listadas. Isso acontece quando um pagamento acabou de cair e ainda não foi registrado. Atualize em alguns minutos.'
                : 'O saldo está menor que o esperado. Atualize em alguns minutos e, se continuar, fale com o suporte da plataforma.'}
            </p>
          )}
        </Card>
      )}

      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <ArrowDownToLine className="w-5 h-5 text-[#0EA8A0]" />
          <h2 className="text-lg font-bold">Sacar</h2>
        </div>
        <p className="text-sm text-white/55 max-w-2xl">
          O dinheiro vai por Pix para a chave do CNPJ {cnpj} ({companyName}). Essa chave precisa estar cadastrada no banco da Céu.
          Entre 20h e 8h o limite de saque é de R$ 1.000,00.
        </p>

        {pendingAmount == null ? (
          <form onSubmit={review} className="flex flex-wrap items-end gap-3">
            <Field label="Valor (R$)">
              <input className={`${inputClass} w-44`} value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" placeholder="0,00" required />
            </Field>
            {overview.balance && overview.balance.available >= 100 && (
              <button type="button" onClick={() => setAmount((overview.balance!.available / 100).toFixed(2).replace('.', ','))} className="text-sm text-[#0EA8A0] hover:underline mb-3">
                Usar todo o disponível
              </button>
            )}
            <button
              type="submit"
              disabled={hasProcessing || !overview.balance || testMode}
              className="bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-black px-6 py-2.5 rounded-xl font-bold disabled:opacity-50 mb-0.5"
            >
              Continuar
            </button>
          </form>
        ) : (
          <div className="rounded-xl border border-[#0EA8A0]/30 bg-[#0EA8A0]/5 p-5 max-w-md">
            <p className="font-semibold">Confira antes de confirmar</p>
            <dl className="mt-3 text-sm space-y-2">
              <div className="flex justify-between gap-4"><dt className="text-white/55">Valor do saque</dt><dd className="tabular-nums">{money(pendingAmount)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-white/55">Custo do saque</dt><dd className="tabular-nums text-white/70">− {money(WITHDRAW_FEE_CENTS)}</dd></div>
              <div className="flex justify-between gap-4 border-t border-white/10 pt-2 font-semibold"><dt>Cai na conta da Céu</dt><dd className="tabular-nums text-[#0EA8A0]">{money(Math.max(0, pendingAmount - WITHDRAW_FEE_CENTS))}</dd></div>
              <div className="flex justify-between gap-4 pt-1"><dt className="text-white/55">Destino</dt><dd className="text-right">Pix CNPJ {cnpj}</dd></div>
            </dl>
            <div className="flex gap-3 mt-5">
              <button type="button" onClick={confirmWithdraw} disabled={withdrawing} className="bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-black px-5 py-2.5 rounded-xl font-bold disabled:opacity-50 flex items-center gap-2">
                {withdrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowDownToLine className="w-4 h-4" />}
                Confirmar saque
              </button>
              <button type="button" onClick={() => setPendingAmount(null)} disabled={withdrawing} className="border border-white/15 hover:bg-white/5 px-5 py-2.5 rounded-xl disabled:opacity-50">
                Voltar
              </button>
            </div>
          </div>
        )}
        {hasProcessing && <p className="text-xs text-amber-400">Há um saque em processamento. Confira o status abaixo antes de pedir outro.</p>}
      </Card>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-[#0EA8A0]" />
          <h2 className="text-lg font-bold">Saques</h2>
        </div>
        {overview.withdrawals.length === 0 ? (
          <p className="text-sm text-white/40">Nenhum saque ainda. Cada saque feito aparece aqui com o comprovante.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="text-left text-white/40 text-xs">
                <tr>
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Valor</th>
                  <th className="px-4 py-3 font-medium">Custo</th>
                  <th className="px-4 py-3 font-medium">Recebido</th>
                  <th className="px-4 py-3 font-medium">Situação</th>
                  <th className="px-4 py-3 font-medium">Pedido por</th>
                  <th className="px-4 py-3"><span className="sr-only">Comprovante</span></th>
                </tr>
              </thead>
              <tbody>
                {overview.withdrawals.map((item) => (
                  <tr key={item.id} className="border-t border-white/5">
                    <td className="px-4 py-3 whitespace-nowrap">{date(item.created_at)}</td>
                    <td className="px-4 py-3 tabular-nums">{money(item.amount_cents)}</td>
                    <td className="px-4 py-3 tabular-nums text-white/50">{item.fee_cents != null ? money(item.fee_cents) : '—'}</td>
                    <td className="px-4 py-3 tabular-nums">{item.status === 'complete' && item.fee_cents != null ? money(item.amount_cents - item.fee_cents) : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-lg text-xs ${STATUS[item.status].className}`}>{STATUS[item.status].label}</span>
                      {item.dev_mode && <span className="ml-2 text-xs text-amber-400">teste</span>}
                      {item.error && <span className="block text-xs text-white/40 mt-1">{item.error}</span>}
                    </td>
                    <td className="px-4 py-3 text-white/50">{item.requested_by_email ?? '—'}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {item.receipt_url && (
                        <a href={item.receipt_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#0EA8A0] hover:underline">
                          Comprovante <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {item.status === 'processing' && (
                        <button type="button" onClick={() => check(item.id)} disabled={checking !== null} className="inline-flex items-center gap-1 text-[#0EA8A0] hover:underline disabled:opacity-50">
                          {checking === item.id && <Loader2 className="w-3 h-3 animate-spin" />}
                          Conferir
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Split className="w-5 h-5 text-[#0EA8A0]" />
          <h2 className="text-lg font-bold">Entradas</h2>
        </div>
        <p className="text-sm text-white/50">Cada inscrição paga, com a divisão feita no pagamento.</p>
        {overview.entries.length === 0 ? (
          <p className="text-sm text-white/40">Nenhuma inscrição paga ainda.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10 max-h-[28rem] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-white/40 text-xs sticky top-0 bg-[#0A0A0A]">
                <tr>
                  <th className="px-4 py-3 font-medium">Inscrição</th>
                  <th className="px-4 py-3 font-medium">Paga em</th>
                  <th className="px-4 py-3 font-medium">Valor pago</th>
                  <th className="px-4 py-3 font-medium">Taxa da plataforma</th>
                  <th className="px-4 py-3 font-medium">Parte da Céu</th>
                </tr>
              </thead>
              <tbody>
                {overview.entries.map((entry) => (
                  <tr key={entry.number} className="border-t border-white/5">
                    <td className="px-4 py-3">
                      nº {entry.number}
                      {entry.payment_dev_mode && <span className="ml-2 text-xs text-amber-400">teste</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{entry.paid_at ? date(entry.paid_at) : '—'}</td>
                    <td className="px-4 py-3 tabular-nums">{money(entry.amount_cents)}</td>
                    <td className="px-4 py-3 tabular-nums text-white/50">− {money(entry.amount_cents - entry.split_partner_cents)}</td>
                    <td className="px-4 py-3 tabular-nums font-semibold">{money(entry.split_partner_cents)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="sticky bottom-0 bg-[#0A0A0A] border-t border-white/10 font-semibold">
                <tr>
                  <td className="px-4 py-3" colSpan={2}>Total{testMode ? '' : ' (sem testes)'}</td>
                  <td className="px-4 py-3 tabular-nums">{money(totalPaid)}</td>
                  <td className="px-4 py-3 tabular-nums text-white/50">− {money(totalPaid - totalReceived)}</td>
                  <td className="px-4 py-3 tabular-nums text-[#0EA8A0]">{money(totalReceived)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>

      <Card>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#0EA8A0]" />
          <h2 className="font-bold">Como o dinheiro da Céu é protegido</h2>
        </div>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 text-sm text-white/65">
          <li className="flex gap-3"><Split className="w-4 h-4 text-[#0EA8A0] shrink-0 mt-0.5" />A divisão de cada inscrição é feita automaticamente pela AbacatePay no momento do pagamento, sem ninguém mexer no valor.</li>
          <li className="flex gap-3"><Building2 className="w-4 h-4 text-[#0EA8A0] shrink-0 mt-0.5" />A parte da Céu fica numa conta própria, em nome do CNPJ da Céu, separada do saldo da plataforma.</li>
          <li className="flex gap-3"><Lock className="w-4 h-4 text-[#0EA8A0] shrink-0 mt-0.5" />O saque só vai para a chave Pix do CNPJ da Céu. Não existe opção de mandar para outra conta.</li>
          <li className="flex gap-3"><Receipt className="w-4 h-4 text-[#0EA8A0] shrink-0 mt-0.5" />Todo saque fica registrado com data, quem pediu e o comprovante do Pix.</li>
        </ul>
      </Card>
    </div>
  );
}
