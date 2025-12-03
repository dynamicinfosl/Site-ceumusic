/**
 * Tipo para representar um vídeo do YouTube
 */
export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail?: string;
  publishedAt: string;
}

/**
 * Obtém o ID do canal a partir do handle do canal (ex: @ceumusicbrasil)
 */
async function getChannelIdFromHandle(handle: string, apiKey: string): Promise<string> {
  // Remove o @ se presente
  const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;
  
  const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${cleanHandle}&key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Limite de cota da API do YouTube atingido. Tente novamente amanhã.');
      }
      if (response.status === 404) {
        throw new Error(`Canal ${handle} não encontrado. Verifique se o handle está correto.`);
      }
      throw new Error(`Erro ao buscar canal: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error(`Canal ${handle} não encontrado.`);
    }
    
    return data.items[0].id;
  } catch (error) {
    if (error instanceof Error) {
      // Verifica se é erro de conexão
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Erro de conexão. Verifique sua conexão com a internet.');
      }
      throw error;
    }
    throw new Error('Erro desconhecido ao buscar canal');
  }
}

/**
 * Busca vídeos de um canal do YouTube usando o handle do canal
 * @param channelHandle - Handle do canal (ex: @ceumusicbrasil ou ceumusicbrasil)
 * @param maxResults - Número máximo de vídeos a retornar (padrão: 10)
 * @returns Array de vídeos do canal
 */
export async function fetchChannelVideos(
  channelHandle: string,
  maxResults: number = 10
): Promise<YouTubeVideo[]> {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  
  if (!apiKey) {
    throw new Error('API Key do YouTube não configurada. Configure VITE_YOUTUBE_API_KEY no arquivo .env');
  }

  try {
    // Primeiro, obtém o ID do canal a partir do handle
    const channelId = await getChannelIdFromHandle(channelHandle, apiKey);
    
    // Busca os vídeos do canal
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=${maxResults}&key=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error?.message?.includes('quota') || errorData.error?.message?.includes('quotaExceeded')) {
          throw new Error('Limite de cota da API do YouTube atingido. Tente novamente amanhã.');
        }
        throw new Error('Erro de autenticação. Verifique se a API Key está correta.');
      }
      if (response.status === 404) {
        throw new Error('Canal não encontrado.');
      }
      throw new Error(`Erro ao buscar vídeos: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return [];
    }
    
    // Converte os dados da API para o formato YouTubeVideo
    const videos: YouTubeVideo[] = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.maxres?.url || 
                 item.snippet.thumbnails?.high?.url || 
                 item.snippet.thumbnails?.medium?.url,
      publishedAt: item.snippet.publishedAt
    }));
    
    return videos;
  } catch (error) {
    if (error instanceof Error) {
      // Verifica se é erro de conexão
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Erro de conexão. Verifique sua conexão com a internet.');
      }
      throw error;
    }
    throw new Error('Erro desconhecido ao buscar vídeos do canal');
  }
}




