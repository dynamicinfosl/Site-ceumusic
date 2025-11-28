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
}

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

        // Buscar vídeos do Supabase
        const { data, error: fetchError } = await supabase
          .from('hero_videos')
          .select('*')
          .order('order_index', { ascending: true });

        if (fetchError) {
          console.error('Erro ao buscar vídeos:', fetchError);
          throw fetchError;
        }

        if (data && data.length > 0) {
          setVideos(data);
          setSelectedVideoId(data[0].id);
        } else {
          setError('Nenhum vídeo encontrado');
        }
      } catch (err) {
        console.error('Erro ao carregar vídeos:', err);
        setError('Erro ao carregar vídeos do servidor');
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, []);

  const selectedVideo = videos.find(v => v.id === selectedVideoId);

  return (
    <header className="relative min-h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div 
          className="absolute inset-0 opacity-40"
          style={{ 
            pointerEvents: 'none',
          }}
        >
          {selectedVideo && (
            <video
              key={selectedVideo.id}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={selectedVideo.video_url} type="video/mp4" />
              Seu navegador não suporta vídeos HTML5.
            </video>
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
              href="https://www.youtube.com/@ceumusicbrasil"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-white px-3 py-1.5 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(14,168,160,0.5)] hover:scale-105 font-montserrat text-[10px]"
            >
              <i className="ri-play-circle-fill text-sm"></i>
              Ouça Agora!
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
