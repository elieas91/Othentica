import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
// import Flame from '../../assets/img/flame.webp';
import Phone from '../../assets/img/phone.webp';
import App1 from '../../assets/img/app-1.webp';
import App2 from '../../assets/img/app-2.webp';
import App3 from '../../assets/img/app-3.webp';
import App4 from '../../assets/img/app-4.webp';
import App5 from '../../assets/img/app-5.webp';
import App6 from '../../assets/img/app-6.webp';
import App7 from '../../assets/img/app-7.webp';
import App8 from '../../assets/img/app-8.webp';
import LogoPattern from '../../assets/img/logo_patterns/logo_pattern_2.1_2.png';
import { mobileAppStepsData } from '../../data/mobileAppStepsData';

const MobileShowcase = () => {
  const [currentStepIndex, setcurrentStepIndex] = useState(0);
  const [currentAppImageIndex, setCurrentAppImageIndex] = useState(0);

  // Array of all app images
  const appImages = [App1, App2, App3, App4, App5, App6, App7, App8];

  // Auto-rotate through app images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAppImageIndex(
        (prevIndex) => (prevIndex + 1) % appImages.length
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [appImages.length]);

  const currentStep = mobileAppStepsData[currentStepIndex];

  // Both app images change at the same time, but show different images
  const currentAppImage = appImages[currentAppImageIndex % appImages.length];
  const secondPhoneImage =
    appImages[(currentAppImageIndex + 1) % appImages.length];

  return (
    <section className="py-16 px-8 lg:px-16 bg-white dark:bg-gray-800 relative overflow-hidden">
      {/* Background layer with logo pattern */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${LogoPattern})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '900px 895px',
          opacity: 0.4,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-2">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary dark:text-neutral mb-8">
            Mobile App Showcase
          </h2>
          <p className="text-xl text-primary dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Experience our innovative mobile solutions that transform ideas into
            exceptional digital experiences
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Text with Carousel */}
          <div
            className={`bg-white rounded-xl shadow-2xl p-8 relative z-20 ${
              currentStep.buttonText ? 'space-y-8' : ''
            }`}
            style={{ backgroundColor: 'rgba(255,255,255,1)' }}
          >
            <div className="min-h-[200px] flex flex-col justify-center">
              <h2 className="text-4xl lg:text-5xl font-bold text-primary dark:text-neutral transition-all duration-700 ease-in-out">
                {currentStep.title}
              </h2>
              <p className="text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed mt-4 transition-all duration-700 ease-in-out">
                {currentStep.description}
              </p>

              {/* Buttons inside carousel content */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 transition-all duration-700 ease-in-out">
                {currentStep.buttonText ? (
                  <Button variant="secondary" size="large">
                    {currentStep.buttonText}
                  </Button>
                ) : null}

                {/* <Button variant="accent" size="large">
                Learn More
              </Button> */}
              </div>
            </div>

            {/* Carousel Indicators - Numbered style with lines between circles */}
            <div className="flex items-center">
              {mobileAppStepsData.map((_, index) => (
                <React.Fragment key={index}>
                  <button
                    onClick={() => setcurrentStepIndex(index)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-lg transition-all duration-300 ${
                      index === currentStepIndex
                        ? 'bg-secondary text-white scale-110 opacity-100'
                        : 'bg-gray-300 text-primary opacity-30 hover:opacity-60'
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  >
                    <span>{index + 1}</span>
                  </button>
                  {index < mobileAppStepsData.length - 1 && (
                    <div className="w-8 h-0.5 bg-gray-300 mx-2" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Mobile Phone */}
          <div className="relative flex justify-center">
            {/* Background Phone Frame - larger and angled */}
            <div
              className="relative transform -rotate-12 scale-75"
              style={{
                filter: 'drop-shadow(16px 18px 4px rgba(0,0,0,0.7))',
              }}
            >
              <img
                src={Phone}
                alt="Smartphone mockup"
                className="w-80 h-auto shadow-professional opacity-80"
                style={{
                  filter:
                    'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.15)) drop-shadow(0 10px 10px rgba(0, 0, 0, 0.1))',
                }}
              />
              {/* App content overlay inside the phone screen */}
              <div className="absolute inset-0 flex items-center justify-center z-[-1]">
                <div className="w-full h-full rounded-3xl flex justify-center items-center">
                  <img
                    src={currentAppImage}
                    alt="App interface"
                    className="w-[92%] h-[97%] object-contain transition-all duration-700 ease-in-out"
                  />
                </div>
              </div>
            </div>

            {/* Foreground Phone Frame - smaller and overlapping */}
            <div
              className="absolute transform rotate-12 scale-[.60] translate-y-40 translate-x-36 z-20"
              style={{
                filter: 'drop-shadow(16px 18px 4px rgba(0,0,0,0.7))',
              }}
            >
              <img
                src={Phone}
                alt="Smartphone mockup"
                className="w-80 h-auto"
              />
              {/* App content overlay inside the phone screen */}
              <div className="absolute inset-0 flex items-center justify-center z-[-1]">
                <div className="w-full h-full rounded-3xl flex justify-center items-center">
                  <img
                    src={secondPhoneImage}
                    alt="App interface"
                    className="w-[92%] h-[97%] object-contain transition-all duration-700 ease-in-out"
                  />
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            {/* <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full animate-bounce">
            <img src={Flame} alt="Othentica" />
          </div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full animate-pulse">
            <img src={Flame} alt="Othentica" />
          </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileShowcase;
