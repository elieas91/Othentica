import { useState } from 'react';
import Button from './Button';

const TestimonialForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    program: '',
    message: '',
    name: '',
    picture: null,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Program
        </label>
        <select
          name="program"
          value={formData.program}
          onChange={handleChange}
          className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        >
          <option value="">Select a program</option>
          <option value="talks&workshops">Talks & Workshops</option>
          <option value="tailoredprograms">Tailored Programs</option>
          <option value="1to1guidance">1:1 Guidance</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full mt-1 border border-gray-300 rounded-lg p-2 h-24 resize-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mt-1 border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      {/* Picture Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Upload Picture
        </label>
        <input
          type="file"
          name="picture"
          accept="image/*"
          onChange={handleChange}
          className="mt-1"
          required
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button variant="secondary" size="small">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default TestimonialForm;
