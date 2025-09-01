import React, { useState, useEffect } from 'react';
import Flame from '../../assets/img/flame.webp';
import Testimonial1 from '../../assets/img/testimonials/testimonial-1.webp';
import Testimonial2 from '../../assets/img/testimonials/testimonial-2.webp';
import Testimonial3 from '../../assets/img/testimonials/testimonial-3.webp';
import Testimonial4 from '../../assets/img/testimonials/testimonial-4.webp';
import Testimonial5 from '../../assets/img/testimonials/testimonial-5.webp';
import Testimonial6 from '../../assets/img/testimonials/testimonial-6.webp';
import {
  testimonialsData,
  testimonialCategories,
} from '../../data/testimonialsData';

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
  const currentCategory = testimonialCategories.find(
    (cat) => cat.id === currentTestimonial.categoryId
  );

  // Get two different categories for the right side images
  const getTwoDifferentCategories = () => {
    if (testimonialCategories.length < 2) return [currentCategory];
    // Pick current category and next one (wrap around)
    const currentIdx = testimonialCategories.findIndex(cat => cat.id === currentCategory.id);
    const nextIdx = (currentIdx + 1) % testimonialCategories.length;
    return [testimonialCategories[currentIdx], testimonialCategories[nextIdx]];
  };
  const categoriesForImages = getTwoDifferentCategories();

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
    setExpandedQuotes((prev) => ({
      ...prev,
      [testimonialId]: !prev[testimonialId],
    }));
  };

  // Get truncated quote for current testimonial
  const { truncated, needsTruncation } = truncateQuote(
    currentTestimonial.quote
  );
  const isExpanded = expandedQuotes[currentTestimonial.id];

  return (
    <section className="py-16 px-8 lg:px-16 bg-gradient-to-br from-neutral/40 via-accent/10 to-white relative overflow-hidden">
      {/* Subtle background pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(212,118,68,0.01)_0%,transparent_50%)]"></div>
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(244,223,196,0.03)_0%,transparent_50%)]"></div>
      <div className="max-w-7xl mx-auto relative z-10">
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
              <blockquote
                className="text-xl lg:text-2xl text-primary mb-8 leading-relaxed font-medium transition-all duration-700 ease-in-out"
                style={{ display: 'inline' }}
              >
                "{isExpanded ? currentTestimonial.quote : truncated}"
                {needsTruncation && (
                  <button
                    onClick={() => toggleQuoteExpansion(currentTestimonial.id)}
                    className="ml-2 text-primary/80 hover:text-primary font-medium text-lg mb-0 transition-colors duration-300 underline decoration-primary/30 hover:decoration-primary/60"
                    style={{ display: 'inline', verticalAlign: 'baseline' }}
                  >
                    {isExpanded ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </blockquote>

              <cite className="text-lg text-primary font-semibold transition-all duration-700 ease-in-out">
                <span className="flex items-center gap-3">
                  <img
                    src={getTestimonialImagePath(currentTestimonial.image)}
                    alt={currentTestimonial.author}
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary/30 shadow"
                  />
                  <span>– {currentTestimonial.author}</span>
                </span>
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

          {/* Right Side - Two Images from Different Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoriesForImages.map((cat, idx) => {
              // Pick the first image from each category
              const imageName = cat.images[0];
              return (
                <div
                  key={`${cat.id}-${imageName}-${idx}`}
                  className="rounded-2xl shadow-lg overflow-hidden transition-all duration-700 ease-in-out group hover:shadow-xl bg-gradient-to-br from-primary/5 to-primary/10"
                >
                  <div className="h-64 w-full relative">
                    <img
                      src={getTestimonialImagePath(imageName)}
                      alt={`${cat.name} - ${imageName}`}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{ minHeight: '100%', minWidth: '100%' }}
                    />
                  </div>
                  <div className="p-6 text-start">
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {cat.description}
                    </p>
                    <div className="mt-3 text-xs text-primary/70 font-medium">
                      {cat.count} testimonials
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
