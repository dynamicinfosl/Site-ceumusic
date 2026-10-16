import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase';
import { 
  Save, 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Youtube, 
  Music, 
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface ContactInfo {
  id: string;
  type: string;
  value: string;
}

interface socialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  followers: string;
}

export default function ContactEditor() {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [socials, setSocials] = useState<socialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    if (!supabase) return;
    try {
      const [contactRes, socialRes] = await Promise.all([
        supabase.from('contact_info').select('*'),
        supabase.from('social_links').select('*').order('order_index', { ascending: true })
      ]);

      if (contactRes.error) throw contactRes.error;
      if (socialRes.error) throw socialRes.error;

      setContacts(contactRes.data || []);
      setSocials(socialRes.data || []);
    } catch (err: any) {
      console.error('Erro ao buscar dados de contato:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleContactChange = (type: string, value: string) => {
    const existing = contacts.find(c => c.type === type);
    if (existing) {
      setContacts(contacts.map(c => c.type === type ? { ...c, value } : c));
    } else {
      setContacts([...contacts, { id: crypto.randomUUID(), type, value }]);
    }
  };

  const handleSocialChange = (id: string, field: keyof socialLink, value: string) => {
    setSocials(socials.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = async () => {
    if (!supabase) return;
    setSaving(true);
    setMessage(null);

    try {
      const [contactError, socialError] = await Promise.all([
        supabase.from('contact_info').upsert(contacts),
        supabase.from('social_links').upsert(socials)
      ]);

      if (contactError.error) throw contactError.error;
      if (socialError.error) throw socialError.error;

      setMessage({ type: 'success', text: 'Dados de contato e redes sociais salvos!' });
      fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Erro ao salvar: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const getContactValue = (type: string) => contacts.find(c => c.type === type)?.value || '';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#0EA8A0]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-montserrat">Contato & Redes Sociais</h1>
          <p className="text-white/40 mt-1">Gerencie as informações globais de contato e links do selo.</p>
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

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-[#0EA8A0]" />
            Informações de Contato
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-white/20 uppercase ml-1 flex items-center gap-1">
                <Mail className="w-3 h-3" /> E-mail de Contato
              </label>
              <input 
                type="email" 
                value={getContactValue('email')}
                onChange={(e) => handleContactChange('email', e.target.value)}
                placeholder="ceumusicbrasil@gmail.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mt-1 focus:border-[#0EA8A0] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-white/20 uppercase ml-1 flex items-center gap-1">
                <Phone className="w-3 h-3" /> Telefone / WhatsApp
              </label>
              <input 
                type="text" 
                value={getContactValue('phone')}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                placeholder="(21) 98244-7141"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mt-1 focus:border-[#0EA8A0] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-white/20 uppercase ml-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Endereço / Localização
              </label>
              <input 
                type="text" 
                value={getContactValue('address')}
                onChange={(e) => handleContactChange('address', e.target.value)}
                placeholder="Rio de Janeiro, RJ - Brasil"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mt-1 focus:border-[#0EA8A0] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-[#C45C2F]" />
            Redes Sociais Globais
          </h2>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
            {socials.length === 0 && (
              <p className="text-white/20 text-sm text-center py-10 italic">Nenhum link social cadastrado ainda.</p>
            )}
            {socials.map((social) => (
              <div key={social.id} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      {social.name === 'Instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
                      {social.name === 'YouTube' && <Youtube className="w-4 h-4 text-red-500" />}
                      {social.name === 'Spotify' && <Music className="w-4 h-4 text-green-500" />}
                      {social.name === 'TikTok' && <Globe className="w-4 h-4 text-[#0EA8A0]" />}
                      <span className="font-bold text-xs">{social.name}</span>
                   </div>
                   <input 
                    type="text" 
                    value={social.followers}
                    onChange={(e) => handleSocialChange(social.id, 'followers', e.target.value)}
                    placeholder="21K"
                    className="w-16 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-[10px] text-center focus:border-[#0EA8A0] outline-none"
                   />
                </div>
                <input 
                  type="url" 
                  value={social.url}
                  onChange={(e) => handleSocialChange(social.id, 'url', e.target.value)}
                  placeholder="Link do Perfil"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs focus:border-[#0EA8A0] outline-none"
                />
              </div>
            ))}
            
            {socials.length < 4 && (
               <button 
                onClick={() => setSocials([...socials, { id: crypto.randomUUID(), name: 'Nova Rede', url: '', icon: 'ri-global-line', color: '#0EA8A0', followers: '0' }])}
                className="w-full py-2 border border-dashed border-white/10 rounded-lg text-[10px] text-white/20 hover:text-white transition-all uppercase font-bold"
               >
                 Adicionar Rede Social
               </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
