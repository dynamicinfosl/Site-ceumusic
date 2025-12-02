import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../../assets/Ativo 2[1].png';

// Componente do Logo Céu Music
function CeuMusicLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-10 w-auto',
    md: 'h-14 w-auto',
    lg: 'h-20 w-auto'
  };

  return (
    <Link to="/" className="flex items-center justify-center group cursor-pointer relative">
      <img 
        src={logoImage} 
        alt="Céu Music" 
        className={`${sizeClasses[size]} transition-all duration-300 group-hover:opacity-90 group-hover:scale-105 object-contain`}
      />
      {/* Efeito de glow no hover */}
      <span className="absolute inset-0 bg-[#0EA8A0]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10 pointer-events-none"></span>
    </Link>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navbar - Centered */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden lg:block">
        {/* Logo acima do menu */}
        <div className="flex justify-center mb-4 relative">
          <CeuMusicLogo size="sm" />
        </div>
        
        <nav className="bg-transparent backdrop-blur-md border border-gray-800/50 rounded-full px-6 py-3 relative overflow-hidden group">
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0EA8A0]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
          
          <div className="flex items-center justify-center space-x-8 relative z-10">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white transition-all duration-300 cursor-pointer text-sm whitespace-nowrap font-montserrat relative group/link"
            >
              <span className="relative z-10">Home</span>
              <span className="absolute inset-0 bg-[#0EA8A0]/20 blur-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <Link 
              to="/artistas" 
              className="text-gray-300 hover:text-white transition-all duration-300 cursor-pointer text-sm whitespace-nowrap font-montserrat relative group/link"
            >
              <span className="relative z-10">Artistas</span>
              <span className="absolute inset-0 bg-[#0EA8A0]/20 blur-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <Link 
              to="/lancamentos" 
              className="text-gray-300 hover:text-white transition-all duration-300 cursor-pointer text-sm whitespace-nowrap font-montserrat relative group/link"
            >
              <span className="relative z-10">Lançamentos</span>
              <span className="absolute inset-0 bg-[#0EA8A0]/20 blur-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <Link 
              to="/noticias" 
              className="text-gray-300 hover:text-white transition-all duration-300 cursor-pointer text-sm whitespace-nowrap font-montserrat relative group/link"
            >
              <span className="relative z-10">Notícias</span>
              <span className="absolute inset-0 bg-[#0EA8A0]/20 blur-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <Link 
              to="/contato" 
              className="text-gray-300 hover:text-white transition-all duration-300 cursor-pointer text-sm flex items-center whitespace-nowrap font-montserrat relative group/link"
            >
              <span className="relative z-10 flex items-center">
                Contato
                <i className="ri-arrow-right-up-line ml-1 text-xs"></i>
              </span>
              <span className="absolute inset-0 bg-[#0EA8A0]/20 blur-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <a 
              href="https://www.youtube.com/@ceumusicbrasil" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0EA8A0] text-black px-4 py-2 rounded-full font-semibold hover:bg-[#0EA8A0]/90 transition-all duration-300 whitespace-nowrap cursor-pointer text-sm font-montserrat relative overflow-hidden group/btn"
            >
              <span className="relative z-10">Ouça Agora</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
            </a>
          </div>
        </nav>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="flex flex-col">
          {/* Logo acima do menu mobile */}
          <div className="flex justify-center pt-3 pb-2">
            <CeuMusicLogo size="sm" />
          </div>
          
          {/* Botão de menu centralizado */}
          <div className="flex justify-center pb-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white w-10 h-10 flex items-center justify-center cursor-pointer relative group"
            >
              <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl relative z-10`}></i>
              <span className="absolute inset-0 bg-[#0EA8A0]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="bg-black/95 backdrop-blur-md border-t border-gray-800 animate-fade-in-up">
            <div className="flex flex-col space-y-4 px-6 py-6">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-all duration-300 cursor-pointer font-montserrat relative group py-2"
              >
                <span className="relative z-10">Home</span>
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#0EA8A0] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></span>
                <span className="absolute inset-0 bg-[#0EA8A0]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
              <Link 
                to="/artistas" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-all duration-300 cursor-pointer font-montserrat relative group py-2"
              >
                <span className="relative z-10">Artistas</span>
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#0EA8A0] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></span>
                <span className="absolute inset-0 bg-[#0EA8A0]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
              <Link 
                to="/lancamentos" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-all duration-300 cursor-pointer font-montserrat relative group py-2"
              >
                <span className="relative z-10">Lançamentos</span>
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#0EA8A0] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></span>
                <span className="absolute inset-0 bg-[#0EA8A0]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
              <Link 
                to="/noticias" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-all duration-300 cursor-pointer font-montserrat relative group py-2"
              >
                <span className="relative z-10">Notícias</span>
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#0EA8A0] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></span>
                <span className="absolute inset-0 bg-[#0EA8A0]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
              <Link 
                to="/contato" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-all duration-300 cursor-pointer font-montserrat relative group py-2"
              >
                <span className="relative z-10">Contato</span>
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#0EA8A0] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></span>
                <span className="absolute inset-0 bg-[#0EA8A0]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
              <a 
                href="https://www.youtube.com/@ceumusicbrasil" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0EA8A0] text-black px-4 py-2 rounded-full font-semibold hover:bg-[#0EA8A0]/90 transition-all duration-300 text-center cursor-pointer font-montserrat relative overflow-hidden group"
              >
                <span className="relative z-10">Ouça Agora</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
