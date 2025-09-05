import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';

const AnimationDemo = () => {
  const animations = [
    { name: 'fadeInUp', description: 'Fade in from bottom' },
    { name: 'fadeInDown', description: 'Fade in from top' },
    { name: 'fadeInLeft', description: 'Fade in from left' },
    { name: 'fadeInRight', description: 'Fade in from right' },
    { name: 'fadeIn', description: 'Simple fade in' },
    { name: 'scaleIn', description: 'Scale in with fade' },
    { name: 'slideUp', description: 'Slide up with fade' },
    { name: 'slideDown', description: 'Slide down with fade' },
  ];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-12">Animation Demo</h1>
      
      {animations.map((animation, index) => (
        <AnimateOnScroll
          key={animation.name}
          animation={animation.name}
          delay={index * 100}
          duration={600}
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border">
            <h3 className="text-2xl font-semibold mb-2 capitalize">
              {animation.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {animation.description}
            </p>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
              <code className="text-sm">
                {`<AnimateOnScroll animation="${animation.name}" delay={${index * 100}}>`}
              </code>
            </div>
          </div>
        </AnimateOnScroll>
      ))}
    </div>
  );
};

export default AnimationDemo;
