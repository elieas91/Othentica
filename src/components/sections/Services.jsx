import React from 'react';
import { servicesData } from '../../data/servicesData';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Flame from '../../assets/img/flame.webp';

const Services = () => {
  return (
    <section className="py-16 px-8 lg:px-16 bg-white dark:bg-primary relative overflow-hidden">
      {/* Flame Animation in Top Right Corner */}
      <div className="absolute top-4 right-4 lg:top-8 lg:right-8 z-10">
        <div className="relative">
          {/* Main Flame Image with Bounce Animation */}
          <div className="w-16 h-20 lg:w-20 lg:h-24 relative animate-bounce">
            <img 
              src={Flame} 
              alt="Flame" 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Glow Effect Behind the Flame */}
          <div className="absolute inset-0 w-16 h-20 lg:w-20 lg:h-24 bg-gradient-to-t from-orange-400 via-yellow-300 to-transparent rounded-full animate-pulse opacity-60 blur-sm" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-0 w-16 h-20 lg:w-20 lg:h-24 bg-gradient-to-t from-yellow-400 via-orange-300 to-transparent rounded-full animate-ping opacity-40 blur-md" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Additional Glow Layers */}
          <div className="absolute -top-2 -left-1 w-18 h-22 lg:w-22 lg:h-26 bg-gradient-to-t from-orange-400 via-yellow-300 to-transparent rounded-full animate-pulse opacity-50 blur-sm" style={{ animationDuration: '1.5s' }}></div>
          <div className="absolute -top-1 -right-1 w-16 h-20 lg:w-18 lg:h-22 bg-gradient-to-t from-yellow-400 via-orange-300 to-transparent rounded-full animate-pulse opacity-40 blur-sm" style={{ animationDuration: '2.5s' }}></div>
          
          {/* Sparkle Effects */}
          <div className="absolute -top-1 left-1/2 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-80" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-2 right-2 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-4 left-3 w-1.5 h-1.5 bg-orange-300 rounded-full animate-ping opacity-70" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary dark:text-neutral mb-8">
            Our Services
          </h2>
          <p className="text-xl text-primary dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Discover our comprehensive approach to wellness that nurtures every
            aspect of your being.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesData.map((service) => (
            <Card
              key={service.id}
              className="text-center hover:scale-105 transition-transform duration-300 h-full group"
            >
              <div className="flex flex-col flex-grow">
                <div className="text-5xl mb-6">
                  <img
                    src={service.icon}
                    alt={service.title}
                    className="mx-auto w-20 h-20 object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-primary dark:text-neutral mb-4">
                  {service.title}
                </h3>
                <p className="text-primary dark:text-gray-200 mb-8 leading-relaxed">
                  {service.description}
                </p>
              </div>
              <Button variant="secondary" className="w-full mt-auto">
                {service.buttonText}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
