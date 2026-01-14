import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '../../components/feature/Footer';
import aboutImage from '../../../assets/Ativo 2[1].png';

export default function AboutPage() {
  const location = useLocation();

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
  }, []);

  const values = [
    {
      icon: 'ri-heart-3-fill',
      title: 'Fé e Propósito',
      description: 'Acreditamos no poder transformador da música para tocar corações e transformar vidas através de mensagens de fé e esperança.',
      color: '#0EA8A0'
    },
    {
      icon: 'ri-star-fill',
      title: 'Excelência',
      description: 'Buscamos sempre a excelência em nossas produções, utilizando tecnologia de ponta e equipe profissional para entregar o melhor resultado.',
      color: '#C45C2F'
    },
    {
      icon: 'ri-team-fill',
      title: 'Comunidade',
      description: 'Valorizamos o relacionamento e o trabalho em equipe, criando uma família unida em torno da música e da missão de levar esperança ao mundo.',
      color: '#A34528'
    },
    {
      icon: 'ri-lightbulb-fill',
      title: 'Inovação',
      description: 'Estamos sempre em busca de novas formas de expressar a arte e alcançar pessoas, utilizando as melhores ferramentas e tecnologias disponíveis.',
      color: '#0C3F48'
    }
  ];

  const stats = [
    { number: '10+', label: 'Artistas' },
    { number: '50+', label: 'Lançamentos' },
    { number: '1M+', label: 'Streams' },
    { number: '100K+', label: 'Fãs' }
  ];

  return (
    <div className="bg-black min-h-screen">
      {/* Elemento de referência para scroll - invisível no topo */}
      <div id="about-page-top" className="absolute top-0 left-0 w-1 h-1 opacity-0 pointer-events-none" aria-hidden="true"></div>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0EA8A0]/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#C45C2F]/10 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-[#0EA8A0]/10 border border-[#0EA8A0]/30 rounded-full text-[#0EA8A0] text-sm font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Sobre Nós
          </span>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Nossa <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA8A0] to-[#C45C2F]">História</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            Conheça a Céu Music e nossa paixão por transformar sonhos em realidade através da música
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
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            Somos uma gravadora cristã independente que acredita no poder transformador da música para tocar corações e transformar vidas. Nossa missão é descobrir e desenvolver talentos que levam mensagens de fé, esperança e amor através de produções musicais de excelência. Com tecnologia de ponta, equipe profissional e paixão pelo que fazemos, transformamos sonhos em realidade e levamos a música dos nossos artistas para o mundo inteiro.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#1A1A1A] to-black">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#0EA8A0]/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#C45C2F]/5 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center scroll-reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0EA8A0] to-[#C45C2F] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {stat.number}
                </div>
                <div className="text-white/60 text-sm md:text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-20 bg-gradient-to-b from-black to-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center scroll-reveal">
            <div>
              <span className="inline-block px-4 py-2 bg-[#0EA8A0]/10 border border-[#0EA8A0]/30 rounded-full text-[#0EA8A0] text-sm font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Nossa Missão
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Transformar <span className="text-[#0EA8A0]">Sonhos</span> em Realidade
              </h2>
              <p className="text-lg text-white/70 leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                A Céu Music nasceu com o propósito de ser uma plataforma que descobre, desenvolve e promove talentos musicais cristãos. Acreditamos que cada artista tem uma voz única e uma mensagem poderosa para compartilhar com o mundo.
              </p>
              <p className="text-lg text-white/70 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Nossa missão vai além de simplesmente produzir música. Queremos criar uma comunidade onde artistas possam crescer, se desenvolver e alcançar seu potencial máximo, sempre mantendo o foco em levar mensagens de fé, esperança e amor através da música.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0EA8A0]/20 to-[#C45C2F]/20 rounded-3xl blur-2xl"></div>
              <div className="relative glass-card animate-liquid-glass rounded-3xl p-8 border border-[#0EA8A0]/30">
                <div className="text-6xl mb-4 text-center">
                  <i className="ri-music-2-fill text-[#0EA8A0]"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Música com Propósito
                </h3>
                <p className="text-white/70 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Cada produção nossa carrega uma mensagem de transformação e esperança, criada com excelência e paixão.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#1A1A1A] to-black">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#C45C2F]/5 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <span className="inline-block px-4 py-2 bg-[#C45C2F]/10 border border-[#C45C2F]/30 rounded-full text-[#C45C2F] text-sm font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Nossos Valores
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              O que nos <span className="text-[#C45C2F]">Move</span>
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
              Os valores que guiam cada decisão e cada produção da Céu Music
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="glass-card animate-liquid-glass rounded-2xl p-8 hover:border-[#0EA8A0]/50 transition-all duration-500 scroll-reveal group"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div 
                  className="w-16 h-16 flex items-center justify-center rounded-2xl mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${value.color}20`,
                    boxShadow: `0 10px 40px ${value.color}30`
                  }}
                >
                  <i 
                    className={`${value.icon} text-3xl`}
                    style={{ color: value.color }}
                  ></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#0EA8A0] transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {value.title}
                </h3>
                <p className="text-white/60 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
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
            <span className="inline-block px-4 py-2 bg-[#A34528]/10 border border-[#A34528]/30 rounded-full text-[#A34528] text-sm font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Nossa Visão
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              O <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A34528] to-[#0EA8A0]">Futuro</span> que Construímos
            </h2>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
              Sonhamos em ser referência nacional e internacional na produção de música cristã de qualidade, reconhecida pela excelência técnica, pela profundidade das mensagens e pelo impacto transformador em vidas.
            </p>
            <p className="text-lg text-white/70 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              Queremos continuar descobrindo novos talentos, expandindo nosso catálogo e alcançando cada vez mais pessoas com mensagens de fé, esperança e amor através da música que produzimos.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}










