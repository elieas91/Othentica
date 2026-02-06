import React, { useState, useEffect, useContext } from 'react';
import { securityData } from '../../data/securityData';
import Card from '../ui/Card';
import FlameSolid from '../../assets/img/flame_solid.webp';
import apiService from '../../services/api';
import { PublicLocaleContext } from '../../contexts/PublicLocaleContext';
import { getT } from '../../data/translations';

const Security = () => {
  const { isArabic, locale } = useContext(PublicLocaleContext);
  const t = getT(locale);
  const [securityCards, setSecurityCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get emoji for predefined icons
  const getIconEmoji = (iconName) => {
    const iconMap = {
      'shield-check': '🛡️',
      'document-check': '📄',
      'certificate': '🏆',
      'magnifying-glass': '🔍',
      'lock-closed': '🔒',
      'key': '🔑',
      'eye': '👁️',
      'finger-print': '👆',
      'server': '🖥️',
      'cloud': '☁️',
      'globe-alt': '🌐',
      'cpu-chip': '💻',
      'wifi': '📶',
      'fire': '🔥',
      'bolt': '⚡',
      'star': '⭐'
    };
    return iconMap[iconName] || '🔒';
  };

  useEffect(() => {
    const fetchSecurityCards = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await apiService.getSecurityFeatures();
        
        if (response.success && response.data) {
          setSecurityCards(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch security features');
        }
      } catch (error) {
        console.error('Error fetching security features:', error);
        setError(error.message);
        // Fallback to static data
        setSecurityCards(securityData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSecurityCards();
  }, []);

  return (
    <section className="py-16 px-8 lg:px-16 bg-white dark:bg-primary rounded-xl shadow-lg mt-12">
      {/* Right Flame */}
      <img
        src={FlameSolid}
        alt="Right Flame"
        className="absolute right-4 lg:right-16 top-1/2 w-48 lg:w-64 opacity-30 pointer-events-none "
      />
      {/* Left Flame 1 */}
      <img
        src={FlameSolid}
        alt="Left Flame"
        className="absolute left-4 lg:left-16 top-1/4 w-32 lg:w-44 opacity-30 pointer-events-none "
      />
      {/* Left Flame 2 */}
      <img
        src={FlameSolid}
        alt="Left Flame"
        className="absolute left-8 lg:left-36 top-1/2 w-32 lg:w-44 opacity-30 pointer-events-none "
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 lg:mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary dark:text-neutral mb-8" dir={isArabic ? 'rtl' : 'ltr'}>
            {t('enterpriseSecurity')}
          </h2>
          <p className="text-xl text-primary dark:text-gray-200 max-w-3xl mx-auto leading-relaxed" dir={isArabic ? 'rtl' : 'ltr'}>
            {t('enterpriseSecuritySubtitle')}
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
            <span className="ml-2 text-gray-600">{t('loadingSecurity')}</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{t('errorLoadingSecurity')} {error}</p>
            <p className="text-gray-600">{t('usingFallbackData')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {securityCards.map((security) => {
              return (
                <Card
                  key={security.id}
                  showHoverShadow={false}
                  className="text-center h-full group"
                >
                  <div className="flex flex-col flex-grow">
                    <div className="text-5xl mb-6">
                      {security.icon_url ? (
                        <img
                          src={security.icon_url}
                          alt={security.title}
                          className="mx-auto w-20 h-20 object-contain"
                        />
                      ) : security.icon ? (
                        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                          <span className="text-4xl">
                            {getIconEmoji(security.icon)}
                          </span>
                        </div>
                      ) : (
                        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                          <span className="text-4xl">🔒</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-primary dark:text-neutral mb-4" dir={isArabic ? 'rtl' : 'ltr'}>
                      {isArabic && (security.title_ar?.trim?.() || security.title_ar) ? security.title_ar : security.title}
                    </h3>
                    <div className="text-primary dark:text-gray-200 mb-8 leading-relaxed h-[200px] overflow-y-auto px-2" dir={isArabic ? 'rtl' : 'ltr'}>
                      {isArabic && (security.description_ar?.trim?.() || security.description_ar)
                        ? (typeof security.description_ar === 'string' ? security.description_ar : String(security.description_ar))
                        : (typeof security.description === 'string' ? security.description : String(security.description ?? ''))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Security;
