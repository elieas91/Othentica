import React, { useEffect } from 'react';
import SEO from '../components/ui/SEO';
import Banner from '../components/ui/Banner';
import AboutContent from '../components/sections/AboutContent';
import ParallaxSection from '../components/ui/ParallaxSection';
import PhilosophyBg from '../assets/img/philosophy/philo-bg.webp';
import FlameVideo from '../assets/video/hero/othentica-flame-animation.webm';
import BridgingImg from '../assets/img/about/para-1.webp';
import BridgingImg2 from '../assets/img/services/bridging.webp';
import PerformanceImg from '../assets/img/about/para-2.webp';
import Logo from '../assets/img/logo.webp';

const About = () => {
  // SEO data for about page
  const seoData = {
    title: "About Othentica - Our Mission, Vision & Values",
    description: "Learn about Othentica's mission to empower businesses through innovative digital solutions. Discover our vision for digital transformation and the core values that drive our culture of excellence.",
    keywords: "about Othentica, company mission, company vision, company values, digital innovation company, technology company, mobile app development company, digital transformation services",
    image: PhilosophyBg,
    url: "https://othentica.com/about",
    type: "website",
    canonical: "https://othentica.com/about",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Othentica",
      "description": "Learn about Othentica's mission, vision, and values in digital innovation and mobile app development",
      "url": "https://othentica.com/about",
      "mainEntity": {
        "@type": "Organization",
        "name": "Othentica",
        "description": "Digital innovation company specializing in mobile app development and digital transformation",
        "url": "https://othentica.com",
        "logo": Logo,
        "foundingDate": "2020",
        "slogan": "Crafting Digital Excellence",
        "knowsAbout": [
          "Mobile App Development",
          "Digital Transformation",
          "Web Development",
          "Technology Innovation",
          "Creative Excellence"
        ]
      }
    }
  };

  // Handle direct navigation to sections (e.g., /about#mission)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Remove the # symbol
      const sectionId = hash.substring(1);
      // Wait for the page to fully render, then scroll to section
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 80; // Account for fixed navigation height
          const elementPosition = element.offsetTop - offset;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  }, []);

  const handleLearnMore = () => {
    // Scroll to the content section
    const contentSection = document.querySelector('.about-content');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral dark:bg-primary">
      <SEO {...seoData} />
      
      <Banner
        title="About Othentica"
        subtitle="Crafting Digital Excellence"
        description="We are a passionate team of innovators dedicated to transforming ideas into exceptional digital experiences. Our commitment to quality, creativity, and cutting-edge technology drives everything we do."
        buttonText=""
        buttonVariant="accent"
        buttonOnClick={handleLearnMore}
        backgroundImage={PhilosophyBg}
      />

      <AboutContent
        // title="Driving Purpose Forward"
        title="Mission"
        description="At Othentica, our mission is to empower businesses through innovative digital solutions that drive growth and create meaningful connections. We combine cutting-edge technology with creative excellence to transform your vision into digital reality, helping you achieve your goals in an ever-evolving digital landscape."
        imageSrc={PhilosophyBg}
        videoSrc={FlameVideo}
        imageAlt="Othentica Mobile App"
        showFloatingCircles={true}
        showGradients={true}
        showPlayButton={true}
        flipped={false}
        sectionId="mission"
      />

      <ParallaxSection
        imageSrc={BridgingImg2}
        imageAlt="Digital Innovation"
        height="h-[85vh]"
        overlayOpacity="bg-neutral/20"
        speed={0.3}
      ></ParallaxSection>

      <AboutContent
        // title="Driving Purpose Forward"
        title="Vision"
        description="At Othentica, our vision is to be a leading provider of innovative digital solutions that empower businesses to achieve their goals in an ever-evolving digital landscape. We combine cutting-edge technology with creative excellence to transform your vision into digital reality, helping you achieve your goals in an ever-evolving digital landscape."
        imageSrc={PhilosophyBg}
        videoSrc={FlameVideo}
        imageAlt="Othentica Mobile App"
        showFloatingCircles={true}
        showGradients={true}
        showPlayButton={true}
        flipped={true}
        sectionId="vision"
      />

      {/* Parallax Section 2 */}
      {/* <ParallaxSection 
        imageSrc={PerformanceImg}
        imageAlt="Performance Excellence"
        height="h-[80vh]"
        overlayOpacity="bg-neutral/20"
        speed={0.3}
      >
      </ParallaxSection> */}

      <AboutContent
        // title="Driving Purpose Forward"
        title="Values"
        description="At Othentica, our values are the foundation of our culture and guide our decisions. We believe in integrity, innovation, and collaboration, and we strive to create a positive impact through our work."
        imageSrc={PhilosophyBg}
        videoSrc={FlameVideo}
        imageAlt="Othentica Mobile App"
        showFloatingCircles={true}
        showGradients={true}
        showPlayButton={true}
        flipped={false}
        sectionId="values"
      />
    </div>
  );
};

export default About;
