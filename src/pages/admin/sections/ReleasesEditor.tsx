import { Plus, Trash2 } from 'lucide-react';
import MediaUpload from '../components/MediaUpload';
import { Field, inputClass, LoadingPanel, MessageBanner, MoveButtons, PageHeader } from '../components/PanelControls';
import { useOrderedList } from '../components/useOrderedList';
import type { Release } from '../../../utils/content';

export default function ReleasesEditor() {
  const { items: releases, loading, saving, message, update, add, remove, move, save } = useOrderedList<Release>({
    table: 'releases',
    successText: 'Lançamentos salvos.',
    validate: (rows) => (rows.some((release) => !release.title.trim() || !release.artist_name?.trim()) ? 'Preencha o título e o artista de todos os lançamentos.' : null),
  });

  if (loading) return <LoadingPanel />;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <PageHeader title="Lançamentos" description="A ordem daqui é a do site. A página inicial mostra os seis primeiros." saving={saving} onSave={save} />
      <MessageBanner message={message} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {releases.map((release, index) => (
          <div key={release.id} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white/40">Lançamento {index + 1}</span>
              <div className="flex items-center gap-2">
                <MoveButtons label={release.title} isFirst={index === 0} isLast={index === releases.length - 1} onMove={(direction) => move(release.id, direction)} />
                <button type="button" aria-label={`Remover ${release.title}`} onClick={() => remove(release.id, release.title)} className="p-1.5 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-28 shrink-0">
                <MediaUpload onUploadComplete={(url) => update(release.id, { cover_url: url })} currentUrl={release.cover_url ?? ''} type="image" path="releases" label="Capa" />
              </div>
              <div className="flex-1 space-y-3">
                <Field label="Título">
                  <input type="text" value={release.title} onChange={(event) => update(release.id, { title: event.target.value })} className={inputClass} />
                </Field>
                <Field label="Artista">
                  <input type="text" value={release.artist_name ?? ''} onChange={(event) => update(release.id, { artist_name: event.target.value })} className={inputClass} />
                </Field>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Tipo">
                <select value={release.release_type ?? 'Single'} onChange={(event) => update(release.id, { release_type: event.target.value })} className={`${inputClass} bg-[#0A0A0A]`}>
                  <option value="Single">Single</option>
                  <option value="EP">EP</option>
                  <option value="Álbum">Álbum</option>
                  <option value="Clipe">Clipe</option>
                </select>
              </Field>
              <Field label="Data">
                <input type="text" value={release.release_date ?? ''} onChange={(event) => update(release.id, { release_date: event.target.value })} placeholder="Ex: 20 Jan 2024" className={inputClass} />
              </Field>
              <Field label="Gênero">
                <input type="text" value={release.genre ?? ''} onChange={(event) => update(release.id, { genre: event.target.value })} className={inputClass} />
              </Field>
              <Field label="Reproduções">
                <input type="text" value={release.streams ?? ''} onChange={(event) => update(release.id, { streams: event.target.value })} placeholder="Ex: 271K" className={inputClass} />
              </Field>
            </div>

            <Field label="Link da capa" hint="Sem capa, usamos a miniatura do YouTube.">
              <input type="url" value={release.cover_url ?? ''} onChange={(event) => update(release.id, { cover_url: event.target.value })} className={inputClass} />
            </Field>
            <Field label="Link do clipe (YouTube)">
              <input type="url" value={release.video_url ?? ''} onChange={(event) => update(release.id, { video_url: event.target.value })} className={inputClass} />
            </Field>
            <Field label="Link para ouvir (Spotify ou outro)">
              <input type="url" value={release.streaming_link ?? ''} onChange={(event) => update(release.id, { streaming_link: event.target.value })} className={inputClass} />
            </Field>

            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
              <input type="checkbox" checked={!!release.featured} onChange={(event) => update(release.id, { featured: event.target.checked })} className="w-4 h-4 accent-[#0EA8A0]" />
              Mostrar em “Top lançamentos do mês”
            </label>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            add({ id: crypto.randomUUID(), title: '', artist_name: '', cover_url: '', release_type: 'Single', release_date: String(new Date().getFullYear()), genre: '', streams: '', featured: false, video_url: '', streaming_link: '', order_index: releases.length })
          }
          className="border-2 border-dashed border-white/10 hover:border-[#0EA8A0]/30 hover:bg-[#0EA8A0]/5 rounded-2xl flex items-center justify-center gap-2 text-white/50 hover:text-[#0EA8A0] transition-colors min-h-[200px]"
        >
          <Plus className="w-6 h-6" />
          Novo lançamento
        </button>
      </div>
    </div>
  );
}
