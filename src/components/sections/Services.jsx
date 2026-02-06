import React, { useState, useEffect, useContext } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import FlameSolid from '../../assets/img/flame_solid.webp';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import { PublicLocaleContext } from '../../contexts/PublicLocaleContext';
import { getT } from '../../data/translations';

const Services = ({ sectionData: sectionDataProp }) => {
  const { locale, isArabic } = useContext(PublicLocaleContext);
  const t = getT(locale);
  const [servicesData, setServicesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectionMeta, setSectionMeta] = useState({ title: '', title_ar: '', description: '', description_ar: '' });

  // Section title/description: raw section from Home (title_ar, description_ar) or fetch without locale
  useEffect(() => {
    const t2 = getT(locale);
    if (sectionDataProp) {
      setSectionMeta({
        title: sectionDataProp.title || t2('ourSolutions'),
        title_ar: sectionDataProp.title_ar || '',
        description: sectionDataProp.description || t2('ourSolutionsSubtitle'),
        description_ar: sectionDataProp.description_ar || ''
      });
    } else {
      apiService.getHomepageSectionByKey('services').then(sectionRes => {
        const t3 = getT(locale);
        if (sectionRes?.success && sectionRes.data) {
          const d = sectionRes.data;
          setSectionMeta({
            title: d.title || t3('ourSolutions'),
            title_ar: d.title_ar || '',
            description: d.description || t3('ourSolutionsSubtitle'),
            description_ar: d.description_ar || ''
          });
        } else {
          setSectionMeta({ title: t3('ourSolutions'), title_ar: '', description: t3('ourSolutionsSubtitle'), description_ar: '' });
        }
      });
    }
  }, [sectionDataProp, locale]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const servicesRes = await apiService.getServices();
        if (servicesRes.success && servicesRes.data) {
          const transformedServices = servicesRes.data.map(service => ({
            id: service.id,
            title: service.title,
            title_ar: service.title_ar || '',
            description: service.description,
            description_ar: service.description_ar || '',
            buttonText: service.button_text,
            buttonText_ar: service.button_text_ar || '',
            sectionId: service.section_id,
            icon: service.icon_url,
            modalDescription1: service.modal_description1,
            modalDescription1_ar: service.modal_description1_ar || '',
            modalDescription2: service.modal_description2,
            modalDescription2_ar: service.modal_description2_ar || '',
            descriptionBulletPoints: service.description_bullet_points ? JSON.parse(service.description_bullet_points || '[]') : [],
            modalDescriptionBulletPoints: service.modal_description_bullet_points ? JSON.parse(service.modal_description_bullet_points || '[]') : [],
            quotation: service.quotation,
            quotation_ar: service.quotation_ar || '',
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
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err.message);
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
          <h2 className="text-4xl lg:text-5xl font-bold text-primary dark:text-neutral mb-8" dir={isArabic ? 'rtl' : 'ltr'}>
            {isArabic && (sectionMeta.title_ar?.trim?.() || sectionMeta.title_ar) ? sectionMeta.title_ar : (sectionMeta.title || t('ourSolutions'))}
          </h2>
          <p className="text-xl text-primary dark:text-gray-200 max-w-3xl mx-auto leading-relaxed" dir={isArabic ? 'rtl' : 'ltr'}>
            <span dangerouslySetInnerHTML={{ __html: (isArabic && (sectionMeta.description_ar?.trim?.() || sectionMeta.description_ar) ? sectionMeta.description_ar : (sectionMeta.description || t('ourSolutionsSubtitle'))) || '' }} />
          </p>
        </div>

        {servicesData.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicesData.map((service) => {
              const displayTitle = isArabic && (service.title_ar?.trim?.() || service.title_ar) ? service.title_ar : (service.title || '');
              const displayDescription = isArabic && (service.description_ar?.trim?.() || service.description_ar) ? service.description_ar : (service.description || '');
              const displayButtonText = isArabic && (service.buttonText_ar?.trim?.() || service.buttonText_ar) ? service.buttonText_ar : (service.buttonText || '');
              return (
                <Card
                  key={service.id}
                  className="text-center hover:scale-105 transition-transform duration-300 h-full group"
                >
                  <div className="flex flex-col flex-grow" dir={isArabic ? 'rtl' : 'ltr'}>
                    {service.icon && (
                      <div className="text-5xl mb-6">
                        <img
                          src={service.icon}
                          alt={displayTitle || service.title || ''}
                          className="mx-auto w-20 h-20 object-contain"
                        />
                      </div>
                    )}
                    {displayTitle && (
                      <h3 className="text-xl font-semibold text-primary dark:text-neutral mb-4">
                        {displayTitle}
                      </h3>
                    )}
                    {displayDescription && (
                      <p className="text-primary dark:text-gray-200 mb-8 leading-relaxed">
                        {displayDescription}
                      </p>
                    )}
                  </div>
                  {displayButtonText && (
                    <Button variant="secondary" className="w-full mt-auto">
                      {displayButtonText}
                    </Button>
                  )}
                </Card>
              );
            })}
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
