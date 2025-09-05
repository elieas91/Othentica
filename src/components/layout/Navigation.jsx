import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/useTheme';
import Logo from '../../assets/img/logo.webp';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  // Function to handle About dropdown navigation
  const handleDropdownNavigation = (path, dropdownType) => {
    const [route, section] = path.split('#');

    if (route === '/about') {
      if (section) {
        // If we're already on the about page, scroll to section
        if (location.pathname === '/about') {
          const element = document.getElementById(section);
          if (element) {
            const offset = 80; // Account for fixed navigation height
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
              top: elementPosition,
              behavior: 'smooth',
            });
          }
        } else {
          // Navigate to about page and then scroll
          navigate('/about');
          // Wait for navigation to complete, then scroll
          setTimeout(() => {
            const element = document.getElementById(section);
            if (element) {
              const offset = 80; // Account for fixed navigation height
              const elementPosition = element.offsetTop - offset;
              window.scrollTo({
                top: elementPosition,
                behavior: 'smooth',
              });
            }
          }, 100);
        }
      } else {
        // Just navigate to about page
        navigate('/about');
        window.scrollTo(0, 0);
      }
    } else if (route === '/services') {
      if (section) {
        // If we're already on the services page, scroll to section
        if (location.pathname === '/services') {
          const element = document.getElementById(section);
          if (element) {
            const offset = 80;
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
              top: elementPosition,
              behavior: 'smooth',
            });
          }
        } else {
          // Navigate to services page and then scroll
          navigate('/services');
          setTimeout(() => {
            const element = document.getElementById(section);
            if (element) {
              const offset = 80;
              const elementPosition = element.offsetTop - offset;
              window.scrollTo({
                top: elementPosition,
                behavior: 'smooth',
              });
            }
          }, 100);
        }
      } else {
        // Just navigate to services page
        navigate('/services');
        window.scrollTo(0, 0);
      }
    }

    // Close dropdowns
    if (dropdownType === 'about') setIsAboutDropdownOpen(false);
    if (dropdownType === 'services') setIsServicesDropdownOpen(false);
    setIsMenuOpen(false);
  };

  // Scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navigation when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else {
        // Hide navigation when scrolling down
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { path: '/', label: 'Home' },
    {
      path: '/about',
      label: 'About',
      hasDropdown: true,
      dropdownItems: [
        { path: '/about#meet', label: 'Meet the Founders' },
        {
          path: '/about#mission-vision-values',
          label: 'About Us',
        },
      ],
    },
    {
      path: '/services',
      label: 'Services',
      hasDropdown: true,
      dropdownItems: [
        { path: '/services#app', label: 'The Othentica App' },
        { path: '/services#programs', label: 'Tailored Programs' },
        { path: '/services#talks', label: 'Talks & Workshops' },
        { path: '/services#one-to-one', label: '1:1 Guidance' },
      ],
    },
    // { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`bg-white dark:bg-primary shadow-lg fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="Othentica Logo" className="h-14 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center ml-auto">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                const isDropdownOpen =
                  item.path === '/about'
                    ? isAboutDropdownOpen
                    : isServicesDropdownOpen;
                const setDropdownOpen =
                  item.path === '/about'
                    ? setIsAboutDropdownOpen
                    : setIsServicesDropdownOpen;
                const dropdownType =
                  item.path === '/about' ? 'about' : 'services';
                return (
                  <div key={item.path} className="relative">
                    <div
                      className="relative"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => {
                        setTimeout(() => {
                          if (!document.querySelector('.dropdown-menu:hover')) {
                            setDropdownOpen(false);
                          }
                        }, 100);
                      }}
                    >
                      <button
                        onClick={() =>
                          handleDropdownNavigation(item.path, dropdownType)
                        }
                        className="px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 text-primary dark:text-gray-100 hover:text-white dark:hover:text-secondary hover:bg-secondary dark:hover:bg-gray-800 font-poppins"
                      >
                        <span>{item.label}</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {isDropdownOpen && (
                        <div
                          className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-2 dropdown-menu"
                          onMouseEnter={() => setDropdownOpen(true)}
                          onMouseLeave={() => {
                            setTimeout(() => setDropdownOpen(false), 100);
                          }}
                        >
                          {item.dropdownItems.map((dropdownItem) => (
                            <button
                              key={dropdownItem.path}
                              onClick={() =>
                                handleDropdownNavigation(
                                  dropdownItem.path,
                                  dropdownType
                                )
                              }
                              className="block w-full text-left px-4 py-2 text-sm text-primary dark:text-gray-100 hover:text-white dark:hover:text-secondary hover:bg-secondary dark:hover:bg-gray-700 transition-colors font-poppins"
                            >
                              {dropdownItem.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              } else {
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors font-poppins ${
                      isActive(item.path)
                        ? 'text-white dark:text-secondary bg-secondary dark:bg-secondary/20'
                        : 'text-primary dark:text-gray-100 hover:text-white dark:hover:text-secondary hover:bg-secondary dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }
            })}
          </div>

          {/* Theme Toggle and CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            {/* <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button> */}

            {/* CTA Button */}
            {/* <Link
              to="/contact"
              className="bg-secondary text-neutral px-6 py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors shadow-md"
            >
              Start Your Journey
            </Link> */}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle Button for Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary dark:text-gray-100 hover:text-secondary dark:hover:text-secondary focus:outline-none focus:text-secondary"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-primary border-t border-gray-200 dark:border-gray-700">
              {navItems.map((item) => {
                if (item.hasDropdown) {
                  const dropdownType =
                    item.path === '/about' ? 'about' : 'services';
                  return (
                    <div key={item.path}>
                      <button
                        onClick={() =>
                          handleDropdownNavigation(item.path, dropdownType)
                        }
                        className="w-full text-left px-3 py-2 text-base font-medium text-primary dark:text-gray-100 font-poppins hover:text-secondary dark:hover:text-secondary hover:bg-accent dark:hover:bg-gray-800 transition-colors"
                      >
                        {item.label}
                      </button>
                      <div className="pl-6 space-y-1">
                        {item.dropdownItems.map((dropdownItem) => (
                          <button
                            key={dropdownItem.path}
                            onClick={() => {
                              handleDropdownNavigation(
                                dropdownItem.path,
                                dropdownType
                              );
                              setIsMenuOpen(false);
                            }}
                            className="block w-full text-left px-3 py-2 text-sm text-primary dark:text-gray-100 hover:text-secondary dark:hover:text-secondary hover:bg-accent dark:hover:bg-gray-800 transition-colors font-poppins"
                          >
                            {dropdownItem.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors font-poppins ${
                        isActive(item.path)
                          ? 'text-secondary dark:text-secondary bg-accent dark:bg-secondary/20'
                          : 'text-primary dark:text-gray-100 hover:text-secondary dark:hover:text-secondary hover:bg-accent dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                }
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
