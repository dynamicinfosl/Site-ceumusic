import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

// TODO: Substituir os dados de exemplo pelos dados reais dos artistas
// Estrutura de dados dos artistas - substitua os valores de exemplo pelos dados reais
const artists = [
  {
    id: 1,
    // Nome artístico do artista
    name: 'Luna Silva', // EXEMPLO: Substituir pelo nome artístico real
    // Gênero musical
    genre: 'Pop', // EXEMPLO: Substituir pelo gênero real
    // Foto oficial do artista (URL da imagem)
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&q=80', // EXEMPLO: Substituir pela foto oficial real
    // Links de redes sociais (deixe null se não tiver)
    socialLinks: {
      instagram: 'https://instagram.com', // EXEMPLO: Substituir pelo link real do Instagram
      spotify: 'https://spotify.com', // EXEMPLO: Substituir pelo link real do Spotify
      youtube: 'https://youtube.com', // EXEMPLO: Substituir pelo link real do YouTube
      tiktok: null, // EXEMPLO: Substituir pelo link real do TikTok ou deixe null
      twitter: null, // EXEMPLO: Substituir pelo link real do Twitter/X ou deixe null
      facebook: null, // EXEMPLO: Substituir pelo link real do Facebook ou deixe null
    },
    // Links de músicas disponíveis (deixe array vazio se não tiver)
    musicLinks: [
      { platform: 'Spotify', url: 'https://spotify.com' }, // EXEMPLO: Substituir pelos links reais
      { platform: 'Apple Music', url: 'https://music.apple.com' }, // EXEMPLO: Substituir pelos links reais
      { platform: 'Deezer', url: 'https://deezer.com' }, // EXEMPLO: Substituir pelos links reais
    ],
  },
  {
    id: 2,
    name: 'Rafael Costa', // EXEMPLO: Substituir pelo nome artístico real
    genre: 'Hip Hop', // EXEMPLO: Substituir pelo gênero real
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&q=80', // EXEMPLO: Substituir pela foto oficial real
    socialLinks: {
      instagram: 'https://instagram.com', // EXEMPLO: Substituir pelo link real do Instagram
      spotify: 'https://spotify.com', // EXEMPLO: Substituir pelo link real do Spotify
      youtube: 'https://youtube.com', // EXEMPLO: Substituir pelo link real do YouTube
      tiktok: null, // EXEMPLO: Substituir pelo link real do TikTok ou deixe null
      twitter: null, // EXEMPLO: Substituir pelo link real do Twitter/X ou deixe null
      facebook: null, // EXEMPLO: Substituir pelo link real do Facebook ou deixe null
    },
    musicLinks: [
      { platform: 'Spotify', url: 'https://spotify.com' }, // EXEMPLO: Substituir pelos links reais
      { platform: 'Apple Music', url: 'https://music.apple.com' }, // EXEMPLO: Substituir pelos links reais
    ],
  },
  {
    id: 3,
    name: 'Marina Luz', // EXEMPLO: Substituir pelo nome artístico real
    genre: 'MPB', // EXEMPLO: Substituir pelo gênero real
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=400&fit=crop&q=80', // EXEMPLO: Substituir pela foto oficial real
    socialLinks: {
      instagram: 'https://instagram.com', // EXEMPLO: Substituir pelo link real do Instagram
      spotify: 'https://spotify.com', // EXEMPLO: Substituir pelo link real do Spotify
      youtube: 'https://youtube.com', // EXEMPLO: Substituir pelo link real do YouTube
      tiktok: null, // EXEMPLO: Substituir pelo link real do TikTok ou deixe null
      twitter: null, // EXEMPLO: Substituir pelo link real do Twitter/X ou deixe null
      facebook: null, // EXEMPLO: Substituir pelo link real do Facebook ou deixe null
    },
    musicLinks: [
      { platform: 'Spotify', url: 'https://spotify.com' }, // EXEMPLO: Substituir pelos links reais
      { platform: 'Deezer', url: 'https://deezer.com' }, // EXEMPLO: Substituir pelos links reais
    ],
  },
  {
    id: 4,
    name: 'Pedro Alves', // EXEMPLO: Substituir pelo nome artístico real
    genre: 'Rock', // EXEMPLO: Substituir pelo gênero real
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=400&fit=crop&q=80', // EXEMPLO: Substituir pela foto oficial real
    socialLinks: {
      instagram: 'https://instagram.com', // EXEMPLO: Substituir pelo link real do Instagram
      spotify: 'https://spotify.com', // EXEMPLO: Substituir pelo link real do Spotify
      youtube: 'https://youtube.com', // EXEMPLO: Substituir pelo link real do YouTube
      tiktok: null, // EXEMPLO: Substituir pelo link real do TikTok ou deixe null
      twitter: null, // EXEMPLO: Substituir pelo link real do Twitter/X ou deixe null
      facebook: null, // EXEMPLO: Substituir pelo link real do Facebook ou deixe null
    },
    musicLinks: [
      { platform: 'Spotify', url: 'https://spotify.com' }, // EXEMPLO: Substituir pelos links reais
      { platform: 'Apple Music', url: 'https://music.apple.com' }, // EXEMPLO: Substituir pelos links reais
      { platform: 'Deezer', url: 'https://deezer.com' }, // EXEMPLO: Substituir pelos links reais
    ],
  },
  {
    id: 5,
    name: 'Beatriz Santos', // EXEMPLO: Substituir pelo nome artístico real
    genre: 'Eletrônica', // EXEMPLO: Substituir pelo gênero real
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=400&fit=crop&q=80', // EXEMPLO: Substituir pela foto oficial real
    socialLinks: {
      instagram: 'https://instagram.com', // EXEMPLO: Substituir pelo link real do Instagram
      spotify: 'https://spotify.com', // EXEMPLO: Substituir pelo link real do Spotify
      youtube: 'https://youtube.com', // EXEMPLO: Substituir pelo link real do YouTube
      tiktok: null, // EXEMPLO: Substituir pelo link real do TikTok ou deixe null
      twitter: null, // EXEMPLO: Substituir pelo link real do Twitter/X ou deixe null
      facebook: null, // EXEMPLO: Substituir pelo link real do Facebook ou deixe null
    },
    musicLinks: [
      { platform: 'Spotify', url: 'https://spotify.com' }, // EXEMPLO: Substituir pelos links reais
      { platform: 'Apple Music', url: 'https://music.apple.com' }, // EXEMPLO: Substituir pelos links reais
    ],
  },
  {
    id: 6,
    name: 'Lucas Ferreira', // EXEMPLO: Substituir pelo nome artístico real
    genre: 'Sertanejo', // EXEMPLO: Substituir pelo gênero real
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=400&fit=crop&q=80', // EXEMPLO: Substituir pela foto oficial real
    socialLinks: {
      instagram: 'https://instagram.com', // EXEMPLO: Substituir pelo link real do Instagram
      spotify: 'https://spotify.com', // EXEMPLO: Substituir pelo link real do Spotify
      youtube: 'https://youtube.com', // EXEMPLO: Substituir pelo link real do YouTube
      tiktok: null, // EXEMPLO: Substituir pelo link real do TikTok ou deixe null
      twitter: null, // EXEMPLO: Substituir pelo link real do Twitter/X ou deixe null
      facebook: null, // EXEMPLO: Substituir pelo link real do Facebook ou deixe null
    },
    musicLinks: [
      { platform: 'Spotify', url: 'https://spotify.com' }, // EXEMPLO: Substituir pelos links reais
      { platform: 'Deezer', url: 'https://deezer.com' }, // EXEMPLO: Substituir pelos links reais
    ],
  },
];

export default function ArtistsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;
        
        // Reinicia o scroll quando chega ao fim
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPaused]);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-[#0EA8A0]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-[#C45C2F]/8 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="mb-16 text-center px-6 lg:px-12">
          <h2 className="text-6xl lg:text-7xl mb-4 font-montserrat">
            Nossos <span className="text-[#0EA8A0]">Artistas</span>
          </h2>
        </div>

        {/* Galeria com Scroll Lateral */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide px-6 lg:px-12 pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Duplicar os artistas para scroll infinito */}
          {[...artists, ...artists].map((artist, index) => (
            <div
              key={`${artist.id}-${index}`}
              onClick={() => navigate(`/artist/${artist.id}`)}
              className="glass-card animate-liquid-glass rounded-2xl overflow-hidden hover:border-[#0EA8A0]/50 transition-all duration-500 cursor-pointer group flex-shrink-0 w-[320px] sm:w-[380px]"
            >
              <div className="relative">
                {/* Foto Oficial - Formato Redondo */}
                <div className="flex justify-center pt-8 pb-4">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-[#0EA8A0]/30 group-hover:border-[#0EA8A0] group-hover:shadow-[0_0_30px_rgba(14,168,160,0.4)] transition-all duration-500">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Informações do Artista */}
                <div className="p-6 pt-2">
                  {/* Nome Artístico */}
                  <h3 className="text-2xl font-semibold mb-2 font-montserrat text-white group-hover:text-[#0EA8A0] transition-colors duration-300">
                    {artist.name}
                  </h3>
                  <p className="text-gray-400 mb-5 font-montserrat text-sm">{artist.genre}</p>
                  
                  {/* Redes Sociais */}
                  <div className="mb-5">
                    <p className="text-gray-500 text-xs mb-3 font-montserrat uppercase tracking-wide">Redes Sociais</p>
                    <div className="flex items-center flex-wrap gap-3">
                      {artist.socialLinks.instagram && (
                        <a
                          href={artist.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer text-lg"
                          title="Instagram"
                        >
                          <i className="ri-instagram-line"></i>
                        </a>
                      )}
                      {artist.socialLinks.spotify && (
                        <a
                          href={artist.socialLinks.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer text-lg"
                          title="Spotify"
                        >
                          <i className="ri-spotify-fill"></i>
                        </a>
                      )}
                      {artist.socialLinks.youtube && (
                        <a
                          href={artist.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer text-lg"
                          title="YouTube"
                        >
                          <i className="ri-youtube-fill"></i>
                        </a>
                      )}
                      {artist.socialLinks.tiktok && (
                        <a
                          href={artist.socialLinks.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer text-lg"
                          title="TikTok"
                        >
                          <i className="ri-tiktok-fill"></i>
                        </a>
                      )}
                      {artist.socialLinks.twitter && (
                        <a
                          href={artist.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer text-lg"
                          title="Twitter/X"
                        >
                          <i className="ri-twitter-x-fill"></i>
                        </a>
                      )}
                      {artist.socialLinks.facebook && (
                        <a
                          href={artist.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] transition-colors cursor-pointer text-lg"
                          title="Facebook"
                        >
                          <i className="ri-facebook-fill"></i>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Links de Músicas */}
                  {artist.musicLinks && artist.musicLinks.length > 0 && (
                    <div>
                      <p className="text-gray-500 text-xs mb-3 font-montserrat uppercase tracking-wide">Ouvir Músicas</p>
                      <div className="flex flex-col gap-2">
                        {artist.musicLinks.map((musicLink, idx) => (
                          <a
                            key={idx}
                            href={musicLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-800/30 hover:bg-[#0EA8A0]/10 hover:border-[#0EA8A0]/30 border border-transparent transition-all duration-300 group/music"
                          >
                            <span className="text-sm text-gray-300 group-hover/music:text-[#0EA8A0] transition-colors font-montserrat">
                              {musicLink.platform}
                            </span>
                            <i className="ri-external-link-line text-gray-400 group-hover/music:text-[#0EA8A0] transition-colors"></i>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 px-6 lg:px-12">
          <Link
            to="/artists"
            className="inline-block bg-transparent border border-gray-600 text-white px-8 py-3 rounded-full font-semibold hover:border-[#0EA8A0] hover:shadow-[0_0_20px_rgba(14,168,160,0.3)] transition-all duration-300 whitespace-nowrap cursor-pointer font-montserrat"
          >
            Ver Todos os Artistas
          </Link>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
