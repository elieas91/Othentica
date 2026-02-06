import React, { useState, useEffect, useRef, useContext } from 'react';
import { servicesData } from '../data/servicesData';
import Button from '../components/ui/Button';
import ServiceBlock from '../components/ui/ServiceBlock';
import CarouselBanner from '../components/ui/CarouselBanner';
import apiService from '../services/api';
import { PublicLocaleContext } from '../contexts/PublicLocaleContext';
import CorporateHealth from '../assets/img/services/corporate_health.webp';
import OneToOneGuidance from '../assets/img/services/one_to_one_img.webp';
import Workshop from '../assets/img/services/workshop.webp';
import TailoredPrograms from '../assets/img/services/programs_img.webp';
import Testimonials from '../components/sections/Testimonials';
import FlameSolid from '../assets/img/flame-outline.webp';
import { Link } from 'react-router-dom';

const DEFAULT_TITLE = 'Our Services';
const DEFAULT_DESCRIPTION = 'Discover our comprehensive approach to wellness that nurtures every aspect of your being';

const Services = () => {
  const { isArabic } = useContext(PublicLocaleContext);
  const [isVisible, setIsVisible] = useState(false);
  const [bannerImageList, setBannerImageList] = useState([]); // full objects { title, title_ar, description, description_ar, image_url }
  const [servicesFromApi, setServicesFromApi] = useState([]);
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

  // Load services banner images (full objects for title/description per locale)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiService.getServicesBannerImages();
        const images = (res && res.data) ? res.data : Array.isArray(res) ? res : [];
        setBannerImageList(Array.isArray(images) ? images : []);
      } catch {
        setBannerImageList([]);
      }
    };
    load();
  }, []);

  // Load services from DB (for Arabic + EN)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiService.getServices();
        if (res?.success && Array.isArray(res.data)) {
          setServicesFromApi(res.data);
        } else {
          setServicesFromApi([]);
        }
      } catch {
        setServicesFromApi([]);
      }
    };
    load();
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

  const bannerUrls = bannerImageList.map(img => img.image_url).filter(Boolean);
  const firstBanner = bannerImageList[0];
  const bannerTitle = firstBanner
    ? (isArabic && firstBanner.title_ar ? firstBanner.title_ar : (firstBanner.title || DEFAULT_TITLE))
    : DEFAULT_TITLE;
  const bannerDescription = firstBanner
    ? (isArabic && firstBanner.description_ar ? firstBanner.description_ar : (firstBanner.description || DEFAULT_DESCRIPTION))
    : DEFAULT_DESCRIPTION;

  // Merge API services with static data; resolve text by locale (Arabic from DB when isArabic)
  const parseBulletPoints = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      const parsed = typeof val === 'string' ? JSON.parse(val) : val;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  const displayServices = servicesData.map((staticItem) => {
    const apiItem = servicesFromApi.find((s) => (s.section_id || s.sectionId) === staticItem.sectionId);
    if (!apiItem) {
      // No API data: use static item and resolve Arabic from static _ar fields
      return {
        ...staticItem,
        title: isArabic && staticItem.title_ar ? staticItem.title_ar : staticItem.title,
        description: isArabic && staticItem.description_ar ? staticItem.description_ar : staticItem.description,
        descriptionBulletPoints: (isArabic && staticItem.descriptionBulletPoints_ar?.length) ? staticItem.descriptionBulletPoints_ar : staticItem.descriptionBulletPoints,
        quotation: isArabic && staticItem.quotation_ar ? staticItem.quotation_ar : staticItem.quotation,
        buttonText: isArabic && staticItem.buttonText_ar ? staticItem.buttonText_ar : staticItem.buttonText,
        modalDescription1: isArabic && staticItem.modalDescription1_ar ? staticItem.modalDescription1_ar : staticItem.modalDescription1,
        modalDescription2: isArabic && staticItem.modalDescription2_ar ? staticItem.modalDescription2_ar : staticItem.modalDescription2,
        modalDescriptionBulletPoints: (isArabic && staticItem.modalDescriptionBulletPoints_ar?.length) ? staticItem.modalDescriptionBulletPoints_ar : staticItem.modalDescriptionBulletPoints,
        dir: isArabic ? 'rtl' : undefined,
      };
    }
    const descBullets = parseBulletPoints(apiItem.description_bullet_points);
    const modalBullets = parseBulletPoints(apiItem.modal_description_bullet_points);
    const descBulletsAr = parseBulletPoints(apiItem.description_bullet_points_ar);
    const modalBulletsAr = parseBulletPoints(apiItem.modal_description_bullet_points_ar);
    return {
      ...staticItem,
      id: apiItem.id ?? staticItem.id,
      title: isArabic ? (apiItem.title_ar || staticItem.title_ar || apiItem.title || staticItem.title) : (apiItem.title || staticItem.title),
      description: isArabic ? (apiItem.description_ar || staticItem.description_ar || apiItem.description || staticItem.description) : (apiItem.description || staticItem.description),
      descriptionBulletPoints: isArabic ? (descBulletsAr.length ? descBulletsAr : (staticItem.descriptionBulletPoints_ar?.length ? staticItem.descriptionBulletPoints_ar : (descBullets.length ? descBullets : staticItem.descriptionBulletPoints))) : (descBullets.length ? descBullets : staticItem.descriptionBulletPoints),
      quotation: isArabic ? (apiItem.quotation_ar || staticItem.quotation_ar || (apiItem.quotation ?? staticItem.quotation)) : (apiItem.quotation ?? staticItem.quotation),
      buttonText: isArabic ? (apiItem.button_text_ar || staticItem.buttonText_ar || apiItem.button_text || staticItem.buttonText) : (apiItem.button_text || staticItem.buttonText),
      modalDescription1: isArabic ? (apiItem.modal_description1_ar || staticItem.modalDescription1_ar || (apiItem.modal_description1 ?? staticItem.modalDescription1)) : (apiItem.modal_description1 ?? staticItem.modalDescription1),
      modalDescription2: isArabic ? (apiItem.modal_description2_ar || staticItem.modalDescription2_ar || (apiItem.modal_description2 ?? staticItem.modalDescription2)) : (apiItem.modal_description2 ?? staticItem.modalDescription2),
      modalDescriptionBulletPoints: isArabic ? (modalBulletsAr.length ? modalBulletsAr : (staticItem.modalDescriptionBulletPoints_ar?.length ? staticItem.modalDescriptionBulletPoints_ar : (modalBullets.length ? modalBullets : staticItem.modalDescriptionBulletPoints))) : (modalBullets.length ? modalBullets : staticItem.modalDescriptionBulletPoints),
      icon: apiItem.icon_url || staticItem.icon,
      image1: apiItem.image1_url || staticItem.image1,
      image2: apiItem.image2_url || staticItem.image2,
      mobile1: apiItem.mobile1_url || staticItem.mobile1,
      mobile2: apiItem.mobile2_url || staticItem.mobile2,
      mobile3: apiItem.mobile3_url || staticItem.mobile3,
      backgroundColor: apiItem.background_color || staticItem.backgroundColor,
      dir: isArabic ? 'rtl' : undefined,
    };
  });

  return (
    <>
      <div ref={bannerRef} className="dark:bg-primary">
        <div className={`transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-8'
        }`}>
          <CarouselBanner
            title={bannerTitle}
            description={bannerDescription}
            dir={isArabic ? 'rtl' : undefined}
            backgroundImages={bannerUrls.length ? bannerUrls : [
              CorporateHealth,
              OneToOneGuidance,
              Workshop,
              TailoredPrograms,
            ]}
          />
        </div>
      </div>
      <div className="  dark:bg-primary pb-20">
        {displayServices.map((service, index) => {
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
              className={`relative w-screen left-1/2 right-1/2 -mx-[50vw] transition-all duration-1000 ease-out hover:bg-gradient-to-r hover:from-transparent hover:via-gray-50/5 hover:to-transparent dark:hover:via-gray-800/5`}
              dir={service.dir}
            >
              {/* Keep content centered */}
              <div className="max-w mx-auto">
                <ServiceBlock service={service} index={index} dir={service.dir} />
              </div>
              <div className="w-full flex justify-center items-center mt-32 mb-24" dir={service.dir}>
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

        <div ref={ctaRef} className="max-w-3xl lg:max-w-7xl mx-auto">
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
