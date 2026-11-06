import { useEffect, useRef, useState } from 'react';
import { Loader2, Scissors, Upload, Video, X } from 'lucide-react';
import { createClip, type ClipResult } from '../../../utils/createClip';
import { uploadToStorage } from './MediaUpload';

interface ClipMakerProps {
  currentUrl?: string | null;
  path: string;
  label: string;
  onComplete: (url: string) => void;
}

type Status = 'idle' | 'recording' | 'ready' | 'uploading';

const MIN_LENGTH = 5;
const MAX_LENGTH = 20;

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

export default function ClipMaker({ currentUrl, path, label, onComplete }: ClipMakerProps) {
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [length, setLength] = useState(12);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [clip, setClip] = useState<ClipResult | null>(null);
  const [clipUrl, setClipUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
  }, [sourceUrl]);

  useEffect(() => () => {
    if (clipUrl) URL.revokeObjectURL(clipUrl);
  }, [clipUrl]);

  const reset = () => {
    setSourceUrl(null);
    setClip(null);
    setClipUrl(null);
    setStart(0);
    setDuration(0);
    setStatus('idle');
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    reset();
    setSourceUrl(URL.createObjectURL(file));
  };

  const handleStart = (value: number) => {
    setStart(value);
    if (previewRef.current) previewRef.current.currentTime = value;
  };

  const handleGenerate = async () => {
    if (!sourceUrl) return;
    setStatus('recording');
    setError(null);
    setProgress(0);
    try {
      const result = await createClip(sourceUrl, start, length, setProgress);
      setClip(result);
      setClipUrl(URL.createObjectURL(result.blob));
      setStatus('ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível gerar o clipe.');
      setStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!clip) return;
    setStatus('uploading');
    setError(null);
    try {
      const file = new File([clip.blob], `clipe.${clip.extension}`, { type: clip.blob.type });
      onComplete(await uploadToStorage(file, path));
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao enviar o clipe.');
      setStatus('ready');
    }
  };

  const maxLength = Math.min(MAX_LENGTH, Math.floor(duration - start) || MAX_LENGTH);
  const effectiveLength = Math.min(length, maxLength);

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-white/40 ml-1 uppercase flex items-center gap-1">
        <Video className="w-3 h-3" /> {label}
      </p>

      {currentUrl && !sourceUrl && (
        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black">
          <video src={currentUrl} muted loop autoPlay playsInline className="w-full aspect-video object-cover" />
          <button
            type="button"
            onClick={() => onComplete('')}
            aria-label="Remover clipe"
            className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-lg text-white/70 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {!sourceUrl && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-white/10 rounded-xl p-5 flex flex-col items-center gap-2 hover:border-[#0EA8A0]/50 hover:bg-[#0EA8A0]/5 transition-colors"
        >
          <Upload className="w-5 h-5 text-white/40" />
          <span className="text-sm text-white/70">{currentUrl ? 'Trocar por outro trecho' : 'Selecionar vídeo do computador'}</span>
          <span className="text-[11px] text-white/40">Você escolhe o trecho e só ele é enviado, sem som</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        className="hidden"
        aria-label={label}
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      {sourceUrl && !clipUrl && (
        <div className="space-y-3 rounded-xl border border-white/10 p-3">
          <video
            ref={previewRef}
            src={sourceUrl}
            muted
            playsInline
            controls={status === 'idle'}
            className="w-full aspect-video rounded-lg bg-black"
            onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          />

          <label className="block text-xs text-white/60">
            Início do trecho: <strong className="text-white">{formatTime(start)}</strong>
            <input
              type="range"
              min={0}
              max={Math.max(0, Math.floor(duration) - MIN_LENGTH)}
              value={start}
              disabled={status !== 'idle'}
              onChange={(event) => handleStart(Number(event.target.value))}
              className="mt-1 w-full accent-[#0EA8A0]"
            />
          </label>

          <label className="block text-xs text-white/60">
            Duração: <strong className="text-white">{effectiveLength} segundos</strong>
            <input
              type="range"
              min={Math.min(MIN_LENGTH, maxLength)}
              max={maxLength}
              value={effectiveLength}
              disabled={status !== 'idle'}
              onChange={(event) => setLength(Number(event.target.value))}
              className="mt-1 w-full accent-[#0EA8A0]"
            />
          </label>

          {status === 'recording' ? (
            <div aria-live="polite">
              <div className="h-1.5 rounded bg-white/10 overflow-hidden">
                <div className="h-full bg-[#0EA8A0]" style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
              <p className="mt-2 text-xs text-white/60">Gerando clipe… mantenha esta aba aberta e visível.</p>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!duration}
                className="flex-1 bg-[#0EA8A0] text-black rounded-lg py-2 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Scissors className="w-4 h-4" /> Gerar clipe
              </button>
              <button type="button" onClick={reset} className="px-4 rounded-lg bg-white/5 text-sm text-white/70 hover:text-white">
                Cancelar
              </button>
            </div>
          )}
        </div>
      )}

      {clipUrl && clip && (
        <div className="space-y-3 rounded-xl border border-white/10 p-3">
          <video src={clipUrl} muted loop autoPlay playsInline className="w-full aspect-video rounded-lg bg-black" />
          <p className="text-xs text-white/60">Prévia do clipe: {(clip.blob.size / 1024 / 1024).toFixed(1)} MB</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleUpload}
              disabled={status === 'uploading'}
              className="flex-1 bg-[#0EA8A0] text-black rounded-lg py-2 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === 'uploading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {status === 'uploading' ? 'Enviando…' : 'Usar este clipe'}
            </button>
            <button
              type="button"
              disabled={status === 'uploading'}
              onClick={() => {
                setClip(null);
                setClipUrl(null);
                setStatus('idle');
              }}
              className="px-4 rounded-lg bg-white/5 text-sm text-white/70 hover:text-white"
            >
              Refazer
            </button>
          </div>
        </div>
      )}

      {error && <p role="alert" className="text-xs text-red-400 ml-1">{error}</p>}
    </div>
  );
}
