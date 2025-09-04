import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { testimonialsData, testimonialCategories } from '../../data/testimonialsData';

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState(testimonialsData);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [viewingTestimonial, setViewingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    quote: '',
    author: '',
    categoryId: '',
    image: 'testimonial-1'
  });

  // Reset form when opening
  useEffect(() => {
    if (showForm && !editingTestimonial) {
      setFormData({
        quote: '',
        author: '',
        categoryId: '',
        image: 'testimonial-1'
      });
    }
  }, [showForm, editingTestimonial]);

  // Load testimonial data when editing
  useEffect(() => {
    if (editingTestimonial) {
      const testimonial = testimonials.find(t => t.id === editingTestimonial);
      if (testimonial) {
        setFormData({
          quote: testimonial.quote,
          author: testimonial.author,
          categoryId: testimonial.categoryId,
          image: testimonial.image || 'testimonial-1'
        });
      }
    }
  }, [editingTestimonial, testimonials]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingTestimonial) {
      // Update existing testimonial
      setTestimonials(prev => prev.map(t => 
        t.id === editingTestimonial 
          ? { ...t, ...formData }
          : t
      ));
    } else {
      // Add new testimonial
      const newTestimonial = {
        id: Math.max(...testimonials.map(t => t.id)) + 1,
        ...formData
      };
      setTestimonials(prev => [...prev, newTestimonial]);
    }

    // Reset form and close modal
    setFormData({ quote: '', author: '', categoryId: '', image: 'testimonial-1' });
    setShowForm(false);
    setEditingTestimonial(null);
  };

  const handleEdit = (id) => {
    setEditingTestimonial(id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      setTestimonials(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleView = (testimonial) => {
    setViewingTestimonial(testimonial);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingTestimonial(null);
    setViewingTestimonial(null);
  };

  const getCategoryName = (categoryId) => {
    const category = testimonialCategories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl font-bold text-primary font-poppins mb-2">
            Testimonials Management
          </h3>
          <p className="text-gray-600">Manage and organize customer testimonials</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-secondary to-orange-500 text-white rounded-xl hover:from-orange-500 hover:to-secondary transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins"
        >
          <PlusIcon className="w-5 h-5" />
          Add Testimonial
        </button>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional border border-accent/20 hover:shadow-xl-professional transition-all duration-300 group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-secondary to-orange-500 text-white text-xs font-semibold rounded-full">
                      {getCategoryName(testimonial.categoryId)}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      ID: {testimonial.id}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-primary font-poppins mb-2">
                    {testimonial.author}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    "{testimonial.quote.length > 120 
                      ? testimonial.quote.substring(0, 120) + '...' 
                      : testimonial.quote}"
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-accent/20">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleView(testimonial)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="View"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(testimonial.id)}
                    className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
                    title="Edit"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-400">
                  {testimonial.image || 'testimonial-1'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-xl-professional border border-accent/20 p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-primary font-poppins">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h3>
                <p className="text-gray-600 mt-1">
                  {editingTestimonial ? 'Update testimonial details' : 'Create a new customer testimonial'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Author Name
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                    placeholder="Enter author name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Category
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                    required
                  >
                    <option value="">Select a category</option>
                    {testimonialCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Testimonial Image
                </label>
                <select
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                >
                  <option value="testimonial-1">Testimonial 1</option>
                  <option value="testimonial-2">Testimonial 2</option>
                  <option value="testimonial-3">Testimonial 3</option>
                  <option value="testimonial-4">Testimonial 4</option>
                  <option value="testimonial-5">Testimonial 5</option>
                  <option value="testimonial-6">Testimonial 6</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Quote
                </label>
                <textarea
                  name="quote"
                  value={formData.quote}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 resize-none"
                  placeholder="Enter the testimonial quote..."
                  required
                />
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium font-poppins"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-secondary to-orange-500 text-white rounded-xl hover:from-orange-500 hover:to-secondary transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins"
                >
                  {editingTestimonial ? 'Update' : 'Add'} Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-xl-professional border border-accent/20 p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-primary font-poppins">
                  Testimonial Details
                </h3>
                <p className="text-gray-600 mt-1">View complete testimonial information</p>
              </div>
              <button
                onClick={closeModal}
                className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                    Author
                  </label>
                  <p className="text-lg font-medium text-gray-900">{viewingTestimonial.author}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                    Category
                  </label>
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-secondary to-orange-500 text-white text-sm font-semibold rounded-full">
                    {getCategoryName(viewingTestimonial.categoryId)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                  Image
                </label>
                <p className="text-gray-700 bg-gray-100 px-3 py-2 rounded-lg inline-block">
                  {viewingTestimonial.image || 'testimonial-1'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Quote
                </label>
                <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-6 border border-accent/30">
                  <p className="text-gray-800 italic text-lg leading-relaxed">
                    "{viewingTestimonial.quote}"
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-gradient-to-r from-primary to-blue-800 text-white rounded-xl hover:from-blue-800 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;
