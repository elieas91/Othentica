import React, { useEffect, useState, useContext } from 'react';
import { PublicLocaleContext } from '../contexts/PublicLocaleContext';
import Banner from '../components/ui/Banner';
import DisclaimerBG from '../assets/img/disclaimer.webp';

const Disclaimers = () => {
  const { locale, isArabic } = useContext(PublicLocaleContext);
  const [disclaimersHtml, setDisclaimersHtml] = useState('');
  const bannerTitle = locale === 'ar' ? 'إخلاء المسؤولية' : 'Disclaimers';

  useEffect(() => {
    const file =
      locale === 'ar'
        ? '/disclaimers-arabic.html'
        : '/disclaimers-english.html';

    fetch(file)
      .then((res) => res.text())
      .then((html) => setDisclaimersHtml(html))
      .catch((err) => console.error('Failed to load disclaimers:', err));
  }, [locale]);

  return (
    <div className="relative min-h-screen dark:bg-primary">
      <div className="bg-blue-400/40">
        <Banner
          title={bannerTitle}
          hasGradientTransparentBottom={false}
          minHeight="min-h-[80vh]"
          backgroundImage={DisclaimerBG}
          hasTransparentSides={false}
          hasOverlay={true}
          textInRectangle={true}
        />
      </div>
      <div className="px-12 md:px-96">
        <div
          dangerouslySetInnerHTML={{ __html: disclaimersHtml }}
          className={`mb-12 ${isArabic ? 'text-right' : 'text-left'}`}
          dir={isArabic ? 'rtl' : 'ltr'}
        />
      </div>
    </div>
  );
};

export default Disclaimers;
