import { supabase } from './supabase'

/**
 * Tipo para representar um vídeo armazenado no Supabase
 */
export interface Video {
  id: string
  title: string
  artist: string
  song?: string
  youtube_id: string
  thumbnail_url?: string
  duration?: string
  views?: string
  published_at?: string
  is_featured?: boolean
  order?: number
}

/**
 * Busca vídeos do Supabase
 * @param options - Opções de filtro e ordenação
 * @returns Array de vídeos
 */
export async function fetchVideos(options?: {
  featured?: boolean
  limit?: number
  orderBy?: 'published_at' | 'order' | 'created_at'
  orderDirection?: 'asc' | 'desc'
}): Promise<Video[]> {
  // Verifica se o Supabase está configurado
  if (!supabase) {
    throw new Error('Supabase não configurado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env')
  }

  try {
    // Log para debug
    console.log('🔍 Buscando vídeos do Supabase...', {
      featured: options?.featured,
      limit: options?.limit,
      orderBy: options?.orderBy || 'order'
    })

    let query = supabase
      .from('videos')
      .select('*')

    // Filtro por featured
    if (options?.featured !== undefined) {
      query = query.eq('is_featured', options.featured)
    }

    // Ordenação - "order" é palavra reservada, precisa ser escapada
    const orderBy = options?.orderBy || 'order'
    const orderDirection = options?.orderDirection || 'asc'
    
    // Tenta ordenar, mas se falhar com "order", tenta outros campos
    try {
      query = query.order(orderBy, { ascending: orderDirection === 'asc' })
    } catch (orderError) {
      // Se "order" falhar, tenta usar "created_at" como fallback
      console.warn('⚠️ Erro ao ordenar por "order", usando "created_at" como fallback:', orderError)
      query = query.order('created_at', { ascending: orderDirection === 'asc' })
    }

    // Limite
    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
      // Log detalhado do erro para debug
      console.error('❌ Erro do Supabase:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        status: (error as any).status
      })

      // Tratamento específico para erro 404 (tabela não existe ou RLS bloqueando)
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        throw new Error('Tabela "videos" não encontrada no Supabase. Verifique se a tabela existe e se as políticas RLS estão configuradas corretamente.')
      }
      // Tratamento para erro 404 da API
      if (error.message?.includes('404') || (error as any).status === 404) {
        throw new Error('Erro 404: Tabela "videos" não encontrada ou acesso negado. Verifique: 1) Se a tabela existe, 2) Se as políticas RLS permitem leitura pública, 3) Se o nome da tabela está correto.')
      }
      // Erro de permissão (RLS)
      if (error.code === '42501' || error.message?.includes('permission denied') || error.message?.includes('new row violates row-level security')) {
        throw new Error('Acesso negado pela política RLS. Verifique se a política permite SELECT público na tabela "videos".')
      }
      throw error
    }

    console.log('✅ Vídeos carregados com sucesso:', data?.length || 0, 'vídeos')
    return (data || []) as Video[]
  } catch (error) {
    console.error('❌ Erro ao buscar vídeos do Supabase:', error)
    
    if (error instanceof Error) {
      // Verifica se é erro de conexão
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Erro de conexão. Verifique sua conexão com a internet e se as credenciais do Supabase estão corretas.')
      }
      // Re-lança erros que já têm mensagem útil
      if (error.message.includes('não encontrada') || error.message.includes('não configurado') || error.message.includes('negado') || error.message.includes('404')) {
        throw error
      }
      throw new Error(`Erro ao buscar vídeos: ${error.message}`)
    }
    
    throw new Error('Erro desconhecido ao buscar vídeos')
  }
}

/**
 * Busca um vídeo específico por ID
 */
export async function fetchVideoById(id: string): Promise<Video | null> {
  // Verifica se o Supabase está configurado
  if (!supabase) {
    throw new Error('Supabase não configurado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env')
  }

  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Nenhum resultado encontrado
        return null
      }
      throw error
    }

    return data as Video
  } catch (error) {
    console.error('Erro ao buscar vídeo:', error)
    throw error
  }
}

/**
 * Gera a URL da thumbnail do YouTube a partir do ID do vídeo
 * (fallback caso não tenha thumbnail_url no Supabase)
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault' = 'maxresdefault'): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}

