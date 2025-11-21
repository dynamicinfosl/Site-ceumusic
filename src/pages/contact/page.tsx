import { useState } from 'react';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envio
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: 'ri-mail-fill',
      title: 'Email',
      value: 'contato@ceumusicbr.com',
      link: 'mailto:contato@ceumusicbr.com',
      color: '#0EA8A0'
    },
    {
      icon: 'ri-phone-fill',
      title: 'Telefone',
      value: '(21) 98244-7141',
      link: 'tel:+5521982447141',
      color: '#C45C2F'
    },
    {
      icon: 'ri-whatsapp-fill',
      title: 'WhatsApp',
      value: '+55 (11) 98765-4321',
      link: 'https://wa.me/5511987654321',
      color: '#25D366'
    },
    {
      icon: 'ri-map-pin-fill',
      title: 'Endereço',
      value: 'Rio de Janeiro, RJ',
      link: 'https://maps.google.com',
      color: '#A34528'
    }
  ];

  const socialLinks = [
    { icon: 'ri-instagram-fill', url: 'https://www.instagram.com/ceumusicbr/', color: '#E4405F', name: 'Instagram' },
    { icon: 'ri-youtube-fill', url: 'https://www.youtube.com/@ceumusicbrasil', color: '#FF0000', name: 'YouTube' },
    { icon: 'ri-spotify-fill', url: 'https://spotify.com', color: '#1DB954', name: 'Spotify' },
    { icon: 'ri-tiktok-fill', url: 'https://tiktok.com', color: '#000000', name: 'TikTok' },
    { icon: 'ri-facebook-fill', url: 'https://facebook.com', color: '#1877F2', name: 'Facebook' },
    { icon: 'ri-twitter-x-fill', url: 'https://twitter.com', color: '#000000', name: 'Twitter' }
  ];

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=modern%20professional%20music%20office%20reception%20area%20with%20teal%20and%20bronze%20accent%20lighting%2C%20contemporary%20interior%20design%2C%20welcoming%20atmosphere%2C%20premium%20quality%20photography%2C%20artistic%20composition%2C%20clean%20aesthetic&width=1920&height=600&seq=contact-hero-bg&orientation=landscape')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            objectPosition: 'top'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-[#0EA8A0]/10 border border-[#0EA8A0]/30 rounded-full text-[#0EA8A0] text-sm font-semibold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Fale Conosco
          </span>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Entre em <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA8A0] to-[#C45C2F]">Contato</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            Estamos prontos para ouvir você. Entre em contato para parcerias, dúvidas ou oportunidades
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative py-20 bg-gradient-to-b from-black to-[#1A1A1A]">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#0EA8A0]/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
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
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-black border border-white/10 hover:border-[#0EA8A0]/50 transition-all duration-500 hover:scale-105 p-6">
                  <div 
                    className="w-14 h-14 flex items-center justify-center rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 shadow-lg"
                    style={{
                      backgroundColor: `${info.color}20`,
                      boxShadow: `0 10px 40px ${info.color}30`
                    }}
                  >
                    <i className={`${info.icon} text-2xl`} style={{ color: info.color }}></i>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {info.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {info.value}
                  </p>

                  {/* Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0EA8A0] to-[#C45C2F] shadow-lg shadow-[#0EA8A0]/50" />
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Contact Form & Map */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Envie uma Mensagem
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-white/80 text-sm font-semibold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    placeholder="Seu nome"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-white/80 text-sm font-semibold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
                      style={{ fontFamily: 'Inter, sans-serif' }}
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-white/80 text-sm font-semibold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#0EA8A0]/50 focus:bg-white/10 transition-all duration-300 text-sm"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                      placeholder="(21) 98244-7141"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-white/80 text-sm font-semibold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Assunto
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-8 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#0EA8A0]/50 focus:bg-white/10 transition-all duration-300 text-sm cursor-pointer"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="parceria">Parceria Comercial</option>
                    <option value="artista">Quero ser artista</option>
                    <option value="imprensa">Assessoria de Imprensa</option>
                    <option value="evento">Contratação para Evento</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-white/80 text-sm font-semibold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    placeholder="Escreva sua mensagem aqui... (máximo 500 caracteres)"
                  />
                  <p className="text-white/40 text-xs mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {formData.message.length}/500 caracteres
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-gradient-to-r from-[#0EA8A0] to-[#0C3F48] text-white font-semibold rounded-full shadow-lg shadow-[#0EA8A0]/30 hover:shadow-[#0EA8A0]/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center space-x-2">
                      <i className="ri-loader-4-line animate-spin"></i>
                      <span>Enviando...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <span>Enviar Mensagem</span>
                      <i className="ri-send-plane-fill"></i>
                    </span>
                  )}
                </button>

                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-[#0EA8A0]/20 border border-[#0EA8A0]/30 rounded-xl flex items-center space-x-3">
                    <i className="ri-checkbox-circle-fill text-2xl text-[#0EA8A0]"></i>
                    <p className="text-white text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Mensagem enviada com sucesso! Entraremos em contato em breve.
                    </p>
                  </div>
                )}
              </form>
            </div>

            {/* Map */}
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Nossa Localização
              </h2>
              <div className="relative overflow-hidden rounded-2xl border border-white/10 aspect-square lg:aspect-auto lg:h-full min-h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0977!2d-46.6563182!3d-23.5613991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%201000%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(90%)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização Céu Music"
                />
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
          <h2 className="text-4xl font-bold text-white mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Siga-nos nas Redes Sociais
          </h2>
          <p className="text-white/70 text-lg mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Acompanhe nossos artistas e fique por dentro de todas as novidades
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
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