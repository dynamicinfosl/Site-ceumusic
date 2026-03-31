import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase';
import { 
  Plus, 
  Trash2, 
  Save, 
  Youtube, 
  Star,
  Eye,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  GripVertical
} from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  artist: string;
  video_id: string;
  views: string;
  duration: string;
  featured: boolean;
  order_index: number;
}

export default function VideosEditor() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
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
        .from('videos_gallery')
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
    const newVideo: VideoItem = {
      id: crypto.randomUUID(),
      title: '',
      artist: '',
      video_id: '',
      views: '0',
      duration: '0:00',
      featured: false,
      order_index: videos.length
    };
    setVideos([...videos, newVideo]);
  };

  const handleChange = (id: string, field: keyof VideoItem, value: any) => {
    setVideos(videos.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleRemoveField = (id: string) => {
    setVideos(videos.filter(v => v.id !== id));
  };

  const handleSave = async () => {
    if (!supabase) return;
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('videos_gallery')
        .upsert(videos.map((v, i) => ({
          ...v,
          order_index: i
        })));

      if (error) throw error;
      setMessage({ type: 'success', text: 'Galeria de vídeos salva com sucesso!' });
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
          <h1 className="text-3xl font-bold font-montserrat">Galeria de Vídeos</h1>
          <p className="text-white/40 mt-1">Gerencie os vídeos do YouTube exibidos na galeria inferior.</p>
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
      <div className="grid grid-cols-1 gap-4">
        {videos.map((video, index) => (
          <div 
            key={video.id}
            className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative group"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
               {/* YouTube Preview */}
               <div className="w-full md:w-64 aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 relative">
                {video.video_id ? (
                  <img 
                    src={`https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`} 
                    alt={video.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10">
                    <Youtube className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                   <button 
                    onClick={() => handleChange(video.id, 'featured', !video.featured)}
                    className={`p-1.5 rounded-lg transition-all ${video.featured ? 'bg-yellow-500 text-black' : 'bg-black/60 text-white/40 hover:text-white'}`}
                    title={video.featured ? 'Destaque: Sim' : 'Marcar como destaque'}
                   >
                     <Star className="w-4 h-4" fill={video.featured ? 'currentColor' : 'none'} />
                   </button>
                </div>
              </div>

              {/* Data Fields */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-white/20 uppercase ml-1">Título do Vídeo</label>
                  <input 
                    type="text" 
                    value={video.title}
                    onChange={(e) => handleChange(video.id, 'title', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 mt-1 focus:border-[#0EA8A0] outline-none text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/20 uppercase ml-1">Artista</label>
                  <input 
                    type="text" 
                    value={video.artist}
                    onChange={(e) => handleChange(video.id, 'artist', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 mt-1 focus:border-[#0EA8A0] outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/20 uppercase ml-1">ID do Vídeo YouTube</label>
                  <input 
                    type="text" 
                    value={video.video_id}
                    onChange={(e) => handleChange(video.id, 'video_id', e.target.value)}
                    placeholder="Ex: XWBgmBsxkk4"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 mt-1 focus:border-[#0EA8A0] outline-none text-xs font-mono"
                  />
                </div>
                <div className="relative">
                  <label className="text-[10px] font-bold text-white/20 uppercase ml-1 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Visualizações
                  </label>
                  <input 
                    type="text" 
                    value={video.views}
                    onChange={(e) => handleChange(video.id, 'views', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 mt-1 focus:border-[#0EA8A0] outline-none text-xs"
                  />
                </div>
                <div className="relative">
                  <label className="text-[10px] font-bold text-white/20 uppercase ml-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Duração
                  </label>
                  <input 
                    type="text" 
                    value={video.duration}
                    onChange={(e) => handleChange(video.id, 'duration', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 mt-1 focus:border-[#0EA8A0] outline-none text-xs"
                  />
                </div>
              </div>

              {/* Order and Trash */}
              <div className="flex md:flex-col justify-between items-center gap-4 h-full md:pt-6">
                 <div className="text-white/10 cursor-move hidden md:block">
                   <GripVertical className="w-5 h-5" />
                 </div>
                 <button 
                  onClick={() => handleRemoveField(video.id)}
                  className="p-3 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/10 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="absolute top-2 left-2 text-[10px] bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-white/40 font-bold border border-white/5">
              #{index + 1}
            </div>
          </div>
        ))}

        <button 
          onClick={handleAddField}
          className="w-full py-8 border-2 border-dashed border-white/5 hover:border-[#0EA8A0]/30 hover:bg-[#0EA8A0]/5 rounded-3xl flex flex-col items-center justify-center gap-3 text-white/20 hover:text-[#0EA8A0] transition-all group"
        >
          <div className="p-3 rounded-full bg-white/5 group-hover:bg-[#0EA8A0]/10 transition-all">
            <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </div>
          <span className="font-bold">Adicionar Vídeo à Galeria</span>
        </button>
      </div>
    </div>
  );
}
