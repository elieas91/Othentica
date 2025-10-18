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

const MobileShowcaseImagesManager = () => {
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

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(null);

  const fetchImages = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAllMobileShowcaseImages();
      if (response.success) {
        setImages(response.data);
      } else {
        await showErrorAlert('Error', response.message || 'Failed to load mobile showcase images');
      }
    } catch (err) {
      await showErrorAlert('Error', 'Failed to load mobile showcase images: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load images on component mount
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Handle modal positioning, body scroll, and ESC key
  useEffect(() => {
    const handleEscKey = (event) => {
      console.log('ESC key pressed, current modals:', { showForm, viewingImage, showImageModal });
      if (event.key === 'Escape') {
        if (showImageModal) {
          console.log('Closing image modal');
          closeImageModal();
        } else if (viewingImage) {
          console.log('Closing view modal');
          closeModal();
        } else if (showForm) {
          console.log('Closing form modal');
          closeModal();
        }
      }
    };

    if (showForm || viewingImage || showImageModal) {
      console.log('Adding ESC key listener for modals:', { showForm, viewingImage, showImageModal });
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
      // Ensure modal is positioned correctly
      document.body.style.position = 'relative';
      // Add ESC key listener
      document.addEventListener('keydown', handleEscKey);
    } else {
      console.log('Removing ESC key listener - no modals open');
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
  }, [showForm, viewingImage, showImageModal]);

  const handleCreate = async (data) => {
    try {
      setIsLoading(true);
      
      const response = await apiService.createMobileShowcaseImage(data);
      
      if (response.success) {
        await showSuccessAlert('Success!', 'Image created successfully!');
        await fetchImages();
        setShowForm(false);
        setFormData({});
        setImagePreview(null);
      } else {
        await showErrorAlert('Error', response.message || 'Failed to create image');
      }
    } catch (err) {
      await showErrorAlert('Error', 'Failed to create image: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      setIsLoading(true);
      
      const response = await apiService.updateMobileShowcaseImage(editingImage.id, data);
      
      if (response.success) {
        await showSuccessAlert('Success!', 'Image updated successfully!');
        await fetchImages();
        setEditingImage(null);
        setFormData({});
        setImagePreview(null);
        setShowForm(false);
      } else {
        await showErrorAlert('Error', response.message || 'Failed to update image');
      }
    } catch (err) {
      await showErrorAlert('Error', 'Failed to update image: ' + err.message);
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
        const response = await apiService.deleteMobileShowcaseImage(id);
        
        if (response.success) {
          await showSuccessAlert('Deleted!', 'The image has been deleted successfully.');
          await fetchImages();
        } else {
          await showErrorAlert('Error', response.message || 'Failed to delete image');
        }
      } catch (err) {
        await showErrorAlert('Error', 'Failed to delete image: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      title: image.title || '',
      description: image.description || '',
      alt_text: image.alt_text || ''
    });
    setImagePreview(image.image_url || null);
    setShowForm(true);
  };

  const handleView = (image) => {
    setViewingImage(image);
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
    setEditingImage(null);
    setFormData({
      title: '',
      description: '',
      alt_text: ''
    });
    setImagePreview(null);
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingImage(null);
    setViewingImage(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files, checked, type } = e.target;
    
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
            Mobile Showcase Images Management
          </h3>
          <p className="text-gray-600">Manage mobile showcase images for the homepage</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-secondary to-orange-500 text-white rounded-xl hover:from-orange-500 hover:to-secondary transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins"
        >
          <PlusIcon className="w-5 h-5" />
          Add Image
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
          <span className="ml-2 text-gray-600">Loading images...</span>
        </div>
      )}

      {/* Images Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional border border-accent/20 hover:shadow-xl-professional transition-all duration-300 group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-primary font-poppins mb-2">
                      {image.title || 'Untitled Image'}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {image.description || 'No description provided'}
                    </p>
                  </div>
                </div>

                {/* Image Preview */}
                <div className="mb-4">
                  <div 
                    className="relative cursor-pointer group"
                    onClick={() => openImageModal(image.image_url)}
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || image.title}
                      className="w-full h-32 object-cover rounded-lg border border-accent/30 shadow-sm group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to enlarge
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-accent/20">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(image)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="View"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(image)}
                      className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
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
                  {editingImage ? 'Edit Image' : 'Add New Image'}
                </h3>
                <p className="text-gray-600 mt-1">
                  {editingImage ? 'Update image details' : 'Add a new mobile showcase image'}
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
              if (editingImage) {
                handleUpdate(formData);
              } else {
                handleCreate(formData);
              }
            }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                    placeholder="Enter image title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    name="alt_text"
                    value={formData.alt_text || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                    placeholder="Enter alt text for accessibility"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 resize-none"
                  placeholder="Enter image description..."
                />
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
                  <p className="text-xs text-blue-600 font-medium">
                    Recommended resolution: 1080x1920px for mobile showcase images
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
                            setFormData(prev => ({ ...prev, image: null }));
                            // Reset file input
                            const fileInput = document.querySelector('input[name="image"]');
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
                  {editingImage ? 'Update' : 'Add'} Image
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* View Modal */}
      {viewingImage && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-xl-professional border border-accent/20 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-primary font-poppins">
                  Image Details
                </h3>
                <p className="text-gray-600 mt-1">View complete image information</p>
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
                <p className="text-lg font-medium text-gray-900">{viewingImage.title || 'Untitled Image'}</p>
              </div>

              {viewingImage.description && (
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                    Description
                  </label>
                  <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-6 border border-accent/30">
                    <p className="text-gray-800 text-lg leading-relaxed">
                      {viewingImage.description}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                  Alt Text
                </label>
                <p className="text-lg font-medium text-gray-900">{viewingImage.alt_text || 'No alt text provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Image
                </label>
                <div 
                  className="relative cursor-pointer group"
                  onClick={() => openImageModal(viewingImage.image_url)}
                >
                  <img
                    src={viewingImage.image_url}
                    alt={viewingImage.alt_text || viewingImage.title}
                    className="w-full h-64 object-cover rounded-xl border border-accent/30 shadow-sm group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to enlarge
                    </span>
                  </div>
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

export default MobileShowcaseImagesManager;
