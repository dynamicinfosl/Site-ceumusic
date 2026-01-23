import { Link } from 'react-router-dom';

export default function NewsSection() {
  const news = [
    {
      id: 1,
      title: 'Luna Silva alcança 10 milhões de streams no Spotify',
      category: 'Conquista',
      date: '15 Jan 2024',
      image: 'https://readdy.ai/api/search-image?query=professional%20music%20industry%20celebration%20photo%2C%20female%20pop%20artist%20celebrating%20success%20with%20teal%20and%20bronze%20lighting%2C%20modern%20studio%20setting%2C%20high-quality%20photography%2C%20joyful%20atmosphere%2C%20premium%20editorial%20style&width=600&height=400&seq=news-001&orientation=landscape',
      excerpt: 'A artista celebra marco histórico com seu single "Noites de Verão", que conquistou o público brasileiro e internacional.'
    },
    {
      id: 2,
      title: 'Rafael Mendes anuncia turnê nacional',
      category: 'Tour',
      date: '12 Jan 2024',
      image: 'https://readdy.ai/api/search-image?query=hip%20hop%20concert%20announcement%20photo%2C%20male%20rapper%20on%20stage%20with%20dramatic%20teal%20and%20orange%20lighting%2C%20energetic%20performance%2C%20professional%20concert%20photography%2C%20urban%20aesthetic%2C%20premium%20quality&width=600&height=400&seq=news-002&orientation=landscape',
      excerpt: 'O rapper vai percorrer 15 cidades brasileiras apresentando seu novo EP "Ruas da Cidade" a partir de março.'
    },
    {
      id: 3,
      title: 'Bianca Costa indicada ao Prêmio da Música Brasileira',
      category: 'Premiação',
      date: '10 Jan 2024',
      image: 'https://readdy.ai/api/search-image?query=elegant%20music%20awards%20ceremony%20photo%2C%20female%20soul%20singer%20in%20sophisticated%20setting%20with%20warm%20bronze%20and%20teal%20lighting%2C%20formal%20event%20photography%2C%20premium%20quality%2C%20artistic%20composition&width=600&height=400&seq=news-003&orientation=landscape',
      excerpt: 'A cantora recebeu indicação na categoria "Melhor Álbum de MPB" com "Alma Brasileira".'
    },
    {
      id: 4,
      title: 'Céu Music inaugura novo estúdio de gravação',
      category: 'Infraestrutura',
      date: '08 Jan 2024',
      image: 'https://readdy.ai/api/search-image?query=modern%20professional%20recording%20studio%20interior%2C%20high-end%20audio%20equipment%20with%20teal%20and%20bronze%20accent%20lighting%2C%20state-of-the-art%20mixing%20console%2C%20premium%20production%20facility%2C%20architectural%20photography&width=600&height=400&seq=news-004&orientation=landscape',
      excerpt: 'Novo espaço conta com equipamentos de última geração e tecnologia de ponta para produção musical.'
    },
    {
      id: 5,
      title: 'Marina Oliveira colabora com DJ internacional',
      category: 'Colaboração',
      date: '05 Jan 2024',
      image: 'https://readdy.ai/api/search-image?query=electronic%20music%20collaboration%20photo%2C%20female%20DJ%20in%20modern%20studio%20with%20neon%20teal%20and%20orange%20lighting%2C%20futuristic%20production%20setup%2C%20professional%20music%20photography%2C%20vibrant%20atmosphere&width=600&height=400&seq=news-005&orientation=landscape',
      excerpt: 'A produtora anuncia parceria inédita que promete revolucionar a cena eletrônica brasileira.'
    },
    {
      id: 6,
      title: 'Pedro Santos bate recorde de público em show',
      category: 'Evento',
      date: '03 Jan 2024',
      image: 'https://readdy.ai/api/search-image?query=massive%20country%20music%20concert%20crowd%2C%20male%20singer%20performing%20for%20huge%20audience%20with%20warm%20bronze%20and%20teal%20stage%20lighting%2C%20epic%20concert%20photography%2C%20professional%20quality%2C%20energetic%20atmosphere&width=600&height=400&seq=news-006&orientation=landscape',
      excerpt: 'Apresentação reuniu mais de 50 mil pessoas em evento histórico para a música sertaneja.'
    }
  ];

  const categoryColors: { [key: string]: string } = {
    'Conquista': '#0EA8A0',
    'Tour': '#C45C2F',
    'Premiação': '#A34528',
    'Infraestrutura': '#0C3F48',
    'Colaboração': '#0EA8A0',
    'Evento': '#C45C2F'
  };

  return (
    <section className="relative py-32 bg-black">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#0EA8A0]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#C45C2F]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-[#A34528]/10 border border-[#A34528]/30 rounded-full text-[#A34528] text-xs sm:text-sm font-semibold mb-4 sm:mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Notícias
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Últimas <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A34528] to-[#0EA8A0]">Novidades</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            Fique por dentro de tudo que acontece no universo Céu Music
          </p>
        </div>

        {/* Featured News */}
        <div className="mb-12">
          <Link to={`/noticias/${news[0].id}`} className="group cursor-pointer block">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1A1A] to-black border border-white/10 hover:border-[#0EA8A0]/50 transition-all duration-500">
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
                        fontFamily: 'Montserrat, sans-serif'
                      }}
                    >
                      {news[0].category}
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
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {news.slice(1).map((item, index) => (
            <Link
              key={item.id}
              to={`/noticias/${item.id}`}
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
                      {item.category}
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
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/noticias"
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
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-[#A34528] to-[#C45C2F] text-white font-semibold rounded-full shadow-lg shadow-[#A34528]/30 hover:shadow-[#A34528]/50 hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <span>Ver todas as notícias</span>
            <i className="ri-arrow-right-line text-xl"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}