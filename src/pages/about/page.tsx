import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import aboutImage from '../../../assets/Ativo 2[1].png';
import { useSettings } from '../../utils/content';

const VALUE_COLORS = ['#0EA8A0', '#C45C2F', '#C45C2F', '#0EA8A0'];

const paragraphs = (text = '') => text.split('\n\n').filter(Boolean);

export default function AboutPage() {
  const location = useLocation();
  const about = useSettings()?.about_page;

  // Scroll para o topo ANTES da renderização visual
  useLayoutEffect(() => {
    // Forçar scroll imediato antes de qualquer renderização
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (document.scrollingElement) {
      document.scrollingElement.scrollTop = 0;
    }
    // Também tentar com scrollTo direto
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Scroll para o topo após a renderização também
  useEffect(() => {
    const scrollToTop = () => {
      // Tentar scroll para o elemento de referência primeiro
      const topElement = document.getElementById('about-page-top');
      if (topElement) {
        topElement.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
      
      // Múltiplas formas de garantir o scroll
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = 0;
      }
      // Tentar também com scrollIntoView no body
      if (document.body) {
        document.body.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    };
    
    // Scroll imediato
    scrollToTop();
    
    // Usar requestAnimationFrame para garantir que aconteça após renderização
    requestAnimationFrame(() => {
      scrollToTop();
      requestAnimationFrame(() => {
        scrollToTop();
      });
    });
    
    // Múltiplas tentativas com timeouts para garantir
    const timers = [
      setTimeout(scrollToTop, 0),
      setTimeout(scrollToTop, 10),
      setTimeout(scrollToTop, 50),
      setTimeout(scrollToTop, 100),
      setTimeout(scrollToTop, 200),
      setTimeout(scrollToTop, 300),
      setTimeout(scrollToTop, 500),
    ];
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [location.pathname]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(element => observer.observe(element));

    return () => observer.disconnect();
  }, [about]);

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Elemento de referência para scroll - invisível no topo */}
      <div id="about-page-top" className="absolute top-0 left-0 w-1 h-1 opacity-0 pointer-events-none" aria-hidden="true"></div>

      {/* Hero Section */}
      <section className="relative pt-44 pb-20 overflow-hidden">
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0EA8A0]/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#C45C2F]/10 rounded-full blur-[120px]"></div>
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            Nossa história
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            {about?.intro}
          </p>
        </div>
      </section>

      {/* Logo Section */}
      <section className="relative py-20 bg-gradient-to-b from-black to-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center scroll-reveal">
          <div className="mb-12 flex justify-center">
            <img
              src={aboutImage}
              alt="Céu Music"
              className="max-w-md md:max-w-lg w-full object-contain drop-shadow-[0_0_30px_rgba(14,168,160,0.3)] rounded-2xl"
            />
          </div>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            {about?.story}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#1A1A1A] to-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center scroll-reveal">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {about?.mission_title}
              </h2>
              {paragraphs(about?.mission_text).map((paragraph) => (
                <p key={paragraph} className="text-lg text-white/70 leading-relaxed mb-6 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0EA8A0]/20 to-[#C45C2F]/20 rounded-3xl blur-2xl"></div>
              <div className="relative glass-card animate-liquid-glass rounded-3xl p-8 border border-[#0EA8A0]/30">
                <div className="text-6xl mb-4 text-center">
                  <i className="ri-music-2-fill text-[#0EA8A0]"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  {about?.card_title}
                </h3>
                <p className="text-white/70 text-center">
                  {about?.card_text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#1A1A1A] to-black">
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#0EA8A0]/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#C45C2F]/5 rounded-full blur-[120px]"></div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#C45C2F]/5 rounded-full blur-[120px]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {about?.values_title}
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              {about?.values_text}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(about?.values ?? []).map((value, index) => (
              <div
                key={index}
                className="glass-card animate-liquid-glass rounded-2xl p-8 hover:border-[#0EA8A0]/50 transition-all duration-500 scroll-reveal group"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div 
                  className="w-16 h-16 flex items-center justify-center rounded-2xl mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${VALUE_COLORS[index % VALUE_COLORS.length]}20`,
                  }}
                >
                  <i 
                    className={`${value.icon} text-3xl`}
                    style={{ color: VALUE_COLORS[index % VALUE_COLORS.length] }}
                  ></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#0EA8A0] transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative py-20 bg-gradient-to-b from-black to-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              {about?.vision_title}
            </h2>
            {paragraphs(about?.vision_text).map((paragraph) => (
              <p key={paragraph} className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
