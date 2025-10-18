import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import OthenticaImg from '../../assets/img/philosophy/othentica-bg.webp';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';

const Philosophy = () => {
  const [philosophyData, setPhilosophyData] = useState({
    title: 'What is Othentica?',
    description: 'Othentica is a gamified wellness platform that helps people step into their authentic selves through science-backed, engaging daily quests. Designed as a treasure map for growth, it blends brain health, emotional resilience, and simple everyday practices into an interactive journey.',
    // All copy is now managed from description (rich text editor). No additional content JSON.
    button_text: 'Explore Corporate Packages',
    button_link: '/contact',
    button_variant: 'secondary',
    image: OthenticaImg
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPhilosophyData = async () => {
      try {
        setIsLoading(true);
        
        const response = await apiService.getHomepageSectionByKey('philosophy');
        
        if (response.success && response.data) {
          const sectionData = response.data;
          // Philosophy no longer uses the content JSON column
          
          setPhilosophyData({
            title: sectionData.title || philosophyData.title,
            description: sectionData.description || philosophyData.description,
            button_text: sectionData.button_text || philosophyData.button_text,
            button_link: sectionData.button_link || philosophyData.button_link,
            button_variant: sectionData.button_variant || philosophyData.button_variant,
            image: sectionData.image_url || philosophyData.image
          });
        }
      } catch (error) {
        console.error('Error fetching philosophy data:', error);
        // Keep default data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhilosophyData();
  }, [philosophyData.button_link, philosophyData.button_text, philosophyData.button_variant, philosophyData.description, philosophyData.image, philosophyData.title]);

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
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary dark:text-neutral font-sans">
                  {philosophyData.title}
                </h2>
                <div 
                  className="text-base sm:text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: philosophyData.description }}
                />
                {/* No additional content paragraph. All copy comes from description rich text. */}
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
                  >
                    {philosophyData.button_text}
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
