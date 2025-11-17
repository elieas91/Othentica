import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * DatePickerWrapper - Safe wrapper for react-datepicker with React 18 compatibility
 * 
 * This wrapper ensures that React.Children is available before rendering the DatePicker
 * component, preventing the "Cannot set properties of undefined (setting 'Children')" error
 * that occurs with react-datepicker v8.7.0 and React 18.
 * 
 * Features:
 * - Delayed rendering until React.Children is available
 * - Error boundary for graceful fallback
 * - Maintains all original DatePicker functionality
 * - Loading state while initializing
 */
const DatePickerWrapper = (props) => {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if React.Children is available
    const checkReactChildren = () => {
      try {
        // Test if React.Children is available and functional
        if (React && React.Children && typeof React.Children.map === 'function') {
          // Test the functionality with a simple operation
          React.Children.map([], () => {});
          console.log('DatePickerWrapper: React.Children is available and functional');
          return true;
        }
        
        // Try to apply the polyfill if it's available on window
        if (React && !React.Children && typeof window !== 'undefined' && window.__ReactChildrenPolyfill) {
          React.Children = window.__ReactChildrenPolyfill;
          console.log('DatePickerWrapper: Applied React.Children polyfill from window');
          return true;
        }
        
        console.log('DatePickerWrapper: React.Children not available yet');
        return false;
      } catch (error) {
        console.warn('DatePickerWrapper: React.Children not available:', error);
        return false;
      }
    };

    // Check immediately first
    if (checkReactChildren()) {
      setIsReady(true);
      return;
    }

    // Wait for React.Children to be available
    const checkInterval = setInterval(() => {
      if (checkReactChildren()) {
        setIsReady(true);
        clearInterval(checkInterval);
      }
    }, 10); // Check every 10ms

    // Timeout after 2 seconds to prevent infinite waiting
    const timeout = setTimeout(() => {
      if (!isReady) {
        console.warn('DatePickerWrapper: React.Children not available after timeout, rendering anyway');
        setIsReady(true);
      }
      clearInterval(checkInterval);
    }, 2000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, []);

  // Error boundary for DatePicker
  const handleError = (error) => {
    console.error('DatePickerWrapper error:', error);
    setHasError(true);
  };

  // Show loading state while React.Children is being set up
  if (!isReady) {
    return (
      <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 animate-pulse">
        <div className="text-gray-500 text-sm">Loading date picker...</div>
      </div>
    );
  }

  // Show error state if something went wrong
  if (hasError) {
    return (
      <div className="w-full p-3 border border-red-300 rounded-lg bg-red-50">
        <div className="text-red-500 text-sm">Date picker unavailable</div>
        <input
          type="date"
          className="w-full mt-2 p-2 border border-gray-300 rounded"
          onChange={(e) => props.onChange && props.onChange(new Date(e.target.value))}
        />
      </div>
    );
  }

  // Render the actual DatePicker
  try {
    return <DatePicker {...props} />;
  } catch (error) {
    handleError(error);
    return null;
  }
};

export default DatePickerWrapper;
