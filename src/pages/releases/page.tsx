import { useState } from 'react';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';

export default function ReleasesPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', name: 'Todos' },
    { id: 'singles', name: 'Singles' },
    { id: 'eps', name: 'EPs' },
    { id: 'albums', name: 'Álbuns' }
  ];

  const releases = [
    {
      id: 1,
      title: 'Noites de Verão',
      artist: 'Luna Silva',
      type: 'singles',
      typeLabel: 'Single',
      date: '2024',
      cover: 'https://readdy.ai/api/search-image?query=modern%20album%20cover%20art%20for%20summer%20pop%20song%2C%20vibrant%20teal%20and%20orange%20gradient%20background%2C%20minimalist%20design%20with%20geometric%20shapes%2C%20professional%20music%20artwork%2C%20premium%20quality%2C%20artistic%20composition&width=500&height=500&seq=release-page-001&orientation=squarish',
      genre: 'Pop/R&B',
      streams: '10.2M',
      featured: true
    },
    {
      id: 2,
      title: 'Ruas da Cidade',
      artist: 'Rafael Mendes',
      type: 'eps',
      typeLabel: 'EP',
      date: '2024',
      cover: 'https://readdy.ai/api/search-image?query=urban%20hip%20hop%20album%20cover%20art%2C%20dark%20city%20streets%20with%20teal%20and%20bronze%20lighting%2C%20modern%20street%20photography%20style%2C%20professional%20music%20artwork%2C%20premium%20quality%2C%20gritty%20aesthetic&width=500&height=500&seq=release-page-002&orientation=squarish',
      genre: 'Hip Hop/Trap',
      streams: '8.5M',
      featured: true
    },
    {
      id: 3,
      title: 'Alma Brasileira',
      artist: 'Bianca Costa',
      type: 'albums',
      typeLabel: 'Álbum',
      date: '2024',
      cover: 'https://readdy.ai/api/search-image?query=elegant%20soul%20music%20album%20cover%2C%20warm%20bronze%20and%20teal%20tones%2C%20artistic%20portrait%20photography%2C%20sophisticated%20design%2C%20professional%20music%20artwork%2C%20premium%20quality%2C%20emotional%20atmosphere&width=500&height=500&seq=release-page-003&orientation=squarish',
      genre: 'MPB/Soul',
      streams: '6.8M',
      featured: true
    },
    {
      id: 4,
      title: 'Horizonte',
      artist: 'Thiago Alves',
      type: 'singles',
      typeLabel: 'Single',
      date: '2024',
      cover: 'https://readdy.ai/api/search-image?query=indie%20rock%20album%20cover%20art%2C%20atmospheric%20landscape%20with%20teal%20and%20orange%20sky%2C%20alternative%20music%20aesthetic%2C%20professional%20artwork%2C%20premium%20quality%2C%20moody%20composition&width=500&height=500&seq=release-page-004&orientation=squarish',
      genre: 'Rock/Indie',
      streams: '5.2M',
      featured: false
    },
    {
      id: 5,
      title: 'Pulse',
      artist: 'Marina Oliveira',
      type: 'singles',
      typeLabel: 'Single',
      date: '2024',
      cover: 'https://readdy.ai/api/search-image?query=electronic%20music%20album%20cover%2C%20neon%20teal%20and%20orange%20abstract%20waves%2C%20futuristic%20digital%20art%2C%20professional%20EDM%20artwork%2C%20premium%20quality%2C%20vibrant%20energy&width=500&height=500&seq=release-page-005&orientation=squarish',
      genre: 'Eletrônica/House',
      streams: '4.9M',
      featured: false
    },
    {
      id: 6,
      title: 'Raízes',
      artist: 'Pedro Santos',
      type: 'albums',
      typeLabel: 'Álbum',
      date: '2024',
      cover: 'https://readdy.ai/api/search-image?query=country%20music%20album%20cover%2C%20warm%20sunset%20tones%20with%20bronze%20and%20teal%20accents%2C%20rustic%20modern%20design%2C%20professional%20music%20artwork%2C%20premium%20quality%2C%20authentic%20feel&width=500&height=500&seq=release-page-006&orientation=squarish',
      genre: 'Sertanejo/Country',
      streams: '7.3M',
      featured: false
    },
    {
      id: 7,
      title: 'Coração Livre',
      artist: 'Luna Silva',
      type: 'eps',
      typeLabel: 'EP',
      date: '2023',
      cover: 'https://readdy.ai/api/search-image?query=pop%20music%20EP%20cover%20art%2C%20vibrant%20teal%20and%20bronze%20gradient%2C%20modern%20minimalist%20design%20with%20abstract%20shapes%2C%20professional%20music%20artwork%2C%20premium%20quality%2C%20fresh%20aesthetic&width=500&height=500&seq=release-page-007&orientation=squarish',
      genre: 'Pop/R&B',
      streams: '9.1M',
      featured: false
    },
    {
      id: 8,
      title: 'Batidas Urbanas',
      artist: 'Rafael Mendes',
      type: 'singles',
      typeLabel: 'Single',
      date: '2023',
      cover: 'https://readdy.ai/api/search-image?query=urban%20trap%20single%20cover%20art%2C%20dark%20street%20scene%20with%20neon%20teal%20and%20orange%20lights%2C%20modern%20hip%20hop%20aesthetic%2C%20professional%20music%20artwork%2C%20premium%20quality%2C%20edgy%20composition&width=500&height=500&seq=release-page-008&orientation=squarish',
      genre: 'Hip Hop/Trap',
      streams: '6.2M',
      featured: false
    },
    {
      id: 9,
      title: 'Melodias do Coração',
      artist: 'Bianca Costa',
      type: 'singles',
      typeLabel: 'Single',
      date: '2023',
      cover: 'https://readdy.ai/api/search-image?query=soul%20music%20single%20cover%2C%20warm%20bronze%20tones%20with%20teal%20accents%2C%20elegant%20artistic%20design%2C%20professional%20music%20artwork%2C%20premium%20quality%2C%20intimate%20atmosphere&width=500&height=500&seq=release-page-009&orientation=squarish',
      genre: 'MPB/Soul',
      streams: '5.5M',
      featured: false
    }
  ];

  const filteredReleases = selectedFilter === 'all' 
    ? releases 
    : releases.filter(release => release.type === selectedFilter);

  const featuredReleases = releases.filter(r => r.featured);

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=professional%20music%20production%20studio%20with%20vinyl%20records%20and%20album%20covers%20displayed%2C%20modern%20aesthetic%20with%20teal%20and%20bronze%20lighting%2C%20cinematic%20photography%2C%20high-end%20music%20industry%20environment%2C%20artistic%20composition%2C%20premium%20quality&width=1920&height=600&seq=releases-hero-bg&orientation=landscape')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            objectPosition: 'top'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-[#C45C2F]/10 border border-[#C45C2F]/30 rounded-full text-[#C45C2F] text-sm font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Discografia
          </span>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C45C2F] to-[#0EA8A0]">Lançamentos</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            Explore a discografia completa dos artistas Céu Music
          </p>
        </div>
      </section>

      {/* Top Releases of the Month */}
      <section className="relative py-20 bg-gradient-to-b from-black to-[#1A1A1A]">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#C45C2F]/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Top Lançamentos do Mês
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredReleases.map((release, index) => (
              <div
                key={release.id}
                className="group cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-black border-2 border-[#C45C2F]/30 hover:border-[#C45C2F] transition-all duration-500 hover:scale-105 shadow-xl shadow-[#C45C2F]/20">
                  {/* Cover Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={release.cover}
                      alt={release.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    
                    {/* Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#C45C2F]/20 via-transparent to-[#0EA8A0]/20" />
                    </div>

                    {/* Play Button */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center bg-[#C45C2F]/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-2xl shadow-[#C45C2F]/50">
                      <i className="ri-play-fill text-4xl text-white ml-1"></i>
                    </div>

                    {/* Featured Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-[#C45C2F] to-[#A34528] backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
                      <span className="text-white text-xs font-bold flex items-center space-x-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        <i className="ri-fire-fill"></i>
                        <span>Destaque</span>
                      </span>
                    </div>
                  </div>

                  {/* Release Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-[#C45C2F]/20 border border-[#C45C2F]/30 rounded-full text-[#C45C2F] text-xs font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {release.typeLabel}
                      </span>
                      <span className="text-white/50 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {release.date}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#C45C2F] transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {release.title}
                    </h3>
                    <p className="text-white/60 text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {release.artist}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center space-x-2">
                        <i className="ri-headphone-fill text-[#0EA8A0]"></i>
                        <span className="text-white/50 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {release.streams}
                        </span>
                      </div>
                      <button className="px-4 py-2 bg-[#C45C2F]/10 hover:bg-[#C45C2F]/20 text-[#C45C2F] text-xs font-semibold rounded-lg transition-all duration-300 border border-[#C45C2F]/30 hover:border-[#C45C2F]/50 whitespace-nowrap cursor-pointer">
                        Ouvir agora
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="relative py-12 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-[#0EA8A0] to-[#0C3F48] text-white shadow-lg shadow-[#0EA8A0]/30 scale-105'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20'
                }`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Releases */}
      <section className="relative py-20 bg-gradient-to-b from-[#1A1A1A] to-black">
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#0EA8A0]/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Todos os Lançamentos
          </h2>
          
          {/* List View */}
          <div className="space-y-3">
            {filteredReleases.map((release, index) => (
              <div
                key={release.id}
                className="group flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-[#0EA8A0]/30 transition-all duration-300 cursor-pointer"
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* Cover */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={release.cover}
                    alt={release.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <i className="ri-play-fill text-2xl text-white"></i>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-[#0EA8A0] transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {release.title}
                  </h3>
                  <p className="text-white/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {release.artist} • {release.genre}
                  </p>
                </div>

                {/* Type Badge */}
                <div className="hidden md:block">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60 text-xs font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {release.typeLabel}
                  </span>
                </div>

                {/* Streams */}
                <div className="hidden lg:flex items-center space-x-2 text-white/50 text-sm min-w-[100px]">
                  <i className="ri-headphone-fill text-[#0EA8A0]"></i>
                  <span style={{ fontFamily: 'Inter, sans-serif' }}>{release.streams}</span>
                </div>

                {/* Year */}
                <div className="hidden md:block text-white/50 text-sm min-w-[60px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {release.date}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button className="w-10 h-10 flex items-center justify-center bg-[#0EA8A0]/20 hover:bg-[#0EA8A0]/30 rounded-lg transition-all duration-300 cursor-pointer">
                    <i className="ri-play-fill text-[#0EA8A0] text-xl"></i>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 cursor-pointer">
                    <i className="ri-more-fill text-white/60 text-xl"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}