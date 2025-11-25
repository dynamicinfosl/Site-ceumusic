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
 * Verifica se há conexão com a internet
 */
function checkInternetConnection(): boolean {
  return navigator.onLine;
}

// Cache para evitar múltiplas tentativas simultâneas
let channelIdCache: { [handle: string]: { id: string | null; timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Busca o ID do canal usando diferentes métodos
 */
async function getChannelId(handle: string, apiKey: string): Promise<string | null> {
  // Verifica conexão antes de tentar
  if (!checkInternetConnection()) {
    throw new Error('Sem conexão com a internet. Verifique sua conexão e tente novamente.');
  }

  // Verifica cache
  const cached = channelIdCache[handle];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    if (cached.id) {
      return cached.id;
    }
    // Se cache indica que não encontrou, não tenta novamente
    return null;
  }

  // Método 1: Tentar pelo handle
  try {
    const cleanHandle = handle.replace('@', '');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${cleanHandle}&key=${apiKey}`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (data.items?.[0]?.id) {
        const channelId = data.items[0].id;
        // Salva no cache
        channelIdCache[handle] = { id: channelId, timestamp: Date.now() };
        return channelId;
      }
    } else {
      // Se a resposta não for ok, verifica se é erro de API
      const errorData = await response.json().catch(() => ({}));
      if (errorData.error) {
        const errorMessage = errorData.error.message || 'Erro desconhecido da API';
        throw new Error(`Erro da API do YouTube: ${errorMessage}`);
      }
    }
  } catch (error: any) {
    // Trata erros de rede especificamente
    if (error.name === 'AbortError') {
      throw new Error('Tempo de espera esgotado. Verifique sua conexão.');
    }
    if (error.message && error.message.includes('API do YouTube')) {
      throw error; // Re-lança erros da API
    }
    // Para erros de rede (fetch failed), verifica se é problema de conexão
    if (error instanceof TypeError && error.message.includes('fetch')) {
      if (!checkInternetConnection()) {
        throw new Error('Sem conexão com a internet. Verifique sua conexão e tente novamente.');
      }
      throw new Error('Erro de conexão com a API do YouTube. Verifique sua internet.');
    }
    // Para outros erros, tenta método alternativo silenciosamente (sem log)
  }

  // Método 2: Tentar buscar pelo nome do canal (apenas se método 1 falhar silenciosamente)
  try {
    const cleanHandle = handle.replace('@', '');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(cleanHandle)}&key=${apiKey}&maxResults=1`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (data.items?.[0]?.id?.channelId) {
        const channelId = data.items[0].id.channelId;
        // Salva no cache
        channelIdCache[handle] = { id: channelId, timestamp: Date.now() };
        return channelId;
      }
    } else {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.error) {
        const errorMessage = errorData.error.message || 'Erro desconhecido da API';
        throw new Error(`Erro da API do YouTube: ${errorMessage}`);
      }
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Tempo de espera esgotado. Verifique sua conexão.');
    }
    if (error.message && error.message.includes('API do YouTube')) {
      throw error;
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      if (!checkInternetConnection()) {
        throw new Error('Sem conexão com a internet. Verifique sua conexão e tente novamente.');
      }
      throw new Error('Erro de conexão com a API do YouTube. Verifique sua internet.');
    }
    // Se ambos os métodos falharem, retorna null sem log adicional
  }

  // Se ambos os métodos falharam, salva no cache para evitar novas tentativas
  channelIdCache[handle] = { id: null, timestamp: Date.now() };
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
  
  // Se não houver API key, lança erro específico
  if (!apiKey) {
    throw new Error('API Key do YouTube não configurada. Configure VITE_YOUTUBE_API_KEY no arquivo .env');
  }

  // Verifica conexão antes de tentar
  if (!checkInternetConnection()) {
    throw new Error('Sem conexão com a internet. Verifique sua conexão e tente novamente.');
  }

  try {
    // Obtém o ID do canal usando método melhorado
    const channelId = await getChannelId(channelHandle, apiKey);
    
    if (!channelId) {
      throw new Error(`Não foi possível encontrar o canal "${channelHandle}". Verifique se o handle está correto.`);
    }

    // Busca os vídeos do canal com timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos de timeout

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=${maxResults}&key=${apiKey}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Trata erros específicos da API
      if (errorData.error) {
        const errorMessage = errorData.error.message || 'Erro desconhecido';
        const errorReason = errorData.error.errors?.[0]?.reason || '';
        
        if (errorReason === 'quotaExceeded') {
          throw new Error('Limite de cota da API do YouTube excedido. Tente novamente mais tarde.');
        } else if (errorReason === 'invalidApiKey') {
          throw new Error('API Key inválida. Verifique se a chave está correta no arquivo .env');
        } else if (errorReason === 'forbidden') {
          throw new Error('Acesso negado pela API do YouTube. Verifique as permissões da API Key.');
        } else {
          throw new Error(`Erro da API do YouTube: ${errorMessage}`);
        }
      }
      
      throw new Error(`Erro ao buscar vídeos: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Nenhum vídeo encontrado no canal. O canal pode estar vazio ou privado.');
    }
    
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (error: any) {
    // Re-lança erros com mensagens específicas
    if (error.name === 'AbortError') {
      throw new Error('Tempo de espera esgotado. Verifique sua conexão com a internet.');
    }
    if (error.message) {
      throw error; // Re-lança erros com mensagens específicas
    }
    // Para erros genéricos de rede
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e se a API Key está configurada corretamente.');
    }
    throw new Error('Erro desconhecido ao buscar vídeos do YouTube.');
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

