import { useParams } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';

export default function ArtistDetailPage() {
  const { id } = useParams();

  // Mock data - em produção viria de uma API
  const artist = {
    id: 1,
    name: 'Luna Silva',
    genre: 'Pop/R&B',
    image: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20young%20female%20pop%20singer%20with%20confident%20expression%2C%20studio%20lighting%20with%20teal%20and%20bronze%20glow%20effects%2C%20modern%20urban%20style%2C%20high%20fashion%20aesthetic%2C%20cinematic%20photography%2C%20premium%20quality%2C%20artistic%20mood%20lighting&width=800&height=800&seq=artist-detail-001&orientation=squarish',
    banner: 'https://readdy.ai/api/search-image?query=professional%20music%20artist%20banner%20photo%2C%20female%20pop%20singer%20performing%20on%20stage%20with%20dramatic%20teal%20and%20bronze%20lighting%2C%20wide%20cinematic%20shot%2C%20concert%20atmosphere%20with%20glowing%20effects%2C%20premium%20quality%20photography%2C%20artistic%20composition&width=1920&height=600&seq=artist-banner-001&orientation=landscape',
    bio: 'Luna Silva é uma cantora e compositora brasileira de 24 anos que conquistou o país com sua voz única e letras envolventes. Nascida em São Paulo, Luna começou sua carreira musical aos 16 anos, participando de competições locais e ganhando reconhecimento por suas performances emocionantes.\n\nCom influências que vão do R&B ao pop contemporâneo, Luna desenvolveu um estilo próprio que mistura melodias cativantes com letras profundas sobre amor, superação e empoderamento. Seu single de estreia "Noites de Verão" alcançou mais de 10 milhões de streams no Spotify em apenas três meses.\n\nAlém de sua carreira solo, Luna é conhecida por suas colaborações com outros artistas da Céu Music e por seu engajamento em causas sociais, especialmente relacionadas à educação musical para jovens de comunidades carentes.',
    instagram: '@lunasilva',
    spotify: 'Luna Silva',
    youtube: 'Luna Silva Official',
    followers: {
      instagram: '450K',
      spotify: '2.5M',
      youtube: '1.2M'
    },
    songs: [
      { id: 1, title: 'Noites de Verão', album: 'Single', duration: '3:45', plays: '10.2M' },
      { id: 2, title: 'Coração Livre', album: 'Debut EP', duration: '4:12', plays: '8.5M' },
      { id: 3, title: 'Sem Medo', album: 'Debut EP', duration: '3:28', plays: '6.8M' },
      { id: 4, title: 'Brilhar', album: 'Debut EP', duration: '3:55', plays: '5.2M' },
      { id: 5, title: 'Renascer', album: 'Single', duration: '4:20', plays: '4.9M' }
    ],
    videos: [
      {
        id: 1,
        title: 'Noites de Verão (Official Video)',
        thumbnail: 'https://readdy.ai/api/search-image?query=professional%20music%20video%20scene%20with%20female%20pop%20singer%20performing%20on%20stage%2C%20dramatic%20teal%20and%20orange%20stage%20lighting%2C%20cinematic%20composition%2C%20high%20production%20value%2C%20concert%20atmosphere%20with%20glowing%20effects&width=600&height=340&seq=artist-video-001&orientation=landscape',
        views: '2.5M'
      },
      {
        id: 2,
        title: 'Coração Livre (Lyric Video)',
        thumbnail: 'https://readdy.ai/api/search-image?query=artistic%20lyric%20video%20scene%20with%20female%20pop%20singer%2C%20vibrant%20teal%20and%20bronze%20visual%20effects%2C%20modern%20typography%2C%20cinematic%20quality%2C%20creative%20composition%20with%20glowing%20elements&width=600&height=340&seq=artist-video-002&orientation=landscape',
        views: '1.8M'
      }
    ],
    shows: [
      { id: 1, date: '15 Mar 2024', city: 'São Paulo', venue: 'Espaço das Américas', status: 'Confirmado' },
      { id: 2, date: '22 Mar 2024', city: 'Rio de Janeiro', venue: 'Vivo Rio', status: 'Confirmado' },
      { id: 3, date: '05 Abr 2024', city: 'Belo Horizonte', venue: 'Music Hall', status: 'Em breve' },
      { id: 4, date: '12 Abr 2024', city: 'Curitiba', venue: 'Live Curitiba', status: 'Em breve' }
    ]
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-20 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('${artist.banner}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            objectPosition: 'top'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            {/* Artist Photo */}
            <div className="relative group">
              <div className="w-64 h-64 rounded-2xl overflow-hidden border-4 border-[#0EA8A0]/50 shadow-2xl shadow-[#0EA8A0]/30 group-hover:border-[#0EA8A0] transition-all duration-300">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#0EA8A0]/20 to-[#C45C2F]/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Artist Info */}
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block px-4 py-2 bg-[#0EA8A0]/10 border border-[#0EA8A0]/30 rounded-full text-[#0EA8A0] text-sm font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {artist.genre}
              </span>
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {artist.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-white/70">
                <div className="flex items-center space-x-2">
                  <i className="ri-instagram-fill text-[#E4405F] text-xl"></i>
                  <span style={{ fontFamily: 'Inter, sans-serif' }}>{artist.followers.instagram}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-spotify-fill text-[#1DB954] text-xl"></i>
                  <span style={{ fontFamily: 'Inter, sans-serif' }}>{artist.followers.spotify}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-youtube-fill text-[#FF0000] text-xl"></i>
                  <span style={{ fontFamily: 'Inter, sans-serif' }}>{artist.followers.youtube}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biography */}
      <section className="relative py-20 bg-gradient-to-b from-black to-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Biografia
          </h2>
          <div className="prose prose-invert max-w-none">
            {artist.bio.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-white/70 text-lg leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Songs */}
      <section className="relative py-20 bg-[#1A1A1A]">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#0EA8A0]/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Músicas Populares
          </h2>
          <div className="space-y-3">
            {artist.songs.map((song, index) => (
              <div
                key={song.id}
                className="group flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-[#0EA8A0]/30 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[#0EA8A0]/20 rounded-lg group-hover:bg-[#0EA8A0]/30 transition-all duration-300">
                  <i className="ri-play-fill text-2xl text-[#0EA8A0]"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold mb-1 group-hover:text-[#0EA8A0] transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {song.title}
                  </h3>
                  <p className="text-white/50 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {song.album}
                  </p>
                </div>
                <div className="hidden md:block text-white/50 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {song.plays} plays
                </div>
                <div className="text-white/50 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {song.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="relative py-20 bg-gradient-to-b from-[#1A1A1A] to-black">
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#C45C2F]/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Videoclipes
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {artist.videos.map((video) => (
              <div
                key={video.id}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-black border border-white/10 hover:border-[#C45C2F]/50 transition-all duration-500 hover:scale-105">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center bg-[#C45C2F]/90 backdrop-blur-sm rounded-full opacity-90 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 shadow-2xl shadow-[#C45C2F]/50">
                      <i className="ri-play-fill text-4xl text-white ml-1"></i>
                    </div>

                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-lg flex items-center space-x-2">
                      <i className="ri-eye-fill text-[#0EA8A0] text-sm"></i>
                      <span className="text-white text-xs font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {video.views}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#C45C2F] transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {video.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shows */}
      <section className="relative py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Próximos Shows
          </h2>
          <div className="space-y-4">
            {artist.shows.map((show) => (
              <div
                key={show.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-[#0EA8A0]/30 transition-all duration-300"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="text-[#0EA8A0] font-bold text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {show.date}
                    </span>
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        show.status === 'Confirmado' 
                          ? 'bg-[#0EA8A0]/20 text-[#0EA8A0] border border-[#0EA8A0]/30' 
                          : 'bg-[#C45C2F]/20 text-[#C45C2F] border border-[#C45C2F]/30'
                      }`}
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {show.status}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {show.city}
                  </h3>
                  <p className="text-white/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {show.venue}
                  </p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-[#0EA8A0] to-[#0C3F48] text-white font-semibold rounded-full shadow-lg shadow-[#0EA8A0]/30 hover:shadow-[#0EA8A0]/50 hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer">
                  Comprar Ingresso
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="relative py-20 bg-gradient-to-b from-black to-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Siga {artist.name}
          </h2>
          <div className="flex items-center justify-center gap-6">
            <a
              href={`https://instagram.com/${artist.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 flex items-center justify-center bg-[#E4405F]/20 hover:bg-[#E4405F]/30 rounded-full border border-[#E4405F]/30 hover:border-[#E4405F]/50 transition-all duration-300 hover:scale-110 cursor-pointer"
            >
              <i className="ri-instagram-fill text-3xl text-[#E4405F]"></i>
            </a>
            <a
              href={`https://open.spotify.com/artist/${artist.spotify}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 flex items-center justify-center bg-[#1DB954]/20 hover:bg-[#1DB954]/30 rounded-full border border-[#1DB954]/30 hover:border-[#1DB954]/50 transition-all duration-300 hover:scale-110 cursor-pointer"
            >
              <i className="ri-spotify-fill text-3xl text-[#1DB954]"></i>
            </a>
            <a
              href={`https://youtube.com/${artist.youtube}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 flex items-center justify-center bg-[#FF0000]/20 hover:bg-[#FF0000]/30 rounded-full border border-[#FF0000]/30 hover:border-[#FF0000]/50 transition-all duration-300 hover:scale-110 cursor-pointer"
            >
              <i className="ri-youtube-fill text-3xl text-[#FF0000]"></i>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}