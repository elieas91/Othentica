import React, { useState } from 'react';
import { testimonialsData } from '../../data/testimonialsData';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  return (
    <section className="py-24 px-8 lg:px-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="text-left">
            <h2 className="text-4xl lg:text-5xl font-bold text-blue-900 dark:text-white mb-8">
              What Our Clients Say
            </h2>
            <p className="text-xl text-blue-900 dark:text-gray-200 mb-8 leading-relaxed">
              Discover how our wellness services have transformed lives and brought positive change to our community.
            </p>
            
            {/* Navigation Dots */}
            <div className="flex space-x-3 mb-8">
              {testimonialsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-4 h-4 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-pink-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <div className="flex space-x-4">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-gray-400 hover:text-pink-500 hover:shadow-xl transition-all duration-300"
              >
                ‹
              </button>
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-gray-400 hover:text-pink-500 hover:shadow-xl transition-all duration-300"
              >
                ›
              </button>
            </div>
          </div>
          
          {/* Right Side - Testimonial with Flame Background */}
          <div className="relative">
            <div className="bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 rounded-3xl p-12 relative shadow-2xl overflow-hidden">
              {/* Flame-like background elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-300/20 via-red-400/20 to-pink-500/20"></div>
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-300/30 to-orange-400/30 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-400/30 to-red-500/30 rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-orange-300/20 to-red-400/20 rounded-full blur-lg"></div>
              
              {/* Testimonial Content */}
              <div className="relative z-10 text-center">
                <div className="text-6xl text-white/80 mb-6">"</div>
                <blockquote className="text-xl lg:text-2xl text-white mb-8 leading-relaxed font-medium">
                  {testimonialsData[currentIndex].quote}
                </blockquote>
                <cite className="text-lg text-white/90 font-semibold">
                  – {testimonialsData[currentIndex].author}
                </cite>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
