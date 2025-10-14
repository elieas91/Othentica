import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import FlameSolid from '../../assets/img/flame_solid.webp';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';

const Services = () => {
  const [servicesData, setServicesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectionMeta, setSectionMeta] = useState({
    title: 'Our Solutions',
    description: 'Discover our comprehensive approach to Corporate Health that nurtures every aspect of your being.'
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [servicesRes, sectionRes] = await Promise.all([
          apiService.getServices(),
          apiService.getHomepageSectionByKey('services')
        ]);
        
        if (servicesRes.success && servicesRes.data) {
          // Transform database services to match component structure
          const transformedServices = servicesRes.data.map(service => ({
            id: service.id,
            title: service.title,
            description: service.description,
            buttonText: service.button_text,
            sectionId: service.section_id,
            icon: service.icon_url,
            // Add other properties as needed
            modalDescription1: service.modal_description1,
            modalDescription2: service.modal_description2,
            descriptionBulletPoints: service.description_bullet_points ? JSON.parse(service.description_bullet_points) : [],
            modalDescriptionBulletPoints: service.modal_description_bullet_points ? JSON.parse(service.modal_description_bullet_points) : [],
            quotation: service.quotation,
            image1: service.image1_url,
            image2: service.image2_url,
            mobile1: service.mobile1_url,
            mobile2: service.mobile2_url,
            mobile3: service.mobile3_url,
            backgroundColor: service.background_color
          }));
          
          setServicesData(transformedServices);
        } else {
          throw new Error(servicesRes.message || 'Failed to fetch services');
        }

        // Load section metadata
        if (sectionRes && sectionRes.success && sectionRes.data) {
          setSectionMeta(prev => ({
            title: sectionRes.data.title || prev.title,
            description: sectionRes.data.description || prev.description
          }));
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setError(error.message);
        // Render nothing when data is unavailable
        setServicesData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-16 px-8 lg:px-16 bg-white dark:bg-primary relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-primary font-medium">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-8 lg:px-16 bg-white dark:bg-primary relative overflow-hidden">
      {/* Left flame */}
      <img
        src={FlameSolid}
        alt="Left Flame"
        className="absolute -left-[30rem] lg:-left-[30rem] top-1/2 -translate-y-1/2 w-100 opacity-30 pointer-events-none"
      />

      {/* Right flame */}
      {/* <img
        src={FlameSolid}
        alt="Right Flame"
        className="absolute -right-0 lg:-right-0 top-1/2 -translate-y-1/2 w-80 opacity-30 pointer-events-none "
      /> */}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary dark:text-neutral mb-8">
            {sectionMeta.title}
          </h2>
          <p className="text-xl text-primary dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: sectionMeta.description }} />
          </p>
        </div>

        {servicesData.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicesData.map((service) => (
              <Card
                key={service.id}
                className="text-center hover:scale-105 transition-transform duration-300 h-full group"
              >
                <div className="flex flex-col flex-grow">
                  {service.icon && (
                    <div className="text-5xl mb-6">
                      <img
                        src={service.icon}
                        alt={service.title || ''}
                        className="mx-auto w-20 h-20 object-contain"
                      />
                    </div>
                  )}
                  {service.title && (
                    <h3 className="text-xl font-semibold text-primary dark:text-neutral mb-4">
                      {service.title}
                    </h3>
                  )}
                  {service.description && (
                    <p className="text-primary dark:text-gray-200 mb-8 leading-relaxed">
                      {service.description}
                    </p>
                  )}
                </div>
                {service.buttonText && (
                  <Button variant="secondary" className="w-full mt-auto">
                    {service.buttonText}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-primary dark:text-gray-200">
            {error ? 'Failed to load services.' : 'No services available.'}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
