import { useEffect } from 'react';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ArtistsSection from './components/ArtistsSection';
import ReleasesSection from './components/ReleasesSection';
import VideosSection from './components/VideosSection';
import NewsSection from './components/NewsSection';
import ContactSection from './components/ContactSection';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';

export default function HomePage() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.scroll-reveal');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
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
