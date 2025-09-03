import React, { useState } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  fetchPriority = 'auto',
  sizes,
  onLoad,
  onError,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik02IDZIMTBWMTBINlY2WiIgZmlsbD0iI2U1ZTdlYiIvPgo8L3N2Zz4K',
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [ref, isIntersecting, hasIntersected] = useIntersectionObserver();

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Placeholder */}
      {!imageLoaded && !imageError && (
        <div
          className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <img
            src={placeholder}
            alt=""
            className="w-8 h-8 opacity-50"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Actual image */}
      {hasIntersected && !imageError && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          fetchPriority={fetchPriority}
          sizes={sizes}
          className={`transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}

      {/* Error state */}
      {imageError && (
        <div
          className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500"
          style={{ width, height }}
        >
          <span className="text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
