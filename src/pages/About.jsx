import React, { useEffect } from 'react';
import SEO from '../components/ui/SEO';
import Banner from '../components/ui/Banner';
import AboutContent from '../components/sections/AboutContent';
import ParallaxSection from '../components/ui/ParallaxSection';
import PhilosophyBg from '../assets/img/philosophy/philo-bg.webp';
import FlameVideo from '../assets/video/hero/othentica-flame-animation.webm';
import PerformanceImg from '../assets/img/about/para-2.webp';
import Logo from '../assets/img/logo.webp';
import { teamData } from '../data/teamData';

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
    <div className="min-h-screen dark:bg-primary">
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

      {/* Team Section */}
      <section className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary dark:text-neutral mb-4">Meet the Team</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Ready to start your wellness journey? We'd love to hear from you. Our team is here to help you achieve your goals and create meaningful connections.
            </p>
          </div>
          
          {/* Team Members */}
          {teamData.map((member, index) => (
            <div
              key={member.id}
              className={`flex flex-row items-center gap-4 px-24 mx-auto pt-10 ${
                index % 2 !== 0 ? 'p-0' : 'pt-20'
              } ${index % 2 === 0 ? ' bg-white mb-16 p-8' : 'bg-white'} rounded-2xl `}
            >
              {/* Text Content - Position changes based on flipped property */}
              <div
                className={`flex flex-col w-1/2 ${
                  member.flipped ? 'order-2' : 'order-1'
                }`}
              >
                <h3 className="text-xl font-bold font-poppins capitalize text-secondary dark:text-neutral mb-6">
                  {member.subtitle}
                </h3>
                <h1 className="text-7xl font-bold text-primary font-sans dark:text-neutral mb-6">
                  {member.description}
                </h1>
              </div>

              {/* Image Section - Position changes based on flipped property */}
              <div className={`w-1/2 ${member.flipped ? 'order-1' : 'order-2'}`}>
                <div className="relative h-fit overflow-hidden rounded-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Social Media Buttons */}
                  <div
                    className={`absolute top-1/2 transform -translate-y-[60%] space-y-3 ${
                      member.flipped ? 'left-[10%]' : 'right-0 -translate-x-1/2'
                    }`}
                  >
                    {/* Instagram Button */}
                    <div className="w-36 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-start cursor-pointer hover:scale-105 transition-transform shadow-lg px-4">
                      <svg
                        className="w-6 h-6 text-white mr-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span className="text-white font-semibold text-sm">
                        {member.socialMedia.instagram}
                      </span>
                    </div>

                    {/* Facebook Button */}
                    <div className="w-36 h-12 bg-blue-600 rounded-lg flex items-center justify-start cursor-pointer hover:scale-105 transition-transform shadow-lg px-4">
                      <svg
                        className="w-6 h-6 text-white mr-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="text-white font-semibold text-sm">
                        {member.socialMedia.facebook}
                      </span>
                    </div>

                    {/* LinkedIn Button */}
                    <div className="w-36 h-12 bg-blue-700 rounded-lg flex items-center justify-start cursor-pointer hover:scale-105 transition-transform shadow-lg px-4">
                      <svg
                        className="w-6 h-6 text-white mr-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.032-3.047-1.032 0-1.26 1.317-1.26 3.031v5.585h-3.554v-11h3.414v1.527h.046c.5-.9 1.699-1.854 3.499-1.854 3.757 0 4.445 2.19 4.445 5.47v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <span className="text-white font-semibold text-sm">
                        {member.socialMedia.linkedin}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
