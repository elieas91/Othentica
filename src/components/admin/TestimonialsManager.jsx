import React, { useState, useEffect, useCallback } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import apiService from '../../services/api';
import { getApiUrl } from '../../config/api';

// Service categories matching the Services.jsx data
const SERVICE_CATEGORIES = [
  { value: 'app', label: 'The Othentica App' },
  { value: 'programs', label: 'Tailored Programs' },
  { value: 'talks', label: 'Talks & Workshops' },
  { value: 'one-to-one', label: '1:1 Guidance' }
];

const TestimonialsManager = () => {
  // SweetAlert helper functions for consistent styling
  const showSuccessAlert = (title, text) => {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#10b981',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl',
        title: 'font-poppins font-bold text-primary',
        content: 'font-poppins',
        confirmButton: 'rounded-xl font-medium'
      }
    });
  };

  const showErrorAlert = (title, text) => {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#ef4444',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl',
        title: 'font-poppins font-bold text-primary',
        content: 'font-poppins',
        confirmButton: 'rounded-xl font-medium'
      }
    });
  };

  // Removed unused showWarningAlert function

  const showConfirmAlert = (title, text) => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, do it!',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl',
        title: 'font-poppins font-bold text-primary',
        content: 'font-poppins',
        confirmButton: 'rounded-xl font-medium',
        cancelButton: 'rounded-xl font-medium'
      }
    });
  };
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [viewingTestimonial, setViewingTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stats, setStats] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    status: 'pending',
    category: 'programs'
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Helper function to get testimonial image path
  const getTestimonialImagePath = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If it's already a full URL, just return it
    if (imageUrl.startsWith('http')) return imageUrl;

    // If it's just a filename or relative path, prepend the full API URL
    const apiUrl = getApiUrl();
    return `${apiUrl}/uploads/testimonials/${imageUrl}`;
  };

  const loadTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      
      let response;
      if (statusFilter === 'all' && categoryFilter === 'all') {
        response = await apiService.getTestimonials();
      } else if (statusFilter === 'all' && categoryFilter !== 'all') {
        response = await apiService.getTestimonials(categoryFilter);
      } else if (statusFilter !== 'all' && categoryFilter === 'all') {
        response = await apiService.getTestimonialsByStatus(statusFilter);
      } else {
        // Both filters applied - get all and filter client-side
        response = await apiService.getTestimonials();
        if (response.success) {
          const filtered = response.data.filter(t => 
            t.status === statusFilter && t.category === categoryFilter
          );
          response.data = filtered;
        }
      }
      
      if (response.success) {
        setTestimonials(response.data);
      } else {
        await showErrorAlert('Error', response.message || 'Failed to load testimonials');
      }
    } catch (err) {
      await showErrorAlert('Error', 'Failed to load testimonials: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter]);

  const loadStats = useCallback(async () => {
    try {
      const response = await apiService.getTestimonialsStats();
      if (response.success) {
        const statsObj = {};
        response.data.forEach(stat => {
          statsObj[stat.status] = stat.count;
        });
        setStats(statsObj);
      } else {
        await showErrorAlert('Error', response.message || 'Failed to load statistics');
      }
    } catch (err) {
      await showErrorAlert('Error', 'Failed to load statistics: ' + err.message);
    }
  }, []);

  // Load testimonials on component mount
  useEffect(() => {
    loadTestimonials();
    loadStats();
  }, [loadTestimonials, loadStats]);

  // Load testimonials based on status and category filters
  useEffect(() => {
    loadTestimonials();
  }, [statusFilter, categoryFilter, loadTestimonials]);

  // Reset form when opening
  useEffect(() => {
    if (showForm && !editingTestimonial) {
      setFormData({
        name: '',
        description: '',
        image: null,
        status: 'pending',
        category: 'programs'
      });
      setImagePreview(null);
    }
  }, [showForm, editingTestimonial]);

  // Load testimonial data when editing
  useEffect(() => {
    if (editingTestimonial && testimonials.length > 0) {
      const testimonial = testimonials.find(t => t.id === editingTestimonial);
      if (testimonial) {
        // If the testimonial has the disabled 'app' category, show a warning
        if (testimonial.category === 'app') {
          showErrorAlert(
            'Category Disabled', 
            'This testimonial has "The Othentica App" category which is currently disabled. Please select a different category.'
          );
        }
        
        setFormData({
          name: testimonial.name,
          description: testimonial.description,
          image: null, // Reset file input
          status: testimonial.status || 'pending',
          category: testimonial.category === 'app' ? 'programs' : (testimonial.category || 'programs')
        });
        // Set image preview from existing image URL
        setImagePreview(testimonial.imageUrl || null);
      }
    }
  }, [editingTestimonial, testimonials]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files && files[0]) {
      const file = files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showErrorAlert('Invalid File Type', 'Please select a valid image file (JPEG, PNG, GIF, or WEBP).');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showErrorAlert('File Too Large', 'Please select an image smaller than 5MB.');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('status', formData.status);
      submitData.append('category', formData.category);
      
      // Only append image if a new file is selected
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      let response;
      if (editingTestimonial) {
        // Update existing testimonial
        response = await apiService.updateTestimonial(editingTestimonial, submitData);
      } else {
        // Create new testimonial
        response = await apiService.createTestimonial(submitData);
      }
      
      if (response.success) {
        // Show success message
        await showSuccessAlert(
          'Success!', 
          editingTestimonial 
            ? 'Testimonial updated successfully!' 
            : 'Testimonial created successfully!'
        );
        
        // Reload testimonials to get updated data
        await loadTestimonials();
        await loadStats();
        
        // Reset form and close modal
        setFormData({ name: '', description: '', image: null, status: 'pending', category: 'programs' });
        setImagePreview(null);
        setShowForm(false);
        setEditingTestimonial(null);
      } else {
        await showErrorAlert('Error', response.message || 'Failed to save testimonial');
      }
    } catch (err) {
      await showErrorAlert('Error', 'Failed to save testimonial: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setEditingTestimonial(id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await showConfirmAlert(
      'Are you sure?', 
      "You won't be able to revert this!"
    );

    if (result.isConfirmed) {
      try {
        setLoading(true);
        
        const response = await apiService.deleteTestimonial(id);
        
        if (response.success) {
          // Show success message
          await showSuccessAlert('Deleted!', 'The testimonial has been deleted successfully.');
          
          // Reload testimonials to get updated data
          await loadTestimonials();
          await loadStats();
        } else {
          await showErrorAlert('Error', response.message || 'Failed to delete testimonial');
        }
      } catch (err) {
        await showErrorAlert('Error', 'Failed to delete testimonial: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setLoading(true);
      
      const response = await apiService.updateTestimonialStatus(id, newStatus);
      
      if (response.success) {
        // Show success message
        await showSuccessAlert(
          'Status Updated!', 
          `Testimonial status changed to ${newStatus} successfully!`
        );
        
        // Reload testimonials to get updated data
        await loadTestimonials();
        await loadStats();
      } else {
        await showErrorAlert('Error', response.message || 'Failed to update testimonial status');
      }
    } catch (err) {
      await showErrorAlert('Error', 'Failed to update testimonial status: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (testimonial) => {
    setViewingTestimonial(testimonial);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingTestimonial(null);
    setViewingTestimonial(null);
    setImagePreview(null);
  };


  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      case 'pending':
      default:
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
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

      {/* Stats and Filters */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-white to-accent/10 rounded-xl p-4 border border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-primary">{testimonials.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-accent/10 rounded-xl p-4 border border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-accent/10 rounded-xl p-4 border border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-accent/10 rounded-xl p-4 border border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected || 0}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircleIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-primary">Filter by status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-accent/30 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-primary">Filter by category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-accent/30 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {SERVICE_CATEGORIES.map(category => (
                <option 
                  key={category.value} 
                  value={category.value}
                  disabled={category.disabled}
                  className={category.disabled ? 'text-gray-400 bg-gray-100' : ''}
                >
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>


      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
          <span className="ml-2 text-gray-600">Loading testimonials...</span>
        </div>
      )}

      {/* Testimonials List */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional border border-accent/20 hover:shadow-xl-professional transition-all duration-300 group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${getStatusColor(testimonial.status)}`}>
                        {getStatusIcon(testimonial.status)}
                        {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        ID: {testimonial.id}
                      </span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {SERVICE_CATEGORIES.find(cat => cat.value === testimonial.category)?.label || testimonial.category}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-primary font-poppins mb-2">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      "{testimonial.description.length > 120 
                        ? testimonial.description.substring(0, 120) + '...' 
                        : testimonial.description}"
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
                    {testimonial.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(testimonial.id, 'approved')}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                          title="Approve"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(testimonial.id, 'rejected')}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Reject"
                        >
                          <XCircleIcon className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-400">
                    {testimonial.imageUrl ? (
                      <img
                        src={getTestimonialImagePath(testimonial.imageUrl)}
                        alt={testimonial.name}
                        className="w-8 h-8 object-cover rounded-full"
                      />
                    ) : (
                      'No image'
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && testimonials.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <ClockIcon className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No testimonials found</h3>
          <p className="text-gray-500">
            {statusFilter === 'all' 
              ? 'No testimonials have been created yet.' 
              : `No testimonials with status "${statusFilter}" found.`}
          </p>
        </div>
      )}

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                    placeholder="Enter testimonial author name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                  >
                    {SERVICE_CATEGORIES.map(category => (
                      <option 
                        key={category.value} 
                        value={category.value}
                        disabled={category.disabled}
                        className={category.disabled ? 'text-gray-400 bg-gray-100' : ''}
                      >
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Image Upload
                </label>
                <div className="space-y-4">
                  <input
                    type="file"
                    name="image"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-orange-500"
                  />
                  <p className="text-xs text-gray-500">
                    Supported formats: JPEG, PNG, GIF, WEBP. Maximum size: 5MB
                  </p>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-primary mb-2">Preview:</p>
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-xl border border-accent/30 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData(prev => ({ ...prev, image: null }));
                            // Reset file input
                            const fileInput = document.querySelector('input[name="image"]');
                            if (fileInput) fileInput.value = '';
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 resize-none"
                  placeholder="Enter the testimonial description..."
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                    Name
                  </label>
                  <p className="text-lg font-medium text-gray-900">{viewingTestimonial.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                    Status
                  </label>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(viewingTestimonial.status)}`}>
                    {getStatusIcon(viewingTestimonial.status)}
                    {viewingTestimonial.status.charAt(0).toUpperCase() + viewingTestimonial.status.slice(1)}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                    Category
                  </label>
                  <p className="text-lg font-medium text-gray-900">
                    {SERVICE_CATEGORIES.find(cat => cat.value === viewingTestimonial.category)?.label || viewingTestimonial.category}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                  Image
                </label>
                {viewingTestimonial.imageUrl ? (
                  <div className="space-y-3">
                    <img
                      src={getTestimonialImagePath(viewingTestimonial.imageUrl)}
                      alt={viewingTestimonial.name}
                      className="w-32 h-32 object-cover rounded-xl border border-accent/30 shadow-sm"
                    />
                    <p className="text-xs text-gray-500 break-all">
                      {viewingTestimonial.image}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No image provided</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Description
                </label>
                <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-6 border border-accent/30">
                  <p className="text-gray-800 italic text-lg leading-relaxed">
                    "{viewingTestimonial.description}"
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
