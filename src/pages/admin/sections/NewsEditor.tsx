import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase';
import { 
  Plus, 
  Trash2, 
  Save, 
  Newspaper, 
  Calendar, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  Search,
  ChevronRight
} from 'lucide-react';
import MediaUpload from '../components/MediaUpload';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string;
  publish_date: string;
}

export default function NewsEditor() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('publish_date', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar notícias:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateNews = () => {
    const freshNews: NewsItem = {
      id: crypto.randomUUID(),
      title: 'Nova Notícia',
      category: 'Geral',
      excerpt: '',
      content: '',
      image_url: '',
      publish_date: new Date().toISOString()
    };
    setSelectedNewsId(freshNews.id);
    setNews([freshNews, ...news]);
  };

  const handleChange = (field: keyof NewsItem, value: string) => {
    setNews(news.map(n => n.id === selectedNewsId ? { ...n, [field]: value } : n));
  };

  const handleSave = async (item: NewsItem) => {
    if (!supabase) return;
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.from('news').upsert(item);
      if (error) throw error;
      setMessage({ type: 'success', text: 'Notícia salva com sucesso!' });
      fetchNews();
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Erro ao salvar: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir esta notícia permanentemente?')) return;
    if (!supabase) return;

    try {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw error;
      setNews(news.filter(n => n.id !== id));
      if (selectedNewsId === id) setSelectedNewsId(null);
      setMessage({ type: 'success', text: 'Notícia removida.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Erro ao remover: ' + err.message });
    }
  };

  const selectedNews = news.find(n => n.id === selectedNewsId);
  const filteredNews = news.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#0EA8A0]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-montserrat">Central de Notícias</h1>
          <p className="text-white/40 mt-1">Publique novidades, parcerias e conquistas dos artistas.</p>
        </div>
        <button
          onClick={handleCreateNews}
          className="bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nova Postagem
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-500' 
            : 'bg-red-500/10 border-red-500/20 text-red-500'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        {/* News List sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" 
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-[#0EA8A0] outline-none"
            />
          </div>
          
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden max-h-[600px] overflow-y-auto scrollbar-hide">
            {filteredNews.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedNewsId(item.id)}
                className={`w-full p-4 text-left border-b border-white/5 flex items-center gap-4 transition-all hover:bg-white/5 ${selectedNewsId === item.id ? 'bg-[#0EA8A0]/10 border-l-4 border-l-[#0EA8A0]' : ''}`}
              >
                <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden shrink-0 border border-white/10">
                  {item.image_url ? (
                    <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10">
                      <Newspaper className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{item.title || 'Sem Título'}</p>
                  <p className="text-[10px] text-white/40 mt-1 uppercase font-bold">{item.category}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/10" />
              </button>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-8">
          {selectedNews ? (
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 space-y-6 slide-up">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <h2 className="text-xl font-bold font-montserrat">Editando Postagem</h2>
                <div className="flex gap-2">
                   <button 
                    onClick={() => handleDelete(selectedNews.id)}
                    className="p-2.5 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleSave(selectedNews)}
                    disabled={saving}
                    className="bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Salvar
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-bold text-white/20 uppercase ml-1">Título</label>
                    <input 
                      type="text" value={selectedNews.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mt-1 focus:border-[#0EA8A0] outline-none"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-bold text-white/20 uppercase ml-1">Categoria</label>
                    <input 
                      type="text" value={selectedNews.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      placeholder="Conquista, Evento, Tour..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mt-1 focus:border-[#0EA8A0] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-white/20 uppercase ml-1">Resumo (Excerpt)</label>
                  <textarea 
                    rows={2} value={selectedNews.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mt-1 focus:border-[#0EA8A0] outline-none text-sm resize-none"
                  />
                </div>

                <div>
                   <label className="text-[10px] font-bold text-white/20 uppercase ml-1">Conteúdo Completo (Markdown/HTML)</label>
                   <textarea 
                    rows={8} value={selectedNews.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mt-1 focus:border-[#0EA8A0] outline-none text-sm font-sans"
                  />
                </div>

                <div className="pt-4 border-t border-white/5 space-y-6">
                   <MediaUpload 
                      onUploadComplete={(url) => handleChange('image_url', url)}
                      currentUrl={selectedNews.image_url}
                      type="image"
                      path="news"
                      label="Imagem de Capa (Upload R2)"
                   />
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold text-white/20 uppercase ml-1">Ou use uma URL externa</label>
                        <input 
                          type="url" value={selectedNews.image_url}
                          onChange={(e) => handleChange('image_url', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:border-[#0EA8A0] outline-none text-xs"
                        />
                        <label className="text-[10px] font-bold text-white/20 uppercase ml-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Data de Publicação
                        </label>
                        <input 
                          type="datetime-local" 
                          value={selectedNews.publish_date.slice(0, 16)}
                          onChange={(e) => handleChange('publish_date', new Date(e.target.value).toISOString())}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:border-[#0EA8A0] outline-none text-xs"
                        />
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-white/10">
              <Newspaper className="w-16 h-16 mb-4" />
              <p className="font-bold uppercase tracking-widest">Selecione uma notícia para editar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
