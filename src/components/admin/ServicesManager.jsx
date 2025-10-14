import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  XMarkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import apiService from '../../services/api';

const ServicesManager = () => {
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

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [viewingService, setViewingService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(null);

  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true);
      // Try admin endpoint first
      try {
        const response = await apiService.getAllServicesAdmin();
        if (response.success) {
          setServices(response.data);
          return;
        }
      } catch (adminErr) {
        // Fall back to public endpoint on auth errors or missing token
        try {
          const publicResponse = await apiService.getServices();
          if (publicResponse && publicResponse.success !== false) {
            setServices(publicResponse.data || publicResponse);
            return;
          }
        } catch (publicErr) {
          throw publicErr;
        }
      }
      await showErrorAlert('Error', 'Failed to load services');
    } catch (err) {
      await showErrorAlert('Error', 'Failed to load services: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load services on component mount
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Handle modal positioning, body scroll, and ESC key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (showImageModal) {
          closeImageModal();
        } else if (viewingService) {
          closeModal();
        } else if (showForm) {
          closeModal();
        }
      }
    };

    if (showForm || viewingService || showImageModal) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
      // Ensure modal is positioned correctly
      document.body.style.position = 'relative';
      // Add ESC key listener
      document.addEventListener('keydown', handleEscKey);
    } else {
      // Restore body scrolling when modal is closed
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showForm, viewingService, showImageModal]);

  const handleCreate = async (data) => {
    try {
      setIsLoading(true);
      
      const response = await apiService.createServiceAdmin(data);
      
      if (response.success) {
        await showSuccessAlert('Success!', 'Service created successfully!');
        await fetchServices();
        setShowForm(false);
        setFormData({});
        setImagePreviews({});
      } else {
        await showErrorAlert('Error', response.message || 'Failed to create service');
      }
    } catch (err) {
      await showErrorAlert('Error', 'Failed to create service: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      setIsLoading(true);
      
      const response = await apiService.updateServiceAdmin(editingService.id, data);
      
      if (response.success) {
        await showSuccessAlert('Success!', 'Service updated successfully!');
        await fetchServices();
        setEditingService(null);
        setFormData({});
        setImagePreviews({});
        setShowForm(false);
      } else {
        await showErrorAlert('Error', response.message || 'Failed to update service');
      }
    } catch (err) {
      await showErrorAlert('Error', 'Failed to update service: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await showConfirmAlert(
      'Are you sure?', 
      "You won't be able to revert this!"
    );

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        const response = await apiService.deleteServiceAdmin(id);
        
        if (response.success) {
          await showSuccessAlert('Deleted!', 'The service has been deleted successfully.');
          await fetchServices();
        } else {
          await showErrorAlert('Error', response.message || 'Failed to delete service');
        }
      } catch (err) {
        await showErrorAlert('Error', 'Failed to delete service: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toArray = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.trim().length) {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      modal_description1: service.modal_description1 || '',
      modal_description2: service.modal_description2 || '',
      quotation: service.quotation || '',
      button_text: service.button_text || '',
      section_id: service.section_id || '',
      background_color: service.background_color || '#FEF0DC',
      description_bullet_points: toArray(service.description_bullet_points),
      modal_description_bullet_points: toArray(service.modal_description_bullet_points)
    });
    
    // Set image previews
    const previews = {};
    if (service.icon_url) previews.icon = service.icon_url;
    if (service.image1_url) previews.image1 = service.image1_url;
    if (service.image2_url) previews.image2 = service.image2_url;
    if (service.mobile1_url) previews.mobile1 = service.mobile1_url;
    if (service.mobile2_url) previews.mobile2 = service.mobile2_url;
    if (service.mobile3_url) previews.mobile3 = service.mobile3_url;
    setImagePreviews(previews);
    setShowForm(true);
  };

  const handleView = (service) => {
    setViewingService(service);
  };

  const openImageModal = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setModalImageUrl(null);
  };

  const openCreateForm = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      modal_description1: '',
      modal_description2: '',
      quotation: '',
      button_text: '',
      section_id: '',
      background_color: '#FEF0DC',
      description_bullet_points: [],
      modal_description_bullet_points: []
    });
    setImagePreviews({});
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingService(null);
    setViewingService(null);
    setImagePreviews({});
  };

  const handleInputChange = (e) => {
    const { name, value, files, checked, type } = e.target;
    
    if (name.includes('image') || name === 'icon' || name.includes('mobile')) {
      if (files && files[0]) {
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
        setImagePreviews(prev => ({
          ...prev,
          [name]: previewUrl
        }));
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addBulletPoint = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), '']
    }));
  };

  const updateBulletPoint = (fieldName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item, i) => i === index ? value : item)
    }));
  };

  const removeBulletPoint = (fieldName, index) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl font-bold text-primary font-poppins mb-2">
            Services Management
          </h3>
          <p className="text-gray-600">Manage services and solutions for the website</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-secondary to-orange-500 text-white rounded-xl hover:from-orange-500 hover:to-secondary transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins"
        >
          <PlusIcon className="w-5 h-5" />
          Add Service
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
          <span className="ml-2 text-gray-600">Loading services...</span>
        </div>
      )}

      {/* Services Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={service.id} className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional border border-accent/20 hover:shadow-xl-professional transition-all duration-300 group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-primary font-poppins mb-2">
                      {service.title || 'Untitled Service'}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {service.description || 'No description provided'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Section: {service.section_id || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Icon Preview */}
                {service.icon_url && (
                  <div className="mb-4">
                    <div 
                      className="relative cursor-pointer group"
                      onClick={() => openImageModal(service.icon_url)}
                    >
                      <img
                        src={service.icon_url}
                        alt={service.title}
                        className="w-16 h-16 object-cover rounded-lg border border-accent/30 shadow-sm group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to enlarge
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-accent/20">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(service)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="View"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-xl-professional border border-accent/20 p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-primary font-poppins">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
                <p className="text-gray-600 mt-1">
                  {editingService ? 'Update service details' : 'Add a new service'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingService) {
                handleUpdate(formData);
              } else {
                handleCreate(formData);
              }
            }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                    placeholder="Enter service title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Section ID *
                  </label>
                  <input
                    type="text"
                    name="section_id"
                    value={formData.section_id || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                    placeholder="e.g., app, programs, talks, one-to-one"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 resize-none"
                  placeholder="Enter service description..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Modal Description 1
                  </label>
                  <textarea
                    name="modal_description1"
                    value={formData.modal_description1 || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 resize-none"
                    placeholder="Enter modal description 1..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Modal Description 2
                  </label>
                  <textarea
                    name="modal_description2"
                    value={formData.modal_description2 || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 resize-none"
                    placeholder="Enter modal description 2..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Quotation
                  </label>
                  <input
                    type="text"
                    name="quotation"
                    value={formData.quotation || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                    placeholder="Enter quotation..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Button Text
                  </label>
                  <input
                    type="text"
                    name="button_text"
                    value={formData.button_text || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                    placeholder="Enter button text..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Background Color
                </label>
                <input
                  type="color"
                  name="background_color"
                  value={formData.background_color || '#FEF0DC'}
                  onChange={handleInputChange}
                  className="w-full h-12 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                />
              </div>

              {/* Description Bullet Points */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Description Bullet Points
                </label>
                <div className="space-y-2">
                  {(formData.description_bullet_points || []).map((point, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => updateBulletPoint('description_bullet_points', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-accent/30 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                        placeholder={`Bullet point ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeBulletPoint('description_bullet_points', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addBulletPoint('description_bullet_points')}
                    className="px-4 py-2 text-secondary hover:bg-secondary/10 rounded-lg transition-all duration-200 border border-secondary/30"
                  >
                    + Add Bullet Point
                  </button>
                </div>
              </div>

              {/* Modal Description Bullet Points */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Modal Description Bullet Points
                </label>
                <div className="space-y-2">
                  {(formData.modal_description_bullet_points || []).map((point, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => updateBulletPoint('modal_description_bullet_points', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-accent/30 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                        placeholder={`Modal bullet point ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeBulletPoint('modal_description_bullet_points', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addBulletPoint('modal_description_bullet_points')}
                    className="px-4 py-2 text-secondary hover:bg-secondary/10 rounded-lg transition-all duration-200 border border-secondary/30"
                  >
                    + Add Bullet Point
                  </button>
                </div>
              </div>

              {/* Image Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Icon Upload
                  </label>
                  <input
                    type="file"
                    name="icon"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-orange-500"
                  />
                  {imagePreviews.icon && (
                    <div className="mt-2">
                      <img
                        src={imagePreviews.icon}
                        alt="Icon preview"
                        className="w-16 h-16 object-cover rounded-lg border border-accent/30"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Image 1 Upload
                  </label>
                  <input
                    type="file"
                    name="image1"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-orange-500"
                  />
                  {imagePreviews.image1 && (
                    <div className="mt-2">
                      <img
                        src={imagePreviews.image1}
                        alt="Image 1 preview"
                        className="w-16 h-16 object-cover rounded-lg border border-accent/30"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Image 2 Upload
                  </label>
                  <input
                    type="file"
                    name="image2"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-orange-500"
                  />
                  {imagePreviews.image2 && (
                    <div className="mt-2">
                      <img
                        src={imagePreviews.image2}
                        alt="Image 2 preview"
                        className="w-16 h-16 object-cover rounded-lg border border-accent/30"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Mobile 1 Upload
                  </label>
                  <input
                    type="file"
                    name="mobile1"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-orange-500"
                  />
                  {imagePreviews.mobile1 && (
                    <div className="mt-2">
                      <img
                        src={imagePreviews.mobile1}
                        alt="Mobile 1 preview"
                        className="w-16 h-16 object-cover rounded-lg border border-accent/30"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Mobile 2 Upload
                  </label>
                  <input
                    type="file"
                    name="mobile2"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-orange-500"
                  />
                  {imagePreviews.mobile2 && (
                    <div className="mt-2">
                      <img
                        src={imagePreviews.mobile2}
                        alt="Mobile 2 preview"
                        className="w-16 h-16 object-cover rounded-lg border border-accent/30"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Mobile 3 Upload
                  </label>
                  <input
                    type="file"
                    name="mobile3"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-orange-500"
                  />
                  {imagePreviews.mobile3 && (
                    <div className="mt-2">
                      <img
                        src={imagePreviews.mobile3}
                        alt="Mobile 3 preview"
                        className="w-16 h-16 object-cover rounded-lg border border-accent/30"
                      />
                    </div>
                  )}
                </div>
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
                  {editingService ? 'Update' : 'Add'} Service
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* View Modal */}
      {viewingService && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-xl-professional border border-accent/20 p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-primary font-poppins">
                  Service Details
                </h3>
                <p className="text-gray-600 mt-1">View complete service information</p>
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
                    Title
                  </label>
                  <p className="text-lg font-medium text-gray-900">{viewingService.title || 'Untitled Service'}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                    Section ID
                  </label>
                  <p className="text-lg font-medium text-gray-900">{viewingService.section_id || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                  Description
                </label>
                <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-6 border border-accent/30">
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {viewingService.description || 'No description provided'}
                  </p>
                </div>
              </div>

              {viewingService.modal_description1 && (
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                    Modal Description 1
                  </label>
                  <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-6 border border-accent/30">
                    <p className="text-gray-800 text-lg leading-relaxed">
                      {viewingService.modal_description1}
                    </p>
                  </div>
                </div>
              )}

              {viewingService.modal_description2 && (
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                    Modal Description 2
                  </label>
                  <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-6 border border-accent/30">
                    <p className="text-gray-800 text-lg leading-relaxed">
                      {viewingService.modal_description2}
                    </p>
                  </div>
                </div>
              )}

              {viewingService.quotation && (
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                    Quotation
                  </label>
                  <p className="text-lg font-medium text-gray-900 italic">"{viewingService.quotation}"</p>
                </div>
              )}

              {viewingService.button_text && (
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                    Button Text
                  </label>
                  <p className="text-lg font-medium text-gray-900">{viewingService.button_text}</p>
                </div>
              )}

              {/* Images */}
              {viewingService.icon_url && (
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Icon
                  </label>
                  <div 
                    className="relative cursor-pointer group inline-block"
                    onClick={() => openImageModal(viewingService.icon_url)}
                  >
                    <img
                      src={viewingService.icon_url}
                      alt={viewingService.title}
                      className="w-32 h-32 object-cover rounded-xl border border-accent/30 shadow-sm group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to enlarge
                      </span>
                    </div>
                  </div>
                </div>
              )}
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
        </div>,
        document.body
      )}

      {/* Image Modal */}
      {showImageModal && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4"
          onClick={closeImageModal}
        >
          <div 
            className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImageUrl}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full flex items-center justify-center text-xl font-bold transition-all duration-200 backdrop-blur-sm"
            >
              ×
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
              Press ESC or click outside to close
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ServicesManager;
