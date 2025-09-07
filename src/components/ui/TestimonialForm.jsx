import React, { useState, useEffect } from 'react';
import Button from './Button';

const TestimonialForm = ({ onSubmit, isLoading, error, success }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
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
      });
    }
  }, [success]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Testimonial submitted successfully! Thank you for your feedback.
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
          disabled={isLoading}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Testimonial *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full mt-1 border border-gray-300 rounded-lg p-2 h-24 resize-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Share your experience with Othentica..."
          required
          disabled={isLoading}
        />
      </div>

      {/* Picture Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Upload Picture (Optional)
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={isLoading}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button 
          variant="secondary" 
          size="small" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default TestimonialForm;
