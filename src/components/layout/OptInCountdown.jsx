import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

// Top Banner Component
const OptInCountdown = () => {
  const [spotsLeft, setSpotsLeft] = useState(1000); // start at 1000
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch real opt-in count on component mount
  useEffect(() => {
    const fetchOptinCount = async () => {
      try {
        const data = await apiService.getOptinCount();
        setSpotsLeft(data.count);
        setError(false);
      } catch (err) {
        console.error('Error fetching opt-in count:', err);
        setError(true);
        // Keep the default value if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchOptinCount();
  }, []);

  // Update count periodically (every 30 seconds) to keep it fresh
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await apiService.getOptinCount();
        setSpotsLeft(data.count);
        setError(false);
      } catch (err) {
        console.error('Error updating opt-in count:', err);
        setError(true);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-20 bg-primary text-center py-3 shadow-md flex flex-col items-center justify-center">
      <p className="font-semibold text-2xl text-white">
        <span className="text-secondary">
          {loading ? '⏳ Loading...' : error ? '⏳ 1000' : '⏳ ' + (1000 - spotsLeft.toLocaleString())}
        </span>{' '}
        {loading ? 'users left!' : error ? 'users left!' : 'users left!'}
      </p>
      <p className="ml-2 text-xl opacity-90 text-white">
        {loading ? 'Fetching latest count...' : error ? 'Join our growing community!' : 'Join our growing community!'}
      </p>
    </div>
  );
};

export default OptInCountdown;
