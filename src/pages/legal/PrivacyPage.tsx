import { Link } from 'react-router-dom';
import LegalLayout, { ContactEmail, ControllerDetails, ProviderList, type LegalSection } from './LegalLayout';

const sections: LegalSection[] = [
  {
    id: 'responsavel',
    title: 'Quem é o responsável',
    content: (
      <>
        <p>
          A Céu Music é a controladora dos dados pessoais tratados neste site, nos termos da Lei Geral de Proteção de
          Dados (Lei nº 13.709/2018, “LGPD”). Para falar sobre seus dados, use os canais abaixo:
        </p>
        <ControllerDetails />
      </>
    ),
  },
  {
    id: 'dados',
    title: 'Quais dados tratamos',
    content: (
      <>
        <p>
          <strong>Dados que você nos envia.</strong> Pelo formulário de contato, recebemos nome, e-mail, assunto e
          mensagem. O telefone é opcional. Por favor, não inclua na mensagem dados sensíveis, como informações de saúde
          ou convicção religiosa, nem dados de terceiros sem necessidade.
        </p>
        <p>
          <strong>Dados técnicos.</strong> Ao abrir o site, seu navegador se conecta aos nossos servidores e aos serviços
          descritos na seção 5. Nessas conexões, eles podem receber dados como endereço IP, tipo de navegador e página
          acessada.
        </p>
        <p>
          <strong>Área administrativa.</strong> Quem tem acesso ao painel de gestão do site faz login com e-mail e senha,
          e uma sessão fica salva no navegador. Essa área não é usada pelo público.
        </p>
        <p>
          O site não exige cadastro de visitantes, não vende produtos e não tem, em seu próprio código, ferramentas de
          análise de audiência ou de publicidade.
        </p>
      </>
    ),
  },
  {
    id: 'finalidades',
    title: 'Para que usamos e com qual base legal',
    content: (
      <ul>
        <li>
          <strong>Responder ao seu contato</strong> e dar andamento a pedidos de parceria, imprensa, eventos ou
          apresentação de artistas. Base legal: procedimentos preliminares a um contrato, a seu pedido, e legítimo
          interesse (art. 7º, V e IX, da LGPD).
        </li>
        <li>
          <strong>Manter o site funcionando e seguro</strong>, inclusive exibindo vídeos e conteúdos. Base legal: legítimo
          interesse (art. 7º, IX).
        </li>
        <li>
          <strong>Cumprir obrigações legais</strong> e exercer direitos em processos. Base legal: art. 7º, II e VI.
        </li>
      </ul>
    ),
  },
  {
    id: 'retencao',
    title: 'Por quanto tempo guardamos',
    content: (
      <p>
        Mantemos as mensagens de contato pelo tempo necessário para atender à sua solicitação e à relação que surgir dela,
        ou enquanto a lei exigir ou houver necessidade de defesa de direitos. Depois disso, os dados são eliminados ou
        anonimizados. Você pode pedir a eliminação antes disso pelos canais da seção 1, salvo nas hipóteses em que a lei
        permite a conservação.
      </p>
    ),
  },
  {
    id: 'compartilhamento',
    title: 'Com quem compartilhamos',
    content: (
      <>
        <p>
          Não vendemos seus dados. Eles podem ser tratados pelos fornecedores abaixo, necessários para o site funcionar,
          ou por autoridades, quando houver obrigação legal.
        </p>
        <ProviderList
          items={[
            { name: 'Comunicação', purpose: 'Envio e recebimento das mensagens do formulário de contato.' },
            { name: 'Infraestrutura', purpose: 'Hospedagem, banco de dados, armazenamento e entrega dos arquivos do site.' },
            { name: 'Conteúdo incorporado', purpose: 'Exibição de vídeos do YouTube e do mapa do Google Maps.' },
          ]}
        />
        <p>
          O YouTube e o Google Maps têm políticas próprias e atuam de forma independente sobre os dados que coletam. Veja
          a <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidade do Google</a>.
        </p>
      </>
    ),
  },
  {
    id: 'internacional',
    title: 'Transferência internacional',
    content: (
      <p>
        Alguns desses fornecedores podem tratar dados fora do Brasil. Nesses casos, a transferência ocorre nas hipóteses
        permitidas pelo art. 33 da LGPD.
      </p>
    ),
  },
  {
    id: 'direitos',
    title: 'Seus direitos',
    content: (
      <>
        <p>Nos termos do art. 18 da LGPD, você pode pedir:</p>
        <ul>
          <li>confirmação de que tratamos seus dados e acesso a eles;</li>
          <li>correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
          <li>portabilidade, conforme a regulamentação aplicável;</li>
          <li>informação sobre com quem compartilhamos seus dados;</li>
          <li>revisão ou oposição a um tratamento, quando cabível.</li>
        </ul>
        <p>
          Envie seu pedido para <ContactEmail />. Podemos pedir informações
          para confirmar sua identidade. Você também pode apresentar reclamação à{' '}
          <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer">
            Autoridade Nacional de Proteção de Dados (ANPD)
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'seguranca',
    title: 'Segurança',
    content: (
      <p>
        Adotamos medidas técnicas e administrativas para proteger os dados, como conexão criptografada e acesso restrito à
        área administrativa. Nenhum sistema é totalmente imune a incidentes. Se ocorrer um incidente com risco ou dano
        relevante, comunicaremos os titulares afetados e a ANPD, conforme a lei.
      </p>
    ),
  },
  {
    id: 'menores',
    title: 'Crianças e adolescentes',
    content: (
      <p>
        O formulário de contato não é destinado a crianças. Adolescentes devem usá-lo com a ciência de um responsável. Se
        você é responsável e acredita que recebemos dados de um menor de forma indevida, fale conosco para que possamos
        eliminá-los.
      </p>
    ),
  },
  {
    id: 'alteracoes',
    title: 'Alterações nesta política',
    content: (
      <p>
        Podemos atualizar esta política quando o site ou a legislação mudarem. A data no topo indica a versão em vigor.
        Veja também os <Link to="/termos">Termos de Uso</Link> e a <Link to="/cookies">Política de Cookies</Link>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Política de Privacidade"
      intro="Esta política explica quais dados pessoais a Céu Music trata neste site, por que trata, com quem compartilha e como você pode exercer seus direitos."
      sections={sections}
    />
  );
}
