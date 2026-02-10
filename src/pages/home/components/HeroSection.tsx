import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../../../utils/supabase';
import Navbar from '../../../components/feature/Navbar';

// Mapeamento de artistas para redes sociais
const artistSocialLinks: { [key: string]: { instagram?: string; spotify?: string; youtube?: string } } = {
  'Alexsander Lúcio': {
    instagram: 'https://www.instagram.com/alexlucio.ofc/',
    spotify: 'https://open.spotify.com/artist/2xX3xodC7zA5u2xygCWzuP',
    youtube: null
  },
  'No Santuário feat. Geziel Lima': {
    instagram: 'https://www.instagram.com/nosantuario/',
    spotify: 'https://open.spotify.com/intl-pt/artist/3qkhpijMzbtVFexHZTNoai',
    youtube: 'https://www.youtube.com/watch?v=XWBgmBsxkk4&list=RDXWBgmBsxkk4&start_radio=1'
  },
  'Na Graça': {
    instagram: 'https://www.instagram.com/nagracaoficial/',
    spotify: 'https://open.spotify.com/intl-pt/artist/7pmvHrURMH0OqDcXXQiuYX',
    youtube: null
  },
  'Debora Lopes': {
    instagram: 'https://www.instagram.com/deboralopesoficiall/',
    spotify: 'https://open.spotify.com/intl-pt/artist/3GPJu7XtFtUYUKI5qcooml',
    youtube: 'https://www.youtube.com/watch?v=V1hYFBtdxm8&list=RDV1hYFBtdxm8&start_radio=1'
  }
};

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
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mouseMoveTimeoutRef = useRef<number | null>(null);
  
  // Memoizar o índice do vídeo com hover para evitar recálculos
  const hoveredIndex = useMemo(() => {
    return hoveredVideoId ? videos.findIndex(v => v.id === hoveredVideoId) : -1;
  }, [hoveredVideoId, videos]);
  
  // Função para calcular a escala baseada na distância do botão com hover (memoizada)
  const getButtonScale = useCallback((videoId: string, videoIndex: number) => {
    if (!hoveredVideoId || hoveredIndex === -1) {
      // Se nenhum botão está com hover, retorna escala baseada na seleção
      return selectedVideoId === videoId ? 1.15 : 1;
    }
    
    const distance = Math.abs(videoIndex - hoveredIndex);
    
    if (videoId === hoveredVideoId) {
      // Botão com hover fica grande
      return 1.4;
    } else {
      // Botões adjacentes diminuem de forma decrescente
      // Quanto maior a distância, menor o botão
      const scale = Math.max(0.6, 1 - (distance * 0.15));
      return scale;
    }
  }, [hoveredVideoId, hoveredIndex, selectedVideoId]);
  
  // Função para calcular o tilt 3D baseado na posição do mouse (com throttle)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // Throttle: só executa a cada 16ms (aproximadamente 60fps)
    if (mouseMoveTimeoutRef.current) {
      return;
    }
    
    mouseMoveTimeoutRef.current = window.setTimeout(() => {
      mouseMoveTimeoutRef.current = null;
    }, 16);
    
    const videoId = e.currentTarget.getAttribute('data-video-id');
    if (selectedVideoId === videoId && !hoveredVideoId) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; // Inclinação vertical
    const rotateY = ((x - centerX) / centerX) * 10; // Inclinação horizontal
    
    const videoIndex = videos.findIndex(v => v.id === videoId);
    const scale = getButtonScale(videoId || '', videoIndex);
    e.currentTarget.style.transform = `scale(${scale}) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, [selectedVideoId, hoveredVideoId, videos, getButtonScale]);
  
  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const videoId = e.currentTarget.getAttribute('data-video-id');
    setHoveredVideoId(null);
    
    if (selectedVideoId === videoId) {
      e.currentTarget.style.transform = 'scale(1.15) translateY(-8px)';
    } else {
      e.currentTarget.style.transform = 'scale(1) translateY(0)';
    }
  }, [selectedVideoId]);
  
  // Função auxiliar para calcular opacidade (sem hooks)
  const getButtonOpacity = useCallback((videoId: string, index: number, isSelected: boolean, isHovered: boolean) => {
    if (!hoveredVideoId || hoveredIndex === -1) {
      return isSelected ? 1 : 0.75;
    }
    if (isHovered) {
      return 1;
    }
    const distance = Math.abs(index - hoveredIndex);
    return Math.max(0.4, 1 - (distance * 0.15));
  }, [hoveredVideoId, hoveredIndex]);

  // Cleanup do timeout quando o componente desmontar
  useEffect(() => {
    return () => {
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current);
      }
    };
  }, []);

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
    <header className="relative w-full" style={{ margin: 0, padding: 0, border: 'none', outline: 'none', height: '100vh', width: '100vw', position: 'relative', top: 0, left: 0, right: 0, bottom: 0, overflow: 'visible' }}>
      {/* Navbar dentro do Hero */}
      <div className="absolute top-0 left-0 right-0 z-50" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <Navbar />
      </div>
      
      {/* Video Background */}
      <div className="absolute w-full h-full overflow-hidden z-0" style={{ margin: 0, padding: 0, border: 'none', outline: 'none', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', position: 'absolute', overflow: 'hidden' }}>
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-30 transition-opacity duration-500"
          style={{ 
            pointerEvents: 'none',
            width: '100vw',
            height: '100vh',
            margin: 0,
            padding: 0,
            border: 'none',
            outline: 'none',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            position: 'absolute',
          }}
        >
          {selectedVideo && (
            <>
              {/* Thumbnail como background (fallback) */}
              <div 
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-500"
                style={{
                  backgroundImage: selectedVideo.thumbnail_url 
                    ? `url(${selectedVideo.thumbnail_url})` 
                    : 'none',
                  filter: 'blur(20px) brightness(0.3)',
                  width: '100vw',
                  height: '100vh',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: youtubeVideoId ? 0 : 1,
                  margin: 0,
                  padding: 0,
                  border: 'none',
                  outline: 'none',
                  top: 0,
                  left: 0,
                }}
              >
                {selectedVideo.thumbnail_url && selectedVideo.order_index === 1 && (
                  <img
                    src={selectedVideo.thumbnail_url}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover opacity-0"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    width={1920}
                    height={1080}
                  />
                )}
              </div>
              
              {/* YouTube iframe como background (se disponível) */}
              {youtubeVideoId && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-1px',
                    left: '-1px',
                    right: '-1px',
                    bottom: '-1px',
                    width: 'calc(100vw + 2px)',
                    height: 'calc(100vh + 2px)',
                    overflow: 'hidden',
                    margin: 0,
                    padding: 0,
                    zIndex: 0,
                  }}
                >
                  <iframe
                    key={selectedVideo.id}
                    style={{
                      filter: 'brightness(0.7)',
                      pointerEvents: 'none',
                      border: 'none',
                      outline: 'none',
                      margin: 0,
                      padding: 0,
                      width: '100vw',
                      height: '56.25vw',
                      minHeight: '100vh',
                      minWidth: '177.77vh',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) translateZ(0)',
                      display: 'block',
                      zIndex: 0,
                      willChange: 'transform',
                    }}
                    src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${youtubeVideoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&start=0`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={selectedVideo.title}
                    frameBorder="0"
                    scrolling="no"
                  />
                </div>
              )}
              
              {/* Vídeo de fundo local (se disponível e não houver YouTube) */}
              {!youtubeVideoId && selectedVideo.video_url && (
                <video
                  key={selectedVideo.id}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    filter: 'brightness(0.7)',
                    width: '100vw',
                    height: '100vh',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    border: 'none',
                    outline: 'none',
                    margin: 0,
                    padding: 0,
                    minWidth: '100%',
                    minHeight: '100%',
                    display: 'block',
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
        <div className="absolute top-0 left-0 w-full h-full holographic-bg opacity-20" style={{ margin: 0, padding: 0, border: 'none', outline: 'none' }}></div>
        
        {/* Gradiente overlay para melhorar contraste */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 via-black/20 to-black/40" style={{ margin: 0, padding: 0, border: 'none', outline: 'none' }}></div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#0EA8A0]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C45C2F]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-[#A34528]/20 rounded-full blur-2xl"></div>
      </div>

      {/* Artist and Song Info - Bottom Left */}
      {selectedVideo && (() => {
        const socialLinks = artistSocialLinks[selectedVideo.artist];
        return (
          <div className="absolute bottom-24 sm:bottom-32 md:bottom-40 left-3 sm:left-6 z-50">
            <div className="bg-black/30 backdrop-blur-md rounded-lg p-3 sm:p-4 border border-white/10 shadow-xl w-[280px] sm:w-[360px] md:w-[420px] relative overflow-hidden group">
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0EA8A0]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer pointer-events-none"></div>
              <div className="relative z-10" style={{ pointerEvents: 'auto' }}>
                <div className="mb-2 sm:mb-2.5">
                  <p className="text-white/70 text-[9px] sm:text-[10px] md:text-xs mb-0.5 sm:mb-1 font-montserrat uppercase tracking-wider">
                    {selectedVideo.artist}
                  </p>
                  <h2 className="text-xs sm:text-sm md:text-base font-bold text-white font-montserrat leading-tight line-clamp-2">
                    {selectedVideo.title}
                  </h2>
                </div>
                
                {/* Social Links and Watch Button */}
                <div className="flex items-center justify-between gap-2 sm:gap-3" style={{ pointerEvents: 'auto' }}>
                {/* Social Links */}
                {socialLinks && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {socialLinks.instagram && (
                      <a
                        href={socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ pointerEvents: 'auto' }}
                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#E4405F]/20 hover:text-[#E4405F] transition-colors cursor-pointer relative z-30"
                        title="Instagram"
                      >
                        <i className="ri-instagram-line text-[10px] sm:text-xs" style={{ pointerEvents: 'none' }}></i>
                      </a>
                    )}
                    {socialLinks.spotify && (
                      <a
                        href={socialLinks.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ pointerEvents: 'auto' }}
                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#1DB954]/20 hover:text-[#1DB954] transition-colors cursor-pointer relative z-30"
                        title="Spotify"
                      >
                        <i className="ri-spotify-fill text-[10px] sm:text-xs" style={{ pointerEvents: 'none' }}></i>
                      </a>
                    )}
                    {socialLinks.youtube && (
                      <a
                        href={socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ pointerEvents: 'auto' }}
                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#FF0000]/20 hover:text-[#FF0000] transition-colors cursor-pointer relative z-30"
                        title="YouTube"
                      >
                        <i className="ri-youtube-fill text-[10px] sm:text-xs" style={{ pointerEvents: 'none' }}></i>
                      </a>
                    )}
                  </div>
                )}
                
                {/* Watch Button */}
                <a
                  href={selectedVideo.youtube_url || "https://www.youtube.com/@ceumusicbrasil"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ pointerEvents: 'auto' }}
                  className="flex-shrink-0 inline-flex items-center gap-1 bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(14,168,160,0.5)] hover:scale-105 font-montserrat text-[10px] sm:text-xs ml-auto relative z-30"
                >
                  <i className="ri-play-circle-fill text-xs sm:text-sm" style={{ pointerEvents: 'none' }}></i>
                  <span className="hidden sm:inline" style={{ pointerEvents: 'none' }}>Assista Agora!</span>
                  <span className="sm:hidden" style={{ pointerEvents: 'none' }}>Assistir</span>
                </a>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Video Cards - Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 z-50 px-3 sm:px-6 pb-4 sm:pb-6" style={{ paddingTop: '80px', overflow: 'visible', clipPath: 'none' }}>
        {loading ? (
          <div className="flex items-center justify-center py-6 sm:py-8">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-[#0EA8A0]"></div>
            <span className="ml-2 sm:ml-3 text-gray-400 text-sm sm:text-base">Carregando vídeos...</span>
          </div>
        ) : videos.length > 0 ? (
          <div className="flex gap-3 sm:gap-6 overflow-x-auto pb-2 scrollbar-hide items-center justify-center" style={{ overflowY: 'visible', overflowX: 'auto', clipPath: 'none', minHeight: '100px' }}>
            {videos.map((video, index) => {
              const isSelected = selectedVideoId === video.id;
              const isHovered = hoveredVideoId === video.id;
              const scale = getButtonScale(video.id, index);
              const opacity = getButtonOpacity(video.id, index, isSelected, isHovered);
              
              return (
              <button
                key={video.id}
                onClick={() => {
                  // Ao clicar, seleciona o vídeo para exibir como background
                  setSelectedVideoId(video.id);
                }}
                className={`group relative w-16 h-16 overflow-hidden flex-shrink-0 cursor-pointer ${
                  isSelected ? 'selected-video-button' : ''
                }`}
                data-video-id={video.id}
                style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  borderRadius: isSelected ? '8px' : '14px',
                  transform: isHovered 
                    ? `scale(${scale}) translateY(-8px)` 
                    : isSelected 
                      ? 'scale(1.15) translateY(-8px)' 
                      : `scale(${scale}) translateY(0)`,
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  opacity: opacity,
                  filter: isHovered || isSelected 
                    ? 'brightness(1.1)' 
                    : 'blur(0.3px) grayscale(20%) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform, opacity',
                }}
                onMouseEnter={() => {
                  setHoveredVideoId(video.id);
                  // Ao passar o mouse, seleciona o vídeo para preview
                  if (selectedVideoId !== video.id) {
                    setSelectedVideoId(video.id);
                  }
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Thumbnail */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0EA8A0]/20 to-[#C45C2F]/20">
                  <img
                    src={video.thumbnail_url || '/placeholder.jpg'}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading={video.order_index === 1 ? 'eager' : 'lazy'}
                    fetchPriority={video.order_index === 1 ? 'high' : 'auto'}
                    decoding="async"
                    width={64}
                    height={64}
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
                    <div className="bg-[#0EA8A0] rounded-lg p-1.5">
                      <i className="ri-play-fill text-white text-sm"></i>
                    </div>
                  </div>
                )}
                
                {/* Play Icon on Hover */}
                {selectedVideoId !== video.id && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/50 rounded-lg p-2 backdrop-blur-sm">
                      <i className="ri-play-fill text-white text-lg"></i>
                    </div>
                  </div>
                )}
              </button>
              );
            })}
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
