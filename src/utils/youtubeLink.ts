// Aceita o link em qualquer formato do YouTube ou apenas o id do vídeo.
export function getYouTubeId(value?: string | null): string | null {
  const clean = value?.trim();
  if (!clean) return null;
  if (/^[\w-]{11}$/.test(clean)) return clean;
  const match = clean.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
  return match ? match[1] : null;
}

export function getYouTubeThumbnail(value?: string | null, size: 'maxresdefault' | 'hqdefault' = 'maxresdefault'): string | null {
  const id = getYouTubeId(value);
  return id ? `https://img.youtube.com/vi/${id}/${size}.jpg` : null;
}

export function formatSeconds(total: number): string {
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

// Aceita "1:30" ou "90" e devolve os segundos.
export function parseSeconds(value: string): number {
  const parts = value.trim().split(':').map(Number);
  if (parts.some(Number.isNaN)) return 0;
  return Math.max(0, parts.reduce((total, part) => total * 60 + part, 0));
}
