import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaYoutube, FaInstagram, FaFacebook } from 'react-icons/fa';
import WhiteLogo from '../../assets/img/logo_white.webp';

const Footer = () => {
  return (
    <footer className="bg-primary py-10 px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            {/* <h3 className="text-2xl font-bold text-neutral mb-4">Othentica</h3> */}
            <img
              src={WhiteLogo}
              alt="Othentica Logo"
              className="h-10 w-auto mb-6"
            />
            <p className="text-gray-100 mb-6 font-bold leading-relaxed">
              Your map to clarity, resilience, and growth.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com/company/othentica"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center hover:bg-secondary/90 transition-colors duration-500 ease-in-out cursor-pointer"
                aria-label="Follow us on LinkedIn"
              >
                <FaLinkedin className="text-neutral text-lg" />
              </a>

              <a
                href="https://youtube.com/@othentica"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center hover:bg-secondary/90 transition-colors duration-500 ease-in-out cursor-pointer"
                aria-label="Subscribe to our YouTube channel"
              >
                <FaYoutube className="text-neutral text-lg" />
              </a>

              <a
                href="https://instagram.com/othentica"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center hover:bg-secondary/90 transition-colors duration-500 ease-in-out cursor-pointer"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram className="text-neutral text-lg" />
              </a>

              <a
                href="https://facebook.com/othentica"
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
          <div>
            <h4 className="text-lg font-bold text-neutral mb-4">Quick Links</h4>
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
          <div>
            <h4 className="text-lg font-bold text-neutral mb-4">Services</h4>
            <ul className="space-y-2">
              <li className="text-neutral hover:text-secondary hover:translate-x-1 transition-all duration-300 ease-in-out">
                <Link to="/services">Wellness Coaching</Link>
              </li>
              <li className="text-neutral hover:text-secondary hover:translate-x-1 transition-all duration-300 ease-in-out">
                <Link to="/services">Mobile Apps</Link>
              </li>
              <li className="text-neutral hover:text-secondary hover:translate-x-1 transition-all duration-300 ease-in-out">
                <Link to="/services">Performance Training</Link>
              </li>
              <li className="text-neutral hover:text-secondary hover:translate-x-1 transition-all duration-300 ease-in-out">
                <Link to="/services">Relaxation Techniques</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mb-4 md:mb-0">
              <p className="text-sm text-gray-200">
                © 2025 Othentica. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              {/* <Link to="/privacy" className="text-gray-200 hover:text-neutral hover:scale-105 transition-all duration-300 ease-in-out">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-200 hover:text-neutral hover:scale-105 transition-all duration-300 ease-in-out">
                Terms of Service
              </Link> */}
              <a
                href="https://horiverde.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-neutral hover:scale-105 transition-all duration-300 ease-in-out text-sm font-medium"
              >
                Powered By{' '}
                <span className="uppercase text-secondary hover:text-accent transition-colors duration-300">
                  Horiverde
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
