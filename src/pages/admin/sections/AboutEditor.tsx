import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase';
import { 
  Save, 
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import MediaUpload from '../components/MediaUpload';

interface AboutData {
  id?: string;
  title: string;
  content: string;
  image_url: string;
}

export default function AboutEditor() {
  const [data, setData] = useState<AboutData>({ title: '', content: '', image_url: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    if (!supabase) return;
    try {
      const { data: aboutData, error } = await supabase
        .from('about_section')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows"
      if (aboutData) setData(aboutData);
    } catch (err: any) {
      console.error('Erro ao buscar sobre:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    if (!supabase) return;
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('about_section')
        .upsert({
          ...data,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Seção Sobre salva com sucesso!' });
      fetchData();
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
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:items-center sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-montserrat">Editor da Seção Sobre</h1>
          <p className="text-white/40 mt-1">Conte a história da Céu Music para o mundo.</p>
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

      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="text-xs font-medium text-white/40 ml-1 uppercase">Título da Seção</label>
              <input 
                type="text" 
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="Ex: Sobre Nós"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mt-1 focus:border-[#0EA8A0] transition-all outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-white/40 ml-1 uppercase">História / Conteúdo</label>
              <textarea 
                rows={10}
                value={data.content}
                onChange={(e) => setData({ ...data, content: e.target.value })}
                placeholder="Escreva aqui a história do selo..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mt-1 focus:border-[#0EA8A0] transition-all outline-none text-sm resize-none"
              />
            </div>
          </div>

          <div className="space-y-6">
            <MediaUpload 
              onUploadComplete={(url) => setData({ ...data, image_url: url })}
              currentUrl={data.image_url}
              type="image"
              path="about"
              label="Imagem Lateral (Upload R2)"
            />
            
            <div className="pt-4 border-t border-white/5">
              <label className="text-[10px] font-medium text-white/20 ml-1 uppercase">Ou insira uma URL externa</label>
              <input 
                type="url" 
                value={data.image_url}
                onChange={(e) => setData({ ...data, image_url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 mt-1 focus:border-[#0EA8A0] transition-all outline-none text-[12px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
