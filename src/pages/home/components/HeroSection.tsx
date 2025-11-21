import { useState, useEffect } from 'react';
import { fetchChannelVideos, type YouTubeVideo } from '../../../utils/youtube';

/**
 * Gera a URL da thumbnail do YouTube a partir do ID do vídeo
 */
function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

/**
 * Extrai o nome do artista e da música do título do vídeo
 */
function parseVideoTitle(title: string): { artist: string; song: string } {
  // Tenta diferentes padrões comuns de títulos do YouTube
  // Padrão 1: "Nome da Música - Nome do Artista"
  // Padrão 2: "Nome do Artista - Nome da Música"
  // Padrão 3: "Nome da Música | Nome do Artista"
  // Padrão 4: "Nome do Artista | Nome da Música"
  
  const separators = [' - ', ' | ', ' – ', ' — '];
  
  for (const sep of separators) {
    if (title.includes(sep)) {
      const parts = title.split(sep);
      if (parts.length >= 2) {
        // Assume que o primeiro é a música e o segundo é o artista
        // Mas também tenta o contrário se parecer mais lógico
        const part1 = parts[0].trim();
        const part2 = parts.slice(1).join(sep).trim();
        
        // Se a segunda parte for mais curta, provavelmente é o artista
        if (part2.length < part1.length && part2.length < 30) {
          return { artist: part2, song: part1 };
        }
        return { artist: part2, song: part1 };
      }
    }
  }
  
  // Se não encontrar separador, retorna o título completo como música
  return { artist: 'Céu Music', song: title };
}


export default function HeroSection() {
  const channelHandle = '@ceumusicbrasil';
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    async function loadVideos() {
      // Tenta diferentes formas de acessar a variável de ambiente
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || 
                     import.meta.env?.VITE_YOUTUBE_API_KEY ||
                     (window as any).__VITE_YOUTUBE_API_KEY__;
      
      console.log('=== DEBUG API KEY ===');
      console.log('import.meta.env:', import.meta.env);
      console.log('VITE_YOUTUBE_API_KEY:', import.meta.env.VITE_YOUTUBE_API_KEY);
      console.log('API Key presente:', !!apiKey);
      console.log('API Key length:', apiKey?.length || 0);
      console.log('====================');
      
      setHasApiKey(!!apiKey);

      // Se não houver API key, mostra erro
      if (!apiKey) {
        console.warn('API Key não encontrada. Configure VITE_YOUTUBE_API_KEY no arquivo .env');
        setError('API Key não configurada. Reinicie o servidor após configurar o arquivo .env');
        setVideos([]);
        setSelectedVideoId('');
        setLoading(false);
        return;
      }

      // Se houver API key, tenta buscar os vídeos do canal
      setLoading(true);
      setError(null);
      console.log('Buscando vídeos do canal:', channelHandle);
      
      try {
        const channelVideos = await fetchChannelVideos(channelHandle, 50);
        console.log('Vídeos retornados:', channelVideos.length);
        
        if (channelVideos.length > 0) {
          // Garante que todos os vídeos tenham thumbnail
          const videosWithThumbnails = channelVideos.map(video => ({
            ...video,
            thumbnail: video.thumbnail || getYouTubeThumbnail(video.id)
          }));
          console.log('Vídeos carregados com sucesso:', videosWithThumbnails.length);
          setVideos(videosWithThumbnails);
          setSelectedVideoId(videosWithThumbnails[0].id);
        } else {
          // Se não conseguir buscar, mostra erro
          console.warn('Nenhum vídeo encontrado no canal:', channelHandle);
          setVideos([]);
          setSelectedVideoId('');
          setError('Nenhum vídeo encontrado no canal @ceumusicbrasil. Verifique se o canal existe e tem vídeos públicos.');
        }
      } catch (err) {
        console.error('Erro ao carregar vídeos:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(`Erro ao carregar vídeos do canal: ${errorMessage}. Verifique o console para mais detalhes.`);
        setVideos([]);
        setSelectedVideoId('');
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, [channelHandle]);

  return (
    <header className="relative min-h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        <div 
          className="absolute inset-0 opacity-40 youtube-background-wrapper"
          style={{ 
            pointerEvents: 'none',
          }}
        >
          {selectedVideoId && (
            <iframe
              key={selectedVideoId}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&loop=1&playlist=${selectedVideoId}&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&playsinline=1&enablejsapi=1`}
              title="Background Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
        {/* Holographic Canvas Overlay - Efeito Liquid Glass */}
        <div className="absolute inset-0 holographic-bg opacity-30"></div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#0EA8A0]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C45C2F]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-[#A34528]/20 rounded-full blur-2xl"></div>
      </div>

      {/* Artist and Song Info - Bottom Left */}
      {selectedVideoId && videos.length > 0 && (() => {
        const selectedVideo = videos.find(v => v.id === selectedVideoId);
        if (!selectedVideo) return null;
        const { artist, song } = parseVideoTitle(selectedVideo.title);
        
        return (
          <div className="absolute bottom-40 left-6 z-50">
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-2.5 border border-white/10 shadow-xl max-w-[200px]">
              <p className="text-white/70 text-[8px] mb-0.5 font-montserrat uppercase tracking-wider">
                {artist}
              </p>
              <h2 className="text-sm font-bold text-white mb-2 font-montserrat leading-tight line-clamp-2">
                {song}
              </h2>
              <a
                href={`https://www.youtube.com/watch?v=${selectedVideoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-white px-3 py-1.5 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(14,168,160,0.5)] hover:scale-105 font-montserrat text-[10px]"
              >
                <i className="ri-play-circle-fill text-sm"></i>
                Ouça Agora!
              </a>
            </div>
          </div>
        );
      })()}

      {/* Video Cards - Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 z-50 px-6 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0EA8A0]"></div>
            <span className="ml-3 text-gray-400">Carregando vídeos do canal...</span>
          </div>
        ) : videos.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide items-end">
            {videos.map((video) => (
              <button
                key={video.id}
                onClick={() => setSelectedVideoId(video.id)}
                className={`group relative w-16 h-16 rounded-full overflow-hidden transition-all duration-300 flex-shrink-0 ${
                  selectedVideoId === video.id
                    ? 'ring-3 ring-[#0EA8A0] ring-offset-2 ring-offset-black/50 scale-110'
                    : 'hover:scale-110 opacity-80 hover:opacity-100'
                }`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {/* Thumbnail */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0EA8A0]/20 to-[#C45C2F]/20">
                  <img
                    src={video.thumbnail || getYouTubeThumbnail(video.id)}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback caso a imagem não carregue
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-black/40"><i class="ri-play-circle-line text-2xl text-white/50"></i></div>';
                      }
                    }}
                  />
                </div>
                
                {/* Overlay */}
                <div className={`absolute inset-0 bg-black/30 transition-opacity ${
                  selectedVideoId === video.id ? 'opacity-0' : 'opacity-50 group-hover:opacity-30'
                }`}></div>
                
                {/* Selected Indicator */}
                {selectedVideoId === video.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0EA8A0]/20 backdrop-blur-sm">
                    <div className="bg-[#0EA8A0] rounded-full p-1.5">
                      <i className="ri-check-line text-white text-sm"></i>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto py-4 px-4 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur-sm">
            <p className="text-red-400 text-sm mb-2 text-center font-semibold">Erro ao carregar vídeos do YouTube</p>
            <p className="text-xs text-gray-400 text-center mb-2">
              {error}
            </p>
            {!hasApiKey && (
              <p className="text-xs text-yellow-400 text-center">
                Reinicie o servidor (npm run dev) para carregar a API key do arquivo .env
              </p>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}
