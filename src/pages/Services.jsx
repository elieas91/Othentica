import React, { useState, useEffect, useRef } from 'react';
import { servicesData } from '../data/servicesData';
import Button from '../components/ui/Button';
import ServiceBlock from '../components/ui/ServiceBlock';
import CarouselBanner from '../components/ui/CarouselBanner';
import CorporateHealth from '../assets/img/services/corporate_health.webp';
import OneToOneGuidance from '../assets/img/services/one_to_one_img.webp';
import Workshop from '../assets/img/services/workshop.webp';
import TailoredPrograms from '../assets/img/services/programs_img.webp';
import Testimonials from '../components/sections/Testimonials';
import FlameSolid from '../assets/img/flame-outline.webp';
import { Link } from 'react-router-dom';

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const bannerRef = useRef(null);
  const ctaRef = useRef(null);

  // Intersection Observer for banner animation
  useEffect(() => {
    const currentBannerRef = bannerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (currentBannerRef) {
      observer.observe(currentBannerRef);
    }

    return () => {
      if (currentBannerRef) {
        observer.unobserve(currentBannerRef);
      }
    };
  }, []);

  // Intersection Observer for CTA section
  useEffect(() => {
    const currentCtaRef = ctaRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, 'cta']));
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (currentCtaRef) {
      observer.observe(currentCtaRef);
    }

    return () => {
      if (currentCtaRef) {
        observer.unobserve(currentCtaRef);
      }
    };
  }, []);

  return (
    <>
      <div ref={bannerRef} className="min-h-screen dark:bg-primary">
        <div className={`transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-8'
        }`}>
          <CarouselBanner
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
      </div>
      <div className="min-h-screen  dark:bg-primary pb-20">
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
              className={`relative w-screen left-1/2 right-1/2 -mx-[50vw] py-4 transition-all duration-1000 ease-out hover:bg-gradient-to-r hover:from-transparent hover:via-gray-50/5 hover:to-transparent dark:hover:via-gray-800/5`}
            >
              {/* Keep content centered */}
              <div className="max-w mx-auto">
                <ServiceBlock service={service} index={index} />
              </div>
              <div className="w-full flex justify-center items-center mt-32 mb-24">
                <blockquote className="text-center italic text-2xl text-gray-700 max-w-2xl font-semibold transition-all duration-700 ease-out hover:scale-105 hover:text-gray-800 dark:hover:text-gray-200">
                  {`"${service.quotation}"`}
                </blockquote>
              </div>
              <div className="transition-all duration-1000 ease-out hover:scale-[1.02]">
                <Testimonials showPics={false} currentCategoryId={categoryId} />
              </div>
              {index !== 3 && 
                <>
                {/* Single Flame Decoration - Alternating sides */}
                <div className="absolute w-full h-[24rem] group">
                  <img
                    src={FlameSolid}
                    alt="Flame decoration"
                    className={`absolute top-[-24rem] w-[50rem] h-[50rem] opacity-40 pointer-events-none object-contain transition-all duration-1000 ease-out hover:opacity-60 hover:scale-105 group-hover:animate-pulse ${
                      index % 2 === 0 
                        ? 'right-[-18rem] -translate-x-[1/2]' 
                        : 'left-0 -translate-x-1/2'
                    }`}
                  />
                </div>
                </>
              }
              {/* <div className="absolute w-full h-[24rem] z-[-10]">
                <img
                    src={FlameSolid}
                    alt="Flame decoration"
                    className={`absolute top-[-90rem] w-[50rem] h-[50rem] opacity-40 pointer-events-none object-contain right-[-18rem] -translate-x-[1/2]`}
                  />
              </div> */}
            </section>
          );
        })}

        <div ref={ctaRef} className="max-w-7xl mx-auto">
          <div className={`bg-neutral dark:bg-primary rounded-2xl p-12 text-center transition-all duration-1000 ease-out ${
            visibleSections.has('cta')
              ? 'opacity-100 transform translate-y-0 scale-100'
              : 'opacity-0 transform translate-y-8 scale-95'
          }`}>
            <h2 className="text-3xl font-bold text-primary dark:text-neutral mb-6 transition-all duration-700 ease-out hover:scale-105">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-primary dark:text-gray-200 mb-8 transition-all duration-700 ease-out hover:text-primary/80 dark:hover:text-gray-300">
              Book a consultation and discover how our services can transform
              your wellness journey.
            </p>
            <div className="transition-all duration-500 ease-out hover:scale-105">
              <Button variant="primary" size="large">
                <Link to="/contact" target="_blank">
                  Book Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
