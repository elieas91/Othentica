import { useState, useEffect, useRef } from 'react';
import { missionVisionValuesData } from '../../../data/missionVisionValuesData';
import CompassIcon from '../../../assets/img/compass.svg';
import './CarouselMVV.css';

const CarouselMVV = ({ className = '', items }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Start with Mission (id=1) - first item
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateZ, setTranslateZ] = useState(700);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const carouselRef = useRef(null);
  const hasInitialized = useRef(false);
  const wheelTimeoutRef = useRef(null);
  const wheelAccumulator = useRef(0);

  // Auto-duplicate items to create more cards
  const duplicateItems = (items, times = 2) => {
    const duplicated = [];
    for (let i = 0; i < times; i++) {
      items.forEach((item) => {
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

  const sourceItems = Array.isArray(items) && items.length > 0 ? items : missionVisionValuesData;
  const carouselItems = duplicateItems(sourceItems, 2); // Duplicate 2 times (6 total items)
  const totalItems = carouselItems.length;
  const angleStep = 360 / totalItems;
  
  // Calculate rotation directly without state
  const rotation = -currentIndex * angleStep;

  // Function to truncate quote to 3 lines (similar to CSS line-clamp)
  const truncateQuote = (quote) => {
    const words = quote.split(' ');
    const lineLength = 50; // Approximate characters per line
    const maxChars = lineLength * 3; // 3 lines

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

  // Function to open modal with full content
  const openModal = (slide) => {
    setModalContent(slide);
    setShowModal(true);
  };

  // Function to close modal
  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };
  
  // Initialize component and enable transitions
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      
      // Enable transitions after a longer delay to ensure component is stable
      // Shorter delay on mobile for better performance
      const isMobile = window.innerWidth <= 768;
      const delay = isMobile ? 200 : 500;
      
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, []);

  // Cleanup wheel timeout on unmount
  useEffect(() => {
    return () => {
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
    };
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

  // Mouse wheel navigation with debouncing and threshold (desktop only)
  const handleWheel = (e) => {
    // Disable wheel navigation on mobile
    if (window.innerWidth <= 768) {
      return;
    }
    
    e.preventDefault();
    
    // Clear existing timeout
    if (wheelTimeoutRef.current) {
      clearTimeout(wheelTimeoutRef.current);
    }
    
    // Accumulate scroll delta
    wheelAccumulator.current += e.deltaY;
    
    // Set threshold for navigation (adjust this value to make it more/less sensitive)
    const scrollThreshold = 100;
    
    // If accumulated scroll exceeds threshold, navigate
    if (Math.abs(wheelAccumulator.current) >= scrollThreshold) {
      if (wheelAccumulator.current > 0) {
        goToNext();
      } else {
        goToPrev();
      }
      // Reset accumulator
      wheelAccumulator.current = 0;
    }
    
    // Reset accumulator after a delay if no more scroll events
    wheelTimeoutRef.current = setTimeout(() => {
      wheelAccumulator.current = 0;
    }, 150);
  };

  // Touch/Mouse drag handling - optimized for mobile
  const handleStart = (e) => {
    setIsDragging(true);
    setStartX(e.type === 'mousedown' ? e.clientX : e.touches[0].clientX);
    // Reset wheel accumulator when starting drag
    wheelAccumulator.current = 0;
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
    
    // Lower threshold on mobile for better touch responsiveness
    const isMobile = window.innerWidth <= 768;
    const threshold = isMobile ? 50 : 80;
    
    if (Math.abs(diff) > threshold) {
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
            
            // Get truncated quote for current slide
            const { truncated, needsTruncation } = truncateQuote(slide.description);
            
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
                  className="carousel-3d-item-content "
                  style={{
                    backgroundImage: `url(${slide.image})`,
                  }}
                >
                  <div className="carousel-3d-overlay">
                    <h3 className="carousel-3d-title">{slide.title}</h3>
                    <div className="carousel-3d-description-container">
                      <div 
                        className="carousel-3d-description"
                        dangerouslySetInnerHTML={{ 
                          __html: truncated
                        }}
                      />
                      {needsTruncation && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(slide);
                          }}
                          className="carousel-3d-read-more"
                          style={{ display: 'inline', verticalAlign: 'baseline' }}
                        >
                          Read More
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="desktop-nav">
        <button className="carousel-3d-nav carousel-3d-prev" onClick={goToPrev}>
          <img src={CompassIcon} alt="Previous" className="carousel-3d-nav-icon" />
        </button>
        <button className="carousel-3d-nav carousel-3d-next" onClick={goToNext}>
          <img src={CompassIcon} alt="Next" className="carousel-3d-nav-icon" />
        </button>
      </div>

      {/* Mobile navigation container */}
      <div className="carousel-3d-nav-container">
        <button className="carousel-3d-nav carousel-3d-prev mobile-nav" onClick={goToPrev}>
          <img src={CompassIcon} alt="Previous" className="carousel-3d-nav-icon" />
        </button>
        <button className="carousel-3d-nav carousel-3d-next mobile-nav" onClick={goToNext}>
          <img src={CompassIcon} alt="Next" className="carousel-3d-nav-icon" />
        </button>
      </div>

      {/* Thumbnail indicators */}
      <div className="carousel-3d-thumbnails">
        {carouselItems.map((slide, index) => {
          const normalizedIndex = (currentIndex % totalItems + totalItems) % totalItems;
          return (
            <button
              key={slide.id}
              className={`hidden md:block carousel-3d-thumbnail ${index === normalizedIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            >
              <img src={slide.image} alt={slide.title} />
            </button>
          );
        })}
      </div>

      {/* Modal for full content */}
      {showModal && modalContent && (
        <div className="carousel-3d-modal-overlay" onClick={closeModal}>
          <div className="carousel-3d-modal" onClick={(e) => e.stopPropagation()}>
            <div className="carousel-3d-modal-header">
              <h2 className="carousel-3d-modal-title">{modalContent.title}</h2>
              <button 
                className="carousel-3d-modal-close" 
                onClick={closeModal}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            <div className="carousel-3d-modal-content">
              <div className="carousel-3d-modal-image">
                <img 
                  src={modalContent.image} 
                  alt={modalContent.title}
                  className="carousel-3d-modal-img"
                />
              </div>
              <div className="carousel-3d-modal-text">
                <div 
                  className="carousel-3d-modal-description"
                  dangerouslySetInnerHTML={{ 
                    __html: modalContent.description
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **text** to <strong>text</strong>
                      .replace(/\n/g, '<br/>') 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselMVV;

