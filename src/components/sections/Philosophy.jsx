import React, { useState, useEffect, useContext } from 'react';
import Button from '../ui/Button';
import OthenticaImg from '../../assets/img/philosophy/othentica-bg.webp';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import { PublicLocaleContext } from '../../contexts/PublicLocaleContext';

const defaultPhilosophyData = {
  title: 'What is Othentica?',
  title_ar: '',
  description: 'Othentica is a gamified wellness platform that helps people step into their authentic selves through science-backed, engaging daily quests. Designed as a treasure map for growth, it blends brain health, emotional resilience, and simple everyday practices into an interactive journey.',
  description_ar: '',
  button_text: 'Explore Corporate Packages',
  button_text_ar: '',
  button_link: '/contact',
  button_variant: 'secondary',
  image: OthenticaImg
};

const Philosophy = ({ sectionData: sectionDataProp }) => {
  const { isArabic, locale } = useContext(PublicLocaleContext);
  const [philosophyData, setPhilosophyData] = useState(defaultPhilosophyData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sectionDataProp) {
      const sectionData = sectionDataProp;
      setPhilosophyData({
        title: sectionData.title || defaultPhilosophyData.title,
        title_ar: sectionData.title_ar ?? defaultPhilosophyData.title_ar,
        description: sectionData.description || defaultPhilosophyData.description,
        description_ar: sectionData.description_ar ?? defaultPhilosophyData.description_ar,
        button_text: sectionData.button_text || defaultPhilosophyData.button_text,
        button_text_ar: sectionData.button_text_ar ?? defaultPhilosophyData.button_text_ar,
        button_link: sectionData.button_link || defaultPhilosophyData.button_link,
        button_variant: sectionData.button_variant || defaultPhilosophyData.button_variant,
        image: sectionData.image_url || defaultPhilosophyData.image
      });
      setIsLoading(false);
      return;
    }
    const fetchPhilosophyData = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getHomepageSectionByKey('philosophy', locale);
        if (response.success && response.data) {
          const sectionData = response.data;
          setPhilosophyData({
            title: sectionData.title || defaultPhilosophyData.title,
            title_ar: sectionData.title_ar ?? defaultPhilosophyData.title_ar,
            description: sectionData.description || defaultPhilosophyData.description,
            description_ar: sectionData.description_ar ?? defaultPhilosophyData.description_ar,
            button_text: sectionData.button_text || defaultPhilosophyData.button_text,
            button_text_ar: sectionData.button_text_ar ?? defaultPhilosophyData.button_text_ar,
            button_link: sectionData.button_link || defaultPhilosophyData.button_link,
            button_variant: sectionData.button_variant || defaultPhilosophyData.button_variant,
            image: sectionData.image_url || defaultPhilosophyData.image
          });
        }
      } catch (error) {
        console.error('Error fetching philosophy data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPhilosophyData();
  }, [sectionDataProp, locale]);

  return (
    <section
      className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 bg-white dark:bg-primary"
      id="philosophySec"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
        {/* Left Image */}
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-800 dark:to-pink-900 rounded-3xl overflow-hidden shadow-xl-professional">
            {isLoading ? (
              <div className="w-full h-full bg-gray-200 animate-pulse"></div>
            ) : (
              <img
                src={philosophyData.image}
                alt="Philosophy"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </div>
        </div>

        {/* Right Text */}
        <div className="order-first lg:order-last">
          {isLoading ? (
            <div className="space-y-6 sm:space-y-8 animate-pulse">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded w-48"></div>
            </div>
          ) : (
            <>
              <div className="space-y-6 sm:space-y-8">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary dark:text-neutral font-sans" dir={isArabic ? 'rtl' : 'ltr'}>
                  {isArabic && philosophyData.title_ar ? philosophyData.title_ar : philosophyData.title}
                </h2>
                <div 
                  className="text-base sm:text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed prose prose-lg max-w-none"
                  dir={isArabic ? 'rtl' : 'ltr'}
                  dangerouslySetInnerHTML={{ __html: isArabic && philosophyData.description_ar ? philosophyData.description_ar : philosophyData.description }}
                />
              </div>
              <div className="mt-6 sm:mt-8">
                <Link
                  to={philosophyData.button_link}
                  target="_blank"
                  className="block w-full sm:w-auto"
                >
                  <Button
                    variant={philosophyData.button_variant}
                    size="large"
                    className="w-full sm:w-auto"
                    style={isArabic ? { direction: 'rtl' } : undefined}
                  >
                    {isArabic && philosophyData.button_text_ar ? philosophyData.button_text_ar : philosophyData.button_text}
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
