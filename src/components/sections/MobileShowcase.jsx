import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
// import Flame from '../../assets/img/flame.webp';
import Phone from '../../assets/img/phone.webp';
import LogoPattern from '../../assets/img/logo_patterns/logo_pattern_2.1_2.webp';
import DownloadAppCard from '../ui/DownloadAppCard';
import apiService from '../../services/api';

const MobileShowcase = () => {
  const [currentAppImageIndex, setCurrentAppImageIndex] = useState(0);
  const [appImages, setAppImages] = useState([]);
  const [sectionData, setSectionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSectionLoading, setIsSectionLoading] = useState(true);

  // Fetch mobile showcase section data from API
  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        setIsSectionLoading(true);
        const response = await apiService.getHomepageSections();
        if (response.success) {
          const mobileShowcaseSection = response.data.find(section => section.section_key === 'mobile_showcase');
          setSectionData(mobileShowcaseSection || null);
        } else {
          console.error('Failed to fetch homepage sections:', response.message);
          setSectionData(null);
        }
      } catch (error) {
        console.error('Error fetching homepage sections:', error);
        setSectionData(null);
      } finally {
        setIsSectionLoading(false);
      }
    };

    fetchSectionData();
  }, []);

  // Fetch mobile showcase images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getMobileShowcaseImages();
        if (response.success) {
          setAppImages(response.data);
        } else {
          console.error('Failed to fetch mobile showcase images:', response.message);
          // Fallback to empty array if API fails
          setAppImages([]);
        }
      } catch (error) {
        console.error('Error fetching mobile showcase images:', error);
        setAppImages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Auto-rotate through app images every 4 seconds
  useEffect(() => {
    if (appImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentAppImageIndex(
        (prevIndex) => (prevIndex + 1) % appImages.length
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [appImages.length]);

  // Both app images change at the same time, but show different images
  const currentAppImage = appImages.length > 0 ? appImages[currentAppImageIndex % appImages.length] : null;
  const secondPhoneImage = appImages.length > 0 ? appImages[(currentAppImageIndex + 1) % appImages.length] : null;

  return (
    <section className="py-16 px-8 lg:px-16 bg-white dark:bg-gray-800 relative overflow-hidden">
      {/* Background layer with logo pattern */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${LogoPattern})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '900px 916px',
          opacity: 0.4,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-2">
          {isSectionLoading ? (
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-lg mb-4 max-w-md mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded-lg mb-2 max-w-2xl mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded-lg max-w-xl mx-auto"></div>
            </div>
          ) : (
            <>
              <h2 className="text-4xl lg:text-5xl font-bold text-primary dark:text-neutral mb-8">
                {sectionData?.title || 'Mobile App Showcase'}
              </h2>
              {sectionData?.description ? (
                <div 
                  className="text-xl text-primary dark:text-gray-200 max-w-3xl mx-auto leading-relaxed prose prose-lg"
                  dangerouslySetInnerHTML={{ __html: sectionData.description }}
                />
              ) : (
                <p className="text-xl text-primary dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
                  Experience our innovative mobile solutions that transform ideas into
                  exceptional digital experiences
                </p>
              )}
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <DownloadAppCard />
          {/* Right Mobile Phone */}
          <div className="relative flex justify-start w-[80%] md:w-full md:justify-center min-h-[500px] sm:min-h-[600px]">
            {/* Background Phone Frame - larger and angled */}
            <div
              className="relative transform -rotate-12 scale-75 sm:scale-90 md:scale-75"
              style={{
                filter: 'drop-shadow(16px 18px 4px rgba(0,0,0,0.7))',
              }}
            >
              <img
                src={Phone}
                alt="Smartphone mockup"
                className="w-80 h-auto opacity-80"
                style={{
                  filter:
                    'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.15)) drop-shadow(0 10px 10px rgba(0, 0, 0, 0.1))',
                }}
              />
              {/* App content overlay inside the phone screen */}
              <div className="absolute inset-0 flex items-center justify-center z-[-1]">
                <div className="w-full h-full rounded-3xl flex justify-center items-center">
                  {isLoading ? (
                    <div className="w-[92%] h-[98%] top-[0.3rem] md:h-[97%] bg-gray-200 rounded-3xl flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : currentAppImage ? (
                    <img
                      src={currentAppImage.image_url}
                      alt={currentAppImage.alt_text || currentAppImage.title || "App interface"}
                      className="absolute w-[92%] h-[98%] top-[0.3rem] md:h-[97%] object-contain transition-all duration-700 ease-in-out"
                    />
                  ) : (
                    <div className="w-[92%] h-[98%] top-[0.3rem] md:h-[97%] bg-gray-200 rounded-3xl flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No images available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Foreground Phone Frame - smaller and overlapping */}
            <div
              className="absolute transform rotate-12 scale-[.60] sm:scale-[.70] md:scale-[.60] translate-y-20 sm:translate-y-32 md:translate-y-40 translate-x-20 sm:translate-x-28 md:translate-x-36 z-20"
              style={{
                filter: 'drop-shadow(16px 18px 4px rgba(0,0,0,0.7))',
              }}
            >
              <img
                src={Phone}
                alt="Smartphone mockup"
                className="w-80 h-auto"
              />
              {/* App content overlay inside the phone screen */}
              <div className="absolute inset-0 flex items-center justify-center z-[-1]">
                <div className="w-full h-full rounded-3xl flex justify-center items-center">
                  {isLoading ? (
                    <div className="w-[92%] h-[97%] bg-gray-200 rounded-3xl flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : secondPhoneImage ? (
                    <img
                      src={secondPhoneImage.image_url}
                      alt={secondPhoneImage.alt_text || secondPhoneImage.title || "App interface"}
                      className="w-[92%] h-[97%] object-contain transition-all duration-700 ease-in-out"
                    />
                  ) : (
                    <div className="w-[92%] h-[97%] bg-gray-200 rounded-3xl flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No images available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            {/* <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full animate-bounce">
            <img src={Flame} alt="Othentica" />
          </div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full animate-pulse">
            <img src={Flame} alt="Othentica" />
          </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileShowcase;
