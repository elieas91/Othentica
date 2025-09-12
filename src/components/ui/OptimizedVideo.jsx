import React, { useRef, useEffect } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const OptimizedVideo = ({
  src,
  className = '',
  loop = true,
  muted = true,
  playsInline = true,
  autoPlay = true,
  preload = 'metadata',
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const videoRef = useRef();
  const [ref, isIntersecting, hasIntersected] = useIntersectionObserver({
    threshold: 0.5,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Only load and play video when it's in viewport
    if (hasIntersected && video.readyState === 0) {
      video.load();
    }

    // Auto-play when video comes into viewport
    if (isIntersecting && autoPlay && video.readyState >= 3) {
      video.play().catch(() => {
        // Ignore autoplay errors (browser restrictions)
      });
    } else if (!isIntersecting && video.readyState >= 3) {
      // Pause when video goes out of viewport
      video.pause();
    }
  }, [hasIntersected, isIntersecting, autoPlay]);

  const handleMouseEnter = (e) => {
    if (e.target.paused) {
      e.target.play().catch(() => {
        // Ignore autoplay errors
      });
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e) => {
    // Only pause on mouse leave if video is not in viewport
    if (!isIntersecting) {
      e.target.pause();
    }
    onMouseLeave?.(e);
  };

  return (
    <div ref={ref} className={className}>
      {hasIntersected && (
        <video
          ref={videoRef}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          autoPlay={autoPlay}
          preload={preload}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedVideo;
