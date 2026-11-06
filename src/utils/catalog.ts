import { supabase } from './supabase';

// Boa parte do catálogo real (fotos e textos) está no código, e o banco tem só parte dele.
// Estas funções combinam as duas fontes: o que for editado no painel vale, e o que for
// novo no painel é acrescentado, sem perder o que já está publicado.

export interface ArtistRow {
  id: string;
  name: string;
  genre: string | null;
  bio: string | null;
  image_url: string | null;
  instagram: string | null;
  spotify: string | null;
  youtube: string | null;
}

export interface ReleaseRow {
  id: string;
  title: string;
  artist_name: string | null;
  cover_url: string | null;
  release_type: string | null;
  release_date: string | null;
  streaming_link: string | null;
}

interface ArtistFields {
  name: string;
  followName?: string;
  genre: string;
  bio: string;
  image: string;
  instagram: string | null;
  spotify: string | null;
  youtube: string | null;
}

export function normalizeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();
}

export function isSameArtist(artist: { name: string; followName?: string }, row: ArtistRow): boolean {
  const rowName = normalizeName(row.name);
  return normalizeName(artist.name) === rowName || (!!artist.followName && normalizeName(artist.followName) === rowName);
}

// O conteúdo inicial do banco traz textos e imagens provisórios, que não devem
// substituir a bio e a foto reais dos artistas.
const hasRealBio = (bio: string | null): bio is string => !!bio && !/^Perfil d[aoe]\b/i.test(bio.trim());
const hasRealPhoto = (url: string | null): url is string => !!url && !url.includes('img.youtube.com');

export function applyArtistRow<T extends ArtistFields>(artist: T, row: ArtistRow): T {
  return {
    ...artist,
    genre: row.genre || artist.genre,
    bio: hasRealBio(row.bio) ? row.bio : artist.bio,
    image: hasRealPhoto(row.image_url) ? row.image_url : artist.image,
    instagram: row.instagram || artist.instagram,
    spotify: row.spotify || artist.spotify,
    youtube: row.youtube || artist.youtube,
  };
}

export async function fetchArtistRows(): Promise<ArtistRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('artists').select('*').order('order_index', { ascending: true });
  if (error) {
    console.error('Erro ao carregar artistas:', error);
    return [];
  }
  return data ?? [];
}

export async function fetchReleaseRows(): Promise<ReleaseRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('releases').select('*').order('order_index', { ascending: true });
  if (error) {
    console.error('Erro ao carregar lançamentos:', error);
    return [];
  }
  return data ?? [];
}
