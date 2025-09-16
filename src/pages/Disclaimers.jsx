import { useEffect, useState } from 'react';
import Banner from '../components/ui/Banner';
import DisclaimerBG from '../assets/img/disclaimer.webp';

const Disclaimers = () => {
  const [disclaimersHtml, setDisclaimersHtml] = useState('');

  useEffect(() => {
    fetch('/disclaimers.html')
      .then((res) => res.text())
      .then((html) => setDisclaimersHtml(html))
      .catch((err) => console.error('Failed to load disclaimers:', err));
  }, []);

  return (
    <div className="relative min-h-screen dark:bg-primary">
      <div className="bg-blue-400/40">
        <Banner
          title="Disclaimers"
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
          className="mb-12"
        />
      </div>
    </div>
  );
};

export default Disclaimers;
