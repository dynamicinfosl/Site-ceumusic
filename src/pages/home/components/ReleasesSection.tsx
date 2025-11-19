const releases = [
  {
    id: 1,
    title: 'Noite Estrelada',
    artist: 'Luna Silva',
    cover: 'https://readdy.ai/api/search-image?query=Modern%20music%20album%20cover%20design%2C%20abstract%20starry%20night%20theme%2C%20turquoise%20and%20dark%20blue%20gradient%2C%20minimalist%20elegant%20style%2C%20professional%20artwork&width=400&height=400&seq=release-1&orientation=squarish',
    type: 'Single',
    date: '2024',
  },
  {
    id: 2,
    title: 'Ruas da Cidade',
    artist: 'Rafael Costa',
    cover: 'https://readdy.ai/api/search-image?query=Urban%20hip%20hop%20album%20cover%20design%2C%20city%20streets%20theme%2C%20orange%20and%20teal%20colors%2C%20modern%20bold%20style%2C%20professional%20music%20artwork&width=400&height=400&seq=release-2&orientation=squarish',
    type: 'EP',
    date: '2024',
  },
  {
    id: 3,
    title: 'Raízes',
    artist: 'Marina Luz',
    cover: 'https://readdy.ai/api/search-image?query=Brazilian%20MPB%20album%20cover%20design%2C%20organic%20roots%20theme%2C%20warm%20bronze%20and%20teal%20colors%2C%20artistic%20elegant%20style%2C%20professional%20artwork&width=400&height=400&seq=release-3&orientation=squarish',
    type: 'Álbum',
    date: '2024',
  },
  {
    id: 4,
    title: 'Tempestade',
    artist: 'Pedro Alves',
    cover: 'https://readdy.ai/api/search-image?query=Rock%20album%20cover%20design%2C%20storm%20lightning%20theme%2C%20dark%20dramatic%20colors%20with%20electric%20blue%2C%20powerful%20edgy%20style%2C%20professional%20music%20artwork&width=400&height=400&seq=release-4&orientation=squarish',
    type: 'Single',
    date: '2024',
  },
  {
    id: 5,
    title: 'Pulsar',
    artist: 'Beatriz Santos',
    cover: 'https://readdy.ai/api/search-image?query=Electronic%20music%20album%20cover%20design%2C%20cosmic%20pulsar%20theme%2C%20neon%20turquoise%20and%20purple%20gradient%2C%20futuristic%20tech%20style%2C%20professional%20artwork&width=400&height=400&seq=release-5&orientation=squarish',
    type: 'EP',
    date: '2024',
  },
  {
    id: 6,
    title: 'Sertão',
    artist: 'Lucas Ferreira',
    cover: 'https://readdy.ai/api/search-image?query=Sertanejo%20album%20cover%20design%2C%20Brazilian%20countryside%20theme%2C%20warm%20sunset%20orange%20and%20bronze%20colors%2C%20rustic%20elegant%20style%2C%20professional%20music%20artwork&width=400&height=400&seq=release-6&orientation=squarish',
    type: 'Álbum',
    date: '2024',
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-product-shop>
          {releases.map((release) => (
            <div
              key={release.id}
              className="glass-card animate-liquid-glass rounded-2xl p-6 hover:border-[#C45C2F]/50 transition-all duration-500 group cursor-pointer"
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-4 border border-gray-800 group-hover:border-[#C45C2F] group-hover:shadow-[0_0_30px_rgba(196,92,47,0.4)] transition-all duration-500">
                    <img
                      src={release.cover}
                      alt={release.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-montserrat">{release.type}</span>
                  <span className="text-xs text-gray-400 font-montserrat">{release.date}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1 font-montserrat">{release.title}</h3>
                <p className="text-gray-400 mb-4 font-montserrat text-sm">{release.artist}</p>
                <button className="w-full bg-transparent border border-gray-600 text-white px-4 py-2 rounded-full font-semibold hover:border-[#C45C2F] hover:shadow-[0_0_15px_rgba(196,92,47,0.3)] transition-all duration-300 whitespace-nowrap cursor-pointer text-sm font-montserrat">
                  Ouvir Agora
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
