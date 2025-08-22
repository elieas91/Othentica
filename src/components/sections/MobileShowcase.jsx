import React from 'react';
import Button from '../ui/Button';
import Flame from '../../assets/img/flame.png';
import Phone from '../../assets/img/phone.png';
import App1 from '../../assets/img/app-1.png';
import App2 from '../../assets/img/app-2.png';

const MobileShowcase = () => {
  return (
    <section className="py-24 px-8 lg:px-16 bg-neutral dark:bg-gray-800">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        {/* Left Text */}
        <div className="space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-blue-900 dark:text-white">
            Your Wellness, Your Way
          </h2>
          <p className="text-lg lg:text-xl text-blue-900 dark:text-gray-200 leading-relaxed">
            Experience the power of personalized wellness in the palm of your hand. Our mobile app brings Othentica's holistic approach to wellness wherever life takes you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="secondary" size="large">
              Download App
            </Button>
            <Button variant="accent" size="large">
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Right Mobile Phone */}
        <div className="relative flex justify-center">
          {/* Background Phone Frame - larger and angled */}
          <div className="relative transform -rotate-12 scale-75">
            <img 
              src={Phone} 
              alt="Smartphone mockup" 
              className="w-80 h-auto drop-shadow-2xl opacity-80"
            />
            {/* App content overlay inside the phone screen */}
            <div className="absolute inset-0 flex items-center justify-center z-[-1]">
              <div className="w-full h-full rounded-3xl">
                <img 
                  src={App1} 
                  alt="App interface" 
                  className="w-[92%] h-[97%] object-contain"
                />
              </div>
            </div>
          </div>
          
          {/* Foreground Phone Frame - smaller and overlapping */}
          <div className="absolute transform rotate-12 scale-[.60] translate-y-40 translate-x-36 z-20">
            <img 
              src={Phone} 
              alt="Smartphone mockup" 
              className="w-80 h-auto drop-shadow-2xl"
            />
            {/* App content overlay inside the phone screen */}
            <div className="absolute inset-0 flex items-center justify-center z-[-1]">
              <div className="w-full h-full rounded-3xl flex justify-center items-center">
                <img 
                  src={App2} 
                  alt="App interface" 
                  className="w-[92%] h-[97%] object-contain"
                />
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full animate-bounce">
            <img src={Flame} alt="Othentica" />
          </div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full animate-pulse">
            <img src={Flame} alt="Othentica" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileShowcase;
