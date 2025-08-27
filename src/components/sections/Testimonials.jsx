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

  // Get the two image cards for the current testimonial
  const currentImageCards = testimonialsData[currentIndex].images;

  return (
    <section className="py-16 px-8 lg:px-16 bg-pastel-blue">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Testimonial with Carousel */}
          <div className="text-left">
            <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-8">
              Testimonials
            </h2>

            {/* Carousel Content */}
            <div className="min-h-[200px] flex flex-col justify-center">
              <blockquote className="text-xl lg:text-2xl text-primary mb-8 leading-relaxed font-medium transition-all duration-700 ease-in-out">
                "{testimonialsData[currentIndex].quote}"
              </blockquote>
              <cite className="text-lg text-primary font-semibold transition-all duration-700 ease-in-out">
                – {testimonialsData[currentIndex].author}
              </cite>
            </div>

            {/* Carousel Indicators */}
            <div className="flex space-x-3 mt-8">
              {testimonialsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-8 h-8 transition-all duration-300 ${
                    index === currentIndex
                      ? 'opacity-100 scale-110'
                      : 'opacity-30 hover:opacity-60'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                >
                  <img
                    src={Flame}
                    alt={`Testimonial ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Two Image Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentImageCards.map((card, index) => (
              <div
                key={`${card.id}-${currentIndex}-${index}`}
                className="rounded-2xl shadow-lg overflow-hidden transition-all duration-700 ease-in-out"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover sepia-[0.3]"
                  />
                </div>
                <div className="p-6 text-start">
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{card.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
