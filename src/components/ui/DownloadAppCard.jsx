import React, { useState, useEffect } from 'react';
import GooglePlayBadge from '../../assets/img/stores_badges/google_play_badge.webp';
import AppStoreBadge from '../../assets/img/stores_badges/app_store_badge.webp';
import Button from './Button';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';

const DownloadAppCard = () => {
  const [cardData, setCardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getFirstMobileShowcaseCard();
        if (response.success) {
          setCardData(response.data);
        } else {
          console.error('Failed to fetch mobile showcase card:', response.message);
          setError('Failed to load card data');
        }
      } catch (err) {
        console.error('Error fetching mobile showcase card:', err);
        setError('Failed to load card data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardData();
  }, []);
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-2xl p-8 relative">
        <div className="min-h-[200px] flex flex-col justify-center">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-6 bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-6 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-2xl p-8 relative">
        <div className="min-h-[200px] flex flex-col justify-center">
          <h2 className="text-4xl lg:text-4xl font-bold text-primary dark:text-neutral">
            Download Othentica App
          </h2>
          <p className="text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed mt-4">
            Experience seamless access to our services, exclusive offers, and the
            latest updates, all in one place.
          </p>
          <p className="text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed">
            The Othentica app is available on both the App Store and Google Play.
          </p>
          <p className="text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed mb-4">
            Get it to begin your journey today!
          </p>
          <div className="flex justify-center md:justify-start">
            <Link to="/contact" target="_blank">
              <Button
                variant="secondary"
                size="large"
              >
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 relative">
      <div className="min-h-[200px] flex flex-col justify-center">
        <h2 className="text-4xl lg:text-4xl font-bold text-primary dark:text-neutral">
          {cardData?.title || 'Download Othentica App'}
        </h2>
        {cardData?.description ? (
          <div 
            className="text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed mt-4 prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: cardData.description }}
          />
        ) : (
          <>
            <p className="text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed mt-4">
              Experience seamless access to our services, exclusive offers, and the
              latest updates, all in one place.
            </p>
            <p className="text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed">
              The Othentica app is available on both the App Store and Google Play.
            </p>
            <p className="text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed mb-4">
              Get it to begin your journey today!
            </p>
          </>
        )}
        <div className="flex justify-center md:justify-start">
          <Link to="/contact" target="_blank">
            <Button
              variant="secondary"
              size="large"
            >
              Book a Demo
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-row items-center gap-4 mt-6">
        {/* Google Play */}
        {cardData?.android_link && (
          <a
            href={cardData.android_link}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <img
              src={GooglePlayBadge}
              alt="Get it on Google Play"
              className="h-12"
            />
          </a>
        )}

        {/* App Store */}
        {cardData?.apple_link && (
          <a
            href={cardData.apple_link}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <img
              src={AppStoreBadge}
              alt="Download on the App Store"
              className="h-12"
            />
          </a>
        )}
      </div>
    </div>
  );
};

export default DownloadAppCard;
