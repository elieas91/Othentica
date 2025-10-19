import React, { useEffect, useState } from 'react';
import apiService from '../../services/api';
import RichTextEditor from '../ui/RichTextEditor';
import Swal from 'sweetalert2';

const initialState = {
  banner_title: '',
  banner_subtitle: '',
  banner_description: '',
  banner_background_image_url: '',
  ceo_name: '',
  ceo_title: '',
  ceo_message: '',
  ceo_image_url: '',
  coo_name: '',
  coo_title: '',
  coo_message: '',
  coo_image_url: '',
  mission_title: 'Mission',
  mission_description: '',
  mission_image_url: '',
  vision_title: 'Vision',
  vision_description: '',
  vision_image_url: '',
  values_title: 'Values',
  values_description: '',
  values_image_url: ''
};

const AboutManager = () => {
  const [data, setData] = useState(initialState);
  const [initialData, setInitialData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('Banner');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Fetch per-section data
        const [bannerRes, leadershipRes, mvvRes] = await Promise.all([
          apiService.getAboutSectionByKey('banner').catch(() => null),
          apiService.getAboutSectionByKey('leadership').catch(() => null),
          apiService.getAboutSectionByKey('mvv').catch(() => null)
        ]);

        console.log('AboutManager - Loaded data:');
        console.log('Banner response:', bannerRes);
        console.log('Leadership response:', leadershipRes);
        console.log('MVV response:', mvvRes);

        const next = { ...initialState };

        // Banner mapping
        if (bannerRes?.success && bannerRes.data) {
          next.banner_title = bannerRes.data.title || '';
          next.banner_subtitle = bannerRes.data.subtitle || '';
          next.banner_description = bannerRes.data.description || '';
          next.banner_background_image_url = bannerRes.data.background_image_url || '';
        } else {
          // Fallback to homepage section if new endpoint not available
          const fallback = await apiService.getHomepageSectionByKey?.('about_banner');
          if (fallback?.success && fallback.data) {
            next.banner_title = fallback.data.title || '';
            next.banner_subtitle = '';
            next.banner_description = fallback.data.description || '';
            next.banner_background_image_url = fallback.data.background_image_url || '';
          }
        }

        // Leadership mapping (CEO/COO from JSON content)
        if (leadershipHasData(leadershipRes)) {
          const { ceo_name, ceo_title, ceo_message, ceo_image_url, coo_name, coo_title, coo_message, coo_image_url } = parseContent(leadershipRes.data.content);
          next.ceo_name = ceo_name || '';
          next.ceo_title = ceo_title || '';
          next.ceo_message = ceo_message || '';
          next.ceo_image_url = ceo_image_url || '';
          next.coo_name = coo_name || '';
          next.coo_title = coo_title || '';
          next.coo_message = coo_message || '';
          next.coo_image_url = coo_image_url || '';
        } else {
          // Fallback to homepage section 'leadership' if present (same section_key)
          const fallback = await apiService.getHomepageSectionByKey?.('leadership');
          if (fallback?.success && fallback.data) {
            const cont = parseContent(fallback.data.content);
            next.ceo_name = cont.ceo_name || '';
            next.ceo_title = cont.ceo_title || '';
            next.ceo_message = cont.ceo_message || '';
            next.ceo_image_url = cont.ceo_image_url || '';
            next.coo_name = cont.coo_name || '';
            next.coo_title = cont.coo_title || '';
            next.coo_message = cont.coo_message || '';
            next.coo_image_url = cont.coo_image_url || '';
          }
        }

        // MVV mapping
        if (mvvRes?.success && mvvRes.data) {
          const mvvContent = parseContent(mvvRes.data.content);
          next.mission_title = 'Mission';
          next.mission_description = mvvContent.mission_text || '';
          next.mission_image_url = mvvContent.mission_image_url || '';
          next.vision_title = 'Vision';
          next.vision_description = mvvContent.vision_text || '';
          next.vision_image_url = mvvContent.vision_image_url || '';
          next.values_title = 'Values';
          next.values_description = mvvContent.values_text || '';
          next.values_image_url = mvvContent.values_image_url || '';
        } else {
          const fallback = await apiService.getHomepageSectionByKey?.('mvv');
          if (fallback?.success && fallback.data) {
            const mvvContent = parseContent(fallback.data.content);
            next.mission_title = 'Mission';
            next.mission_description = mvvContent.mission_text || '';
            next.mission_image_url = mvvContent.mission_image_url || '';
            next.vision_title = 'Vision';
            next.vision_description = mvvContent.vision_text || '';
            next.vision_image_url = mvvContent.vision_image_url || '';
            next.values_title = 'Values';
            next.values_description = mvvContent.values_text || '';
            next.values_image_url = mvvContent.values_image_url || '';
          }
        }

        console.log('AboutManager - Final data state:', next);
        console.log('Mission image URL:', next.mission_image_url);
        console.log('Vision image URL:', next.vision_image_url);
        console.log('Values image URL:', next.values_image_url);
        
        setData(next);
        setInitialData({ ...next }); // Store initial data for comparison
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const parseContent = (content) => {
    if (!content) return {};
    try {
      return typeof content === 'string' ? JSON.parse(content) : content;
    } catch {
      return {};
    }
  };

  // Function to detect if there are any changes
  const hasChanges = () => {
    const keys = Object.keys(initialData);
    for (let key of keys) {
      if (data[key] !== initialData[key]) {
        return true;
      }
    }
    return false;
  };

  const leadershipHasData = (res) => res?.success && res.data && res.data.content;


  const handleFile = (field, file) => {
    setData(prev => ({ ...prev, [field]: file }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save Banner
      const bannerForm = new FormData();
      bannerForm.append('section_key', 'banner');
      bannerForm.append('title', data.banner_title || '');
      bannerForm.append('subtitle', data.banner_subtitle || '');
      bannerForm.append('description', data.banner_description || '');
      // Preserve existing background image URL if not uploading new one
      if (data.banner_background_image_url instanceof File) {
        bannerForm.append('background_image', data.banner_background_image_url);
      } else if (data.banner_background_image_url && typeof data.banner_background_image_url === 'string') {
        bannerForm.append('background_image_url', data.banner_background_image_url);
      }
      await apiService.upsertAboutSection(bannerForm);

      // Save Leadership (CEO/COO) as JSON content
      const leaderForm = new FormData();
      leaderForm.append('section_key', 'leadership');
      leaderForm.append('title', 'Leadership Messages');
      leaderForm.append('content', JSON.stringify({
        ceo_name: data.ceo_name || '',
        ceo_title: data.ceo_title || '',
        ceo_message: data.ceo_message || '',
        ceo_image_url: data.ceo_image_url instanceof File ? undefined : (data.ceo_image_url || ''),
        coo_name: data.coo_name || '',
        coo_title: data.coo_title || '',
        coo_message: data.coo_message || '',
        coo_image_url: data.coo_image_url instanceof File ? undefined : (data.coo_image_url || '')
      }));
      // Handle CEO image upload
      if (data.ceo_image_url instanceof File) {
        leaderForm.append('ceo_image', data.ceo_image_url);
      }
      // Handle COO image upload
      if (data.coo_image_url instanceof File) {
        leaderForm.append('coo_image', data.coo_image_url);
      }
      await apiService.upsertAboutSection(leaderForm);

      // Save MVV
      const mvvForm = new FormData();
      mvvForm.append('section_key', 'mvv');
      mvvForm.append('title', 'Mission • Vision • Values');
      mvvForm.append('content', JSON.stringify({
        mission_text: data.mission_description || '',
        vision_text: data.vision_description || '',
        values_text: data.values_description || '',
        mission_image_url: data.mission_image_url instanceof File ? undefined : (data.mission_image_url || ''),
        vision_image_url: data.vision_image_url instanceof File ? undefined : (data.vision_image_url || ''),
        values_image_url: data.values_image_url instanceof File ? undefined : (data.values_image_url || '')
      }));
      // Handle MVV image uploads
      if (data.mission_image_url instanceof File) {
        mvvForm.append('mission_image', data.mission_image_url);
      }
      if (data.vision_image_url instanceof File) {
        mvvForm.append('vision_image', data.vision_image_url);
      }
      if (data.values_image_url instanceof File) {
        mvvForm.append('values_image', data.values_image_url);
      }
      await apiService.upsertAboutSection(mvvForm);

      Swal.fire({
        title: 'Success!',
        text: 'About content saved successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      // Update initial data to current data after successful save
      setInitialData({ ...data });
    } finally {
      setSaving(false);
    }
  };


  if (loading) return <div className="p-6">Loading...</div>;

  const inputClass = "w-full p-3 border border-accent/30 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 font-montserrat text-sm";
  const labelCellClass = "align-top whitespace-nowrap text-sm font-medium text-primary font-poppins py-3 pr-4 w-48";
  const valueCellClass = "py-3";

  const renderImageInput = (field) => {
    const allowedTypes = ['image/jpeg','image/jpg','image/png','image/gif','image/webp'];
    const onChange = (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({ title: 'Invalid File', text: 'Please select JPEG, PNG, GIF, or WEBP.', icon: 'error' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({ title: 'File Too Large', text: 'Max size is 5MB.', icon: 'error' });
        return;
      }
      handleFile(field, file);
    };

    let previewUrl = (data[field] instanceof File) ? URL.createObjectURL(data[field]) : (typeof data[field] === 'string' && data[field] ? data[field] : null);
    
    console.log(`Image preview for ${field}:`, {
      field,
      value: data[field],
      isFile: data[field] instanceof File,
      isString: typeof data[field] === 'string',
      previewUrl
    });
    
    // Fix URL path if it's pointing to wrong directory
    if (previewUrl && typeof previewUrl === 'string' && previewUrl.includes('/uploads/homepage/')) {
      console.log(`Fixing URL path for ${field}:`, previewUrl, '->', previewUrl.replace('/uploads/homepage/', '/uploads/about/'));
      previewUrl = previewUrl.replace('/uploads/homepage/', '/uploads/about/');
    }

    return (
      <div className="space-y-3">
        <div className="relative">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={onChange}
            className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-orange-500"
            id={`file-input-${field}`}
          />
        </div>
        <p className="text-xs text-gray-500">Supported formats: JPEG, PNG, GIF, WEBP. Maximum size: 5MB</p>
        <p className="text-xs text-blue-600 font-medium">Recommended resolution: 1920x1080px for banner images, 400x400px for profile images</p>
        {previewUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <div className="relative inline-block">
              <img 
                src={previewUrl} 
                alt={`${field} preview`} 
                className="w-32 h-32 object-cover rounded-xl border border-accent/30 shadow-sm" 
                onError={(e) => {
                  console.error('Image preview error:', e);
                  e.target.style.display = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setData(prev => ({ ...prev, [field]: '' }));
                  // Clear the file input
                  const fileInput = document.getElementById(`file-input-${field}`);
                  if (fileInput) fileInput.value = '';
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary font-poppins">About Page Content</h2>
        <p className="text-gray-600">Edit About page banner, founders messages, and MVV</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {['Banner','CEO','COO','MVV'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg border text-sm font-poppins transition-colors ${
                activeTab === tab
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-primary border-accent/30 hover:border-primary/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Banner' && (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-primary to-blue-800 px-5 py-3">
            <h3 className="text-lg font-semibold text-white font-poppins">Banner</h3>
          </div>
          <div className="p-5">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className={labelCellClass}>Title</td>
                  <td className={valueCellClass}>
                    <input className={inputClass} value={data.banner_title} onChange={(e) => setData({ ...data, banner_title: e.target.value })} />
                  </td>
                </tr>
                <tr>
                  <td className={labelCellClass}>Subtitle</td>
                  <td className={valueCellClass}>
                    <input className={inputClass} value={data.banner_subtitle} onChange={(e) => setData({ ...data, banner_subtitle: e.target.value })} />
                  </td>
                </tr>
                <tr>
                  <td className={labelCellClass}>Description</td>
                  <td className={valueCellClass}>
                    <textarea rows={3} className={inputClass} value={data.banner_description} onChange={(e) => setData({ ...data, banner_description: e.target.value })} />
                  </td>
                </tr>
                <tr>
                  <td className={labelCellClass}>Background Image</td>
                  <td className={valueCellClass}>{renderImageInput('banner_background_image_url')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'CEO' && (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-primary to-blue-800 px-5 py-3">
            <h3 className="text-lg font-semibold text-white font-poppins">CEO</h3>
          </div>
          <div className="p-5">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className={labelCellClass}>Name</td>
                  <td className={valueCellClass}><input className={inputClass} value={data.ceo_name} onChange={(e) => setData({ ...data, ceo_name: e.target.value })} /></td>
                </tr>
                <tr>
                  <td className={labelCellClass}>Title</td>
                  <td className={valueCellClass}>
                    <RichTextEditor
                      value={data.ceo_title}
                      onChange={(html) => setData({ ...data, ceo_title: html })}
                      placeholder="Enter CEO title"
                      height="100px"
                    />
                  </td>
                </tr>
                <tr>
                  <td className={labelCellClass}></td>
                  <td className={valueCellClass}><div className="h-4"></div></td>
                </tr>
                <tr>
                  <td className={labelCellClass}>Message</td>
                  <td className={valueCellClass}>
                    <RichTextEditor
                      value={data.ceo_message}
                      onChange={(html) => setData({ ...data, ceo_message: html })}
                      placeholder="Enter CEO message"
                      height="200px"
                    />
                  </td>
                </tr>
                <tr>
                  <td className={labelCellClass}></td>
                  <td className={valueCellClass}><div className="h-4"></div></td>
                </tr>
                <tr>
                  <td className={labelCellClass}>Image</td>
                  <td className={valueCellClass}>{renderImageInput('ceo_image_url')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'COO' && (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-primary to-blue-800 px-5 py-3">
            <h3 className="text-lg font-semibold text-white font-poppins">COO</h3>
          </div>
          <div className="p-5">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className={labelCellClass}>Name</td>
                  <td className={valueCellClass}><input className={inputClass} value={data.coo_name} onChange={(e) => setData({ ...data, coo_name: e.target.value })} /></td>
                </tr>
                <tr>
                  <td className={labelCellClass}>Title</td>
                  <td className={valueCellClass}>
                    <RichTextEditor
                      value={data.coo_title}
                      onChange={(html) => setData({ ...data, coo_title: html })}
                      placeholder="Enter COO title"
                      height="100px"
                    />
                  </td>
                </tr>
                <tr>
                  <td className={labelCellClass}></td>
                  <td className={valueCellClass}><div className="h-4"></div></td>
                </tr>
                <tr>
                  <td className={labelCellClass}>Message</td>
                  <td className={valueCellClass}>
                    <RichTextEditor
                      value={data.coo_message}
                      onChange={(html) => setData({ ...data, coo_message: html })}
                      placeholder="Enter COO message"
                      height="200px"
                    />
                  </td>
                </tr>
                <tr>
                  <td className={labelCellClass}></td>
                  <td className={valueCellClass}><div className="h-4"></div></td>
                </tr>
                <tr>
                  <td className={labelCellClass}>Image</td>
                  <td className={valueCellClass}>{renderImageInput('coo_image_url')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'MVV' && (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-primary to-blue-800 px-5 py-3">
            <h3 className="text-lg font-semibold text-white font-poppins">Mission, Vision, Values</h3>
          </div>
          <div className="p-5">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className={labelCellClass}>Mission Title</td>
                  <td className={valueCellClass}><input className={inputClass} value={data.mission_title} onChange={(e) => setData({ ...data, mission_title: e.target.value })} /></td>
                </tr>
                <tr>
                  <td className={labelCellClass}>Mission Description</td>
                  <td className={valueCellClass}>
                    <RichTextEditor
                      value={data.mission_description}
                      onChange={(html) => setData({ ...data, mission_description: html })}
                      placeholder="Enter mission description"
                      height="200px"
                    />
                  </td>
                </tr>
                <tr>
                  <td className={labelCellClass}></td>
                  <td className={valueCellClass}><div className="h-4"></div></td>
                </tr>
                <tr>
                  <td className={labelCellClass}>Mission Image</td>
                  <td className={valueCellClass}>{renderImageInput('mission_image_url')}</td>
                </tr>
                <tr>
                  <td className={labelCellClass}>Vision Title</td>
                  <td className={valueCellClass}><input className={inputClass} value={data.vision_title} onChange={(e) => setData({ ...data, vision_title: e.target.value })} /></td>
                </tr>
                <tr>
                  <td className={labelCellClass}>Vision Description</td>
                  <td className={valueCellClass}>
                    <RichTextEditor
                      value={data.vision_description}
                      onChange={(html) => setData({ ...data, vision_description: html })}
                      placeholder="Enter vision description"
                      height="200px"
                    />
                  </td>
                </tr>
                <tr>
                  <td className={labelCellClass}></td>
                  <td className={valueCellClass}><div className="h-4"></div></td>
                </tr>
                <tr>
                  <td className={labelCellClass}>Vision Image</td>
                  <td className={valueCellClass}>{renderImageInput('vision_image_url')}</td>
                </tr>
                <tr>
                  <td className={labelCellClass}>Values Title</td>
                  <td className={valueCellClass}><input className={inputClass} value={data.values_title} onChange={(e) => setData({ ...data, values_title: e.target.value })} /></td>
                </tr>
                <tr>
                  <td className={labelCellClass}>Values Description</td>
                  <td className={valueCellClass}>
                    <RichTextEditor
                      value={data.values_description}
                      onChange={(html) => setData({ ...data, values_description: html })}
                      placeholder="Enter values description"
                      height="200px"
                    />
                  </td>
                </tr>
                <tr>
                  <td className={labelCellClass}></td>
                  <td className={valueCellClass}><div className="h-4"></div></td>
                </tr>
                <tr>
                  <td className={labelCellClass}>Values Image</td>
                  <td className={valueCellClass}>{renderImageInput('values_image_url')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button 
          onClick={handleSave} 
          disabled={saving || !hasChanges()} 
          className={`px-6 py-3 rounded-xl transition-all duration-300 shadow-lg font-medium font-poppins ${
            saving || !hasChanges()
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary to-blue-800 hover:from-blue-800 hover:to-primary text-white hover:shadow-xl'
          }`}
        >
          {saving ? 'Saving...' : hasChanges() ? 'Save Changes' : 'No Changes'}
        </button>
      </div>
    </div>
  );
};

export default AboutManager;


