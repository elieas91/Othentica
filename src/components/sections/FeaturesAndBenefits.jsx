import React, { useState, useEffect } from 'react';
import Flame from '../../assets/img/flame.webp';
import { appFeaturesData as fallbackAppFeaturesData } from '../../data/appFeaturesData';
import { appBenefitsData as fallbackAppBenefitsData } from '../../data/appBenefitsData';
import AnimateOnScroll from '../ui/AnimateOnScroll';
import apiService from '../../services/api';

const Features = ({ appFeaturesData, isLoading }) => {
  if (isLoading) {
    return (
      <AnimateOnScroll animation="fadeInLeft" delay={200} duration={800}>
        <section className="py-16 px-8 lg:px-16 rounded-3xl shadow-professional bg-white dark:bg-primary relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-primary font-medium">Loading features...</p>
            </div>
          </div>
        </section>
      </AnimateOnScroll>
    );
  }

  return (
    <AnimateOnScroll animation="fadeInLeft" delay={200} duration={800}>
      <section className="py-16 px-8 lg:px-16 rounded-3xl shadow-professional bg-white dark:bg-primary relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-8">
              <span className="flex items-center justify-center w-full max-w-md bg-secondary rounded-lg shadow-md px-8 py-6">
                <h2 className="text-xl lg:text-3xl font-bold text-white dark:text-neutral">
                  Features
                </h2>
              </span>
            </div>
          </div>
          <div className="relative z-10 flex flex-col justify-start h-[300px] overflow-y-auto top-[2rem]">
            <ul className="text-gray-600 text-xl text-left px-4 leading-[2.5rem] mx-auto">
              {appFeaturesData.map((feature) => (
                <li key={feature.id} className="flex items-start mb-2">
                  <img
                    src={Flame}
                    alt="Bullet Icon"
                    className="w-auto h-7 mr-3 mt-1"
                  />
                  <span>{feature.feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  );
};

const Benefits = ({ appBenefitsData, isLoading }) => {
  if (isLoading) {
    return (
      <AnimateOnScroll animation="fadeInRight" delay={400} duration={800}>
        <section className="py-16 px-8 lg:px-16 rounded-3xl shadow-professional bg-white dark:bg-primary relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-primary font-medium">Loading benefits...</p>
            </div>
          </div>
        </section>
      </AnimateOnScroll>
    );
  }

  return (
    <AnimateOnScroll animation="fadeInRight" delay={400} duration={800}>
      <section className="py-16 px-8 lg:px-16 rounded-3xl shadow-professional bg-white dark:bg-primary relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-8">
              <span className="flex items-center justify-center w-full max-w-md bg-secondary rounded-lg shadow-md px-8 py-6">
                <h2 className="text-xl lg:text-3xl font-bold text-white dark:text-neutral">
                  Benefits
                </h2>
              </span>
            </div>
          </div>
          <div className="relative z-10 flex flex-col justify-start h-[300px] overflow-y-auto top-[2rem]">
            <ul className="text-gray-600 text-xl text-left px-4 leading-[2.5rem] mx-auto">
              {appBenefitsData.map((benefit) => (
                <li key={benefit.id} className="flex items-start mb-2">
                  <img
                    src={Flame}
                    alt="Bullet Icon"
                    className="w-auto h-7 mr-3 mt-1"
                  />
                  <span>{benefit.benefit}</span>
                </li>
              ))}
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

