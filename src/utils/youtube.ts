export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

/**
 * Extrai o ID do canal a partir do handle do YouTube
 */
async function getChannelIdFromHandle(handle: string): Promise<string | null> {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) {
    console.warn('VITE_YOUTUBE_API_KEY não configurada. Usando fallback.');
    return null;
  }

  try {
    // Remove o @ se presente
    const cleanHandle = handle.replace('@', '');
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${cleanHandle}&key=${apiKey}`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro ao buscar canal:', response.status, errorData);
      throw new Error(`Erro ao buscar canal: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    return data.items?.[0]?.id || null;
  } catch (error) {
    console.error('Erro ao buscar ID do canal:', error);
    return null;
  }
}

/**
 * Busca o ID do canal usando diferentes métodos
 */
async function getChannelId(handle: string, apiKey: string): Promise<string | null> {
  // Método 1: Tentar pelo handle
  try {
    const cleanHandle = handle.replace('@', '');
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${cleanHandle}&key=${apiKey}`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.items?.[0]?.id) {
        console.log('Canal encontrado pelo handle:', data.items[0].id);
        return data.items[0].id;
      }
    }
  } catch (error) {
    console.warn('Erro ao buscar pelo handle, tentando alternativa...', error);
  }

  // Método 2: Tentar buscar pelo nome do canal
  try {
    const cleanHandle = handle.replace('@', '');
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(cleanHandle)}&key=${apiKey}&maxResults=1`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.items?.[0]?.id?.channelId) {
        console.log('Canal encontrado pela busca:', data.items[0].id.channelId);
        return data.items[0].id.channelId;
      }
    }
  } catch (error) {
    console.warn('Erro ao buscar pelo nome:', error);
  }

  return null;
}

/**
 * Busca os vídeos de um canal do YouTube
 */
export async function fetchChannelVideos(
  channelHandle: string,
  maxResults: number = 50
): Promise<YouTubeVideo[]> {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  
  // Se não houver API key, retorna lista vazia
  if (!apiKey) {
    console.warn('VITE_YOUTUBE_API_KEY não configurada. Configure no arquivo .env');
    return [];
  }

  try {
    console.log('Buscando ID do canal:', channelHandle);
    // Obtém o ID do canal usando método melhorado
    const channelId = await getChannelId(channelHandle, apiKey);
    
    if (!channelId) {
      console.error('Não foi possível encontrar o ID do canal:', channelHandle);
      return [];
    }

    console.log('ID do canal encontrado:', channelId);
    console.log('Buscando vídeos do canal...');

    // Busca os vídeos do canal
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=${maxResults}&key=${apiKey}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro ao buscar vídeos:', response.status, errorData);
      throw new Error(`Erro ao buscar vídeos: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Vídeos encontrados:', data.items?.length || 0);
    
    if (!data.items || data.items.length === 0) {
      console.warn('Nenhum vídeo encontrado no canal');
      return [];
    }
    
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (error) {
    console.error('Erro ao buscar vídeos do canal:', error);
    return [];
  }
}

/**
 * Busca vídeos usando uma abordagem alternativa sem API key
 * Usa scraping básico da página do canal (limitado)
 */
export async function fetchChannelVideosFallback(
  channelHandle: string
): Promise<YouTubeVideo[]> {
  try {
    // Remove o @ se presente
    const cleanHandle = channelHandle.replace('@', '');
    const channelUrl = `https://www.youtube.com/${cleanHandle}/videos`;
    
    // Nota: Esta abordagem tem limitações devido a CORS
    // Em produção, você precisaria de um backend proxy ou usar a API oficial
    console.warn('Usando fallback - funcionalidade limitada sem API key');
    
    // Retorna lista vazia pois scraping direto não funciona devido a CORS
    return [];
  } catch (error) {
    console.error('Erro no fallback:', error);
    return [];
  }
}

