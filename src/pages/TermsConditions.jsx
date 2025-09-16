import { useEffect, useState } from 'react';
import Banner from '../components/ui/Banner';
import TermsAndConditionsBG from '../assets/img/terms-and-conditions.webp';

const TermsConditions = () => {
  const [termsAndConditionsHtml, setTermsAndConditionsHtml] = useState('');

  useEffect(() => {
    fetch('/terms_and_conditions_of_use.html')
      .then((res) => res.text())
      .then((html) => setTermsAndConditionsHtml(html))
      .catch((err) =>
        console.error('Failed to load terms and conditions:', err)
      );
  }, []);

  return (
    <div className="relative min-h-screen dark:bg-primary">
      <div className="bg-blue-400/40">
        <Banner
          title="Terms & Conditions"
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
          className="mb-12"
        />
      </div>
    </div>
  );
};

export default TermsConditions;
