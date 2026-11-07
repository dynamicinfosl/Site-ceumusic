import { useEffect, useState, type ReactNode } from 'react';
import { AlertCircle, ArrowDown, ArrowUp, CheckCircle2, Eye, EyeOff, Loader2, Save } from 'lucide-react';
import YouTubePreview from '../../../components/feature/YouTubePreview';
import { formatSeconds, getYouTubeId, parseSeconds } from '../../../utils/youtubeLink';
import type { PanelMessage } from './useOrderedList';

export const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 mt-1 focus:border-[#0EA8A0] transition-colors outline-none text-sm';

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-white/50 ml-1">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-white/40 ml-1 mt-1">{hint}</span>}
    </label>
  );
}

export function PageHeader({ title, description, saving, onSave }: { title: string; description: string; saving: boolean; onSave: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-white/50 mt-1">{description}</p>
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-black px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shrink-0"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Salvar alterações
      </button>
    </div>
  );
}

export function MessageBanner({ message }: { message: PanelMessage | null }) {
  if (!message) return null;
  const isSuccess = message.type === 'success';
  return (
    <div
      role={isSuccess ? 'status' : 'alert'}
      className={`p-4 rounded-xl flex items-center gap-3 border ${
        isSuccess ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-400'
      }`}
    >
      {isSuccess ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      <p className="text-sm">{message.text}</p>
    </div>
  );
}

export function LoadingPanel() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-[#0EA8A0]" />
    </div>
  );
}

export function MoveButtons({ label, isFirst, isLast, onMove }: { label: string; isFirst: boolean; isLast: boolean; onMove: (direction: -1 | 1) => void }) {
  const buttonClass = 'p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent transition-colors';
  return (
    <div className="flex items-center gap-1">
      <button type="button" aria-label={`Mover ${label} para cima`} disabled={isFirst} onClick={() => onMove(-1)} className={buttonClass}>
        <ArrowUp className="w-4 h-4" />
      </button>
      <button type="button" aria-label={`Mover ${label} para baixo`} disabled={isLast} onClick={() => onMove(1)} className={buttonClass}>
        <ArrowDown className="w-4 h-4" />
      </button>
    </div>
  );
}

// Define onde começa a prévia tocada pelo YouTube e mostra como ela fica.
export function YouTubeStartField({ youtube, start, onChange }: { youtube: string | null | undefined; start: number; onChange: (seconds: number) => void }) {
  const videoId = getYouTubeId(youtube);
  const [text, setText] = useState(formatSeconds(start));
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setText(formatSeconds(start));
  }, [start]);

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Field label="Início da prévia no YouTube (minutos:segundos)" hint="Usada enquanto este vídeo não tiver um clipe enviado.">
            <input
              type="text"
              inputMode="numeric"
              value={text}
              onChange={(event) => setText(event.target.value)}
              onBlur={() => onChange(parseSeconds(text))}
              placeholder="0:30"
              className={inputClass}
            />
          </Field>
        </div>
      </div>
      {videoId ? (
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          aria-expanded={showPreview}
          className="text-xs text-[#0EA8A0] hover:text-white flex items-center gap-1.5 ml-1 transition-colors"
        >
          {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showPreview ? 'Fechar prévia' : 'Ver prévia'}
        </button>
      ) : (
        <p className="text-[11px] text-white/40 ml-1">Coloque o link do YouTube para ativar a prévia.</p>
      )}
      {videoId && showPreview && (
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
          <YouTubePreview videoId={videoId} start={start} always />
        </div>
      )}
    </div>
  );
}
