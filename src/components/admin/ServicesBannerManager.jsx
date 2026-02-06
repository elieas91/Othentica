import React, { useEffect, useState, useContext } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import apiService from '../../services/api';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { translateText } from '../../utils/translate';
import { DashboardLanguageContext } from '../../contexts/DashboardLanguageContext';

const ServicesBannerManager = () => {
  const { isArabic } = useContext(DashboardLanguageContext);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', images: [], alt_text: '',
    title_ar: '', description_ar: '', alt_text_ar: ''
  });
  const [previewUrls, setPreviewUrls] = useState([]);
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

  const load = async () => {
    setIsLoading(true);
    try {
      try {
        const res = await apiService.getAllServicesBannerImagesAdmin();
        if (res && res.data) {
          setImages(res.data);
          return;
        }
      } catch (error) {
        console.error('Error fetching services banner images:', error);
      }
      const res = await apiService.getServicesBannerImages();
      setImages(res.data || res || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData({ title: '', description: '', images: [], alt_text: '', title_ar: '', description_ar: '', alt_text_ar: '' });
    setPreviewUrls([]);
    setFormOpen(true);
  };

  const openEdit = (img) => {
    setEditing(img);
    setFormData({
      title: img.title || '',
      description: img.description || '',
      images: [],
      alt_text: img.alt_text || '',
      title_ar: img.title_ar || '',
      description_ar: img.description_ar || '',
      alt_text_ar: img.alt_text_ar || ''
    });
    setPreviewUrls([]);
    setFormOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editing) {
        await apiService.updateServicesBannerImageAdmin(editing.id, {
          title: formData.title,
          description: formData.description,
          alt_text: formData.alt_text,
          title_ar: formData.title_ar || '',
          description_ar: formData.description_ar || '',
          alt_text_ar: formData.alt_text_ar || '',
          image: formData.images[0] || null
        });
      } else {
        const payload = {
          title: formData.title,
          description: formData.description,
          alt_text: formData.alt_text,
          title_ar: formData.title_ar || '',
          description_ar: formData.description_ar || '',
          alt_text_ar: formData.alt_text_ar || ''
        };
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
        formData.images.forEach((file) => fd.append('image', file));
        await apiService.authenticatedRequest(`${apiService.baseURL}/content/admin/services-banner-images`, { method: 'POST', body: fd });
      }
      setFormOpen(false);
      await load();
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id) => {
    setIsLoading(true);
    try {
      await apiService.deleteServicesBannerImageAdmin(id);
      await load();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary font-poppins">Services Banner Images</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-white">
          <PlusIcon className="w-5 h-5" /> Add Image
        </button>
      </div>

      {isLoading && <div className="text-gray-600">Loading...</div>}

      {!isLoading && Array.isArray(images) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div key={img.id} className="rounded-2xl border border-accent/20 overflow-hidden bg-white">
              <div className="aspect-video bg-gray-100">
                {img.image_url && <img src={img.image_url} alt={isArabic ? (img.alt_text_ar || img.alt_text || '') : (img.alt_text || '')} className="w-full h-full object-cover" />}
              </div>
              <div className="p-4 space-y-2" dir={isArabic ? 'rtl' : 'ltr'}>
                <div className="font-semibold">{isArabic ? (img.title_ar || img.title || 'Untitled') : (img.title || 'Untitled')}</div>
                <div className="text-sm text-gray-600">{isArabic ? (img.description_ar || img.description || '') : (img.description || '')}</div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => openEdit(img)} className="px-3 py-2 rounded-lg bg-yellow-100 text-yellow-700">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => remove(img.id)} className="px-3 py-2 rounded-lg bg-red-100 text-red-700">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Popup */}
      {formOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editing ? 'Edit Image' : 'Add New Image'}
              </h3>
              <button
                onClick={() => setFormOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={submit} className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <button
                    type="button"
                    onClick={() => handleTranslateToArabic('title')}
                    disabled={!formData.title?.trim() || translatingField === 'title'}
                    className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Translate to Arabic"
                  >
                    {translatingField === 'title' ? <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" /> : 'AR'}
                  </button>
                </div>
                <input 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent" 
                  placeholder="Enter image title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (AR)</label>
                <input 
                  value={formData.title_ar} 
                  onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent" 
                  placeholder="العنوان بالعربية"
                  dir="rtl"
                />
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <button
                    type="button"
                    onClick={() => handleTranslateToArabic('description')}
                    disabled={!formData.description?.trim() || translatingField === 'description'}
                    className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Translate to Arabic"
                  >
                    {translatingField === 'description' ? <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" /> : 'AR'}
                  </button>
                </div>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent" 
                  rows={3}
                  placeholder="Enter image description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (AR)</label>
                <textarea 
                  value={formData.description_ar} 
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent" 
                  rows={3}
                  placeholder="الوصف بالعربية"
                  dir="rtl"
                />
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-gray-700">Alt text</label>
                  <button
                    type="button"
                    onClick={() => handleTranslateToArabic('alt_text')}
                    disabled={!formData.alt_text?.trim() || translatingField === 'alt_text'}
                    className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Translate to Arabic"
                  >
                    {translatingField === 'alt_text' ? <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" /> : 'AR'}
                  </button>
                </div>
                <input 
                  value={formData.alt_text} 
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent" 
                  placeholder="Enter alt text for accessibility"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alt text (AR)</label>
                <input 
                  value={formData.alt_text_ar} 
                  onChange={(e) => setFormData({ ...formData, alt_text_ar: e.target.value })} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent" 
                  placeholder="النص البديل بالعربية"
                  dir="rtl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setFormData({ ...formData, images: files });
                    setPreviewUrls(files.map((f) => URL.createObjectURL(f)));
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-500">
                    Supported formats: JPEG, PNG, GIF, WEBP. Maximum size: 5MB
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    Recommended resolution: 1920x1080px for services banner images
                  </p>
                </div>
              </div>
              
              {previewUrls.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {previewUrls.map((url, idx) => (
                      <img key={idx} src={url} alt="preview" className="w-full h-24 object-cover rounded-lg border border-gray-200" />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : (editing ? 'Update Image' : 'Add Image')}
                </button>
                <button 
                  type="button" 
                  onClick={() => setFormOpen(false)} 
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesBannerManager;


