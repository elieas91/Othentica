import React from 'react';
import Hero from '../components/sections/Hero';
import Philosophy from '../components/sections/Philosophy';
import MobileShowcase from '../components/sections/MobileShowcase';
import Services from '../components/sections/Services';
import Testimonials from '../components/sections/Testimonials';
import Clients from '../components/sections/Clients';
import Blog from '../components/sections/Blog';

const Home = () => {
  return (
    <div className="Home">
      <Hero />
      <Philosophy />
      <MobileShowcase />
      <Services />
      <Testimonials />
      <Blog />
      <Clients />
    </div>
  );
};

export default Home;
