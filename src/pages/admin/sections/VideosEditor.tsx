import { Plus, Star, Trash2, Youtube } from 'lucide-react';
import ClipMaker from '../components/ClipMaker';
import { Field, inputClass, LoadingPanel, MessageBanner, MoveButtons, PageHeader, YouTubeStartField } from '../components/PanelControls';
import { useOrderedList } from '../components/useOrderedList';
import { getYouTubeId, getYouTubeThumbnail } from '../../../utils/youtubeLink';

interface VideoItem {
  id: string;
  title: string;
  artist: string | null;
  video_id: string;
  views: string | null;
  duration: string | null;
  featured: boolean | null;
  preview_url: string | null;
  preview_start: number;
  order_index: number;
}

export default function VideosEditor() {
  const { items: videos, loading, saving, message, update, add, remove, move, save } = useOrderedList<VideoItem>({
    table: 'videos_gallery',
    successText: 'Galeria de vídeos salva.',
    validate: (rows) => {
      if (rows.some((video) => !video.title.trim())) return 'Preencha o título de todos os vídeos.';
      if (rows.some((video) => !getYouTubeId(video.video_id))) return 'Confira o link do YouTube de todos os vídeos.';
      return null;
    },
    prepare: (video) => ({ ...video, video_id: getYouTubeId(video.video_id) ?? video.video_id }),
  });

  if (loading) return <LoadingPanel />;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <PageHeader title="Galeria de vídeos" description="Os clipes da seção “Assista aos clipes”." saving={saving} onSave={save} />
      <MessageBanner message={message} />

      <div className="grid grid-cols-1 gap-4">
        {videos.map((video, index) => {
          const thumbnail = getYouTubeThumbnail(video.video_id, 'hqdefault');
          return (
            <div key={video.id} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-64 aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 relative">
                  {thumbnail ? (
                    <img src={thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <Youtube className="w-10 h-10" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => update(video.id, { featured: !video.featured })}
                    aria-pressed={!!video.featured}
                    aria-label="Marcar como destaque"
                    className={`absolute top-2 right-2 p-1.5 rounded-lg transition-colors ${video.featured ? 'bg-yellow-500 text-black' : 'bg-black/60 text-white/60 hover:text-white'}`}
                  >
                    <Star className="w-4 h-4" fill={video.featured ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Field label="Título do vídeo">
                      <input type="text" value={video.title} onChange={(event) => update(video.id, { title: event.target.value })} className={inputClass} />
                    </Field>
                  </div>
                  <Field label="Artista">
                    <input type="text" value={video.artist ?? ''} onChange={(event) => update(video.id, { artist: event.target.value })} className={inputClass} />
                  </Field>
                  <Field label="Link do YouTube">
                    <input type="text" value={video.video_id} onChange={(event) => update(video.id, { video_id: event.target.value })} placeholder="https://youtube.com/watch?v=..." className={inputClass} />
                  </Field>
                  <Field label="Visualizações">
                    <input type="text" value={video.views ?? ''} onChange={(event) => update(video.id, { views: event.target.value })} placeholder="Ex: 1.8M" className={inputClass} />
                  </Field>
                  <Field label="Duração">
                    <input type="text" value={video.duration ?? ''} onChange={(event) => update(video.id, { duration: event.target.value })} placeholder="Ex: 4:12" className={inputClass} />
                  </Field>
                  <div className="sm:col-span-2">
                    <YouTubeStartField youtube={video.video_id} start={video.preview_start ?? 0} onChange={(seconds) => update(video.id, { preview_start: seconds })} />
                  </div>
                  <div className="sm:col-span-2">
                    <ClipMaker currentUrl={video.preview_url} onComplete={(url) => update(video.id, { preview_url: url || null })} path="galeria/videos" label="Clipe ao passar o mouse (opcional, substitui a prévia do YouTube)" />
                  </div>
                </div>

                <div className="flex md:flex-col items-center gap-2">
                  <MoveButtons label={video.title} isFirst={index === 0} isLast={index === videos.length - 1} onMove={(direction) => move(video.id, direction)} />
                  <button type="button" aria-label={`Remover ${video.title}`} onClick={() => remove(video.id, video.title)} className="p-2 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() =>
            add({ id: crypto.randomUUID(), title: '', artist: '', video_id: '', views: '', duration: '', featured: false, preview_url: null, preview_start: 0, order_index: videos.length })
          }
          className="w-full py-6 border-2 border-dashed border-white/10 hover:border-[#0EA8A0]/30 hover:bg-[#0EA8A0]/5 rounded-2xl flex items-center justify-center gap-2 text-white/50 hover:text-[#0EA8A0] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adicionar vídeo
        </button>
      </div>
    </div>
  );
}
