import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

const MobileShowcase = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const showcaseData = [
    {
      image: "📱",
      title: "Track Your Wellness Journey",
      description: "Monitor your daily habits, mood, and progress with our intuitive mobile app. Set personalized goals and celebrate your achievements along the way.",
      color: "from-blue-200 to-blue-300"
    },
    {
      image: "🧘‍♀️",
      title: "Mindful Moments",
      description: "Access guided meditations, breathing exercises, and mindfulness practices wherever you are. Find your center in just a few minutes.",
      color: "from-green-200 to-green-300"
    },
    {
      image: "💪",
      title: "Fitness & Movement",
      description: "Discover personalized workout routines, yoga flows, and movement practices that fit your lifestyle and energy levels.",
      color: "from-purple-200 to-purple-300"
    },
    {
      image: "🍎",
      title: "Nutrition Guidance",
      description: "Get personalized meal suggestions, track your nutrition, and learn about foods that support your wellness goals.",
      color: "from-orange-200 to-orange-300"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % showcaseData.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [showcaseData.length]);

  const currentItem = showcaseData[currentImageIndex];

  return (
    <section className="py-24 px-8 lg:px-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        {/* Left Text */}
        <div className="space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-blue-900 dark:text-white">
            Your Wellness, Your Way
          </h2>
          <p className="text-lg lg:text-xl text-blue-900 dark:text-gray-200 leading-relaxed">
            Experience the power of personalized wellness in the palm of your hand. Our mobile app brings Othentica's holistic approach to wellness wherever life takes you.
          </p>
          
          {/* Dynamic Content */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-blue-800 dark:text-blue-300">
              {currentItem.title}
            </h3>
            <p className="text-lg text-blue-900 dark:text-gray-200 leading-relaxed">
              {currentItem.description}
            </p>
          </div>

          {/* Navigation Dots */}
          <div className="flex space-x-3">
            {showcaseData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-blue-600 dark:bg-blue-400 scale-125' 
                    : 'bg-blue-300 dark:bg-blue-600 hover:bg-blue-400 dark:hover:bg-blue-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="primary" size="large">
              Download App
            </Button>
            <Button variant="secondary" size="large">
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Right Mobile Phone */}
        <div className="relative flex justify-center">
          {/* Phone Frame */}
          <div className="relative w-64 h-96 bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
            {/* Screen */}
            <div className="w-full h-full bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden relative">
              {/* Dynamic Image Container */}
              <div className={`w-full h-full bg-gradient-to-br ${currentItem.color} flex items-center justify-center transition-all duration-500`}>
                <div className="text-6xl animate-pulse">
                  {currentItem.image}
                </div>
              </div>
              
              {/* App-like Header */}
              <div className="absolute top-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                  <div className="text-sm font-semibold text-gray-800 dark:text-white">Othentica</div>
                  <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Home Button */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full"></div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default MobileShowcase;
