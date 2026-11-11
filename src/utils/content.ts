import { useEffect, useState } from 'react';
import { supabase } from './supabase';

// Todo o conteúdo do site vem do banco e é editado pelo painel.

export interface ArtistSong {
  title: string;
  album: string;
  plays: string;
}

export interface ArtistVideo {
  title: string;
  url: string;
}

export interface Artist {
  id: string;
  name: string;
  genre: string | null;
  bio: string | null;
  short_bio: string | null;
  image_url: string | null;
  photo_position: string | null;
  instagram: string | null;
  spotify: string | null;
  youtube: string | null;
  tiktok: string | null;
  twitter: string | null;
  facebook: string | null;
  followers: { instagram?: string; spotify?: string; youtube?: string } | null;
  songs: ArtistSong[] | null;
  videos: ArtistVideo[] | null;
  legacy_id: number | null;
  order_index: number | null;
}

export interface Release {
  id: string;
  title: string;
  artist_name: string | null;
  cover_url: string | null;
  release_type: string | null;
  release_date: string | null;
  genre: string | null;
  streams: string | null;
  featured: boolean | null;
  video_url: string | null;
  streaming_link: string | null;
  order_index: number | null;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface AboutValue {
  icon: string;
  title: string;
  description: string;
}

export interface AboutPageContent {
  intro: string;
  story: string;
  mission_title: string;
  mission_text: string;
  card_title: string;
  card_text: string;
  values_title: string;
  values_text: string;
  values: AboutValue[];
  vision_title: string;
  vision_text: string;
}

export interface LegalSettings {
  legal_name: string;
  cnpj: string;
  dpo_name: string;
}

export interface FestivalSettings {
  registration_open?: boolean;
  fee_cents?: number;
  deadline?: string;
  max_video_minutes?: number;
  tagline?: string;
  about?: string;
  prizes?: { title: string; text: string }[];
  regulation?: string;
  site_url?: string;
  banner?: { enabled?: boolean; title?: string; text?: string };
}

export interface SiteSettings {
  festival?: FestivalSettings;
  about_page?: AboutPageContent;
  footer_text?: string;
  contact_subjects?: string[];
  page_background?: string;
  legal?: LegalSettings;
}

const brandIcons: Record<string, string> = {
  instagram: 'ri-instagram-fill',
  youtube: 'ri-youtube-fill',
  spotify: 'ri-spotify-fill',
  tiktok: 'ri-tiktok-fill',
  facebook: 'ri-facebook-fill',
  twitter: 'ri-twitter-x-fill',
  x: 'ri-twitter-x-fill',
};

const requests = new Map<string, Promise<unknown>>();

// Cada conteúdo é buscado uma vez por visita; uma falha pode ser tentada de novo.
function once<T>(key: string, load: () => Promise<T>): Promise<T> {
  let request = requests.get(key) as Promise<T> | undefined;
  if (!request) {
    request = load().catch((error) => {
      requests.delete(key);
      throw error;
    });
    requests.set(key, request);
  }
  return request;
}

// Depois de salvar no painel, o site precisa buscar os dados novos.
export function clearContentCache() {
  requests.clear();
}

async function selectAll<T>(table: string, order = 'order_index'): Promise<T[]> {
  if (!supabase) throw new Error('Banco de dados não configurado');
  const { data, error } = await supabase.from(table).select('*').order(order, { ascending: true });
  if (error) throw error;
  return (data ?? []) as T[];
}

export const fetchArtists = () => once('artists', () => selectAll<Artist>('artists'));

export const fetchReleases = () => once('releases', () => selectAll<Release>('releases'));

export const fetchSocialLinks = () =>
  once('social_links', async () => {
    const rows = await selectAll<{ name: string; url: string; icon: string | null; color: string | null }>('social_links');
    return rows.map<SocialLink>((row) => ({
      name: row.name,
      url: row.url,
      icon: brandIcons[row.name.trim().toLowerCase()] ?? row.icon ?? 'ri-link',
      // Preto ficaria invisível no fundo escuro do site
      color: !row.color || row.color === '#000000' ? '#FFFFFF' : row.color,
    }));
  });

export const fetchContactInfo = () =>
  once('contact_info', async () => {
    const rows = await selectAll<{ type: string; value: string }>('contact_info', 'type');
    const valueOf = (type: string) => rows.find((row) => row.type === type)?.value ?? '';
    return { email: valueOf('email'), phone: valueOf('phone'), address: valueOf('address') } as ContactInfo;
  });

export const fetchSettings = () =>
  once('site_settings', async () => {
    const rows = await selectAll<{ key: string; value: unknown }>('site_settings', 'key');
    return Object.fromEntries(rows.map((row) => [row.key, row.value])) as SiteSettings;
  });

// Devolve null enquanto carrega e o valor vazio se a busca falhar.
function useContent<T>(load: () => Promise<T>, empty: T): T | null {
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    let active = true;
    load()
      .then((result) => {
        if (active) setValue(result);
      })
      .catch((error) => {
        console.error('Erro ao carregar conteúdo:', error);
        if (active) setValue(empty);
      });
    return () => {
      active = false;
    };
    // load e empty são constantes de cada hook abaixo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}

const NO_ITEMS: never[] = [];
const NO_CONTACT: ContactInfo = { email: '', phone: '', address: '' };
const NO_SETTINGS: SiteSettings = {};

export const useArtists = () => useContent<Artist[]>(fetchArtists, NO_ITEMS);
export const useReleases = () => useContent<Release[]>(fetchReleases, NO_ITEMS);
export const useSocialLinks = (): SocialLink[] => useContent<SocialLink[]>(fetchSocialLinks, NO_ITEMS) ?? NO_ITEMS;
export const useContactInfo = (): ContactInfo => useContent(fetchContactInfo, NO_CONTACT) ?? NO_CONTACT;
export const useSettings = () => useContent(fetchSettings, NO_SETTINGS);

export function normalizeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();
}

// Encontra o artista de um crédito como "No Santuário feat. Geziel Lima".
export function findArtistByCredit(artists: Artist[] | null, credit: string | null | undefined): Artist | undefined {
  if (!artists || !credit) return undefined;
  const normalized = normalizeName(credit);
  return artists.find((artist) => {
    const name = normalizeName(artist.name);
    return name === normalized || normalized.startsWith(`${name} `);
  });
}

export function phoneHref(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return `tel:${digits.length <= 11 ? `+55${digits}` : `+${digits}`}`;
}
