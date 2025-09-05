import React, { useState, useEffect, useRef } from 'react';
import SEO from '../components/ui/SEO';
import Hero from '../components/sections/Hero';
import Philosophy from '../components/sections/Philosophy';
import MobileShowcase from '../components/sections/MobileShowcase';
import Services from '../components/sections/Services';
import Testimonials from '../components/sections/Testimonials';
import SocialMedia from '../components/sections/Blog';
import Clients from '../components/sections/Clients';
import Logo from '../assets/img/logo.webp';
import Security from '../components/sections/Security';
import FeaturesAndBenefits from '../components/sections/FeaturesAndBenefits';

const Home = () => {
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

  // Intersection Observer for Hero section
  useEffect(() => {
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

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  // Generic intersection observer for other sections
  const createSectionObserver = (sectionName, ref) => {
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, sectionName]));
          }
        },
        {
          threshold: 0.2,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, []);
  };

  // Create observers for each section
  createSectionObserver('testimonials', testimonialsRef);
  createSectionObserver('philosophy', philosophyRef);
  createSectionObserver('mobileShowcase', mobileShowcaseRef);
  createSectionObserver('features', featuresRef);
  createSectionObserver('services', servicesRef);
  createSectionObserver('secondTestimonials', secondTestimonialsRef);
  createSectionObserver('clients', clientsRef);
  createSectionObserver('security', securityRef);

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
      
      {/* Hero Section with Animation */}
      <div ref={heroRef} className={`transition-all duration-1000 ease-out ${
        isHeroVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-8'
      }`}>
        <Hero />
      </div>

      {/* Testimonials Section with Animation */}
      <div ref={testimonialsRef} className={`transition-all duration-1000 ease-out delay-200 hover:scale-[1.01] ${
        visibleSections.has('testimonials')
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-8'
      }`}>
        <Testimonials />
      </div>

      {/* Philosophy Section with Animation */}
      <div ref={philosophyRef} className={`transition-all duration-1000 ease-out delay-300 hover:scale-[1.01] ${
        visibleSections.has('philosophy')
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-8'
      }`}>
        <Philosophy />
      </div>

      {/* Mobile Showcase Section with Animation */}
      <div ref={mobileShowcaseRef} className={`transition-all duration-1000 ease-out delay-400 hover:scale-[1.01] ${
        visibleSections.has('mobileShowcase')
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-8'
      }`}>
        <MobileShowcase />
      </div>

      {/* Features and Benefits Section with Animation */}
      <div ref={featuresRef} className={`transition-all duration-1000 ease-out delay-500 hover:scale-[1.01] ${
        visibleSections.has('features')
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-8'
      }`}>
        <FeaturesAndBenefits />
      </div>

      {/* Services Section with Animation */}
      <div ref={servicesRef} className={`transition-all duration-1000 ease-out delay-600 hover:scale-[1.01] ${
        visibleSections.has('services')
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-8'
      }`}>
        <Services />
      </div>

      {/* Second Testimonials Section with Animation */}
      <div ref={secondTestimonialsRef} className={`transition-all duration-1000 ease-out delay-700 hover:scale-[1.01] ${
        visibleSections.has('secondTestimonials')
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-8'
      }`}>
        <Testimonials />
      </div>

      {/* Clients Section with Animation */}
      <div ref={clientsRef} className={`transition-all duration-1000 ease-out delay-800 hover:scale-[1.01] ${
        visibleSections.has('clients')
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-8'
      }`}>
        <Clients />
      </div>

      {/* Security Section with Animation */}
      <div ref={securityRef} className={`transition-all duration-1000 ease-out delay-900 hover:scale-[1.01] ${
        visibleSections.has('security')
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-8'
      }`}>
        <Security />
      </div>

      {/* <SocialMedia /> */}
      
    </div>
  );
};

export default Home;
