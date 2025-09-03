import GooglePlayBadge from '../../assets/img/stores_badges/google_play_badge.webp';
import AppStoreBadge from '../../assets/img/stores_badges/app_store_badge.webp';
import Button from './Button';
import { Link } from 'react-router-dom';

const DownloadAppCard = () => {
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
          Get it now and stay connected wherever you go!
        </p>
        <Button 
          variant="secondary" 
          size="large"
          onClick={() => window.open('/contact', '_blank')}
        >
          Book a Demo
        </Button>
      </div>

      <div className="flex flex-row items-center gap-4 mt-6">
        {/* Google Play */}
        <a
          href="https://play.google.com/store/apps/details?id=your.app.id"
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <img
            src={GooglePlayBadge}
            alt="Get it on Google Play"
            className="h-12"
          />
        </a>

        {/* App Store */}
        <a
          href="https://apps.apple.com/app/idyourappid"
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <img
            src={AppStoreBadge}
            alt="Download on the App Store"
            className="h-12"
          />
        </a>
      </div>
    </div>
  );
};

export default DownloadAppCard;
