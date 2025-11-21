import { useState } from 'react';

export default function VideosSection() {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  const videos = [
    {
      id: 1,
      title: 'Salva-vidas - Alexsander Lúcio',
      artist: 'Alex Lúcio',
      views: '271K',
      videoId: 'bdLeReQbtgY', // ID do YouTube
      thumbnail: `https://img.youtube.com/vi/bdLeReQbtgY/maxresdefault.jpg`,
      duration: '3:45'
    },
    {
      id: 2,
      title: 'Final Feliz - No Santuário feat Geziel Lima',
      artist: 'No Santuário',
      views: '1.8M',
      videoId: 'XWBgmBsxkk4', // ID do YouTube
      thumbnail: `https://img.youtube.com/vi/XWBgmBsxkk4/maxresdefault.jpg`,
      duration: '4:12'
    },
    {
      id: 3,
      title: 'Louva na Graça - Na Graça',
      artist: 'Na Graça',
      views: '45K',
      videoId: '5bvgSlZamBo', // ID do YouTube
      thumbnail: `https://img.youtube.com/vi/5bvgSlZamBo/maxresdefault.jpg`,
      duration: '5:20'
    },
    {
      id: 4,
      title: 'Milagres de Deus - Debora Lopes',
      artist: 'Debora Lopes',
      views: '233K',
      videoId: 'V1hYFBtdxm8', // ID do YouTube
      thumbnail: `https://img.youtube.com/vi/V1hYFBtdxm8/maxresdefault.jpg`,
      duration: '3:58'
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-[#1A1A1A] to-black">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#0EA8A0]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#A34528]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 bg-[#C45C2F]/10 border border-[#C45C2F]/30 rounded-full text-[#C45C2F] text-sm font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Videoclipes
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Assista aos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C45C2F] to-[#0EA8A0]">Clipes</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            Produções audiovisuais de alta qualidade dos nossos artistas
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="group cursor-pointer"
              onClick={() => setSelectedVideo(video.id)}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-black border border-white/10 hover:border-[#C45C2F]/50 transition-all duration-500 hover:scale-105">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  
                  {/* Glow Border Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 border-2 border-[#C45C2F]/50 rounded-2xl shadow-2xl shadow-[#C45C2F]/30" />
                  </div>

                  {/* Play Button */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center bg-[#C45C2F]/90 backdrop-blur-sm rounded-full opacity-90 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 shadow-2xl shadow-[#C45C2F]/50">
                    <i className="ri-play-fill text-4xl text-white ml-1"></i>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-lg">
                    <span className="text-white text-xs font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {video.duration}
                    </span>
                  </div>

                  {/* Views Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-lg flex items-center space-x-2">
                    <i className="ri-eye-fill text-[#0EA8A0] text-sm"></i>
                    <span className="text-white text-xs font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {video.views}
                    </span>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#C45C2F] transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {video.title}
                  </h3>
                  <p className="text-white/60 text-sm flex items-center space-x-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <i className="ri-user-voice-fill text-[#0EA8A0]"></i>
                    <span>{video.artist}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-6"
            onClick={() => setSelectedVideo(null)}
          >
            <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center text-white hover:text-[#C45C2F] transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-3xl"></i>
              </button>
              <div className="aspect-video bg-black rounded-2xl border-2 border-[#C45C2F]/50 shadow-2xl shadow-[#C45C2F]/30 overflow-hidden">
                {videos.find(v => v.id === selectedVideo)?.videoId ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videos.find(v => v.id === selectedVideo)?.videoId}?autoplay=1`}
                    title="Video Player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <i className="ri-play-circle-fill text-8xl text-[#C45C2F] mb-4"></i>
                      <p className="text-white/70 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Vídeo em breve
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}