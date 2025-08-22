import React from 'react';
import Button from '../ui/Button';

const Philosophy = () => {
  return (
    <section className="py-24 px-8 lg:px-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        {/* Left Image */}
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-800 dark:to-pink-900 rounded-3xl overflow-hidden shadow-xl-professional">
            {/* Placeholder for the woman writing image */}
            <div className="w-full h-full bg-gradient-to-br from-pink-300 to-pink-400 dark:from-pink-700 dark:to-pink-800 flex items-center justify-center">
              <div className="text-8xl">📝</div>
            </div>
          </div>
        </div>
        
        {/* Right Text */}
        <div className="space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-blue-900 dark:text-white">
            Our Philosophy
          </h2>
          <p className="text-lg lg:text-xl text-blue-900 dark:text-gray-200 leading-relaxed">
            At Othentica, we believe in living authentically. Our approach to wellness is grounded in balance, self-discovery, and the inner fire that drives us. We understand that true wellness comes from within, and we're here to guide you on that journey of self-discovery and authentic living.
          </p>
          <p className="text-lg lg:text-xl text-blue-900 dark:text-gray-200 leading-relaxed">
            Through our holistic approach, we help you create sustainable habits that honor your unique needs and support your overall well-being.
          </p>
          <Button variant="secondary" size="large">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
