import { useState, useEffect, useRef } from 'react';
import { missionVisionValuesData } from '../../../data/missionVisionValuesData';
import CompassIcon from '../../../assets/img/compass.svg';
import './CarouselMVV.css';

const CarouselMVV = ({ className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Start with Mission (id=1) - first item
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateZ, setTranslateZ] = useState(700);
  const [isLoaded, setIsLoaded] = useState(false);
  const carouselRef = useRef(null);
  const hasInitialized = useRef(false);

  // Auto-duplicate items to create more cards
  const duplicateItems = (items, times = 2) => {
    const duplicated = [];
    for (let i = 0; i < times; i++) {
      items.forEach((item, index) => {
        duplicated.push({
          ...item,
          id: `${item.id}-${i}`,
          originalId: item.id,
          duplicateIndex: i
        });
      });
    }
    return duplicated;
  };

  const carouselItems = duplicateItems(missionVisionValuesData, 2); // Duplicate 2 times (6 total items)
  const totalItems = carouselItems.length;
  const angleStep = 360 / totalItems;
  
  // Calculate rotation directly without state
  const rotation = -currentIndex * angleStep;
  
  // Initialize component and enable transitions
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      
      // Enable transitions after a longer delay to ensure component is stable
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Responsive translateZ values
  const getTranslateZ = () => {
    if (window.innerWidth <= 480) return 500;
    if (window.innerWidth <= 768) return 600;
    return 700;
  };

  // Update translateZ on window resize
  useEffect(() => {
    const updateTranslateZ = () => {
      setTranslateZ(getTranslateZ());
    };

    updateTranslateZ();
    window.addEventListener('resize', updateTranslateZ);
    return () => window.removeEventListener('resize', updateTranslateZ);
  }, []);


  // Navigation functions with continuous rotation
  const goToNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Mouse wheel navigation
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      goToNext();
    } else {
      goToPrev();
    }
  };

  // Touch/Mouse drag handling
  const handleStart = (e) => {
    setIsDragging(true);
    setStartX(e.type === 'mousedown' ? e.clientX : e.touches[0].clientX);
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const endX = e.type === 'mouseup' ? e.clientX : e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      id="mission-vision-values"
      className={`carousel-3d-container ${className}`}
      onWheel={handleWheel}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <div className="carousel-3d-wrapper">
        <div
          ref={carouselRef}
          className={`carousel-3d ${isLoaded ? 'loaded' : ''}`}
          style={{
            transform: `translateZ(-${translateZ}px) rotateY(${rotation}deg)`,
          }}
        >
          {carouselItems.map((slide, index) => {
            const itemAngle = index * angleStep;
            const isActive = index === (currentIndex % totalItems + totalItems) % totalItems;
            
            return (
              <div
                key={slide.id}
                className={`carousel-3d-item ${isActive ? 'active' : ''}`}
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${translateZ}px)`,
                }}
                onClick={() => goToSlide(index)}
              >
                <div
                  className="carousel-3d-item-content"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                  }}
                >
                  <div className="carousel-3d-overlay">
                    <h3 className="carousel-3d-title">{slide.title}</h3>
                    <p className="carousel-3d-description">{slide.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation buttons */}
      <button className="carousel-3d-nav carousel-3d-prev" onClick={goToPrev}>
        <img src={CompassIcon} alt="Previous" className="carousel-3d-nav-icon" />
      </button>
      <button className="carousel-3d-nav carousel-3d-next" onClick={goToNext}>
        <img src={CompassIcon} alt="Next" className="carousel-3d-nav-icon" />
      </button>

      {/* Thumbnail indicators */}
      <div className="carousel-3d-thumbnails">
        {carouselItems.map((slide, index) => {
          const normalizedIndex = (currentIndex % totalItems + totalItems) % totalItems;
          return (
            <button
              key={slide.id}
              className={`carousel-3d-thumbnail ${index === normalizedIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            >
              <img src={slide.image} alt={slide.title} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CarouselMVV;
