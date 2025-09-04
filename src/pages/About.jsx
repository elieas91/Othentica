import React, { useEffect } from 'react';
import SEO from '../components/ui/SEO';
import Banner from '../components/ui/Banner';
import AboutContent from '../components/sections/AboutContent';
import ParallaxSection from '../components/ui/ParallaxSection';
import PhilosophyBg from '../assets/img/philosophy/philo-bg.webp';
import FlameVideo from '../assets/video/hero/othentica-flame-animation.webm';
import MissionVideo from '../assets/video/mission-vision-values/mission.mp4';
import MissionImg from '../assets/img/mission-vision-values/mission.webp';
import VisionVideo from '../assets/video/mission-vision-values/vision.mp4';
import VisionImg from '../assets/img/mission-vision-values/vision.webp';
import ValuesVideo from '../assets/video/mission-vision-values/values.mp4';
import ValuesImg from '../assets/img/mission-vision-values/values.webp';
import PerformanceImg from '../assets/img/about/para-2.webp';
import Logo from '../assets/img/logo.webp';
import MeetTheFounders from '../components/sections/MeetTheFounders';

const About = () => {
  // Preload critical images for better LCP
  useEffect(() => {
    const preloadImage = (src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    };

    // Preload critical images for better LCP
    preloadImage(PhilosophyBg); // Banner background image
    preloadImage(MissionImg); // Mission section image
  }, []);

  // SEO data for about page
  const seoData = {
    title: 'About Othentica - Our Mission, Vision & Values',
    description:
      "Learn about Othentica's mission to empower businesses through innovative digital solutions. Discover our vision for digital transformation and the core values that drive our culture of excellence.",
    keywords:
      'about Othentica, company mission, company vision, company values, digital innovation company, technology company, mobile app development company, digital transformation services',
    image: PhilosophyBg,
    url: 'https://othentica.com/about',
    type: 'website',
    canonical: 'https://othentica.com/about',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Othentica',
      description:
        "Learn about Othentica's mission, vision, and values in digital innovation and mobile app development",
      url: 'https://othentica.com/about',
      mainEntity: {
        '@type': 'Organization',
        name: 'Othentica',
        description:
          'Digital innovation company specializing in mobile app development and digital transformation',
        url: 'https://othentica.com',
        logo: Logo,
        foundingDate: '2020',
        slogan: 'Crafting Digital Excellence',
        knowsAbout: [
          'Mobile App Development',
          'Digital Transformation',
          'Web Development',
          'Technology Innovation',
          'Creative Excellence',
        ],
      },
    },
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
    <div className="min-h-screen dark:bg-primary">
      <SEO {...seoData} />

      <Banner
        title="About Othentica"
        subtitle="Crafting Digital Excellence"
        description="Othentica is a gamified wellness app that guides people to step into their authentic selves by balancing mind, body, and purpose through brain-health-based tools and experiences."
        buttonText=""
        buttonVariant="accent"
        buttonOnClick={handleLearnMore}
        backgroundImage={PhilosophyBg}
      />

      <MeetTheFounders />

      <AboutContent
        // title="Driving Purpose Forward"
        title="Mission"
        description="At Othentica, our mission is to empower businesses through innovative digital solutions that drive growth and create meaningful connections. We combine cutting-edge technology with creative excellence to transform your vision into digital reality, helping you achieve your goals in an ever-evolving digital landscape."
        imageSrc={MissionImg}
        videoSrc={MissionVideo}
        imageAlt="Othentica Mobile App"
        showFloatingCircles={true}
        showGradients={true}
        showPlayButton={false}
        flipped={false}
        sectionId="mission"
      />

      <ParallaxSection
        imageSrc={PerformanceImg}
        imageAlt="Digital Innovation"
        height="h-[85vh]"
        overlayOpacity="bg-neutral/20"
        speed={0.3}
      ></ParallaxSection>

      <AboutContent
        // title="Driving Purpose Forward"
        title="Vision"
        description="At Othentica, our vision is to be a leading provider of innovative digital solutions that empower businesses to achieve their goals in an ever-evolving digital landscape. We combine cutting-edge technology with creative excellence to transform your vision into digital reality, helping you achieve your goals in an ever-evolving digital landscape."
        imageSrc={VisionImg}
        videoSrc={VisionVideo}
        imageAlt="Othentica Mobile App"
        showFloatingCircles={true}
        showGradients={true}
        showPlayButton={false}
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
        imageSrc={ValuesImg}
        videoSrc={ValuesVideo}
        imageAlt="Othentica Mobile App"
        showFloatingCircles={true}
        showGradients={true}
        showPlayButton={false}
        flipped={false}
        sectionId="values"
      />

      {/* Call to Action Section */}
      <div className="w-full px-4 text-center py-20">
        <div className="h-[25vh] justify-center items-center p-8 mx-4">
          <p className="text-lg text-gray-700 leading-relaxed">
            Ready to transform your digital presence?
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Let's work together to bring your vision to life.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our team of experts is here to help you navigate the digital
            landscape
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            and create solutions that drive real results for your business.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
