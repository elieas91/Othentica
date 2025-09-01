import React from 'react';
import Button from './Button';

const Banner = ({
  title,
  subtitle,
  description,
  buttonText,
  buttonVariant = 'accent',
  buttonOnClick,
  backgroundImage,
  backgroundImages,
  className = '',
  children,
}) => {
  // If backgroundImages is provided and is an array, render them as columns
  const hasMultipleImages =
    Array.isArray(backgroundImages) && backgroundImages.length > 0;
  return (
    <div
      className={`relative min-h-[100vh] flex items-center justify-center overflow-hidden ${className}`}
      style={
        hasMultipleImages
          ? undefined
          : {
              backgroundImage: backgroundImage
                ? `url(${backgroundImage})`
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
      }
    >
      {/* Multi-image background as columns on larger screens, and as rows on mobile screens */}
      {hasMultipleImages && (
        <div className="absolute inset-0 w-full h-full flex flex-col md:flex-row z-0">
          {backgroundImages.map((img, idx) => (
            <React.Fragment key={idx}>
              <div
                className="flex-1 bg-cover bg-center bg-no-repeat h-full md:h-full w-full md:w-auto"
                style={{ backgroundImage: `url(${img})` }}
              ></div>
              {/* Separator except after last image */}
              {idx < backgroundImages.length - 1 && (
                <div
                  className="w-[4px] md:w-[10px] h-[4px] md:h-full bg-white"
                  style={{ boxShadow: '0 0 8px 2px rgba(0,0,0,0.2)' }}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-accent/40 dark:from-primary/90 dark:via-primary/70 dark:to-accent/50 z-10"></div>

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

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white dark:from-primary to-transparent z-30"></div>
    </div>
  );
};

export default Banner;
