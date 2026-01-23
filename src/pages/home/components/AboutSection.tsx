import { Link } from 'react-router-dom';
import aboutImage from '../../../../assets/Ativo 2[1].png';

export default function AboutSection() {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-black via-[#1A1A1A] to-black">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#0EA8A0]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#C45C2F]/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Content */}
        <div className="text-center">
          <span
            className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-[#0EA8A0]/10 border border-[#0EA8A0]/30 rounded-full text-[#0EA8A0] text-xs sm:text-sm font-semibold mb-6 sm:mb-8"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Sobre Nós
          </span>
          
          {/* Logo em cima */}
          <div className="mb-6 sm:mb-8 lg:mb-10 flex justify-center">
            <img
              src={aboutImage}
              alt="Céu Music"
              className="max-w-[200px] sm:max-w-xs md:max-w-sm w-full object-contain drop-shadow-[0_0_25px_rgba(0,0,0,0.7)] rounded-2xl"
            />
          </div>

          {/* Texto em baixo */}
          <p
            className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Somos uma gravadora cristã independente que acredita no poder transformador da música para tocar corações e transformar vidas. Nossa missão é descobrir e desenvolver talentos que levam mensagens de fé, esperança e amor através de produções musicais de excelência. Com tecnologia de ponta, equipe profissional e paixão pelo que fazemos, transformamos sonhos em realidade e levamos a música dos nossos artistas para o mundo inteiro.
          </p>

          <Link
            to="/sobre"
            onClick={(e) => {
              // Scroll para o topo antes de navegar - múltiplas formas
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              window.scrollTo(0, 0);
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
              if (document.scrollingElement) {
                document.scrollingElement.scrollTop = 0;
              }
              // Garantir scroll após um pequeno delay também
              requestAnimationFrame(() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
              });
            }}
            className="inline-flex items-center gap-2 bg-transparent border border-gray-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:border-[#0EA8A0] hover:shadow-[0_0_20px_rgba(14,168,160,0.3)] hover:text-[#0EA8A0] transition-all duration-300 whitespace-nowrap cursor-pointer font-montserrat text-sm sm:text-base min-h-[44px]"
          >
            Saiba Mais
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}