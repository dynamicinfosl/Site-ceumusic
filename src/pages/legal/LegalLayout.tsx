import { useEffect, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { legalDocuments, legalInfo } from './legalInfo';
import { useContactInfo, useSettings } from '../../utils/content';

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface LegalLayoutProps {
  title: string;
  intro: string;
  sections: LegalSection[];
}

const focusRing =
  'rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA8A0]';

// Estilos do texto corrido vêm daqui para que as páginas contenham só o conteúdo.
const proseClasses = [
  'space-y-4 text-base leading-relaxed text-white/75',
  '[&_a]:text-[#0EA8A0] [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-white',
  '[&_strong]:font-semibold [&_strong]:text-white',
  '[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:pl-1',
].join(' ');

export default function LegalLayout({ title, intro, sections }: LegalLayoutProps) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | ${legalInfo.brandName}`;
    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-36 lg:px-8 lg:pt-44">
        <nav aria-label="Documentos legais" className="mb-12 flex flex-wrap gap-x-6 gap-y-2 border-b border-white/10">
          {legalDocuments.map((doc) => (
            <NavLink
              key={doc.path}
              to={doc.path}
              className={({ isActive }) =>
                `-mb-px flex min-h-11 items-center border-b-2 text-sm transition-colors duration-200 ${focusRing} ${
                  isActive
                    ? 'border-[#0EA8A0] font-medium text-white'
                    : 'border-transparent text-white/60 hover:text-white'
                }`
              }
            >
              {doc.label}
            </NavLink>
          ))}
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-white [text-wrap:balance] md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-sm text-white/50">Última atualização: {legalInfo.lastUpdated}</p>
          <p className="mt-6 text-lg leading-relaxed text-white/75">{intro}</p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-labelledby="legal-toc-title" className="lg:sticky lg:top-8 lg:self-start">
            <h2 id="legal-toc-title" className="mb-3 text-sm font-medium text-white">
              Nesta página
            </h2>
            <ol className="space-y-2 text-sm">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={`text-white/60 transition-colors duration-200 hover:text-[#0EA8A0] ${focusRing}`}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="min-w-0 max-w-[68ch] space-y-12">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-8">
                <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                  {index + 1}. {section.title}
                </h2>
                <div className={proseClasses}>{section.content}</div>
              </section>
            ))}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function ProviderList({ items }: { items: { name: string; purpose: string }[] }) {
  return (
    <dl className="divide-y divide-solid divide-white/10 border-y border-white/10">
      {items.map((item) => (
        <div key={item.name} className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
          <dt className="font-medium text-white">{item.name}</dt>
          <dd className="text-white/75">{item.purpose}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ContactEmail() {
  const { email } = useContactInfo();
  return <a href={`mailto:${email}`}>{email}</a>;
}

export function ControllerDetails() {
  const { address, email, phone } = useContactInfo();
  const legal = useSettings()?.legal;
  const cnpj = legal?.cnpj;
  const dpoName = legal?.dpo_name;
  return (
    <ul>
      <li>
        <strong>Responsável:</strong> {legal?.legal_name || legalInfo.brandName}
        {cnpj && `, CNPJ ${cnpj}`}
      </li>
      <li>
        <strong>Localização:</strong> {address}
      </li>
      {dpoName && (
        <li>
          <strong>Encarregado de dados:</strong> {dpoName}
        </li>
      )}
      <li>
        <strong>E-mail:</strong> <a href={`mailto:${email}`}>{email}</a>
      </li>
      <li>
        <strong>Telefone:</strong> {phone}
      </li>
    </ul>
  );
}
