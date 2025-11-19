export default function AboutSection() {
  const features = [
    {
      icon: 'ri-music-2-fill',
      title: 'Produção Musical',
      description: 'Estúdio de última geração com equipamentos premium e produtores experientes para criar o som perfeito.',
      color: '#0EA8A0'
    },
    {
      icon: 'ri-global-fill',
      title: 'Distribuição Global',
      description: 'Sua música nas principais plataformas digitais: Spotify, Apple Music, Deezer, YouTube Music e muito mais.',
      color: '#C45C2F'
    },
    {
      icon: 'ri-star-fill',
      title: 'Gestão Artística',
      description: 'Acompanhamento completo da carreira, marketing digital, assessoria de imprensa e desenvolvimento de marca.',
      color: '#A34528'
    },
    {
      icon: 'ri-team-fill',
      title: 'Networking',
      description: 'Conexões com os principais players da indústria musical, produtores, compositores e outros artistas.',
      color: '#0C3F48'
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-[#1A1A1A] to-black">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#0EA8A0]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#C45C2F]/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 bg-[#0EA8A0]/10 border border-[#0EA8A0]/30 rounded-full text-[#0EA8A0] text-sm font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Sobre Nós
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Quem Somos
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            A Céu Music é uma gravadora independente fundada com a missão de descobrir, desenvolver e promover artistas talentosos. Acreditamos no poder transformador da música e trabalhamos incansavelmente para levar o som dos nossos artistas ao mundo.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="p-8 bg-gradient-to-br from-[#0EA8A0]/5 to-transparent border border-[#0EA8A0]/20 rounded-2xl backdrop-blur-sm hover:border-[#0EA8A0]/40 transition-all duration-300 group">
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#0EA8A0] to-[#0C3F48] rounded-xl mb-6 shadow-lg shadow-[#0EA8A0]/30 group-hover:shadow-[#0EA8A0]/50 transition-all duration-300">
              <i className="ri-lightbulb-flash-fill text-3xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Nossa Missão
            </h3>
            <p className="text-white/70 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              Proporcionar aos artistas uma plataforma completa para desenvolver suas carreiras, oferecendo suporte profissional em todas as etapas do processo criativo e comercial, desde a produção até a distribuição global.
            </p>
          </div>

          <div className="p-8 bg-gradient-to-br from-[#C45C2F]/5 to-transparent border border-[#C45C2F]/20 rounded-2xl backdrop-blur-sm hover:border-[#C45C2F]/40 transition-all duration-300 group">
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#C45C2F] to-[#A34528] rounded-xl mb-6 shadow-lg shadow-[#C45C2F]/30 group-hover:shadow-[#C45C2F]/50 transition-all duration-300">
              <i className="ri-eye-fill text-3xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Nossa Visão
            </h3>
            <p className="text-white/70 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              Ser reconhecida como uma das principais gravadoras independentes do país, conhecida pela qualidade artística, inovação e pelo compromisso genuíno com o sucesso dos nossos artistas.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div 
                className="w-14 h-14 flex items-center justify-center rounded-lg mb-4 shadow-lg transition-all duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: `${feature.color}20`,
                  boxShadow: `0 10px 30px ${feature.color}30`
                }}
              >
                <i className={`${feature.icon} text-2xl`} style={{ color: feature.color }}></i>
              </div>
              <h4 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {feature.title}
              </h4>
              <p className="text-sm text-white/60 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}