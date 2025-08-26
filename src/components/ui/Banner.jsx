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
  className = '',
  children 
}) => {
  return (
    <div 
      className={`relative min-h-[60vh] flex items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-accent/40 dark:from-primary/90 dark:via-primary/70 dark:to-accent/50"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 py-16 max-w-4xl mx-auto">
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
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white dark:from-primary to-transparent"></div>
    </div>
  );
};

export default Banner;
