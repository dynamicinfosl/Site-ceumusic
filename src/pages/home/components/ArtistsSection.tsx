import { Link } from 'react-router-dom';

const artists = [
  {
    id: 1,
    name: 'Luna Silva',
    genre: 'Pop',
    image: 'https://readdy.ai/api/search-image?query=Professional%20female%20pop%20singer%20portrait%2C%20young%20woman%20with%20long%20dark%20hair%2C%20confident%20expression%2C%20studio%20lighting%2C%20music%20artist%20photography%2C%20dark%20elegant%20background&width=400&height=400&seq=artist-1&orientation=squarish',
    instagram: 'https://instagram.com',
    spotify: 'https://spotify.com',
  },
  {
    id: 2,
    name: 'Rafael Costa',
    genre: 'Hip Hop',
    image: 'https://readdy.ai/api/search-image?query=Professional%20male%20hip%20hop%20artist%20portrait%2C%20young%20man%20with%20urban%20style%2C%20confident%20pose%2C%20studio%20lighting%2C%20rapper%20photography%2C%20dark%20modern%20background&width=400&height=400&seq=artist-2&orientation=squarish',
    instagram: 'https://instagram.com',
    spotify: 'https://spotify.com',
  },
  {
    id: 3,
    name: 'Marina Luz',
    genre: 'MPB',
    image: 'https://readdy.ai/api/search-image?query=Professional%20female%20MPB%20singer%20portrait%2C%20elegant%20woman%20with%20artistic%20style%2C%20warm%20expression%2C%20studio%20lighting%2C%20Brazilian%20music%20artist%2C%20sophisticated%20dark%20background&width=400&height=400&seq=artist-3&orientation=squarish',
    instagram: 'https://instagram.com',
    spotify: 'https://spotify.com',
  },
  {
    id: 4,
    name: 'Pedro Alves',
    genre: 'Rock',
    image: 'https://readdy.ai/api/search-image?query=Professional%20male%20rock%20musician%20portrait%2C%20young%20man%20with%20edgy%20style%2C%20intense%20expression%2C%20dramatic%20lighting%2C%20rock%20artist%20photography%2C%20dark%20atmospheric%20background&width=400&height=400&seq=artist-4&orientation=squarish',
    instagram: 'https://instagram.com',
    spotify: 'https://spotify.com',
  },
  {
    id: 5,
    name: 'Beatriz Santos',
    genre: 'Eletrônica',
    image: 'https://readdy.ai/api/search-image?query=Professional%20female%20electronic%20music%20artist%20portrait%2C%20modern%20woman%20with%20futuristic%20style%2C%20creative%20expression%2C%20neon%20lighting%2C%20DJ%20producer%20photography%2C%20dark%20tech%20background&width=400&height=400&seq=artist-5&orientation=squarish',
    instagram: 'https://instagram.com',
    spotify: 'https://spotify.com',
  },
  {
    id: 6,
    name: 'Lucas Ferreira',
    genre: 'Sertanejo',
    image: 'https://readdy.ai/api/search-image?query=Professional%20male%20sertanejo%20singer%20portrait%2C%20handsome%20man%20with%20country%20style%2C%20charismatic%20smile%2C%20warm%20lighting%2C%20Brazilian%20country%20music%20artist%2C%20elegant%20dark%20background&width=400&height=400&seq=artist-6&orientation=squarish',
    instagram: 'https://instagram.com',
    spotify: 'https://spotify.com',
  },
];

export default function ArtistsSection() {
  return (
    <section className="px-6 py-20 lg:px-12 relative">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-[#0EA8A0]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-[#C45C2F]/8 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-6xl lg:text-7xl mb-4 font-montserrat">
            Nossos <span className="text-[#0EA8A0]">Artistas</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-product-shop>
          {artists.map((artist) => (
            <Link
              key={artist.id}
              to={`/artist/${artist.id}`}
              className="glass-card animate-liquid-glass rounded-2xl p-8 hover:border-[#0EA8A0]/50 transition-all duration-500 cursor-pointer group"
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
                <p className="text-gray-400 mb-4 font-montserrat text-sm">{artist.genre}</p>
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
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/artists"
            className="inline-block bg-transparent border border-gray-600 text-white px-8 py-3 rounded-full font-semibold hover:border-[#0EA8A0] hover:shadow-[0_0_20px_rgba(14,168,160,0.3)] transition-all duration-300 whitespace-nowrap cursor-pointer font-montserrat"
          >
            Ver Todos os Artistas
          </Link>
        </div>
      </div>
    </section>
  );
}
