import React, { useEffect, useState } from 'react';
import SEO from '../components/ui/SEO';
import Banner from '../components/ui/Banner';
// import AboutContent from '../components/sections/AboutContent';
import ParallaxSection from '../components/ui/ParallaxSection';
import AnimateOnScroll from '../components/ui/AnimateOnScroll';
import PhilosophyBg from '../assets/img/philosophy/aboutUsBanner.webp';
import apiService from '../services/api';
// import MissionVideo from '../assets/video/mission-vision-values/mission.mp4';
// import VisionVideo from '../assets/video/mission-vision-values/vision.mp4';
// import ValuesVideo from '../assets/video/mission-vision-values/values.mp4';
// Import additional images for floating circles and backgrounds
// import MissionFloatingImg from '../assets/img/mission-vision-values/mission.webp'; // You can replace with different images
// import VisionFloatingImg from '../assets/img/mission-vision-values/vision.webp';
// import ValuesFloatingImg from '../assets/img/mission-vision-values/values.webp';
// import MissionBgImg from '../assets/img/mission-vision-values/mission.webp'; // You can replace with different background images
// import VisionBgImg from '../assets/img/mission-vision-values/vision.webp';
// import ValuesBgImg from '../assets/img/mission-vision-values/values.webp';
import PerformanceImg from '../assets/img/about/para-2.webp';
import MissionImg from '../assets/img/mission-vision-values/mission.webp';
import VisionImg from '../assets/img/mission-vision-values/vision.webp';
import ValuesImg from '../assets/img/mission-vision-values/values.webp';
import Logo from '../assets/img/logo.webp';
import MeetTheFounders from '../components/sections/MeetTheFounders';
import CarouselMVV from '../components/ui/CarouselMVV/CarouselMVV';

const About = () => {
  const [about, setAbout] = useState(null);
  const [mvvItems, setMvvItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load banner data from about_sections table (same as AboutManager)
        const bannerRes = await apiService.getAboutSectionByKey('banner');
        let bannerData = null;
        
        if (bannerRes?.success && bannerRes.data) {
          let backgroundImageUrl = bannerRes.data.background_image_url || '';
          // Fix URL path if it's pointing to wrong directory
          if (backgroundImageUrl && backgroundImageUrl.includes('/uploads/homepage/')) {
            backgroundImageUrl = backgroundImageUrl.replace('/uploads/homepage/', '/uploads/about/');
          }
          
          bannerData = {
            banner_title: bannerRes.data.title || '',
            banner_subtitle: bannerRes.data.subtitle || '',
            banner_description: bannerRes.data.description || '',
            banner_background_image_url: backgroundImageUrl
          };
        } else {
          // Fallback to homepage section if new endpoint not available
          const fallback = await apiService.getHomepageSectionByKey?.('about_banner');
          if (fallback?.success && fallback.data) {
            let backgroundImageUrl = fallback.data.background_image_url || '';
            // Fix URL path if it's pointing to wrong directory
            if (backgroundImageUrl && backgroundImageUrl.includes('/uploads/homepage/')) {
              backgroundImageUrl = backgroundImageUrl.replace('/uploads/homepage/', '/uploads/about/');
            }
            
            bannerData = {
              banner_title: fallback.data.title || '',
              banner_subtitle: '',
              banner_description: fallback.data.description || '',
              banner_background_image_url: backgroundImageUrl
            };
          }
        }
        
        setAbout(bannerData);
        
        // Load MVV data from about_sections table
        const mvvRes = await apiService.getAboutSectionByKey('mvv');
        let items = [];
        
        if (mvvRes.success && mvvRes.data) {
          const mvvData = mvvRes.data;
          let content = {};
          try {
            content = mvvData.content ? JSON.parse(mvvData.content) : {};
          } catch (parseErr) {
            console.warn('Error parsing MVV content:', parseErr);
          }
          
          // Build MVV items for Carousel from about_sections data
          
          // Mission
          if (content.mission_text) {
            let missionImageUrl = content.mission_image_url || MissionImg;
            // Fix URL path if it's pointing to wrong directory
            if (missionImageUrl && missionImageUrl.includes('/uploads/homepage/')) {
              missionImageUrl = missionImageUrl.replace('/uploads/homepage/', '/uploads/about/');
            }
            
            items.push({ 
              id: 1, 
              title: 'Mission', 
              description: content.mission_text, 
              image: missionImageUrl
            });
          }
          
          // Vision
          if (content.vision_text) {
            let visionImageUrl = content.vision_image_url || VisionImg;
            // Fix URL path if it's pointing to wrong directory
            if (visionImageUrl && visionImageUrl.includes('/uploads/homepage/')) {
              visionImageUrl = visionImageUrl.replace('/uploads/homepage/', '/uploads/about/');
            }
            
            items.push({ 
              id: 2, 
              title: 'Vision', 
              description: content.vision_text, 
              image: visionImageUrl
            });
          }
          
          // Values
          if (content.values_text) {
            let valuesImageUrl = content.values_image_url || ValuesImg;
            // Fix URL path if it's pointing to wrong directory
            if (valuesImageUrl && valuesImageUrl.includes('/uploads/homepage/')) {
              valuesImageUrl = valuesImageUrl.replace('/uploads/homepage/', '/uploads/about/');
            }
            
            items.push({ 
              id: 3, 
              title: 'Values', 
              description: content.values_text, 
              image: valuesImageUrl
            });
          }
        } else {
          console.warn('No MVV section data from about_sections, falling back to homepage data');
          
          // Fallback to homepage section if about_sections doesn't have MVV data
          const fallback = await apiService.getHomepageSectionByKey?.('mvv');
          if (fallback?.success && fallback.data) {
            let content = {};
            try {
              content = fallback.data.content ? JSON.parse(fallback.data.content) : {};
            } catch (parseErr) {
              console.warn('Error parsing fallback MVV content:', parseErr);
            }
            
            // Mission
            if (content.mission_text) {
              let missionImageUrl = content.mission_image_url || MissionImg;
              // Fix URL path if it's pointing to wrong directory
              if (missionImageUrl && missionImageUrl.includes('/uploads/homepage/')) {
                missionImageUrl = missionImageUrl.replace('/uploads/homepage/', '/uploads/about/');
              }
              
              items.push({ 
                id: 1, 
                title: 'Mission', 
                description: content.mission_text, 
                image: missionImageUrl
              });
            }
            
            // Vision
            if (content.vision_text) {
              let visionImageUrl = content.vision_image_url || VisionImg;
              // Fix URL path if it's pointing to wrong directory
              if (visionImageUrl && visionImageUrl.includes('/uploads/homepage/')) {
                visionImageUrl = visionImageUrl.replace('/uploads/homepage/', '/uploads/about/');
              }
              
              items.push({ 
                id: 2, 
                title: 'Vision', 
                description: content.vision_text, 
                image: visionImageUrl
              });
            }
            
            // Values
            if (content.values_text) {
              let valuesImageUrl = content.values_image_url || ValuesImg;
              // Fix URL path if it's pointing to wrong directory
              if (valuesImageUrl && valuesImageUrl.includes('/uploads/homepage/')) {
                valuesImageUrl = valuesImageUrl.replace('/uploads/homepage/', '/uploads/about/');
              }
              
              items.push({ 
                id: 3, 
                title: 'Values', 
                description: content.values_text, 
                image: valuesImageUrl
              });
            }
          }
        }
        
        setMvvItems(items);
      } catch (err) {
        console.error('Error loading about page data:', err);
        setError('Failed to load about page content');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
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

  // SEO data for about page - using dynamic content from about_sections table
  const seoData = {
    title: about?.banner_title ? `${about.banner_title} - About Othentica` : 'About Othentica - Our Mission, Vision & Values',
    description: about?.banner_description || 
      "Learn about Othentica's mission to empower businesses through innovative digital solutions. Discover our vision for digital transformation and the core values that drive our culture of excellence.",
    keywords:
      'about Othentica, company mission, company vision, company values, digital innovation company, technology company, mobile app development company, digital transformation services',
    image: about?.banner_background_image_url || PhilosophyBg,
    url: 'https://othentica.com/about',
    type: 'website',
    canonical: 'https://othentica.com/about',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: about?.banner_title || 'About Othentica',
      description: about?.banner_description || 
        "Learn about Othentica's mission, vision, and values in digital innovation and mobile app development",
      url: 'https://othentica.com/about',
      mainEntity: {
        '@type': 'Organization',
        name: 'Othentica',
        description: about?.banner_description || 
          'Digital innovation company specializing in mobile app development and digital transformation',
        url: 'https://othentica.com',
        logo: Logo,
        foundingDate: '2020',
        slogan: about?.banner_subtitle || 'Crafting Corporate Health',
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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen dark:bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary dark:text-neutral text-lg">Loading about page...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen dark:bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-primary dark:text-neutral mb-2">Error Loading Page</h2>
          <p className="text-primary dark:text-neutral mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-primary">
      <SEO {...seoData} />

      <Banner
        title={about?.banner_title || 'About Othentica'}
        subtitle={about?.banner_subtitle || 'Crafting Corporate Health'}
        description={about?.banner_description || "Othentica is a gamified wellness app that guides people to step into their authentic selves by balancing mind, body, and purpose through brain-health-based tools and experiences."}
        buttonText=""
        buttonVariant="accent"
        buttonOnClick={handleLearnMore}
        backgroundImage={about?.banner_background_image_url || PhilosophyBg}
      />

      <AnimateOnScroll animation="fadeInUp" delay={200}>
        <MeetTheFounders />
      </AnimateOnScroll>

      <AnimateOnScroll animation="fadeIn" delay={100}>
        <ParallaxSection
          imageSrc={PerformanceImg}
          imageAlt="Digital Innovation"
          height="h-[80vh]"
          imageOffset="-150%"
          overlayOpacity="bg-black/20"
          speed={0.3}
          className="mt-14 hidden md:block"
        ></ParallaxSection>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fadeInUp" delay={300}>
        <div className="max-w-[90%] w-full mx-auto mt-32">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-bold text-primary dark:text-neutral mb-4">
              Mission Vision Values
            </h2>
          </div>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll animation="scaleIn" delay={400} duration={800}>
        <CarouselMVV className="my-24" items={mvvItems} />
      </AnimateOnScroll>

      {/* <AboutContent
        title="Mission"
        description="At Othentica, our mission is to empower businesses through innovative digital solutions that drive growth and create meaningful connections. We combine cutting-edge technology with creative excellence to transform your vision into digital reality, helping you achieve your goals in an ever-evolving digital landscape."
        imageSrc={ValuesImg}
        videoSrc={MissionVideo}
        imageAlt="Othentica Mission"
        floatingImageSrc={MissionFloatingImg}
        floatingImageAlt="Mission Floating Circle"
        backgroundImageSrc={VisionBgImg}
        backgroundImageAlt="Mission Background"
        showFloatingCircles={true}
        showGradients={true}
        showPlayButton={false}
        flipped={false}
        sectionId="mission"
        index={0}
      />

      <AboutContent
        title="Vision"
        description="At Othentica, our vision is to be a leading provider of innovative digital solutions that empower businesses to achieve their goals in an ever-evolving digital landscape. We combine cutting-edge technology with creative excellence to transform your vision into digital reality, helping you achieve your goals in an ever-evolving digital landscape."
        imageSrc={VisionImg}
        videoSrc={VisionVideo}
        imageAlt="Othentica Vision"
        floatingImageSrc={ValuesFloatingImg}
        floatingImageAlt="Vision Floating Circle"
        backgroundImageSrc={MissionBgImg}
        backgroundImageAlt="Vision Background"
        showFloatingCircles={true}
        showGradients={true}
        showPlayButton={false}
        flipped={true}
        sectionId="vision"
        index={1}
      /> */}

      {/* Parallax Section 2 */}
      {/* <ParallaxSection 
        imageSrc={PerformanceImg}
        imageAlt="Performance Excellence"
        height="h-[80vh]"
        overlayOpacity="bg-neutral/20"
        speed={0.3}
      >
      </ParallaxSection> */}

      {/* <AboutContent
        title="Values"
        description="At Othentica, our values are the foundation of our culture and guide our decisions. We believe in integrity, innovation, and collaboration, and we strive to create a positive impact through our work."
        imageSrc={MissionImg}
        videoSrc={ValuesVideo}
        imageAlt="Othentica Values"
        floatingImageSrc={VisionFloatingImg}
        floatingImageAlt="Values Floating Circle"
        backgroundImageSrc={ValuesBgImg}
        backgroundImageAlt="Values Background"
        showFloatingCircles={true}
        showGradients={true}
        showPlayButton={false}
        flipped={false}
        sectionId="values"
        index={2}
      /> */}
    </div>
  );
};

export default About;
