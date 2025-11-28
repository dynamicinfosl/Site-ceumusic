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
      title: 'Salva-vidas',
      artist: 'Alexsander Lúcio',
      type: 'singles',
      typeLabel: 'Single',
      date: '2024',
      cover: 'https://img.youtube.com/vi/bdLeReQbtgY/maxresdefault.jpg',
      genre: 'Gospel/CCM',
      streams: '271K',
      featured: true,
      videoUrl: 'https://www.youtube.com/watch?v=bdLeReQbtgY'
    },
    {
      id: 2,
      title: 'Final Feliz',
      artist: 'No Santuário feat Geziel Lima',
      type: 'singles',
      typeLabel: 'Single',
      date: '2024',
      cover: 'https://img.youtube.com/vi/XWBgmBsxkk4/maxresdefault.jpg',
      genre: 'Gospel/CCM',
      streams: '1.8M',
      featured: true,
      videoUrl: 'https://www.youtube.com/watch?v=XWBgmBsxkk4'
    },
    {
      id: 3,
      title: 'Louva na Graça',
      artist: 'Na Graça',
      type: 'singles',
      typeLabel: 'Single',
      date: '2024',
      cover: 'https://img.youtube.com/vi/5bvgSlZamBo/maxresdefault.jpg',
      genre: 'Gospel/CCM',
      streams: '45K',
      featured: true,
      videoUrl: 'https://www.youtube.com/watch?v=5bvgSlZamBo'
    },
    {
      id: 4,
      title: 'Milagres de Deus',
      artist: 'Debora Lopes',
      type: 'singles',
      typeLabel: 'Single',
      date: '2024',
      cover: 'https://img.youtube.com/vi/V1hYFBtdxm8/maxresdefault.jpg',
      genre: 'Gospel/CCM',
      streams: '233K',
      featured: false,
      videoUrl: 'https://www.youtube.com/watch?v=V1hYFBtdxm8'
    },
    {
      id: 5,
      title: 'O Fogo Arderá - Ao Vivo',
      artist: 'Alexsander Lúcio',
      type: 'singles',
      typeLabel: 'Single',
      date: '2024',
      cover: 'https://img.youtube.com/vi/Bqc6B5LzTN0/maxresdefault.jpg',
      genre: 'Gospel/CCM',
      streams: '58.6M',
      featured: false,
      videoUrl: 'https://www.youtube.com/watch?v=Bqc6B5LzTN0&list=RDBqc6B5LzTN0&start_radio=1'
    },
    {
      id: 6,
      title: 'A FÉ - AO VIVO',
      artist: 'Na Graça',
      type: 'singles',
      typeLabel: 'Single',
      date: '2024',
      cover: 'https://img.youtube.com/vi/g89eBxkG-Aw/maxresdefault.jpg',
      genre: 'Gospel/CCM',
      streams: '679.8K',
      featured: false,
      videoUrl: 'https://www.youtube.com/watch?v=g89eBxkG-Aw&list=RDg89eBxkG-Aw&start_radio=1'
    },
    {
      id: 7,
      title: 'SERVO DO CENTURIÃO - AO VIVO',
      artist: 'Nicole Lavinia',
      type: 'singles',
      typeLabel: 'Single',
      date: '2024',
      cover: 'https://img.youtube.com/vi/vpi33yUn1Zc/maxresdefault.jpg',
      genre: 'Gospel/CCM',
      streams: '45K',
      featured: false,
      videoUrl: 'https://www.youtube.com/watch?v=vpi33yUn1Zc&list=RDvpi33yUn1Zc&start_radio=1'
    },
    {
      id: 8,
      title: 'SE LEVANTE',
      artist: 'Maria Pita',
      type: 'singles',
      typeLabel: 'Single',
      date: '2024',
      cover: 'https://img.youtube.com/vi/mb7rskqf1A4/maxresdefault.jpg',
      genre: 'Gospel/CCM',
      streams: '35K',
      featured: false,
      videoUrl: 'https://www.youtube.com/watch?v=mb7rskqf1A4&list=RDEMzFMowVXry3q4Od_yFQGfxw&index=3'
    },
    {
      id: 9,
      title: 'Ao Cheiro das Águas (Ao Vivo)',
      artist: 'William Soares',
      type: 'singles',
      typeLabel: 'Single',
      date: '2024',
      cover: 'https://img.youtube.com/vi/MyhL5CT8-Eo/maxresdefault.jpg',
      genre: 'Gospel/CCM',
      streams: '28K',
      featured: false,
      videoUrl: 'https://www.youtube.com/watch?v=MyhL5CT8-Eo&list=RDMyhL5CT8-Eo&start_radio=1'
    },
    {
      id: 10,
      title: 'EU FAÇO AO VIVO',
      artist: 'Martinha',
      type: 'singles',
      typeLabel: 'Single',
      date: '2024',
      cover: 'https://img.youtube.com/vi/eMv-TwacSck/maxresdefault.jpg',
      genre: 'Gospel/CCM',
      streams: '15.8K',
      featured: false,
      videoUrl: 'https://www.youtube.com/watch?v=eMv-TwacSck&list=RDeMv-TwacSck&start_radio=1'
    },
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
                onClick={() => {
                  if (release.videoUrl) {
                    window.open(release.videoUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
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
                    {release.videoUrl ? (
                      <a
                        href={release.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center bg-[#C45C2F]/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-2xl shadow-[#C45C2F]/50 cursor-pointer"
                      >
                        <i className="ri-play-fill text-4xl text-white ml-1"></i>
                      </a>
                    ) : (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center bg-[#C45C2F]/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-2xl shadow-[#C45C2F]/50">
                        <i className="ri-play-fill text-4xl text-white ml-1"></i>
                      </div>
                    )}

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
                      {release.videoUrl ? (
                        <a
                          href={release.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-[#C45C2F]/10 hover:bg-[#C45C2F]/20 text-[#C45C2F] text-xs font-semibold rounded-lg transition-all duration-300 border border-[#C45C2F]/30 hover:border-[#C45C2F]/50 whitespace-nowrap cursor-pointer inline-block"
                        >
                          Assista ao clipe
                        </a>
                      ) : (
                        <button className="px-4 py-2 bg-[#C45C2F]/10 hover:bg-[#C45C2F]/20 text-[#C45C2F] text-xs font-semibold rounded-lg transition-all duration-300 border border-[#C45C2F]/30 hover:border-[#C45C2F]/50 whitespace-nowrap cursor-pointer">
                          Ouvir agora
                        </button>
                      )}
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
                onClick={() => {
                  if (release.videoUrl) {
                    window.open(release.videoUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
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
                  {release.videoUrl ? (
                    <a
                      href={release.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-[#0EA8A0]/20 hover:bg-[#0EA8A0]/30 rounded-lg transition-all duration-300 cursor-pointer"
                      title="Assistir clipe"
                    >
                      <i className="ri-play-fill text-[#0EA8A0] text-xl"></i>
                    </a>
                  ) : (
                    <button className="w-10 h-10 flex items-center justify-center bg-[#0EA8A0]/20 hover:bg-[#0EA8A0]/30 rounded-lg transition-all duration-300 cursor-pointer">
                      <i className="ri-play-fill text-[#0EA8A0] text-xl"></i>
                    </button>
                  )}
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