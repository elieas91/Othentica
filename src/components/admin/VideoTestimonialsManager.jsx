import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, FilmIcon, LinkIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import apiService from '../../services/api';

const VIDEO_SOURCE = { YOUTUBE: 'youtube', UPLOAD: 'upload' };

const showSuccess = (title, text) =>
  Swal.fire({ title, text, icon: 'success', confirmButtonColor: '#10b981', background: '#fff', customClass: { popup: 'rounded-2xl', title: 'font-poppins font-bold text-primary' } });
const showError = (title, text) =>
  Swal.fire({ title, text, icon: 'error', confirmButtonColor: '#ef4444', background: '#fff', customClass: { popup: 'rounded-2xl', title: 'font-poppins font-bold text-primary' } });
const showConfirm = (title, text) =>
  Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    background: '#fff',
    customClass: { popup: 'rounded-2xl', title: 'font-poppins font-bold text-primary' },
  });

export default function VideoTestimonialsManager() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    title_ar: '',
    video_url: '',
    video: null,
    source: VIDEO_SOURCE.YOUTUBE,
    display_order: 0,
  });

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await apiService.getVideoTestimonials();
      if (res.success && Array.isArray(res.data)) setList(res.data);
      else setList([]);
    } catch (e) {
      console.error(e);
      showError('Error', 'Failed to load video testimonials.');
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      title_ar: '',
      video_url: '',
      video: null,
      source: VIDEO_SOURCE.YOUTUBE,
      display_order: list.length,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    const hasUrl = !!(item.video_url && item.video_url.trim());
    setFormData({
      title: item.title || '',
      title_ar: item.title_ar || '',
      video_url: item.video_url || '',
      video: null,
      source: hasUrl ? VIDEO_SOURCE.YOUTUBE : VIDEO_SOURCE.UPLOAD,
      display_order: item.display_order ?? 0,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isYoutube = formData.source === VIDEO_SOURCE.YOUTUBE;
    const urlTrimmed = (formData.video_url || '').trim();
    if (isYoutube && !urlTrimmed) {
      showError('Validation', 'Please enter a YouTube or video embed URL.');
      return;
    }
    if (!isYoutube && !formData.video && !editingId) {
      showError('Validation', 'Please upload a video file.');
      return;
    }
    if (!isYoutube && !formData.video && editingId) {
      // Keep existing video when editing and not uploading new one
    }
    setSaving(true);
    try {
      const payload = {
        title: formData.title || null,
        title_ar: formData.title_ar || null,
        video_url: isYoutube ? urlTrimmed : '',
        display_order: parseInt(formData.display_order, 10) || 0,
      };
      if (!isYoutube && formData.video instanceof File) payload.video = formData.video;

      if (editingId) {
        const res = await apiService.updateVideoTestimonial(editingId, payload);
        if (res.success) {
          showSuccess('Updated', 'Video testimonial updated.');
          resetForm();
          fetchList();
        } else throw new Error(res.message || 'Update failed');
      } else {
        const res = await apiService.createVideoTestimonial(payload);
        if (res.success) {
          showSuccess('Added', 'Video testimonial added.');
          resetForm();
          fetchList();
        } else throw new Error(res.message || 'Create failed');
      }
    } catch (err) {
      showError('Error', err.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await showConfirm('Delete video testimonial?', "You won't be able to revert this.");
    if (!result.isConfirmed) return;
    try {
      const res = await apiService.deleteVideoTestimonial(id);
      if (res.success) {
        showSuccess('Deleted', 'Video testimonial removed.');
        fetchList();
        if (editingId === id) resetForm();
      } else throw new Error(res.message || 'Delete failed');
    } catch (err) {
      showError('Error', err.message || 'Failed to delete.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'video' && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('video/')) {
        showError('Invalid file', 'Please select a video file (e.g. MP4, WebM).');
        return;
      }
      if (file.size > 150 * 1024 * 1024) {
        showError('File too large', 'Maximum size is 150MB.');
        return;
      }
      setFormData((prev) => ({ ...prev, video: file, source: VIDEO_SOURCE.UPLOAD }));
      return;
    }
    if (name === 'display_order') {
      setFormData((prev) => ({ ...prev, [name]: value === '' ? '' : parseInt(value, 10) }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-primary font-poppins">Video Testimonials</h2>
          <p className="text-gray-600 text-sm">Add YouTube links or upload videos for the homepage carousel.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFormData({
              title: '',
              title_ar: '',
              video_url: '',
              video: null,
              source: VIDEO_SOURCE.YOUTUBE,
              display_order: list.length,
            });
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:opacity-90 font-medium font-poppins"
        >
          <PlusIcon className="w-5 h-5" />
          Add Video
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-accent/20 shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-primary font-poppins">{editingId ? 'Edit' : 'Add'} Video Testimonial</h3>
            <button type="button" onClick={resetForm} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">Title (English)</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g. Client name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">Title (Arabic)</label>
                <input
                  type="text"
                  name="title_ar"
                  value={formData.title_ar}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="اسم العميل"
                  dir="rtl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Video source</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="source"
                    checked={formData.source === VIDEO_SOURCE.YOUTUBE}
                    onChange={() => setFormData((prev) => ({ ...prev, source: VIDEO_SOURCE.YOUTUBE, video: null }))}
                    className="text-primary focus:ring-primary"
                  />
                  <LinkIcon className="w-4 h-4 text-gray-500" />
                  <span>YouTube / video link</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="source"
                    checked={formData.source === VIDEO_SOURCE.UPLOAD}
                    onChange={() => setFormData((prev) => ({ ...prev, source: VIDEO_SOURCE.UPLOAD, video_url: '' }))}
                    className="text-primary focus:ring-primary"
                  />
                  <FilmIcon className="w-4 h-4 text-gray-500" />
                  <span>Upload video</span>
                </label>
              </div>
            </div>

            {formData.source === VIDEO_SOURCE.YOUTUBE ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">YouTube or embed URL *</label>
                <input
                  type="url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://www.youtube.com/embed/VIDEO_ID or https://www.youtube.com/watch?v=VIDEO_ID"
                />
                <p className="text-xs text-gray-500 mt-1">Paste the share/embed URL. Watch and embed URLs are both supported.</p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">Video file {editingId ? '(leave empty to keep current)' : '*'}</label>
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={handleInputChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:font-medium"
                />
                <p className="text-xs text-gray-500 mt-1">MP4 or WebM, max 150MB.</p>
              </div>
            )}

            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">Display order</label>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleInputChange}
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-primary text-white rounded-xl hover:opacity-90 font-medium font-poppins disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingId ? 'Update' : 'Add'}
              </button>
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 font-poppins">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {list.length === 0 && !showForm ? (
          <p className="text-gray-500 text-center py-8">No video testimonials yet. Add one above.</p>
        ) : (
          list.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl border border-accent/20 hover:shadow-sm transition-shadow"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide font-poppins mb-0.5">Title</p>
                <p className="font-medium text-gray-900 font-poppins truncate">
                  {item.title || item.title_ar || 'Untitled'}
                </p>
                <p className="text-sm text-gray-500 truncate mt-1">
                  {item.video_url ? 'YouTube / link' : item.video_file ? 'Uploaded video' : '—'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleEdit(item)}
                  className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Edit"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
