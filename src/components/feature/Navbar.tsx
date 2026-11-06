import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logoImage from '../../../assets/Ativo 2[1].png';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/artistas', label: 'Artistas' },
  { path: '/lancamentos', label: 'Lançamentos' },
  { path: '/noticias', label: 'Notícias' },
  { path: '/sobre', label: 'Sobre' },
  { path: '/contato', label: 'Contato' },
];

const listenUrl = 'https://www.youtube.com/@ceumusicbrasil';
const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA8A0]';

function CeuMusicLogo() {
  return (
    <Link to="/" className={`flex items-center justify-center group cursor-pointer relative rounded-md ${focusRing}`}>
      <img
        src={logoImage}
        alt="Céu Music, página inicial"
        className="h-10 w-auto transition-all duration-300 group-hover:opacity-90 group-hover:scale-105 object-contain"
      />
      {/* Efeito de glow no hover */}
      <span className="absolute inset-0 bg-[#0EA8A0]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10 pointer-events-none"></span>
    </Link>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  // Na home o hero já mostra o logo em destaque; a altura fica reservada para o menu não mudar de lugar
  const logoVisibility = pathname === '/' ? 'invisible' : '';

  return (
    <>
      {/* Desktop Navbar - Centered */}
      <div
        className="navbar-hero-desktop absolute top-6 left-1/2 -translate-x-1/2 z-50 hidden lg:block"
        style={{
          position: 'fixed', // Use fixed to stay relative to viewport
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'auto',
          pointerEvents: 'auto',
        }}
      >
        <div className={`flex justify-center mb-4 relative ${logoVisibility}`} style={{ position: 'relative', transform: 'none' }}>
          <CeuMusicLogo />
        </div>

        <nav
          aria-label="Menu principal"
          className="bg-transparent backdrop-blur-md border border-gray-800/50 rounded-full px-6 py-3 relative overflow-hidden group"
          style={{ position: 'relative', transform: 'none' }}
        >
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0EA8A0]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>

          <div className="flex items-center justify-center space-x-8 relative z-10">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `${isActive ? 'text-white font-semibold' : 'text-gray-300'} hover:text-white transition-colors duration-300 cursor-pointer text-sm whitespace-nowrap relative group/link rounded-sm ${focusRing}`
                }
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-0 bg-[#0EA8A0]/20 blur-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></span>
              </NavLink>
            ))}
            <a
              href={listenUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-[#0EA8A0] text-black px-4 py-2 rounded-full font-semibold hover:bg-[#0EA8A0]/90 transition-colors duration-300 whitespace-nowrap cursor-pointer text-sm relative overflow-hidden group/btn ${focusRing}`}
            >
              <span className="relative z-10">Ouça Agora</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
            </a>
          </div>
        </nav>
      </div>

      {/* Mobile Navbar */}
      <div
        className="navbar-hero-mobile lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-solid border-gray-800"
        style={{ position: 'fixed' }}
      >
        <div className="flex flex-col">
          <div className={`flex justify-center pt-3 pb-2 ${logoVisibility}`}>
            <CeuMusicLogo />
          </div>

          {/* Botão de menu centralizado */}
          <div className="flex justify-center pb-3">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className={`text-white w-11 h-11 flex items-center justify-center cursor-pointer relative group rounded-md ${focusRing}`}
            >
              <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl relative z-10`} aria-hidden="true"></i>
              <span className="absolute inset-0 bg-[#0EA8A0]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav id="mobile-menu" aria-label="Menu principal" className="bg-black/95 backdrop-blur-md animate-fade-in-up">
            <div className="flex flex-col space-y-4 px-6 py-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `${isActive ? 'text-white font-semibold' : 'text-gray-300'} hover:text-white transition-colors duration-300 cursor-pointer relative group py-2 rounded-sm ${focusRing}`
                  }
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#0EA8A0] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></span>
                  <span className="absolute inset-0 bg-[#0EA8A0]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </NavLink>
              ))}
              <a
                href={listenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-[#0EA8A0] text-black px-4 py-2 rounded-full font-semibold hover:bg-[#0EA8A0]/90 transition-colors duration-300 text-center cursor-pointer relative overflow-hidden group ${focusRing}`}
              >
                <span className="relative z-10">Ouça Agora</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </a>
            </div>
          </nav>
        )}
      </div>
    </>
  );
}
