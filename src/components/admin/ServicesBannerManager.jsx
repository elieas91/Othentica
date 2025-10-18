import React, { useEffect, useState } from 'react';
import apiService from '../../services/api';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ServicesBannerManager = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', images: [], alt_text: '' });
  const [previewUrls, setPreviewUrls] = useState([]);

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
    setFormData({ title: '', description: '', images: [], alt_text: '' });
    setPreviewUrls([]);
    setFormOpen(true);
  };

  const openEdit = (img) => {
    setEditing(img);
    setFormData({ title: img.title || '', description: img.description || '', images: [], alt_text: img.alt_text || '' });
    setPreviewUrls([]);
    setFormOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editing) {
        await apiService.updateServicesBannerImageAdmin(editing.id, { title: formData.title, description: formData.description, alt_text: formData.alt_text, image: formData.images[0] || null });
      } else {
        // Create multiple images in one go
        const payload = { title: formData.title, description: formData.description, alt_text: formData.alt_text };
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
        formData.images.forEach((file) => fd.append('image', file));
        // Use the low-level authenticatedRequest to preserve multiple files
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
                {img.image_url && <img src={img.image_url} alt={img.alt_text || ''} className="w-full h-full object-cover" />}
              </div>
              <div className="p-4 space-y-2">
                <div className="font-semibold">{img.title || 'Untitled'}</div>
                <div className="text-sm text-gray-600">{img.description}</div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent" 
                  placeholder="Enter image title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent" 
                  rows={3}
                  placeholder="Enter image description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alt text</label>
                <input 
                  value={formData.alt_text} 
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent" 
                  placeholder="Enter alt text for accessibility"
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


