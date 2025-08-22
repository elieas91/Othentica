import React, { useState } from 'react';
import Button from '../ui/Button';

const StayConnected = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="py-24 px-8 lg:px-16 bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-blue-900 dark:text-white mb-8">
          Stay Connected
        </h2>
        <p className="text-xl text-blue-900 dark:text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto">
          Get authentic wellness tips and insights delivered to your inbox. Join our community of wellness seekers.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <Button type="submit" variant="primary" size="large">
              Subscribe
            </Button>
          </div>
        </form>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default StayConnected;
