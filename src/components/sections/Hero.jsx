import React from 'react';
import Button from '../ui/Button';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-start px-8 lg:px-16">
      {/* Background Image - using a placeholder for now */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-pink-200 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-black bg-opacity-10 dark:bg-opacity-20"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl">
        <h1 className="text-5xl lg:text-7xl font-bold text-primary dark:text-white mb-8 leading-tight">
          Wellness Rooted in Authentic Living
        </h1>
        <p className="text-xl lg:text-2xl text-blue-900 dark:text-gray-200 mb-10 leading-relaxed max-w-3xl">
          Empowering your mind, body, and spirit with balance. Discover the transformative power of authentic wellness practices.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="primary" size="large">
            Start Your Journey
          </Button>
          <Button variant="outline" size="large">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
