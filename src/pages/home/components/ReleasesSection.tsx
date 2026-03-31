import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase';

interface Release {
  id: string;
  title: string;
  artist: string;
  cover: string;
  type: string;
  date: string;
  streamingLink: string;
}

/**
 * Gera a URL da thumbnail do YouTube em alta qualidade
 */
function getYouTubeThumbnail(videoId: string): string {
  // Se for um link completo, tenta extrair o ID
  if (videoId.includes('youtube.com') || videoId.includes('youtu.be')) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = videoId.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : videoId;
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export default function ReleasesSection() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReleases() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data, error: fetchError } = await supabase
          .from('releases')
          .select('*')
          .order('order_index', { ascending: true });

        if (fetchError) throw fetchError;

        if (data) {
          const mapped: Release[] = data.map(r => ({
            id: r.id,
            title: r.title,
            artist: r.artist_name,
            cover: r.cover_url || 'https://via.placeholder.com/300',
            type: r.release_type,
            date: r.release_date || '',
            streamingLink: r.streaming_link || '#'
          }));
          setReleases(mapped);
        }
      } catch (err) {
        console.error('Erro ao buscar lançamentos:', err);
        setError('Não foi possível carregar os lançamentos.');
      } finally {
        setLoading(false);
      }
    }
    fetchReleases();
  }, []);
  return (
    <section className="px-4 sm:px-6 py-12 sm:py-16 lg:py-20 lg:px-12 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12 lg:mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-4 font-montserrat">
            Últimos <span className="text-[#0EA8A0]">Lançamentos</span>
          </h2>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0EA8A0]"></div>
            <p className="text-gray-400 mt-4 font-montserrat">Carregando lançamentos...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-400 font-montserrat mb-2">{error}</p>
          </div>
        )}

        {!loading && !error && releases.length > 0 && (
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4" data-product-shop>
            {releases.map((release) => (
              <div
                key={release.id}
                onClick={() => window.open(release.streamingLink, '_blank', 'noopener,noreferrer')}
                className="glass-card animate-liquid-glass rounded-2xl overflow-hidden hover:border-[#C45C2F]/50 transition-all duration-500 group cursor-pointer w-full max-w-sm sm:max-w-md md:w-96 h-20 sm:h-24 mx-auto"
              >
                {/* Layout Horizontal: Foto à Esquerda, Informações à Direita */}
                <div className="flex flex-col sm:flex-row h-full">
                  {/* Foto do Lançamento - Lado Esquerdo */}
                  <div className="w-full sm:w-32 h-full flex-shrink-0">
                    <div className="relative w-full h-full border-r border-gray-800/50 group-hover:border-[#C45C2F]/30 transition-all duration-500 overflow-hidden">
                      <img
                        src={release.cover}
                        alt={release.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback para thumbnail padrão se a imagem falhar
                          const target = e.target as HTMLImageElement;
                          target.src = getYouTubeThumbnail(release.id);
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[#0EA8A0] shadow-lg">
                          <i className="ri-play-fill text-xl"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informações - Lado Direito */}
                  <div className="flex-1 p-2 sm:p-3 flex flex-col justify-between">
                    <div>
                      {/* Título e Artista */}
                      <h3 className="text-xs sm:text-sm md:text-[15px] font-bold mb-0.5 sm:mb-1 font-montserrat text-white group-hover:text-[#C45C2F] transition-colors duration-300 line-clamp-2">
                        {release.title}
                      </h3>
                      <p className="text-gray-400 font-montserrat text-[9px] sm:text-[10px] md:text-[11px] mb-1.5 sm:mb-2.5 line-clamp-2">
                        {release.artist}
                      </p>
                    </div>

                    {/* Ação no card ocorre pelo clique geral */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && releases.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-montserrat">Nenhum lançamento disponível no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
}
