import React from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const AnimateOnScroll = ({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 600,
  className = '',
  threshold = 0.1,
  rootMargin = '50px',
  ...props
}) => {
  const [ref, , hasIntersected] = useIntersectionObserver({
    threshold,
    rootMargin,
  });

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all ease-out';
    const durationClass = `duration-[${duration}ms]`;
    const delayClass = delay > 0 ? `delay-[${delay}ms]` : '';
    
    if (!hasIntersected) {
      switch (animation) {
        case 'fadeInUp':
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 translate-y-4`;
        case 'fadeInDown':
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 -translate-y-4`;
        case 'fadeInLeft':
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 -translate-x-4`;
        case 'fadeInRight':
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 translate-x-4`;
        case 'fadeIn':
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0`;
        case 'scaleIn':
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 scale-95`;
        case 'slideUp':
          return `${baseClasses} ${durationClass} ${delayClass} translate-y-6 opacity-0`;
        case 'slideDown':
          return `${baseClasses} ${durationClass} ${delayClass} -translate-y-6 opacity-0`;
        default:
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 translate-y-4`;
      }
    } else {
      // Animated state - elements are visible
      switch (animation) {
        case 'fadeInUp':
          return `${baseClasses} ${durationClass} ${delayClass} opacity-100 translate-y-0`;
        case 'fadeInDown':
          return `${baseClasses} ${durationClass} ${delayClass} opacity-100 translate-y-0`;
        case 'fadeInLeft':
          return `${baseClasses} ${durationClass} ${delayClass} opacity-100 translate-x-0`;
        case 'fadeInRight':
          return `${baseClasses} ${durationClass} ${delayClass} opacity-100 translate-x-0`;
        case 'fadeIn':
          return `${baseClasses} ${durationClass} ${delayClass} opacity-100`;
        case 'scaleIn':
          return `${baseClasses} ${durationClass} ${delayClass} opacity-100 scale-100`;
        case 'slideUp':
          return `${baseClasses} ${durationClass} ${delayClass} translate-y-0 opacity-100`;
        case 'slideDown':
          return `${baseClasses} ${durationClass} ${delayClass} translate-y-0 opacity-100`;
        default:
          return `${baseClasses} ${durationClass} ${delayClass} opacity-100 translate-y-0`;
      }
    }
  };

  return (
    <div
      ref={ref}
      className={`${getAnimationClasses()} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimateOnScroll;
