import React, { useEffect, useRef } from 'react';

const ParallaxSection = ({
  imageSrc,
  imageAlt,
  height = 'h-96',
  overlay = true,
  overlayOpacity = 'bg-black/30',
  children,
  className = '',
  speed = 0.5,
}) => {
  const parallaxRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * speed;
        parallaxRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div className={`relative overflow-hidden ${height} ${className}`}>
      {/* Parallax Background Image */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 w-full h-[200%] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${imageSrc})`,
          top: '-100%',
        }}
        aria-label={imageAlt}
      />

      {/* Overlay */}
      {overlay && <div className={`absolute inset-0 ${overlayOpacity}`} />}

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection;
