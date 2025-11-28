import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

// Artistas da Céu Music
const artists = [
  {
    id: 1,
    name: 'Alex Lucio',
    genre: 'Gospel/CCM',
    // Foto do perfil do artista - substitua pela URL real da foto
    // Para obter a foto: baixe a foto do perfil do Instagram e hospede em um serviço de imagens (ex: Imgur, Cloudinary) ou use a URL direta se disponível
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop&q=80', // Placeholder temporário - substitua pela foto real do artista
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
    image: 'https://readdy.ai/api/search-image?query=Brazilian%20gospel%20worship%20band%20performing%20on%20stage%20with%20teal%20and%20bronze%20lights%2C%20congregation%20worship%2C%20modern%20christian%20music%20group%2C%20high%20quality%20concert%20photography&width=600&height=600&seq=artist-na-graca&orientation=squarish',
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
    image:
      'https://readdy.ai/api/search-image?query=Brazilian%20female%20gospel%20singer%20Maria%20Pita%20style%2C%20worshipping%20on%20stage%20with%20teal%20and%20bronze%20lights%2C%20high%20quality%20portrait&width=600&height=600&seq=artist-maria-pita&orientation=squarish',
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
    image:
      'https://readdy.ai/api/search-image?query=Brazilian%20male%20gospel%20singer%20Caio%20Torres%20style%2C%20worshipping%20on%20stage%20with%20teal%20and%20bronze%20lights%2C%20high%20quality%20portrait&width=600&height=600&seq=artist-caio-torres&orientation=squarish',
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
    image:
      'https://readdy.ai/api/search-image?query=Brazilian%20gospel%20duo%20worship%20leaders%20on%20stage%20with%20congregation%20worshipping%2C%20teal%20and%20bronze%20lighting%2C%20modern%20church%20concert%2C%20high%20quality%20photography&width=600&height=600&seq=artist-no-santuario&orientation=squarish',
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
    image:
      'https://readdy.ai/api/search-image?query=Brazilian%20female%20gospel%20singer%20Nicole%20Lavinia%20style%2C%20worshipping%20on%20stage%20with%20soft%20teal%20and%20bronze%20lighting%2C%20high%20quality%20portrait&width=600&height=600&seq=artist-nicole-lavinia&orientation=squarish',
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
    image:
      'https://readdy.ai/api/search-image?query=Brazilian%20male%20gospel%20worship%20singer%20William%20Soares%20style%2C%20worshipping%20on%20stage%20with%20teal%20and%20bronze%20lights%2C%20high%20quality%20portrait&width=600&height=600&seq=artist-william-soares&orientation=squarish',
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
    image:
      'https://readdy.ai/api/search-image?query=Brazilian%20female%20gospel%20worship%20singer%20Martinha%20style%2C%20worshipping%20on%20stage%20with%20teal%20and%20bronze%20lights%2C%20high%20quality%20portrait&width=600&height=600&seq=artist-martinha&orientation=squarish',
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
    image:
      'https://readdy.ai/api/search-image?query=Brazilian%20female%20gospel%20singer%20worshipping%20on%20stage%2C%20soft%20teal%20and%20bronze%20lighting%2C%20close%20up%20portrait%2C%20high%20quality%20photography&width=600&height=600&seq=artist-debora-lopes&orientation=squarish',
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
    image:
      'https://readdy.ai/api/search-image?query=Brazilian%20male%20gospel%20worship%20singer%20Kaka%20Tavares%20style%2C%20worshipping%20on%20stage%2C%20soft%20teal%20and%20bronze%20lighting%2C%20high%20quality%20portrait&width=600&height=600&seq=artist-kaka-tavares&orientation=squarish',
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
];

export default function ArtistsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

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
    <section className="py-20 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-[#0EA8A0]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-[#C45C2F]/8 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="mb-16 text-center px-6 lg:px-12">
          <h2 className="text-6xl lg:text-7xl mb-4 font-montserrat">
            Nossos <span className="text-[#0EA8A0]">Artistas</span>
          </h2>
        </div>

          {/* Galeria com Scroll Lateral */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide px-6 lg:px-12 pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Duplicar os artistas para scroll infinito */}
          {[...artists, ...artists].map((artist, index) => (
            <div
              key={`${artist.id}-${index}`}
            onClick={() => navigate(`/artista/${artist.id}`)}
              className="glass-card animate-liquid-glass rounded-2xl overflow-hidden hover:border-[#0EA8A0]/50 transition-all duration-500 cursor-pointer group flex-shrink-0 w-[320px] sm:w-[380px]"
            >
              <div className="relative">
                {/* Foto Oficial - Formato Redondo */}
                <div className="flex justify-center pt-8 pb-4">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-[#0EA8A0]/30 group-hover:border-[#0EA8A0] group-hover:shadow-[0_0_30px_rgba(14,168,160,0.4)] transition-all duration-500">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Informações do Artista */}
                <div className="p-6 pt-2">
                  {/* Nome Artístico */}
                  <h3 className="text-2xl font-semibold mb-2 font-montserrat text-white group-hover:text-[#0EA8A0] transition-colors duration-300">
                    {artist.name}
                  </h3>
                  <p className="text-gray-400 mb-5 font-montserrat text-sm">{artist.genre}</p>
                  
                  {/* Redes Sociais */}
                  <div className="mb-5">
                    <p className="text-gray-500 text-xs mb-3 font-montserrat uppercase tracking-wide">Redes Sociais</p>
                    <div className="flex items-center flex-wrap gap-3">
                      {artist.socialLinks.instagram && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(artist.socialLinks.instagram, '_blank', 'noopener,noreferrer');
                          }}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer text-lg"
                          title="Instagram"
                          type="button"
                        >
                          <i className="ri-instagram-line"></i>
                        </button>
                      )}
                      {artist.socialLinks.spotify && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(artist.socialLinks.spotify, '_blank', 'noopener,noreferrer');
                          }}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer text-lg"
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

        <div className="text-center mt-12 px-6 lg:px-12">
          <Link
            to="/artistas"
            className="inline-block bg-transparent border border-gray-600 text-white px-8 py-3 rounded-full font-semibold hover:border-[#0EA8A0] hover:shadow-[0_0_20px_rgba(14,168,160,0.3)] transition-all duration-300 whitespace-nowrap cursor-pointer font-montserrat"
          >
            Ver Todos os Artistas
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
