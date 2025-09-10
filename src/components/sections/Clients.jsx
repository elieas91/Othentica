import React, { useState, useEffect, useRef } from 'react';
import { clientsData } from '../../data/clientsData';

const Clients = () => {
  const shouldUseCarousel = clientsData.length > 6;
  
  // Drag functionality
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef(null);
  
  // Create infinite scroll data by duplicating clients
  const infiniteClientsData = [...clientsData, ...clientsData, ...clientsData];

  // Auto-rotate through clients every 4 seconds if carousel is active
  useEffect(() => {
    if (!shouldUseCarousel || isDragging) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const scrollAmount = 272; // w-36 (144px) + gap-32 (128px)
        carouselRef.current.scrollLeft += scrollAmount;
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [shouldUseCarousel, isDragging]);

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    if (!shouldUseCarousel) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
    carouselRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    if (!shouldUseCarousel) return;
    setIsDragging(false);
    carouselRef.current.style.cursor = 'grab';
  };

  const handleMouseUp = () => {
    if (!shouldUseCarousel) return;
    setIsDragging(false);
    carouselRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e) => {
    if (!shouldUseCarousel || !isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  // Handle infinite scroll reset
  const handleScroll = () => {
    if (!carouselRef.current) return;
    
    const { scrollLeft } = carouselRef.current;
    const singleSetWidth = clientsData.length * (144 + 128); // w-36 (144px) + gap-32 (128px)
    
    // If scrolled past the first set, reset to beginning
    if (scrollLeft >= singleSetWidth) {
      carouselRef.current.scrollLeft = scrollLeft - singleSetWidth;
    }
  };




  if (!shouldUseCarousel) {
    // Static flexbox layout for 6 or fewer clients
    return (
      <section className="py-16 px-8 lg:px-16 bg-white">
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
            <div className="flex flex-wrap justify-center gap-32 max-w-4xl">
              {clientsData.map((client) => (
                <div
                  key={client.id}
                  className="text-center group w-36 aspect-square flex-shrink-0 relative"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={client.logo}
                      alt={`${client.name} logo`}
                      className="w-full h-full cursor-pointer object-contain transition-all duration-300 group-hover:scale-105"
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

  return (
    <section className="py-16 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary dark:text-neutral mb-8">
            Our Clients
          </h2>
          <p className="text-xl text-primary dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Trusted by leading organizations worldwide
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Carousel Track */}
          <div className="overflow-hidden">
            <div 
              ref={carouselRef}
              className="flex overflow-x-auto scrollbar-hide cursor-grab select-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onScroll={handleScroll}
            >
              <div className="flex gap-32 px-8 py-4">
                {infiniteClientsData.map((client, index) => (
                  <div
                    key={`${client.id}-${index}`}
                    className="text-center group w-36 aspect-square flex-shrink-0 relative"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={client.logo}
                        alt={`${client.name} logo`}
                        className="w-full h-full object-contain cursor-pointer transition-all duration-300 group-hover:scale-105"
                        draggable={false}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Clients;
