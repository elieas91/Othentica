import React from 'react';

const Button = ({
  children,
  variant = 'accent',
  size = 'default',
  onClick,
  className = '',
  type = 'button',
  glow = false,
  glowColor = '215,118,68', //default orange
}) => {
  const baseClasses =
    'rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-primary';

  const variants = {
    primary:
      'bg-primary text-neutral hover:bg-primary/80 focus:ring-primary shadow-md hover:shadow-lg',
    accent:
      'bg-accent text-primary hover:bg-accent/80 focus:ring-accent shadow-md hover:shadow-lg',
    secondary:
      'bg-secondary text-white hover:bg-secondary/80 focus:ring-secondary shadow-md hover:shadow-lg',
    outline:
      'border-2 border-pink-500 text-pink-500 dark:text-pink-400 hover:bg-pink-500 hover:text-neutral dark:hover:bg-pink-500 dark:hover:text-neutral',
  };

  const sizes = {
    small: 'px-6 py-3 text-sm min-h-[44px] min-w-[44px]',
    default: 'px-8 py-4 min-h-[44px] min-w-[44px]',
    large: 'px-10 py-5 text-lg min-h-[48px] min-w-[48px]',
  };

  const glowClasses = glow ? `animate-glow` : '';

  const glowStyle = glow
    ? {
        '--glow-color': glowColor,
      }
    : {};

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${glowClasses} ${className}`}
      style={glowStyle}
    >
      {children}
    </button>
  );
};

export default Button;
