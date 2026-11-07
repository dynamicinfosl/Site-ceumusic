import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../utils/supabase';
import aboutImage from '../../../../assets/Ativo 2[1].png';

interface AboutData {
  title: string;
  content: string;
  image_url: string | null;
}

export default function AboutSection() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  useEffect(() => {
    async function fetchAbout() {
      if (!supabase) {
        return;
      }
      try {
        const { data, error } = await supabase
          .from('about_section')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        if (data) setAboutData(data);
      } catch (err) {
        console.error('Erro ao buscar sobre:', err);
      }
    }
    fetchAbout();
  }, []);

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-black via-[#1A1A1A] to-black">

      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#0EA8A0]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#C45C2F]/10 rounded-full blur-[100px]" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Content */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8">{aboutData?.title}</h2>
          
          {/* Logo em cima */}
          <div className="mb-6 sm:mb-8 lg:mb-10 flex justify-center">
            <img
              src={aboutData?.image_url || aboutImage}
              alt="Céu Music"
              className="max-w-[200px] sm:max-w-xs md:max-w-sm w-full h-auto object-contain drop-shadow-[0_0_25px_rgba(0,0,0,0.7)] rounded-2xl"
            />
          </div>

          {/* Texto em baixo */}
          <p
            className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4 whitespace-pre-line"
          >
            {aboutData?.content}
          </p>

          <Link
            to="/sobre"
            className="inline-flex items-center gap-2 bg-transparent border border-gray-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:border-[#0EA8A0] hover:shadow-[0_0_20px_rgba(14,168,160,0.3)] hover:text-[#0EA8A0] transition-all duration-300 whitespace-nowrap cursor-pointer text-sm sm:text-base min-h-[44px]"
          >
            Saiba Mais
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
