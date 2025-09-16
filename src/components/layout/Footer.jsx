import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaYoutube, FaInstagram, FaFacebook } from 'react-icons/fa';
import WhiteLogo from '../../assets/img/logo_white.webp';
import AppStoreBadge from '../../assets/img/stores_badges/app_store_badge.webp';
import GooglePlayBadge from '../../assets/img/stores_badges/google_play_badge.webp';

const Footer = ({ minimal = false }) => {
  return (
    <footer className="bg-primary py-10 px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content - only show if not minimal */}
        {!minimal && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2 text-center md:text-left">
              {/* <h3 className="text-2xl font-bold text-neutral mb-4">Othentica</h3> */}
              <img
                src={WhiteLogo}
                alt="Othentica Logo"
                className="h-10 w-auto mb-6 mx-auto md:mx-0"
              />
              <p className="text-gray-100 mb-6 font-bold leading-relaxed">
                Your map to clarity, resilience, and growth.
              </p>

              {/* App Store Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center items-center md:items-start md:justify-start">
                <img
                  src={AppStoreBadge}
                  alt="Download on the App Store"
                  className="h-12 w-auto"
                />

                <img
                  src={GooglePlayBadge}
                  alt="Get it on Google Play"
                  className="h-12 w-auto"
                />
              </div>

              <div className="flex space-x-4 justify-center md:justify-start">
                <a
                  href="https://www.linkedin.com/company/othentica-fzc-llc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center hover:bg-secondary/90 transition-colors duration-500 ease-in-out cursor-pointer"
                  aria-label="Follow us on LinkedIn"
                >
                  <FaLinkedin className="text-neutral text-lg" />
                </a>

                {/* <a
                href="https://youtube.com/@othentica"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center hover:bg-secondary/90 transition-colors duration-500 ease-in-out cursor-pointer"
                aria-label="Subscribe to our YouTube channel"
              >
                <FaYoutube className="text-neutral text-lg" />
              </a> */}

                <a
                  href="https://www.instagram.com/othenticaapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center hover:bg-secondary/90 transition-colors duration-500 ease-in-out cursor-pointer"
                  aria-label="Follow us on Instagram"
                >
                  <FaInstagram className="text-neutral text-lg" />
                </a>

                <a
                  href="https://www.facebook.com/share/1C2Qcrsj2d/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center hover:bg-secondary/90 transition-colors duration-500 ease-in-out cursor-pointer"
                  aria-label="Follow us on Facebook"
                >
                  <FaFacebook className="text-neutral text-lg" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-neutral mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li className="text-neutral hover:text-secondary hover:translate-x-1 transition-all duration-300 ease-in-out">
                  <Link to="/">Home</Link>
                </li>
                <li className="text-neutral hover:text-secondary hover:translate-x-1 transition-all duration-300 ease-in-out">
                  <Link to="/about">About</Link>
                </li>
                <li className="text-neutral hover:text-secondary hover:translate-x-1 transition-all duration-300 ease-in-out">
                  <Link to="/services">Services</Link>
                </li>
                <li className="text-neutral hover:text-secondary hover:translate-x-1 transition-all duration-300 ease-in-out">
                  <Link to="/blog">Blog</Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-neutral mb-4">Services</h3>
              <ul className="space-y-2">
                <li className="text-neutral hover:text-secondary hover:translate-x-1 transition-all duration-300 ease-in-out">
                  <Link to="/services#app">The Othentica App</Link>
                </li>
                <li className="text-neutral hover:text-secondary hover:translate-x-1 transition-all duration-300 ease-in-out">
                  <Link to="/services#programs">Tailored Programs</Link>
                </li>
                <li className="text-neutral hover:text-secondary hover:translate-x-1 transition-all duration-300 ease-in-out">
                  <Link to="/services#talks">Talks & Workshops</Link>
                </li>
                <li className="text-neutral hover:text-secondary hover:translate-x-1 transition-all duration-300 ease-in-out">
                  <Link to="/services#one-to-one">1:1 Guidance</Link>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Bottom Footer */}
        <div
          className={`border-t border-white/20 pt-8 ${
            !minimal ? 'mt-8' : 'mt-0'
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-row items-center justify-center space-x-0 text-sm text-center">
              <a
                href="/terms-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 text-gray-200 hover:text-neutral hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Terms & Conditions
              </a>
              <span className="text-gray-400">|</span>
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 text-gray-200 hover:text-neutral hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Privacy Policy
              </a>
              <span className="text-gray-400">|</span>
              <a
                href="/disclaimers"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 text-gray-200 hover:text-neutral hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Disclaimers
              </a>
              <span className="text-gray-400">|</span>
              <span className="px-3 text-gray-200">
                © 2025 Othentica. All rights reserved.
              </span>
            </div>
            <a
              href="https://horiverde.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 mt-6 text-gray-200 hover:text-neutral hover:scale-105 transition-all duration-300 ease-in-out text-sm font-medium"
            >
              Powered By{' '}
              <span className="uppercase text-secondary hover:text-accent transition-colors duration-300">
                Horiverde
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
