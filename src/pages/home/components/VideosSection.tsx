import { useState, useRef, useEffect, useCallback } from 'react';

// Mapeamento de artistas para redes sociais
const artistSocialLinks: { [key: string]: { instagram?: string; spotify?: string; youtube?: string } } = {
  'Alex Lúcio': {
    instagram: 'https://www.instagram.com/alexlucio.ofc/',
    spotify: 'https://open.spotify.com/artist/2xX3xodC7zA5u2xygCWzuP',
    youtube: null
  },
  'No Santuário': {
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

export default function VideosSection() {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [hoveredVideoId, setHoveredVideoId] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const videos = [
    {
      id: 1,
      title: 'Salva-vidas - Alexsander Lúcio',
      artist: 'Alex Lúcio',
      views: '271K',
      videoId: 'bdLeReQbtgY', // ID do YouTube
      thumbnail: `https://img.youtube.com/vi/bdLeReQbtgY/maxresdefault.jpg`,
      duration: '3:45'
    },
    {
      id: 2,
      title: 'Final Feliz - No Santuário feat Geziel Lima',
      artist: 'No Santuário',
      views: '1.8M',
      videoId: 'XWBgmBsxkk4', // ID do YouTube
      thumbnail: `https://img.youtube.com/vi/XWBgmBsxkk4/maxresdefault.jpg`,
      duration: '4:12'
    },
    {
      id: 3,
      title: 'Louva na Graça - Na Graça',
      artist: 'Na Graça',
      views: '45K',
      videoId: '5bvgSlZamBo', // ID do YouTube
      thumbnail: `https://img.youtube.com/vi/5bvgSlZamBo/maxresdefault.jpg`,
      duration: '5:20'
    },
    {
      id: 4,
      title: 'Milagres de Deus - Debora Lopes',
      artist: 'Debora Lopes',
      views: '233K',
      videoId: 'V1hYFBtdxm8', // ID do YouTube
      thumbnail: `https://img.youtube.com/vi/V1hYFBtdxm8/maxresdefault.jpg`,
      duration: '3:58'
    }
  ];

  // Define inicialmente o primeiro card como ativo
  useEffect(() => {
    if (videos.length > 0 && activeVideoId === null) {
      setActiveVideoId(videos[0].id);
    }
  }, [activeVideoId, videos]);

  const scrollCarousel = useCallback((direction: 'left' | 'right') => {
    if (!carouselRef.current) return;

    const container = carouselRef.current;
    const cardWidth = container.clientWidth * 0.7; // rola aproximadamente 70% da área visível
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  // Atualiza o card "ativo" (no centro) conforme o scroll do carrossel
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    let rafId: number | null = null;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          const containerCenter = container.scrollLeft + container.clientWidth / 2;

          let closestId: number | null = null;
          let closestDistance = Infinity;

          cardRefs.current.forEach((card, index) => {
            if (!card) return;
            const rect = card.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            const cardCenter = rect.left - containerRect.left + rect.width / 2 + container.scrollLeft;
            const distance = Math.abs(cardCenter - containerCenter);

            if (distance < closestDistance) {
              closestDistance = distance;
              closestId = videos[index]?.id ?? null;
            }
          });

          if (closestId !== null && closestId !== activeVideoId) {
            setActiveVideoId(closestId);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll(); // garante estado correto na primeira renderização

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [activeVideoId, videos]);

  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-[#1A1A1A] to-black">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#0EA8A0]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#A34528]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-[#C45C2F]/10 border border-[#C45C2F]/30 rounded-full text-[#C45C2F] text-xs sm:text-sm font-semibold mb-4 sm:mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Videoclipes
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Assista aos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C45C2F] to-[#0EA8A0]">Clipes</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            Produções audiovisuais de alta qualidade dos nossos artistas
          </p>
        </div>

        {/* Videos Carousel */}
        <div className="relative">
          {/* Controles do carrossel (desktop) */}
          <button
            type="button"
            onClick={() => scrollCarousel('left')}
            className="hidden md:flex absolute -left-6 top-1/2 z-20 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-black/70 border border-white/10 text-white hover:bg-black hover:border-[#C45C2F]/60 transition-all cursor-pointer"
          >
            <i className="ri-arrow-left-s-line text-xl" />
          </button>

          <button
            type="button"
            onClick={() => scrollCarousel('right')}
            className="hidden md:flex absolute -right-6 top-1/2 z-20 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-black/70 border border-white/10 text-white hover:bg-black hover:border-[#C45C2F]/60 transition-all cursor-pointer"
          >
            <i className="ri-arrow-right-s-line text-xl" />
          </button>

          <div
            ref={carouselRef}
            className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide"
          >
            {videos.map((video, index) => {
              const isActive = activeVideoId === video.id;
              const isHovered = hoveredVideoId === video.id;

              return (
                <div
                  key={video.id}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={`group cursor-pointer flex-shrink-0 snap-center w-[85vw] sm:w-[60vw] lg:w-[40vw] max-w-xl transition-all duration-500 ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-20 scale-90'
                  }`}
                  onClick={() => setSelectedVideo(video.id)}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-black border border-white/10 hover:border-[#C45C2F]/50 transition-all duration-500 hover:scale-105">
                    {/* Thumbnail / Preview */}
                    <div
                      className="relative aspect-video overflow-hidden"
                      onMouseEnter={() => setHoveredVideoId(video.id)}
                      onMouseLeave={() => setHoveredVideoId(null)}
                    >
                      {isHovered ? (
                        <div className="w-full h-full pointer-events-none">
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${video.videoId}`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          ></iframe>
                        </div>
                      ) : (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                        />
                      )}

                      {/* Gradient Overlay */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                      {/* Glow Border Effect */}
                      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 border-2 border-[#C45C2F]/50 rounded-2xl shadow-2xl shadow-[#C45C2F]/30" />
                      </div>

                      {/* Play Button (esconde durante o hover/preview) */}
                      {!isHovered && (
                        <div className="pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center bg-[#C45C2F]/90 backdrop-blur-sm rounded-full opacity-90 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 shadow-2xl shadow-[#C45C2F]/50">
                          <i className="ri-play-fill text-4xl text-white ml-1"></i>
                        </div>
                      )}

                      {/* Duration Badge */}
                      <div className="pointer-events-none absolute bottom-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-lg">
                        <span className="text-white text-xs font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {video.duration}
                        </span>
                      </div>

                      {/* Views Badge */}
                      <div className="pointer-events-none absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-lg flex items-center space-x-2">
                        <i className="ri-eye-fill text-[#0EA8A0] text-sm"></i>
                        <span className="text-white text-xs font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {video.views}
                        </span>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-6">
                      <h3
                        className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                          isActive ? 'text-white group-hover:text-[#C45C2F]' : 'text-white/80 group-hover:text-[#C45C2F]'
                        }`}
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {video.title}
                      </h3>
                      <p className="text-white/60 text-sm flex items-center space-x-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <i className="ri-user-voice-fill text-[#0EA8A0]"></i>
                        <span>{video.artist}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Video Modal */}
        {selectedVideo && (() => {
          const video = videos.find(v => v.id === selectedVideo);
          const socialLinks = video ? artistSocialLinks[video.artist] : null;
          
          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
              onClick={() => setSelectedVideo(null)}
            >
              <div className="relative w-full max-w-[90vw] lg:max-w-7xl bg-transparent backdrop-blur-md rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white hover:text-[#C45C2F] transition-colors cursor-pointer bg-black/70 backdrop-blur-sm rounded-full border border-gray-800/50"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
                
                {/* Video Player */}
                <div className="w-full aspect-video bg-black rounded-t-2xl overflow-hidden">
                  {video?.videoId ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
                      title="Video Player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <i className="ri-play-circle-fill text-8xl text-[#C45C2F] mb-4"></i>
                        <p className="text-white/70 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Vídeo em breve
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Info and Social Links */}
                {video && (
                  <div className="p-4 sm:p-6 bg-black/40 backdrop-blur-sm rounded-b-2xl">
                    <div className="mb-3">
                      <p className="text-white/60 text-xs sm:text-sm mb-1 uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {video.artist}
                      </p>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {video.title}
                      </h3>
                    </div>
                    
                    {/* Social Links */}
                    {socialLinks && (
                      <div className="flex items-center gap-2 sm:gap-3">
                        {socialLinks.instagram && (
                          <a
                            href={socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#E4405F]/20 hover:text-[#E4405F] transition-colors cursor-pointer text-sm sm:text-base"
                            title="Instagram"
                          >
                            <i className="ri-instagram-line"></i>
                          </a>
                        )}
                        {socialLinks.spotify && (
                          <a
                            href={socialLinks.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#1DB954]/20 hover:text-[#1DB954] transition-colors cursor-pointer text-sm sm:text-base"
                            title="Spotify"
                          >
                            <i className="ri-spotify-fill"></i>
                          </a>
                        )}
                        {socialLinks.youtube && (
                          <a
                            href={socialLinks.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#FF0000]/20 hover:text-[#FF0000] transition-colors cursor-pointer text-sm sm:text-base"
                            title="YouTube"
                          >
                            <i className="ri-youtube-fill"></i>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}