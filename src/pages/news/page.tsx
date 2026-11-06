import { useEffect, useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { supabase } from '../../utils/supabase';

interface NewsItem {
  id: string;
  title: string;
  category: string | null;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  publish_date: string | null;
}

type LoadStatus = 'loading' | 'ready' | 'error';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

function formatDate(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : dateFormatter.format(date);
}

function ArticleBody({ item, featured = false }: { item: NewsItem; featured?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();
  const date = formatDate(item.publish_date);
  const hasMore = !!item.content?.trim();

  return (
    <div className={featured ? 'p-8 md:p-12 flex flex-col justify-center' : 'p-6'}>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/60">
        {item.category && <span className="font-semibold text-[#0EA8A0]">{item.category}</span>}
        {date && <time dateTime={item.publish_date ?? undefined}>{date}</time>}
      </p>

      {featured ? (
        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
          {item.title}
        </h2>
      ) : (
        <h3 className="mt-3 text-xl font-bold text-white">
          {item.title}
        </h3>
      )}

      {item.excerpt && (
        <p className={`mt-4 leading-relaxed text-white/70 ${featured ? 'text-lg' : 'text-sm'}`}>
          {item.excerpt}
        </p>
      )}

      {hasMore && isOpen && (
        <div id={contentId} className="mt-4 space-y-4 text-base leading-relaxed text-white/75">
          {item.content!.split(/\n{2,}/).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}

      {hasMore && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={contentId}
          className="mt-5 inline-flex min-h-11 items-center gap-2 self-start rounded-sm font-semibold text-[#0EA8A0] transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA8A0]"
        >
          {isOpen ? 'Ler menos' : 'Ler mais'}
          <i className={isOpen ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} aria-hidden="true"></i>
        </button>
      )}
    </div>
  );
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    let active = true;

    async function loadNews() {
      if (!supabase) {
        setStatus('error');
        return;
      }
      const { data, error } = await supabase.from('news').select('*').order('publish_date', { ascending: false });
      if (!active) return;
      if (error) {
        console.error('Erro ao carregar notícias:', error);
        setStatus('error');
        return;
      }
      setNews(data ?? []);
      setStatus('ready');
    }

    loadNews();
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => [...new Set(news.map((item) => item.category).filter((category): category is string => !!category))],
    [news]
  );

  const showAll = selectedCategory === 'all';
  const filteredNews = showAll ? news : news.filter((item) => item.category === selectedCategory);
  const featured = showAll ? filteredNews[0] : undefined;
  const gridItems = showAll ? filteredNews.slice(1) : filteredNews;

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <section className="relative pt-44 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0EA8A0]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#C45C2F]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Últimas novidades
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Fique por dentro de tudo que acontece no universo Céu Music
          </p>
        </div>
      </section>

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div aria-live="polite">
          {status === 'loading' && (
            <p className="py-20 text-center text-white/60">
              Carregando notícias…
            </p>
          )}

          {status === 'error' && (
            <div className="py-20 text-center">
              <p className="text-lg text-white">
                Não foi possível carregar as notícias.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 min-h-11 rounded-full bg-[#0EA8A0] px-6 font-semibold text-black transition-colors duration-200 hover:bg-[#0EA8A0]/85"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {status === 'ready' && news.length === 0 && (
            <div className="py-20 text-center">
              <h2 className="text-2xl font-bold text-white">
                Em breve, novidades por aqui
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/70">
                Enquanto isso, conheça os últimos trabalhos dos nossos artistas.
              </p>
              <Link
                to="/lancamentos"
                className="mt-8 inline-flex min-h-11 items-center rounded-full bg-[#0EA8A0] px-6 font-semibold text-black transition-colors duration-200 hover:bg-[#0EA8A0]/85"
              >
                Ver lançamentos
              </Link>
            </div>
          )}
        </div>

        {news.length > 0 && (
          <>
            {categories.length > 1 && (
              <div role="group" aria-label="Filtrar por categoria" className="mb-12 flex flex-wrap items-center justify-center gap-3">
                {['all', ...categories].map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={selectedCategory === category}
                    className={`min-h-11 rounded-full px-6 font-semibold transition-colors duration-200 ${
                      selectedCategory === category
                        ? 'bg-[#0EA8A0] text-black'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {category === 'all' ? 'Todas' : category}
                  </button>
                ))}
              </div>
            )}

            {featured && (
              <article className="mb-12 overflow-hidden rounded-3xl bg-[#111] md:grid md:grid-cols-2">
                {featured.image_url && (
                  <img src={featured.image_url} alt="" className="aspect-video h-full w-full object-cover md:aspect-auto" />
                )}
                <ArticleBody item={featured} featured />
              </article>
            )}

            {gridItems.length > 0 && (
              <div className="grid items-start gap-8 md:grid-cols-2 lg:grid-cols-3">
                {gridItems.map((item) => (
                  <article key={item.id} className="overflow-hidden rounded-2xl bg-[#111]">
                    {item.image_url && (
                      <img src={item.image_url} alt="" loading="lazy" className="aspect-video w-full object-cover" />
                    )}
                    <ArticleBody item={item} />
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
