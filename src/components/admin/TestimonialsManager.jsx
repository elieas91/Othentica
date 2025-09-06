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
import apiService from '../../services/api';

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [viewingTestimonial, setViewingTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'pending'
  });

  // Load testimonials on component mount
  useEffect(() => {
    loadTestimonials();
    loadStats();
  }, [loadTestimonials]);

  // Load testimonials based on status filter
  useEffect(() => {
    loadTestimonials();
  }, [statusFilter, loadTestimonials]);

  // Reset form when opening
  useEffect(() => {
    if (showForm && !editingTestimonial) {
      setFormData({
        name: '',
        description: '',
        image: '',
        status: 'pending'
      });
    }
  }, [showForm, editingTestimonial]);

  // Load testimonial data when editing
  useEffect(() => {
    if (editingTestimonial) {
      const testimonial = testimonials.find(t => t.id === editingTestimonial);
      if (testimonial) {
        setFormData({
          name: testimonial.name,
          description: testimonial.description,
          image: testimonial.image || '',
          status: testimonial.status || 'pending'
        });
      }
    }
  }, [editingTestimonial, testimonials]);

  const loadTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (statusFilter === 'all') {
        response = await apiService.getTestimonials();
      } else {
        response = await apiService.getTestimonialsByStatus(statusFilter);
      }
      
      if (response.success) {
        setTestimonials(response.data);
      } else {
        setError(response.message || 'Failed to load testimonials');
      }
    } catch (err) {
      setError('Failed to load testimonials: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const loadStats = async () => {
    try {
      const response = await apiService.getTestimonialsStats();
      if (response.success) {
        const statsObj = {};
        response.data.forEach(stat => {
          statsObj[stat.status] = stat.count;
        });
        setStats(statsObj);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (editingTestimonial) {
        // Update existing testimonial
        response = await apiService.updateTestimonial(editingTestimonial, formData);
      } else {
        // Create new testimonial
        response = await apiService.createTestimonial(formData);
      }
      
      if (response.success) {
        // Reload testimonials to get updated data
        await loadTestimonials();
        await loadStats();
        
        // Reset form and close modal
        setFormData({ name: '', description: '', image: '', status: 'pending' });
        setShowForm(false);
        setEditingTestimonial(null);
      } else {
        setError(response.message || 'Failed to save testimonial');
      }
    } catch (err) {
      setError('Failed to save testimonial: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setEditingTestimonial(id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.deleteTestimonial(id);
        
        if (response.success) {
          // Reload testimonials to get updated data
          await loadTestimonials();
          await loadStats();
        } else {
          setError(response.message || 'Failed to delete testimonial');
        }
      } catch (err) {
        setError('Failed to delete testimonial: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.updateTestimonialStatus(id, newStatus);
      
      if (response.success) {
        // Reload testimonials to get updated data
        await loadTestimonials();
        await loadStats();
      } else {
        setError(response.message || 'Failed to update testimonial status');
      }
    } catch (err) {
      setError('Failed to update testimonial status: ' + err.message);
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

        {/* Status Filter */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-primary">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-accent/30 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          >
            <option value="all">All Testimonials</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

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
                    {testimonial.image || 'No image'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                  placeholder="Enter image URL (optional)"
                />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                  Image URL
                </label>
                <p className="text-gray-700 bg-gray-100 px-3 py-2 rounded-lg break-all">
                  {viewingTestimonial.image || 'No image provided'}
                </p>
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
