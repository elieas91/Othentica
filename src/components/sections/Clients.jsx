import React, { useState, useEffect } from 'react';
import { clientsData } from '../../data/clientsData';

const Clients = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const shouldUseCarousel = clientsData.length > 6;
  const itemsPerView = 6;

  // Auto-rotate through clients every 4 seconds if carousel is active
  useEffect(() => {
    if (!shouldUseCarousel) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(clientsData.length / itemsPerView));
    }, 4000);

    return () => clearInterval(interval);
  }, [shouldUseCarousel]);

  const nextSlide = () => {
    if (!shouldUseCarousel) return;
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % Math.ceil(clientsData.length / itemsPerView)
    );
  };

  const prevSlide = () => {
    if (!shouldUseCarousel) return;
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.ceil(clientsData.length / itemsPerView) - 1;
      return prevIndex === 0 ? maxIndex : prevIndex - 1;
    });
  };

  const goToSlide = (index) => {
    if (!shouldUseCarousel) return;
    setCurrentIndex(index);
  };

  if (!shouldUseCarousel) {
    // Static flexbox layout for 6 or fewer clients
    return (
      <section className="py-16 px-8 lg:px-16 bg-neutral">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-primary dark:text-neutral mb-8">
              Our Clients
            </h2>
            <p className="text-xl text-primary dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Trusted by leading companies across various industries
            </p>
          </div>

          {/* Centered Client Logos with Flexbox */}
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-8 max-w-4xl">
              {clientsData.map((client) => (
                <div 
                  key={client.id}
                  className="text-center group w-32 h-32 flex-shrink-0"
                >
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105 w-full h-full flex items-center justify-center">
                    <img
                      src={client.logo}
                      alt={`${client.name} logo`}
                      className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Carousel layout for more than 6 clients
  const totalSlides = Math.ceil(clientsData.length / itemsPerView);
  const startIndex = currentIndex * itemsPerView;
  const endIndex = Math.min(startIndex + itemsPerView, clientsData.length);
  const currentClients = clientsData.slice(startIndex, endIndex);

  return (
    <section className="py-16 px-8 lg:px-16 bg-neutral">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary dark:text-neutral mb-8">
            Our Clients
          </h2>
          <p className="text-xl text-primary dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Trusted by leading companies across various industries
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Carousel Track */}
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-700 ease-in-out">
              <div className="flex justify-center w-full">
                <div className="flex flex-wrap justify-center gap-8">
                  {currentClients.map((client) => (
                    <div 
                      key={client.id}
                      className="text-center group w-32 h-32 flex-shrink-0"
                    >
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105 w-full h-full flex items-center justify-center">
                        <img
                          src={client.logo}
                          alt={`${client.name} logo`}
                          className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 text-primary dark:text-neutral p-3 rounded-full shadow-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 z-10"
            aria-label="Previous clients"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 text-primary dark:text-neutral p-3 rounded-full shadow-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 z-10"
            aria-label="Next clients"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel Indicators */}
          <div className="flex justify-center space-x-3 mt-8">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-600 dark:bg-blue-400 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
