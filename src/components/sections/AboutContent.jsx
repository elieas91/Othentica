import React from 'react';

const AboutContent = ({ 
  title = "Driving Purpose Forward",
  description = "At Othentica, our mission is to empower businesses through innovative digital solutions that drive growth and create meaningful connections. We combine cutting-edge technology with creative excellence to transform your vision into digital reality, helping you achieve your goals in an ever-evolving digital landscape.",
  imageSrc,
  videoSrc,
  imageAlt = "Othentica Content",
  showFloatingCircles = true,
  showGradients = true,
  showPlayButton = true,
  flipped = false,
  sectionId
}) => {
  return (
    <>
      {/* Main Content Section */}
      <div className="about-content container mx-auto pt-10" id={sectionId}>
        {/* <h1 className="text-5xl font-bold text-primary dark:text-neutral mb-8">
          {title}
        </h1> */}
        <div className="flex flex-col md:flex-row relative">
          {/* Connector Line - Only visible when flipped */}
          {flipped && (
            <div className="absolute top-1/2 left-1/3 w-1/3 h-2 bg-gradient-to-r from-[#3470cb] via-[#3470cb] to-transparent hidden md:block z-0 rounded-r-full"></div>
          )}

          {/* Image Section */}
          <div className={`relative flex w-full items-end overflow-visible md:w-2/3 ${flipped ? 'md:order-last' : 'md:order-first'}`}>
            {/* Floating Circles */}
            {showFloatingCircles && (
              <div
                className={`${flipped ? 'left-[-5rem] rotate-90 top-[84%]' : 'right-0'} absolute bottom-0 hidden h-20 w-20 translate-x-1/2 translate-y-1/2 md:block`}
                style={{ background: "#3470cb" }}
              >
                <div className="absolute h-20 w-20 -translate-y-1/2 translate-x-1/2 rounded-full bg-neutral"></div>
                <div className="absolute h-20 w-20 -translate-x-1/2 translate-y-1/2 rounded-full bg-neutral"></div>
              </div>
            )}

            {/* Image Container */}
            <div
              className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl md:aspect-video"
              style={{ background: "#3470cb" }}
            >
              {/* Mobile Image */}
              {imageSrc && (
                <img
                  alt={imageAlt}
                  loading="lazy"
                  width="600"
                  height="600"
                  decoding="async"
                  className="absolute inset-0 block h-full w-full object-cover md:hidden"
                  src={imageSrc}
                />
              )}

              {/* Desktop Image */}
              {imageSrc && (
                <img
                  alt={imageAlt}
                  loading="lazy"
                  width="1600"
                  height="900"
                  decoding="async"
                  className="absolute inset-0 hidden h-full w-full object-cover md:block"
                  src={imageSrc}
                />
              )}

              {/* Mobile Gradient */}
              {showGradients && (
                <div
                  className="absolute inset-x-0 bottom-0 top-2/3 block md:hidden"
                  style={{
                    background: "linear-gradient(to bottom, transparent 0%, #3470cb 100%)",
                  }}
                ></div>
              )}

              {/* Desktop Gradient */}
              {showGradients && (
                <div
                  className="absolute inset-0 hidden md:block"
                  style={{
                    background: `${flipped ? 'linear-gradient(to bottom left, transparent 70%, #3470cb 90%)' : 'linear-gradient(to bottom right, transparent 70%, #3470cb 90%)'}`,
                  }}
                ></div>
              )}
            </div>
          </div>

          {/* Text Section */}
          <div className={`relative z-10 w-full py-5 md:w-1/3 md:p-10 xl:p-20 ${flipped ? 'md:order-first' : 'md:order-last'}`}>
            <h2 className="text-4xl font-bold text-primary dark:text-neutral mb-4">
              {title}
            </h2>
            <div className="prose">
              <p>
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Showcase Section */}
      {videoSrc && (
        <div className={`flex ${flipped ? 'justify-start pr-10 pl-[4.5rem]' : 'justify-end pl-10 pr-[4.5rem]'} pb-10`}>
          <div className="flex h-auto w-full md:w-1/3">
            <div className="relative flex aspect-video w-full translate-x-0 items-center justify-center overflow-hidden rounded-2xl bg-contrast py-10">
              {/* Video */}
              <video
                loop
                muted
                playsInline
                autoPlay
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
                src={videoSrc}
              ></video>

              {/* Desktop Gradient */}
              {showGradients && (
                <div
                  className="absolute inset-0 hidden md:block"
                  style={{
                    background: `${flipped ? 'linear-gradient(to top right, transparent 70%, #3470cb 90%)' : 'linear-gradient(to top left, transparent 70%, #3470cb 90%)'}`,
                  }}
                ></div>
              )}

              {/* Mobile Gradient */}
              {showGradients && (
                <div
                  className="absolute inset-0 block md:hidden"
                  style={{
                    background: "linear-gradient(to top, transparent 50%, #3470cb 100%)",
                  }}
                ></div>
              )}

              {/* Play Button */}
              {showPlayButton && (
                <button className="cursor-pointer group inline-flex items-center justify-center gap-2 font-medium text-center tracking-wide rounded-full duration-500 bg-white/10 hover:bg-white/20 text-white backdrop-blur w-auto text-xs md:text-sm py-3 md:py-4 px-6 md:px-8 relative z-10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="transparent"
                    className="flex h-6 w-6 fill-current"
                  >
                    <title>Play</title>
                    <path d="M17.2335 11.1362C17.895 11.5221 17.895 12.4779 17.2335 12.8638L6.50387 19.1227C5.83721 19.5116 5 19.0308 5 18.259V5.74104C5 4.96925 5.83721 4.48838 6.50387 4.87726L17.2335 11.1362Z"></path>
                  </svg>
                  <span>Watch video</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AboutContent;
