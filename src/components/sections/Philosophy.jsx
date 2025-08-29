import React from 'react';
import Button from '../ui/Button';
import PhilosophyImg from '../../assets/img/philosophy/philo-bg.webp';
import { Link } from 'react-router-dom';

const Philosophy = () => {
  return (
    <section className="py-16 px-8 lg:px-16 bg-white dark:bg-primary">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        {/* Left Image */}
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-800 dark:to-pink-900 rounded-3xl overflow-hidden shadow-xl-professional">
            <img
              src={PhilosophyImg}
              alt="Philosophy"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Text */}
        <div>
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-primary dark:text-neutral font-sans">
              Our Philosophy
            </h2>
            <p className="text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed">
              At Othentica, we talk about <b>Corporate Health</b> because
              wellness is no longer enough. Wellness often feels like an add-on
              — a yoga class here, a stress tip there. But health? Health is
              essential.
            </p>
            <p className="text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed">
              <b>Corporate Health is the evolution of wellness.</b>
              <br />
              It's not a perk. It's the foundation of energy, resilience, and
              performance. Our approach goes deeper — into{' '}
              <b>brain health, nutrition, and human connection</b> — so that
              people don't just manage life's pressures, they rise above them.
            </p>
            <p className="text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed">
              When humans are truly healthy, they don't just cope. They thrive —
              and so do their workplaces, families, and communities.
            </p>
          </div>
          <div className="mt-4">
            <Link to="/about" target="_blank">
              <Button variant="secondary" size="large">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
