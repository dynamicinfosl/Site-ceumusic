import { Link } from 'react-router-dom';
import LegalLayout, { ControllerDetails, type LegalSection } from './LegalLayout';

const sections: LegalSection[] = [
  {
    id: 'aceitacao',
    title: 'Aceitação',
    content: (
      <p>
        Ao navegar neste site, você concorda com estes Termos. Se não concordar, por favor, não utilize o site. O
        tratamento de dados pessoais é explicado na <Link to="/privacidade">Política de Privacidade</Link>.
      </p>
    ),
  },
  {
    id: 'site',
    title: 'O que é este site',
    content: (
      <p>
        O site apresenta a Céu Music, seus artistas, lançamentos, vídeos e notícias, e oferece um canal de contato. O
        acesso é gratuito e não exige cadastro. A área administrativa é restrita a pessoas autorizadas.
      </p>
    ),
  },
  {
    id: 'uso',
    title: 'Uso permitido',
    content: (
      <>
        <p>Ao usar o site, você se compromete a não:</p>
        <ul>
          <li>violar a lei ou direitos de terceiros;</li>
          <li>tentar acessar áreas restritas ou interferir no funcionamento e na segurança do site;</li>
          <li>enviar pelo formulário conteúdo ofensivo, falso, ilícito ou mensagens em massa;</li>
          <li>extrair conteúdo de forma automatizada para reutilização sem autorização.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'propriedade',
    title: 'Propriedade intelectual',
    content: (
      <p>
        Músicas, vídeos, fotos, textos, marcas e logotipos exibidos no site pertencem à Céu Music, aos artistas ou a seus
        respectivos licenciantes e são protegidos pela legislação de direitos autorais e de propriedade industrial. Você
        pode ver e compartilhar links para o conteúdo, mas não pode copiar, baixar, alterar, distribuir ou explorar
        comercialmente esse material sem autorização prévia dos titulares.
      </p>
    ),
  },
  {
    id: 'envios',
    title: 'Mensagens e propostas',
    content: (
      <p>
        O envio de uma mensagem, inclusive de interesse artístico ou de contratação para eventos, não cria contrato nem
        obrigação de resposta ou de aprovação. Qualquer parceria ou contratação depende de acordo próprio entre as partes.
        Você continua titular dos direitos sobre o material de sua autoria que nos apresentar.
      </p>
    ),
  },
  {
    id: 'terceiros',
    title: 'Conteúdos e links de terceiros',
    content: (
      <p>
        O site exibe conteúdo do YouTube e do Google Maps e aponta para outras plataformas, como redes sociais e serviços
        de streaming. Esses serviços têm termos e políticas próprios, e a Céu Music não controla seu conteúdo nem sua
        disponibilidade.
      </p>
    ),
  },
  {
    id: 'disponibilidade',
    title: 'Disponibilidade e conteúdo',
    content: (
      <p>
        Trabalhamos para manter o site funcionando e as informações corretas, mas ele pode passar por interrupções, e
        conteúdos, como datas de lançamentos e informações de artistas, podem mudar ou ser removidos sem aviso prévio.
      </p>
    ),
  },
  {
    id: 'responsabilidade',
    title: 'Responsabilidade',
    content: (
      <p>
        Na medida permitida pela lei, a Céu Music não responde por danos decorrentes de falhas de conexão, de indisponibilidade
        de serviços de terceiros ou do uso do site em desacordo com estes Termos. Nada nestes Termos limita direitos que a
        legislação brasileira garante e que não possam ser afastados, inclusive os do consumidor.
      </p>
    ),
  },
  {
    id: 'alteracoes',
    title: 'Alterações',
    content: (
      <p>
        Podemos atualizar estes Termos a qualquer momento. A versão em vigor é a publicada nesta página, com a data
        indicada no topo.
      </p>
    ),
  },
  {
    id: 'lei',
    title: 'Lei aplicável e foro',
    content: (
      <p>
        Estes Termos seguem as leis da República Federativa do Brasil. Fica eleito o foro da comarca do Rio de Janeiro/RJ,
        ressalvado o direito do consumidor de ajuizar ação no foro do próprio domicílio.
      </p>
    ),
  },
  {
    id: 'contato',
    title: 'Contato',
    content: <ControllerDetails />,
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Termos de Uso"
      intro="Estas são as regras para usar o site da Céu Music, incluindo o que você pode fazer com o conteúdo publicado aqui."
      sections={sections}
    />
  );
}
