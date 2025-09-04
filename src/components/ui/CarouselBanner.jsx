import React, { useState, useEffect } from 'react';
import Button from './Button';

const CarouselBanner = ({
  title,
  subtitle,
  description,
  buttonText,
  buttonVariant = 'accent',
  hasGradientTransparentBottom = true,
  minHeight = 'min-h-[100vh]',
  buttonOnClick,
  backgroundImages = [],
  hasTransparentSides = false,
  hasOverlay = true,
  className = '',
  children,
  autoSlideInterval = 2000, // 2 seconds default
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    if (backgroundImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [backgroundImages.length, autoSlideInterval]);

  // Manual navigation
//   const goToSlide = (index) => {
//     setCurrentImageIndex(index);
//   };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? backgroundImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % backgroundImages.length
    );
  };

  return (
    <div
      className={`relative ${minHeight} flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Background images carousel */}
      {backgroundImages.length > 0 && (
        <div className="absolute inset-0 w-full h-full">
          {backgroundImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                ...(hasTransparentSides && {
                  maskImage:
                    'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)',
                }),
              }}
            />
          ))}
        </div>
      )}

      {/* Overlay for better text readability */}
      {hasOverlay && (
        <div className="absolute inset-0 z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 text-center px-6 py-16 max-w-4xl mx-auto">
        {title && (
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral mb-6 leading-tight">
            {title}
          </h1>
        )}

        {subtitle && (
          <h2 className="text-xl md:text-2xl font-semibold text-accent mb-4">
            {subtitle}
          </h2>
        )}

        {description && (
          <p className="text-lg md:text-xl text-neutral/90 dark:text-neutral/80 mb-8 leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>
        )}

        {buttonText && (
          <div className="flex justify-center">
            <Button
              variant={buttonVariant}
              size="large"
              onClick={buttonOnClick}
            >
              {buttonText}
            </Button>
          </div>
        )}

        {children}
      </div>

      {/* Navigation arrows - only show if more than 1 image */}
      {backgroundImages.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots indicator - only show if more than 1 image */}
      {/* {backgroundImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )} */}

      {/* Decorative elements */}
      {hasGradientTransparentBottom ? (
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white dark:from-primary to-transparent z-30"></div>
      ) : (
        <div className="absolute bottom-0 left-0 w-full h-16 bg-white dark:bg-primary z-30"></div>
      )}
    </div>
  );
};

export default CarouselBanner;
