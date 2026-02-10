import { useEffect } from 'react';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ArtistsSection from './components/ArtistsSection';
import ReleasesSection from './components/ReleasesSection';
import VideosSection from './components/VideosSection';
import NewsSection from './components/NewsSection';
import ContactSection from './components/ContactSection';
import Footer from '../../components/feature/Footer';

export default function HomePage() {
  useEffect(() => {
    // Usar requestIdleCallback para não bloquear o scroll
    let observer: IntersectionObserver | null = null;
    let idleCallbackId: number | null = null;

    const initObserver = () => {
      const observerOptions = {
        threshold: [0, 0.1],
        rootMargin: '0px 0px -100px 0px'
      };

      observer = new IntersectionObserver((entries) => {
        // Usar requestAnimationFrame para otimizar as mudanças de DOM
        requestAnimationFrame(() => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
            }
          });
        });
      }, observerOptions);

      const sections = document.querySelectorAll('.scroll-reveal');
      sections.forEach(section => observer!.observe(section));
    };

    // Usar requestIdleCallback se disponível, senão executar imediatamente
    if ('requestIdleCallback' in window) {
      idleCallbackId = requestIdleCallback(initObserver as IdleRequestCallback, { timeout: 2000 });
    } else {
      initObserver();
    }

    return () => {
      if (idleCallbackId !== null && 'cancelIdleCallback' in window) {
        cancelIdleCallback(idleCallbackId);
      }
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ margin: 0, padding: 0, width: '100%' }}>
      <HeroSection />
      
      <div className="section-divider"></div>
      
      <div className="scroll-reveal">
        <AboutSection />
      </div>
      
      <div className="section-divider-wave"></div>
      
      <div className="scroll-reveal">
        <ArtistsSection />
      </div>
      
      <div className="section-divider-glow"></div>
      
      <div className="scroll-reveal">
        <ReleasesSection />
      </div>
      
      <div className="section-divider-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <div className="scroll-reveal">
        <VideosSection />
      </div>
      
      <div className="section-divider"></div>
      
      <div className="scroll-reveal">
        <NewsSection />
      </div>
      
      <div className="section-divider-wave"></div>
      
      <div className="scroll-reveal">
        <ContactSection />
      </div>
      
      <Footer />
    </div>
  );
}
