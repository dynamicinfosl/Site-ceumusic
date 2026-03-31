import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '../../../utils/supabase';

interface Artist {
  id: string | number;
  name: string;
  genre: string;
  image: string;
  socialLinks: {
    instagram: string | null;
    spotify: string | null;
    youtube: string | null;
    tiktok: string | null;
    twitter: string | null;
    facebook: string | null;
  };
  musicLinks: { platform: string; url: string }[];
}

export default function ArtistsSection() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadArtists() {
      if (!supabase) {
        return;
      }
      try {
        const { data, error } = await supabase
          .from('artists')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;

        if (data) {
          const mappedArtists: Artist[] = data.map(dbArtist => ({
            id: dbArtist.id,
            name: dbArtist.name,
            genre: dbArtist.genre,
            image: dbArtist.image_url || '/placeholder-artist.jpg',
            socialLinks: {
              instagram: dbArtist.instagram,
              spotify: dbArtist.spotify,
              youtube: dbArtist.youtube,
              tiktok: dbArtist.tiktok,
              twitter: dbArtist.twitter,
              facebook: dbArtist.facebook,
            },
            musicLinks: dbArtist.spotify ? [{ platform: 'Spotify', url: dbArtist.spotify }] : []
          }));
          setArtists(mappedArtists);
        }
      } catch (err) {
        console.error('Erro ao carregar artistas:', err);
      }
    }
    loadArtists();
  }, []);

  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);
  const handleArtistClick = useCallback((artistId: string | number) => {
    navigate(`/artista/${artistId}`);
  }, [navigate]);
  
  const handleSocialClick = useCallback((url: string, event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      if (!isPaused && scrollContainer && scrollRef.current) {
        scrollPosition += scrollSpeed;
        
        // Reinicia o scroll quando chega ao fim
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
        animationFrameId = requestAnimationFrame(animate);
      } else if (scrollRef.current) {
        animationFrameId = requestAnimationFrame(animate);
      }
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
                        objectPosition: artist.name === 'Na Graça' ? '75% center' : artist.name === 'Maria Pita' ? 'center 50%' : artist.name === 'Kaka Tavares' ? 'center 20%' : artist.name === 'Nicole Lavinia' ? 'center 30%' : artist.name === 'No Santuário' ? 'center 28%' : artist.name === 'Rachel Malafaia' ? 'center 30%' : artist.name === 'George Lean' ? 'center 40%' : ['Caio Torres', 'William Soares'].includes(artist.name) ? 'center 35%' : 'center',
                        imageRendering: ['Na Graça', 'Debora Lopes', 'Kaka Tavares', 'Rachel Malafaia'].includes(artist.name) ? 'auto' : 'crisp-edges',
                        filter: ['Na Graça', 'Debora Lopes', 'Kaka Tavares', 'Rachel Malafaia'].includes(artist.name) ? 'none' : 'contrast(1.1) saturate(1.05)'
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
            onClick={() => {
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
