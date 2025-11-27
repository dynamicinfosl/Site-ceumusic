import { useState, useEffect } from 'react';

const artists = [
  {
    id: 1,
    name: 'Alexsander Lucio',
    genre: 'Gospel/CCM',
    bio: 'Alex Lúcio nasceu e foi criado em um lar cristão, tendo suas raízes firmadas desde cedo na igreja. Vindo de uma infância simples e humilde, ele é o terceiro de cinco irmãos. Desde pequeno, Alex se destacou nos estudos, sempre dedicado e esforçado. Na adolescência, ele descobriu sua vocação para a música, começando então a compor e cantar com o coração voltado sempre para Deus. Seu amor pela música se transformou em uma missão maior: hoje, ele realiza um importante trabalho de evangelização no Calçadão de Campo Grande, levando esperança e a Palavra de Deus a muitas vidas.',
    // Foto do perfil do artista - substitua pela URL real da foto
    // Para obter a foto: baixe a foto do perfil do Instagram e hospede em um serviço de imagens (ex: Imgur, Cloudinary) ou use a URL direta se disponível
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop&q=80', // Placeholder temporário - substitua pela foto real do artista
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
    image:
      'https://readdy.ai/api/search-image?query=Brazilian%20male%20gospel%20worship%20singer%20Caio%20Torres%20style%2C%20microphone%20in%20hand%2C%20teal%20and%20bronze%20lighting%2C%20high%20quality%20portrait&width=400&height=400&seq=artist-caio-torres&orientation=squarish',
    instagram: 'https://www.instagram.com/caiotorees/',
    spotify: 'https://open.spotify.com/intl-pt/artist/3TOPRsT6nYECZi9K9yZZXw',
    youtube: null,
  },
  {
    id: 14,
    name: 'Nicole Lavinia',
    genre: 'Gospel/CCM',
    bio: 'Cantora gospel que tem se destacado entre a nova geração de adoradores, com canções que falam de intimidade com Deus e entrega total.',
    image:
      'https://readdy.ai/api/search-image?query=Brazilian%20young%20female%20gospel%20worship%20singer%20Nicole%20Lavinia%20style%2C%20soft%20teal%20and%20gold%20lighting%2C%20high%20quality%20portrait&width=400&height=400&seq=artist-nicole-lavinia&orientation=squarish',
    instagram: 'https://www.instagram.com/nicolelaviniaoficial_/',
    spotify: 'https://open.spotify.com/intl-pt/track/0AayU24085eVhLhbk27sTE',
    youtube: null,
  },
  {
    id: 12,
    name: 'Debora Lopes',
    genre: 'Gospel/CCM',
    bio: 'Cantora gospel que tem se destacado com canções de fé e esperança, como “Milagres de Deus (Ao Vivo)”, alcançando milhares de ouvintes nas plataformas digitais.',
    image:
      'https://readdy.ai/api/search-image?query=Brazilian%20female%20gospel%20worship%20singer%20on%20stage%2C%20eyes%20closed%20in%20worship%2C%20soft%20teal%20and%20bronze%20lighting%2C%20high%20quality%20concert%20photography&width=400&height=400&seq=artist-debora-lopes&orientation=squarish',
    instagram: 'https://www.instagram.com/deboralopesoficiall/',
    spotify: 'https://open.spotify.com/intl-pt/artist/3GPJu7XtFtUYUKI5qcooml',
    youtube: null,
  },
  {
    id: 16,
    name: 'William Soares',
    genre: 'Gospel/CCM',
    bio: 'Cantor gospel que tem se dedicado a levar mensagens de fé e esperança através de suas ministrações e canções.',
    image:
      'https://readdy.ai/api/search-image?query=Brazilian%20male%20gospel%20worship%20singer%20William%20Soares%20style%2C%20soft%20teal%20and%20bronze%20lighting%2C%20high%20quality%20portrait&width=400&height=400&seq=artist-william-soares&orientation=squarish',
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
  {
    id: 7,
    name: 'Camila Rocha',
    genre: 'Pop',
    bio: 'Melodias cativantes e performances inesquecíveis',
    image: 'https://readdy.ai/api/search-image?query=Professional%20female%20pop%20artist%20portrait%2C%20young%20woman%20with%20vibrant%20style%2C%20joyful%20expression%2C%20colorful%20lighting%2C%20pop%20star%20photography%2C%20dark%20modern%20background&width=400&height=400&seq=artist-7&orientation=squarish',
    instagram: 'https://instagram.com',
    spotify: 'https://spotify.com',
    youtube: 'https://youtube.com',
  },
  {
    id: 8,
    name: 'Diego Martins',
    genre: 'Hip Hop',
    bio: 'Flow único e rimas afiadas',
    image: 'https://readdy.ai/api/search-image?query=Professional%20male%20rapper%20portrait%2C%20young%20man%20with%20street%20style%2C%20intense%20look%2C%20urban%20lighting%2C%20hip%20hop%20artist%20photography%2C%20dark%20gritty%20background&width=400&height=400&seq=artist-8&orientation=squarish',
    instagram: 'https://instagram.com',
    spotify: 'https://spotify.com',
    youtube: 'https://youtube.com',
  },
  {
    id: 9,
    name: 'Sofia Mendes',
    genre: 'MPB',
    bio: 'Poesia musicada com alma brasileira',
    image: 'https://readdy.ai/api/search-image?query=Professional%20female%20MPB%20artist%20portrait%2C%20elegant%20woman%20with%20natural%20beauty%2C%20serene%20expression%2C%20soft%20lighting%2C%20Brazilian%20music%20photography%2C%20dark%20artistic%20background&width=400&height=400&seq=artist-9&orientation=squarish',
    instagram: 'https://instagram.com',
    spotify: 'https://spotify.com',
    youtube: 'https://youtube.com',
  },
];

const genres = ['Todos', 'Pop', 'Hip Hop', 'MPB', 'Rock', 'Eletrônica', 'Sertanejo', 'Gospel/CCM'];

export default function ArtistsPage() {
  const [selectedGenre, setSelectedGenre] = useState('Todos');

  const filteredArtists = selectedGenre === 'Todos' 
    ? artists 
    : artists.filter(artist => artist.genre === selectedGenre);

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
  }, [filteredArtists]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
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

        {/* Genre Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer text-sm font-montserrat ${
                selectedGenre === genre
                  ? 'bg-[#0EA8A0] text-black shadow-[0_0_20px_rgba(14,168,160,0.4)]'
                  : 'bg-transparent border border-gray-600 text-white hover:border-[#0EA8A0] hover:shadow-[0_0_15px_rgba(14,168,160,0.2)]'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Artists Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-product-shop>
          {filteredArtists.map((artist, index) => (
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
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 font-montserrat">{artist.name}</h3>
                <p className="text-[#0EA8A0] mb-2 font-montserrat text-sm">{artist.genre}</p>
                <p className="text-gray-400 mb-4 font-montserrat text-sm">{artist.bio}</p>
                <div className="flex items-center space-x-4">
                  {artist.instagram && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(artist.instagram, '_blank', 'noopener,noreferrer');
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer"
                      title="Instagram"
                      type="button"
                    >
                      <i className="ri-instagram-line"></i>
                    </button>
                  )}
                  {artist.spotify && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(artist.spotify, '_blank', 'noopener,noreferrer');
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer"
                      title="Spotify"
                      type="button"
                    >
                      <i className="ri-spotify-fill"></i>
                    </button>
                  )}
                  {artist.youtube && (
                    <a
                      href={artist.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer"
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
