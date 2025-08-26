import React from "react";
import Button from "../ui/Button";
import Logo from "../../assets/img/logo.webp";
import Flame from "../../assets/img/flame.webp";
import HeroBg from "../../assets/img/hero_bg.webp";

const Hero = () => {
  // Flame configuration array
  const flames = [
    // Left center area flames (moved toward center, higher up)
    { id: 1, position: "top-1/4 left-1/3", size: "w-8", opacity: "opacity-60", animation: "animate-flame-1" },
    { id: 2, position: "top-1/4 left-2/5", size: "w-6", opacity: "opacity-40", animation: "animate-flame-2" },
    { id: 3, position: "top-1/3 left-1/3", size: "w-7", opacity: "opacity-70", animation: "animate-flame-3" },
    { id: 4, position: "top-2/5 left-2/5", size: "w-5", opacity: "opacity-85", animation: "animate-flame-4" },
    { id: 5, position: "top-1/2 left-2/5", size: "w-10", opacity: "opacity-55", animation: "animate-flame-5" },
    
    // Center area flames (expanded center zone, higher up)
    { id: 6, position: "top-1/4 left-1/2", size: "w-7", opacity: "opacity-45", animation: "animate-flame-6" },
    { id: 7, position: "top-1/3 left-1/2", size: "w-8", opacity: "opacity-55", animation: "animate-flame-7" },
    { id: 8, position: "top-1/4 left-1/2", size: "w-6", opacity: "opacity-60", animation: "animate-flame-8" },
    
    // Right center area flames (moved toward center, over logo area, higher up)
    { id: 9, position: "top-1/3 right-1/3", size: "w-5", opacity: "opacity-90", animation: "animate-flame-9" },
    { id: 10, position: "top-1/2 right-2/5", size: "w-10", opacity: "opacity-65", animation: "animate-flame-10" },
    { id: 11, position: "top-1/4 right-1/3", size: "w-6", opacity: "opacity-70", animation: "animate-flame-11" },
    { id: 12, position: "top-1/3 right-2/5", size: "w-7", opacity: "opacity-40", animation: "animate-flame-12" },
    { id: 13, position: "top-1/4 right-1/3", size: "w-5", opacity: "opacity-80", animation: "animate-flame-13" },
    
    // Logo area overlay flames (centered over logo, higher up) - fully clear with 100% opacity
    { id: 14, position: "top-1/3 right-1/3", size: "w-7", opacity: "opacity-80", animation: "animate-flame-14", noBlur: true },
    { id: 15, position: "top-1/2 right-1/3", size: "w-8", opacity: "opacity-80", animation: "animate-flame-15", noBlur: true }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-start px-8 lg:px-16 overflow-hidden" style={{ backgroundImage: `url(${HeroBg})` }}>
      {/* Animated Background with Logo and Flames */}
      <div className="absolute inset-0 w-full h-full">
        {/* Main Logo with Scale Animation */}
        <div className="absolute inset-0 flex items-center justify-end pr-16">
          <img
            src={Logo}
            alt="Othentica Logo"
            className="w-1/2 h-auto opacity-20 animate-logo-scale"
          />
        </div>

        {/* Multiple Animated Flames */}
        {flames.map((flame) => (
          <div key={flame.id} className={`absolute ${flame.position} ${flame.animation}`}>
            <img
              src={Flame}
              alt={`Flame ${flame.id}`}
              className={`${flame.size} h-auto ${flame.opacity} ${flame.noBlur ? '' : 'blur-sm'}`}
            />
          </div>
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-10 dark:bg-opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-xl">
        <h1 className="capitalize text-5xl lg:text-7xl font-bold text-white dark:text-white mb-8 leading-tight">
          Step into your authentic self
        </h1>
        <p className="text-xl lg:text-2xl text-white dark:text-gray-200 mb-10 leading-relaxed max-w-3xl">
          Empowering your mind, body, and spirit with balance. Discover the
          transformative power of authentic wellness practices.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="accent" size="large">
            Start Your Journey
          </Button>
          <Button variant="secondary" size="large">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
