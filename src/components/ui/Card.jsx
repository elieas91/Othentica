import React from 'react';
// import flameIcon from '../../assets/img/flame.webp';

const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-300 flex flex-col relative overflow-hidden
    hover:shadow-professional hover:shadow-xl-professional ${className}`}
    >
      {/* Flame animation on hover */}
      {/* <div className="absolute top-2 left-2 opacity-0 hover:opacity-100 transition-opacity duration-300 group-hover:opacity-100">
        <img
          src={flameIcon}
          alt="Flame"
          className="w-6 h-10 animate-pulse hover:animate-bounce transition-all duration-100 hover:scale-110"
        />
      </div> */}

      {children}
    </div>
  );
};

export default Card;
