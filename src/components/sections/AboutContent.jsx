import React from 'react';


const AboutContent = ({
  title = 'Driving Purpose Forward',
  description = 'At Othentica, our mission is to empower businesses through innovative digital solutions that drive growth and create meaningful connections. We combine cutting-edge technology with creative excellence to transform your vision into digital reality, helping you achieve your goals in an ever-evolving digital landscape.',
  imageSrc,
  videoSrc,
  imageAlt = 'Othentica Content',
  floatingImageSrc, // Separate image for floating circle
  floatingImageAlt = 'Floating Circle Image',
  backgroundImageSrc, // Background image for text section
  backgroundImageAlt = 'Background Image',
  // showFloatingCircles = true, // Currently unused but kept for future implementation
  showGradients = true,
  showPlayButton = true,
  flipped = false,
  sectionId,
  index = 0, // Add index prop for alternating layout
}) => {
  // Determine if this is an even or odd index for alternating layout
  const isEven = index % 2 === 0;
  const shouldFlip = flipped || !isEven; // Use flipped prop or alternate based on index

  return (
    <>
      <div className="about-content flex items-center justify-center container mx-auto pt-10 h-screen my-36" id={sectionId}>
        {/* Image section - positioned based on alternating layout */}
        <div className={`w-1/2 overflow-hidden h-screen ${shouldFlip ? 'rounded-r-3xl order-2' : 'rounded-l-3xl order-1'} relative`}>
          {videoSrc && showPlayButton ? (
            <video 
              src={videoSrc} 
              autoPlay 
              muted 
              loop 
              className="h-full w-full object-cover"
              poster={imageSrc}
            />
          ) : (
            <img src={imageSrc} alt={imageAlt} className="h-full w-full object-cover"/>
          )}
          
          {/* Play button overlay for video */}
          {videoSrc && showPlayButton && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          )}
        </div>
        
        {/* Floating circular image - always centered */}
        <div className="absolute bg-white rounded-full w-[16rem] h-[16rem] flex items-center justify-center left-1/2 transform -translate-x-1/2 z-10">
          <img src={floatingImageSrc || imageSrc} alt={floatingImageAlt} className="h-full w-full object-cover rounded-full"/>
        </div>
        
        {/* Content section - positioned based on alternating layout */}
        <div className={`w-1/2 px-40 flex flex-col justify-center items-center gap-8 bg-accent h-screen ${shouldFlip ? 'rounded-l-3xl order-1' : 'rounded-r-3xl order-2'} ${showGradients ? 'bg-gradient-to-br from-accent to-accent/80' : ''} relative overflow-hidden`}>
          {/* Background image with low opacity and overlay */}
          {backgroundImageSrc && (
            <>
              <img 
                src={backgroundImageSrc} 
                alt={backgroundImageAlt} 
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </>
          )}
          
          {/* Content with relative positioning to appear above background */}
          <div className="relative z-10 flex flex-col gap-4 text-center">
            <h2 className="text-4xl font-bold text-white">{title}</h2>
            <p className="text-xl text-center text-white">{description}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutContent;
