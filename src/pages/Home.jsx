import React from 'react';
import SEO from '../components/ui/SEO';
import Hero from '../components/sections/Hero';
import Philosophy from '../components/sections/Philosophy';
import MobileShowcase from '../components/sections/MobileShowcase';
import Services from '../components/sections/Services';
import Testimonials from '../components/sections/Testimonials';
import Blog from '../components/sections/Blog';
import Clients from '../components/sections/Clients';

const Home = () => {
  // SEO data for homepage
  const seoData = {
    title: "Digital Innovation & Mobile App Development",
    description: "Othentica is a leading digital innovation company specializing in mobile app development, web solutions, and digital transformation services. We help businesses achieve their digital goals with cutting-edge technology and creative excellence.",
    keywords: "digital innovation, mobile app development, web development, digital transformation, technology solutions, creative excellence, business growth, digital strategy, mobile apps, web applications, software development",
    image: "/src/assets/img/logo.webp",
    url: "https://othentica.com",
    type: "website",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Othentica",
      "description": "Digital Innovation & Mobile App Development Company",
      "url": "https://othentica.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://othentica.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Othentica",
        "logo": {
          "@type": "ImageObject",
          "url": "https://othentica.com/src/assets/img/logo.webp"
        }
      }
    }
  };

  return (
    <div className="Home">
      <SEO {...seoData} />
      <Hero />
      <Philosophy />
      <MobileShowcase />
      <Services />
      <Testimonials />
      <Blog />
      <Clients />
    </div>
  );
};

export default Home;
