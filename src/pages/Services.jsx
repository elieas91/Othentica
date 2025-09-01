import React from 'react';
import { servicesData } from '../data/servicesData';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ServiceBlock from '../components/ui/ServiceBlock';
import Banner from '../components/ui/Banner';
import Testimonial1 from '../assets/img/testimonials/testimonial-1.webp';
import Testimonial2 from '../assets/img/testimonials/testimonial-2.webp';
import Testimonial3 from '../assets/img/testimonials/testimonial-3.webp';
import Testimonial4 from '../assets/img/testimonials/testimonial-4.webp';

const Services = () => {
  return (
    <>
      <div className="min-h-screen dark:bg-primary">
        <Banner
          title="Our Services"
          description="Discover our comprehensive approach to wellness that nurtures every aspect of your being"
          backgroundImages={[
            Testimonial1,
            Testimonial2,
            Testimonial3,
            Testimonial4,
          ]}
        />
      </div>
      <div className="min-h-screen bg-neutral dark:bg-primary py-20 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="container mx-auto">
            {servicesData.map((service, index) => (
              <ServiceBlock key={service.id} service={service} index={index} />
            ))}
          </div>

          <div className="bg-neutral dark:bg-primary rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-primary dark:text-neutral mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-primary dark:text-gray-200 mb-8">
              Book a consultation and discover how our services can transform
              your wellness journey.
            </p>
            <Button variant="primary" size="large">
              Book Consultation
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
