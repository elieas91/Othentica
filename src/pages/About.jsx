import React from 'react';
import Button from '../components/ui/Button';

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-primary">
      {/* Hero Section - Large */}
      <section className="py-16 px-8 lg:px-16 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-primary dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Large Image */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-800 dark:to-pink-900 rounded-3xl overflow-hidden shadow-2xl">
                {/* Placeholder for wellness image */}
                <div className="w-full h-full bg-gradient-to-br from-pink-300 to-pink-400 dark:from-pink-700 dark:to-pink-800 flex items-center justify-center">
                  <div className="text-8xl">🌿</div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Text Block */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-primary dark:text-neutral leading-tight">
                We believe wellness equals happiness.
              </h1>
              <p className="text-xl lg:text-2xl text-primary dark:text-gray-200 leading-relaxed">
                And no matter where you're looking to excel, we're here to help you forge your pathway to authentic living. Meet the team who's spent years creating breakthroughs and transforming lives through holistic wellness.
              </p>
              <Button variant="outline" className="text-lg px-8 py-4">
                Meet Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Small */}
      <section id="mission" className="py-16 px-8 lg:px-16 bg-white dark:bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary dark:text-neutral mb-6">Our Mission</h2>
          <p className="text-xl text-primary dark:text-gray-200 leading-relaxed max-w-3xl mx-auto">
            To empower individuals to discover their authentic selves through personalized wellness guidance, 
            creating lasting transformation in mind, body, and spirit.
          </p>
        </div>
      </section>

      {/* Vision Section - Large */}
      <section id="vision" className="py-16 px-8 lg:px-16 bg-pink-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Text Block */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-primary dark:text-neutral">
                Our Vision
              </h2>
              <p className="text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed">
                We envision a world where every individual has access to authentic wellness practices that honor their unique journey. 
                A world where people live in harmony with their true nature, embracing balance, purpose, and inner peace.
              </p>
              <p className="text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed">
                Through our comprehensive approach to wellness, we're building a community of empowered individuals 
                who inspire others to live authentically and create positive change in the world.
              </p>
            </div>
            
            {/* Right Side - Large Image */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-800 dark:to-pink-900 rounded-3xl overflow-hidden shadow-2xl">
                {/* Placeholder for vision image */}
                <div className="w-full h-full bg-gradient-to-br from-pink-300 to-pink-400 dark:from-pink-700 dark:to-pink-800 flex items-center justify-center">
                  <div className="text-8xl">🌟</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Small */}
      <section id="values" className="py-16 px-8 lg:px-16 bg-white dark:bg-primary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary dark:text-neutral mb-6">Our Core Values</h2>
            <p className="text-xl text-primary dark:text-gray-200 leading-relaxed max-w-3xl mx-auto">
              The principles that guide everything we do and every life we touch.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-pink-50 dark:bg-gray-800 rounded-2xl">
              <div className="text-5xl mb-4">💚</div>
              <h3 className="text-2xl font-bold text-primary dark:text-neutral mb-4">Authenticity</h3>
              <p className="text-primary dark:text-gray-200 leading-relaxed">
                We believe in being true to ourselves and helping others discover their authentic nature.
              </p>
            </div>
            
            <div className="text-center p-8 bg-pink-50 dark:bg-gray-800 rounded-2xl">
              <div className="text-5xl mb-4">⚖️</div>
              <h3 className="text-2xl font-bold text-primary dark:text-neutral mb-4">Balance</h3>
              <p className="text-primary dark:text-gray-200 leading-relaxed">
                We promote harmony between mind, body, and spirit for holistic wellness.
              </p>
            </div>
            
            <div className="text-center p-8 bg-pink-50 dark:bg-gray-800 rounded-2xl">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold text-primary dark:text-neutral mb-4">Growth</h3>
              <p className="text-primary dark:text-gray-200 leading-relaxed">
                We encourage continuous learning and personal development on the wellness journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section - Large */}
      <section className="py-16 px-8 lg:px-16 bg-gradient-to-br from-pink-100 to-pink-50 dark:from-gray-800 dark:to-primary">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Large Image */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-800 dark:to-pink-900 rounded-3xl overflow-hidden shadow-2xl">
                {/* Placeholder for story image */}
                <div className="w-full h-full bg-gradient-to-br from-pink-300 to-pink-400 dark:from-pink-700 dark:to-pink-800 flex items-center justify-center">
                  <div className="text-8xl">📖</div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Text Block */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-primary dark:text-neutral">
                Our Story
              </h2>
              <p className="text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed">
                Founded in 2020, Othentica emerged from a deep understanding that true wellness goes beyond 
                physical health. We recognized that authentic living requires harmony between mind, body, and spirit.
              </p>
              <p className="text-lg lg:text-xl text-primary dark:text-gray-200 leading-relaxed">
                Our team of wellness experts combines ancient wisdom with modern practices, creating 
                personalized approaches that honor each individual's unique journey. We've helped hundreds 
                of people discover their authentic selves and create lasting positive change.
              </p>
              <Button variant="primary" className="text-lg px-8 py-4">
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Small */}
      <section className="py-16 px-8 lg:px-16 bg-white dark:bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary dark:text-neutral mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-primary dark:text-gray-200 leading-relaxed mb-8">
            Join our community of wellness seekers and discover the power of authentic living.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" className="text-lg px-8 py-4">
              Book a Consultation
            </Button>
            <Button variant="outline" className="text-lg px-8 py-4">
              Explore Our Services
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
