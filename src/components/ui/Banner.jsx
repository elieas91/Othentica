import React from 'react';
import Button from './Button';

const Banner = ({
  title,
  subtitle,
  description,
  buttonText,
  buttonVariant = 'accent',
  hasGradientTransparentBottom = true,
  minHeight = 'min-h-[100vh]',
  buttonOnClick,
  backgroundImage,
  backgroundImages,
  hasTransparentSides = false,
  hasOverlay = true,
  className = '',
  children,
  textInRectangle = false,
}) => {
  // If backgroundImages is provided and is an array, render them as columns
  const hasMultipleImages =
    Array.isArray(backgroundImages) && backgroundImages.length > 0;
  return (
    <div
      className={`relative ${minHeight} flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Background image with optional transparency mask */}
      {!hasMultipleImages && backgroundImage && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${backgroundImage})`,
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
        ></div>
      )}
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
      {hasOverlay && (
        <div className="absolute inset-0 z-10">
          {/* Enhanced overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 text-center px-6 py-16 max-w-4xl mx-auto">
        {title &&
          (textInRectangle ? (
            <div
              className="inline-block border-2 border-white px-4 py-2 md:px-8 md:py-3 mb-6"
              style={{ background: 'rgba(0,0,0,0.15)' }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight m-0">
                {title}
              </h1>
            </div>
          ) : (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral mb-6 leading-tight">
              {title}
            </h1>
          ))}

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
      {hasGradientTransparentBottom ? (
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white dark:from-primary to-transparent z-30"></div>
      ) : (
        <div className="absolute bottom-0 left-0 w-full h-16 bg-white dark:bg-primary z-30"></div>
      )}
    </div>
  );
};

export default Banner;
