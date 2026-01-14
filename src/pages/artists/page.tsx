import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const artists = [
  {
    id: 1,
    name: 'Alex Lucio',
    genre: 'Gospel/CCM',
    bio: 'Alex é membro ativo da Igreja Assembleia de Deus em Campo Grande, onde encontra inspiração espiritual e apoio para continuar sua caminhada. Sua trajetória é marcada por dedicação, talento e fé, e seu objetivo é sempre ser um instrumento nas mãos de Deus para tocar corações e transformar vidas através da música.',
    image: '/artistas/alex-lucio/IMG_3735.jpg',
    instagram: 'https://www.instagram.com/alexlucio.ofc/',
    spotify: 'https://open.spotify.com/artist/2xX3xodC7zA5u2xygCWzuP',
    youtube: null, // Adicione o link do YouTube se disponível
  },
  {
    id: 10,
    name: 'Na Graça',
    genre: 'Gospel/CCM',
    bio: 'Grupo de adoração que leva mensagens de fé e esperança através de ministrações ao vivo e canções marcadas pela presença de Deus.',
    image: 'https://readdy.ai/api/search-image?query=Brazilian%20gospel%20worship%20band%20on%20stage%20leading%20congregation%20in%20worship%2C%20dramatic%20teal%20and%20bronze%20lighting%2C%20modern%20church%20concert%2C%20high%20quality%20photography&width=400&height=400&seq=artist-na-graca&orientation=squarish',
    instagram: 'https://www.instagram.com/nagracaoficial/',
    spotify: 'https://open.spotify.com/intl-pt/artist/7pmvHrURMH0OqDcXXQiuYX',
    youtube: null,
  },
  {
    id: 11,
    name: 'No Santuário',
    genre: 'Gospel/CCM',
    bio: 'Com 13 anos de carreira ministerial, álbuns, EPs e ministrações por todo o Brasil, EUA e Europa, o ministério No Santuário (Pr. Israel Leonardo e Raphaela Carvalho) dedica-se a proclamar o evangelho através da adoração e da pregação da Palavra de Deus. Com letras bíblicas e forte ênfase na presença de Deus, No Santuário se tornou referência na adoração congregacional, convidando a igreja a viver uma jornada de fé, esperança e restauração em cada canção.',
    image: '/artistas/no%20santuario/IMG_0090.jpg',
    instagram: 'https://www.instagram.com/nosantuario/',
    spotify: 'https://open.spotify.com/intl-pt/artist/3qkhpijMzbtVFexHZTNoai',
    youtube: 'https://www.youtube.com/watch?v=XWBgmBsxkk4&list=RDXWBgmBsxkk4&start_radio=1',
  },
  {
    id: 15,
    name: 'Maria Pita',
    genre: 'Gospel/CCM',
    bio: 'Cantora gospel que traz mensagens de esperança, fé e restauração, com um estilo de adoração sensível e intenso.',
    image:
      'https://readdy.ai/api/search-image?query=Brazilian%20female%20gospel%20worship%20singer%20Maria%20Pita%20style%2C%20soft%20stage%20lighting%2C%20high%20quality%20portrait&width=400&height=400&seq=artist-maria-pita&orientation=squarish',
    instagram: 'https://www.instagram.com/mariapitacantora_/',
    spotify: 'https://open.spotify.com/intl-pt/artist/7fw7DfkvI0fMyEKfOw0k6n',
    youtube: null,
  },
  {
    id: 13,
    name: 'Caio Torres',
    genre: 'Gospel/CCM',
    bio: 'Cantor gospel com mensagens de fé e rendição, focado em levar a igreja a uma experiência profunda de adoração e entrega através de suas canções.',
    image: '/artistas/caio-torres/IMG_0273.jpg',
    instagram: 'https://www.instagram.com/caiotorees/',
    spotify: 'https://open.spotify.com/intl-pt/artist/3TOPRsT6nYECZi9K9yZZXw',
    youtube: null,
  },
  {
    id: 14,
    name: 'Nicole Lavinia',
    genre: 'Gospel/CCM',
    bio: 'Cantora gospel que tem se destacado entre a nova geração de adoradores, com canções que falam de intimidade com Deus e entrega total.',
    image: '/artistas/nicole-lavinia/IMG_3996.jpg',
    instagram: 'https://www.instagram.com/nicolelaviniaoficial_/',
    spotify: 'https://open.spotify.com/intl-pt/track/0AayU24085eVhLhbk27sTE',
    youtube: null,
  },
  {
    id: 12,
    name: 'Debora Lopes',
    genre: 'Gospel/CCM',
    bio: 'Cantora gospel que tem se destacado com canções de fé e esperança, como "Milagres de Deus (Ao Vivo)", alcançando milhares de ouvintes nas plataformas digitais.',
    image: '/artistas/debora-lopes/IMG_8699.jpg',
    instagram: 'https://www.instagram.com/deboralopesoficiall/',
    spotify: 'https://open.spotify.com/intl-pt/artist/3GPJu7XtFtUYUKI5qcooml',
    youtube: null,
  },
  {
    id: 18,
    name: 'Kaka Tavares',
    genre: 'Gospel/CCM',
    bio: 'Cantora gospel que tem se dedicado a levar mensagens de fé e esperança através de suas ministrações e canções.',
    image: '/artistas/kaka-tavares/IMG_3648.jpg',
    instagram: null,
    spotify: 'https://open.spotify.com/intl-pt/artist/5v86apLzejN5yQl8H2CcLh',
    youtube: null,
  },
  {
    id: 16,
    name: 'William Soares',
    genre: 'Gospel/CCM',
    bio: 'Cantor gospel que tem se dedicado a levar mensagens de fé e esperança através de suas ministrações e canções.',
    image: '/artistas/william-soares/IMG_4092.jpg',
    instagram: 'https://www.instagram.com/williaamsoarees/',
    spotify: null,
    youtube: null,
  },
  {
    id: 17,
    name: 'Martinha',
    genre: 'Gospel/CCM',
    bio: 'Cantora gospel que tem se dedicado a levar mensagens de fé e esperança através de suas ministrações e canções.',
    image:
      'https://readdy.ai/api/search-image?query=Brazilian%20female%20gospel%20worship%20singer%20Martinha%20style%2C%20soft%20teal%20and%20bronze%20lighting%2C%20high%20quality%20portrait&width=400&height=400&seq=artist-martinha&orientation=squarish',
    instagram: 'https://www.instagram.com/martinhacantoraoficial/',
    spotify: 'https://open.spotify.com/intl-pt/artist/6etONEQiR3dUCs4IV0kIlE',
    youtube: null,
  },
];

export default function ArtistsPage() {
  const location = useLocation();

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
  }, [artists]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      {/* Elemento de referência para scroll - invisível no topo */}
      <div id="artists-page-top" className="absolute top-0 left-0 w-1 h-1 opacity-0 pointer-events-none" aria-hidden="true"></div>
      
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0EA8A0]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#C45C2F]/8 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16 text-center">
          <h1 className="text-6xl lg:text-7xl mb-6 font-montserrat">
            Nossos <span className="text-[#0EA8A0]">Artistas</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-montserrat">
            Conheça os talentos que fazem parte da família Céu Music
          </p>
        </div>

        <div className="section-divider-glow"></div>

        {/* Artists Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-product-shop>
          {artists.map((artist, index) => (
            <div
              key={artist.id}
              onClick={() => window.location.href = `/artista/${artist.id}`}
              className="glass-card animate-liquid-glass rounded-2xl p-8 hover:border-[#0EA8A0]/50 transition-all duration-500 cursor-pointer group scroll-reveal"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-full aspect-square rounded-full overflow-hidden mb-6 border-2 border-[#0EA8A0]/30 group-hover:border-[#0EA8A0] group-hover:shadow-[0_0_30px_rgba(14,168,160,0.4)] transition-all duration-500">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition: artist.id === 18 ? 'center 20%' : artist.id === 14 ? 'center 30%' : artist.id === 11 ? 'center 28%' : [13, 16].includes(artist.id) ? 'center 35%' : 'center'
                      }}
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 font-montserrat">{artist.name}</h3>
                <p className="text-[#0EA8A0] mb-2 font-montserrat text-sm">{artist.genre}</p>
                <p className="text-gray-400 mb-4 font-montserrat text-sm">{artist.bio}</p>
                <div className="flex items-center space-x-4">
                  {artist.instagram && (
                    <a
                      href={artist.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer"
                      title="Instagram"
                    >
                      <i className="ri-instagram-line"></i>
                    </a>
                  )}
                  {artist.spotify && (
                    <a
                      href={artist.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer"
                      title="Spotify"
                    >
                      <i className="ri-spotify-fill"></i>
                    </a>
                  )}
                  {artist.youtube && (
                    <a
                      href={artist.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer"
                      title="YouTube"
                    >
                      <i className="ri-youtube-fill"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
