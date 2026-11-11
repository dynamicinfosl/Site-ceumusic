import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { ArrowDownToLine, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { Field, inputClass, LoadingPanel, MessageBanner } from './components/PanelControls';
import type { PanelMessage } from './components/useOrderedList';

// Financeiro do Festival: a parte da Céu em cada inscrição paga fica na subconta
// AbacatePay da Céu. Daqui a equipe vê o saldo e saca para a chave Pix do CNPJ.

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
  subaccount: { name: string | null; tax_id: string | null; id?: string } | null;
  balance: { available: number; blocked: number; dev_mode: boolean } | null;
  balance_error: string | null;
  entries: Entry[];
  withdrawals: Withdrawal[];
}

const WITHDRAW_FEE_CENTS = 80;
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
  return Number.isFinite(number) ? Math.round(number * 100) : NaN;
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

function SetupPanel({ overview, onDone }: { overview: Overview; onDone: (message: PanelMessage) => void }) {
  const [name, setName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [rate, setRate] = useState(String(overview.commission_bps / 100).replace('.', ','));
  const [busy, setBusy] = useState<'create' | 'rate' | null>(null);

  const createSubaccount = async (event: FormEvent) => {
    event.preventDefault();
    setBusy('create');
    try {
      await callFestival({ action: 'payment_setup', step: 'create_subaccount', name, tax_id: taxId });
      onDone({ type: 'success', text: 'Subconta da Céu criada. A partir de agora cada inscrição paga já divide o valor.' });
    } catch (error) {
      onDone({ type: 'error', text: (error as Error).message });
    } finally {
      setBusy(null);
    }
  };

  const saveRate = async (event: FormEvent) => {
    event.preventDefault();
    const bps = Math.round(Number(rate.replace(',', '.')) * 100);
    setBusy('rate');
    try {
      await callFestival({ action: 'payment_setup', step: 'set_commission', commission_bps: bps });
      onDone({ type: 'success', text: `Taxa da plataforma salva em ${percent(bps)}. Vale para os próximos Pix gerados.` });
    } catch (error) {
      onDone({ type: 'error', text: (error as Error).message });
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="rounded-2xl border border-[#0EA8A0]/30 bg-[#0EA8A0]/5 p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold">Configuração (só o Master vê)</h2>
        <p className="text-sm text-white/50 mt-1">A equipe da Céu vê apenas o saldo, os saques e a taxa da plataforma em porcentagem.</p>
      </div>

      {overview.configured ? (
        <p className="text-sm text-white/70">
          Subconta: <strong>{overview.subaccount?.name}</strong> · {formatTaxId(overview.subaccount?.tax_id ?? null)}
          {overview.subaccount?.id && <span className="text-white/40"> · {overview.subaccount.id}</span>}
        </p>
      ) : (
        <form onSubmit={createSubaccount} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field label="Nome da empresa (como no CNPJ)">
            <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} required maxLength={100} />
          </Field>
          <Field label="CNPJ da Céu">
            <input className={inputClass} value={taxId} onChange={(event) => setTaxId(event.target.value)} required inputMode="numeric" placeholder="00.000.000/0000-00" />
          </Field>
          <button type="submit" disabled={busy !== null} className="bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-black px-5 py-2.5 rounded-xl font-bold disabled:opacity-50 flex items-center gap-2 justify-center">
            {busy === 'create' && <Loader2 className="w-4 h-4 animate-spin" />}
            Criar subconta
          </button>
        </form>
      )}

      <form onSubmit={saveRate} className="flex flex-wrap items-end gap-4">
        <Field label="Taxa da plataforma (%)" hint="Descontada de cada inscrição paga. O restante vai para a Céu.">
          <input className={`${inputClass} w-32`} value={rate} onChange={(event) => setRate(event.target.value)} inputMode="decimal" required />
        </Field>
        <button type="submit" disabled={busy !== null} className="border border-white/15 hover:bg-white/5 px-5 py-2.5 rounded-xl font-semibold disabled:opacity-50 flex items-center gap-2 mb-5">
          {busy === 'rate' && <Loader2 className="w-4 h-4 animate-spin" />}
          Salvar taxa
        </button>
      </form>
    </section>
  );
}

export default function FinanceAdmin() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [message, setMessage] = useState<PanelMessage | null>(null);
  const [amount, setAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [checking, setChecking] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setOverview(await callFestival({ action: 'finance_overview' }));
      setLoadError(null);
    } catch (error) {
      setLoadError((error as Error).message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const withdraw = async (event: FormEvent) => {
    event.preventDefault();
    const cents = parseMoney(amount);
    if (!Number.isInteger(cents) || cents < 100) {
      setMessage({ type: 'error', text: 'Informe um valor de pelo menos R$ 1,00.' });
      return;
    }
    if (!window.confirm(`Sacar ${money(cents)} para a chave Pix do CNPJ da Céu? Você recebe ${money(Math.max(0, cents - WITHDRAW_FEE_CENTS))}.`)) return;
    setWithdrawing(true);
    setMessage(null);
    try {
      const result = await callFestival({ action: 'finance_withdraw', amount_cents: cents });
      if (result.status === 'complete') setMessage({ type: 'success', text: 'Saque enviado para a conta da Céu.' });
      else if (result.status === 'failed') setMessage({ type: 'error', text: result.error ?? 'O saque não foi enviado.' });
      else setMessage({ type: 'error', text: result.error ?? 'O saque está em processamento. Use "Conferir" em instantes.' });
      setAmount('');
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

  const realEntries = overview.entries.filter((entry) => !entry.payment_dev_mode);
  const totalReceived = realEntries.reduce((sum, entry) => sum + entry.split_partner_cents, 0);
  const totalWithdrawn = overview.withdrawals.filter((item) => item.status === 'complete' && !item.dev_mode).reduce((sum, item) => sum + item.amount_cents, 0);
  const hasProcessing = overview.withdrawals.some((item) => item.status === 'processing');

  const cards = [
    { label: 'Disponível para saque', value: overview.balance ? money(overview.balance.available) : '—', accent: true },
    { label: 'Aguardando liberação', value: overview.balance ? money(overview.balance.blocked) : '—' },
    { label: 'Recebido no festival', value: money(totalReceived) },
    { label: 'Já sacado', value: money(totalWithdrawn) },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <p className="text-white/50 mt-1">
            Parte da Céu nas inscrições do Festival de Verão. Taxa da plataforma: {percent(overview.commission_bps)} por inscrição.
          </p>
        </div>
        <button type="button" onClick={load} className="border border-white/15 hover:bg-white/5 px-4 py-2 rounded-xl text-sm flex items-center gap-2 self-start">
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      <MessageBanner message={message} />

      {overview.is_master && <SetupPanel overview={overview} onDone={(result) => { setMessage(result); load(); }} />}

      {!overview.configured ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/60">
          A conta da Céu ainda está sendo preparada. Assim que estiver pronta, o saldo das inscrições aparece aqui.
        </div>
      ) : (
        <>
          {overview.balance_error && <MessageBanner message={{ type: 'error', text: overview.balance_error }} />}
          {overview.balance?.dev_mode && (
            <p className="text-sm text-amber-400">Modo de teste: os valores são simulados e o saque não fica disponível.</p>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
              <div key={card.label} className={`rounded-2xl p-5 border ${card.accent ? 'border-[#0EA8A0]/40 bg-[#0EA8A0]/10' : 'border-white/10 bg-white/[0.03]'}`}>
                <p className="text-xs text-white/50">{card.label}</p>
                <p className="text-2xl font-bold mt-2 tabular-nums">{card.value}</p>
              </div>
            ))}
          </div>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
            <h2 className="text-lg font-bold">Sacar</h2>
            <p className="text-sm text-white/50 max-w-2xl">
              O dinheiro vai por Pix para a chave do CNPJ {formatTaxId(overview.subaccount?.tax_id ?? null)}. Essa chave precisa estar cadastrada no banco da Céu.
              Cada saque tem custo de {money(WITHDRAW_FEE_CENTS)}, descontado do valor. Entre 20h e 8h o limite é de R$ 1.000,00.
            </p>
            <form onSubmit={withdraw} className="flex flex-wrap items-end gap-3">
              <Field label="Valor (R$)">
                <input className={`${inputClass} w-44`} value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" placeholder="0,00" required />
              </Field>
              {overview.balance && overview.balance.available >= 100 && (
                <button type="button" onClick={() => setAmount((overview.balance!.available / 100).toFixed(2).replace('.', ','))} className="text-sm text-[#0EA8A0] hover:underline mb-3">
                  Usar saldo todo
                </button>
              )}
              <button
                type="submit"
                disabled={withdrawing || hasProcessing || !overview.balance || overview.balance.dev_mode}
                className="bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-black px-6 py-2.5 rounded-xl font-bold disabled:opacity-50 flex items-center gap-2 mb-0.5"
              >
                {withdrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowDownToLine className="w-4 h-4" />}
                Sacar
              </button>
            </form>
            {hasProcessing && <p className="text-xs text-amber-400">Há um saque em processamento. Confira o status abaixo antes de pedir outro.</p>}
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">Saques</h2>
            {overview.withdrawals.length === 0 ? (
              <p className="text-sm text-white/40">Nenhum saque ainda.</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full text-sm">
                  <thead className="text-left text-white/40 text-xs">
                    <tr>
                      <th className="px-4 py-3 font-medium">Data</th>
                      <th className="px-4 py-3 font-medium">Valor</th>
                      <th className="px-4 py-3 font-medium">Custo</th>
                      <th className="px-4 py-3 font-medium">Situação</th>
                      <th className="px-4 py-3 font-medium">Pedido por</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {overview.withdrawals.map((item) => (
                      <tr key={item.id} className="border-t border-white/5">
                        <td className="px-4 py-3 whitespace-nowrap">{date(item.created_at)}</td>
                        <td className="px-4 py-3 tabular-nums">{money(item.amount_cents)}</td>
                        <td className="px-4 py-3 tabular-nums text-white/50">{item.fee_cents != null ? money(item.fee_cents) : '—'}</td>
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
            <h2 className="text-lg font-bold">Entradas</h2>
            <p className="text-sm text-white/50">O valor de cada inscrição fica disponível para saque depois que o Pix é confirmado.</p>
            {overview.entries.length === 0 ? (
              <p className="text-sm text-white/40">Nenhuma inscrição paga ainda.</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-white/10 max-h-[28rem] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-white/40 text-xs sticky top-0 bg-[#0b0f10]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Inscrição</th>
                      <th className="px-4 py-3 font-medium">Paga em</th>
                      <th className="px-4 py-3 font-medium">Valor pago</th>
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
                        <td className="px-4 py-3 tabular-nums font-semibold">{money(entry.split_partner_cents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
