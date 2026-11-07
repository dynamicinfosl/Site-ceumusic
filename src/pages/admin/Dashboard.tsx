import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Info, Mail, Music, Newspaper, Settings, ShieldCheck, UserCircle, Users, Video, type LucideIcon } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { useAccess } from '../../utils/access';

interface Shortcut {
  label: string;
  description: string;
  icon: LucideIcon;
  path: string;
  table?: string;
  // Sem a lista, todo usuário ativo vê o atalho
  anyOf?: string[];
}

const shortcuts: Shortcut[] = [
  { label: 'Artistas', description: 'Perfis, fotos, músicas e videoclipes', icon: Users, path: '/admin/sections/artists', table: 'artists', anyOf: ['artists'] },
  { label: 'Lançamentos', description: 'Capas, links e destaques', icon: Music, path: '/admin/sections/releases', table: 'releases', anyOf: ['releases'] },
  { label: 'Vídeos do topo', description: 'Fundo do início do site', icon: Video, path: '/admin/sections/hero', table: 'hero_videos', anyOf: ['hero'] },
  { label: 'Galeria de vídeos', description: 'Clipes e prévias', icon: Video, path: '/admin/sections/videos', table: 'videos_gallery', anyOf: ['videos'] },
  { label: 'Notícias', description: 'Novidades da Céu Music', icon: Newspaper, path: '/admin/sections/news', table: 'news', anyOf: ['news'] },
  { label: 'Sobre', description: 'Resumo e página “Nossa história”', icon: Info, path: '/admin/sections/about', anyOf: ['about'] },
  { label: 'Contato e redes', description: 'E-mail, telefone, endereço e redes', icon: Mail, path: '/admin/sections/contact', anyOf: ['contact'] },
  { label: 'Configurações', description: 'Rodapé, assuntos e dados da empresa', icon: Settings, path: '/admin/sections/settings', anyOf: ['settings'] },
  { label: 'Usuários', description: 'Convites, aprovações e níveis', icon: ShieldCheck, path: '/admin/users', anyOf: ['users', 'roles'] },
  { label: 'Meu perfil', description: 'Seus dados e sua senha', icon: UserCircle, path: '/admin/profile' },
];

export default function Dashboard() {
  const { access, can } = useAccess();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const visibleShortcuts = shortcuts.filter((shortcut) => !shortcut.anyOf || shortcut.anyOf.some(can));

  useEffect(() => {
    async function loadCounts() {
      if (!supabase) return;
      const client = supabase;
      const tables = shortcuts.flatMap((shortcut) => (shortcut.table ? [shortcut.table] : []));
      const results = await Promise.all(tables.map((table) => client.from(table).select('*', { count: 'exact', head: true })));
      setCounts(Object.fromEntries(tables.map((table, index) => [table, results[index].count ?? 0])));
    }
    loadCounts();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Olá, {(access.full_name || access.email).split(' ')[0]}</h1>
          <p className="text-white/50 mt-1">O que você pode gerenciar no painel da Céu Music.</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[#0EA8A0] hover:text-white transition-colors">
          Ver o site <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleShortcuts.map(({ label, description, icon: Icon, path, table }) => (
          <Link key={path} to={path} className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl hover:border-[#0EA8A0]/40 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <Icon className="w-6 h-6 text-[#0EA8A0]" />
              {table && <span className="text-2xl font-bold tabular-nums">{counts[table] ?? '–'}</span>}
            </div>
            <h2 className="font-semibold">{label}</h2>
            <p className="text-white/50 text-sm mt-1">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
