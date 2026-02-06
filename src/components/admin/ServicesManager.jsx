import React, { useState, useEffect, useCallback, useContext } from 'react';
import { createPortal } from 'react-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  XMarkIcon,
  PhotoIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import apiService from '../../services/api';
import { translateFieldsToArabic, translateText } from '../../utils/translate';
import { DashboardLanguageContext } from '../../contexts/DashboardLanguageContext';
import { getT } from '../../data/translations';

const ServicesManager = () => {
  const { language, isArabic } = useContext(DashboardLanguageContext);
  const t = getT(language);
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
  const [translatingField, setTranslatingField] = useState(null);

  const handleTranslateToArabic = async (fieldName) => {
    const value = (formData[fieldName] || '').trim();
    if (!value) return;
    setTranslatingField(fieldName);
    try {
      const translated = await translateText(value, 'ar', 'en');
      const arField = `${fieldName}_ar`;
      setFormData(prev => ({ ...prev, [arField]: translated }));
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setTranslatingField(null);
    }
  };

  const handleTranslateBulletPointsToArabic = async (fieldName) => {
    const lines = formData[fieldName] || [];
    if (!Array.isArray(lines) || lines.length === 0) return;
    setTranslatingField(fieldName);
    try {
      const translated = await Promise.all(
        lines.map((text) => (text && String(text).trim() ? translateText(text, 'ar', 'en') : Promise.resolve('')))
      );
      const arField = `${fieldName}_ar`;
      setFormData(prev => ({ ...prev, [arField]: translated }));
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setTranslatingField(null);
    }
  };

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
        const publicResponse = await apiService.getServices();
        if (publicResponse && publicResponse.success !== false) {
          setServices(publicResponse.data || publicResponse);
          return;
        }
        throw adminErr;
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


  const parseBulletPoints = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val.map(s => (s && String(s).trim()) || '').filter(Boolean);
    try {
      const parsed = typeof val === 'string' ? JSON.parse(val) : val;
      return Array.isArray(parsed) ? parsed.map(s => (s && String(s).trim()) || '').filter(Boolean) : [];
    } catch {
      return [];
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      title_ar: service.title_ar || '',
      description: service.description || '',
      description_ar: service.description_ar || '',
      quotation: service.quotation || '',
      quotation_ar: service.quotation_ar || '',
      button_text: service.button_text || '',
      button_text_ar: service.button_text_ar || '',
      description_bullet_points: parseBulletPoints(service.description_bullet_points),
      modal_description_bullet_points: parseBulletPoints(service.modal_description_bullet_points),
      description_bullet_points_ar: parseBulletPoints(service.description_bullet_points_ar),
      modal_description_bullet_points_ar: parseBulletPoints(service.modal_description_bullet_points_ar),
    });
    
    // Set image preview
    const previews = {};
    if (service.image_url) previews.image = service.image_url;
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
      title_ar: '',
      description: '',
      description_ar: '',
      quotation: '',
      quotation_ar: '',
      button_text: '',
      button_text_ar: '',
      description_bullet_points: [],
      modal_description_bullet_points: [],
      description_bullet_points_ar: [],
      modal_description_bullet_points_ar: [],
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

  const handleInputChange = async (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image') {
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
    } else {
      setFormData(prev => {
        const updated = {
          ...prev,
          [name]: value
        };
        
        // Auto-translate to Arabic when English fields change
        if (name === 'title' || name === 'description' || name === 'quotation' || name === 'button_text') {
          if (value && value.trim() !== '') {
            translateFieldsToArabic({ [name]: value }, [name])
              .then(translations => {
                setFormData(prevData => ({
                  ...prevData,
                  ...translations
                }));
              })
              .catch(error => {
                console.error('Auto-translation error:', error);
              });
          } else {
            // Clear Arabic field if English field is empty
            updated[`${name}_ar`] = '';
          }
        }
        
        return updated;
      });
    }
  };


  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl font-bold text-primary font-poppins mb-2">
            {t('servicesManagement')}
          </h3>
          <p className="text-gray-600">{t('servicesManagementSubtitle')}</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-secondary to-orange-500 text-white rounded-xl hover:from-orange-500 hover:to-secondary transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins"
        >
          <PlusIcon className="w-5 h-5" />
          {t('addService')}
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
          <span className="ml-2 text-gray-600">{t('loadingServices')}</span>
        </div>
      )}

      {/* Services Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const displayTitle = isArabic && service.title_ar ? service.title_ar : (service.title || t('untitledService'));
            const displayDescription = isArabic && service.description_ar ? service.description_ar : (service.description || t('noDescriptionProvided'));
            const displayQuotation = isArabic && service.quotation_ar ? service.quotation_ar : service.quotation;
            return (
            <div key={service.id} className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional border border-accent/20 hover:shadow-xl-professional transition-all duration-300 group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1" dir={isArabic ? 'rtl' : undefined}>
                    <h4 className="text-lg font-bold text-primary font-poppins mb-2">
                      {displayTitle}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {displayDescription}
                    </p>
                    {displayQuotation && (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        "{displayQuotation}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Image Preview */}
                {service.image_url && (
                  <div className="mb-4">
                    <div 
                      className="relative cursor-pointer group"
                      onClick={() => openImageModal(service.image_url)}
                    >
                      <img
                        src={service.image_url}
                        alt={displayTitle}
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
          );
          })}
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
                    Title (English) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ''}
                      onChange={handleInputChange}
                      className="flex-1 min-w-0 px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                      placeholder="Enter service title"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleTranslateToArabic('title')}
                      disabled={!formData.title?.trim() || translatingField === 'title'}
                      className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl border border-accent/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Translate to Arabic"
                    >
                      {translatingField === 'title' ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : 'AR'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Title (Arabic)
                  </label>
                  <input
                    type="text"
                    name="title_ar"
                    value={formData.title_ar || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                    placeholder="Translate or type Arabic title"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Description (English) *
                  </label>
                  <div className="flex gap-2">
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      rows={4}
                      className="flex-1 min-w-0 px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 resize-none"
                      placeholder="Enter service description..."
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleTranslateToArabic('description')}
                      disabled={!formData.description?.trim() || translatingField === 'description'}
                      className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl border border-accent/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-start"
                      title="Translate to Arabic"
                    >
                      {translatingField === 'description' ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : 'AR'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Description (Arabic)
                  </label>
                  <textarea
                    name="description_ar"
                    value={formData.description_ar || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 resize-none"
                    placeholder="Translate or type Arabic description"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Description bullet points (English) */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Description bullet points (English) – one per line
                </label>
                <div className="flex gap-2">
                  <textarea
                    name="description_bullet_points"
                    value={(formData.description_bullet_points || []).join('\n')}
                    onChange={(e) => {
                      const lines = e.target.value.split('\n').map(s => s.trim()).filter(Boolean);
                      setFormData(prev => ({ ...prev, description_bullet_points: lines }));
                    }}
                    rows={5}
                    className="flex-1 min-w-0 px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 resize-y"
                    placeholder={'Gamified learning and quick science-backed practices\nDaily mind cookies and inspiring stories\nBuilds focus, energy, and balance...'}
                  />
                  <button
                    type="button"
                    onClick={() => handleTranslateBulletPointsToArabic('description_bullet_points')}
                    disabled={!(formData.description_bullet_points || []).length || translatingField === 'description_bullet_points'}
                    className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl border border-accent/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-start"
                    title="Translate to Arabic"
                  >
                    {translatingField === 'description_bullet_points' ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : 'AR'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Each line becomes one bullet on the service page.</p>
              </div>

              {/* Description bullet points (Arabic) */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Description bullet points (Arabic) – one per line
                </label>
                <textarea
                  name="description_bullet_points_ar"
                  value={(formData.description_bullet_points_ar || []).join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n').map(s => s.trim()).filter(Boolean);
                    setFormData(prev => ({ ...prev, description_bullet_points_ar: lines }));
                  }}
                  rows={5}
                  className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 resize-y"
                  placeholder="نقاط بالعربية – سطر واحد لكل نقطة"
                  dir="rtl"
                />
              </div>

              {/* Modal description bullet points (English) */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Modal description bullet points (English) – one per line
                </label>
                <div className="flex gap-2">
                  <textarea
                    name="modal_description_bullet_points"
                    value={(formData.modal_description_bullet_points || []).join('\n')}
                    onChange={(e) => {
                      const lines = e.target.value.split('\n').map(s => s.trim()).filter(Boolean);
                      setFormData(prev => ({ ...prev, modal_description_bullet_points: lines }));
                    }}
                    rows={6}
                    className="flex-1 min-w-0 px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 resize-y"
                    placeholder={'Designed to inspire teams and foster thriving cultures\nEncourage a shift from coping to thriving\n...'}
                  />
                  <button
                    type="button"
                    onClick={() => handleTranslateBulletPointsToArabic('modal_description_bullet_points')}
                    disabled={!(formData.modal_description_bullet_points || []).length || translatingField === 'modal_description_bullet_points'}
                    className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl border border-accent/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-start"
                    title="Translate to Arabic"
                  >
                    {translatingField === 'modal_description_bullet_points' ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : 'AR'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Shown in the &quot;Learn more&quot; modal. Each line = one bullet.</p>
              </div>

              {/* Modal description bullet points (Arabic) */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Modal description bullet points (Arabic) – one per line
                </label>
                <textarea
                  name="modal_description_bullet_points_ar"
                  value={(formData.modal_description_bullet_points_ar || []).join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n').map(s => s.trim()).filter(Boolean);
                    setFormData(prev => ({ ...prev, modal_description_bullet_points_ar: lines }));
                  }}
                  rows={6}
                  className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 resize-y"
                  placeholder="نقاط النافذة المنبثقة بالعربية – سطر واحد لكل نقطة"
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Quotation (English)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="quotation"
                      value={formData.quotation || ''}
                      onChange={handleInputChange}
                      className="flex-1 min-w-0 px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                      placeholder="Enter quotation..."
                    />
                    <button
                      type="button"
                      onClick={() => handleTranslateToArabic('quotation')}
                      disabled={!formData.quotation?.trim() || translatingField === 'quotation'}
                      className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl border border-accent/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Translate to Arabic"
                    >
                      {translatingField === 'quotation' ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : 'AR'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Quotation (Arabic)
                  </label>
                  <input
                    type="text"
                    name="quotation_ar"
                    value={formData.quotation_ar || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                    placeholder="Translate or type Arabic quotation"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Button Text (English)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="button_text"
                      value={formData.button_text || ''}
                      onChange={handleInputChange}
                      className="flex-1 min-w-0 px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                      placeholder="Enter button text..."
                    />
                    <button
                      type="button"
                      onClick={() => handleTranslateToArabic('button_text')}
                      disabled={!formData.button_text?.trim() || translatingField === 'button_text'}
                      className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl border border-accent/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Translate to Arabic"
                    >
                      {translatingField === 'button_text' ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : 'AR'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Button Text (Arabic)
                  </label>
                  <input
                    type="text"
                    name="button_text_ar"
                    value={formData.button_text_ar || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                    placeholder="Translate or type Arabic button text"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Single Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Service Image *
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-orange-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: JPEG, PNG, GIF, WEBP. Maximum size: 5MB
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  Recommended resolution: 800x600px for service images
                </p>
                {imagePreviews.image && (
                  <div className="mt-2">
                    <img
                      src={imagePreviews.image}
                      alt="Image preview"
                      className="w-32 h-32 object-cover rounded-lg border border-accent/30"
                    />
                  </div>
                )}
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
      {viewingService && (() => {
        const viewTitle = isArabic && viewingService.title_ar ? viewingService.title_ar : (viewingService.title || t('untitledService'));
        const viewDesc = isArabic && viewingService.description_ar ? viewingService.description_ar : (viewingService.description || t('noDescriptionProvided'));
        const viewQuotation = isArabic && viewingService.quotation_ar ? viewingService.quotation_ar : viewingService.quotation;
        const viewButtonText = isArabic && viewingService.button_text_ar ? viewingService.button_text_ar : viewingService.button_text;
        const viewDescBullets = parseBulletPoints(viewingService.description_bullet_points);
        const viewModalBullets = parseBulletPoints(viewingService.modal_description_bullet_points);
        const viewDescBulletsAr = parseBulletPoints(viewingService.description_bullet_points_ar);
        const viewModalBulletsAr = parseBulletPoints(viewingService.modal_description_bullet_points_ar);
        const displayDescBullets = isArabic && viewDescBulletsAr.length ? viewDescBulletsAr : viewDescBullets;
        const displayModalBullets = isArabic && viewModalBulletsAr.length ? viewModalBulletsAr : viewModalBullets;
        return createPortal(
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

            <div className="space-y-6" dir={isArabic ? 'rtl' : undefined}>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                  Title
                </label>
                <p className="text-lg font-medium text-gray-900">{viewTitle}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                  Description
                </label>
                <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-6 border border-accent/30">
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {viewDesc}
                  </p>
                </div>
              </div>

              {displayDescBullets.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                    Description bullet points
                  </label>
                  <ul className="list-disc list-inside space-y-1 text-gray-800" dir={isArabic && viewDescBulletsAr.length ? 'rtl' : undefined}>
                    {displayDescBullets.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {displayModalBullets.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                    Modal description bullet points
                  </label>
                  <ul className="list-disc list-inside space-y-1 text-gray-800" dir={isArabic && viewModalBulletsAr.length ? 'rtl' : undefined}>
                    {displayModalBullets.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {viewQuotation && (
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                    Quotation
                  </label>
                  <p className="text-lg font-medium text-gray-900 italic">"{viewQuotation}"</p>
                </div>
              )}

              {viewButtonText && (
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                    Button Text
                  </label>
                  <p className="text-lg font-medium text-gray-900">{viewButtonText}</p>
                </div>
              )}

              {/* Service Image */}
              {viewingService.image_url && (
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Service Image
                  </label>
                  <div 
                    className="relative cursor-pointer group inline-block"
                    onClick={() => openImageModal(viewingService.image_url)}
                  >
                    <img
                      src={viewingService.image_url}
                      alt={viewTitle}
                      className="w-48 h-48 object-cover rounded-xl border border-accent/30 shadow-sm group-hover:opacity-90 transition-opacity"
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
      );
      })()}

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
