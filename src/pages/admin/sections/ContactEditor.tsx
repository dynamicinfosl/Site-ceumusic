import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../../utils/supabase';
import { clearContentCache } from '../../../utils/content';
import { Field, inputClass, LoadingPanel, MessageBanner, MoveButtons, PageHeader } from '../components/PanelControls';
import { describeSaveError, useOrderedList } from '../components/useOrderedList';

interface ContactRow {
  id: string;
  type: string;
  value: string;
}

interface SocialRow {
  id: string;
  name: string;
  url: string;
  icon: string | null;
  color: string | null;
  followers: string | null;
  order_index: number;
}

export default function ContactEditor() {
  const socials = useOrderedList<SocialRow>({
    table: 'social_links',
    successText: 'Contato e redes sociais salvos.',
    validate: (rows) => (rows.some((social) => !social.name.trim() || !social.url.trim()) ? 'Preencha o nome e o link de todas as redes sociais.' : null),
  });
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [savingContacts, setSavingContacts] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('contact_info')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          socials.setMessage({ type: 'error', text: `Não foi possível carregar: ${error.message}` });
        } else {
          setContacts(data ?? []);
        }
        setLoadingContacts(false);
      });
    // Carrega só ao abrir a tela
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const valueOf = (type: string) => contacts.find((contact) => contact.type === type)?.value ?? '';

  const handleContactChange = (type: string, value: string) => {
    setContacts((current) =>
      current.some((contact) => contact.type === type)
        ? current.map((contact) => (contact.type === type ? { ...contact, value } : contact))
        : [...current, { id: crypto.randomUUID(), type, value }]
    );
  };

  const handleSave = async () => {
    if (!supabase) return;
    setSavingContacts(true);
    socials.setMessage(null);
    const { error } = await supabase.from('contact_info').upsert(contacts);
    if (error) {
      socials.setMessage({ type: 'error', text: describeSaveError(error) });
    } else {
      clearContentCache();
      await socials.save();
    }
    setSavingContacts(false);
  };

  if (socials.loading || loadingContacts) return <LoadingPanel />;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <PageHeader title="Contato e redes sociais" description="Os dados aparecem no site inteiro, inclusive nas páginas legais." saving={socials.saving || savingContacts} onSave={handleSave} />
      <MessageBanner message={socials.message} />

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <section className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold">Informações de contato</h2>
          <Field label="E-mail" hint="Também recebe as mensagens do formulário de contato.">
            <input type="email" value={valueOf('email')} onChange={(event) => handleContactChange('email', event.target.value)} className={inputClass} />
          </Field>
          <Field label="Telefone / WhatsApp">
            <input type="tel" value={valueOf('phone')} onChange={(event) => handleContactChange('phone', event.target.value)} className={inputClass} />
          </Field>
          <Field label="Endereço" hint="O mapa da página de contato acompanha este endereço.">
            <input type="text" value={valueOf('address')} onChange={(event) => handleContactChange('address', event.target.value)} className={inputClass} />
          </Field>
        </section>

        <section className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold">Redes sociais da Céu Music</h2>
          {socials.items.map((social, index) => (
            <div key={social.id} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Field label="Nome">
                    <input type="text" value={social.name} onChange={(event) => socials.update(social.id, { name: event.target.value })} placeholder="Ex: Instagram" className={inputClass} />
                  </Field>
                </div>
                <MoveButtons label={social.name} isFirst={index === 0} isLast={index === socials.items.length - 1} onMove={(direction) => socials.move(social.id, direction)} />
                <button type="button" aria-label={`Remover ${social.name}`} onClick={() => socials.remove(social.id, social.name)} className="p-1.5 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <Field label="Link do perfil">
                <input type="url" value={social.url} onChange={(event) => socials.update(social.id, { url: event.target.value })} className={inputClass} />
              </Field>
            </div>
          ))}
          <button
            type="button"
            onClick={() => socials.add({ id: crypto.randomUUID(), name: '', url: '', icon: 'ri-link', color: '#0EA8A0', followers: null, order_index: socials.items.length })}
            className="w-full py-3 border-2 border-dashed border-white/10 hover:border-[#0EA8A0]/30 rounded-xl text-sm text-white/50 hover:text-[#0EA8A0] flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar rede social
          </button>
        </section>
      </div>
    </div>
  );
}
