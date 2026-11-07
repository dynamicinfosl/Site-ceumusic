import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../../utils/supabase';
import { clearContentCache, fetchSettings, type AboutPageContent } from '../../../utils/content';
import MediaUpload from '../components/MediaUpload';
import { Field, inputClass, LoadingPanel, MessageBanner, MoveButtons, PageHeader } from '../components/PanelControls';
import { describeSaveError, saveSetting, type PanelMessage } from '../components/useOrderedList';

interface HomeAbout {
  id?: string;
  title: string;
  content: string;
  image_url: string | null;
}

const EMPTY_PAGE: AboutPageContent = {
  intro: '', story: '', mission_title: '', mission_text: '', card_title: '', card_text: '',
  values_title: '', values_text: '', values: [], vision_title: '', vision_text: '',
};

export default function AboutEditor() {
  const [home, setHome] = useState<HomeAbout>({ title: '', content: '', image_url: '' });
  const [page, setPage] = useState<AboutPageContent>(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<PanelMessage | null>(null);

  useEffect(() => {
    async function load() {
      if (!supabase) return;
      try {
        clearContentCache();
        const [homeResult, settings] = await Promise.all([supabase.from('about_section').select('*').limit(1).maybeSingle(), fetchSettings()]);
        if (homeResult.error) throw homeResult.error;
        if (homeResult.data) setHome(homeResult.data);
        if (settings.about_page) setPage({ ...EMPTY_PAGE, ...settings.about_page });
      } catch (error) {
        setMessage({ type: 'error', text: `Não foi possível carregar: ${(error as Error).message}` });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!supabase) return;
    setSaving(true);
    setMessage(null);
    try {
      const { data, error } = await supabase
        .from('about_section')
        .upsert({ ...home, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (error) throw error;
      setHome(data);
      await saveSetting('about_page', page);
      setMessage({ type: 'success', text: 'Textos da seção Sobre salvos.' });
    } catch (error) {
      setMessage({ type: 'error', text: describeSaveError(error as { code?: string; message?: string }) });
    } finally {
      setSaving(false);
    }
  };

  const setField = (field: keyof AboutPageContent, value: string) => setPage((current) => ({ ...current, [field]: value }));

  const moveValue = (index: number, direction: -1 | 1) => {
    const next = [...page.values];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    setPage({ ...page, values: next });
  };

  if (loading) return <LoadingPanel />;

  const cardClass = 'bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <PageHeader title="Sobre" description="O resumo da página inicial e a página “Nossa história”." saving={saving} onSave={handleSave} />
      <MessageBanner message={message} />

      <section className={cardClass}>
        <h2 className="text-xl font-bold">Resumo na página inicial</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Field label="Título">
              <input type="text" value={home.title} onChange={(event) => setHome({ ...home, title: event.target.value })} className={inputClass} />
            </Field>
            <Field label="Texto">
              <textarea rows={9} value={home.content} onChange={(event) => setHome({ ...home, content: event.target.value })} className={`${inputClass} resize-y`} />
            </Field>
          </div>
          <div className="space-y-4">
            <MediaUpload onUploadComplete={(url) => setHome({ ...home, image_url: url })} currentUrl={home.image_url ?? ''} type="image" path="about" label="Imagem (sem imagem, usamos a logo)" />
            <Field label="Ou cole o link da imagem">
              <input type="url" value={home.image_url ?? ''} onChange={(event) => setHome({ ...home, image_url: event.target.value })} className={inputClass} />
            </Field>
          </div>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-bold">Página “Nossa história”</h2>
        <Field label="Frase de abertura">
          <textarea rows={2} value={page.intro} onChange={(event) => setField('intro', event.target.value)} className={`${inputClass} resize-y`} />
        </Field>
        <Field label="Texto abaixo da logo">
          <textarea rows={5} value={page.story} onChange={(event) => setField('story', event.target.value)} className={`${inputClass} resize-y`} />
        </Field>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-bold">Missão</h2>
        <Field label="Título">
          <input type="text" value={page.mission_title} onChange={(event) => setField('mission_title', event.target.value)} className={inputClass} />
        </Field>
        <Field label="Texto" hint="Deixe uma linha em branco para separar parágrafos.">
          <textarea rows={7} value={page.mission_text} onChange={(event) => setField('mission_text', event.target.value)} className={`${inputClass} resize-y`} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Título do destaque">
            <input type="text" value={page.card_title} onChange={(event) => setField('card_title', event.target.value)} className={inputClass} />
          </Field>
          <Field label="Texto do destaque">
            <input type="text" value={page.card_text} onChange={(event) => setField('card_text', event.target.value)} className={inputClass} />
          </Field>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-bold">Valores</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Título">
            <input type="text" value={page.values_title} onChange={(event) => setField('values_title', event.target.value)} className={inputClass} />
          </Field>
          <Field label="Subtítulo">
            <input type="text" value={page.values_text} onChange={(event) => setField('values_text', event.target.value)} className={inputClass} />
          </Field>
        </div>
        {page.values.map((value, index) => (
          <div key={index} className="p-4 bg-white/5 rounded-xl space-y-2">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Field label="Nome do valor">
                  <input
                    type="text"
                    value={value.title}
                    onChange={(event) => setPage({ ...page, values: page.values.map((item, i) => (i === index ? { ...item, title: event.target.value } : item)) })}
                    className={inputClass}
                  />
                </Field>
              </div>
              <MoveButtons label={value.title} isFirst={index === 0} isLast={index === page.values.length - 1} onMove={(direction) => moveValue(index, direction)} />
              <button type="button" aria-label={`Remover ${value.title}`} onClick={() => setPage({ ...page, values: page.values.filter((_, i) => i !== index) })} className="p-1.5 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <Field label="Descrição">
              <textarea
                rows={2}
                value={value.description}
                onChange={(event) => setPage({ ...page, values: page.values.map((item, i) => (i === index ? { ...item, description: event.target.value } : item)) })}
                className={`${inputClass} resize-y`}
              />
            </Field>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setPage({ ...page, values: [...page.values, { icon: 'ri-star-fill', title: '', description: '' }] })}
          className="w-full py-3 border-2 border-dashed border-white/10 hover:border-[#0EA8A0]/30 rounded-xl text-sm text-white/50 hover:text-[#0EA8A0] flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar valor
        </button>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-bold">Visão de futuro</h2>
        <Field label="Título">
          <input type="text" value={page.vision_title} onChange={(event) => setField('vision_title', event.target.value)} className={inputClass} />
        </Field>
        <Field label="Texto" hint="Deixe uma linha em branco para separar parágrafos.">
          <textarea rows={6} value={page.vision_text} onChange={(event) => setField('vision_text', event.target.value)} className={`${inputClass} resize-y`} />
        </Field>
      </section>
    </div>
  );
}
