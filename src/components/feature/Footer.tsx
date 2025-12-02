import { Link } from 'react-router-dom';
import logoImage from '../../../assets/Ativo 2[1].png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Artistas', path: '/artistas' },
    { name: 'Lançamentos', path: '/lancamentos' },
    { name: 'Notícias', path: '/noticias' },
    { name: 'Contato', path: '/contato' },
  ];

  const socialLinks = [
    { icon: 'ri-instagram-fill', url: 'https://www.instagram.com/ceumusicbr/', color: '#E4405F' },
    { icon: 'ri-youtube-fill', url: 'https://www.youtube.com/@ceumusicbrasil', color: '#FF0000' },
    { icon: 'ri-spotify-fill', url: 'https://spotify.com', color: '#1DB954' },
    { icon: 'ri-tiktok-fill', url: 'https://tiktok.com', color: '#000000' },
  ];

  return (
    <footer className="bg-[#1A1A1A] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo e Descrição */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center group cursor-pointer">
              <img
                src={logoImage}
                alt="Céu Music"
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              Gravadora musical independente dedicada a descobrir e promover talentos únicos. Transformando sonhos em realidade através da música.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Links Rápidos
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-[#0EA8A0] transition-colors duration-300 text-sm whitespace-nowrap cursor-pointer"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Siga-nos
            </h3>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-[#0EA8A0]/20 border border-white/10 hover:border-[#0EA8A0]/30 transition-all duration-300 group cursor-pointer"
                >
                  <i className={`${social.icon} text-xl text-white/60 group-hover:text-[#0EA8A0] transition-colors duration-300`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-white/40 text-sm text-center md:text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
              © {currentYear} Céu Music. Todos os direitos reservados.
            </p>
            <a
              href="https://readdy.ai/?origin=logo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-[#0EA8A0] text-sm transition-colors duration-300 whitespace-nowrap cursor-pointer"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Powered by Readdy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}