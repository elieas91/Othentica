import React, { useEffect, useState, useContext } from 'react';
import { PublicLocaleContext } from '../contexts/PublicLocaleContext';
import Banner from '../components/ui/Banner';
import TermsAndConditionsBG from '../assets/img/terms-and-conditions.webp';

const TermsConditions = () => {
  const { locale, isArabic } = useContext(PublicLocaleContext);
  const [termsAndConditionsHtml, setTermsAndConditionsHtml] = useState('');
  const bannerTitle =
    locale === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions';

  useEffect(() => {
    const file =
      locale === 'ar'
        ? '/terms-and-conditions-arabic.html'
        : '/terms-and-conditions-english.html';

    fetch(file)
      .then((res) => res.text())
      .then((html) => setTermsAndConditionsHtml(html))
      .catch((err) =>
        console.error('Failed to load terms and conditions:', err),
      );
  }, [locale]);

  return (
    <div className="relative min-h-screen dark:bg-primary">
      <div className="bg-blue-400/40">
        <Banner
          title={bannerTitle}
          hasGradientTransparentBottom={false}
          minHeight="min-h-[80vh]"
          backgroundImage={TermsAndConditionsBG}
          hasTransparentSides={false}
          hasOverlay={true}
          textInRectangle={true}
        />
      </div>
      <div className="px-12 md:px-96">
        <div
          dangerouslySetInnerHTML={{ __html: termsAndConditionsHtml }}
          className={`mb-12 ${isArabic ? 'text-right' : 'text-left'}`}
          dir={isArabic ? 'rtl' : 'ltr'}
        />
      </div>
    </div>
  );
};

export default TermsConditions;
