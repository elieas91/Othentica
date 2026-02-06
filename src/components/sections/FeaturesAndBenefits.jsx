import React, { useState, useEffect, useContext } from 'react';
import Flame from '../../assets/img/flame.webp';
import { appFeaturesData as fallbackAppFeaturesData } from '../../data/appFeaturesData';
import { appBenefitsData as fallbackAppBenefitsData } from '../../data/appBenefitsData';
import AnimateOnScroll from '../ui/AnimateOnScroll';
import apiService from '../../services/api';
import { PublicLocaleContext } from '../../contexts/PublicLocaleContext';
import { getT } from '../../data/translations';

const Features = ({ appFeaturesData, isLoading }) => {
  const { isArabic, locale } = useContext(PublicLocaleContext);
  const t = getT(locale);
  if (isLoading) {
    return (
      <AnimateOnScroll animation="fadeInLeft" delay={200} duration={800}>
        <section className="py-16 px-8 lg:px-16 rounded-3xl shadow-professional bg-white dark:bg-primary relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-primary font-medium">{t('loadingFeatures')}</p>
            </div>
          </div>
        </section>
      </AnimateOnScroll>
    );
  }

  return (
    <AnimateOnScroll animation="fadeInLeft" delay={200} duration={800}>
      <section className="py-8 lg:py-16 px-8 lg:px-16 rounded-3xl shadow-professional bg-white dark:bg-primary relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-0 lg:mb-8">
            <div className="flex justify-center items-center mb-0 lg:mb-8">
              <span className="flex items-center justify-center w-full max-w-md bg-secondary rounded-lg shadow-md px-6 py-4 lg:px-8 lg:py-6">
                <h2 className="text-xl lg:text-3xl font-bold text-white dark:text-neutral">
                  {t('features')}
                </h2>
              </span>
            </div>
          </div>
          <div className="relative z-10 flex flex-col justify-start h-[300px] overflow-y-auto top-[2rem]" dir={isArabic ? 'rtl' : 'ltr'}>
            <ul className="text-gray-600 text-lg md:text-xl text-left md:px-4 leading-[2.5rem] mx-auto">
              {appFeaturesData.map((feature) => {
                const text = isArabic && (feature.feature_ar?.trim?.() || feature.feature_ar) ? feature.feature_ar : feature.feature;
                return (
                  <li key={feature.id} className="flex items-start mb-2">
                    <img
                      src={Flame}
                      alt="Bullet Icon"
                      className="w-auto h-7 mr-3 mt-1 flex-shrink-0"
                    />
                    <span>{text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  );
};

const Benefits = ({ appBenefitsData, isLoading }) => {
  const { isArabic, locale } = useContext(PublicLocaleContext);
  const t = getT(locale);
  if (isLoading) {
    return (
      <AnimateOnScroll animation="fadeInRight" delay={400} duration={800}>
        <section className="py-16 px-8 lg:px-16 rounded-3xl shadow-professional bg-white dark:bg-primary relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-primary font-medium">{t('loadingBenefits')}</p>
            </div>
          </div>
        </section>
      </AnimateOnScroll>
    );
  }

  return (
    <AnimateOnScroll animation="fadeInRight" delay={400} duration={800}>
      <section className="py-8 lg:py-16 px-8 lg:px-16 rounded-3xl shadow-professional bg-white dark:bg-primary relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-0 lg:mb-8">
            <div className="flex justify-center items-center mb-0 lg:mb-8">
              <span className="flex items-center justify-center w-full max-w-md bg-secondary rounded-lg shadow-md px-6 py-4 lg:px-8 lg:py-6">
                <h2 className="text-xl lg:text-3xl font-bold text-white dark:text-neutral">
                  {t('benefits')}
                </h2>
              </span>
            </div>
          </div>
          <div className="relative z-10 flex flex-col justify-start h-[300px] overflow-y-auto top-[2rem]" dir={isArabic ? 'rtl' : 'ltr'}>
            <ul className="text-gray-600 text-lg md:text-xl text-left md:px-4 leading-[2.5rem] mx-auto">
              {appBenefitsData.map((benefit) => {
                const text = isArabic && (benefit.benefit_ar?.trim?.() || benefit.benefit_ar) ? benefit.benefit_ar : benefit.benefit;
                return (
                  <li key={benefit.id} className="flex items-start mb-2">
                    <img
                      src={Flame}
                      alt="Bullet Icon"
                      className="w-auto h-7 mr-3 mt-1 flex-shrink-0"
                    />
                    <span>{text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  );
};

const FeaturesAndBenefits = () => {
  const [appFeaturesData, setAppFeaturesData] = useState([]);
  const [appBenefitsData, setAppBenefitsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch both features and benefits in parallel
        const [featuresResponse, benefitsResponse] = await Promise.all([
          apiService.getAppFeatures(),
          apiService.getAppBenefits()
        ]);
        
        // Handle features response
        if (featuresResponse.success && featuresResponse.data) {
          const transformedFeatures = featuresResponse.data.map(feature => ({
            id: feature.id,
            feature: feature.feature,
            feature_ar: feature.feature_ar || null,
            category: feature.category
          }));
          setAppFeaturesData(transformedFeatures);
        } else {
          console.warn('Failed to fetch app features, using fallback data');
          setAppFeaturesData(fallbackAppFeaturesData);
        }

        // Handle benefits response
        if (benefitsResponse.success && benefitsResponse.data) {
          const transformedBenefits = benefitsResponse.data.map(benefit => ({
            id: benefit.id,
            benefit: benefit.benefit,
            benefit_ar: benefit.benefit_ar || null,
            category: benefit.category
          }));
          setAppBenefitsData(transformedBenefits);
        } else {
          console.warn('Failed to fetch app benefits, using fallback data');
          setAppBenefitsData(fallbackAppBenefitsData); // Use static fallback
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        // Fallback to static data
        setAppFeaturesData(fallbackAppFeaturesData);
        setAppBenefitsData(fallbackAppBenefitsData); // Use static fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AnimateOnScroll animation="fadeInUp" delay={100} duration={1000}>
      <section className="py-16 px-8 lg:px-16 bg-white dark:bg-primary relative overflow-hidden">
        <div className="lg, md:mx-16 ">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <Features appFeaturesData={appFeaturesData} isLoading={isLoading} />
            </div>
            <div className="flex-1">
              <Benefits appBenefitsData={appBenefitsData} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  );
};

export default FeaturesAndBenefits;

