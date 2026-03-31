import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../utils/supabase';

interface NewsItem {
  id: string | number;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    async function fetchNews() {
      if (!supabase) {
        return;
      }
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('publish_date', { ascending: false });

        if (error) throw error;

        if (data) {
          const mapped: NewsItem[] = data.map(n => ({
            id: n.id,
            title: n.title,
            category: n.category || 'Geral',
            date: n.publish_date ? new Date(n.publish_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
            image: n.image_url || 'https://via.placeholder.com/600x400',
            excerpt: n.excerpt || ''
          }));
          setNews(mapped);
        }
      } catch (err) {
        console.error('Erro ao buscar notícias:', err);
      }
    }
    fetchNews();
  }, []);

  const categoryColors: { [key: string]: string } = {
    'Conquista': '#0EA8A0',
    'Tour': '#C45C2F',
    'Premiação': '#A34528',
    'Infraestrutura': '#0C3F48',
    'Colaboração': '#0EA8A0',
    'Evento': '#C45C2F',
    'Geral': '#0EA8A0'
  };

  if (news.length === 0) {
    return null; // Ou um placeholder de "Em breve"
  }

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