import React, { useState, useEffect, useRef } from 'react';
import SEO from '../components/ui/SEO';
import Hero from '../components/sections/Hero';
import Philosophy from '../components/sections/Philosophy';
import MobileShowcase from '../components/sections/MobileShowcase';
import Services from '../components/sections/Services';
import Testimonials from '../components/sections/Testimonials';
import SocialMedia from '../components/sections/SocialMedia';
import Clients from '../components/sections/Clients';
import Logo from '../assets/img/logo.webp';
import Security from '../components/sections/Security';
import FeaturesAndBenefits from '../components/sections/FeaturesAndBenefits';
import ErrorBoundary from '../components/ui/ErrorBoundary';

// Hook to detect mobile devices
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

const Home = () => {
  // Mobile detection
  const isMobile = useIsMobile();
  
  // Animation state management
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  
  // Refs for each section
  const heroRef = useRef(null);
  const testimonialsRef = useRef(null);
  const philosophyRef = useRef(null);
  const mobileShowcaseRef = useRef(null);
  const featuresRef = useRef(null);
  const servicesRef = useRef(null);
  const secondTestimonialsRef = useRef(null);
  const clientsRef = useRef(null);
  const securityRef = useRef(null);

  // Intersection Observer for Hero section (desktop only)
  useEffect(() => {
    if (isMobile) {
      setIsHeroVisible(true);
      return;
    }

    const currentRef = heroRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeroVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isMobile]);

  // Individual intersection observers for each section (desktop only)
  useEffect(() => {
    if (isMobile) {
      setVisibleSections(new Set(['testimonials', 'philosophy', 'mobileShowcase', 'features', 'services', 'secondTestimonials', 'clients', 'security']));
      return;
    }

    const currentRef = testimonialsRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, 'testimonials']));
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isMobile]);

  // Individual intersection observers for desktop only
  useEffect(() => {
    if (isMobile) return;

    const observers = [];
    const refs = [
      { ref: philosophyRef, key: 'philosophy' },
      { ref: mobileShowcaseRef, key: 'mobileShowcase' },
      { ref: featuresRef, key: 'features' },
      { ref: servicesRef, key: 'services' },
      { ref: secondTestimonialsRef, key: 'secondTestimonials' },
      { ref: clientsRef, key: 'clients' },
      { ref: securityRef, key: 'security' }
    ];

    refs.forEach(({ ref, key }) => {
      const currentRef = ref.current;
      if (currentRef) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleSections(prev => new Set([...prev, key]));
            }
          },
          {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
          }
        );
        observer.observe(currentRef);
        observers.push({ observer, ref: currentRef });
      }
    });

    return () => {
      observers.forEach(({ observer, ref }) => {
        observer.unobserve(ref);
      });
    };
  }, [isMobile]);

  // SEO data for homepage
  const seoData = {
    title: 'Digital Innovation & Mobile App Development',
    description:
      'Othentica is a leading digital innovation company specializing in mobile app development, web solutions, and digital transformation services. We help businesses achieve their digital goals with cutting-edge technology and creative excellence.',
    keywords:
      'digital innovation, mobile app development, web development, digital transformation, technology solutions, creative excellence, business growth, digital strategy, mobile apps, web applications, software development',
    image: Logo,
    url: 'https://othentica.com',
    type: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Othentica',
      description: 'Digital Innovation & Mobile App Development Company',
      url: 'https://othentica.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://othentica.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Othentica',
        logo: {
          '@type': 'ImageObject',
          url: Logo,
        },
      },
    },
  };

  return (
    <div className="Home">
      <SEO {...seoData} />
      
      {/* Hero Section */}
      <div ref={heroRef} className={isMobile ? '' : `transition-all duration-1000 ease-out ${
        isHeroVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-8'
      }`}>
        <Hero />
      </div>

      {/* Testimonials Section */}
      <div ref={testimonialsRef} className={isMobile ? '' : `transition-all duration-1000 ease-out delay-200 hover:scale-[1.01] ${
        visibleSections.has('testimonials')
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-8'
      }`}>
        <Testimonials />
      </div>

      {/* Philosophy Section */}
      <div ref={philosophyRef} className={isMobile ? '' : `transition-all duration-1000 ease-out delay-300 hover:scale-[1.01] ${
        visibleSections.has('philosophy')
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-8'
      }`}>
        <Philosophy />
      </div>

      {/* Mobile Showcase Section */}
      <div ref={mobileShowcaseRef} className={isMobile ? '' : `transition-all duration-1000 ease-out delay-400 hover:scale-[1.01] ${
        visibleSections.has('mobileShowcase')
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-8'
      }`}>
        <MobileShowcase />
      </div>

      {/* Features and Benefits Section */}
      <div ref={featuresRef} className={isMobile ? '' : `transition-all duration-1000 ease-out delay-500 hover:scale-[1.01] ${
        visibleSections.has('features')
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-8'
      }`}>
        <FeaturesAndBenefits />
      </div>

      {/* Services Section */}
      <div ref={servicesRef} className={isMobile ? '' : `transition-all duration-1000 ease-out delay-600 hover:scale-[1.01] ${
        visibleSections.has('services')
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-8'
      }`}>
        <Services />
      </div>

      {/* Second Testimonials Section */}
      <div ref={secondTestimonialsRef} className={isMobile ? '' : `transition-all duration-1000 ease-out delay-700 hover:scale-[1.01] ${
        visibleSections.has('secondTestimonials')
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-8'
      }`}>
        <Testimonials />
      </div>

      {/* Clients Section */}
      <div ref={clientsRef} className={isMobile ? '' : `transition-all duration-1000 ease-out delay-800 hover:scale-[1.01] ${
        visibleSections.has('clients')
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-8'
      }`}>
        <Clients />
      </div>

      {/* Security Section */}
      <div ref={securityRef} className={isMobile ? '' : `transition-all duration-1000 ease-out delay-900 hover:scale-[1.01] ${
        visibleSections.has('security')
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-8'
      }`}>
        <Security />
      </div>

      <ErrorBoundary>
        <SocialMedia />
      </ErrorBoundary>
      
    </div>
  );
};

export default Home;
