import { useContactInfo, useSocialLinks } from '../../../utils/content';

export default function ContactSection() {
  const socialLinks = useSocialLinks();
  const contactInfo = useContactInfo();

  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-[#1A1A1A] to-black">

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#0EA8A0]/10 via-[#C45C2F]/10 to-[#C45C2F]/10 rounded-full blur-[150px]" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            Siga a Céu Music
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Acompanhe nossos artistas e fique por dentro de todas as novidades
          </p>
        </div>

        {/* Social Links Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-[#141414] border border-white/10 hover:border-[#0EA8A0]/50 transition-all duration-500 p-8">
                {/* Icon */}
                <div 
                  className="w-16 h-16 flex items-center justify-center rounded-2xl mb-6 transition-all duration-300 group-hover:scale-110 shadow-lg"
                  style={{
                    backgroundColor: `${social.color}20`,
                  }}
                >
                  <i 
                    className={`${social.icon} text-3xl`}
                    style={{ color: social.color }}
                  ></i>
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#0EA8A0] transition-colors duration-300">
                  {social.name}
                </h3>
                {/* Arrow */}
                <div className="flex items-center space-x-2 text-[#0EA8A0] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
                  <span>Seguir</span>
                  <i className="ri-arrow-right-line"></i>
                </div>

              </div>
            </a>
          ))}
        </div>

        {/* Contact Info */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
            <div className="text-center">
              <div className="w-12 h-12 flex items-center justify-center bg-[#0EA8A0]/20 rounded-xl mx-auto mb-4">
                <i className="ri-mail-fill text-2xl text-[#0EA8A0]"></i>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Email
              </h4>
              <p className="text-white/60 text-sm">
                {contactInfo.email}
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 flex items-center justify-center bg-[#C45C2F]/20 rounded-xl mx-auto mb-4">
                <i className="ri-phone-fill text-2xl text-[#C45C2F]"></i>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Telefone
              </h4>
              <p className="text-white/60 text-sm">
                {contactInfo.phone}
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 flex items-center justify-center bg-[#C45C2F]/20 rounded-xl mx-auto mb-4">
                <i className="ri-map-pin-fill text-2xl text-[#C45C2F]"></i>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Endereço
              </h4>
              <p className="text-white/60 text-sm">
                {contactInfo.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
