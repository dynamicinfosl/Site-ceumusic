import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import NotFound from '../NotFound';
import { applyArtistRow, fetchArtistRows, isSameArtist, type ArtistRow } from '../../utils/catalog';

export default function ArtistDetailPage() {
  const { id } = useParams();
  const [artistRows, setArtistRows] = useState<ArtistRow[] | null>(null);

  useEffect(() => {
    fetchArtistRows().then(setArtistRows);
  }, []);

  // Mock data - em produção viria de uma API
  const artists = [
    {
      id: 1,
      name: 'Alexsander Lucio',
      followName: 'Alex Lucio',
      genre: 'Gospel/CCM',
      image: '/artistas/alex-lucio/IMG_3735.jpg',
      bio: 'Alex Lúcio nasceu e foi criado em um lar cristão, tendo suas raízes firmadas desde cedo na igreja. Vindo de uma infância simples e humilde, ele é o terceiro de cinco irmãos. Desde pequeno, Alex se destacou nos estudos, sempre dedicado e esforçado, alcançando notas máximas em todas as matérias. Aos 11 anos, seu talento acadêmico lhe rendeu o terceiro lugar em uma oficina de matemática, um momento que marcou sua trajetória escolar.\n\nCom a mãe precisando trabalhar fora para sustentar a família, Alex aprendeu desde cedo o valor do esforço e da fé. Na adolescência, ele descobriu sua vocação para a música, começando então a compor e cantar com o coração voltado sempre para Deus. Seu amor pela música se transformou em uma missão maior: hoje, ele realiza um importante trabalho de evangelização no Calçadão de Campo Grande, levando esperança e a Palavra de Deus a muitas vidas, onde já ganhou centenas de almas pra Jesus.\n\nAlex é membro ativo da Igreja Assembleia de Deus em Campo Grande, onde encontra inspiração espiritual e apoio para continuar sua caminhada. Sua trajetória é marcada por dedicação, talento e fé, e seu objetivo é sempre ser um instrumento nas mãos de Deus para tocar corações e transformar vidas através da música.',
      instagram: 'https://www.instagram.com/alexlucio.ofc/',
      spotify: 'https://open.spotify.com/artist/2xX3xodC7zA5u2xygCWzuP',
      youtube: 'https://www.youtube.com/watch?v=Bqc6B5LzTN0&list=RDBqc6B5LzTN0&start_radio=1',
      followers: {
        instagram: null,
        spotify: '2.6M',
        youtube: null,
      },
      songs: [
        { id: 1, title: 'O Fogo Arderá - Ao Vivo', album: 'Album', duration: null, plays: '58.6M' },
        { id: 2, title: 'Buscar-Me-Eis e Me Achareis - Ao Vivo', album: 'Album', duration: null, plays: '14.5M' },
        { id: 3, title: 'O Fogo Arderá', album: 'Album', duration: null, plays: '9.1M' },
        { id: 4, title: 'Salva-Vidas', album: 'Album', duration: null, plays: '4.3M' },
        { id: 5, title: 'Sempre Estive Aqui', album: 'Single', duration: null, plays: '1.0M' },
      ],
      videos: [
        {
          id: 1,
          title: 'O Fogo Arderá - Ao Vivo',
          thumbnail: 'https://img.youtube.com/vi/Bqc6B5LzTN0/hqdefault.jpg',
          views: 'YouTube',
          url: 'https://www.youtube.com/watch?v=Bqc6B5LzTN0&list=RDBqc6B5LzTN0&start_radio=1',
        },
        {
          id: 2,
          title: 'Salva-Vidas - Ao Vivo',
          thumbnail: 'https://img.youtube.com/vi/bdLeReQbtgY/hqdefault.jpg',
          views: 'YouTube',
          url: 'https://www.youtube.com/watch?v=bdLeReQbtgY&list=PLDrdTf3Y6voff928gg2qErmcgMV_surVw',
        },
      ],
      shows: [],
    },
    {
      id: 10,
      name: 'Na Graça',
      genre: 'Gospel/CCM',
      image: '/artistas/na graca/na graca.png',
      bio: 'Na Graça é um ministério de louvor que nasceu com o propósito de conduzir a igreja a uma experiência profunda com Deus através da adoração. Com canções congregacionais e mensagens centradas na fé, o grupo tem se destacado por suas ministrações ao vivo, marcadas por simplicidade, unidade e forte presença de Deus.\n\nEntre suas faixas mais conhecidas estão “A Fé (Ao Vivo)”, “Ele Te Chamou (Ao Vivo)” e “Louva Na Graça (Ao Vivo)”, que têm alcançado milhares de ouvintes nas plataformas digitais. O grupo segue avançando com novos projetos e gravações ao vivo, sempre com o foco em espalhar a graça e o amor de Cristo por meio da música.',
      instagram: 'https://www.instagram.com/nagracaoficial/',
      spotify: 'https://open.spotify.com/intl-pt/artist/7pmvHrURMH0OqDcXXQiuYX',
      youtube: 'https://www.youtube.com/watch?v=g89eBxkG-Aw&list=RDg89eBxkG-Aw&start_radio=1',
      followers: {
        instagram: null,
        spotify: '55,5K',
        youtube: null,
      },
      songs: [
        { id: 1, title: 'A Fé - Ao Vivo', album: 'A Fé (Ao Vivo)', duration: null, plays: '679.8K' },
        { id: 2, title: 'Ele Te Chamou - Ao Vivo', album: 'Ele Te Chamou (Ao Vivo)', duration: null, plays: '67.1K' },
        { id: 3, title: 'Louva Na Graça - Ao Vivo', album: 'Louva Na Graça (Ao Vivo)', duration: null, plays: '16.7K' },
      ],
      videos: [
        {
          id: 1,
          title: 'A FÉ - AO VIVO',
          thumbnail: 'https://img.youtube.com/vi/g89eBxkG-Aw/hqdefault.jpg',
          views: 'YouTube',
          url: 'https://www.youtube.com/watch?v=g89eBxkG-Aw&list=RDg89eBxkG-Aw&start_radio=1',
        },
        {
          id: 2,
          title: 'LOUVA NA GRAÇA',
          thumbnail: 'https://img.youtube.com/vi/5bvgSlZamBo/hqdefault.jpg',
          views: 'YouTube',
          url: 'https://www.youtube.com/watch?v=5bvgSlZamBo&list=RD5bvgSlZamBo&start_radio=1',
        },
      ],
      shows: [],
    },
    {
      id: 11,
      name: 'No Santuário',
      genre: 'Gospel/CCM',
      image: '/artistas/no%20santuario/IMG_0090.jpg',
      bio: 'Com 13 anos de carreira ministerial, álbuns, EPs e ministrações por todo o Brasil, EUA e Europa, o ministério No Santuário (Pr. Israel Leonardo e Raphaela Carvalho) dedica-se a proclamar o evangelho através da adoração e da pregação da Palavra de Deus. Recentemente lançaram seu primeiro DVD com canções inéditas e uma nova versão de “Final Feliz”, além de projetos como “Ele Fará”, “Teus Átrios” e “Haja o que Houver (Ao Vivo)”.\n\nCom letras bíblicas e forte ênfase na presença de Deus, No Santuário se tornou referência na adoração congregacional, convidando a igreja a viver uma jornada de fé, esperança e restauração em cada canção.',
      instagram: 'https://www.instagram.com/nosantuario/',
      spotify: 'https://open.spotify.com/intl-pt/artist/3qkhpijMzbtVFexHZTNoai',
      youtube: 'https://www.youtube.com/watch?v=XWBgmBsxkk4&list=RDXWBgmBsxkk4&start_radio=1',
      followers: {
        instagram: null,
        spotify: '31,3K',
        youtube: null,
      },
      songs: [
        { id: 1, title: 'Ele Fará', album: 'Ele Fará', duration: null, plays: '99.7K' },
        { id: 2, title: 'Teus Átrios', album: 'Teus Átrios', duration: null, plays: '44.1K' },
        { id: 3, title: 'Haja o que Houver - Ao Vivo', album: 'Haja o que Houver (Ao Vivo)', duration: null, plays: '33.8K' },
        { id: 4, title: 'Tu És o Cristo (I Call You Jesus)', album: 'Single', duration: null, plays: '39.0K' },
      ],
      videos: [
        {
          id: 1,
          title: 'FINAL FELIZ - AO VIVO',
          thumbnail: 'https://img.youtube.com/vi/XWBgmBsxkk4/hqdefault.jpg',
          views: 'YouTube',
          url: 'https://www.youtube.com/watch?v=XWBgmBsxkk4&list=RDXWBgmBsxkk4&start_radio=1',
        },
        {
          id: 2,
          title: 'HAJA O QUE HOUVER AO VIVO',
          thumbnail: 'https://img.youtube.com/vi/qv7MCnmsoN0/hqdefault.jpg',
          views: 'YouTube',
          url: 'https://www.youtube.com/watch?v=qv7MCnmsoN0',
        },
      ],
      shows: [],
    },
    {
      id: 12,
      name: 'Debora Lopes',
      genre: 'Gospel/CCM',
      image: '/artistas/debora-lopes/debora-lopes.png',
      bio: 'Debora Lopes é uma cantora gospel brasileira que tem sido usada para ministrar sobre fé, cura e milagres através de suas canções. Com o lançamento de "Milagres de Deus (Ao Vivo)" e sua versão em playback, seu ministério vem alcançando um público cada vez maior, fortalecendo a fé de quem ouve e declarando o agir sobrenatural de Deus.\n\nCom uma voz marcante e letras centradas na Palavra, Debora tem se consolidado como um dos novos nomes da adoração contemporânea, convidando a igreja a confiar nos milagres de Deus em cada estação da vida.',
      instagram: 'https://www.instagram.com/deboralopesoficiall/',
      spotify: 'https://open.spotify.com/intl-pt/artist/3GPJu7XtFtUYUKI5qcooml',
      youtube: 'https://www.youtube.com/watch?v=V1hYFBtdxm8&list=RDV1hYFBtdxm8&start_radio=1',
      followers: {
        instagram: null,
        spotify: '2,8K',
        youtube: null,
      },
      songs: [
        { id: 1, title: 'Milagres de Deus - Ao Vivo', album: 'Milagres de Deus (Ao Vivo)', duration: null, plays: '45.1K' },
        { id: 2, title: 'Milagres de Deus - Playback', album: 'Milagres de Deus (Playback)', duration: null, plays: '1.1K' },
      ],
      videos: [
        {
          id: 1,
          title: 'MILAGRES DE DEUS AO VIVO',
          thumbnail: 'https://img.youtube.com/vi/V1hYFBtdxm8/hqdefault.jpg',
          views: 'YouTube',
          url: 'https://www.youtube.com/watch?v=V1hYFBtdxm8&list=RDV1hYFBtdxm8&start_radio=1',
        },
      ],
      shows: [],
    },
    {
      id: 18,
      name: 'Kaka Tavares',
      genre: 'Gospel/CCM',
      image: '/artistas/kaka-tavares/IMG_3648.jpg',
      bio: 'Kaka Tavares é uma cantora gospel brasileira que tem se dedicado a levar mensagens de fé e esperança através de suas ministrações e canções. Com um coração voltado para a adoração, seu ministério busca conduzir pessoas a um encontro genuíno com Deus.\n\nAtravés de suas redes sociais e agendas em igrejas e eventos, Kaka tem alcançado novos públicos, sempre com o desejo de apontar para Cristo e gerar um ambiente de adoração profunda e transformadora.',
      instagram: null,
      spotify: 'https://open.spotify.com/intl-pt/artist/5v86apLzejN5yQl8H2CcLh',
      youtube: null,
      followers: {
        instagram: null,
        spotify: null,
        youtube: null,
      },
      songs: [],
      videos: [],
      shows: [],
    },
    {
      id: 13,
      name: 'Caio Torres',
      genre: 'Gospel/CCM',
      image: '/artistas/caio-torres/IMG_0273.jpg',
      bio: 'Caio Torres é um cantor gospel brasileiro que tem se dedicado a conduzir pessoas a um lugar de rendição e intimidade com Deus por meio da adoração. Com letras sinceras e melódicas, suas ministrações carregam uma mensagem de arrependimento, esperança e confiança na graça de Cristo.\n\nSeu ministério tem crescido em igrejas e eventos pelo Brasil, sempre com o propósito de apontar para Jesus e criar ambientes onde o Espírito Santo tenha liberdade para agir.',
      instagram: 'https://www.instagram.com/caiotorees/',
      spotify: 'https://open.spotify.com/intl-pt/artist/3TOPRsT6nYECZi9K9yZZXw',
      youtube: null,
      followers: {
        instagram: null,
        spotify: null,
        youtube: null,
      },
      songs: [],
      videos: [],
      shows: [],
    },
    {
      id: 14,
      name: 'Nicole Lavinia',
      genre: 'Gospel/CCM',
      image: '/artistas/nicole-lavinia/IMG_3996.jpg',
      bio: 'Nicole Lavinia é uma jovem cantora gospel brasileira que tem se destacado com canções que falam sobre rendição, santidade e intimidade com Deus. Com uma voz doce e marcante, suas ministrações carregam mensagens de esperança e encorajamento para uma geração que deseja viver os propósitos de Cristo.\n\nAtravés de suas redes sociais e agendas em igrejas e eventos, Nicole tem alcançado novos públicos, sempre com o desejo de conduzir pessoas a um encontro real com Jesus e a uma vida de adoração genuína.',
      instagram: 'https://www.instagram.com/nicolelaviniaoficial_/',
      spotify: 'https://open.spotify.com/intl-pt/track/0AayU24085eVhLhbk27sTE',
      youtube: 'https://www.youtube.com/watch?v=vpi33yUn1Zc&list=RDvpi33yUn1Zc&start_radio=1',
      followers: {
        instagram: null,
        spotify: null,
        youtube: null,
      },
      songs: [],
      videos: [
        {
          id: 1,
          title: 'SERVO DO CENTURIÃO - AO VIVO',
          thumbnail: 'https://img.youtube.com/vi/vpi33yUn1Zc/hqdefault.jpg',
          views: 'YouTube',
          url: 'https://www.youtube.com/watch?v=vpi33yUn1Zc&list=RDvpi33yUn1Zc&start_radio=1',
        },
      ],
      shows: [],
    },
    {
      id: 15,
      name: 'Maria Pita',
      genre: 'Gospel/CCM',
      image: '/artistas/maria-pita/IMG_4240.jpg',
      bio: 'Maria Pita é uma cantora gospel brasileira que carrega em suas canções mensagens de esperança, cura e rendição aos pés de Jesus. Com uma voz doce e firme, suas ministrações convidam a igreja a confiar na fidelidade de Deus em meio às lutas e processos.\n\nSeu ministério tem alcançado diferentes gerações, sempre com o desejo de apontar para Cristo e gerar um ambiente de adoração profunda e sincera.',
      instagram: 'https://www.instagram.com/mariapitacantora_/',
      spotify: 'https://open.spotify.com/intl-pt/artist/7fw7DfkvI0fMyEKfOw0k6n',
      youtube: 'https://www.youtube.com/watch?v=mb7rskqf1A4&list=RDEMzFMowVXry3q4Od_yFQGfxw&index=3',
      followers: {
        instagram: null,
        spotify: null,
        youtube: null,
      },
      songs: [],
      videos: [
        {
          id: 1,
          title: 'SE LEVANTE',
          thumbnail: 'https://img.youtube.com/vi/mb7rskqf1A4/hqdefault.jpg',
          views: 'YouTube',
          url: 'https://www.youtube.com/watch?v=mb7rskqf1A4&list=RDEMzFMowVXry3q4Od_yFQGfxw&index=3',
        },
        {
          id: 2,
          title: 'Maria Pita e Samuel Messias - SOU TEU PAI',
          thumbnail: 'https://img.youtube.com/vi/aioMdIBKvt8/hqdefault.jpg',
          views: 'YouTube',
          url: 'https://www.youtube.com/watch?v=aioMdIBKvt8&list=RDEMzFMowVXry3q4Od_yFQGfxw&index=2',
        },
      ],
      shows: [],
    },
    {
      id: 16,
      name: 'William Soares',
      genre: 'Gospel/CCM',
      image: '/artistas/william-soares/IMG_4092.jpg',
      bio: 'William Soares é um cantor gospel brasileiro que tem se dedicado a levar mensagens de fé e esperança através de suas ministrações e canções. Com um coração voltado para a adoração, seu ministério busca conduzir pessoas a um encontro genuíno com Deus.\n\nAtravés de suas redes sociais e agendas em igrejas e eventos, William tem alcançado novos públicos, sempre com o desejo de apontar para Cristo e gerar um ambiente de adoração profunda e transformadora.',
      instagram: 'https://www.instagram.com/williaamsoarees/',
      spotify: null,
      youtube: 'https://www.youtube.com/watch?v=MyhL5CT8-Eo&list=RDMyhL5CT8-Eo&start_radio=1',
      followers: {
        instagram: null,
        spotify: null,
        youtube: null,
      },
      songs: [],
      videos: [
        {
          id: 1,
          title: 'Ao Cheiro das Águas (Ao Vivo)',
          thumbnail: 'https://img.youtube.com/vi/MyhL5CT8-Eo/hqdefault.jpg',
          views: 'YouTube',
          url: 'https://www.youtube.com/watch?v=MyhL5CT8-Eo&list=RDMyhL5CT8-Eo&start_radio=1',
        },
      ],
      shows: [],
    },
    {
      id: 17,
      name: 'Martinha',
      genre: 'Gospel/CCM',
      image: '/artistas/martinha/Gemini_Generated_Image_o5dhzho5dhzho5dh (1).png',
      bio: 'Martinha é uma cantora gospel brasileira que tem se dedicado a levar mensagens de fé e esperança através de suas ministrações e canções. Com um coração voltado para a adoração, seu ministério busca conduzir pessoas a um encontro genuíno com Deus.\n\nAtravés de suas redes sociais e agendas em igrejas e eventos, Martinha tem alcançado novos públicos, sempre com o desejo de apontar para Cristo e gerar um ambiente de adoração profunda e transformadora.',
      instagram: 'https://www.instagram.com/martinhacantoraoficial/',
      spotify: 'https://open.spotify.com/intl-pt/artist/6etONEQiR3dUCs4IV0kIlE',
      youtube: 'https://www.youtube.com/watch?v=eMv-TwacSck&list=RDeMv-TwacSck&start_radio=1',
      followers: {
        instagram: null,
        spotify: '3.2K',
        youtube: null,
      },
      songs: [
        { id: 1, title: 'Quem Vai Fazer', album: 'Quem Vai Fazer', duration: null, plays: '228.8K' },
        { id: 2, title: 'Simplesmente Invencível', album: 'Album', duration: null, plays: '31.8K' },
        { id: 3, title: 'Eu Faço - Ao Vivo', album: 'Eu Faço (Ao Vivo)', duration: null, plays: '15.8K' },
        { id: 4, title: 'O Escolhido', album: 'Album', duration: null, plays: '8.6K' },
        { id: 5, title: 'Para o Mar Se Abrir', album: 'Album', duration: null, plays: '4.1K' },
      ],
      videos: [
        {
          id: 1,
          title: 'EU FAÇO AO VIVO',
          thumbnail: 'https://img.youtube.com/vi/eMv-TwacSck/hqdefault.jpg',
          views: 'YouTube',
          url: 'https://www.youtube.com/watch?v=eMv-TwacSck&list=RDeMv-TwacSck&start_radio=1',
        },
      ],
      shows: [],
    },
    {
      id: 19,
      name: 'Rachel Malafaia',
      genre: 'Gospel/CCM',
      image: '/artistas/rachel-malafaia/IMG_5693.jpg',
      bio: 'Rachel Malafaia é uma cantora gospel brasileira que tem se dedicado a levar mensagens de fé e esperança através de suas ministrações e canções. Com um coração voltado para a adoração, seu ministério busca conduzir pessoas a um encontro genuíno com Deus.\n\nAtravés de suas redes sociais e agendas em igrejas e eventos, Rachel tem alcançado novos públicos, sempre com o desejo de apontar para Cristo e gerar um ambiente de adoração profunda e transformadora.',
      instagram: 'https://www.instagram.com/rachelmalafaia/',
      spotify: 'https://open.spotify.com/intl-pt/artist/1xyrtLIDTu5kRTCvnHgIcJ',
      youtube: null,
      followers: {
        instagram: null,
        spotify: null,
        youtube: null,
      },
      songs: [],
      videos: [],
      shows: [],
    },
    {
      id: 20,
      name: 'George Lean',
      genre: 'Gospel/CCM',
      image: '/artistas/george-lean/IMG_1982.jpg',
      bio: 'George Lean é um cantor gospel brasileiro que tem se dedicado a levar mensagens de fé e esperança através de suas ministrações e canções. Com um coração voltado para a adoração, seu ministério busca conduzir pessoas a um encontro genuíno com Deus.\n\nAtravés de suas redes sociais e agendas em igrejas e eventos, George tem alcançado novos públicos, sempre com o desejo de apontar para Cristo e gerar um ambiente de adoração profunda e transformadora.',
      instagram: 'https://www.instagram.com/georgelean/',
      spotify: null,
      youtube: null,
      followers: {
        instagram: null,
        spotify: null,
        youtube: null,
      },
      songs: [],
      videos: [],
      shows: [],
    },
    {
      id: 21,
      name: 'Gabriel Magalhães',
      genre: 'Gospel/CCM',
      image: '/artistas/gabriel-magalhaes/IMG_4165.jpg',
      bio: 'Gabriel Magalhães é um cantor gospel brasileiro que tem se dedicado a levar mensagens de fé e esperança através de suas ministrações e canções. Com um coração voltado para a adoração, seu ministério busca conduzir pessoas a um encontro genuíno com Deus.\n\nAtravés de suas redes sociais e agendas em igrejas e eventos, Gabriel tem alcançado novos públicos, sempre com o desejo de apontar para Cristo e gerar um ambiente de adoração profunda e transformadora.',
      instagram: 'https://www.instagram.com/gabrielmagalhaes.oficial1/',
      spotify: null,
      youtube: null,
      followers: {
        instagram: null,
        spotify: null,
        youtube: null,
      },
      songs: [],
      videos: [],
      shows: [],
    },
  ];

  // A home usa o id do banco (UUID) e a página de artistas, o id numérico do catálogo
  const rowById = artistRows?.find((row) => row.id === id);
  const catalogArtist =
    artists.find((a) => String(a.id) === id) ?? (rowById ? artists.find((a) => isSameArtist(a, rowById)) : undefined);
  const row = rowById ?? (catalogArtist ? artistRows?.find((candidate) => isSameArtist(catalogArtist, candidate)) : undefined);

  if (!catalogArtist && !row) {
    if (artistRows === null) {
      return (
        <div className="bg-black min-h-screen">
          <Navbar />
          <p className="pt-52 text-center text-white/60" aria-live="polite">
            Carregando artista…
          </p>
        </div>
      );
    }
    return <NotFound />;
  }

  // Artista cadastrado só no painel: mostra o que existe no banco
  const panelOnlyArtist = (panelRow: ArtistRow): (typeof artists)[number] => ({
    id: 0,
    name: panelRow.name,
    genre: panelRow.genre ?? '',
    image: panelRow.image_url ?? '',
    bio: panelRow.bio ?? '',
    instagram: panelRow.instagram,
    spotify: panelRow.spotify,
    youtube: panelRow.youtube,
    followers: { instagram: null, spotify: null, youtube: null },
    songs: [],
    videos: [],
    shows: [],
  } as (typeof artists)[number]);

  const artist = catalogArtist
    ? row
      ? applyArtistRow(catalogArtist as Parameters<typeof applyArtistRow>[0], row) as (typeof artists)[number]
      : catalogArtist
    : panelOnlyArtist(row as ArtistRow);

  const followerCounts = [
    { key: 'instagram', count: artist.followers.instagram, icon: 'ri-instagram-fill text-[#E4405F]' },
    { key: 'spotify', count: artist.followers.spotify, icon: 'ri-spotify-fill text-[#1DB954]' },
    { key: 'youtube', count: artist.followers.youtube, icon: 'ri-youtube-fill text-[#FF0000]' },
  ].filter((item) => item.count);

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-20 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('${artist.image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            objectPosition: 'top'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            {/* Artist Photo */}
            <div className="relative group">
              <div className="w-64 h-64 rounded-2xl overflow-hidden border-4 border-[#0EA8A0]/50 group-hover:border-[#0EA8A0] transition-all duration-300">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: artist.id === 15 ? 'center 50%' : artist.id === 18 ? 'center 20%' : artist.id === 14 ? 'center 30%' : artist.id === 11 ? 'center 28%' : artist.id === 19 ? 'center 30%' : artist.id === 20 ? 'center 30%' : [13, 16].includes(artist.id) ? 'center 35%' : 'center top',
                    imageRendering: [10, 12, 18, 19].includes(artist.id) ? 'auto' : 'crisp-edges',
                    WebkitImageRendering: [10, 12, 18, 19].includes(artist.id) ? 'auto' : 'crisp-edges',
                    filter: [10, 12, 18, 19].includes(artist.id) ? 'none' : 'contrast(1.1) saturate(1.05)'
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#0EA8A0]/20 to-[#C45C2F]/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Artist Info */}
            <div className="flex-1 text-center md:text-left">
              <span className="block text-sm font-medium text-[#0EA8A0] mb-3">
                {artist.genre}
              </span>
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
                {artist.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-white/70">
                {followerCounts.map((item) => (
                  <div key={item.key} className="flex items-center space-x-2">
                    <i className={`${item.icon} text-xl`} aria-hidden="true"></i>
                    <span>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biography */}
      <section className="relative py-20 bg-gradient-to-b from-black to-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-8">
            Biografia
          </h2>
          <div className="prose prose-invert max-w-none">
            {artist.bio.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-white/70 text-lg leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Songs */}
      {artist.songs.length > 0 && (
      <section className="relative py-20 bg-[#1A1A1A]">
        
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#0EA8A0]/10 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12">
            Músicas populares
          </h2>
          <div className="space-y-3">
            {artist.songs.map((song, index) => (
              <div
                key={song.id}
                className="group flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-[#0EA8A0]/30 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[#0EA8A0]/20 rounded-lg group-hover:bg-[#0EA8A0]/30 transition-all duration-300">
                  <i className="ri-play-fill text-2xl text-[#0EA8A0]"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold mb-1 group-hover:text-[#0EA8A0] transition-colors duration-300">
                    {song.title}
                  </h3>
                  <p className="text-white/50 text-sm">
                    {song.album}
                  </p>
                </div>
                <div className="hidden md:block text-white/50 text-sm">
                  {song.plays} plays
                </div>
                <div className="text-white/50 text-sm">
                  {song.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Videos */}
      {artist.videos.length > 0 && (
      <section className="relative py-20 bg-gradient-to-b from-[#1A1A1A] to-black">
        
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#C45C2F]/10 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12">
            Videoclipes
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {artist.videos.map((video) => {
              const content = (
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl bg-[#141414] border border-white/10 hover:border-[#C45C2F]/50 transition-all duration-500">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                      
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center bg-[#C45C2F]/90 backdrop-blur-sm rounded-full opacity-90 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                        <i className="ri-play-fill text-4xl text-white ml-1"></i>
                      </div>

                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-lg flex items-center space-x-2">
                        <i className="ri-eye-fill text-[#0EA8A0] text-sm"></i>
                        <span className="text-white text-xs font-semibold">
                          {video.views}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#C45C2F] transition-colors duration-300">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                </div>
              );

              if (video.url) {
                return (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <div key={video.id}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Social Links */}
      <section className="relative py-20 bg-gradient-to-b from-black to-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Siga {artist.followName ?? artist.name}
          </h2>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[
              {
                key: 'instagram',
                url: artist.instagram,
                icon: 'ri-instagram-fill',
                containerClass:
                  'bg-[#E4405F]/20 hover:bg-[#E4405F]/30 border-[#E4405F]/30 hover:border-[#E4405F]/50',
                iconClass: 'text-[#E4405F]',
              },
              {
                key: 'spotify',
                url: artist.spotify,
                icon: 'ri-spotify-fill',
                containerClass:
                  'bg-[#1DB954]/20 hover:bg-[#1DB954]/30 border-[#1DB954]/30 hover:border-[#1DB954]/50',
                iconClass: 'text-[#1DB954]',
              },
              {
                key: 'youtube',
                url: artist.youtube,
                icon: 'ri-youtube-fill',
                containerClass:
                  'bg-[#FF0000]/20 hover:bg-[#FF0000]/30 border-[#FF0000]/30 hover:border-[#FF0000]/50',
                iconClass: 'text-[#FF0000]',
              },
            ].map((social) => {
              const baseClasses =
                'w-16 h-16 flex items-center justify-center rounded-full border transition-all duration-300';
              const disabledClasses = 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed';

              if (!social.url) {
                return (
                  <button
                    key={social.key}
                    type="button"
                    disabled
                    className={`${baseClasses} ${disabledClasses}`}
                    aria-disabled="true"
                    title="Em breve"
                  >
                    <i className={`${social.icon} text-3xl`}></i>
                  </button>
                );
              }

              return (
                <a
                  key={social.key}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${baseClasses} ${social.containerClass} hover:scale-110 cursor-pointer`}
                >
                  <i className={`${social.icon} text-3xl ${social.iconClass}`}></i>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}