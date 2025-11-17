import React, { useEffect, useState } from 'react';
import Banner from '../components/ui/Banner';
import PrivacyPolicyBG from '../assets/img/privacy-policy.webp';

const PrivacyPolicy = () => {
  const [privacyPolicyHtml, setprivacyPolicyHtml] = useState('');

  useEffect(() => {
    fetch('/privacy_policy.html')
      .then((res) => res.text())
      .then((html) => setprivacyPolicyHtml(html))
      .catch((err) => console.error('Failed to load privacy policy:', err));
  }, []);

  return (
    <div className="relative min-h-screen dark:bg-primary">
      <div className="bg-blue-400/40">
        <Banner
          title="Privacy Policy"
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
          className="mb-12"
        />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
