import { useParams } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import NotFound from '../NotFound';
import { useArtists } from '../../utils/content';
import { getYouTubeThumbnail } from '../../utils/youtubeLink';

export default function ArtistDetailPage() {
  const { id } = useParams();
  const artists = useArtists();

  if (artists === null) {
    return (
      <div className="bg-black min-h-screen">
        <Navbar />
        <p className="pt-52 text-center text-white/60" aria-live="polite">
          Carregando artista…
        </p>
      </div>
    );
  }

  // Os links antigos usam o número do artista, como /artista/1
  const artist = artists.find((row) => row.id === id || String(row.legacy_id) === id);
  if (!artist) return <NotFound />;

  const image = artist.image_url ?? '';
  const songs = artist.songs ?? [];
  const videos = artist.videos ?? [];
  const followerCounts = [
    { key: 'instagram', count: artist.followers?.instagram, icon: 'ri-instagram-fill text-[#E4405F]' },
    { key: 'spotify', count: artist.followers?.spotify, icon: 'ri-spotify-fill text-[#1DB954]' },
    { key: 'youtube', count: artist.followers?.youtube, icon: 'ri-youtube-fill text-[#FF0000]' },
  ].filter((item) => item.count);

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-20 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('${image}')`,
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
              <div className="w-64 h-64 rounded-2xl overflow-hidden border-4 border-[#0EA8A0]/50 group-hover:border-[#0EA8A0] transition-all duration-300">
                <img
                  src={image}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: artist.photo_position ?? undefined }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#0EA8A0]/20 to-[#C45C2F]/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Artist Info */}
            <div className="flex-1 text-center md:text-left">
              <span className="block text-sm font-medium text-[#0EA8A0] mb-3">
                {artist.genre}
              </span>
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
                {artist.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-white/70">
                {followerCounts.map((item) => (
                  <div key={item.key} className="flex items-center space-x-2">
                    <i className={`${item.icon} text-xl`} aria-hidden="true"></i>
                    <span>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biography */}
      <section className="relative py-20 bg-gradient-to-b from-black to-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-8">
            Biografia
          </h2>
          <div className="prose prose-invert max-w-none">
            {(artist.bio ?? '').split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-white/70 text-lg leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Songs */}
      {songs.length > 0 && (
      <section className="relative py-20 bg-[#1A1A1A]">
        
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#0EA8A0]/10 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12">
            Músicas populares
          </h2>
          <div className="space-y-3">
            {songs.map((song, index) => (
              <div
                key={index}
                className="group flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-[#0EA8A0]/30 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[#0EA8A0]/20 rounded-lg group-hover:bg-[#0EA8A0]/30 transition-all duration-300">
                  <i className="ri-play-fill text-2xl text-[#0EA8A0]"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold mb-1 group-hover:text-[#0EA8A0] transition-colors duration-300">
                    {song.title}
                  </h3>
                  <p className="text-white/50 text-sm">
                    {song.album}
                  </p>
                </div>
                <div className="hidden md:block text-white/50 text-sm">
                  {song.plays} plays
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Videos */}
      {videos.length > 0 && (
      <section className="relative py-20 bg-gradient-to-b from-[#1A1A1A] to-black">
        
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#C45C2F]/10 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12">
            Videoclipes
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {videos.map((video, index) => {
              const content = (
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl bg-[#141414] border border-white/10 hover:border-[#C45C2F]/50 transition-all duration-500">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={getYouTubeThumbnail(video.url, 'hqdefault') ?? image}
                        alt={video.title}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                      
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center bg-[#C45C2F]/90 backdrop-blur-sm rounded-full opacity-90 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                        <i className="ri-play-fill text-4xl text-white ml-1"></i>
                      </div>

                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-lg flex items-center space-x-2">
                        <i className="ri-eye-fill text-[#0EA8A0] text-sm"></i>
                        <span className="text-white text-xs font-semibold">
                          YouTube
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#C45C2F] transition-colors duration-300">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                </div>
              );

              if (video.url) {
                return (
                  <a
                    key={index}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <div key={index}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Social Links */}
      <section className="relative py-20 bg-gradient-to-b from-black to-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Siga {artist.name}
          </h2>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[
              {
                key: 'instagram',
                url: artist.instagram,
                icon: 'ri-instagram-fill',
                containerClass:
                  'bg-[#E4405F]/20 hover:bg-[#E4405F]/30 border-[#E4405F]/30 hover:border-[#E4405F]/50',
                iconClass: 'text-[#E4405F]',
              },
              {
                key: 'spotify',
                url: artist.spotify,
                icon: 'ri-spotify-fill',
                containerClass:
                  'bg-[#1DB954]/20 hover:bg-[#1DB954]/30 border-[#1DB954]/30 hover:border-[#1DB954]/50',
                iconClass: 'text-[#1DB954]',
              },
              {
                key: 'youtube',
                url: artist.youtube,
                icon: 'ri-youtube-fill',
                containerClass:
                  'bg-[#FF0000]/20 hover:bg-[#FF0000]/30 border-[#FF0000]/30 hover:border-[#FF0000]/50',
                iconClass: 'text-[#FF0000]',
              },
            ].map((social) => {
              const baseClasses =
                'w-16 h-16 flex items-center justify-center rounded-full border transition-all duration-300';
              const disabledClasses = 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed';

              if (!social.url) {
                return (
                  <button
                    key={social.key}
                    type="button"
                    disabled
                    className={`${baseClasses} ${disabledClasses}`}
                    aria-disabled="true"
                    title="Em breve"
                  >
                    <i className={`${social.icon} text-3xl`}></i>
                  </button>
                );
              }

              return (
                <a
                  key={social.key}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${baseClasses} ${social.containerClass} hover:scale-110 cursor-pointer`}
                >
                  <i className={`${social.icon} text-3xl ${social.iconClass}`}></i>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}