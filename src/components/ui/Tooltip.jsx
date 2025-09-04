import React, { useState } from 'react';

const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => {
          console.log('Mouse enter - showing tooltip');
          setIsVisible(true);
        }}
        onMouseLeave={() => {
          console.log('Mouse leave - hiding tooltip');
          setIsVisible(false);
        }}
        onFocus={() => {
          console.log('Focus - showing tooltip');
          setIsVisible(true);
        }}
        onBlur={() => {
          console.log('Blur - hiding tooltip');
          setIsVisible(false);
        }}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          className={`absolute z-[9999] px-2 py-1 text-[10px] text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap pointer-events-none ${
            position === 'top' ? 'bottom-full left-1/2 transform -translate-x-1/2 mb-2' :
            position === 'bottom' ? 'top-full left-1/2 transform -translate-x-1/2 mt-2' :
            position === 'left' ? 'right-full top-1/2 transform -translate-y-1/2 mr-2' :
            'left-full top-1/2 transform -translate-y-1/2 ml-2'
          }`}
        >
          {content}
          {/* Arrow */}
          <div
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 mb-1' :
              position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
              'right-full top-1/2 -translate-y-1/2 mr-1'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
