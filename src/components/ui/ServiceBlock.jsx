import React, { useState, useEffect, useRef } from 'react';
import Flame from '../../assets/img/flame.webp';
import Modal from './Modal';
import Button from './Button';
import WhatsAppButton from './WhatsappButton';
import Tooltip from './Tooltip';
import EmailIcon from '../../assets/img/email_icon.webp';

const ServiceBlock = ({ service, index }) => {
  const isEven = index % 2 === 0; // alternate layout
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const currentRef = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Reset animation when out of view to allow re-triggering
          setIsVisible(false);
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Start animation slightly before fully visible
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <>
      <div ref={sectionRef} className="flex flex-col md:flex-row items-center my-12 relative min-h-[500px]">
        {/* Image Side */}
        <div
          className={`w-full relative z-10  ${
            isEven ? 'md:order-2' : 'md:order-1'
          }`}
        >
          {/* Main Image */}
          <div className="w-full h-[600px] bg-[#e4e4e4] flex items-center justify-center">
            {service.mobile1 && service.mobile2 && service.mobile3 ? (
              // Three mobile images side by side for the app service with scroll animation
              <div className="flex gap-12 w-full h-full items-center justify-center rounded-4xl">
                <img
                  src={service.mobile1}
                  alt={`${service.title} - Mobile View 1`}
                  className={`w-[15%] h-[50%] object-cover shadow-lg rounded-2xl overflow-visible transition-all duration-1000 ease-out ${
                    isVisible 
                      ? 'opacity-100 transform translate-y-0 scale-100' 
                      : 'opacity-0 transform translate-y-8 scale-95'
                  }`}
                  style={{ 
                    maxHeight: '300px',
                    transitionDelay: '0ms'
                  }}
                />
                <img
                  src={service.mobile2}
                  alt={`${service.title} - Mobile View 2`}
                  className={`w-[15%] h-[70%] object-cover shadow-lg rounded-2xl overflow-visible transition-all duration-1000 ease-out ${
                    isVisible 
                      ? 'opacity-100 transform translate-y-0 scale-100' 
                      : 'opacity-0 transform translate-y-8 scale-95'
                  }`}
                  style={{ 
                    maxHeight: '600px',
                    transitionDelay: '400ms'
                  }}
                />
                <img
                  src={service.mobile3}
                  alt={`${service.title} - Mobile View 3`}
                  className={`w-[15%] h-[50%] object-cover shadow-lg rounded-2xl overflow-visible transition-all duration-1000 ease-out ${
                    isVisible 
                      ? 'opacity-100 transform translate-y-0 scale-100' 
                      : 'opacity-0 transform translate-y-8 scale-95'
                  }`}
                  style={{ 
                    maxHeight: '600px',
                    transitionDelay: '800ms'
                  }}
                />
              </div>
            ) : (
              // Single image for other services
              <img
                src={service.image1}
                alt={service.title}
                className="w-full h-full object-cover shadow-lg rounded-2xl transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl"
                style={{ maxHeight: '600px' }}
              />
            )}
          </div>
        </div>

        {/* Text Side with Background */}
        <div
          className={`w-full md:w-3/4 h-[120vh] md:h-[600px] object-cover p-8 pb-64 flex flex-col justify-center relative top-[5rem]  ${
            isEven
              ? 'md:order-1 md:-mr-32 items-start'
              : 'md:order-2 md:-ml-32 items-end'
          }`}
        >
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 w-[200%] h-full z-0 rounded-2xl"
            style={{
              backgroundColor: service.backgroundColor || '#f3f4f6',
            }}
          ></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-start w-[85%] h-auto top-[6rem]">
            <div className="flex items-center mb-4">
              <img
                src={service.icon}
                alt="Service Icon"
                className="w-24 mr-3 transition-all duration-500 ease-out hover:scale-110 hover:rotate-3"
              />
              <h2 className="text-3xl font-bold transition-all duration-500 ease-out hover:scale-105">{service.title}</h2>
            </div>
            <ul className="text-gray-600 text-xl px-4 leading-[2.5rem]">
              {service.descriptionBulletPoints.map((point, idx) => (
                <li key={idx} className="flex items-start mb-2 group transition-all duration-300 ease-out hover:translate-x-2">
                  <img
                    src={Flame}
                    alt="Bullet Icon"
                    className="w-auto h-7 mr-3 mt-1 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-12"
                  />
                  <span className="transition-all duration-300 ease-out group-hover:text-gray-800 dark:group-hover:text-gray-200">{point}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex justify-center items-center gap-6 mt-8 px-10">
              <div className="flex items-center gap-16">
                {/* Flame Button with Title */}
                <div className="flex flex-col items-center">
                  <Tooltip
                    content={`Learn more about ${service.title}`}
                    position="top"
                  >
                    <button
                      onClick={openModal}
                      className="relative group cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 focus:ring-opacity-50 rounded-full"
                      aria-label={`Learn more about ${service.title}`}
                    >
                      <div className="relative group cursor-pointer">
                        <div className="w-16 h-16 lg:w-12 lg:h-12 relative">
                          <img
                            src={Flame}
                            alt="Learn More"
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Static glow effects - no animations */}
                        {/* <div
                        className="absolute inset-0 w-16 h-16 lg:w-12 lg:h-12 bg-gradient-to-t from-orange-400 via-yellow-300 to-transparent rounded-full opacity-60 blur-sm"
                      ></div> */}
                        <div className="absolute inset-0 w-16 h-16 lg:w-12 lg:h-12 bg-gradient-to-t from-yellow-400 via-orange-300 to-transparent cursor-pointer rounded-full opacity-40 blur-md"></div>

                        <div className="absolute -top-2 -left-1 w-18 h-18 lg:w-14 lg:h-14 bg-gradient-to-t from-orange-400 via-yellow-300 cursor-pointer to-transparent rounded-full opacity-50 blur-sm"></div>
                        <div className="absolute -top-1 -right-1 w-16 h-16 lg:w-14 lg:h-14 bg-gradient-to-t from-yellow-400 via-orange-300 cursor-pointer to-transparent rounded-full opacity-40 blur-sm"></div>

                        <div className="absolute -top-1 left-1/2 w-2 h-2 bg-yellow-300 cursor-pointer rounded-full opacity-80"></div>
                        <div className="absolute top-2 right-2 w-1 h-1 bg-yellow-400 cursor-pointer rounded-full opacity-60"></div>
                        <div className="absolute top-4 left-3 w-1.5 h-1.5 bg-orange-300 cursor-pointer rounded-full opacity-70"></div>
                      </div>
                    </button>
                  </Tooltip>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Learn more</span>
                </div>

                {/* WhatsApp Button with Title */}
                <div className="flex flex-col items-center">
                  <div className="relative group cursor-pointer transition-transform hover:scale-105">
                    <WhatsAppButton className="w-16 h-16 lg:w-12 lg:h-12" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Get in Touch</span>
                </div>

                {/* Message Icon with Title */}
                <div className="flex flex-col items-center">
                  <Tooltip
                    content="Contact us for more information"
                    position="top"
                  >
                    <button
                      onClick={() => window.open('/contact', '_blank')}
                      className="relative group cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 rounded-full"
                      aria-label="Contact us"
                    >
                      <div className="w-16 h-16 lg:w-12 lg:h-12 relative">
                        <img
                          src={EmailIcon}
                          alt="Contact Us"
                          className="w-full h-full object-contain transition-all duration-300 ease-out group-hover:scale-110"
                        />
                      </div>
                    </button>
                  </Tooltip>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Contact Us</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Info Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={service.title}>
        <div className="space-y-6">
          <div className=" mb-6">
            <div className="flex items-center justify-center mb-4">
              <img
                src={service.icon}
                alt={service.title}
                className="w-16 h-16 object-contain mr-4"
              />
              <h3 className="text-2xl font-bold text-primary dark:text-neutral">
                {service.title}
              </h3>
            </div>
            <p className="text-lg text-primary dark:text-gray-200 leading-relaxed mb-4">
              {service.modalDescription1}
            </p>
            <p className="text-lg text-primary dark:text-gray-200 leading-relaxed">
              {service.modalDescription2 ?? ''}
            </p>
          </div>

          {service.modalDescriptionBulletPoints != null && (
            <div className="space-y-4">
              <div className="space-y-3">
                {service.modalDescriptionBulletPoints.map((point, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-primary dark:text-gray-200">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-center italic text-orange-700 dark:text-orange-300 font-medium text-lg">
              "{service.quotation}"
            </p>
          </div>

          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-primary dark:text-gray-200 mb-4">
              Ready to get started with {service.title}?
            </p>
            <Button
              variant="primary"
              onClick={() => {
                closeModal();
                window.open('/contact', '_blank')
              }}
              className="px-8 py-3"
            >
              Book Consultation
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ServiceBlock;
