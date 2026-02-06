import React, { useState, useEffect, useContext } from 'react';
import GooglePlayBadge from '../../assets/img/stores_badges/google_play_badge.webp';
import AppStoreBadge from '../../assets/img/stores_badges/app_store_badge.webp';
import Button from './Button';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import { PublicLocaleContext } from '../../contexts/PublicLocaleContext';
import { getT } from '../../data/translations';

const DownloadAppCard = () => {
  const { isArabic, locale } = useContext(PublicLocaleContext);
  const t = getT(locale);
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
        <div className="min-h-[200px] flex flex-col justify-center" dir={isArabic ? 'rtl' : 'ltr'}>
          <h2 className="text-2xl lg:text-4xl font-bold text-primary dark:text-neutral">
            {t('downloadOthenticaApp')}
          </h2>
          <p className="text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed mt-4 mb-4">
            {t('downloadCardFallback')}
          </p>
          <div className="flex justify-center md:justify-start">
            <Link to="/contact" target="_blank">
              <Button variant="secondary" size="large">
                {t('bookADemo')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayTitle = isArabic && (cardData?.title_ar?.trim?.() || cardData?.title_ar) ? cardData.title_ar : (cardData?.title || t('downloadOthenticaApp'));
  const displayDescription = isArabic && (cardData?.description_ar?.trim?.() || cardData?.description_ar) ? cardData.description_ar : cardData?.description;

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 relative">
      <div className="min-h-[200px] flex flex-col justify-center" dir={isArabic ? 'rtl' : 'ltr'}>
        <h2 className="text-3xl lg:text-4xl font-bold text-primary dark:text-neutral">
          {displayTitle}
        </h2>
        {displayDescription ? (
          <div 
            className="text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed my-4 prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: displayDescription }}
          />
        ) : (
          <p className="text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed mt-4 mb-4">
            {t('downloadCardFallback')}
          </p>
        )}
        <div className="flex justify-center md:justify-start">
          <Link to="/contact" target="_blank">
            <Button variant="secondary" size="large">
              {t('bookADemo')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 mt-6">
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
              alt={t('getItOnGooglePlay')}
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
              alt={t('downloadOnAppStore')}
              className="h-12"
            />
          </a>
        )}
      </div>
    </div>
  );
};

export default DownloadAppCard;
