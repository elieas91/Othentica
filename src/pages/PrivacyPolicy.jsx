import React, { useEffect, useState, useContext } from 'react';
import { PublicLocaleContext } from '../contexts/PublicLocaleContext';
import Banner from '../components/ui/Banner';
import PrivacyPolicyBG from '../assets/img/privacy-policy.webp';

const PrivacyPolicy = () => {
  const { locale, isArabic } = useContext(PublicLocaleContext);
  const [privacyPolicyHtml, setprivacyPolicyHtml] = useState('');
  const bannerTitle = locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy';

  useEffect(() => {
    const file =
      locale === 'ar'
        ? '/privacy-policy-arabic.html'
        : '/privacy-policy-english.html';

    fetch(file)
      .then((res) => res.text())
      .then((html) => setprivacyPolicyHtml(html))
      .catch((err) => console.error('Failed to load privacy policy:', err));
  }, [locale]);

  return (
    <div className="relative min-h-screen dark:bg-primary">
      <div className="bg-blue-400/40">
        <Banner
          title={bannerTitle}
          hasGradientTransparentBottom={false}
          minHeight="min-h-[80vh]"
          backgroundImage={PrivacyPolicyBG}
          hasTransparentSides={false}
          hasOverlay={true}
          textInRectangle={true}
        />
      </div>
      <div className="px-12 md:px-96">
        <div
          dangerouslySetInnerHTML={{ __html: privacyPolicyHtml }}
          className={`mb-12 ${isArabic ? 'text-right' : 'text-left'}`}
          dir={isArabic ? 'rtl' : 'ltr'}
        />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
