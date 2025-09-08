import React from 'react';
import Button from '../ui/Button';
import OthenticaImg from '../../assets/img/philosophy/othentica-bg-2.webp';
import { Link } from 'react-router-dom';

const Philosophy = () => {
  return (
    <section
      className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 bg-white dark:bg-primary"
      id="philosophySec"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
        {/* Left Image */}
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-800 dark:to-pink-900 rounded-3xl overflow-hidden shadow-xl-professional">
            <img
              src={OthenticaImg}
              alt="Philosophy"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Text */}
        <div className="order-first lg:order-last">
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary dark:text-neutral font-sans">
              What is Othentica?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed">
              Othentica is a gamified wellness platform that helps people step
              into their authentic selves through science-backed, engaging daily
              quests. Designed as a treasure map for growth, it blends brain
              health, emotional resilience, and simple everyday practices into
              an interactive journey.
            </p>
            <p className="text-base sm:text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed">
              Users explore islands, unlock bridges, and grow their inner flame
              — gaining focus, energy, and balance along the way. Whether for
              individuals or organizations, Othentica makes personal growth not
              just achievable, but inspiring and fun.
            </p>
          </div>
          <div className="mt-6 sm:mt-8">
            <Link
              to="/contact"
              target="_blank"
              className="block w-full sm:w-auto"
            >
              <Button
                variant="secondary"
                size="large"
                className="w-full sm:w-auto"
              >
                Explore Corporate Packages
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
