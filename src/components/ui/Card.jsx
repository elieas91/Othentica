import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-pink-100 dark:bg-gray-800 rounded-2xl p-6 shadow-professional hover:shadow-xl-professional transition-all duration-300 flex flex-col ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
