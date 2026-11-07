import { useEffect, useState } from 'react';
import { clearContentCache, fetchSettings, type LegalSettings } from '../../../utils/content';
import MediaUpload from '../components/MediaUpload';
import { Field, inputClass, LoadingPanel, MessageBanner, PageHeader } from '../components/PanelControls';
import { describeSaveError, saveSetting, type PanelMessage } from '../components/useOrderedList';

export default function SettingsEditor() {
  const [footerText, setFooterText] = useState('');
  const [subjects, setSubjects] = useState('');
  const [background, setBackground] = useState('');
  const [legal, setLegal] = useState<LegalSettings>({ legal_name: '', cnpj: '', dpo_name: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<PanelMessage | null>(null);

  useEffect(() => {
    clearContentCache();
    fetchSettings()
      .then((settings) => {
        setFooterText(settings.footer_text ?? '');
        setSubjects((settings.contact_subjects ?? []).join('\n'));
        setBackground(settings.page_background ?? '');
        if (settings.legal) setLegal(settings.legal);
      })
      .catch((error) => setMessage({ type: 'error', text: `Não foi possível carregar: ${error.message}` }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await saveSetting('footer_text', footerText);
      await saveSetting('contact_subjects', subjects.split('\n').map((subject) => subject.trim()).filter(Boolean));
      await saveSetting('page_background', background);
      await saveSetting('legal', legal);
      setMessage({ type: 'success', text: 'Configurações salvas.' });
    } catch (error) {
      setMessage({ type: 'error', text: describeSaveError(error as { code?: string; message?: string }) });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingPanel />;

  const cardClass = 'bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4';

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <PageHeader title="Configurações do site" description="Textos gerais e dados da empresa." saving={saving} onSave={handleSave} />
      <MessageBanner message={message} />

      <section className={cardClass}>
        <h2 className="text-xl font-bold">Rodapé</h2>
        <Field label="Texto sobre a Céu Music">
          <textarea rows={3} value={footerText} onChange={(event) => setFooterText(event.target.value)} className={`${inputClass} resize-y`} />
        </Field>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-bold">Formulário de contato</h2>
        <Field label="Assuntos" hint="Um por linha.">
          <textarea rows={6} value={subjects} onChange={(event) => setSubjects(event.target.value)} className={`${inputClass} resize-y`} />
        </Field>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-bold">Imagem de fundo</h2>
        <p className="text-sm text-white/50">Aparece no topo das páginas de lançamentos e de contato.</p>
        <MediaUpload onUploadComplete={setBackground} currentUrl={background} type="image" path="site" label="Imagem" />
        <Field label="Ou cole o link da imagem">
          <input type="text" value={background} onChange={(event) => setBackground(event.target.value)} className={inputClass} />
        </Field>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-bold">Dados da empresa</h2>
        <p className="text-sm text-white/50">Aparecem na Política de Privacidade. Campos vazios não são exibidos.</p>
        <Field label="Razão social">
          <input type="text" value={legal.legal_name} onChange={(event) => setLegal({ ...legal, legal_name: event.target.value })} className={inputClass} />
        </Field>
        <Field label="CNPJ">
          <input type="text" value={legal.cnpj} onChange={(event) => setLegal({ ...legal, cnpj: event.target.value })} className={inputClass} />
        </Field>
        <Field label="Encarregado de dados (LGPD)">
          <input type="text" value={legal.dpo_name} onChange={(event) => setLegal({ ...legal, dpo_name: event.target.value })} className={inputClass} />
        </Field>
      </section>
    </div>
  );
}
