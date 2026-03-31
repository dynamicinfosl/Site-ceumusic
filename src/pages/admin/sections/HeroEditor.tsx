import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase';
import { 
  Plus, 
  Trash2, 
  Save, 
  Youtube, 
  GripVertical,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import MediaUpload from '../components/MediaUpload';

interface HeroVideo {
  id: string;
  title: string;
  artist: string;
  description?: string;
  video_url: string;
  youtube_url: string;
  thumbnail_url: string;
  order_index: number;
}

export default function HeroEditor() {
  const [videos, setVideos] = useState<HeroVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('hero_videos')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setVideos(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar vídeos:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddField = () => {
    const newVideo: HeroVideo = {
      id: crypto.randomUUID(),
      title: '',
      artist: '',
      description: '',
      video_url: '',
      youtube_url: '',
      thumbnail_url: '',
      order_index: videos.length
    };
    setVideos([...videos, newVideo]);
  };

  const handleRemoveField = (id: string) => {
    setVideos(videos.filter(v => v.id !== id));
  };

  const handleChange = (id: string, field: keyof HeroVideo, value: string) => {
    setVideos(videos.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleSave = async () => {
    if (!supabase) return;
    setSaving(true);
    setMessage(null);

    try {
      // Clear existing and insert new (simplest way for a small list)
      // Or upsert. Let's upsert.
      const { error } = await supabase
        .from('hero_videos')
        .upsert(videos.map((v, i) => ({
          ...v,
          order_index: i // Re-index based on current order
        })));

      if (error) throw error;
      setMessage({ type: 'success', text: 'Configurações de Hero salvas com sucesso!' });
      fetchVideos();
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Erro ao salvar: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#0EA8A0]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-montserrat">Editor da Seção Hero</h1>
          <p className="text-white/40 mt-1">Gerencie os vídeos e banners que aparecem no topo do site.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar Alterações
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

      {/* Videos List */}
      <div className="space-y-4">
        {videos.map((video, index) => (
          <div 
            key={video.id}
            className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative group"
          >
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex flex-col items-center gap-2 pt-2 text-white/10">
                <GripVertical className="w-6 h-6" />
                <span className="text-xs font-bold">{index + 1}</span>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-white/40 ml-1 uppercase">Título da Música</label>
                    <input 
                      type="text" 
                      value={video.title}
                      onChange={(e) => handleChange(video.id, 'title', e.target.value)}
                      placeholder="Ex: Final Feliz"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 mt-1 focus:border-[#0EA8A0] transition-all outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-white/40 ml-1 uppercase">Artista / Participação</label>
                    <input 
                      type="text" 
                      value={video.artist}
                      onChange={(e) => handleChange(video.id, 'artist', e.target.value)}
                      placeholder="Ex: No Santuário feat. Geziel Lima"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 mt-1 focus:border-[#0EA8A0] transition-all outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-white/40 ml-1 uppercase">Breve Descrição</label>
                    <textarea 
                      rows={2}
                      value={video.description}
                      onChange={(e) => handleChange(video.id, 'description', e.target.value)}
                      placeholder="Dê um resumo sutil sobre a canção..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 mt-1 focus:border-[#0EA8A0] transition-all outline-none text-sm resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                       <label className="text-xs font-medium text-white/40 ml-1 uppercase flex items-center gap-1">
                        <Youtube className="w-3 h-3" /> Link do YouTube
                      </label>
                      <input 
                        type="url" 
                        value={video.youtube_url}
                        onChange={(e) => handleChange(video.id, 'youtube_url', e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 mt-1 focus:border-[#0EA8A0] transition-all outline-none text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <MediaUpload 
                      onUploadComplete={(url) => handleChange(video.id, 'video_url', url)}
                      currentUrl={video.video_url}
                      type="video"
                      path="hero/videos"
                      label="Vídeo de Fundo (MP4/WebM)"
                    />
                    <div className="pt-2 border-t border-white/5">
                      <input 
                        type="url" 
                        value={video.video_url}
                        onChange={(e) => handleChange(video.id, 'video_url', e.target.value)}
                        placeholder="Ou use uma URL externa"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 px-3 text-[10px] focus:border-[#0EA8A0] outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <MediaUpload 
                      onUploadComplete={(url) => handleChange(video.id, 'thumbnail_url', url)}
                      currentUrl={video.thumbnail_url}
                      type="image"
                      path="hero/thumbs"
                      label="Miniatura do Vídeo"
                    />
                    <div className="pt-2 border-t border-white/5">
                      <input 
                        type="url" 
                        value={video.thumbnail_url}
                        onChange={(e) => handleChange(video.id, 'thumbnail_url', e.target.value)}
                        placeholder="Ou use uma URL externa"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 px-3 text-[10px] focus:border-[#0EA8A0] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleRemoveField(video.id)}
                className="p-2 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={handleAddField}
          className="w-full py-4 border-2 border-dashed border-white/5 hover:border-[#0EA8A0]/30 hover:bg-[#0EA8A0]/5 rounded-2xl flex items-center justify-center gap-2 text-white/20 hover:text-[#0EA8A0] transition-all group"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Adicionar Novo Vídeo ao Hero
        </button>
      </div>
    </div>
  );
}
