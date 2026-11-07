import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { useArtists } from '../../utils/content';


export default function ArtistsPage() {
  const location = useLocation();
  const loadedArtists = useArtists();
  const artists = loadedArtists ?? [];

  // Scroll para o topo ANTES da renderização visual
  useLayoutEffect(() => {
    // Forçar scroll imediato antes de qualquer renderização
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (document.scrollingElement) {
      document.scrollingElement.scrollTop = 0;
    }
    // Também tentar com scrollTo direto
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Scroll para o topo após a renderização também
  useEffect(() => {
    const scrollToTop = () => {
      // Tentar scroll para o elemento de referência primeiro
      const topElement = document.getElementById('artists-page-top');
      if (topElement) {
        topElement.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
      
      // Múltiplas formas de garantir o scroll
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = 0;
      }
      // Tentar também com scrollIntoView no body
      if (document.body) {
        document.body.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    };
    
    // Scroll imediato
    scrollToTop();
    
    // Usar requestAnimationFrame para garantir que aconteça após renderização
    requestAnimationFrame(() => {
      scrollToTop();
      requestAnimationFrame(() => {
        scrollToTop();
      });
    });
    
    // Múltiplas tentativas com timeouts para garantir
    const timers = [
      setTimeout(scrollToTop, 0),
      setTimeout(scrollToTop, 10),
      setTimeout(scrollToTop, 50),
      setTimeout(scrollToTop, 100),
      setTimeout(scrollToTop, 200),
      setTimeout(scrollToTop, 300),
      setTimeout(scrollToTop, 500),
    ];
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [location.pathname]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const cards = document.querySelectorAll('.scroll-reveal');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [loadedArtists]);

  return (
    <>
    <Navbar />
    <div className="min-h-screen pt-44 pb-20 px-6 lg:px-12">
      {/* Elemento de referência para scroll - invisível no topo */}
      <div id="artists-page-top" className="absolute top-0 left-0 w-1 h-1 opacity-0 pointer-events-none" aria-hidden="true"></div>
      

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0EA8A0]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#C45C2F]/8 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-8 sm:mb-12 lg:mb-16 text-center px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-6">
            Nossos artistas
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
            Conheça os talentos que fazem parte da família Céu Music
          </p>
        </div>

        <div className="section-divider-glow"></div>

        {loadedArtists === null && (
          <p className="py-16 text-center text-white/60" aria-live="polite">Carregando artistas…</p>
        )}

        {/* Artists Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" data-product-shop>
          {artists.map((artist, index) => (
            <div
              key={artist.id}
              onClick={() => window.location.href = `/artista/${artist.id}`}
              className="glass-card animate-liquid-glass rounded-2xl p-4 sm:p-6 lg:p-8 hover:border-[#0EA8A0]/50 transition-all duration-500 cursor-pointer group scroll-reveal"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative z-10">
                <div className="mb-4 sm:mb-6">
                  <div className="w-full aspect-square rounded-full overflow-hidden mb-4 sm:mb-6 border-2 border-[#0EA8A0]/30 group-hover:border-[#0EA8A0] group-hover:shadow-[0_0_30px_rgba(14,168,160,0.4)] transition-all duration-500">
                    <img
                      src={artist.image_url ?? ''}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                      loading={index < 6 ? 'eager' : 'lazy'}
                      fetchPriority={index < 3 ? 'high' : 'auto'}
                      decoding="async"
                      width={400}
                      height={400}
                      style={{ objectPosition: artist.photo_position ?? undefined }}
                    />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{artist.name}</h3>
                <p className="text-[#0EA8A0] mb-2 text-xs sm:text-sm">{artist.genre}</p>
                <p className="text-gray-400 mb-4 text-xs sm:text-sm line-clamp-3">{artist.short_bio || artist.bio}</p>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  {artist.instagram && (
                    <a
                      href={artist.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                      title="Instagram"
                    >
                      <i className="ri-instagram-line text-base sm:text-lg"></i>
                    </a>
                  )}
                  {artist.spotify && (
                    <a
                      href={artist.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                      title="Spotify"
                    >
                      <i className="ri-spotify-fill text-base sm:text-lg"></i>
                    </a>
                  )}
                  {artist.youtube && (
                    <a
                      href={artist.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                      title="YouTube"
                    >
                      <i className="ri-youtube-fill text-base sm:text-lg"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
