import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { ArrowLeft, ArrowRight, Loader2, Save, Search, Trophy } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { LoadingPanel, inputClass } from './components/PanelControls';
import type { PanelMessage } from './components/useOrderedList';

// Ficha de avaliação por jurado (Regulamento, Cláusula 13): cinco critérios, 100 pontos,
// comentários que viram a devolutiva do participante. Cada jurado só edita a própria ficha.

export const CRITERIA = [
  { key: 'interpretation', label: 'Interpretação e expressão vocal', max: 25 },
  { key: 'composition', label: 'Composição e originalidade', max: 25 },
  { key: 'technique', label: 'Domínio técnico-musical', max: 20 },
  { key: 'identity', label: 'Identidade e expressão artística', max: 15 },
  { key: 'coherence', label: 'Coerência do projeto autoral', max: 15 },
] as const;

type CriterionKey = (typeof CRITERIA)[number]['key'];
type Scores = Record<CriterionKey, number>;

interface Entry {
  id: string;
  number: number;
  full_name: string;
  artistic_name: string;
  song_title: string;
  coauthors: string;
  video_embed_url: string | null;
  video_duration: number | null;
}

interface MyScore extends Scores {
  registration_id: string;
  strengths: string;
  improvements: string;
}

interface Summary extends Scores {
  registration_id: string;
  judges: number;
  total: number;
}

const EMPTY: Scores = { interpretation: 0, composition: 0, technique: 0, identity: 0, coherence: 0 };
const STATUS_LABELS: Record<string, string> = { pending: 'Pendente', in_review: 'Em análise', approved: 'Aprovado', rejected: 'Desclassificado' };

const primaryButton = 'bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-black px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50';
const secondaryButton = 'bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50';
const number = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
const name = (entry: Entry) => entry.artistic_name || entry.full_name;

function ScoreCard({
  entry, mine, status, position, count, onPrev, onNext, onSaved, onAnalyze, onMessage,
}: {
  entry: Entry;
  mine?: MyScore;
  status: string;
  position: number;
  count: number;
  onPrev: () => void;
  onNext: () => void;
  onSaved: (score: MyScore) => void;
  onAnalyze: () => Promise<void>;
  onMessage: (message: PanelMessage | null) => void;
}) {
  const [scores, setScores] = useState<Scores>(mine ?? EMPTY);
  const [strengths, setStrengths] = useState(mine?.strengths ?? '');
  const [improvements, setImprovements] = useState(mine?.improvements ?? '');
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const total = CRITERIA.reduce((sum, criterion) => sum + scores[criterion.key], 0);

  const save = async () => {
    if (!supabase) return;
    setSaving(true);
    onMessage(null);
    const { data: { user } } = await supabase.auth.getUser();
    const row = { registration_id: entry.id, judge_id: user?.id, ...scores, strengths: strengths.trim(), improvements: improvements.trim() };
    const { error } = await supabase.from('festival_scores').upsert(row, { onConflict: 'registration_id,judge_id' });
    setSaving(false);
    if (error) {
      onMessage({ type: 'error', text: `Não foi possível salvar a ficha: ${error.message}` });
      return;
    }
    onSaved({ ...row, registration_id: entry.id });
    onNext();
  };

  // Arrastar o cartão para os lados troca de vídeo (o vídeo em si não captura o gesto)
  const onPointerDown = (event: PointerEvent) => {
    swipeStart.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: PointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(event.clientY - start.y) * 2) {
      if (dx < 0) onNext();
      else onPrev();
    }
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-4 sm:p-5 flex flex-wrap items-center gap-3 select-none touch-pan-y" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <span className="text-xs font-bold text-white/50 tabular-nums">Nº {String(entry.number).padStart(4, '0')}</span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold truncate">{name(entry)}</span>
          <span className="block text-sm text-white/50 truncate">“{entry.song_title}”{entry.coauthors && ` · com ${entry.coauthors}`}</span>
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70">{STATUS_LABELS[status] ?? status}</span>
        <span className="text-xs text-white/40 tabular-nums">{position} de {count}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] p-4 sm:p-5 pt-0">
        <div>
          {entry.video_embed_url ? (
            <div className="relative aspect-[9/16] max-h-[70vh] mx-auto rounded-xl overflow-hidden bg-black">
              <iframe
                key={entry.id}
                src={entry.video_embed_url}
                title={`Vídeo da inscrição ${entry.number}`}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          ) : (
            <div className="aspect-video rounded-xl bg-white/5 flex items-center justify-center text-sm text-white/50">Vídeo indisponível</div>
          )}
        </div>

        <div className="space-y-4">
          {CRITERIA.map((criterion) => (
            <label key={criterion.key} className="block">
              <span className="flex justify-between text-sm">
                <span>{criterion.label}</span>
                <span className="tabular-nums font-semibold">{scores[criterion.key]} / {criterion.max}</span>
              </span>
              <input
                type="range"
                min={0}
                max={criterion.max}
                step={1}
                value={scores[criterion.key]}
                onChange={(event) => setScores({ ...scores, [criterion.key]: Number(event.target.value) })}
                className="w-full accent-[#0EA8A0]"
              />
            </label>
          ))}
          <p className="text-2xl font-bold tabular-nums">{total} <span className="text-sm font-normal text-white/50">de 100</span></p>
          <label className="block">
            <span className="text-xs font-medium text-white/50 ml-1">Pontos de destaque (o participante lê)</span>
            <textarea rows={3} maxLength={2000} value={strengths} onChange={(event) => setStrengths(event.target.value)} className={`${inputClass} resize-y`} />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-white/50 ml-1">Para aprimorar (o participante lê)</span>
            <textarea rows={3} maxLength={2000} value={improvements} onChange={(event) => setImprovements(event.target.value)} className={`${inputClass} resize-y`} />
          </label>
        </div>
      </div>

      <div className="border-t border-white/10 p-4 grid grid-cols-3 gap-2">
        <button type="button" onClick={onPrev} className={secondaryButton} aria-label="Vídeo anterior">
          <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Anterior</span>
        </button>
        <button
          type="button"
          disabled={analyzing || status !== 'pending'}
          onClick={async () => {
            setAnalyzing(true);
            await onAnalyze();
            setAnalyzing(false);
          }}
          className={`${secondaryButton} border border-yellow-500/30 text-yellow-300`}
          title="Separa o vídeo para a equipe conferir (autoria, regras, conteúdo)"
        >
          {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Para análise
        </button>
        <button type="button" onClick={save} disabled={saving} className={primaryButton}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{mine ? 'Atualizar' : 'Salvar'}</span> <ArrowRight className="w-4 h-4 hidden sm:inline" />
        </button>
      </div>
    </div>
  );
}

export default function FestivalJudging({ onMessage }: { onMessage: (message: PanelMessage | null) => void }) {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [mine, setMine] = useState<Record<string, MyScore>>({});
  const [summary, setSummary] = useState<Record<string, Summary>>({});
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [view, setView] = useState<'judge' | 'ranking'>('judge');
  const [showDone, setShowDone] = useState(false);
  const [index, setIndex] = useState(0);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    const [registrations, scores, summaries, evaluations] = await Promise.all([
      supabase
        .from('festival_registrations')
        .select('id, number, full_name, artistic_name, song_title, coauthors, video_embed_url, video_duration')
        .eq('status', 'paid')
        .eq('video_status', 'ready')
        .order('number'),
      supabase.from('festival_scores').select('registration_id, interpretation, composition, technique, identity, coherence, strengths, improvements').eq('judge_id', user?.id ?? ''),
      supabase.from('festival_score_summary').select('*'),
      supabase.from('festival_video_evaluations').select('registration_id, status'),
    ]);
    const error = registrations.error ?? scores.error ?? summaries.error ?? evaluations.error;
    if (error) onMessage({ type: 'error', text: `Não foi possível carregar a avaliação: ${error.message}` });
    setEntries((registrations.data ?? []) as Entry[]);
    setMine(Object.fromEntries(((scores.data ?? []) as MyScore[]).map((row) => [row.registration_id, row])));
    setSummary(Object.fromEntries(((summaries.data ?? []) as Summary[]).map((row) => [row.registration_id, { ...row, total: Number(row.total) }])));
    setStatuses(Object.fromEntries((evaluations.data ?? []).map((row: { registration_id: string; status: string }) => [row.registration_id, row.status])));
  }, [onMessage]);

  useEffect(() => {
    load();
  }, [load]);

  const queue = useMemo(
    () => (entries ?? []).filter((entry) => statuses[entry.id] !== 'rejected' && (showDone || !mine[entry.id])),
    // A fila só muda quando o jurado escolhe; uma ficha salva não some do lugar onde está
    [entries, statuses, showDone],
  );
  const current = queue[Math.min(index, queue.length - 1)];

  // Setas do teclado também trocam de vídeo (fora dos campos de texto)
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (view !== 'judge' || (event.target as HTMLElement)?.closest('input, textarea, select')) return;
      if (event.key === 'ArrowRight') setIndex((value) => Math.min(value + 1, Math.max(queue.length - 1, 0)));
      if (event.key === 'ArrowLeft') setIndex((value) => Math.max(value - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, queue.length]);

  const analyze = async (id: string) => {
    if (!supabase) return;
    const { data, error } = await supabase.functions.invoke('festival', { body: { action: 'admin_evaluate_video', id, evaluation_action: 'analyze' } });
    if (error || data?.error) onMessage({ type: 'error', text: data?.error ?? 'Não foi possível enviar para análise.' });
    else setStatuses((value) => ({ ...value, [id]: 'in_review' }));
  };

  const ranking = useMemo(() => {
    const rows = (entries ?? []).filter((entry) => summary[entry.id]).map((entry) => ({ entry, score: summary[entry.id] }));
    // Desempate do regulamento: composição, depois interpretação, depois domínio técnico
    return rows.sort((a, b) =>
      b.score.total - a.score.total
      || Number(b.score.composition) - Number(a.score.composition)
      || Number(b.score.interpretation) - Number(a.score.interpretation)
      || Number(b.score.technique) - Number(a.score.technique));
  }, [entries, summary]);

  if (entries === null) return <LoadingPanel />;

  const doneCount = entries.filter((entry) => mine[entry.id]).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div role="tablist" className="flex gap-1 bg-white/5 rounded-xl p-1">
          {[
            { key: 'judge', label: 'Minhas fichas' },
            { key: 'ranking', label: 'Ranking' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={view === item.key}
              onClick={() => setView(item.key as typeof view)}
              className={`px-3 py-1.5 rounded-lg text-sm ${view === item.key ? 'bg-[#0EA8A0] text-black font-semibold' : 'text-white/70 hover:text-white'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-white/50">Você avaliou {doneCount} de {entries.length} vídeos.</p>
        {view === 'judge' && (
          <label className="ml-auto flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" checked={showDone} onChange={(event) => { setShowDone(event.target.checked); setIndex(0); }} className="w-4 h-4 accent-[#0EA8A0]" />
            Mostrar os que já avaliei
          </label>
        )}
      </div>

      {view === 'judge' ? (
        current ? (
          <>
            <ScoreCard
              key={current.id}
              entry={current}
              mine={mine[current.id]}
              status={statuses[current.id] ?? 'pending'}
              position={Math.min(index, queue.length - 1) + 1}
              count={queue.length}
              onPrev={() => setIndex((value) => Math.max(value - 1, 0))}
              onNext={() => setIndex((value) => Math.min(value + 1, queue.length - 1))}
              onSaved={(score) => {
                setMine((value) => ({ ...value, [score.registration_id]: score }));
                onMessage({ type: 'success', text: `Ficha da inscrição ${current.number} salva.` });
                if (supabase) supabase.from('festival_score_summary').select('*').then(({ data }) => {
                  if (data) setSummary(Object.fromEntries((data as Summary[]).map((row) => [row.registration_id, { ...row, total: Number(row.total) }])));
                });
              }}
              onAnalyze={() => analyze(current.id)}
              onMessage={onMessage}
            />
            <p className="text-xs text-white/40 text-center">Arraste o cabeçalho do cartão para os lados ou use as setas do teclado para trocar de vídeo. Salvar leva ao próximo.</p>
          </>
        ) : (
          <p className="text-center text-white/50 py-12">
            {entries.length === 0 ? 'Nenhum vídeo pronto para avaliação ainda.' : 'Você avaliou todos os vídeos. Marque "Mostrar os que já avaliei" para revisar.'}
          </p>
        )
      ) : ranking.length === 0 ? (
        <p className="text-center text-white/50 py-12">Nenhuma ficha preenchida ainda.</p>
      ) : (
        <div className="overflow-x-auto bg-[#0A0A0A] border border-white/10 rounded-2xl">
          <table className="w-full text-sm">
            <thead className="text-white/50 text-left">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Inscrição</th>
                <th className="p-3 text-right">Média</th>
                <th className="p-3 text-right hidden sm:table-cell">Composição</th>
                <th className="p-3 text-right hidden sm:table-cell">Interpretação</th>
                <th className="p-3 text-right hidden md:table-cell">Técnica</th>
                <th className="p-3 text-right">Jurados</th>
                <th className="p-3 hidden md:table-cell">Situação</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map(({ entry, score }, position) => (
                <tr key={entry.id} className="border-t border-white/5">
                  <td className="p-3 tabular-nums">{position === 0 ? <Trophy className="w-4 h-4 text-yellow-400" /> : position + 1}</td>
                  <td className="p-3"><span className="text-white/50 tabular-nums mr-2">{String(entry.number).padStart(4, '0')}</span>{name(entry)}</td>
                  <td className="p-3 text-right font-semibold tabular-nums">{number(score.total)}</td>
                  <td className="p-3 text-right tabular-nums hidden sm:table-cell">{number(Number(score.composition))}</td>
                  <td className="p-3 text-right tabular-nums hidden sm:table-cell">{number(Number(score.interpretation))}</td>
                  <td className="p-3 text-right tabular-nums hidden md:table-cell">{number(Number(score.technique))}</td>
                  <td className="p-3 text-right tabular-nums">{score.judges}</td>
                  <td className="p-3 hidden md:table-cell text-white/60">{STATUS_LABELS[statuses[entry.id] ?? 'pending']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
