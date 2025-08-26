import React from "react";
import { servicesData } from "../data/servicesData";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const Services = () => {
  return (
    <div className="min-h-screen bg-neutral dark:bg-primary py-20 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-primary dark:text-neutral mb-6">
            Our Services
          </h1>
          <p className="text-xl text-primary dark:text-gray-200 max-w-3xl mx-auto">
            Discover our comprehensive approach to wellness that nurtures every
            aspect of your being.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {servicesData.map((service) => (
            <Card key={service.id} className="text-center">
              <div className="text-6xl mb-6">
                <img
                  src={service.icon}
                  alt={service.title}
                  className="mx-auto w-20 h-20 object-contain"
                />
              </div>
              <h3 className="text-2xl font-semibold text-primary dark:text-neutral mb-4">
                {service.title}
              </h3>
              <p className="text-primary dark:text-gray-200 mb-6 leading-relaxed">
                {service.description}
              </p>
              <Button variant="secondary" className="w-full">
                {service.buttonText}
              </Button>
            </Card>
          ))}
        </div>

        <div className="bg-neutral dark:bg-primary rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-primary dark:text-neutral mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-primary dark:text-gray-200 mb-8">
            Book a consultation and discover how our services can transform your
            wellness journey.
          </p>
          <Button variant="primary" size="large">
            Book Consultation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Services;
