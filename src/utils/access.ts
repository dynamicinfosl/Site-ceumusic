import { createContext, useContext } from 'react';
import { supabase } from './supabase';

export const PERMISSION_GROUPS = [
  {
    label: 'Conteúdo do site',
    items: [
      { key: 'hero', label: 'Vídeos do topo' },
      { key: 'about', label: 'Sobre' },
      { key: 'artists', label: 'Artistas' },
      { key: 'releases', label: 'Lançamentos' },
      { key: 'videos', label: 'Galeria de vídeos' },
      { key: 'news', label: 'Notícias' },
      { key: 'contact', label: 'Contato e redes' },
      { key: 'settings', label: 'Configurações do site' },
    ],
  },
  {
    label: 'Administração',
    items: [
      { key: 'users', label: 'Gerenciar usuários e convites' },
      { key: 'roles', label: 'Gerenciar níveis de permissão' },
    ],
  },
];

export interface MyAccess {
  user_id: string;
  email: string;
  full_name: string;
  job_title: string;
  phone: string;
  avatar_url: string;
  status: 'pending' | 'active' | 'blocked';
  role_name: string | null;
  is_master: boolean;
  permissions: string[];
}

export async function fetchMyAccess(): Promise<MyAccess | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc('get_my_access');
  if (error) throw error;
  return data as MyAccess | null;
}

interface AccessContextValue {
  access: MyAccess;
  can: (permission: string) => boolean;
  reload: () => Promise<void>;
}

export const AccessContext = createContext<AccessContextValue | null>(null);

export function useAccess(): AccessContextValue {
  const value = useContext(AccessContext);
  if (!value) throw new Error('useAccess precisa estar dentro do painel');
  return value;
}

export function initialsOf(name: string, email: string): string {
  const words = (name || email).trim().split(/\s+/);
  return ((words[0]?.[0] ?? '') + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase();
}
