import { Plus, Trash2, Youtube } from 'lucide-react';
import MediaUpload from '../components/MediaUpload';
import ClipMaker from '../components/ClipMaker';
import { Field, inputClass, LoadingPanel, MessageBanner, MoveButtons, PageHeader, YouTubeStartField } from '../components/PanelControls';
import { useOrderedList } from '../components/useOrderedList';

interface HeroVideo {
  id: string;
  title: string;
  artist: string;
  description: string | null;
  video_url: string | null;
  youtube_url: string | null;
  thumbnail_url: string | null;
  duration: number | null;
  preview_start: number;
  order_index: number;
}

export default function HeroEditor() {
  const { items: videos, loading, saving, message, update, add, remove, move, save } = useOrderedList<HeroVideo>({
    table: 'hero_videos',
    successText: 'Vídeos do topo salvos.',
    validate: (rows) => (rows.some((video) => !video.title.trim() || !video.artist.trim()) ? 'Preencha o título e o artista de todos os vídeos.' : null),
  });

  if (loading) return <LoadingPanel />;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <PageHeader title="Vídeos do topo" description="Os vídeos que aparecem no início do site." saving={saving} onSave={save} />
      <MessageBanner message={message} />

      <div className="space-y-4">
        {videos.map((video, index) => (
          <div key={video.id} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-white/40">Vídeo {index + 1}</span>
              <div className="flex items-center gap-2">
                <MoveButtons label={video.title} isFirst={index === 0} isLast={index === videos.length - 1} onMove={(direction) => move(video.id, direction)} />
                <button type="button" aria-label={`Remover ${video.title}`} onClick={() => remove(video.id, video.title)} className="p-1.5 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Field label="Título da música">
                  <input type="text" value={video.title} onChange={(event) => update(video.id, { title: event.target.value })} placeholder="Ex: Final Feliz" className={inputClass} />
                </Field>
                <Field label="Artista / participação">
                  <input type="text" value={video.artist} onChange={(event) => update(video.id, { artist: event.target.value })} placeholder="Ex: No Santuário feat. Geziel Lima" className={inputClass} />
                </Field>
                <Field label="Breve descrição">
                  <textarea rows={2} value={video.description ?? ''} onChange={(event) => update(video.id, { description: event.target.value })} className={`${inputClass} resize-none`} />
                </Field>
                <Field label="Link do YouTube">
                  <div className="relative">
                    <Youtube className="absolute left-3 top-[calc(50%+2px)] -translate-y-1/2 w-4 h-4 text-red-500" />
                    <input type="url" value={video.youtube_url ?? ''} onChange={(event) => update(video.id, { youtube_url: event.target.value })} placeholder="https://youtube.com/watch?v=..." className={`${inputClass} pl-9`} />
                  </div>
                </Field>
                <YouTubeStartField youtube={video.youtube_url} start={video.preview_start ?? 0} onChange={(seconds) => update(video.id, { preview_start: seconds })} />
              </div>

              <div className="space-y-4">
                <ClipMaker currentUrl={video.video_url} onComplete={(url) => update(video.id, { video_url: url || null })} path="hero/videos" label="Clipe do vídeo de fundo (opcional)" />
                <MediaUpload onUploadComplete={(url) => update(video.id, { thumbnail_url: url })} currentUrl={video.thumbnail_url ?? ''} type="image" path="hero/thumbs" label="Miniatura (opcional, sem ela usamos a do YouTube)" />
                <input type="url" value={video.thumbnail_url ?? ''} onChange={(event) => update(video.id, { thumbnail_url: event.target.value })} placeholder="Ou cole o link de uma imagem" className={inputClass} />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            add({ id: crypto.randomUUID(), title: '', artist: '', description: '', video_url: null, youtube_url: '', thumbnail_url: '', duration: null, preview_start: 0, order_index: videos.length })
          }
          className="w-full py-4 border-2 border-dashed border-white/10 hover:border-[#0EA8A0]/30 hover:bg-[#0EA8A0]/5 rounded-2xl flex items-center justify-center gap-2 text-white/50 hover:text-[#0EA8A0] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adicionar vídeo
        </button>
      </div>
    </div>
  );
}
