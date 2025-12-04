import { useState, useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '../../components/feature/Footer';

export default function NewsPage() {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');

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
      const topElement = document.getElementById('news-page-top');
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

  const categories = [
    { id: 'all', name: 'Todas' },
    { id: 'conquista', name: 'Conquistas' },
    { id: 'tour', name: 'Tours' },
    { id: 'premiacao', name: 'Premiações' },
    { id: 'colaboracao', name: 'Colaborações' },
    { id: 'evento', name: 'Eventos' }
  ];

  const news = [
    {
      id: 1,
      title: 'Luna Silva alcança 10 milhões de streams no Spotify',
      category: 'conquista',
      categoryLabel: 'Conquista',
      date: '15 Jan 2024',
      image: 'https://readdy.ai/api/search-image?query=professional%20music%20industry%20celebration%20photo%2C%20female%20pop%20artist%20celebrating%20success%20with%20teal%20and%20bronze%20lighting%2C%20modern%20studio%20setting%2C%20high-quality%20photography%2C%20joyful%20atmosphere%2C%20premium%20editorial%20style&width=800&height=500&seq=news-page-001&orientation=landscape',
      excerpt: 'A artista celebra marco histórico com seu single "Noites de Verão", que conquistou o público brasileiro e internacional.',
      content: 'Luna Silva alcançou um marco impressionante em sua carreira ao atingir 10 milhões de streams no Spotify com seu single "Noites de Verão". O feito foi comemorado pela artista e pela equipe da Céu Music como um dos maiores sucessos da gravadora em 2024.'
    },
    {
      id: 2,
      title: 'Rafael Mendes anuncia turnê nacional',
      category: 'tour',
      categoryLabel: 'Tour',
      date: '12 Jan 2024',
      image: 'https://readdy.ai/api/search-image?query=hip%20hop%20concert%20announcement%20photo%2C%20male%20rapper%20on%20stage%20with%20dramatic%20teal%20and%20orange%20lighting%2C%20energetic%20performance%2C%20professional%20concert%20photography%2C%20urban%20aesthetic%2C%20premium%20quality&width=800&height=500&seq=news-page-002&orientation=landscape',
      excerpt: 'O rapper vai percorrer 15 cidades brasileiras apresentando seu novo EP "Ruas da Cidade" a partir de março.',
      content: 'Rafael Mendes anunciou oficialmente sua primeira turnê nacional, que passará por 15 cidades brasileiras entre março e junho de 2024. A turnê "Ruas da Cidade" promete levar o melhor do hip hop nacional aos fãs de todo o país.'
    },
    {
      id: 3,
      title: 'Bianca Costa indicada ao Prêmio da Música Brasileira',
      category: 'premiacao',
      categoryLabel: 'Premiação',
      date: '10 Jan 2024',
      image: 'https://readdy.ai/api/search-image?query=elegant%20music%20awards%20ceremony%20photo%2C%20female%20soul%20singer%20in%20sophisticated%20setting%20with%20warm%20bronze%20and%20teal%20lighting%2C%20formal%20event%20photography%2C%20premium%20quality%2C%20artistic%20composition&width=800&height=500&seq=news-page-003&orientation=landscape',
      excerpt: 'A cantora recebeu indicação na categoria "Melhor Álbum de MPB" com "Alma Brasileira".',
      content: 'Bianca Costa foi indicada ao prestigioso Prêmio da Música Brasileira na categoria "Melhor Álbum de MPB" com seu trabalho "Alma Brasileira". A cerimônia de premiação acontecerá em março de 2024.'
    },
    {
      id: 4,
      title: 'Céu Music inaugura novo estúdio de gravação',
      category: 'evento',
      categoryLabel: 'Infraestrutura',
      date: '08 Jan 2024',
      image: 'https://readdy.ai/api/search-image?query=modern%20professional%20recording%20studio%20interior%2C%20high-end%20audio%20equipment%20with%20teal%20and%20bronze%20accent%20lighting%2C%20state-of-the-art%20mixing%20console%2C%20premium%20production%20facility%2C%20architectural%20photography&width=800&height=500&seq=news-page-004&orientation=landscape',
      excerpt: 'Novo espaço conta com equipamentos de última geração e tecnologia de ponta para produção musical.',
      content: 'A Céu Music inaugurou seu novo estúdio de gravação, equipado com tecnologia de ponta e os melhores equipamentos do mercado. O espaço promete elevar ainda mais a qualidade das produções da gravadora.'
    },
    {
      id: 5,
      title: 'Marina Oliveira colabora com DJ internacional',
      category: 'colaboracao',
      categoryLabel: 'Colaboração',
      date: '05 Jan 2024',
      image: 'https://readdy.ai/api/search-image?query=electronic%20music%20collaboration%20photo%2C%20female%20DJ%20in%20modern%20studio%20with%20neon%20teal%20and%20orange%20lighting%2C%20futuristic%20production%20setup%2C%20professional%20music%20photography%2C%20vibrant%20atmosphere&width=800&height=500&seq=news-page-005&orientation=landscape',
      excerpt: 'A produtora anuncia parceria inédita que promete revolucionar a cena eletrônica brasileira.',
      content: 'Marina Oliveira anunciou uma colaboração inédita com um renomado DJ internacional. A parceria promete trazer uma nova sonoridade para a música eletrônica brasileira e será lançada em fevereiro.'
    },
    {
      id: 6,
      title: 'Pedro Santos bate recorde de público em show',
      category: 'evento',
      categoryLabel: 'Evento',
      date: '03 Jan 2024',
      image: 'https://readdy.ai/api/search-image?query=massive%20country%20music%20concert%20crowd%2C%20male%20singer%20performing%20for%20huge%20audience%20with%20warm%20bronze%20and%20teal%20stage%20lighting%2C%20epic%20concert%20photography%2C%20professional%20quality%2C%20energetic%20atmosphere&width=800&height=500&seq=news-page-006&orientation=landscape',
      excerpt: 'Apresentação reuniu mais de 50 mil pessoas em evento histórico para a música sertaneja.',
      content: 'Pedro Santos fez história ao reunir mais de 50 mil pessoas em seu show em São Paulo, estabelecendo um novo recorde para apresentações de artistas da Céu Music. O evento foi um marco na carreira do cantor.'
    },
    {
      id: 7,
      title: 'Thiago Alves lança clipe gravado em locações internacionais',
      category: 'conquista',
      categoryLabel: 'Conquista',
      date: '28 Dez 2023',
      image: 'https://readdy.ai/api/search-image?query=international%20music%20video%20production%2C%20male%20rock%20artist%20filming%20in%20exotic%20location%20with%20teal%20and%20bronze%20cinematic%20lighting%2C%20professional%20film%20crew%2C%20premium%20quality%2C%20artistic%20composition&width=800&height=500&seq=news-page-007&orientation=landscape',
      excerpt: 'O videoclipe de "Horizonte" foi filmado em três países diferentes e conta com produção cinematográfica.',
      content: 'Thiago Alves surpreendeu os fãs com o lançamento do videoclipe de "Horizonte", gravado em três países diferentes. A produção cinematográfica elevou o padrão dos clipes nacionais.'
    },
    {
      id: 8,
      title: 'Céu Music anuncia programa de mentoria para novos talentos',
      category: 'evento',
      categoryLabel: 'Evento',
      date: '20 Dez 2023',
      image: 'https://readdy.ai/api/search-image?query=music%20mentorship%20program%20photo%2C%20diverse%20group%20of%20young%20musicians%20in%20modern%20studio%20with%20teal%20and%20bronze%20lighting%2C%20educational%20setting%2C%20professional%20photography%2C%20inspiring%20atmosphere&width=800&height=500&seq=news-page-008&orientation=landscape',
      excerpt: 'Gravadora lança iniciativa para descobrir e desenvolver novos artistas da música brasileira.',
      content: 'A Céu Music anunciou o lançamento de um programa de mentoria voltado para novos talentos da música brasileira. A iniciativa busca descobrir e desenvolver a próxima geração de artistas.'
    },
    {
      id: 9,
      title: 'Luna Silva e Rafael Mendes anunciam colaboração inédita',
      category: 'colaboracao',
      categoryLabel: 'Colaboração',
      date: '15 Dez 2023',
      image: 'https://readdy.ai/api/search-image?query=music%20collaboration%20studio%20session%2C%20female%20pop%20singer%20and%20male%20rapper%20working%20together%20with%20teal%20and%20bronze%20lighting%2C%20creative%20atmosphere%2C%20professional%20photography%2C%20premium%20quality&width=800&height=500&seq=news-page-009&orientation=landscape',
      excerpt: 'Os dois maiores artistas da Céu Music se unem em single que promete dominar as paradas.',
      content: 'Luna Silva e Rafael Mendes anunciaram uma colaboração inédita que promete ser um dos maiores lançamentos de 2024. O single será lançado em fevereiro e já gera grande expectativa entre os fãs.'
    }
  ];

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const categoryColors: { [key: string]: string } = {
    'conquista': '#0EA8A0',
    'tour': '#C45C2F',
    'premiacao': '#A34528',
    'evento': '#0C3F48',
    'colaboracao': '#0EA8A0'
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Elemento de referência para scroll - invisível no topo */}
      <div id="news-page-top" className="absolute top-0 left-0 w-1 h-1 opacity-0 pointer-events-none" aria-hidden="true"></div>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=professional%20music%20journalism%20and%20news%20editorial%20office%2C%20modern%20newsroom%20with%20teal%20and%20bronze%20accent%20lighting%2C%20premium%20media%20production%20environment%2C%20cinematic%20photography%2C%20high-end%20aesthetic%2C%20artistic%20composition&width=1920&height=600&seq=news-hero-bg&orientation=landscape')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            objectPosition: 'top'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-[#A34528]/10 border border-[#A34528]/30 rounded-full text-[#A34528] text-sm font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Notícias
          </span>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Últimas <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A34528] to-[#0EA8A0]">Novidades</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            Fique por dentro de tudo que acontece no universo Céu Music
          </p>
        </div>
      </section>

      {/* Featured News */}
      <section className="relative py-20 bg-gradient-to-b from-black to-[#1A1A1A]">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#0EA8A0]/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Destaque
          </h2>
          <a href={`/noticia/${news[0].id}`} className="group cursor-pointer block">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1A1A] to-black border-2 border-[#0EA8A0]/30 hover:border-[#0EA8A0] transition-all duration-500 shadow-2xl shadow-[#0EA8A0]/20">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative aspect-video md:aspect-auto overflow-hidden">
                  <img
                    src={news[0].image}
                    alt={news[0].title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50 md:to-black" />
                  
                  {/* Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0EA8A0] to-[#C45C2F] shadow-lg shadow-[#0EA8A0]/50" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 mb-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ 
                        backgroundColor: `${categoryColors[news[0].category]}20`,
                        color: categoryColors[news[0].category],
                        fontFamily: 'Montserrat, sans-serif',
                        border: `1px solid ${categoryColors[news[0].category]}40`
                      }}
                    >
                      {news[0].categoryLabel}
                    </span>
                    <span className="text-white/50 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {news[0].date}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-[#0EA8A0] transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {news[0].title}
                  </h3>
                  
                  <p className="text-white/70 text-lg mb-6 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {news[0].excerpt}
                  </p>

                  <div className="flex items-center space-x-2 text-[#0EA8A0] font-semibold group-hover:translate-x-2 transition-transform duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <span>Ler mais</span>
                    <i className="ri-arrow-right-line text-xl"></i>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Filter Section */}
      <section className="relative py-12 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-[#A34528] to-[#C45C2F] text-white shadow-lg shadow-[#A34528]/30 scale-105'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20'
                }`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="relative py-20 bg-gradient-to-b from-[#1A1A1A] to-black">
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#C45C2F]/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.slice(1).map((item, index) => (
              <a
                key={item.id}
                href={`/noticia/${item.id}`}
                className="group cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-black border border-white/10 hover:border-[#C45C2F]/50 transition-all duration-500 hover:scale-105">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
                        style={{ 
                          backgroundColor: `${categoryColors[item.category]}40`,
                          color: categoryColors[item.category],
                          fontFamily: 'Montserrat, sans-serif',
                          border: `1px solid ${categoryColors[item.category]}60`
                        }}
                      >
                        {item.categoryLabel}
                      </span>
                    </div>

                    {/* Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C45C2F] to-[#0EA8A0] shadow-lg shadow-[#C45C2F]/50" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-white/50 text-xs mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <i className="ri-calendar-line"></i>
                      <span>{item.date}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#C45C2F] transition-colors duration-300 line-clamp-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {item.title}
                    </h3>

                    <p className="text-white/60 text-sm mb-4 line-clamp-2 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {item.excerpt}
                    </p>

                    <div className="flex items-center space-x-2 text-[#C45C2F] text-sm font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      <span>Ler mais</span>
                      <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform duration-300"></i>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}