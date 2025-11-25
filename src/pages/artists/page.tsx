import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const artists = [
  {
    id: 1,
    name: 'Luna Silva',
    genre: 'Pop',
    bio: 'Voz marcante e presença de palco única',
    image: 'https://readdy.ai/api/search-image?query=Professional%20female%20pop%20singer%20portrait%2C%20young%20woman%20with%20long%20dark%20hair%2C%20confident%20expression%2C%20studio%20lighting%2C%20music%20artist%20photography%2C%20dark%20elegant%20background&width=400&height=400&seq=artist-1&orientation=squarish',
    instagram: 'https://instagram.com',
    spotify: 'https://spotify.com',
    youtube: 'https://youtube.com',
  },
  {
    id: 2,
    name: 'Rafael Costa',
    genre: 'Hip Hop',
    bio: 'Letras que contam histórias reais das ruas',
    image: 'https://readdy.ai/api/search-image?query=Professional%20male%20hip%20hop%20artist%20portrait%2C%20young%20man%20with%20urban%20style%2C%20confident%20pose%2C%20studio%20lighting%2C%20rapper%20photography%2C%20dark%20modern%20background&width=400&height=400&seq=artist-2&orientation=squarish',
    instagram: 'https://instagram.com',
    spotify: 'https://spotify.com',
    youtube: 'https://youtube.com',
  },
  {
    id: 3,
    name: 'Marina Luz',
    genre: 'MPB',
    bio: 'Tradição e modernidade em perfeita harmonia',
    image: 'https://readdy.ai/api/search-image?query=Professional%20female%20MPB%20singer%20portrait%2C%20elegant%20woman%20with%20artistic%20style%2C%20warm%20expression%2C%20studio%20lighting%2C%20Brazilian%20music%20artist%2C%20sophisticated%20dark%20background&width=400&height=400&seq=artist-3&orientation=squarish',
    instagram: 'https://instagram.com',
    spotify: 'https://spotify.com',
    youtube: 'https://youtube.com',
  },
  {
    id: 4,
    name: 'Pedro Alves',
    genre: 'Rock',
    bio: 'Energia pura e guitarras poderosas',
    image: 'https://readdy.ai/api/search-image?query=Professional%20male%20rock%20musician%20portrait%2C%20young%20man%20with%20edgy%20style%2C%20intense%20expression%2C%20dramatic%20lighting%2C%20rock%20artist%20photography%2C%20dark%20atmospheric%20background&width=400&height=400&seq=artist-4&orientation=squarish',
    instagram: 'https://instagram.com',
    spotify: 'https://spotify.com',
    youtube: 'https://youtube.com',
  },
  {
    id: 5,
    name: 'Beatriz Santos',
    genre: 'Eletrônica',
    bio: 'Batidas futuristas e sons inovadores',
    image: 'https://readdy.ai/api/search-image?query=Professional%20female%20electronic%20music%20artist%20portrait%2C%20modern%20woman%20with%20futuristic%20style%2C%20creative%20expression%2C%20neon%20lighting%2C%20DJ%20producer%20photography%2C%20dark%20tech%20background&width=400&height=400&seq=artist-5&orientation=squarish',
    instagram: 'https://instagram.com',
    spotify: 'https://spotify.com',
    youtube: 'https://youtube.com',
  },
  {
    id: 6,
    name: 'Lucas Ferreira',
    genre: 'Sertanejo',
    bio: 'Autenticidade e emoção em cada nota',
    image: 'https://readdy.ai/api/search-image?query=Professional%20male%20sertanejo%20singer%20portrait%2C%20handsome%20man%20with%20country%20style%2C%20charismatic%20smile%2C%20warm%20lighting%2C%20Brazilian%20country%20music%20artist%2C%20elegant%20dark%20background&width=400&height=400&seq=artist-6&orientation=squarish',
    instagram: 'https://instagram.com',
    spotify: 'https://spotify.com',
    youtube: 'https://youtube.com',
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

const genres = ['Todos', 'Pop', 'Hip Hop', 'MPB', 'Rock', 'Eletrônica', 'Sertanejo'];

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
              onClick={() => navigate(`/artist/${artist.id}`)}
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
                  <a
                    href={artist.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer"
                  >
                    <i className="ri-instagram-line"></i>
                  </a>
                  <a
                    href={artist.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer"
                  >
                    <i className="ri-spotify-fill"></i>
                  </a>
                  <a
                    href={artist.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer"
                  >
                    <i className="ri-youtube-fill"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
