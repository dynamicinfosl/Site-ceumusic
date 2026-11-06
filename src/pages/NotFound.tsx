import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/feature/Navbar';
import Footer from '../components/feature/Footer';

const suggestions = [
  { path: '/artistas', label: 'Conhecer os artistas' },
  { path: '/lancamentos', label: 'Ver os lançamentos' },
  { path: '/contato', label: 'Falar com a Céu Music' },
];

export default function NotFound() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Página não encontrada | Céu Music';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center px-6 pb-20 pt-44 text-center">
        <p className="text-sm font-semibold text-[#0EA8A0]">Erro 404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight [text-wrap:balance] md:text-5xl">
          Não encontramos esta página
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
          O endereço pode estar incorreto ou a página pode ter mudado de lugar.
        </p>
        <Link
          to="/"
          className="mt-10 rounded-full bg-[#0EA8A0] px-8 py-3 font-semibold text-black transition-colors duration-200 hover:bg-[#0EA8A0]/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Voltar para o início
        </Link>
        <nav aria-label="Sugestões" className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {suggestions.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-white/70 underline underline-offset-4 transition-colors duration-200 hover:text-[#0EA8A0]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </main>
      <Footer />
    </div>
  );
}
