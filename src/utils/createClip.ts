// Gera um clipe sem som a partir de um trecho do vídeo, no próprio navegador.
// A gravação acontece em tempo real: um trecho de 12 segundos leva cerca de 12 segundos.

const MIME_CANDIDATES = ['video/mp4;codecs=avc1.640028', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
const MAX_WIDTH = 1280;
const BITRATE = 5_000_000;

export interface ClipResult {
  blob: Blob;
  extension: 'mp4' | 'webm';
}

function once(target: EventTarget, event: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const onError = () => reject(new Error('Não foi possível ler este vídeo. Tente um arquivo MP4.'));
    target.addEventListener(event, () => {
      target.removeEventListener('error', onError);
      resolve();
    }, { once: true });
    target.addEventListener('error', onError, { once: true });
  });
}

export async function createClip(
  source: string,
  start: number,
  length: number,
  onProgress?: (fraction: number) => void
): Promise<ClipResult> {
  const mimeType = typeof MediaRecorder !== 'undefined' ? MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type)) : undefined;
  if (!mimeType) throw new Error('Este navegador não consegue gerar clipes. Use o Chrome no computador.');

  const video = document.createElement('video');
  video.src = source;
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.crossOrigin = 'anonymous';

  const metadata = once(video, 'loadedmetadata');
  video.load();
  await metadata;

  const scale = Math.min(1, MAX_WIDTH / video.videoWidth);
  const canvas = document.createElement('canvas');
  // Codificadores de vídeo exigem dimensões pares
  canvas.width = Math.round((video.videoWidth * scale) / 2) * 2;
  canvas.height = Math.round((video.videoHeight * scale) / 2) * 2;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Este navegador não consegue gerar clipes.');

  const seeked = once(video, 'seeked');
  video.currentTime = start;
  await seeked;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: BITRATE });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };
  const stopped = new Promise<void>((resolve) => {
    recorder.onstop = () => resolve();
  });

  const end = Math.min(start + length, video.duration);
  recorder.start(1000);
  await video.play();

  await new Promise<void>((resolve) => {
    const drawFrame = () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      onProgress?.(Math.min(1, (video.currentTime - start) / (end - start)));
      if (video.currentTime >= end || video.ended) {
        resolve();
        return;
      }
      if ('requestVideoFrameCallback' in video) {
        video.requestVideoFrameCallback(drawFrame);
      } else {
        requestAnimationFrame(drawFrame);
      }
    };
    drawFrame();
  });

  video.pause();
  recorder.stop();
  await stopped;
  stream.getTracks().forEach((track) => track.stop());
  video.removeAttribute('src');
  video.load();

  const container = mimeType.split(';')[0];
  return { blob: new Blob(chunks, { type: container }), extension: container === 'video/mp4' ? 'mp4' : 'webm' };
}
