import React, { useState, useEffect } from 'react';
import Flame from '../../assets/img/flame.webp';
import { testimonialsData } from '../../data/testimonialsData';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate through testimonials every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
    }, 4000);

    return () => clearInterval(interval);
  });

  return (
    <section className="py-20 px-8 lg:px-16 bg-pastel-blue">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold text-primary mb-6">
            What Our Clients Say
          </h2>
          <p className="text-xl text-primary/80 max-w-2xl mx-auto">
            Discover the transformative experiences of those who have journeyed with us
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative">
          {/* Main Testimonial Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 lg:p-16 shadow-2xl border border-white/20 mb-12">
            <div className="min-h-[300px] flex flex-col justify-center items-center text-center">
              {/* Quote Icon */}
              <div className="text-6xl text-primary/20 mb-8">"</div>
              
              {/* Testimonial Quote */}
              <blockquote className="text-xl lg:text-2xl text-primary mb-8 leading-relaxed font-medium transition-all duration-700 ease-in-out max-w-4xl">
                {testimonialsData[currentIndex].quote}
              </blockquote>
              
              {/* Author */}
              <cite className="text-lg text-primary font-semibold transition-all duration-700 ease-in-out">
                – {testimonialsData[currentIndex].author}
              </cite>
            </div>
          </div>

          {/* Enhanced Carousel Indicators with Flames */}
          <div className="flex justify-center space-x-4">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`group transition-all duration-500 ${
                  index === currentIndex
                    ? 'scale-125 opacity-100'
                    : 'scale-100 opacity-40 hover:opacity-80 hover:scale-110'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              >
                <div className="relative">
                  <img
                    src={Flame}
                    alt={`Testimonial ${index + 1}`}
                    className={`w-10 h-10 object-contain transition-all duration-300 ${
                      index === currentIndex ? 'animate-pulse' : ''
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentIndex((prevIndex) => 
              prevIndex === 0 ? testimonialsData.length - 1 : prevIndex - 1
            )}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => setCurrentIndex((prevIndex) => 
              (prevIndex + 1) % testimonialsData.length
            )}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
