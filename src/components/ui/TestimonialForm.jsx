import React, { useState, useEffect } from 'react';
import Button from './Button';

// Service categories matching the Services.jsx data
const SERVICE_CATEGORIES = [
  { value: 'app', label: 'The Othentica App'},
  { value: 'programs', label: 'Tailored Programs' },
  { value: 'talks', label: 'Talks & Workshops' },
  { value: 'one-to-one', label: '1:1 Guidance' }
];

const TestimonialForm = ({ onSubmit, isLoading, error, success }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    category: 'programs',
    email: '',
    is_anonymous: false,
  });

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : (files ? files[0] : value),
      };
      
      // If anonymous is checked, clear email but keep the name field as is
      if (name === 'is_anonymous' && checked) {
        newData.email = '';
      }
      
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  // Reset form when success is true
  useEffect(() => {
    if (success) {
      setFormData({
        name: '',
        description: '',
        image: null,
        category: 'programs',
        email: '',
        is_anonymous: false,
      });
    }
  }, [success]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Testimonial submitted successfully! Thank you for your feedback.
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all duration-200 ${
            formData.is_anonymous ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
          }`}
          placeholder="Enter your full name"
          required={!formData.is_anonymous}
          disabled={isLoading || formData.is_anonymous}
        />
      </div>

      {/* Anonymous Checkbox */}
      <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
        <input
          type="checkbox"
          name="is_anonymous"
          checked={formData.is_anonymous}
          onChange={handleChange}
          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={isLoading}
        />
        <label className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Submit anonymously
        </label>
      </div>

      {/* Email - only show if not anonymous */}
      {!formData.is_anonymous && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all duration-200"
            required={!formData.is_anonymous}
            disabled={isLoading}
            placeholder="your.email@example.com"
          />
        </div>
      )}

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Service Category *
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all duration-200"
          required
          disabled={isLoading}
        >
          {SERVICE_CATEGORIES.map(category => (
            <option 
              key={category.value} 
              value={category.value}
            >
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Testimonial *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all duration-200"
          placeholder="Share your experience with Othentica..."
          required
          disabled={isLoading}
        />
      </div>

      {/* Picture Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Upload Picture (Optional)
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200 transition-all duration-200"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: JPEG, PNG, GIF, WEBP (Max 5MB)
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button 
          variant="secondary" 
          size="small" 
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
        >
          {isLoading ? 'Submitting...' : 'Submit Testimonial'}
        </Button>
      </div>
    </form>
  );
};

export default TestimonialForm;
