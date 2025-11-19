import { useState } from 'react';

export default function HeroSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  return (
    <header className="relative min-h-screen flex flex-col">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40"
        >
          <source src="https://readdy.ai/api/search-image?query=Abstract%20holographic%20liquid%20gradient%20animation%20with%20turquoise%20teal%20bronze%20orange%20colors%20flowing%20smoothly%20dark%20background%20futuristic%20music%20visualization%20neon%20glow%20effects%20cinematic%204k&width=1920&height=1080&seq=hero-video-bg&orientation=landscape" type="video/mp4" />
        </video>
        {/* Holographic Canvas Overlay */}
        <div className="absolute inset-0 holographic-bg opacity-30"></div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 relative z-10">
        <div className="text-center max-w-5xl mx-auto animate-fade-in-up">
          <h1 className="text-5xl lg:text-7xl font-normal leading-tight mb-8 font-montserrat">
            Gravadora <span className="text-[#0EA8A0]">Céu Music</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-montserrat">
            Transformando talentos em estrelas. Produção musical de alta qualidade com tecnologia de ponta e equipe profissional.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handlePlayVideo}
              className="bg-transparent border border-gray-600 text-white px-8 py-3 rounded-full font-semibold hover:border-[#0EA8A0] hover:shadow-[0_0_20px_rgba(14,168,160,0.3)] transition-all duration-300 whitespace-nowrap cursor-pointer font-montserrat"
            >
              Assistir ao Último Lançamento
            </button>
          </div>
        </div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#0EA8A0]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C45C2F]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-[#A34528]/20 rounded-full blur-2xl"></div>
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6">
          <button
            onClick={() => setIsVideoPlaying(false)}
            className="absolute top-6 right-6 text-white w-12 h-12 flex items-center justify-center cursor-pointer hover:text-[#0EA8A0] transition-colors"
          >
            <i className="ri-close-line text-3xl"></i>
          </button>
          <div className="w-full max-w-5xl aspect-video bg-gray-900 rounded-2xl overflow-hidden border border-[#0EA8A0]/30 shadow-[0_0_40px_rgba(14,168,160,0.3)]">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Último Lançamento"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </header>
  );
}
