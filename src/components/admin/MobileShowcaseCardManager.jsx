import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  LanguageIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import apiService from '../../services/api';
import RichTextEditor from '../ui/RichTextEditor';
import { DashboardLanguageContext } from '../../contexts/DashboardLanguageContext';
import { translateText } from '../../utils/translate';

const MobileShowcaseCardManager = () => {
  const { isArabic } = useContext(DashboardLanguageContext);
  const prevIsArabic = useRef(isArabic);
  const [translatingField, setTranslatingField] = useState(null);
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

  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [viewingCard, setViewingCard] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    title_ar: '',
    description: '',
    description_ar: '',
    apple_link: '',
    android_link: ''
  });
  const [, setStats] = useState({});

  const stripHtml = (html) => {
    if (!html || typeof html !== 'string') return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return (div.textContent || div.innerText || '').trim();
  };

  const handleTranslateToArabic = async (fieldName) => {
    const value = fieldName === 'description' ? stripHtml(formData.description || '') : (formData[fieldName] || '').trim();
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

  const fetchCards = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getMobileShowcaseCards();
      if (response.success) {
        setCards(response.data);
        setStats({
          total: response.data.length
        });
      } else {
        await showErrorAlert('Error', response.message || 'Failed to load mobile showcase cards');
      }
    } catch (err) {
      await showErrorAlert('Error', 'Failed to load mobile showcase cards: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  useEffect(() => {
    if (prevIsArabic.current !== isArabic) {
      prevIsArabic.current = isArabic;
      fetchCards();
    }
  }, [isArabic, fetchCards]);

  const handleCreate = async (data) => {
    try {
      setIsLoading(true);
      const payload = {
        title: String(data.title ?? ''),
        title_ar: String(data.title_ar ?? ''),
        description: data.description ?? '',
        description_ar: String(data.description_ar ?? ''),
        apple_link: data.apple_link ?? '',
        android_link: data.android_link ?? ''
      };
      const response = await apiService.createMobileShowcaseCard(payload);
      
      if (response.success) {
        await showSuccessAlert('Success!', 'Mobile showcase card created successfully!');
        await fetchCards();
        setShowForm(false);
        setFormData({
          title: '',
          title_ar: '',
          description: '',
          description_ar: '',
          apple_link: '',
          android_link: ''
        });
      } else {
        await showErrorAlert('Error', response.message || 'Failed to create mobile showcase card');
      }
    } catch (err) {
      await showErrorAlert('Error', 'Failed to create mobile showcase card: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      setIsLoading(true);
      const payload = {
        title: String(data.title ?? ''),
        title_ar: String(data.title_ar ?? ''),
        description: data.description ?? '',
        description_ar: String(data.description_ar ?? ''),
        apple_link: data.apple_link ?? '',
        android_link: data.android_link ?? ''
      };
      // DEBUG: trace Arabic fields before send
      console.log('[MobileShowcaseCard] handleUpdate formData (data):', {
        title_ar: data.title_ar,
        description_ar: data.description_ar ? `${String(data.description_ar).slice(0, 80)}...` : data.description_ar
      });
      console.log('[MobileShowcaseCard] handleUpdate payload sent:', {
        title_ar: payload.title_ar,
        description_ar: payload.description_ar ? `${payload.description_ar.slice(0, 80)}...` : payload.description_ar
      });
      const response = await apiService.updateMobileShowcaseCard(editingCard.id, payload);
      
      if (response.success) {
        await showSuccessAlert('Success!', 'Mobile showcase card updated successfully!');
        await fetchCards();
        setEditingCard(null);
        setFormData({
          title: '',
          title_ar: '',
          description: '',
          description_ar: '',
          apple_link: '',
          android_link: ''
        });
        setShowForm(false);
      } else {
        await showErrorAlert('Error', response.message || 'Failed to update mobile showcase card');
      }
    } catch (err) {
      await showErrorAlert('Error', 'Failed to update mobile showcase card: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (card) => {
    const result = await showConfirmAlert(
      'Are you sure?', 
      "You won't be able to revert this!"
    );

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        const response = await apiService.deleteMobileShowcaseCard(card.id);
        
        if (response.success) {
          await showSuccessAlert('Deleted!', 'The mobile showcase card has been deleted successfully.');
          await fetchCards();
        } else {
          await showErrorAlert('Error', response.message || 'Failed to delete mobile showcase card');
        }
      } catch (err) {
        await showErrorAlert('Error', 'Failed to delete mobile showcase card: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (card) => {
    setEditingCard(card);
    setFormData({
      title: card.title || '',
      title_ar: card.title_ar || '',
      description: card.description || '',
      description_ar: card.description_ar || '',
      apple_link: card.apple_link || '',
      android_link: card.android_link || ''
    });
    setShowForm(true);
  };

  const handleView = (card) => {
    setViewingCard(card);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingCard(null);
    setViewingCard(null);
    setFormData({
      title: '',
      title_ar: '',
      description: '',
      description_ar: '',
      apple_link: '',
      android_link: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({
      ...prev,
      description: value
    }));
  };

  const handleDescriptionArChange = (value) => {
    setFormData(prev => ({
      ...prev,
      description_ar: value
    }));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl font-bold text-primary font-poppins mb-2">
            Mobile Showcase Card Management
          </h3>
          <p className="text-gray-600">Manage mobile app download card content</p>
        </div>
        {/* <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary to-orange-500 text-white rounded-xl hover:from-orange-500 hover:to-secondary transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Card
        </button> */}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
          <span className="ml-2 text-gray-600">Loading cards...</span>
        </div>
      )}

      {/* Cards List */}
      {!isLoading && (
        <div className="space-y-6">
          {cards.length > 0 ? (
            cards.map((card) => (
              <div key={card.id} className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional border border-accent/20 hover:shadow-xl-professional transition-all duration-300 group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          ID: {card.id}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-primary font-poppins mb-2" dir={isArabic ? 'rtl' : 'ltr'}>
                        {isArabic ? (card.title_ar || card.title || 'Untitled Card') : (card.title || 'Untitled Card')}
                      </h4>
                      <div 
                        className="text-gray-600 text-sm leading-relaxed line-clamp-3"
                        dir={isArabic ? 'rtl' : 'ltr'}
                        dangerouslySetInnerHTML={{ __html: isArabic ? (card.description_ar || card.description || 'No description provided') : (card.description || 'No description provided') }}
                      />
                      <div className="flex gap-4 mt-3">
                        {card.apple_link && (
                          <a 
                            href={card.apple_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            Apple Store
                          </a>
                        )}
                        {card.android_link && (
                          <a 
                            href={card.android_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-green-600 hover:text-green-800 underline"
                          >
                            Google Play
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-accent/20">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(card)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="View"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(card)}
                        className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(card)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <ClockIcon className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No mobile showcase cards found</h3>
              <p className="text-gray-500 mb-4">
                Create your first mobile showcase card to get started.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-xl-professional border border-accent/20 p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-primary font-poppins">
                  {editingCard ? 'Edit Card' : 'Add New Card'}
                </h3>
                <p className="text-gray-600 mt-1">
                  {editingCard ? 'Update card details' : 'Create a new mobile showcase card'}
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
              if (editingCard) {
                handleUpdate(formData);
              } else {
                handleCreate(formData);
              }
            }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Title (EN) *
                  </label>
                  <div className="flex gap-2 items-start">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="flex-1 min-w-0 px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                      placeholder="Enter card title"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleTranslateToArabic('title')}
                      disabled={translatingField === 'title' || !(formData.title || '').trim()}
                      className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Translate to Arabic"
                    >
                      {translatingField === 'title' ? (
                        <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <LanguageIcon className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Title (AR)
                  </label>
                  <input
                    type="text"
                    name="title_ar"
                    value={formData.title_ar}
                    onChange={handleInputChange}
                    dir="rtl"
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                    placeholder="العنوان بالعربية"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Description (EN)
                </label>
                <div className="flex gap-2 items-start">
                  <div className="flex-1 min-w-0 rich-text-container">
                    <RichTextEditor
                      value={formData.description}
                      onChange={handleDescriptionChange}
                      placeholder="Enter card description... (Use the toolbar for formatting)"
                      height="180px"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTranslateToArabic('description')}
                    disabled={translatingField === 'description' || !stripHtml(formData.description || '').trim()}
                    className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-start"
                    title="Translate to Arabic"
                  >
                    {translatingField === 'description' ? (
                      <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <LanguageIcon className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Description (AR)
                </label>
                <div className="rich-text-container" dir="rtl">
                  <RichTextEditor
                    value={formData.description_ar}
                    onChange={handleDescriptionArChange}
                    placeholder="الوصف بالعربية..."
                    height="180px"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Apple Store Link
                  </label>
                  <input
                    type="url"
                    name="apple_link"
                    value={formData.apple_link}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                    placeholder="https://apps.apple.com/app/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Google Play Link
                  </label>
                  <input
                    type="url"
                    name="android_link"
                    value={formData.android_link}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                    placeholder="https://play.google.com/store/apps/..."
                  />
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
                  {editingCard ? 'Update' : 'Add'} Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-xl-professional border border-accent/20 p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-primary font-poppins">
                  Card Details
                </h3>
                <p className="text-gray-600 mt-1">View complete card information</p>
              </div>
              <button
                onClick={closeModal}
                className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                  Title
                </label>
                <p className="text-lg font-medium text-gray-900">
                  {isArabic ? (viewingCard.title_ar || viewingCard.title || 'Untitled Card') : (viewingCard.title || 'Untitled Card')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                  Description
                </label>
                <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-6 border border-accent/30">
                  <div 
                    className="text-gray-800 text-lg leading-relaxed prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: isArabic ? (viewingCard.description_ar || viewingCard.description || 'No description provided') : (viewingCard.description || 'No description provided') }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {viewingCard.apple_link && (
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                      Apple Store Link
                    </label>
                    <a 
                      href={viewingCard.apple_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {viewingCard.apple_link}
                    </a>
                  </div>
                )}

                {viewingCard.android_link && (
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                      Google Play Link
                    </label>
                    <a 
                      href={viewingCard.android_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 underline break-all"
                    >
                      {viewingCard.android_link}
                    </a>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                  Card ID
                </label>
                <p className="text-lg font-medium text-gray-900">{viewingCard.id}</p>
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

export default MobileShowcaseCardManager;
