import React, { useState, useEffect, useContext } from 'react';
import Banner from '../components/ui/Banner';
import BannerBg from '../assets/img/contact/dubai_bg.webp';
import ContactUs from '../components/ui/ContactUs';
import { PublicLocaleContext } from '../contexts/PublicLocaleContext';
import apiService from '../services/api';

const DEFAULT_BANNER_TITLE = 'Every Successful Partnership Starts with a Phone Call';

const Contact = () => {
  const { locale } = useContext(PublicLocaleContext);
  const [sectionData, setSectionData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    apiService.getHomepageSectionByKey('contact', locale).then((res) => {
      if (!cancelled && res.success && res.data) {
        setSectionData(res.data);
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [locale]);

  const title = sectionData?.title ?? DEFAULT_BANNER_TITLE;
  const subtitle = sectionData?.subtitle ?? '';
  const description = sectionData?.description ?? '';

  return (
    <div className="relative min-h-screen dark:bg-primary">
      <div className="bg-blue-400/40">
        <Banner
          title={title}
          subtitle={subtitle}
          description={description}
          buttonText=""
          buttonVariant="accent"
          hasGradientTransparentBottom={false}
          minHeight="min-h-[80vh]"
          backgroundImage={BannerBg}
          hasTransparentSides={false}
          hasOverlay={true}
        />
      </div>

      {/* ContactUs overlapping top half */}
      <div className="relative z-40 w-[70%] mx-auto top-[-9rem]">
        <ContactUs />
      </div>

      {/*  */}
    </div>
  );
};

export default Contact;
