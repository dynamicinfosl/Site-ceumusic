import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, ExternalLink, Loader2, Plus, RefreshCw, Save, Trash2 } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { clearContentCache, fetchSettings, type FestivalSettings } from '../../utils/content';
import { Field, inputClass, LoadingPanel, MessageBanner } from './components/PanelControls';
import { describeSaveError, saveSetting, type PanelMessage } from './components/useOrderedList';

interface Registration {
  id: string;
  number: number;
  full_name: string;
  artistic_name: string;
  email: string;
  phone: string;
  cpf: string;
  city: string;
  state: string;
  song_title: string;
  status: 'pending_payment' | 'paid' | 'canceled';
  amount_cents: number;
  payment_dev_mode: boolean;
  paid_at: string | null;
  video_status: 'none' | 'uploading' | 'processing' | 'ready' | 'error';
  video_duration: number | null;
  video_embed_url: string | null;
  created_at: string;
}

type Filter = 'all' | 'paid' | 'pending_payment' | 'video_ready' | 'video_missing';

const PAYMENT_LABELS = { pending_payment: 'Aguardando Pix', paid: 'Pago', canceled: 'Cancelada' };
const PAYMENT_CLASSES = { pending_payment: 'bg-yellow-500/15 text-yellow-400', paid: 'bg-green-500/15 text-green-400', canceled: 'bg-white/10 text-white/50' };
const VIDEO_LABELS = { none: 'Sem vídeo', uploading: 'Enviando', processing: 'Processando', ready: 'Vídeo pronto', error: 'Erro no vídeo' };

const money = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const date = (value: string) => new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
const formatCpf = (cpf: string) => cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
const formatPhone = (phone: string) => phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');

const primaryButton = 'bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50';
const secondaryButton = 'bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50';

function exportCsv(rows: Registration[]) {
  const header = ['Número', 'Nome', 'Nome artístico', 'E-mail', 'WhatsApp', 'CPF', 'Cidade', 'UF', 'Música', 'Pagamento', 'Valor', 'Pago em', 'Vídeo', 'Inscrito em'];
  const escape = (value: string | number | null) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const lines = rows.map((row) =>
    [
      row.number, row.full_name, row.artistic_name, row.email, formatPhone(row.phone), formatCpf(row.cpf), row.city, row.state, row.song_title,
      PAYMENT_LABELS[row.status], (row.amount_cents / 100).toFixed(2).replace('.', ','), row.paid_at ? date(row.paid_at) : '', VIDEO_LABELS[row.video_status], date(row.created_at),
    ].map(escape).join(';')
  );
  // O BOM faz o Excel abrir os acentos certos
  const blob = new Blob(['﻿' + [header.map(escape).join(';'), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `festival-de-verao-inscricoes-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function RegistrationCard({ row, onRefresh }: { row: Registration; onRefresh: (id: string) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="w-full p-4 sm:p-5 flex flex-wrap items-center gap-3 text-left">
        <span className="text-xs font-bold text-white/50 tabular-nums w-14">Nº {String(row.number).padStart(4, '0')}</span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold truncate">{row.artistic_name || row.full_name}</span>
          <span className="block text-sm text-white/50 truncate">“{row.song_title}” · {row.city}{row.state && `/${row.state}`}</span>
        </span>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PAYMENT_CLASSES[row.status]}`}>
          {PAYMENT_LABELS[row.status]}{row.payment_dev_mode && ' (teste)'}
        </span>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${row.video_status === 'ready' ? 'bg-[#0EA8A0]/15 text-[#0EA8A0]' : row.video_status === 'error' ? 'bg-red-500/15 text-red-400' : 'bg-white/10 text-white/60'}`}>
          {VIDEO_LABELS[row.video_status]}
        </span>
      </button>

      {open && (
        <div className="border-t border-white/10 p-5 grid gap-6 lg:grid-cols-2">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div className="col-span-2"><dt className="text-white/50">Nome completo</dt><dd>{row.full_name}</dd></div>
            <div><dt className="text-white/50">E-mail</dt><dd className="break-all"><a href={`mailto:${row.email}`} className="hover:text-[#0EA8A0]">{row.email}</a></dd></div>
            <div><dt className="text-white/50">WhatsApp</dt><dd><a href={`https://wa.me/55${row.phone}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#0EA8A0]">{formatPhone(row.phone)}</a></dd></div>
            <div><dt className="text-white/50">CPF</dt><dd className="tabular-nums">{formatCpf(row.cpf)}</dd></div>
            <div><dt className="text-white/50">Valor</dt><dd>{money(row.amount_cents)}</dd></div>
            <div><dt className="text-white/50">Inscrito em</dt><dd>{date(row.created_at)}</dd></div>
            <div><dt className="text-white/50">Pago em</dt><dd>{row.paid_at ? date(row.paid_at) : '—'}</dd></div>
            <div className="col-span-2 pt-2">
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  await onRefresh(row.id);
                  setBusy(false);
                }}
                className={secondaryButton}
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Conferir pagamento e vídeo
              </button>
            </div>
          </dl>
          <div>
            {row.video_embed_url ? (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                <iframe
                  src={row.video_embed_url}
                  title={`Vídeo da inscrição ${row.number}`}
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-white/5 flex items-center justify-center text-sm text-white/50">
                {VIDEO_LABELS[row.video_status]}
              </div>
            )}
            {row.video_duration && <p className="text-xs text-white/50 mt-2">Duração: {Math.floor(row.video_duration / 60)}:{String(Math.round(row.video_duration % 60)).padStart(2, '0')}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsTab({ onMessage }: { onMessage: (message: PanelMessage) => void }) {
  const [festival, setFestival] = useState<FestivalSettings | null>(null);
  const [fee, setFee] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    clearContentCache();
    fetchSettings().then((settings) => {
      const value = settings.festival ?? {};
      setFestival(value);
      setFee(value.fee_cents ? (value.fee_cents / 100).toFixed(2).replace('.', ',') : '');
    });
  }, []);

  if (!festival) return <LoadingPanel />;

  const set = (patch: Partial<FestivalSettings>) => setFestival({ ...festival, ...patch });
  const prizes = festival.prizes ?? [];

  const handleSave = async () => {
    const feeCents = Math.round(Number(fee.replace(/\./g, '').replace(',', '.')) * 100);
    if (festival.registration_open && !(feeCents >= 100)) {
      onMessage({ type: 'error', text: 'Defina uma taxa de pelo menos R$ 1,00 antes de abrir as inscrições.' });
      return;
    }
    if (festival.registration_open && !festival.regulation?.trim()) {
      onMessage({ type: 'error', text: 'Publique o regulamento antes de abrir as inscrições: os participantes precisam aceitá-lo.' });
      return;
    }
    setSaving(true);
    try {
      await saveSetting('festival', { ...festival, fee_cents: Number.isFinite(feeCents) ? feeCents : 0 });
      onMessage({ type: 'success', text: 'Configurações do festival salvas.' });
    } catch (error) {
      onMessage({ type: 'error', text: describeSaveError(error as { code?: string; message?: string }) });
    } finally {
      setSaving(false);
    }
  };

  const cardClass = 'bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4';

  return (
    <div className="space-y-6">
      <section className={cardClass}>
        <h2 className="text-xl font-bold">Inscrições</h2>
        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <input type="checkbox" checked={!!festival.registration_open} onChange={(event) => set({ registration_open: event.target.checked })} className="w-5 h-5 accent-[#0EA8A0]" />
          Inscrições abertas
        </label>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Taxa de inscrição (R$)">
            <input type="text" inputMode="decimal" value={fee} onChange={(event) => setFee(event.target.value)} placeholder="0,00" className={inputClass} />
          </Field>
          <Field label="Inscrições até" hint="Vale até 23h59 (horário de Brasília).">
            <input type="date" value={festival.deadline ?? ''} onChange={(event) => set({ deadline: event.target.value })} className={inputClass} />
          </Field>
          <Field label="Duração máxima do vídeo (min)">
            <input type="number" min={1} max={60} value={festival.max_video_minutes ?? 10} onChange={(event) => set({ max_video_minutes: Number(event.target.value) })} className={inputClass} />
          </Field>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-bold">Textos da página</h2>
        <Field label="Frase de abertura">
          <input type="text" value={festival.tagline ?? ''} onChange={(event) => set({ tagline: event.target.value })} className={inputClass} />
        </Field>
        <Field label="Sobre o festival">
          <textarea rows={4} value={festival.about ?? ''} onChange={(event) => set({ about: event.target.value })} className={`${inputClass} resize-y`} />
        </Field>
        <p className="text-sm font-semibold pt-2">Prêmios</p>
        {prizes.map((prize, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1 grid sm:grid-cols-[1fr_2fr] gap-2">
              <input type="text" aria-label="Prêmio" value={prize.title} onChange={(event) => set({ prizes: prizes.map((item, i) => (i === index ? { ...item, title: event.target.value } : item)) })} className={inputClass} />
              <input type="text" aria-label="Descrição do prêmio" value={prize.text} onChange={(event) => set({ prizes: prizes.map((item, i) => (i === index ? { ...item, text: event.target.value } : item)) })} className={inputClass} />
            </div>
            <button type="button" aria-label={`Remover ${prize.title}`} onClick={() => set({ prizes: prizes.filter((_, i) => i !== index) })} className="p-2 mt-1 text-white/40 hover:text-red-500 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => set({ prizes: [...prizes, { title: '', text: '' }] })} className="text-xs text-[#0EA8A0] hover:text-white flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Adicionar prêmio
        </button>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-bold">Regulamento</h2>
        <Field label="Texto do regulamento" hint="Deixe uma linha em branco entre parágrafos. Comece uma linha com # para criar um título.">
          <textarea rows={14} value={festival.regulation ?? ''} onChange={(event) => set({ regulation: event.target.value })} className={`${inputClass} resize-y font-mono text-xs`} />
        </Field>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-bold">Banner no site da Céu</h2>
        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <input type="checkbox" checked={!!festival.banner?.enabled} onChange={(event) => set({ banner: { ...festival.banner, enabled: event.target.checked } })} className="w-5 h-5 accent-[#0EA8A0]" />
          Mostrar o banner na página inicial da Céu Music
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Título">
            <input type="text" value={festival.banner?.title ?? ''} onChange={(event) => set({ banner: { ...festival.banner, title: event.target.value } })} className={inputClass} />
          </Field>
          <Field label="Endereço do festival">
            <input type="url" value={festival.site_url ?? ''} onChange={(event) => set({ site_url: event.target.value })} className={inputClass} />
          </Field>
        </div>
        <Field label="Texto">
          <input type="text" value={festival.banner?.text ?? ''} onChange={(event) => set({ banner: { ...festival.banner, text: event.target.value } })} className={inputClass} />
        </Field>
      </section>

      <button type="button" onClick={handleSave} disabled={saving} className={primaryButton}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar configurações
      </button>
    </div>
  );
}

export default function FestivalAdmin() {
  const [tab, setTab] = useState<'registrations' | 'settings'>('registrations');
  const [rows, setRows] = useState<Registration[] | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<PanelMessage | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('festival_registrations')
      .select('id, number, full_name, artistic_name, email, phone, cpf, city, state, song_title, status, amount_cents, payment_dev_mode, paid_at, video_status, video_duration, video_embed_url, created_at')
      .order('number', { ascending: false });
    if (error) setMessage({ type: 'error', text: `Não foi possível carregar: ${error.message}` });
    setRows((data ?? []) as Registration[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = async (id: string) => {
    if (!supabase) return;
    const { data, error } = await supabase.functions.invoke('festival', { body: { action: 'admin_refresh', id } });
    if (error || data?.error) setMessage({ type: 'error', text: data?.error ?? 'Não foi possível conferir agora.' });
    await load();
  };

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (rows ?? []).filter((row) => {
      if (filter === 'paid' && row.status !== 'paid') return false;
      if (filter === 'pending_payment' && row.status !== 'pending_payment') return false;
      if (filter === 'video_ready' && row.video_status !== 'ready') return false;
      if (filter === 'video_missing' && (row.status !== 'paid' || row.video_status === 'ready')) return false;
      if (!term) return true;
      return [row.full_name, row.artistic_name, row.email, row.song_title, row.cpf, String(row.number)].some((value) => value.toLowerCase().includes(term));
    });
  }, [rows, filter, search]);

  const paid = (rows ?? []).filter((row) => row.status === 'paid' && !row.payment_dev_mode);
  const stats = [
    { label: 'Inscrições', value: String(rows?.length ?? 0) },
    { label: 'Pagas', value: String(paid.length) },
    { label: 'Vídeos prontos', value: String((rows ?? []).filter((row) => row.video_status === 'ready').length) },
    { label: 'Arrecadado', value: money(paid.reduce((sum, row) => sum + row.amount_cents, 0)) },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Festival de Verão</h1>
          <p className="text-white/50 mt-1">Inscrições, pagamentos, vídeos e a página do festival.</p>
        </div>
        <a href="https://festivaldeverao.ceumusic.com.br" target="_blank" rel="noopener noreferrer" className="text-sm text-[#0EA8A0] hover:text-white flex items-center gap-1.5">
          Ver a página do festival <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div role="tablist" className="flex gap-1 border-b border-white/10">
        {[
          { key: 'registrations', label: 'Inscrições' },
          { key: 'settings', label: 'Configurações' },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={tab === item.key}
            onClick={() => {
              setTab(item.key as typeof tab);
              setMessage(null);
            }}
            className={`-mb-px px-4 py-2.5 text-sm border-b-2 transition-colors ${tab === item.key ? 'border-[#0EA8A0] text-white font-medium' : 'border-transparent text-white/60 hover:text-white'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <MessageBanner message={message} />

      {tab === 'settings' ? (
        <SettingsTab onMessage={setMessage} />
      ) : rows === null ? (
        <LoadingPanel />
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-4">
                <p className="text-sm text-white/50">{stat.label}</p>
                <p className="text-2xl font-bold tabular-nums mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input type="search" aria-label="Buscar inscrição" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome, e-mail, música, CPF ou número" className={`${inputClass} mt-0 flex-1`} />
            <select aria-label="Filtrar inscrições" value={filter} onChange={(event) => setFilter(event.target.value as Filter)} className={`${inputClass} mt-0 sm:w-56 bg-[#0A0A0A]`}>
              <option value="all">Todas</option>
              <option value="paid">Pagas</option>
              <option value="pending_payment">Aguardando Pix</option>
              <option value="video_missing">Pagas sem vídeo pronto</option>
              <option value="video_ready">Com vídeo pronto</option>
            </select>
            <button type="button" onClick={() => exportCsv(visible)} disabled={visible.length === 0} className={secondaryButton}>
              <Download className="w-4 h-4" /> Planilha
            </button>
          </div>

          {visible.length === 0 ? (
            <p className="text-center text-white/50 py-12">{rows.length === 0 ? 'Nenhuma inscrição ainda.' : 'Nenhuma inscrição com este filtro.'}</p>
          ) : (
            <div className="space-y-3">
              {visible.map((row) => <RegistrationCard key={row.id} row={row} onRefresh={refresh} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
