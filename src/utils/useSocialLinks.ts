import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
}

// Usado enquanto o banco carrega ou se ele estiver indisponível.
const fallbackLinks: SocialLink[] = [
  { name: 'Instagram', url: 'https://www.instagram.com/ceumusicbr/', icon: 'ri-instagram-fill', color: '#E4405F' },
  { name: 'YouTube', url: 'https://www.youtube.com/@ceumusicbrasil', icon: 'ri-youtube-fill', color: '#FF0000' },
];

const brandIcons: Record<string, string> = {
  instagram: 'ri-instagram-fill',
  youtube: 'ri-youtube-fill',
  spotify: 'ri-spotify-fill',
  tiktok: 'ri-tiktok-fill',
  facebook: 'ri-facebook-fill',
  twitter: 'ri-twitter-x-fill',
  x: 'ri-twitter-x-fill',
};

let cachedRequest: Promise<SocialLink[]> | null = null;

function loadSocialLinks(): Promise<SocialLink[]> {
  if (!supabase) return Promise.resolve(fallbackLinks);
  cachedRequest ??= Promise.resolve(
    supabase.from('social_links').select('*').order('order_index', { ascending: true })
  ).then(({ data, error }) => {
    if (error) {
      console.error('Erro ao carregar redes sociais:', error);
      cachedRequest = null;
      return fallbackLinks;
    }
    if (!data?.length) return fallbackLinks;
    return data.map((row) => ({
      name: row.name,
      url: row.url,
      icon: brandIcons[String(row.name).toLowerCase()] ?? row.icon ?? 'ri-link',
      // Preto ficaria invisível no fundo escuro do site
      color: !row.color || row.color === '#000000' ? '#FFFFFF' : row.color,
    }));
  });
  return cachedRequest;
}

export function useSocialLinks(): SocialLink[] {
  const [links, setLinks] = useState<SocialLink[]>(fallbackLinks);

  useEffect(() => {
    let active = true;
    loadSocialLinks().then((result) => {
      if (active) setLinks(result);
    });
    return () => {
      active = false;
    };
  }, []);

  return links;
}
