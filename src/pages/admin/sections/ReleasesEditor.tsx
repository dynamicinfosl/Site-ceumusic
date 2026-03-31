import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase';
import { 
  Plus, 
  Trash2, 
  Save, 
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle2,
  GripVertical
} from 'lucide-react';
import MediaUpload from '../components/MediaUpload';

interface Release {
  id: string;
  title: string;
  artist_name: string;
  cover_url: string;
  release_type: string;
  release_date: string;
  streaming_link: string;
  order_index: number;
}

export default function ReleasesEditor() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchReleases();
  }, []);

  async function fetchReleases() {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setReleases(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar lançamentos:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddField = () => {
    const newRelease: Release = {
      id: crypto.randomUUID(),
      title: '',
      artist_name: '',
      cover_url: '',
      release_type: 'Single',
      release_date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      streaming_link: '',
      order_index: releases.length
    };
    setReleases([...releases, newRelease]);
  };

  const handleChange = (id: string, field: keyof Release, value: string) => {
    setReleases(releases.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleRemoveField = (id: string) => {
    setReleases(releases.filter(r => r.id !== id));
  };

  const handleSave = async () => {
    if (!supabase) return;
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('releases')
        .upsert(releases.map((r, i) => ({
          ...r,
          order_index: i
        })));

      if (error) throw error;
      setMessage({ type: 'success', text: 'Lançamentos salvos com sucesso!' });
      fetchReleases();
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
          <h1 className="text-3xl font-bold font-montserrat">Gerenciar Lançamentos</h1>
          <p className="text-white/40 mt-1">Controle a galeria de novas músicas e álbuns no site.</p>
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

      {/* Grid of Releases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {releases.map((release, _index) => (
          <div 
            key={release.id}
            className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative group flex flex-col h-full"
          >
            <div className="flex items-start gap-4 flex-1">
              {/* Cover Preview */}
              <div className="w-24 sm:w-32 shrink-0">
                <MediaUpload 
                  onUploadComplete={(url) => handleChange(release.id, 'cover_url', url)}
                  currentUrl={release.cover_url}
                  type="image"
                  path="releases"
                  label="Capa"
                />
              </div>

              {/* Basic Fields */}
              <div className="flex-1 space-y-3">
                <input 
                  type="text" 
                  placeholder="Título do Lançamento" 
                  value={release.title}
                  onChange={(e) => handleChange(release.id, 'title', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-sm font-bold focus:border-[#0EA8A0] outline-none"
                />
                <input 
                  type="text" 
                  placeholder="Nome do Artista" 
                  value={release.artist_name}
                  onChange={(e) => handleChange(release.id, 'artist_name', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-xs focus:border-[#0EA8A0] outline-none"
                />
                <div className="flex gap-2">
                  <select 
                    value={release.release_type}
                    onChange={(e) => handleChange(release.id, 'release_type', e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg py-1.5 px-2 text-[10px] focus:border-[#0EA8A0] outline-none uppercase font-bold"
                  >
                    <option value="Single">Single</option>
                    <option value="EP">EP</option>
                    <option value="Álbum">Álbum</option>
                    <option value="Clipe">Clipe</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="Data (ex: 20 Jan 2024)" 
                    value={release.release_date}
                    onChange={(e) => handleChange(release.id, 'release_date', e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-[10px] focus:border-[#0EA8A0] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* URL Fields */}
            <div className="mt-6 space-y-3">
                <div className="pt-2 border-t border-white/5">
                  <input 
                    type="url" 
                    placeholder="Ou use uma URL externa" 
                    value={release.cover_url}
                    onChange={(e) => handleChange(release.id, 'cover_url', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-[10px] focus:border-[#0EA8A0] outline-none"
                  />
                </div>
              <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="url" 
                  placeholder="Link de Streaming / Vídeo" 
                  value={release.streaming_link}
                  onChange={(e) => handleChange(release.id, 'streaming_link', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs focus:border-[#0EA8A0] outline-none"
                />
              </div>
            </div>

            {/* Remove Button */}
            <button 
              onClick={() => handleRemoveField(release.id)}
              className="absolute top-4 right-4 p-2 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="absolute top-4 left-4 p-2 text-white/10 cursor-move">
              <GripVertical className="w-4 h-4" />
            </div>
          </div>
        ))}

        <button 
          onClick={handleAddField}
          className="border-2 border-dashed border-white/5 hover:border-[#0EA8A0]/30 hover:bg-[#0EA8A0]/5 rounded-2xl flex items-center justify-center gap-2 text-white/20 hover:text-[#0EA8A0] transition-all group min-h-[200px]"
        >
          <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
          Novo Lançamento
        </button>
      </div>
    </div>
  );
}
