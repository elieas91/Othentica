import React, { useState, useEffect, useContext } from 'react';
import Button from '../ui/Button';
// import Logo from '../../assets/img/logo.webp';
import Logo_o_white from '../../assets/img/logo_o.webp';
import Flame from '../../assets/img/flame.webp';
// import HeroBg from '../../assets/img/hero_bg2.webp';
// import HeroBg2 from '../../assets/img/hero_bg3.webp';
import { Link } from 'react-router-dom';
import HeroBg3 from '../../assets/img/hero_bg3v3.webp';
import apiService from '../../services/api';
import { PublicLocaleContext } from '../../contexts/PublicLocaleContext';

const defaultHeroData = {
  title: 'Step into your authentic self',
  title_ar: '',
  description: 'Wellness is optional. Health is essential. Corporate health is the evolution. It\'s the foundation of energy, resilience, and performance.',
  description_ar: '',
  primaryButton: {
    text: 'Onboard your Team',
    link: '/contact',
    variant: 'accent'
  },
  secondaryButton: {
    text: 'What is Othentica',
    link: '#philosophySec',
    variant: 'secondary'
  },
  backgroundImage: HeroBg3
};

const Hero = ({ sectionData: sectionDataProp }) => {
  const { isArabic, locale } = useContext(PublicLocaleContext);
  // Function to get the correct background image URL
  const getBackgroundImageUrl = (url) => {
    if (!url) return HeroBg3;
    if (url.startsWith('/assets/img/hero_bg3v3.webp')) return HeroBg3;
    return url;
  };

  const [heroData, setHeroData] = useState(defaultHeroData);
  const [isLoading, setIsLoading] = useState(true);

  // Use section data from Home (raw section with title_ar, description_ar) or fetch once
  useEffect(() => {
    const applySection = (sectionData) => {
      if (!sectionData) return;
      const content = sectionData.content ? (typeof sectionData.content === 'string' ? JSON.parse(sectionData.content || '{}') : sectionData.content) : {};
      const contentAr = sectionData.content_ar ? (typeof sectionData.content_ar === 'string' ? JSON.parse(sectionData.content_ar || '{}') : sectionData.content_ar) : {};
      const subtitle = sectionData.subtitle || '';
      const subtitleAr = sectionData.subtitle_ar || '';
      const desc = sectionData.description || defaultHeroData.description;
      const descAr = sectionData.description_ar || '';
      const combinedDesc = subtitle && desc ? `${subtitle} ${desc}`.trim() : desc;
      const combinedDescAr = (subtitleAr && descAr ? `${subtitleAr} ${descAr}`.trim() : descAr) || combinedDesc;
      const primaryBtn = content.primaryButton || defaultHeroData.primaryButton;
      const secondaryBtn = content.secondaryButton || defaultHeroData.secondaryButton;
      const primaryBtnAr = contentAr.primaryButton || primaryBtn;
      const secondaryBtnAr = contentAr.secondaryButton || secondaryBtn;
      setHeroData({
        title: sectionData.title || defaultHeroData.title,
        title_ar: sectionData.title_ar || '',
        description: combinedDesc,
        description_ar: combinedDescAr,
        primaryButton: primaryBtn,
        primaryButtonAr: primaryBtnAr,
        secondaryButton: secondaryBtn,
        secondaryButtonAr: secondaryBtnAr,
        backgroundImage: getBackgroundImageUrl(sectionData.background_image_url)
      });
      setIsLoading(false);
    };

    if (sectionDataProp) {
      applySection(sectionDataProp);
      return;
    }
    const fetchHeroData = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getHomepageSectionByKey('hero');
        if (response.success && response.data) applySection(response.data);
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHeroData();
  }, [sectionDataProp]);

  // Function to scroll to philosophy section
  const scrollToPhilosophy = () => {
    const philosophySection = document.getElementById('philosophySec');
    if (philosophySection) {
      philosophySection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Flame configuration array
  const flames = [
    // Left center area flames (moved toward center, higher up)
    {
      id: 1,
      position: 'top-1/4 left-1/3',
      size: 'w-8',
      opacity: 'opacity-60',
      animation: 'animate-flame-1',
    },
    {
      id: 2,
      position: 'top-1/4 left-2/5',
      size: 'w-6',
      opacity: 'opacity-40',
      animation: 'animate-flame-2',
    },
    {
      id: 3,
      position: 'top-1/3 left-1/3',
      size: 'w-7',
      opacity: 'opacity-70',
      animation: 'animate-flame-3',
    },
    {
      id: 4,
      position: 'top-2/5 left-2/5',
      size: 'w-5',
      opacity: 'opacity-85',
      animation: 'animate-flame-4',
    },
    {
      id: 5,
      position: 'top-1/2 left-2/5',
      size: 'w-10',
      opacity: 'opacity-55',
      animation: 'animate-flame-5',
    },

    // Center area flames (expanded center zone, higher up)
    {
      id: 6,
      position: 'top-1/4 left-1/2',
      size: 'w-7',
      opacity: 'opacity-45',
      animation: 'animate-flame-6',
    },
    {
      id: 7,
      position: 'top-1/3 left-1/2',
      size: 'w-8',
      opacity: 'opacity-55',
      animation: 'animate-flame-7',
    },
    {
      id: 8,
      position: 'top-1/4 left-1/2',
      size: 'w-6',
      opacity: 'opacity-60',
      animation: 'animate-flame-8',
    },

    // Right center area flames (moved toward center, over logo area, higher up)
    {
      id: 9,
      position: 'top-1/3 right-1/3',
      size: 'w-5',
      opacity: 'opacity-90',
      animation: 'animate-flame-9',
    },
    {
      id: 10,
      position: 'top-1/2 right-2/5',
      size: 'w-10',
      opacity: 'opacity-65',
      animation: 'animate-flame-10',
    },
    {
      id: 11,
      position: 'top-1/4 right-1/3',
      size: 'w-6',
      opacity: 'opacity-70',
      animation: 'animate-flame-11',
    },
    {
      id: 12,
      position: 'top-1/3 right-2/5',
      size: 'w-7',
      opacity: 'opacity-40',
      animation: 'animate-flame-12',
    },
    {
      id: 13,
      position: 'top-1/4 right-1/3',
      size: 'w-5',
      opacity: 'opacity-80',
      animation: 'animate-flame-13',
    },

    // Logo area overlay flames (centered over logo, higher up) - fully clear with 100% opacity
    {
      id: 14,
      position: 'top-1/3 right-1/3',
      size: 'w-7',
      opacity: 'opacity-80',
      animation: 'animate-flame-14',
      noBlur: true,
    },
    {
      id: 15,
      position: 'top-1/2 right-1/3',
      size: 'w-8',
      opacity: 'opacity-80',
      animation: 'animate-flame-15',
      noBlur: true,
    },
  ];

  return (
    <section
      className="relative min-h-[90vh] sm:min-h-[85vh] flex items-center justify-start px-4 sm:px-8 lg:px-16 overflow-hidden"
      style={{
        backgroundImage: `url(${getBackgroundImageUrl(heroData.backgroundImage)})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* LCP Image with fetchpriority high for immediate loading */}
      <img
        src={getBackgroundImageUrl(heroData.backgroundImage)}
        alt="Othentica Hero Background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: 'none' }}
        fetchpriority="high"
        loading="eager"
      />
      {/* Animated Background with Logo and Flames */}
      <div className="absolute inset-0 w-full h-full">
        {/* O Logo with Scale Animation - Hidden on mobile */}
        <div className="absolute inset-0 flex items-start justify-end left-[25rem] animate-float hidden sm:flex">
          <img
            src={Logo_o_white}
            alt="Othentica Logo"
            className="w-1/3 h-auto"
          />
        </div>
        {/* Multiple Animated Flames - Hidden on mobile */}
        <div className="absolute inset-0 w-full h-full translate-x-20 hidden sm:block">
          {flames.map((flame) => (
            <div
              key={flame.id}
              className={`absolute ${flame.position} ${flame.animation}`}
            >
              <img
                src={Flame}
                alt={`Flame ${flame.id}`}
                className={`${flame.size} h-auto ${flame.opacity} ${
                  flame.noBlur ? '' : 'blur-sm'
                }`}
              />
            </div>
          ))}
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-10 dark:bg-opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-xl w-full">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-16 bg-white/20 rounded mb-6"></div>
            <div className="h-6 bg-white/20 rounded mb-4"></div>
            <div className="h-6 bg-white/20 rounded mb-4"></div>
            <div className="h-6 bg-white/20 rounded mb-8"></div>
            <div className="flex gap-4">
              <div className="h-12 bg-white/20 rounded w-32"></div>
              <div className="h-12 bg-white/20 rounded w-32"></div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="capitalize text-3xl sm:text-5xl lg:text-7xl font-bold text-white dark:text-white mb-6 sm:mb-8 leading-tight" dir={isArabic ? 'rtl' : 'ltr'}>
              {isArabic && (heroData.title_ar?.trim?.() || heroData.title_ar) ? heroData.title_ar : heroData.title}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-white dark:text-gray-200 mb-8 sm:mb-10 leading-relaxed max-w-3xl" dir={isArabic ? 'rtl' : 'ltr'}>
              <span dangerouslySetInnerHTML={{ __html: (isArabic && (heroData.description_ar?.trim?.() || heroData.description_ar) ? heroData.description_ar : heroData.description) || '' }} />
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4" dir={isArabic ? 'rtl' : undefined}>
              <Link to={(heroData.primaryButtonAr || heroData.primaryButton)?.link || heroData.primaryButton?.link} target="_blank" className="w-full sm:w-auto">
                <Button
                  variant={(heroData.primaryButtonAr || heroData.primaryButton)?.variant || heroData.primaryButton?.variant}
                  size="large"
                  className="w-full sm:w-auto">
                  {isArabic
                    ? (heroData.primaryButton?.text_ar?.trim?.() || heroData.primaryButtonAr?.text || heroData.primaryButton?.text)
                    : heroData.primaryButton?.text}
                </Button>
              </Link>
              <Button
                variant={(heroData.secondaryButtonAr || heroData.secondaryButton)?.variant || heroData.secondaryButton?.variant}
                size="large"
                className="w-full sm:w-auto"
                onClick={scrollToPhilosophy}
              >
                {isArabic
                  ? (heroData.secondaryButton?.text_ar?.trim?.() || heroData.secondaryButtonAr?.text || heroData.secondaryButton?.text)
                  : heroData.secondaryButton?.text}
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;
