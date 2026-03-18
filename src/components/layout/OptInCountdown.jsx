import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

// Top Banner Component – optional companySlug for company-specific count
const OptInCountdown = ({ companySlug = null }) => {
  const [count, setCount] = useState(0);
  const [counterMax, setCounterMax] = useState(1000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCount = async () => {
    try {
      const data = await apiService.getOptinCount(companySlug);
      setCount(data.count ?? 0);
      setCounterMax(data.counter_max ?? 1000);
      setError(false);
    } catch (err) {
      console.error('Error fetching opt-in count:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
  }, [companySlug]);

  useEffect(() => {
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [companySlug]);

  const spotsLeft = Math.max(0, counterMax - count);

  return (
    <div className="w-full h-20 bg-primary text-center py-3 shadow-md flex flex-col items-center justify-center">
      <p className="font-semibold text-2xl text-white">
        <span className="text-secondary">
          {loading ? '⏳ Loading...' : error ? '⏳ ' + counterMax : '⏳ ' + spotsLeft.toLocaleString()}
        </span>{' '}
        users left!
      </p>
      <p className="ml-2 text-xl opacity-90 text-white">
        {loading ? 'Fetching latest count...' : 'Join our growing community!'}
      </p>
    </div>
  );
};

export default OptInCountdown;
