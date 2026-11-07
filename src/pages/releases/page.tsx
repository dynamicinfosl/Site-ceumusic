import { useState, useRef, useEffect } from 'react';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { normalizeName, useReleases, useSettings, type Release as ReleaseRow } from '../../utils/content';
import { getYouTubeThumbnail } from '../../utils/youtubeLink';

interface Release {
  id: number | string;
  title: string;
  artist: string;
  type: string;
  typeLabel: string;
  date: string;
  cover: string;
  genre: string;
  streams: string;
  featured: boolean;
  videoUrl: string;
}

const typeFilterIds: Record<string, string> = { single: 'singles', ep: 'eps', album: 'albums' };

function toFilterId(releaseType: string | null): string {
  return typeFilterIds[normalizeName(releaseType ?? '')] ?? 'singles';
}

function toRelease(row: ReleaseRow): Release {
  return {
    id: row.id,
    title: row.title,
    artist: row.artist_name ?? '',
    type: toFilterId(row.release_type),
    typeLabel: row.release_type ?? 'Single',
    date: row.release_date ?? '',
    cover: row.cover_url || getYouTubeThumbnail(row.video_url) || '',
    genre: row.genre ?? '',
    streams: row.streams ?? '',
    featured: !!row.featured,
    videoUrl: row.video_url || row.streaming_link || '',
  };
}

export default function ReleasesPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [openMenuId, setOpenMenuId] = useState<number | string | null>(null);
  const releaseRows = useReleases();
  const settings = useSettings();
  const menuRefs = useRef<{ [key: number | string]: HTMLDivElement | null }>({});

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId !== null) {
        const menuElement = menuRefs.current[openMenuId];
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };

    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openMenuId]);

  const filters = [
    { id: 'all', name: 'Todos' },
    { id: 'singles', name: 'Singles' },
    { id: 'eps', name: 'EPs' },
    { id: 'albums', name: 'Álbuns' }
  ];



  const releases: Release[] = (releaseRows ?? []).map(toRelease);

  const filteredReleases = selectedFilter === 'all'
    ? releases 
    : releases.filter(release => release.type === selectedFilter);

  const featuredReleases = releases.filter(r => r.featured);

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-44 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: settings?.page_background ? `url('${settings.page_background}')` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            objectPosition: 'top'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6">
            Nossos lançamentos
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Explore a discografia completa dos artistas Céu Music
          </p>
        </div>
      </section>

      {/* Top Releases of the Month */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-black to-[#1A1A1A]">
        
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#C45C2F]/10 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-12">
            Top lançamentos do mês
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
                <div className="relative overflow-hidden rounded-2xl bg-[#141414] border-2 border-[#C45C2F]/30 hover:border-[#C45C2F] transition-all duration-500">
                  {/* Cover Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={release.cover}
                      alt={release.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    

                    {/* Play Button */}
                    {release.videoUrl ? (
                      <a
                        href={release.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center bg-[#C45C2F]/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 cursor-pointer"
                      >
                        <i className="ri-play-fill text-4xl text-white ml-1"></i>
                      </a>
                    ) : (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center bg-[#C45C2F]/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                        <i className="ri-play-fill text-4xl text-white ml-1"></i>
                      </div>
                    )}

                    {/* Featured Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-[#C45C2F] backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
                      <span className="text-white text-xs font-bold flex items-center space-x-1">
                        <i className="ri-fire-fill"></i>
                        <span>Destaque</span>
                      </span>
                    </div>
                  </div>

                  {/* Release Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-[#C45C2F]/20 border border-[#C45C2F]/30 rounded-full text-[#C45C2F] text-xs font-semibold">
                        {release.typeLabel}
                      </span>
                      <span className="text-white/50 text-xs">
                        {release.date}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#C45C2F] transition-colors duration-300">
                      {release.title}
                    </h3>
                    <p className="text-white/60 text-sm mb-4">
                      {release.artist}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center space-x-2">
                        <i className="ri-headphone-fill text-[#0EA8A0]"></i>
                        <span className="text-white/50 text-sm">
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
      <section className="relative py-8 sm:py-12 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer text-sm sm:text-base min-h-[44px] ${
                  selectedFilter === filter.id
                    ? 'bg-[#0EA8A0] hover:bg-[#0EA8A0]/85 text-black scale-105'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Releases */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-[#1A1A1A] to-black">
        
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#0EA8A0]/10 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-12">
            Todos os lançamentos
          </h2>
          
          {/* List View */}
          <div className="space-y-2 sm:space-y-3">
            {filteredReleases.map((release, index) => (
              <div
                key={release.id}
                className="group flex flex-col md:flex-row items-start md:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-[#0EA8A0]/30 transition-all duration-300 cursor-pointer"
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
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={release.cover}
                    alt={release.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <i className="ri-play-fill text-xl sm:text-2xl text-white"></i>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-base sm:text-lg mb-1 group-hover:text-[#0EA8A0] transition-colors duration-300">
                    {release.title}
                  </h3>
                  <p className="text-white/60 text-xs sm:text-sm">
                    {[release.artist, release.genre].filter(Boolean).join(' • ')}
                  </p>
                </div>

                {/* Type Badge */}
                <div className="hidden md:block">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60 text-xs font-semibold">
                    {release.typeLabel}
                  </span>
                </div>

                {/* Streams */}
                <div className="hidden lg:flex items-center space-x-2 text-white/50 text-sm min-w-[100px]">
                  {release.streams && <i className="ri-headphone-fill text-[#0EA8A0]" aria-hidden="true"></i>}
                  <span>{release.streams}</span>
                </div>

                {/* Year */}
                <div className="hidden md:block text-white/50 text-sm min-w-[60px]">
                  {release.date}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {release.videoUrl ? (
                    <a
                      href={release.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 flex items-center justify-center bg-[#0EA8A0]/20 hover:bg-[#0EA8A0]/30 rounded-lg transition-all duration-300 cursor-pointer min-h-[44px] min-w-[44px]"
                      title="Assistir clipe"
                    >
                      <i className="ri-play-fill text-[#0EA8A0] text-lg sm:text-xl"></i>
                    </a>
                  ) : (
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 flex items-center justify-center bg-[#0EA8A0]/20 hover:bg-[#0EA8A0]/30 rounded-lg transition-all duration-300 cursor-pointer min-h-[44px] min-w-[44px]"
                    >
                      <i className="ri-play-fill text-[#0EA8A0] text-lg sm:text-xl"></i>
                    </button>
                  )}
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === release.id ? null : release.id);
                      }}
                      className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 cursor-pointer min-h-[44px] min-w-[44px]"
                      title="Mais opções"
                    >
                      <i className="ri-more-fill text-white/60 text-lg sm:text-xl"></i>
                    </button>
                    {openMenuId === release.id && (
                      <div
                        ref={(el) => {
                          menuRefs.current[release.id] = el;
                        }}
                        className="absolute right-0 bottom-full mb-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (release.videoUrl) {
                              window.open(release.videoUrl, '_blank', 'noopener,noreferrer');
                            }
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2"
                        >
                          <i className="ri-youtube-fill text-red-500"></i>
                          <span>Assistir no YouTube</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Aqui você pode adicionar outras ações como compartilhar, adicionar à playlist, etc.
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2"
                        >
                          <i className="ri-share-line text-[#0EA8A0]"></i>
                          <span>Compartilhar</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Copiar link
                            if (release.videoUrl) {
                              navigator.clipboard.writeText(release.videoUrl);
                            }
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2"
                        >
                          <i className="ri-links-line text-[#0EA8A0]"></i>
                          <span>Copiar link</span>
                        </button>
                      </div>
                    )}
                  </div>
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