import { useState, useEffect } from 'react';
import { fetchChannelVideos } from '../../../utils/youtube';

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
 * Extrai o nome do artista e da música do título do vídeo
 */
function parseVideoTitle(title: string): { artist: string; song: string } {
  const separators = [' - ', ' | ', ' – ', ' — '];
  
  for (const sep of separators) {
    if (title.includes(sep)) {
      const parts = title.split(sep);
      if (parts.length >= 2) {
        // Assume que o primeiro é a música e o segundo é o artista
        return {
          song: parts[0].trim(),
          artist: parts[1].trim()
        };
      }
    }
  }
  
  // Se não encontrar separador, assume que todo o título é a música
  return {
    song: title,
    artist: 'Céu Music'
  };
}

/**
 * Determina o tipo de lançamento baseado no título
 */
function getReleaseType(title: string): string {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('ep') || lowerTitle.includes('extended play')) {
    return 'EP';
  }
  if (lowerTitle.includes('álbum') || lowerTitle.includes('album')) {
    return 'Álbum';
  }
  return 'Single';
}

/**
 * Formata a data para exibir apenas o ano
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.getFullYear().toString();
}

/**
 * Gera a URL da thumbnail do YouTube em alta qualidade
 */
function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export default function ReleasesSection() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle do canal do YouTube da gravadora
  const channelHandle = '@ceumusicbrasil';

  useEffect(() => {
    let isMounted = true; // Flag para evitar atualizações após desmontagem

    async function loadReleases() {
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      
      if (!apiKey) {
        if (isMounted) {
          setError('API Key do YouTube não configurada. Configure VITE_YOUTUBE_API_KEY no arquivo .env');
          setLoading(false);
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
        setError(null);
      }

      try {
        // Busca os últimos 6 vídeos do canal
        const videos = await fetchChannelVideos(channelHandle, 6);
        
        if (!isMounted) return; // Evita atualização se componente foi desmontado
        
        if (videos.length === 0) {
          setError('Nenhum lançamento encontrado no canal');
          setReleases([]);
          setLoading(false);
          return;
        }

        // Converte os vídeos do YouTube para o formato de releases
        const formattedReleases: Release[] = videos.map((video) => {
          const { song, artist } = parseVideoTitle(video.title);
          const thumbnail = video.thumbnail || getYouTubeThumbnail(video.id);
          
          return {
            id: video.id,
            title: song,
            artist: artist,
            cover: thumbnail,
            type: getReleaseType(video.title),
            date: formatDate(video.publishedAt),
            streamingLink: `https://www.youtube.com/watch?v=${video.id}`
          };
        });

        if (isMounted) {
          setReleases(formattedReleases);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        if (!isMounted) return; // Evita atualização se componente foi desmontado
        
        // Loga apenas erros não relacionados a conexão ou cota para debug
        if (err instanceof Error && 
            !err.message.includes('conexão') && 
            !err.message.includes('internet') &&
            !err.message.includes('cota') &&
            !err.message.includes('quota')) {
          console.error('Erro ao carregar lançamentos:', err);
        }
        
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar lançamentos';
        
        if (isMounted) {
          // Mensagem amigável para limite de cota
          if (errorMessage.includes('cota') || errorMessage.includes('quota')) {
            setError('Limite de visualizações da API do YouTube atingido hoje. Os lançamentos estarão disponíveis novamente amanhã.');
          } else {
            setError(errorMessage);
          }
          setReleases([]);
          setLoading(false);
        }
      }
    }

    loadReleases();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [channelHandle]);
  return (
    <section className="px-6 py-20 lg:px-12 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-6xl lg:text-7xl mb-4 font-montserrat">
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
            <p className="text-gray-400 text-sm font-montserrat">
              Verifique se a API Key do YouTube está configurada no arquivo .env
            </p>
          </div>
        )}

        {!loading && !error && releases.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4" data-product-shop>
            {releases.map((release) => (
              <div
                key={release.id}
                onClick={() => window.open(release.streamingLink, '_blank', 'noopener,noreferrer')}
                className="glass-card animate-liquid-glass rounded-2xl overflow-hidden hover:border-[#C45C2F]/50 transition-all duration-500 group cursor-pointer w-96 h-24 mx-auto"
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
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      {/* Título e Artista */}
                      <h3 className="text-[11px] sm:text-sm md:text-[15px] font-bold mb-1 font-montserrat text-white group-hover:text-[#C45C2F] transition-colors duration-300 line-clamp-2">
                        {release.title}
                      </h3>
                      <p className="text-gray-400 font-montserrat text-[8px] sm:text-[10px] md:text-[11px] mb-2.5 line-clamp-2">
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
