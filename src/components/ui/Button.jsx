import React from 'react';

const Button = ({ 
  children, 
  variant = 'accent', 
  size = 'default',
  onClick, 
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900';
  
  const variants = {
    primary: 'bg-pink-500 text-white hover:bg-pink-600 focus:ring-pink-500 shadow-md hover:shadow-lg',
    accent: 'bg-accent text-primary hover:bg-accent/80 focus:ring-accent shadow-md hover:shadow-lg',
    secondary: 'bg-pink-200 dark:bg-pink-800 text-blue-900 dark:text-white hover:bg-pink-300 dark:hover:bg-pink-700 focus:ring-pink-500',
    outline: 'border-2 border-pink-500 text-pink-500 dark:text-pink-400 hover:bg-pink-500 hover:text-white dark:hover:bg-pink-500 dark:hover:text-white'
  };

  const sizes = {
    small: 'px-4 py-2 text-sm',
    default: 'px-6 py-3',
    large: 'px-8 py-4 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
