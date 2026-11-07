import { useEffect, useRef, useState } from 'react';

interface YouTubePreviewProps {
  videoId: string;
  start?: number;
  className?: string;
  // Preenche o bloco cortando as sobras, como o object-fit: cover de uma imagem
  coverViewport?: boolean;
  // No painel a prévia toca mesmo em telas de toque
  always?: boolean;
}

// Volta ao segundo inicial para tocar sempre o mesmo trecho.
const LOOP_SECONDS = 20;
// O player mostra título e logo nos primeiros segundos; a capa fica visível até eles sumirem.
const FADE_IN_DELAY = 3500;

function canPlayPreview(): boolean {
  if (typeof window === 'undefined') return false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasHover = window.matchMedia('(hover: hover)').matches;
  return !reducedMotion && hasHover;
}

// Prévia sem som usada enquanto o vídeo não tem um clipe enviado pelo painel.
export default function YouTubePreview({ videoId, start = 0, className = '', coverViewport = false, always = false }: YouTubePreviewProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [visible, setVisible] = useState(false);
  const enabled = always || canPlayPreview();

  useEffect(() => {
    setVisible(false);
    if (!enabled) return;
    const timer = window.setInterval(() => {
      frameRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'seekTo', args: [start, true] }),
        '*'
      );
    }, LOOP_SECONDS * 1000);
    return () => window.clearInterval(timer);
  }, [enabled, start, videoId]);

  if (!enabled) return null;

  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    controls: '0',
    disablekb: '1',
    fs: '0',
    iv_load_policy: '3',
    cc_load_policy: '0',
    modestbranding: '1',
    playsinline: '1',
    rel: '0',
    enablejsapi: '1',
    start: String(start),
    origin: window.location.origin,
  });

  // A ampliação deixa fora da área visível as faixas do player: título, legenda e "Mais vídeos"
  const frameClass = coverViewport
    ? 'absolute left-1/2 top-1/2 h-[max(100vh,56.25vw)] w-[max(100vw,177.78vh)] -translate-x-1/2 -translate-y-1/2 scale-[1.35]'
    : 'absolute inset-0 h-full w-full scale-[1.35]';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'} ${className}`}
    >
      <iframe
        ref={frameRef}
        key={`${videoId}-${start}`}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?${params}`}
        title="Prévia do vídeo"
        tabIndex={-1}
        allow="autoplay; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        className={frameClass}
        onLoad={() => window.setTimeout(() => setVisible(true), FADE_IN_DELAY)}
      />
    </div>
  );
}
