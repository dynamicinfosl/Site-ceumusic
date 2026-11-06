// Endereços de exemplo que ficaram no conteúdo inicial do banco e nunca devem ir ao ar.
const SAMPLE_VIDEO_HOSTS = ['commondatastorage.googleapis.com', 'gtv-videos-bucket'];

export function getNativeClipUrl(url?: string | null): string | null {
  const clean = url?.trim();
  if (!clean) return null;
  if (SAMPLE_VIDEO_HOSTS.some((host) => clean.includes(host))) return null;
  return clean;
}
