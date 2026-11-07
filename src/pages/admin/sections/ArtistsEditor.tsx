import { useState } from 'react';
import { ChevronDown, Plus, Search, Trash2, Users } from 'lucide-react';
import MediaUpload from '../components/MediaUpload';
import { Field, inputClass, LoadingPanel, MessageBanner, MoveButtons, PageHeader } from '../components/PanelControls';
import { useOrderedList } from '../components/useOrderedList';
import type { Artist, ArtistSong, ArtistVideo } from '../../../utils/content';

const socialFields = [
  { field: 'instagram', label: 'Instagram' },
  { field: 'spotify', label: 'Spotify' },
  { field: 'youtube', label: 'YouTube' },
  { field: 'tiktok', label: 'TikTok' },
  { field: 'twitter', label: 'X / Twitter' },
  { field: 'facebook', label: 'Facebook' },
] as const;

const followerFields = [
  { field: 'instagram', label: 'Seguidores no Instagram' },
  { field: 'spotify', label: 'Ouvintes no Spotify' },
  { field: 'youtube', label: 'Inscritos no YouTube' },
] as const;

const smallButtonClass = 'text-xs text-[#0EA8A0] hover:text-white flex items-center gap-1 transition-colors';
const removeRowClass = 'p-2 mt-1 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0';

function parsePosition(value: string | null): [number, number] {
  const [x, y] = (value ?? '').split(' ').map((part) => parseInt(part, 10));
  return [Number.isNaN(x) ? 50 : x, Number.isNaN(y) ? 50 : y];
}

export default function ArtistsEditor() {
  const { items: artists, loading, saving, message, update, add, remove, move, save } = useOrderedList<Artist>({
    table: 'artists',
    successText: 'Artistas salvos.',
    validate: (rows) => (rows.some((artist) => !artist.name.trim()) ? 'Preencha o nome de todos os artistas.' : null),
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  if (loading) return <LoadingPanel />;

  const term = searchTerm.trim().toLowerCase();
  const visibleArtists = term ? artists.filter((artist) => artist.name.toLowerCase().includes(term)) : artists;

  const handleAdd = () => {
    const id = crypto.randomUUID();
    add({
      id, name: '', genre: 'Gospel/CCM', bio: '', short_bio: '', image_url: '', photo_position: '50% 50%',
      instagram: '', spotify: '', youtube: '', tiktok: '', twitter: '', facebook: '',
      followers: {}, songs: [], videos: [], legacy_id: null, order_index: artists.length,
    });
    setSearchTerm('');
    setOpenId(id);
  };

  const updateSong = (artist: Artist, index: number, patch: Partial<ArtistSong>) => {
    update(artist.id, { songs: (artist.songs ?? []).map((song, i) => (i === index ? { ...song, ...patch } : song)) });
  };

  const updateVideo = (artist: Artist, index: number, patch: Partial<ArtistVideo>) => {
    update(artist.id, { videos: (artist.videos ?? []).map((video, i) => (i === index ? { ...video, ...patch } : video)) });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <PageHeader title="Artistas" description="A ordem daqui é a do site. Abra um artista para editar." saving={saving} onSave={save} />
      <MessageBanner message={message} />

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
        <input
          type="search"
          aria-label="Buscar artista"
          placeholder="Buscar artista pelo nome"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:border-[#0EA8A0] transition-colors outline-none"
        />
      </div>

      <div className="space-y-3">
        {visibleArtists.map((artist) => {
          const isOpen = openId === artist.id;
          const index = artists.indexOf(artist);
          const [positionX, positionY] = parsePosition(artist.photo_position);
          const songs = artist.songs ?? [];
          const videos = artist.videos ?? [];

          return (
            <div key={artist.id} className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 p-3 sm:p-4">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : artist.id)}
                  aria-expanded={isOpen}
                  className="flex items-center gap-4 flex-1 min-w-0 text-left"
                >
                  <span className="w-12 h-12 rounded-full overflow-hidden bg-white/5 shrink-0">
                    {artist.image_url && <img src={artist.image_url} alt="" className="w-full h-full object-cover" style={{ objectPosition: artist.photo_position ?? undefined }} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold truncate">{artist.name || 'Novo artista'}</span>
                    <span className="block text-xs text-white/50 truncate">{artist.genre}</span>
                  </span>
                  <ChevronDown className={`w-5 h-5 text-white/40 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {!term && <MoveButtons label={artist.name} isFirst={index === 0} isLast={index === artists.length - 1} onMove={(direction) => move(artist.id, direction)} />}
                <button type="button" aria-label={`Remover ${artist.name}`} onClick={() => remove(artist.id, artist.name)} className="p-2 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {isOpen && (
                <div className="p-6 border-t border-white/10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <MediaUpload onUploadComplete={(url) => update(artist.id, { image_url: url })} currentUrl={artist.image_url ?? ''} type="image" path="artists" label="Foto do artista" />
                    <Field label="Ou cole o link da foto">
                      <input type="text" value={artist.image_url ?? ''} onChange={(event) => update(artist.id, { image_url: event.target.value })} className={inputClass} />
                    </Field>
                    {artist.image_url && (
                      <div className="space-y-3">
                        <p className="text-xs font-medium text-white/50 ml-1">Enquadramento no site</p>
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-[#0EA8A0]/40">
                          <img src={artist.image_url} alt="" className="w-full h-full object-cover" style={{ objectPosition: `${positionX}% ${positionY}%` }} />
                        </div>
                        <label className="block text-xs text-white/60">
                          Horizontal
                          <input type="range" min={0} max={100} value={positionX} onChange={(event) => update(artist.id, { photo_position: `${event.target.value}% ${positionY}%` })} className="mt-1 w-full accent-[#0EA8A0]" />
                        </label>
                        <label className="block text-xs text-white/60">
                          Vertical
                          <input type="range" min={0} max={100} value={positionY} onChange={(event) => update(artist.id, { photo_position: `${positionX}% ${event.target.value}%` })} className="mt-1 w-full accent-[#0EA8A0]" />
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Nome">
                        <input type="text" value={artist.name} onChange={(event) => update(artist.id, { name: event.target.value })} className={inputClass} />
                      </Field>
                      <Field label="Gênero musical">
                        <input type="text" value={artist.genre ?? ''} onChange={(event) => update(artist.id, { genre: event.target.value })} className={inputClass} />
                      </Field>
                    </div>

                    <Field label="Resumo" hint="Aparece no card da página de artistas. Sem resumo, usamos o início da biografia.">
                      <textarea rows={2} value={artist.short_bio ?? ''} onChange={(event) => update(artist.id, { short_bio: event.target.value })} className={`${inputClass} resize-y`} />
                    </Field>
                    <Field label="Biografia" hint="Deixe uma linha em branco para separar parágrafos.">
                      <textarea rows={8} value={artist.bio ?? ''} onChange={(event) => update(artist.id, { bio: event.target.value })} className={`${inputClass} resize-y`} />
                    </Field>

                    <fieldset>
                      <legend className="text-sm font-semibold mb-2">Redes sociais</legend>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {socialFields.map(({ field, label }) => (
                          <Field key={field} label={label}>
                            <input type="url" value={artist[field] ?? ''} onChange={(event) => update(artist.id, { [field]: event.target.value })} className={inputClass} />
                          </Field>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className="text-sm font-semibold mb-2">Números exibidos no perfil</legend>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {followerFields.map(({ field, label }) => (
                          <Field key={field} label={label}>
                            <input
                              type="text"
                              value={artist.followers?.[field] ?? ''}
                              onChange={(event) => update(artist.id, { followers: { ...artist.followers, [field]: event.target.value } })}
                              placeholder="Ex: 2.6M"
                              className={inputClass}
                            />
                          </Field>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset className="space-y-3">
                      <legend className="text-sm font-semibold mb-2">Músicas populares</legend>
                      {songs.map((song, songIndex) => (
                        <div key={songIndex} className="flex items-start gap-2">
                          <div className="flex-1 grid sm:grid-cols-[2fr_2fr_1fr] gap-2">
                            <input type="text" aria-label="Título da música" placeholder="Título" value={song.title} onChange={(event) => updateSong(artist, songIndex, { title: event.target.value })} className={inputClass} />
                            <input type="text" aria-label="Álbum" placeholder="Álbum" value={song.album} onChange={(event) => updateSong(artist, songIndex, { album: event.target.value })} className={inputClass} />
                            <input type="text" aria-label="Reproduções" placeholder="Plays" value={song.plays} onChange={(event) => updateSong(artist, songIndex, { plays: event.target.value })} className={inputClass} />
                          </div>
                          <button type="button" aria-label={`Remover música ${song.title}`} onClick={() => update(artist.id, { songs: songs.filter((_, i) => i !== songIndex) })} className={removeRowClass}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => update(artist.id, { songs: [...songs, { title: '', album: '', plays: '' }] })} className={smallButtonClass}>
                        <Plus className="w-3.5 h-3.5" /> Adicionar música
                      </button>
                    </fieldset>

                    <fieldset className="space-y-3">
                      <legend className="text-sm font-semibold mb-2">Videoclipes</legend>
                      {videos.map((video, videoIndex) => (
                        <div key={videoIndex} className="flex items-start gap-2">
                          <div className="flex-1 grid sm:grid-cols-2 gap-2">
                            <input type="text" aria-label="Título do vídeo" placeholder="Título" value={video.title} onChange={(event) => updateVideo(artist, videoIndex, { title: event.target.value })} className={inputClass} />
                            <input type="url" aria-label="Link do YouTube" placeholder="Link do YouTube" value={video.url} onChange={(event) => updateVideo(artist, videoIndex, { url: event.target.value })} className={inputClass} />
                          </div>
                          <button type="button" aria-label={`Remover vídeo ${video.title}`} onClick={() => update(artist.id, { videos: videos.filter((_, i) => i !== videoIndex) })} className={removeRowClass}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => update(artist.id, { videos: [...videos, { title: '', url: '' }] })} className={smallButtonClass}>
                        <Plus className="w-3.5 h-3.5" /> Adicionar videoclipe
                      </button>
                    </fieldset>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {visibleArtists.length === 0 && (
          <div className="py-16 text-center border-2 border-dashed border-white/10 rounded-2xl">
            <Users className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/50">Nenhum artista encontrado.</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleAdd}
          className="w-full py-4 border-2 border-dashed border-white/10 hover:border-[#0EA8A0]/30 hover:bg-[#0EA8A0]/5 rounded-2xl flex items-center justify-center gap-2 text-white/50 hover:text-[#0EA8A0] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo artista
        </button>
      </div>
    </div>
  );
}
