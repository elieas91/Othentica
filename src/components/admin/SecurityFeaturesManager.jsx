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

const SecurityFeaturesManager = () => {
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

  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [viewingFeature, setViewingFeature] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(null);

  const fetchFeatures = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAllSecurityFeaturesAdmin();
      if (response.success) {
        setFeatures(response.data);
      } else {
        await showErrorAlert('Error', response.message || 'Failed to load security features');
      }
    } catch (err) {
      await showErrorAlert('Error', 'Failed to load security features: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load features on component mount
  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  // Handle modal positioning, body scroll, and ESC key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (showImageModal) {
          closeImageModal();
        } else if (viewingFeature) {
          closeModal();
        } else if (showForm) {
          closeModal();
        }
      }
    };

    if (showForm || viewingFeature || showImageModal) {
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
  }, [showForm, viewingFeature, showImageModal]);

  const handleCreate = async (data) => {
    try {
      setIsLoading(true);
      
      const response = await apiService.createSecurityFeatureAdmin(data);
      
      if (response.success) {
        await showSuccessAlert('Success!', 'Security feature created successfully!');
        await fetchFeatures();
        setShowForm(false);
        setFormData({});
        setImagePreview(null);
      } else {
        await showErrorAlert('Error', response.message || 'Failed to create security feature');
      }
    } catch (err) {
      await showErrorAlert('Error', 'Failed to create security feature: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      setIsLoading(true);
      
      const response = await apiService.updateSecurityFeatureAdmin(editingFeature.id, data);
      
      if (response.success) {
        await showSuccessAlert('Success!', 'Security feature updated successfully!');
        await fetchFeatures();
        setEditingFeature(null);
        setFormData({});
        setImagePreview(null);
        setShowForm(false);
      } else {
        await showErrorAlert('Error', response.message || 'Failed to update security feature');
      }
    } catch (err) {
      await showErrorAlert('Error', 'Failed to update security feature: ' + err.message);
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
        const response = await apiService.deleteSecurityFeatureAdmin(id);
        
        if (response.success) {
          await showSuccessAlert('Deleted!', 'The security feature has been deleted successfully.');
          await fetchFeatures();
        } else {
          await showErrorAlert('Error', response.message || 'Failed to delete security feature');
        }
      } catch (err) {
        await showErrorAlert('Error', 'Failed to delete security feature: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (feature) => {
    setEditingFeature(feature);
    setFormData({
      title: feature.title || '',
      description: feature.description || '',
      icon_url: feature.icon_url || ''
    });
    setImagePreview(feature.icon_url || null);
    setShowForm(true);
  };

  const handleView = (feature) => {
    setViewingFeature(feature);
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
    setEditingFeature(null);
    setFormData({
      title: '',
      description: '',
      icon_url: ''
    });
    setImagePreview(null);
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingFeature(null);
    setViewingFeature(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files, checked, type } = e.target;
    
    if (name === 'icon' && files && files[0]) {
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl font-bold text-primary font-poppins mb-2">
            Security Features Management
          </h3>
          <p className="text-gray-600">Manage security features and compliance information</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-secondary to-orange-500 text-white rounded-xl hover:from-orange-500 hover:to-secondary transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins"
        >
          <PlusIcon className="w-5 h-5" />
          Add Feature
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
          <span className="ml-2 text-gray-600">Loading security features...</span>
        </div>
      )}

      {/* Features Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={feature.id} className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional border border-accent/20 hover:shadow-xl-professional transition-all duration-300 group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-primary font-poppins mb-2">
                      {feature.title || 'Untitled Feature'}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {feature.description || 'No description provided'}
                    </p>
                  </div>
                </div>

                {/* Icon Preview */}
                {feature.icon_url && (
                  <div className="mb-4">
                    <div 
                      className="relative cursor-pointer group"
                      onClick={() => openImageModal(feature.icon_url)}
                    >
                      <img
                        src={feature.icon_url}
                        alt={feature.title}
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
                      onClick={() => handleView(feature)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="View"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(feature)}
                      className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(feature.id)}
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
          <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-xl-professional border border-accent/20 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-primary font-poppins">
                  {editingFeature ? 'Edit Security Feature' : 'Add New Security Feature'}
                </h3>
                <p className="text-gray-600 mt-1">
                  {editingFeature ? 'Update security feature details' : 'Add a new security feature'}
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
              if (editingFeature) {
                handleUpdate(formData);
              } else {
                handleCreate(formData);
              }
            }} className="space-y-6">
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
                  placeholder="Enter security feature title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 resize-none"
                  placeholder="Enter security feature description..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Icon Upload
                </label>
                <div className="space-y-4">
                  <input
                    type="file"
                    name="icon"
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
                      <div className="relative inline-block group">
                        <div
                          className="cursor-pointer"
                          onClick={() => openImageModal(imagePreview)}
                        >
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-xl border border-accent/30 shadow-sm group-hover:opacity-90 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl flex items-center justify-center">
                            <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              Click to enlarge
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview(null);
                            setFormData(prev => ({ ...prev, icon: null }));
                            // Reset file input
                            const fileInput = document.querySelector('input[name="icon"]');
                            if (fileInput) fileInput.value = '';
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors z-10"
                        >
                          ×
                        </button>
                      </div>
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
                  {editingFeature ? 'Update' : 'Add'} Feature
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* View Modal */}
      {viewingFeature && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-xl-professional border border-accent/20 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-primary font-poppins">
                  Security Feature Details
                </h3>
                <p className="text-gray-600 mt-1">View complete security feature information</p>
              </div>
              <button
                onClick={closeModal}
                className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                  Title
                </label>
                <p className="text-lg font-medium text-gray-900">{viewingFeature.title || 'Untitled Feature'}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                  Description
                </label>
                <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-6 border border-accent/30">
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {viewingFeature.description || 'No description provided'}
                  </p>
                </div>
              </div>

              {/* Icon */}
              {viewingFeature.icon_url && (
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Icon
                  </label>
                  <div 
                    className="relative cursor-pointer group inline-block"
                    onClick={() => openImageModal(viewingFeature.icon_url)}
                  >
                    <img
                      src={viewingFeature.icon_url}
                      alt={viewingFeature.title}
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

export default SecurityFeaturesManager;
