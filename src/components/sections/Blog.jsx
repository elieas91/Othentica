import React from 'react';

const SocialMedia = () => {


  // Social platforms with direct links
  const socialPlatforms = {
    facebook: {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      url: 'https://www.facebook.com/share/1C2Qcrsj2d/',
    },
    linkedin: {
      name: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      color: 'bg-blue-700',
      hoverColor: 'hover:bg-blue-800',
      url: 'https://www.linkedin.com/company/othentica-fzc-llc',
    },
  };


  const handleSocialClick = (platform) => {
    if (platform.url) {
      window.open(platform.url, '_blank');
    }
  };

  return (
    <section className="py-16 bg-white">

      {/* Social Media Icons - Direct Links */}
      <div className="flex justify-center mb-12">
        <div className="flex gap-6">
          {Object.entries(socialPlatforms).map(([key, platform]) => (
            <button
              key={key}
              onClick={() => handleSocialClick(platform)}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg text-white focus:outline-none border-0 border-transparent hover:scale-110 ${platform.color} ${platform.hoverColor}`}
              aria-label={`Visit Othentica FZC LLC on ${platform.name}`}
                >
                  {platform.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Company Info */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">
          Othentica FZC LLC
        </h2>
        <p className="text-primary/70 text-lg">
          Follow us on social media for updates and insights
          </p>
        </div>
    </section>
  );
};

export default SocialMedia;
