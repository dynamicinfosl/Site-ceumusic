// TODO: Substituir os dados de exemplo pelos dados reais dos lançamentos
const releases = [
  {
    id: 1,
    title: 'Noite Estrelada', // EXEMPLO: Substituir pelo título real
    artist: 'Luna Silva', // EXEMPLO: Substituir pelo nome do artista
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop&q=80', // EXEMPLO: Substituir pela capa real
    type: 'Single', // EXEMPLO: Single, EP ou Álbum
    date: '2024', // EXEMPLO: Substituir pela data real
    streamingLink: 'https://spotify.com', // EXEMPLO: Link para ouvir
  },
  {
    id: 2,
    title: 'Ruas da Cidade', // EXEMPLO: Substituir pelo título real
    artist: 'Rafael Costa', // EXEMPLO: Substituir pelo nome do artista
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop&q=80', // EXEMPLO: Substituir pela capa real
    type: 'EP', // EXEMPLO: Single, EP ou Álbum
    date: '2024', // EXEMPLO: Substituir pela data real
    streamingLink: 'https://spotify.com', // EXEMPLO: Link para ouvir
  },
  {
    id: 3,
    title: 'Raízes', // EXEMPLO: Substituir pelo título real
    artist: 'Marina Luz', // EXEMPLO: Substituir pelo nome do artista
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop&q=80', // EXEMPLO: Substituir pela capa real
    type: 'Álbum', // EXEMPLO: Single, EP ou Álbum
    date: '2024', // EXEMPLO: Substituir pela data real
    streamingLink: 'https://spotify.com', // EXEMPLO: Link para ouvir
  },
  {
    id: 4,
    title: 'Tempestade', // EXEMPLO: Substituir pelo título real
    artist: 'Pedro Alves', // EXEMPLO: Substituir pelo nome do artista
    cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop&q=80', // EXEMPLO: Substituir pela capa real
    type: 'Single', // EXEMPLO: Single, EP ou Álbum
    date: '2024', // EXEMPLO: Substituir pela data real
    streamingLink: 'https://spotify.com', // EXEMPLO: Link para ouvir
  },
  {
    id: 5,
    title: 'Pulsar', // EXEMPLO: Substituir pelo título real
    artist: 'Beatriz Santos', // EXEMPLO: Substituir pelo nome do artista
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&q=80', // EXEMPLO: Substituir pela capa real
    type: 'EP', // EXEMPLO: Single, EP ou Álbum
    date: '2024', // EXEMPLO: Substituir pela data real
    streamingLink: 'https://spotify.com', // EXEMPLO: Link para ouvir
  },
  {
    id: 6,
    title: 'Sertão', // EXEMPLO: Substituir pelo título real
    artist: 'Lucas Ferreira', // EXEMPLO: Substituir pelo nome do artista
    cover: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop&q=80', // EXEMPLO: Substituir pela capa real
    type: 'Álbum', // EXEMPLO: Single, EP ou Álbum
    date: '2024', // EXEMPLO: Substituir pela data real
    streamingLink: 'https://spotify.com', // EXEMPLO: Link para ouvir
  },
];

export default function ReleasesSection() {
  return (
    <section className="px-6 py-20 lg:px-12 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-6xl lg:text-7xl mb-4 font-montserrat">
            Últimos <span className="text-[#0EA8A0]">Lançamentos</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6" data-product-shop>
          {releases.map((release) => (
            <div
              key={release.id}
              className="glass-card animate-liquid-glass rounded-2xl overflow-hidden hover:border-[#C45C2F]/50 transition-all duration-500 group cursor-pointer"
            >
              {/* Layout Horizontal: Foto à Esquerda, Informações à Direita */}
              <div className="flex flex-col sm:flex-row h-full">
                {/* Foto do Lançamento - Lado Esquerdo */}
                <div className="w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                  <div className="w-full h-full border-r border-gray-800/50 group-hover:border-[#C45C2F]/30 transition-all duration-500 overflow-hidden">
                    <img
                      src={release.cover}
                      alt={release.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Informações - Lado Direito */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    {/* Tipo e Data */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-[#C45C2F] font-montserrat font-semibold uppercase tracking-wider bg-[#C45C2F]/10 px-3 py-1 rounded-full">
                        {release.type}
                      </span>
                      <span className="text-xs text-gray-400 font-montserrat">{release.date}</span>
                    </div>

                    {/* Título e Artista */}
                    <h3 className="text-xl font-bold mb-2 font-montserrat text-white group-hover:text-[#C45C2F] transition-colors duration-300">
                      {release.title}
                    </h3>
                    <p className="text-gray-400 font-montserrat text-sm mb-4">
                      {release.artist}
                    </p>
                  </div>

                  {/* Botão Ouvir */}
                  <div className="mt-auto">
                    <a
                      href={release.streamingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-transparent border border-gray-600 text-white px-6 py-2.5 rounded-full font-semibold hover:border-[#C45C2F] hover:shadow-[0_0_15px_rgba(196,92,47,0.3)] hover:text-[#C45C2F] transition-all duration-300 whitespace-nowrap text-sm font-montserrat"
                    >
                      <i className="ri-play-circle-line text-lg"></i>
                      Ouvir Agora
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
