import { useSettings } from '../../utils/content';

// Chamada para o Festival de Verão na página inicial da Céu, com a identidade do festival.
export default function FestivalBanner() {
  const festival = useSettings()?.festival;
  if (!festival?.banner?.enabled || !festival.site_url) return null;

  const isOpen = !!festival.registration_open;

  return (
    <section aria-label="Festival de Verão" className="px-4 sm:px-6 lg:px-12 py-10">
      <a
        href={festival.site_url}
        className="group relative block max-w-6xl mx-auto overflow-hidden rounded-3xl bg-[#1D1A3F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD700]"
      >
        {/* Sol com raios saindo do canto, como no cartaz do festival */}
        <div
          aria-hidden="true"
          className="absolute -top-40 -right-40 w-[26rem] h-[26rem] rounded-full transition-transform duration-700 group-hover:scale-105"
          style={{ background: 'linear-gradient(100deg, #FFD700 0%, #FBB403 35%, #F5990A 62%, #EF700C 100%)' }}
        >
          <div className="absolute inset-0 rounded-full" style={{ background: 'repeating-conic-gradient(from 0deg, rgba(255,255,255,0.25) 0deg 5deg, transparent 5deg 15deg)' }} />
        </div>

        <div className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] items-center p-8 sm:p-10 lg:p-12">
          <div className="max-w-xl">
            <img src="/festival/logo.png" alt={festival.banner.title || 'Festival de Verão'} width={1200} height={800} loading="lazy" className="w-56 sm:w-72 h-auto -ml-1" />
            <p className="mt-4 text-white/80 text-base sm:text-lg leading-relaxed">{festival.banner.text}</p>
          </div>
          <span className="relative inline-flex items-center gap-2 self-end md:self-center justify-self-start rounded-full bg-white px-6 py-3.5 font-bold text-[#1D1A3F] transition-transform duration-300 group-hover:translate-x-1">
            {isOpen ? 'Inscreva-se' : 'Conheça o festival'}
            <i className="ri-arrow-right-line" aria-hidden="true" />
          </span>
        </div>
      </a>
    </section>
  );
}
