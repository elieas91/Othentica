import React, { useState, useEffect } from 'react';
import Flame from '../../assets/img/flame.webp';
import Testimonial1 from '../../assets/img/testimonials/testimonial-1.webp';
import Testimonial2 from '../../assets/img/testimonials/testimonial-2.webp';
import Testimonial3 from '../../assets/img/testimonials/testimonial-3.webp';
import Testimonial4 from '../../assets/img/testimonials/testimonial-4.webp';
import Testimonial5 from '../../assets/img/testimonials/testimonial-5.webp';
import Testimonial6 from '../../assets/img/testimonials/testimonial-6.webp';
import { testimonialsData, testimonialCategories } from '../../data/testimonialsData';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedQuotes, setExpandedQuotes] = useState({});

  // Auto-rotate through testimonials every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
    }, 4000);

    return () => clearInterval(interval);
  });

  // Get the current testimonial and its category
  const currentTestimonial = testimonialsData[currentIndex];
  const currentCategory = testimonialCategories.find(cat => cat.id === currentTestimonial.categoryId);

  // Function to get testimonial image path
  const getTestimonialImagePath = (imageName) => {
    const imageMap = {
      'testimonial-1': Testimonial1,
      'testimonial-2': Testimonial2,
      'testimonial-3': Testimonial3,
      'testimonial-4': Testimonial4,
      'testimonial-5': Testimonial5,
      'testimonial-6': Testimonial6,
    };
    return imageMap[imageName] || Testimonial1; // fallback to first image
  };

  // Function to truncate quote to 2 lines
  const truncateQuote = (quote) => {
    const words = quote.split(' ');
    const lineLength = 60; // Approximate characters per line
    const maxChars = lineLength * 2;
    
    if (quote.length <= maxChars) {
      return { truncated: quote, needsTruncation: false };
    }
    
    let truncated = '';
    let charCount = 0;
    
    for (let i = 0; i < words.length; i++) {
      if (charCount + words[i].length + 1 <= maxChars) {
        truncated += (truncated ? ' ' : '') + words[i];
        charCount += words[i].length + 1;
      } else {
        break;
      }
    }
    
    return { truncated: truncated + '...', needsTruncation: true };
  };

  // Function to toggle quote expansion
  const toggleQuoteExpansion = (testimonialId) => {
    setExpandedQuotes(prev => ({
      ...prev,
      [testimonialId]: !prev[testimonialId]
    }));
  };

  // Get truncated quote for current testimonial
  const { truncated, needsTruncation } = truncateQuote(currentTestimonial.quote);
  const isExpanded = expandedQuotes[currentTestimonial.id];

  return (
    <section className="py-16 px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Testimonial with Carousel */}
          <div className="text-left">
            <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-8">
              Testimonials
            </h2>

            {/* Category Badge */}
            {currentCategory && (
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold rounded-full text-sm">
                  {currentCategory.name}
                </span>
              </div>
            )}

            {/* Carousel Content */}
            <div className="min-h-[200px] flex flex-col justify-center">
              <blockquote className="text-xl lg:text-2xl text-primary mb-8 leading-relaxed font-medium transition-all duration-700 ease-in-out">
                "{isExpanded ? currentTestimonial.quote : truncated}"
              </blockquote>
              
              {/* Read More Link */}
              {needsTruncation && (
                <button
                  onClick={() => toggleQuoteExpansion(currentTestimonial.id)}
                  className="text-primary/80 hover:text-primary font-medium text-lg mb-4 transition-colors duration-300 underline decoration-primary/30 hover:decoration-primary/60"
                >
                  {isExpanded ? 'Read Less' : 'Read More'}
                </button>
              )}
              
              <cite className="text-lg text-primary font-semibold transition-all duration-700 ease-in-out">
                – {currentTestimonial.author}
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

          {/* Right Side - Category Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentCategory?.images.map((imageName, index) => (
              <div
                key={`${currentCategory.id}-${imageName}-${index}`}
                className="rounded-2xl shadow-lg overflow-hidden transition-all duration-700 ease-in-out group hover:shadow-xl"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={getTestimonialImagePath(imageName)}
                    alt={`${currentCategory.name} - ${imageName}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 text-start bg-gradient-to-br from-primary/5 to-primary/10">
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {currentCategory.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {currentCategory.description}
                  </p>
                  <div className="mt-3 text-xs text-primary/70 font-medium">
                    {currentCategory.count} testimonials
                  </div>
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
