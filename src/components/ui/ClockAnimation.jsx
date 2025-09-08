import React, { useEffect, useState } from 'react';

const ClockAnimation = ({ duration = 60 }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // SVG circle math
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = ((duration - timeLeft) / duration) * circumference;

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-32 h-32 -rotate-90">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="#e5e7eb" // gray-200
            strokeWidth="8"
            fill="transparent"
          />
          {/* Animated circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="#d77644"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        {/* Number in center */}
        <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
          {timeLeft}
        </span>
      </div>
    </div>
  );
};

export default ClockAnimation;
