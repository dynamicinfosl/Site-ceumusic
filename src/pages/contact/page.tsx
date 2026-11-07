import { useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { phoneHref, useContactInfo, useSettings, useSocialLinks } from '../../utils/content';

export default function ContactPage() {
  const socialLinks = useSocialLinks();
  const contact = useContactInfo();
  const settings = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Configurações do EmailJS - Substitua pelos seus valores
  // Para obter essas credenciais, acesse: https://www.emailjs.com/
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

  // Verificar se as credenciais estão configuradas (apenas em desenvolvimento)
  if (import.meta.env.DEV) {
    if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || 
        EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || 
        EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      console.warn('⚠️ EmailJS não configurado! Verifique o arquivo .env');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    
    try {
      // Inicializar EmailJS
      emailjs.init(EMAILJS_PUBLIC_KEY);

      // Preparar os dados do template
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || 'Não informado',
        subject: formData.subject,
        message: formData.message,
        to_email: contact.email,
      };

      // Enviar email
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      // Sucesso
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      // Resetar status após 5 segundos
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error: unknown) {
      // O detalhe técnico fica no console; o visitante recebe só o que precisa fazer
      console.error('Erro ao enviar email:', error);
      setIsSubmitting(false);
      setSubmitStatus('error');
      setErrorMessage(`Tente novamente em alguns instantes ou escreva para ${contact.email}.`);

      // Resetar status de erro após 8 segundos
      setTimeout(() => {
        setSubmitStatus('idle');
        setErrorMessage('');
      }, 8000);
    }
  };

  // Função para formatar telefone brasileiro
  const formatPhone = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (celular) ou 10 dígitos (fixo)
    const limitedNumbers = numbers.slice(0, 11);
    
    // Aplica a máscara
    if (limitedNumbers.length <= 10) {
      // Telefone fixo: (XX) XXXX-XXXX
      return limitedNumbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      // Celular: (XX) XXXXX-XXXX
      return limitedNumbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Aplica formatação apenas para o campo de telefone
    if (name === 'phone') {
      const formattedPhone = formatPhone(value);
      setFormData({
        ...formData,
        [name]: formattedPhone
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const mapsQuery = encodeURIComponent(contact.address);
  const contactInfo = [
    {
      icon: 'ri-mail-fill',
      title: 'Email',
      value: contact.email,
      link: `mailto:${contact.email}`,
      color: '#0EA8A0'
    },
    {
      icon: 'ri-phone-fill',
      title: 'Telefone',
      value: contact.phone,
      link: phoneHref(contact.phone),
      color: '#C45C2F'
    },
    {
      icon: 'ri-map-pin-fill',
      title: 'Endereço',
      value: contact.address,
      link: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
      color: '#C45C2F'
    }
  ];

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-44 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: settings?.page_background ? `url('${settings.page_background}')` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            objectPosition: 'top'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            Entre em contato
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Estamos prontos para ouvir você. Entre em contato para parcerias, dúvidas ou oportunidades
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative py-20 bg-gradient-to-b from-black to-[#1A1A1A]">
        
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#0EA8A0]/10 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                target={info.link.startsWith('http') ? '_blank' : undefined}
                rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-[#141414] border border-white/10 hover:border-[#0EA8A0]/50 transition-all duration-500 p-6">
                  <div 
                    className="w-14 h-14 flex items-center justify-center rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 shadow-lg"
                    style={{
                      backgroundColor: `${info.color}20`,
                    }}
                  >
                    <i className={`${info.icon} text-2xl`} style={{ color: info.color }}></i>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">
                    {info.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {info.value}
                  </p>

                </div>
              </a>
            ))}
          </div>

          {/* Contact Form & Map */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-8">
                Envie uma mensagem
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-white/80 text-sm font-semibold mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#0EA8A0]/50 focus:bg-white/10 transition-all duration-300 text-sm"
                    placeholder="Seu nome"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-white/80 text-sm font-semibold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#0EA8A0]/50 focus:bg-white/10 transition-all duration-300 text-sm"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-white/80 text-sm font-semibold mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={15}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#0EA8A0]/50 focus:bg-white/10 transition-all duration-300 text-sm"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-white/80 text-sm font-semibold mb-2">
                    Assunto
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-8 bg-[#0A0A0A] border border-white/20 rounded-xl text-white focus:outline-none focus:border-[#0EA8A0]/50 focus:bg-[#0A0A0A] transition-all duration-300 text-sm cursor-pointer appearance-none"
                    style={{ 
                      backgroundColor: '#0A0A0A',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '12px'
                    }}
                  >
                    <option value="" style={{ backgroundColor: '#0A0A0A', color: '#ffffff' }}>Selecione um assunto</option>
                    {(settings?.contact_subjects ?? []).map((subject) => (
                      <option key={subject} value={subject} style={{ backgroundColor: '#0A0A0A', color: '#ffffff' }}>{subject}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-white/80 text-sm font-semibold mb-2">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    maxLength={500}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#0EA8A0]/50 focus:bg-white/10 transition-all duration-300 resize-none text-sm"
                    placeholder="Escreva sua mensagem aqui... (máximo 500 caracteres)"
                  />
                  <p className="text-white/40 text-xs mt-2">
                    {formData.message.length}/500 caracteres
                  </p>
                </div>

                <p className="text-white/60 text-xs leading-relaxed">
                  Usamos seus dados para responder ao seu contato. Saiba mais na{' '}
                  <Link to="/privacidade" className="text-[#0EA8A0] underline underline-offset-2 hover:text-white">
                    Política de Privacidade
                  </Link>
                  .
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-[#0EA8A0] hover:bg-[#0EA8A0]/85 text-black font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center space-x-2">
                      <i className="ri-loader-4-line animate-spin"></i>
                      <span>Enviando...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <span>Enviar mensagem</span>
                      <i className="ri-send-plane-fill"></i>
                    </span>
                  )}
                </button>

                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-[#0EA8A0]/20 border border-[#0EA8A0]/30 rounded-xl flex items-center space-x-3">
                    <i className="ri-checkbox-circle-fill text-2xl text-[#0EA8A0]"></i>
                    <p className="text-white text-sm">
                      Mensagem enviada com sucesso! Entraremos em contato em breve.
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-start space-x-3">
                    <i className="ri-error-warning-fill text-2xl text-red-500 flex-shrink-0 mt-0.5"></i>
                    <div>
                      <p className="text-white text-sm font-semibold mb-1">
                        Erro ao enviar mensagem
                      </p>
                      <p className="text-white/80 text-sm">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Map */}
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-8">
                Nossa localização
              </h2>
              <div className="relative overflow-hidden rounded-2xl border border-white/10 h-[400px] lg:h-full">
                {contact.address && (
                  <iframe
                    src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização Céu Music"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0EA8A0]/10 to-[#C45C2F]/10 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#1A1A1A] to-black">
        
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#C45C2F]/10 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Siga-nos nas redes sociais
          </h2>
          <p className="text-white/70 text-lg mb-12 max-w-2xl mx-auto">
            Acompanhe nossos artistas e fique por dentro de todas as novidades
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="group cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-full border border-white/10 hover:border-[#0EA8A0]/50 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-110">
                  <i 
                    className={`${social.icon} text-3xl text-white/60 group-hover:text-[#0EA8A0] transition-colors duration-300`}
                  ></i>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}