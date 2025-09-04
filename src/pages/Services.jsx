import React from 'react';
import { servicesData } from '../data/servicesData';
import Button from '../components/ui/Button';
import ServiceBlock from '../components/ui/ServiceBlock';
import Banner from '../components/ui/Banner';
import CorporateHealth from '../assets/img/services/corporate_health.webp';
import OneToOneGuidance from '../assets/img/services/one_to_one_img.webp';
import Workshop from '../assets/img/services/workshop.webp';
import TailoredPrograms from '../assets/img/services/programs_img.webp';
import Testimonials from '../components/sections/Testimonials';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <>
      <div className="min-h-screen dark:bg-primary">
        <Banner
          title="Our Services"
          description="Discover our comprehensive approach to wellness that nurtures every aspect of your being"
          backgroundImages={[
            CorporateHealth,
            OneToOneGuidance,
            Workshop,
            TailoredPrograms,
          ]}
        />
      </div>
      <div className="min-h-screen bg-white dark:bg-primary pb-20">
        {servicesData.map((service, index) => {
          // const bgColors = ['bg-white', 'bg-neutral'];
          // const bgColor = bgColors[index % bgColors.length]; // Currently unused but kept for future styling
          let categoryId;
          if (service.sectionId === 'app') {
            categoryId = 'the-othentica-app';
          } else if (service.sectionId === 'programs') {
            categoryId = 'tailored-programs';
          } else if (service.sectionId === 'talks') {
            categoryId = 'talks-workshops';
          } else if (service.sectionId === 'one-to-one') {
            categoryId = 'one-to-one-guidance';
          }

          return (
            <section
              key={service.id}
              id={service.sectionId}
              className={`relative w-screen left-1/2 right-1/2 -mx-[50vw]  py-20`}
            >
              {/* Keep content centered */}
              <div className="max-w mx-auto">
                <ServiceBlock service={service} index={index} />
              </div>
              <Testimonials showPics={false} currentCategoryId={categoryId} />
              <div className="w-full flex justify-center items-center mt-32">
                <blockquote className="text-center italic text-2xl text-gray-700 max-w-2xl font-semibold">
                  {`"${service.quotation}"`}
                </blockquote>
              </div>
            </section>
          );
        })}

        <div className="max-w-7xl mx-auto">
          <div className="bg-neutral dark:bg-primary rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-primary dark:text-neutral mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-primary dark:text-gray-200 mb-8">
              Book a consultation and discover how our services can transform
              your wellness journey.
            </p>
            <Button variant="primary" size="large">
              <Link to="/contact" target="_blank">
                Book Consultation
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
