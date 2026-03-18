import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import { getApiUrl } from '../../config/api';
import Swal from 'sweetalert2';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  DocumentTextIcon,
  PhotoIcon,
  LanguageIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { translateText } from '../../utils/translate';

const BLOG_HERO_SECTION_KEY = 'blog_hero';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    button: '',
    link: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Blog page hero (banner) section
  const [heroData, setHeroData] = useState(null);
  const [heroForm, setHeroForm] = useState({ title: '', title_ar: '', subtitle: '', subtitle_ar: '', backgroundFile: null });
  const [heroFormPreview, setHeroFormPreview] = useState(null);
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroTranslatingField, setHeroTranslatingField] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    apiService.getHomepageSectionByKey(BLOG_HERO_SECTION_KEY).then((res) => {
      if (res.success && res.data) {
        const d = res.data;
        setHeroData(d);
        setHeroForm({
          title: d.title ?? '',
          title_ar: d.title_ar ?? '',
          subtitle: d.subtitle ?? '',
          subtitle_ar: d.subtitle_ar ?? '',
          backgroundFile: null
        });
        setHeroFormPreview(d.background_image_url || null);
      }
    }).catch(() => {});
  }, []);

  // Handle unsaved changes when leaving the page
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (showModal && (formData.title || formData.description || formData.button || formData.link || formData.image)) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [showModal, formData]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllBlogs();
      if (response.success) {
        setBlogs(response.data);
      } else {
        setError('Failed to fetch blogs');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Error loading blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBlog(null);
    setFormData({ title: '', description: '', button: '', link: '', image: null });
    setImagePreview(null);
    setShowModal(true);
  };

  const handleCloseModal = async () => {
    // Check if there are unsaved changes
    const hasChanges = formData.title || formData.description || formData.button || formData.link || formData.image;
    
    if (hasChanges) {
      const result = await Swal.fire({
        title: 'Unsaved Changes',
        text: 'You have unsaved changes. Are you sure you want to close without saving?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, close without saving',
        cancelButtonText: 'Keep editing',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        setShowModal(false);
        setFormData({ title: '', description: '', button: '', link: '', image: null });
        setImagePreview(null);
        setEditingBlog(null);
      }
    } else {
      setShowModal(false);
      setFormData({ title: '', description: '', button: '', link: '', image: null });
      setImagePreview(null);
      setEditingBlog(null);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      description: blog.description,
      button: blog.button || '',
      link: blog.link || '',
      image: null
    });
    setImagePreview(blog.img ? getImageUrl(blog.img) : null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const blogToDelete = blogs.find(blog => blog.id === id);
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${blogToDelete?.title}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const response = await apiService.deleteBlog(id);
        if (response.success) {
          setBlogs(blogs.filter(blog => blog.id !== id));
          
          await Swal.fire({
            title: 'Deleted!',
            text: 'Your blog post has been deleted successfully.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          await Swal.fire({
            title: 'Error!',
            text: 'Failed to delete blog post. Please try again.',
            icon: 'error'
          });
        }
      } catch (err) {
        console.error('Error deleting blog:', err);
        await Swal.fire({
          title: 'Error!',
          text: 'An error occurred while deleting the blog post.',
          icon: 'error'
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Show loading alert
    Swal.fire({
      title: editingBlog ? 'Updating blog...' : 'Creating blog...',
      text: 'Please wait while we process your request.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('button', formData.button);
      submitData.append('link', formData.link);
      
      // Only append image if a new file is selected
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      let response;
      if (editingBlog) {
        // Update existing blog
        response = await apiService.updateBlog(editingBlog.id, submitData);
        if (response.success) {
          setBlogs(blogs.map(blog => 
            blog.id === editingBlog.id 
              ? { ...blog, ...response.data }
              : blog
          ));
          setShowModal(false);
          
          await Swal.fire({
            title: 'Success!',
            text: 'Your blog post has been updated successfully.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          await Swal.fire({
            title: 'Error!',
            text: 'Failed to update blog post. Please try again.',
            icon: 'error'
          });
        }
      } else {
        // Create new blog
        response = await apiService.createBlog(submitData);
        if (response.success) {
          setBlogs([response.data, ...blogs]);
          setShowModal(false);
          
          await Swal.fire({
            title: 'Success!',
            text: 'Your blog post has been created successfully.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          await Swal.fire({
            title: 'Error!',
            text: 'Failed to create blog post. Please try again.',
            icon: 'error'
          });
        }
      }
    } catch (err) {
      console.error('Error saving blog:', err);
      await Swal.fire({
        title: 'Error!',
        text: 'An error occurred while saving the blog post.',
        icon: 'error'
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      image: null
    });
    setImagePreview(null);
  };

  const getImageUrl = (imgPath) => {
    if (imgPath.startsWith('http') || imgPath.startsWith('/assets')) {
      return imgPath;
    }
    return `${getApiUrl()}/uploads/blogs/${imgPath}`;
  };

  const heroBackgroundPreviewUrl = heroFormPreview || heroData?.background_image_url || null;

  const handleHeroFieldChange = (e) => {
    const { name, value } = e.target;
    setHeroForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleHeroTranslateToArabic = async (fieldName) => {
    const value = (heroForm[fieldName] || '').trim();
    if (!value) return;
    setHeroTranslatingField(fieldName);
    try {
      const translated = await translateText(value, 'ar', 'en');
      const arField = `${fieldName}_ar`;
      setHeroForm((prev) => ({ ...prev, [arField]: translated }));
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setHeroTranslatingField(null);
    }
  };

  const handleHeroBackgroundChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (heroForm.backgroundFile && heroFormPreview && heroFormPreview.startsWith('blob:')) {
        URL.revokeObjectURL(heroFormPreview);
      }
      setHeroForm((prev) => ({ ...prev, backgroundFile: file }));
      setHeroFormPreview(URL.createObjectURL(file));
    }
  };

  const saveHero = async (e) => {
    e.preventDefault();
    setHeroSaving(true);
    try {
      const form = new FormData();
      form.append('section_key', BLOG_HERO_SECTION_KEY);
      form.append('title', heroForm.title || '');
      form.append('title_ar', heroForm.title_ar || '');
      form.append('subtitle', heroForm.subtitle || '');
      form.append('subtitle_ar', heroForm.subtitle_ar || '');
      if (heroForm.backgroundFile) {
        form.append('background_image', heroForm.backgroundFile);
      } else if (heroData?.background_image_url) {
        form.append('existing_background_image_url', heroData.background_image_url);
      }
      const response = await apiService.updateHomepageSectionByKey(BLOG_HERO_SECTION_KEY, form);
      if (response.success) {
        setHeroData(response.data);
        setHeroForm((prev) => ({ ...prev, backgroundFile: null }));
        if (heroFormPreview && heroFormPreview.startsWith('blob:')) {
          URL.revokeObjectURL(heroFormPreview);
        }
        setHeroFormPreview(response.data?.background_image_url || null);
        await Swal.fire({ title: 'Saved', text: 'Blog page hero updated successfully.', icon: 'success', timer: 2000, showConfirmButton: false });
      } else {
        await Swal.fire({ title: 'Error', text: response.message || 'Failed to save hero.', icon: 'error' });
      }
    } catch (err) {
      console.error('Error saving blog hero:', err);
      await Swal.fire({ title: 'Error', text: err.message || 'Failed to save blog hero.', icon: 'error' });
    } finally {
      setHeroSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchBlogs}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-primary font-poppins">Blog Management</h2>
          <p className="text-gray-600 mt-1">Manage your blog posts and content</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-gradient-to-r from-primary to-blue-800 hover:from-blue-800 hover:to-primary text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Blog
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional p-6 border border-accent/20">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <DocumentTextIcon className="w-7 h-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Blogs</p>
              <p className="text-3xl font-bold text-primary font-poppins">{blogs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional p-6 border border-accent/20">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <ArrowTopRightOnSquareIcon className="w-7 h-7 text-white" />
              </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">With Links</p>
              <p className="text-3xl font-bold text-primary font-poppins">
                {blogs.filter(blog => blog.link).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional p-6 border border-accent/20">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
              <CalendarIcon className="w-7 h-7 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent</p>
              <p className="text-3xl font-bold text-primary font-poppins">
                {blogs.filter(blog => {
                  const blogDate = new Date(blog.created_at || Date.now());
                  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                  return blogDate > weekAgo;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blog page hero section */}
      <div className="bg-white rounded-2xl shadow-professional border border-accent/20 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-accent/20 flex items-center gap-2">
          <PhotoIcon className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-primary font-poppins">Blog Page Hero</h3>
        </div>
        <form onSubmit={saveHero} className="p-6">
          <p className="text-gray-600 text-sm mb-4">Edit the banner shown at the top of the blog page (/blog).</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (English)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  name="title"
                  value={heroForm.title}
                  onChange={handleHeroFieldChange}
                  className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g. Ideas That Matter"
                />
                <button
                  type="button"
                  onClick={() => handleHeroTranslateToArabic('title')}
                  disabled={heroTranslatingField === 'title' || !(heroForm.title || '').trim()}
                  className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Translate to Arabic"
                >
                  {heroTranslatingField === 'title' ? (
                    <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <LanguageIcon className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (Arabic)</label>
              <input
                type="text"
                name="title_ar"
                value={heroForm.title_ar}
                onChange={handleHeroFieldChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g. أفكار ذات أهمية"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle (English)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  name="subtitle"
                  value={heroForm.subtitle}
                  onChange={handleHeroFieldChange}
                  className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g. Dive into in-depth blogs, fresh perspectives..."
                />
                <button
                  type="button"
                  onClick={() => handleHeroTranslateToArabic('subtitle')}
                  disabled={heroTranslatingField === 'subtitle' || !(heroForm.subtitle || '').trim()}
                  className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Translate to Arabic"
                >
                  {heroTranslatingField === 'subtitle' ? (
                    <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <LanguageIcon className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle (Arabic)</label>
              <input
                type="text"
                name="subtitle_ar"
                value={heroForm.subtitle_ar}
                onChange={handleHeroFieldChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g. انغمس في مدونات معمقة ووجهات نظر جديدة..."
                dir="rtl"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
            {heroBackgroundPreviewUrl && (
              <div className="mb-3">
                <img
                  src={heroBackgroundPreviewUrl}
                  alt="Hero background preview"
                  className="w-full max-w-md h-32 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleHeroBackgroundChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Optional. Leave empty to keep current image. Max 5MB.</p>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={heroSaving}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {heroSaving ? 'Saving...' : 'Save Blog Hero'}
            </button>
          </div>
        </form>
      </div>

      {/* Blog List */}
      <div className="bg-white rounded-2xl shadow-professional border border-accent/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-accent/20">
          <h3 className="text-xl font-bold text-primary font-poppins">All Blog Posts</h3>
        </div>
        
        {blogs.length === 0 ? (
          <div className="p-8 text-center">
            <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No blog posts yet</h3>
            <p className="text-gray-500 mb-4">Create your first blog post to get started</p>
            <button
              onClick={handleCreate}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Blog Post
            </button>
          </div>
        ) : (
          <div className="divide-y divide-accent/20">
            {blogs.map((blog) => (
              <div key={blog.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Blog Image */}
                  {blog.img && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(blog.img)}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Blog Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-primary font-poppins mb-2 line-clamp-2">
                      {blog.title}
                    </h4>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {blog.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>ID: {blog.id}</span>
                      {blog.link && (
                        <span className="flex items-center gap-1">
                          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                          Has Link
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {blog.link && (
                      <a
                        href={blog.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-primary transition-colors"
                        title="View External Link"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </a>
                    )}
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Edit Blog"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      title="Delete Blog"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-primary font-poppins">
                {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter blog title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter blog description (optional)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  name="button"
                  value={formData.button}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter button text (e.g., 'Read More', 'Learn More')"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  External Link
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Image
                </label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: JPEG, JPG, PNG, GIF, WEBP (Max 5MB)
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  Recommended resolution: 1200x630px for optimal blog display
                </p>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingBlog ? 'Update Blog' : 'Create Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
