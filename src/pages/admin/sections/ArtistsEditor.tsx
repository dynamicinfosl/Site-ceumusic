import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase';
import { 
  Plus, 
  Trash2, 
  Save, 
  Instagram, 
  Youtube, 
  Music, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  Search,
  Globe,
  Users
} from 'lucide-react';

import MediaUpload from '../components/MediaUpload';

interface Artist {
  id: string;
  name: string;
  genre: string;
  bio: string;
  image_url: string;
  instagram?: string;
  spotify?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
  facebook?: string;
}

export default function ArtistsEditor() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchArtists();
  }, []);

  async function fetchArtists() {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setArtists(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar artistas:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddArtist = () => {
    const newArtist: Artist = {
      id: crypto.randomUUID(),
      name: '',
      genre: 'Gospel/CCM',
      bio: '',
      image_url: ''
    };
    setArtists([newArtist, ...artists]);
  };

  const handleDeleteArtist = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o artista "${name || 'este artista'}"?`)) return;
    
    if (!supabase) return;
    try {
      const { error } = await supabase.from('artists').delete().eq('id', id);
      if (error) throw error;
      setArtists(artists.filter(a => a.id !== id));
      setMessage({ type: 'success', text: 'Artista excluído com sucesso!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Erro ao excluir: ' + err.message });
    }
  };

  const handleChange = (id: string, field: keyof Artist, value: string) => {
    setArtists(artists.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleSave = async (artist: Artist) => {
    if (!supabase) return;
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.from('artists').upsert(artist);
      if (error) throw error;
      setMessage({ type: 'success', text: `Artista "${artist.name}" salvo com sucesso!` });
      fetchArtists();
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Erro ao salvar: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const filteredArtists = artists.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold font-montserrat">Gerenciar Artistas</h1>
          <p className="text-white/40 mt-1">Cadastre e edite os perfis dos artistas do selo.</p>
        </div>
        <button
          onClick={handleAddArtist}
          className="bg-[#0EA8A0] hover:bg-[#0EA8A0]/90 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo Artista
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
        <input 
          type="text" 
          placeholder="Buscar artista por nome ou gênero..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:border-[#0EA8A0] transition-all outline-none"
        />
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredArtists.map((artist) => (
          <div 
            key={artist.id}
            className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden group"
          >
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Photo & Basic Info */}
              <div className="lg:col-span-3 space-y-4">
                <MediaUpload 
                  onUploadComplete={(url) => handleChange(artist.id, 'image_url', url)}
                  currentUrl={artist.image_url}
                  type="image"
                  path="artists"
                  label="Foto do Artista"
                />
                
                <div className="pt-2 border-t border-white/5">
                  <input 
                    type="url"
                    placeholder="Ou use uma URL externa"
                    value={artist.image_url}
                    onChange={(e) => handleChange(artist.id, 'image_url', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-[10px] focus:border-[#0EA8A0] outline-none"
                  />
                </div>
              </div>

              {/* Details & Bio */}
              <div className="lg:col-span-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-white/20 uppercase ml-1">Nome do Artista</label>
                    <input 
                      type="text"
                      placeholder="Nome Artístico"
                      value={artist.name}
                      onChange={(e) => handleChange(artist.id, 'name', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:border-[#0EA8A0] outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-white/20 uppercase ml-1">Gênero Musical</label>
                    <input 
                      type="text"
                      placeholder="Ex: Pop Gospel, Adoração"
                      value={artist.genre}
                      onChange={(e) => handleChange(artist.id, 'genre', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:border-[#0EA8A0] outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/20 uppercase ml-1">Biografia / Descrição</label>
                  <textarea 
                    rows={4}
                    placeholder="Conte um pouco sobre a trajetória do artista..."
                    value={artist.bio}
                    onChange={(e) => handleChange(artist.id, 'bio', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:border-[#0EA8A0] outline-none text-sm resize-none"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="lg:col-span-4 space-y-3">
                <label className="text-[10px] font-bold text-white/20 uppercase ml-1">Redes Sociais & Links</label>
                <div className="grid grid-cols-1 gap-2">
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500" />
                    <input 
                      type="url" placeholder="Instagram URL" value={artist.instagram}
                      onChange={(e) => handleChange(artist.id, 'instagram', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs focus:border-pink-500 outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                    <input 
                      type="url" placeholder="Spotify URL" value={artist.spotify}
                      onChange={(e) => handleChange(artist.id, 'spotify', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs focus:border-green-500 outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                    <input 
                      type="url" placeholder="YouTube URL" value={artist.youtube}
                      onChange={(e) => handleChange(artist.id, 'youtube', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs focus:border-red-500 outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0EA8A0]" />
                    <input 
                      type="url" placeholder="TikTok URL" value={artist.tiktok}
                      onChange={(e) => handleChange(artist.id, 'tiktok', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs focus:border-[#0EA8A0] outline-none"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-4">
                  <button 
                    onClick={() => handleSave(artist)}
                    disabled={saving}
                    className="flex-1 bg-white/5 hover:bg-[#0EA8A0]/20 hover:text-[#0EA8A0] border border-white/10 hover:border-[#0EA8A0]/30 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Salvar Artista
                  </button>
                  <button 
                    onClick={() => handleDeleteArtist(artist.id, artist.name)}
                    className="p-2.5 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredArtists.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <Users className="w-12 h-12 text-white/5 mx-auto mb-4" />
            <p className="text-white/20">Nenhum artista encontrado com essa busca.</p>
          </div>
        )}
      </div>
    </div>
  );
}
