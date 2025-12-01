import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase';

interface HeroVideo {
  id: string;
  title: string;
  artist: string;
  video_url: string;
  thumbnail_url: string | null;
  duration: number | null;
  order_index: number;
  youtube_url?: string;
}

// Dados mock para quando o Supabase não estiver configurado
const MOCK_VIDEOS: HeroVideo[] = [
  {
    id: '1',
    title: 'Final Feliz - No Santuário',
    artist: 'No Santuário feat. Geziel Lima',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail_url: 'https://img.youtube.com/vi/XWBgmBsxkk4/maxresdefault.jpg',
    duration: 252,
    order_index: 1,
    youtube_url: 'https://www.youtube.com/watch?v=XWBgmBsxkk4'
  },
  {
    id: '2',
    title: 'Salva-vidas',
    artist: 'Alexsander Lúcio',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail_url: 'https://img.youtube.com/vi/bdLeReQbtgY/maxresdefault.jpg',
    duration: 200,
    order_index: 2,
    youtube_url: 'https://www.youtube.com/watch?v=bdLeReQbtgY'
  },
  {
    id: '3',
    title: 'Louva na Graça',
    artist: 'Na Graça',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail_url: 'https://img.youtube.com/vi/5bvgSlZamBo/maxresdefault.jpg',
    duration: 160,
    order_index: 3,
    youtube_url: 'https://www.youtube.com/watch?v=5bvgSlZamBo'
  },
  {
    id: '4',
    title: 'O Fogo Arderá - Ao Vivo',
    artist: 'Alexsander Lúcio',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail_url: 'https://img.youtube.com/vi/Bqc6B5LzTN0/maxresdefault.jpg',
    duration: 240,
    order_index: 4,
    youtube_url: 'https://www.youtube.com/watch?v=Bqc6B5LzTN0'
  },
  {
    id: '5',
    title: 'A FÉ - AO VIVO',
    artist: 'Na Graça',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail_url: 'https://img.youtube.com/vi/g89eBxkG-Aw/maxresdefault.jpg',
    duration: 180,
    order_index: 5,
    youtube_url: 'https://www.youtube.com/watch?v=g89eBxkG-Aw'
  },
  {
    id: '6',
    title: 'Milagres de Deus',
    artist: 'Debora Lopes',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    thumbnail_url: 'https://img.youtube.com/vi/V1hYFBtdxm8/maxresdefault.jpg',
    duration: 195,
    order_index: 6,
    youtube_url: 'https://www.youtube.com/watch?v=V1hYFBtdxm8'
  }
];

export default function HeroSection() {
  const [videos, setVideos] = useState<HeroVideo[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideos() {
      try {
        setLoading(true);
        setError(null);

        // Verificar se o Supabase está configurado
        if (!supabase) {
          console.warn('Supabase não está configurado. Usando dados mock.');
          // Usar dados mock quando o Supabase não estiver configurado
          setVideos(MOCK_VIDEOS);
          setSelectedVideoId(MOCK_VIDEOS[0].id);
          setLoading(false);
          return;
        }

        // Buscar vídeos do Supabase
        const { data, error: fetchError } = await supabase
          .from('hero_videos')
          .select('*')
          .order('order_index', { ascending: true });

        if (fetchError) {
          console.warn('Erro ao buscar vídeos do Supabase. Usando dados mock:', fetchError);
          // Usar dados mock em caso de erro
          setVideos(MOCK_VIDEOS);
          setSelectedVideoId(MOCK_VIDEOS[0].id);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          setVideos(data);
          setSelectedVideoId(data[0].id);
        } else {
          console.warn('Nenhum vídeo encontrado no Supabase. Usando dados mock.');
          // Usar dados mock quando não houver dados
          setVideos(MOCK_VIDEOS);
          setSelectedVideoId(MOCK_VIDEOS[0].id);
        }
      } catch (err) {
        console.warn('Erro ao carregar vídeos. Usando dados mock:', err);
        // Usar dados mock em caso de erro inesperado
        setVideos(MOCK_VIDEOS);
        setSelectedVideoId(MOCK_VIDEOS[0].id);
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, []);

  const selectedVideo = videos.find(v => v.id === selectedVideoId);

  // Função para extrair o ID do vídeo do YouTube a partir da URL
  const getYouTubeVideoId = (url?: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeVideoId = selectedVideo ? getYouTubeVideoId(selectedVideo.youtube_url) : null;

  return (
    <header className="relative min-h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div 
          className="absolute inset-0 opacity-40 transition-opacity duration-500"
          style={{ 
            pointerEvents: 'none',
          }}
        >
          {selectedVideo && (
            <>
              {/* Thumbnail como background (fallback) */}
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-500"
                style={{
                  backgroundImage: selectedVideo.thumbnail_url 
                    ? `url(${selectedVideo.thumbnail_url})` 
                    : 'none',
                  filter: 'blur(20px) brightness(0.3)',
                  transform: 'scale(1.1)',
                  opacity: youtubeVideoId ? 0 : 1,
                }}
              />
              
              {/* YouTube iframe como background (se disponível) */}
              {youtubeVideoId && (
                <iframe
                  key={selectedVideo.id}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    filter: 'brightness(0.4)',
                    pointerEvents: 'none',
                    transform: 'scale(1.1)',
                  }}
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${youtubeVideoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={selectedVideo.title}
                />
              )}
              
              {/* Vídeo de fundo local (se disponível e não houver YouTube) */}
              {!youtubeVideoId && selectedVideo.video_url && (
                <video
                  key={selectedVideo.id}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    filter: 'brightness(0.4)',
                  }}
                >
                  <source src={selectedVideo.video_url} type="video/mp4" />
                  Seu navegador não suporta vídeos HTML5.
                </video>
              )}
            </>
          )}
        </div>
        {/* Holographic Canvas Overlay - Efeito Liquid Glass */}
        <div className="absolute inset-0 holographic-bg opacity-30"></div>
        
        {/* Gradiente overlay para melhorar contraste */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#0EA8A0]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C45C2F]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-[#A34528]/20 rounded-full blur-2xl"></div>
      </div>

      {/* Artist and Song Info - Bottom Left */}
      {selectedVideo && (
        <div className="absolute bottom-40 left-6 z-50">
          <div className="bg-black/40 backdrop-blur-md rounded-lg p-2.5 border border-white/10 shadow-xl max-w-[200px]">
            <p className="text-white/70 text-[8px] mb-0.5 font-montserrat uppercase tracking-wider">
              {selectedVideo.artist}
            </p>
            <h2 className="text-sm font-bold text-white mb-2 font-montserrat leading-tight line-clamp-2">
              {selectedVideo.title}
            </h2>
            <a
              href={selectedVideo.youtube_url || "https://www.youtube.com/@ceumusicbrasil"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-white px-3 py-1.5 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(14,168,160,0.5)] hover:scale-105 font-montserrat text-[10px]"
            >
              <i className="ri-play-circle-fill text-sm"></i>
              Assista Agora!
            </a>
          </div>
        </div>
      )}

      {/* Video Cards - Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 z-50 px-6 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0EA8A0]"></div>
            <span className="ml-3 text-gray-400">Carregando vídeos...</span>
          </div>
        ) : videos.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide items-end">
            {videos.map((video) => (
              <button
                key={video.id}
                onClick={() => {
                  // Ao clicar, seleciona o vídeo para exibir como background
                  setSelectedVideoId(video.id);
                }}
                onMouseEnter={() => {
                  // Ao passar o mouse, seleciona o vídeo para preview
                  setSelectedVideoId(video.id);
                }}
                className={`group relative w-16 h-16 rounded-full overflow-hidden transition-all duration-300 flex-shrink-0 cursor-pointer ${
                  selectedVideoId === video.id
                    ? 'ring-3 ring-[#0EA8A0] ring-offset-2 ring-offset-black/50 scale-110'
                    : 'hover:scale-110 opacity-80 hover:opacity-100'
                }`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                title={`Assistir: ${video.title}`}
              >
                {/* Thumbnail */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0EA8A0]/20 to-[#C45C2F]/20">
                  <img
                    src={video.thumbnail_url || '/placeholder.jpg'}
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
                
                {/* Selected Indicator / Play Icon */}
                {selectedVideoId === video.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0EA8A0]/20 backdrop-blur-sm">
                    <div className="bg-[#0EA8A0] rounded-full p-1.5">
                      <i className="ri-play-fill text-white text-sm"></i>
                    </div>
                  </div>
                )}
                
                {/* Play Icon on Hover */}
                {selectedVideoId !== video.id && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/50 rounded-full p-2 backdrop-blur-sm">
                      <i className="ri-play-fill text-white text-lg"></i>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto py-4 px-4 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur-sm">
            <p className="text-red-400 text-sm mb-2 text-center font-semibold">Erro ao carregar vídeos</p>
            <p className="text-xs text-gray-400 text-center mb-2">
              {error}
            </p>
          </div>
        ) : null}
      </div>
    </header>
  );
}
