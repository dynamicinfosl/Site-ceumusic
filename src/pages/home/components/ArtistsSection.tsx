import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';

// Artistas da Céu Music
const artists = [
  {
    id: 1,
    name: 'Alex Lucio',
    genre: 'Gospel/CCM',
    image: '/artistas/alex-lucio/IMG_3735.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/alexlucio.ofc/',
      spotify: 'https://open.spotify.com/artist/2xX3xodC7zA5u2xygCWzuP',
      youtube: null, // Adicione o link do YouTube se disponível
      tiktok: null,
      twitter: null,
      facebook: null,
    },
    musicLinks: [
      { platform: 'Spotify', url: 'https://open.spotify.com/artist/2xX3xodC7zA5u2xygCWzuP' },
      // Adicione outros links de streaming quando disponíveis
    ],
  },
  {
    id: 10,
    name: 'Na Graça',
    genre: 'Gospel/CCM',
    image: '/artistas/na graca/na graca.png',
    socialLinks: {
      instagram: 'https://www.instagram.com/nagracaoficial/',
      spotify: 'https://open.spotify.com/intl-pt/artist/7pmvHrURMH0OqDcXXQiuYX',
      youtube: null,
      tiktok: null,
      twitter: null,
      facebook: null,
    },
    musicLinks: [
      {
        platform: 'Spotify',
        url: 'https://open.spotify.com/intl-pt/artist/7pmvHrURMH0OqDcXXQiuYX',
      },
    ],
  },
  {
    id: 15,
    name: 'Maria Pita',
    genre: 'Gospel/CCM',
    image: '/artistas/maria-pita/IMG_4240.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/mariapitacantora_/',
      spotify: 'https://open.spotify.com/intl-pt/artist/7fw7DfkvI0fMyEKfOw0k6n',
      youtube: null,
      tiktok: null,
      twitter: null,
      facebook: null,
    },
    musicLinks: [
      {
        platform: 'Spotify',
        url: 'https://open.spotify.com/intl-pt/artist/7fw7DfkvI0fMyEKfOw0k6n',
      },
    ],
  },
  {
    id: 13,
    name: 'Caio Torres',
    genre: 'Gospel/CCM',
    image: '/artistas/caio-torres/IMG_0273.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/caiotorees/',
      spotify: 'https://open.spotify.com/intl-pt/artist/3TOPRsT6nYECZi9K9yZZXw',
      youtube: null,
      tiktok: null,
      twitter: null,
      facebook: null,
    },
    musicLinks: [
      {
        platform: 'Spotify',
        url: 'https://open.spotify.com/intl-pt/artist/3TOPRsT6nYECZi9K9yZZXw',
      },
    ],
  },
  {
    id: 11,
    name: 'No Santuário',
    genre: 'Gospel/CCM',
    image: '/artistas/no%20santuario/IMG_0090.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/nosantuario/',
      spotify: 'https://open.spotify.com/intl-pt/artist/3qkhpijMzbtVFexHZTNoai',
      youtube: null,
      tiktok: null,
      twitter: null,
      facebook: null,
    },
    musicLinks: [
      {
        platform: 'Spotify',
        url: 'https://open.spotify.com/intl-pt/artist/3qkhpijMzbtVFexHZTNoai',
      },
    ],
  },
  {
    id: 14,
    name: 'Nicole Lavinia',
    genre: 'Gospel/CCM',
    image: '/artistas/nicole-lavinia/IMG_3996.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/nicolelaviniaoficial_/',
      spotify: 'https://open.spotify.com/intl-pt/track/0AayU24085eVhLhbk27sTE',
      youtube: null,
      tiktok: null,
      twitter: null,
      facebook: null,
    },
    musicLinks: [
      {
        platform: 'Spotify',
        url: 'https://open.spotify.com/intl-pt/track/0AayU24085eVhLhbk27sTE',
      },
    ],
  },
  {
    id: 16,
    name: 'William Soares',
    genre: 'Gospel/CCM',
    image: '/artistas/william-soares/IMG_4092.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/williaamsoarees/',
      spotify: null,
      youtube: null,
      tiktok: null,
      twitter: null,
      facebook: null,
    },
    musicLinks: [],
  },
  {
    id: 17,
    name: 'Martinha',
    genre: 'Gospel/CCM',
    image: '/artistas/martinha/Gemini_Generated_Image_o5dhzho5dhzho5dh (1).png',
    socialLinks: {
      instagram: 'https://www.instagram.com/martinhacantoraoficial/',
      spotify: 'https://open.spotify.com/intl-pt/artist/6etONEQiR3dUCs4IV0kIlE',
      youtube: null,
      tiktok: null,
      twitter: null,
      facebook: null,
    },
    musicLinks: [
      {
        platform: 'Spotify',
        url: 'https://open.spotify.com/intl-pt/artist/6etONEQiR3dUCs4IV0kIlE',
      },
    ],
  },
  {
    id: 12,
    name: 'Debora Lopes',
    genre: 'Gospel/CCM',
    image: '/artistas/debora-lopes/debora-lopes.png',
    socialLinks: {
      instagram: 'https://www.instagram.com/deboralopesoficiall/',
      spotify: 'https://open.spotify.com/intl-pt/artist/3GPJu7XtFtUYUKI5qcooml',
      youtube: null,
      tiktok: null,
      twitter: null,
      facebook: null,
    },
    musicLinks: [
      {
        platform: 'Spotify',
        url: 'https://open.spotify.com/intl-pt/artist/3GPJu7XtFtUYUKI5qcooml',
      },
    ],
  },
  {
    id: 18,
    name: 'Kaka Tavares',
    genre: 'Gospel/CCM',
    image: '/artistas/kaka-tavares/IMG_3648.jpg',
    socialLinks: {
      instagram: null,
      spotify: 'https://open.spotify.com/intl-pt/artist/5v86apLzejN5yQl8H2CcLh',
      youtube: null,
      tiktok: null,
      twitter: null,
      facebook: null,
    },
    musicLinks: [
      {
        platform: 'Spotify',
        url: 'https://open.spotify.com/intl-pt/artist/5v86apLzejN5yQl8H2CcLh',
      },
    ],
  },
  {
    id: 19,
    name: 'Rachel Malafaia',
    genre: 'Gospel/CCM',
    image: '/artistas/rachel-malafaia/IMG_5693.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/rachelmalafaia/',
      spotify: 'https://open.spotify.com/intl-pt/artist/1xyrtLIDTu5kRTCvnHgIcJ',
      youtube: null,
      tiktok: null,
      twitter: null,
      facebook: null,
    },
    musicLinks: [
      {
        platform: 'Spotify',
        url: 'https://open.spotify.com/intl-pt/artist/1xyrtLIDTu5kRTCvnHgIcJ',
      },
    ],
  },
  {
    id: 20,
    name: 'George Lean',
    genre: 'Gospel/CCM',
    image: '/artistas/george-lean/IMG_1982.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/georgelean/',
      spotify: null,
      youtube: null,
      tiktok: null,
      twitter: null,
      facebook: null,
    },
    musicLinks: [],
  },
  {
    id: 21,
    name: 'Gabriel Magalhães',
    genre: 'Gospel/CCM',
    image: '/artistas/gabriel-magalhaes/IMG_4165.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/gabrielmagalhaes.oficial1/',
      spotify: null,
      youtube: null,
      tiktok: null,
      twitter: null,
      facebook: null,
    },
    musicLinks: [],
  },
];

export default function ArtistsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);
  const handleArtistClick = useCallback((artistId: number) => {
    navigate(`/artista/${artistId}`);
  }, [navigate]);
  
  const handleSocialClick = useCallback((url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;
        
        // Reinicia o scroll quando chega ao fim
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPaused]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-[#0EA8A0]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-[#C45C2F]/8 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="mb-8 sm:mb-12 lg:mb-16 text-center px-4 sm:px-6 lg:px-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-4 font-montserrat">
            Nossos <span className="text-[#0EA8A0]">Artistas</span>
          </h2>
        </div>

          {/* Galeria com Scroll Lateral */}
        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-12 pb-6 sm:pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Duplicar os artistas para scroll infinito */}
          {[...artists, ...artists].map((artist, index) => (
            <div
              key={`${artist.id}-${index}`}
            onClick={() => handleArtistClick(artist.id)}
              className="glass-card animate-liquid-glass rounded-2xl overflow-hidden hover:border-[#0EA8A0]/50 transition-all duration-500 cursor-pointer group flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px]"
            >
              <div className="relative">
                {/* Foto Oficial - Formato Redondo */}
                <div className="flex justify-center pt-6 sm:pt-8 pb-3 sm:pb-4">
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-[#0EA8A0]/30 group-hover:border-[#0EA8A0] group-hover:shadow-[0_0_30px_rgba(14,168,160,0.4)] transition-all duration-500">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading={index < 3 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'high' : index < 3 ? 'high' : 'auto'}
                      decoding={index < 3 ? 'async' : 'async'}
                      width={224}
                      height={224}
                      style={{
                        objectPosition: artist.id === 10 ? '75% center' : artist.id === 15 ? 'center 50%' : artist.id === 18 ? 'center 20%' : artist.id === 14 ? 'center 30%' : artist.id === 11 ? 'center 28%' : artist.id === 19 ? 'center 30%' : artist.id === 20 ? 'center 40%' : [13, 16].includes(artist.id) ? 'center 35%' : 'center',
                        imageRendering: [10, 12, 18, 19].includes(artist.id) ? 'auto' : 'crisp-edges',
                        WebkitImageRendering: [10, 12, 18, 19].includes(artist.id) ? 'auto' : 'crisp-edges',
                        filter: [10, 12, 18, 19].includes(artist.id) ? 'none' : 'contrast(1.1) saturate(1.05)'
                      }}
                    />
                  </div>
                </div>

                {/* Informações do Artista */}
                <div className="p-4 sm:p-6 pt-2">
                  {/* Nome Artístico */}
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2 font-montserrat text-white group-hover:text-[#0EA8A0] transition-colors duration-300">
                    {artist.name}
                  </h3>
                  <p className="text-gray-400 mb-4 sm:mb-5 font-montserrat text-xs sm:text-sm">{artist.genre}</p>
                  
                  {/* Redes Sociais */}
                  <div className="mb-5">
                    <p className="text-gray-500 text-xs mb-3 font-montserrat uppercase tracking-wide">Redes Sociais</p>
                    <div className="flex items-center flex-wrap gap-3">
                      {artist.socialLinks.instagram && (
                        <button
                          onClick={(e) => handleSocialClick(artist.socialLinks.instagram!, e)}
                          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer text-base sm:text-lg min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                          title="Instagram"
                          type="button"
                        >
                          <i className="ri-instagram-line"></i>
                        </button>
                      )}
                      {artist.socialLinks.spotify && (
                        <button
                          onClick={(e) => handleSocialClick(artist.socialLinks.spotify!, e)}
                          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer text-base sm:text-lg min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                          title="Spotify"
                          type="button"
                        >
                          <i className="ri-spotify-fill"></i>
                        </button>
                      )}
                      {artist.socialLinks.youtube && (
                        <a
                          href={artist.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer text-lg"
                          title="YouTube"
                        >
                          <i className="ri-youtube-fill"></i>
                        </a>
                      )}
                      {artist.socialLinks.tiktok && (
                        <a
                          href={artist.socialLinks.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer text-lg"
                          title="TikTok"
                        >
                          <i className="ri-tiktok-fill"></i>
                        </a>
                      )}
                      {artist.socialLinks.twitter && (
                        <a
                          href={artist.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer text-lg"
                          title="Twitter/X"
                        >
                          <i className="ri-twitter-x-fill"></i>
                        </a>
                      )}
                      {artist.socialLinks.facebook && (
                        <a
                          href={artist.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer text-lg"
                          title="Facebook"
                        >
                          <i className="ri-facebook-fill"></i>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Links de Músicas */}
                  {artist.musicLinks && artist.musicLinks.length > 0 && (
                    <div>
                      <p className="text-gray-500 text-xs mb-3 font-montserrat uppercase tracking-wide">Ouvir Músicas</p>
                      <div className="flex flex-col gap-2">
                        {artist.musicLinks.map((musicLink, idx) => (
                          <a
                            key={idx}
                            href={musicLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-800/30 hover:bg-[#0EA8A0]/10 hover:border-[#0EA8A0]/30 border border-transparent transition-all duration-300 group/music"
                          >
                            <span className="text-sm text-gray-300 group-hover/music:text-[#0EA8A0] transition-colors font-montserrat">
                              {musicLink.platform}
                            </span>
                            <i className="ri-external-link-line text-gray-400 group-hover/music:text-[#0EA8A0] transition-colors"></i>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12 px-4 sm:px-6 lg:px-12">
          <Link
            to="/artistas"
            onClick={(e) => {
              // Scroll para o topo antes de navegar - múltiplas formas
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              window.scrollTo(0, 0);
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
              if (document.scrollingElement) {
                document.scrollingElement.scrollTop = 0;
              }
              // Garantir scroll após um pequeno delay também
              requestAnimationFrame(() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
              });
            }}
            className="inline-flex items-center gap-2 bg-transparent border border-gray-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:border-[#0EA8A0] hover:shadow-[0_0_20px_rgba(14,168,160,0.3)] hover:text-[#0EA8A0] transition-all duration-300 whitespace-nowrap cursor-pointer font-montserrat text-sm sm:text-base min-h-[44px]"
          >
            Ver Todos os Artistas
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
