import { useEffect, useState, type CSSProperties } from 'react';

interface ClipVideoProps {
  src: string;
  poster?: string | null;
  className?: string;
  style?: CSSProperties;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Clipe decorativo, sem som e em loop. Se falhar, ou se o visitante preferir
// menos movimento, mostra apenas a imagem de capa.
export default function ClipVideo({ src, poster, className, style }: ClipVideoProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed || prefersReducedMotion()) {
    return poster ? <img src={poster} alt="" aria-hidden="true" className={className} style={style} /> : null;
  }

  return (
    <video
      key={src}
      src={src}
      poster={poster ?? undefined}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      className={className}
      style={style}
      onError={() => setFailed(true)}
    />
  );
}
