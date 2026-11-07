import { Link } from 'react-router-dom';
import LegalLayout, { ContactEmail, ProviderList, type LegalSection } from './LegalLayout';

const sections: LegalSection[] = [
  {
    id: 'o-que-sao',
    title: 'O que são cookies',
    content: (
      <p>
        Cookies e tecnologias parecidas, como o armazenamento local do navegador, são pequenos dados guardados no seu
        dispositivo. Eles permitem, por exemplo, lembrar uma preferência ou manter uma sessão aberta.
      </p>
    ),
  },
  {
    id: 'proprios',
    title: 'O que o próprio site guarda',
    content: (
      <>
        <p>O código da Céu Music não usa cookies de publicidade nem ferramentas de análise de audiência. Ele guarda apenas:</p>
        <ProviderList
          items={[
            { name: 'Idioma', purpose: 'Armazenamento local com a preferência de idioma do navegador. Fica até ser apagado por você.' },
            { name: 'Sessão de login', purpose: 'Armazenamento local usado apenas na área administrativa, não por visitantes.' },
          ]}
        />
      </>
    ),
  },
  {
    id: 'terceiros',
    title: 'Conteúdo de terceiros',
    content: (
      <>
        <p>
          Algumas páginas incorporam serviços externos. Esses serviços podem gravar cookies próprios e reconhecer seu
          navegador, inclusive para fins de análise ou publicidade, segundo as regras deles.
        </p>
        <ProviderList
          items={[
            { name: 'YouTube (Google)', purpose: 'Prévias sem som no topo da página inicial e na galeria, carregadas em computadores no modo de privacidade reforçada do YouTube, e vídeos completos quando você escolhe assistir.' },
            { name: 'Google Maps', purpose: 'Mapa na página de contato.' },
          ]}
        />
        <p>
          Saiba como o Google usa esses dados em{' '}
          <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">
            Como o Google usa cookies
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'controle',
    title: 'Como controlar',
    content: (
      <>
        <p>
          Você pode bloquear ou apagar cookies e dados do site nas configurações do seu navegador. Bloquear cookies de
          terceiros é uma forma de limitar o que os serviços externos gravam, mas alguns vídeos ou o mapa podem deixar de
          funcionar corretamente.
        </p>
        <p>
          Dúvidas? Escreva para <ContactEmail />. Mais detalhes sobre dados
          pessoais estão na <Link to="/privacidade">Política de Privacidade</Link>.
        </p>
      </>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Política de Cookies"
      intro="Esta página explica o que fica guardado no seu navegador quando você visita o site da Céu Music e como você pode controlar isso."
      sections={sections}
    />
  );
}
