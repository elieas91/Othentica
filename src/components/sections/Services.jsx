import React from 'react';
import { servicesData } from '../../data/servicesData';
import Card from '../ui/Card';
import Button from '../ui/Button';

const Services = () => {
  return (
    <section className="py-16 px-8 lg:px-16 bg-white dark:bg-primary">
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
              className="text-center hover:scale-105 transition-transform duration-300 h-full"
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
              <Button variant="accent" className="w-full mt-auto">
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
