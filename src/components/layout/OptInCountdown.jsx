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
    <div className="w-full h-20 bg-primary text-center py-3 shadow-md flex flex-col items-center justify-center">
      <p className="font-semibold text-2xl text-white">
        <span className="text-secondary">
          {'⏳' + spotsLeft.toLocaleString()}
        </span>{' '}
        spots left!
      </p>
      <p className="ml-2 text-xl opacity-90 text-white">
        {spotsLeft > 0 ? `Hurry before they run out!` : 'All spots filled!'}
      </p>
    </div>
  );
};

export default OptInCountdown;
