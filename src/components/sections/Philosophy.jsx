import React from 'react';
import Button from '../ui/Button';
import PhilosophyImg from '../../assets/img/philosophy/philo-bg.webp';
import { Link } from 'react-router-dom';

const Philosophy = () => {
  return (
    <section className="py-16 px-8 lg:px-16 bg-pastel-peach dark:bg-primary">
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
              At Othentica, we believe in living authentically. Our approach to
              wellness is grounded in balance, self-discovery, and the inner
              fire that drives us. We understand that true wellness comes from
              within, and we're here to guide you on that journey of
              self-discovery and authentic living.
            </p>
            <p className="text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed">
              Through our holistic approach, we help you create sustainable
              habits that honor your unique needs and support your overall
              well-being.
            </p>
          </div>
          <div className="mt-4">
            <Link to="/about" target="_blank">
              <Button variant="accent" size="large">
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
