import React, { useState, useEffect } from 'react';

// Top Banner Component
const OptInCountdown = () => {
  const [spotsLeft, setSpotsLeft] = useState(1000); // start at 1000

  useEffect(() => {
    // Example: simulate users registering every 5 seconds
    const interval = setInterval(() => {
      setSpotsLeft((prev) =>
        prev > 0 ? prev - (Math.floor(Math.random() * 5) + 1) : 0
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-20 bg-primary text-white text-center py-3 shadow-md flex items-center justify-center">
      <span className="font-semibold text-xl">
        {spotsLeft.toLocaleString()} spots left!
      </span>{' '}
      <span className="ml-2 text-xl opacity-90">
        {spotsLeft > 0 ? `Hurry before they run out!` : '🔥 All spots filled!'}
      </span>
    </div>
  );
};

export default OptInCountdown;
