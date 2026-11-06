import { Link } from 'react-router-dom';
import logoImage from '../../../assets/Ativo 2[1].png';
import { legalDocuments } from '../../pages/legal/legalInfo';
import { useSocialLinks } from '../../utils/useSocialLinks';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const socialLinks = useSocialLinks();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Artistas', path: '/artistas' },
    { name: 'Lançamentos', path: '/lancamentos' },
    { name: 'Notícias', path: '/noticias' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Contato', path: '/contato' },
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
            <p className="text-white/60 text-sm leading-relaxed">
              Gravadora musical independente dedicada a descobrir e promover talentos únicos. Transformando sonhos em realidade através da música.
            </p>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">
              Links rápidos
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-[#0EA8A0] transition-colors duration-300 text-sm whitespace-nowrap cursor-pointer"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">
              Siga-nos
            </h3>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
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
            <p className="text-white/40 text-sm text-center md:text-left">
              © {currentYear} Céu Music. Todos os direitos reservados.
            </p>
            <nav aria-label="Documentos legais" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {legalDocuments.map((doc) => (
                <Link
                  key={doc.path}
                  to={doc.path}
                  className="text-white/60 hover:text-[#0EA8A0] transition-colors duration-300 text-sm whitespace-nowrap"
                >
                  {doc.label}
                </Link>
              ))}
            </nav>
            <a
              href="https://www.instagram.com/dynamicinfo_sl/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-[#0EA8A0] text-sm transition-colors duration-300 whitespace-nowrap"
            >
              Desenvolvido por Dynamic Info SL
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}