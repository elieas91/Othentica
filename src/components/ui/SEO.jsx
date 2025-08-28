import { useEffect } from 'react';
import Logo from '../../assets/img/logo.webp';

const SEO = ({
  title = null,
  description = null,
  keywords = null,
  image = null,
  url = null,
  type = 'website',
  structuredData = null,
  canonical = null
}) => {
  const fullTitle = title ? `${title} | Othentica` : 'Othentica - Digital Innovation & Mobile App Development';
  const defaultDescription = 'Othentica is a leading digital innovation company specializing in mobile app development, web solutions, and digital transformation services. We help businesses achieve their digital goals with cutting-edge technology and creative excellence.';
  const defaultKeywords = 'digital innovation, mobile app development, web development, digital transformation, technology solutions, creative excellence, business growth, digital strategy';
  const defaultImage = Logo;
  const baseUrl = 'https://othentica.com'; // Update this with your actual domain

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description || defaultDescription;

    // Update or create meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords || defaultKeywords;

    // Update or create Open Graph meta tags
    const ogTags = [
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description || defaultDescription },
      { property: 'og:image', content: image || defaultImage },
      { property: 'og:url', content: url || `${baseUrl}${window.location.pathname}` },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: 'Othentica' },
      { property: 'og:locale', content: 'en_US' }
    ];

    ogTags.forEach(tag => {
      let ogTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', tag.property);
        document.head.appendChild(ogTag);
      }
      ogTag.content = tag.content;
    });

    // Update or create Twitter Card meta tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description || defaultDescription },
      { name: 'twitter:image', content: image || defaultImage }
    ];

    twitterTags.forEach(tag => {
      let twitterTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!twitterTag) {
        twitterTag = document.createElement('meta');
        twitterTag.name = tag.name;
        document.head.appendChild(twitterTag);
      }
      twitterTag.content = tag.content;
    });

    // Update or create robots meta tag
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
    }
    metaRobots.content = 'index, follow';

    // Update or create author meta tag
    let metaAuthor = document.querySelector('meta[name="author"]');
    if (!metaAuthor) {
      metaAuthor = document.createElement('meta');
      metaAuthor.name = 'author';
      document.head.appendChild(metaAuthor);
    }
    metaAuthor.content = 'Othentica';

    // Update or create canonical link
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = canonical;
    }

    // Add structured data
    if (structuredData) {
      // Remove existing structured data
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
      existingScripts.forEach(script => script.remove());

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    } else {
      // Add default organization structured data
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
      existingScripts.forEach(script => script.remove());

      const defaultStructuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Othentica",
        "description": "Digital innovation company specializing in mobile app development and digital transformation",
        "url": baseUrl,
        "logo": `${baseUrl}${Logo}`,
        "sameAs": [
          "https://linkedin.com/company/othentica",
          "https://twitter.com/othentica"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": "info@othentica.com"
        }
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(defaultStructuredData);
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      // Reset title to default
      document.title = 'Othentica';
    };
  }, [title, description, keywords, image, url, type, structuredData, canonical]);

  // This component doesn't render anything visible
  return null;
};

export default SEO;
