import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-300 flex flex-col
    hover:shadow-professional hover:shadow-xl-professional ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
