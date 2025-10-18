import React, { useState, useEffect, useCallback } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import apiService from '../../services/api';
import MobileShowcaseImagesManager from './MobileShowcaseImagesManager';
import MobileShowcaseCardManager from './MobileShowcaseCardManager';
import SecurityCardsManager from './SecurityCardsManager';
import ServicesCardsManager from './ServicesCardsManager';
import ClientsManager from './ClientsManager';
import FeaturesAndBenefitsManager from './FeaturesAndBenefitsManager';
import RichTextEditor from '../ui/RichTextEditor';

const HomepageSectionsManager = ({ activeSection: propActiveSection, onSectionChange }) => {
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

  const [activeSection, setActiveSection] = useState(propActiveSection || 'hero');
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [stats, setStats] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(null);
  const [showMobileImagesManager, setShowMobileImagesManager] = useState(false);
  const [showMobileShowcaseCardManager, setShowMobileShowcaseCardManager] = useState(false);
  const [showSecurityCardsManager, setShowSecurityCardsManager] = useState(false);
  const [showServicesCardsManager, setShowServicesCardsManager] = useState(false);
  const [showClientsManager, setShowClientsManager] = useState(false);
  const [showFeaturesAndBenefitsManager, setShowFeaturesAndBenefitsManager] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);

  // Function to check if form data has changed
  const hasFormDataChanged = () => {
    if (!originalFormData || !editingItem) return false;
    
    // Compare all relevant fields except file inputs
    const fieldsToCompare = [
      'title', 'subtitle', 'description', 'content', 'button_text', 
      'button_link', 'button_variant'
    ];
    
    for (const field of fieldsToCompare) {
      if (formData[field] !== originalFormData[field]) {
        return true;
      }
    }
    
    // Check if new files have been selected
    if (formData.image && formData.image instanceof File) {
      return true;
    }
    if (formData.background_image && formData.background_image instanceof File) {
      return true;
    }
    
    return false;
  };

  // Define all homepage sections with their metadata and field requirements
  const sectionConfigs = [
    { 
      key: 'hero', 
      label: 'Hero Section', 
      description: 'Main banner with call-to-action',
      hasButtons: true,
      hasMainImage: false,
      hasBackgroundImage: true,
      hasSubtitle: false,
      usesDescription: true
    },
    { 
      key: 'philosophy', 
      label: 'Philosophy', 
      description: 'What is Othentica section',
      hasButtons: true,
      hasMainImage: true,
      hasBackgroundImage: false,
      hasSubtitle: false,
      usesDescription: true
    },
    { 
      key: 'services', 
      label: 'Services', 
      description: 'Our Solutions section',
      hasButtons: false,
      hasMainImage: false,
      hasBackgroundImage: false,
      hasSubtitle: false,
      usesDescription: true
    },
    { 
      key: 'clients', 
      label: 'Clients', 
      description: 'Our Clients section',
      hasButtons: false,
      hasMainImage: false,
      hasBackgroundImage: false,
      hasSubtitle: false,
      usesDescription: true
    },
    { 
      key: 'features', 
      label: 'Features', 
      description: 'App Features & Benefits section',
      hasButtons: false,
      hasMainImage: false,
      hasBackgroundImage: false,
      hasSubtitle: false,
      usesDescription: false
    },
    { 
      key: 'security', 
      label: 'Security', 
      description: 'Enterprise Security section',
      hasButtons: false,
      hasMainImage: false,
      hasBackgroundImage: false,
      hasSubtitle: false,
      usesDescription: false
    },
    { 
      key: 'mobile_showcase', 
      label: 'Mobile Showcase', 
      description: 'Mobile Experience section',
      hasButtons: false,
      hasMainImage: false,
      hasBackgroundImage: false,
      hasSubtitle: false,
      usesDescription: true
    }
  ];

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  // Helper function to get current section configuration
  const getCurrentSectionConfig = () => {
    return sectionConfigs.find(config => config.key === activeSection) || sectionConfigs[0];
  };

  const fetchSections = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getHomepageSections();
      if (response.success) {
        setSections(response.data);
        // Calculate stats
        const statsObj = {
          total: response.data.length
        };
        setStats(statsObj);
      } else {
        await showErrorAlert('Error', response.message || 'Failed to load homepage sections');
      }
    } catch (err) {
      await showErrorAlert('Error', 'Failed to load homepage sections: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load sections on component mount
  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  // Sync with parent component
  useEffect(() => {
    if (propActiveSection && propActiveSection !== activeSection) {
      setActiveSection(propActiveSection);
    }
  }, [propActiveSection, activeSection]);

  const getCurrentSectionData = () => {
    return sections.find(section => section.section_key === activeSection);
  };

  const handleCreate = async (data) => {
    try {
      setIsLoading(true);
      
      // Safety check for activeSection
      if (!activeSection) {
        throw new Error('No active section selected');
      }
      
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('section_key', activeSection);
      submitData.append('title', data.title || '');
      submitData.append('subtitle', data.subtitle || '');
      submitData.append('description', data.description || '');
      // Philosophy and services no longer use JSON content; send content only for other sections
      if (activeSection !== 'philosophy' && activeSection !== 'services') {
        submitData.append('content', data.content || '');
      }
      submitData.append('button_text', data.button_text || '');
      submitData.append('button_link', data.button_link || '');
      submitData.append('button_variant', data.button_variant || 'primary');
      
      // Debug logging
      console.log('Client - activeSection:', activeSection);
      console.log('Client - formData:', data);
      console.log('Client - FormData entries:');
      for (let [key, value] of submitData.entries()) {
        console.log(key, ':', value);
      }
      
      // Only append images if files are selected
      if (data.image) {
        submitData.append('image', data.image);
      }
      if (data.background_image) {
        submitData.append('background_image', data.background_image);
      }
      
      const response = await apiService.upsertHomepageSection(submitData);
      
      if (response.success) {
        await showSuccessAlert('Success!', 'Section created successfully!');
        await fetchSections();
        setShowForm(false);
        setFormData({});
        setImagePreview(null);
        setBackgroundImagePreview(null);
      } else {
        await showErrorAlert('Error', response.message || 'Failed to create section');
      }
    } catch (err) {
      await showErrorAlert('Error', 'Failed to create section: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      setIsLoading(true);
      
      // Safety check for activeSection
      if (!activeSection) {
        throw new Error('No active section selected');
      }
      
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('section_key', activeSection);
      submitData.append('title', data.title || '');
      submitData.append('subtitle', data.subtitle || '');
      submitData.append('description', data.description || '');
      // Philosophy and services no longer use JSON content; send content only for other sections
      if (activeSection !== 'philosophy' && activeSection !== 'services') {
        submitData.append('content', data.content || '');
      }
      submitData.append('button_text', data.button_text || '');
      submitData.append('button_link', data.button_link || '');
      submitData.append('button_variant', data.button_variant || 'primary');
      
      // Always send existing image URLs to preserve them when no new files are uploaded
      if (data.existing_image_url) {
        submitData.append('existing_image_url', data.existing_image_url);
      }
      if (data.existing_background_image_url) {
        submitData.append('existing_background_image_url', data.existing_background_image_url);
      }
      
      // Only append images if files are selected (new files)
      if (data.image && data.image instanceof File) {
        submitData.append('image', data.image);
      }
      if (data.background_image && data.background_image instanceof File) {
        submitData.append('background_image', data.background_image);
      }
      
      const response = await apiService.upsertHomepageSection(submitData);
      
      if (response.success) {
        await showSuccessAlert('Success!', 'Section updated successfully!');
        await fetchSections();
        setEditingItem(null);
        setFormData({});
        setImagePreview(null);
        setBackgroundImagePreview(null);
        setShowForm(false);
      } else {
        await showErrorAlert('Error', response.message || 'Failed to update section');
      }
    } catch (err) {
      await showErrorAlert('Error', 'Failed to update section: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = await showConfirmAlert(
      'Are you sure?', 
      "You won't be able to revert this!"
    );

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        const response = await apiService.deleteHomepageSection(activeSection);
        
        if (response.success) {
          await showSuccessAlert('Deleted!', 'The section has been deleted successfully.');
          await fetchSections();
        } else {
          await showErrorAlert('Error', response.message || 'Failed to delete section');
        }
      } catch (err) {
        await showErrorAlert('Error', 'Failed to delete section: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = () => {
    const currentSection = getCurrentSectionData();
    if (currentSection) {
      setEditingItem(currentSection);
      const initialFormData = {
        title: currentSection.title || '',
        subtitle: currentSection.subtitle || '',
        description: currentSection.description || '',
        // Philosophy and services no longer use JSON content
        content: (activeSection === 'philosophy' || activeSection === 'services') ? '' : (currentSection.content || ''),
        image: null, // Reset file input
        background_image: null, // Reset file input
        button_text: currentSection.button_text || '',
        button_link: currentSection.button_link || '',
        button_variant: currentSection.button_variant || 'primary',
        // Preserve existing image URLs for server-side processing
        existing_image_url: currentSection.image_url || null,
        existing_background_image_url: currentSection.background_image_url || null
      };
      
      setFormData(initialFormData);
      setOriginalFormData(initialFormData); // Store original data for comparison
      
      // Set image previews from existing image URLs
      setImagePreview(currentSection.image_url || null);
      setBackgroundImagePreview(currentSection.background_image_url || null);
      setShowForm(true);
    }
  };

  const handleView = (section) => {
    setViewingItem(section);
  };

  const openImageModal = (imageUrl) => {
    console.log('Opening image modal with URL:', imageUrl);
    setModalImageUrl(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setModalImageUrl(null);
  };

  // Debug modal state changes
  useEffect(() => {
    console.log('Modal state changed:', { showImageModal, modalImageUrl });
  }, [showImageModal, modalImageUrl]);

  // Handle ESC key to close modals
  useEffect(() => {
    const handleEscKey = (event) => {
      console.log('HomepageSectionsManager - ESC key pressed, current modals:', { showForm, viewingItem, showImageModal });
      if (event.key === 'Escape') {
        if (showImageModal) {
          console.log('HomepageSectionsManager - Closing image modal');
          closeImageModal();
        } else if (viewingItem) {
          console.log('HomepageSectionsManager - Closing view modal');
          closeModal();
        } else if (showForm) {
          console.log('HomepageSectionsManager - Closing form modal');
          closeModal();
        }
      }
    };

    if (showImageModal || viewingItem || showForm) {
      console.log('HomepageSectionsManager - Adding ESC key listener for modals:', { showForm, viewingItem, showImageModal });
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      console.log('HomepageSectionsManager - Removing ESC key listener - no modals open');
      document.body.style.overflow = 'unset'; // Restore scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset'; // Restore scrolling
    };
  }, [showImageModal, viewingItem, showForm]);

  

  const closeModal = () => {
    setShowForm(false);
    setEditingItem(null);
    setViewingItem(null);
    setImagePreview(null);
    setBackgroundImagePreview(null);
    setOriginalFormData(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
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
    } else if (name === 'background_image' && files && files[0]) {
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
      setBackgroundImagePreview(previewUrl);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };



  // Parse JSON content safely
  const parseJsonContent = (content) => {
    if (!content) return {};
    try {
      return typeof content === 'string' ? JSON.parse(content) : content;
    } catch (e) {
      console.warn('Failed to parse JSON content:', e);
      return {};
    }
  };

  // Render dynamic content fields based on section type
  const renderDynamicContentFields = () => {
    const currentSection = getCurrentSectionData();
    const jsonContent = parseJsonContent(currentSection?.content || formData.content);
    
    // Define field configurations for each section type
    const fieldConfigs = {
      hero: [
        {
          key: 'primaryButton',
          label: 'Primary Button',
          type: 'object',
          fields: [
            { key: 'text', label: 'Button Text', type: 'text' },
            { key: 'link', label: 'Button Link', type: 'text' },
            { key: 'variant', label: 'Button Variant', type: 'select', options: ['primary', 'secondary', 'accent'] }
          ]
        },
        {
          key: 'secondaryButton',
          label: 'Secondary Button',
          type: 'object',
          fields: [
            { key: 'text', label: 'Button Text', type: 'text' },
            { key: 'link', label: 'Button Link', type: 'text' },
            { key: 'variant', label: 'Button Variant', type: 'select', options: ['primary', 'secondary', 'accent'] }
          ]
        }
      ],
      philosophy: [],
      features: [
        {
          key: 'introText',
          label: 'Introduction Text',
          type: 'textarea',
          rows: 3
        },
        {
          key: 'highlightText',
          label: 'Highlight Text',
          type: 'text'
        }
      ],
      security: [
        {
          key: 'introText',
          label: 'Introduction Text',
          type: 'textarea',
          rows: 3
        },
        {
          key: 'ctaText',
          label: 'Call to Action Text',
          type: 'text'
        },
        {
          key: 'ctaLink',
          label: 'Call to Action Link',
          type: 'text'
        }
      ],
    };

    const fields = fieldConfigs[activeSection] || [];
    
    if (fields.length === 0) {
      return null; // Don't show anything if no additional fields
    }

    return (
      <div>
        <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
          Additional Content
        </label>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="bg-gradient-to-br from-accent/10 to-accent/5 p-4 rounded-xl border border-accent/20">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">{field.label}</h4>
              {field.type === 'object' ? (
                <div className="space-y-3">
                  {field.fields.map((subField) => (
                    <div key={subField.key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {subField.label}
                      </label>
                      {subField.type === 'select' ? (
                        <select
                          value={jsonContent[field.key]?.[subField.key] || ''}
                          onChange={(e) => handleJsonFieldChange(field.key, subField.key, e.target.value)}
                          className="w-full px-3 py-2 border border-accent/30 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-sm"
                        >
                          <option value="">Select {subField.label}</option>
                          {subField.options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={subField.type}
                          value={jsonContent[field.key]?.[subField.key] || ''}
                          onChange={(e) => handleJsonFieldChange(field.key, subField.key, e.target.value)}
                          className="w-full px-3 py-2 border border-accent/30 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-sm"
                          placeholder={`Enter ${subField.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={jsonContent[field.key] || ''}
                  onChange={(e) => handleJsonFieldChange(field.key, null, e.target.value)}
                  rows={field.rows || 3}
                  className="w-full px-3 py-2 border border-accent/30 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-sm resize-none"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              ) : (
                <input
                  type={field.type}
                  value={jsonContent[field.key] || ''}
                  onChange={(e) => handleJsonFieldChange(field.key, null, e.target.value)}
                  className="w-full px-3 py-2 border border-accent/30 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-sm"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Handle changes to JSON fields
  const handleJsonFieldChange = (parentKey, childKey, value) => {
    const currentContent = parseJsonContent(formData.content);
    
    if (childKey) {
      // Update nested object field
      setFormData(prev => ({
        ...prev,
        content: JSON.stringify({
          ...currentContent,
          [parentKey]: {
            ...currentContent[parentKey],
            [childKey]: value
          }
        })
      }));
    } else {
      // Update direct field
      setFormData(prev => ({
        ...prev,
        content: JSON.stringify({
          ...currentContent,
          [parentKey]: value
        })
      }));
    }
  };

  // Render content fields for view modal
  const renderViewContentFields = (content) => {
    const jsonContent = parseJsonContent(content);
    
    if (!jsonContent || Object.keys(jsonContent).length === 0) {
      return (
        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
          No additional content available.
        </div>
      );
    }

    return Object.entries(jsonContent).map(([key, value]) => (
      <div key={key} className="bg-gray-50 p-4 rounded-lg border border-accent/20">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 capitalize">
          {key.replace(/([A-Z])/g, ' $1').trim()}
        </h4>
        {typeof value === 'object' && value !== null ? (
          <div className="space-y-2">
            {Object.entries(value).map(([subKey, subValue]) => (
              <div key={subKey} className="flex items-center">
                <span className="text-xs font-medium text-gray-600 w-24 capitalize">
                  {subKey.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="text-sm text-gray-800 flex-1">
                  {subValue || <span className="text-gray-400 italic">Not set</span>}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-800">
            {value || <span className="text-gray-400 italic">Not set</span>}
          </p>
        )}
      </div>
    ));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl font-bold text-primary font-poppins mb-2">
            Homepage Sections Management
          </h3>
          <p className="text-gray-600">Manage and organize homepage sections</p>
        </div>
      </div>

      {/* Stats and Filters */}
      <div className="mb-8">
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="bg-gradient-to-br from-white to-accent/10 rounded-xl p-4 border border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sections</p>
                <p className="text-2xl font-bold text-primary">{stats.total || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2">
          {sectionConfigs.map(section => (
            <button
              key={section.key}
              onClick={() => handleSectionChange(section.key)}
              className={`px-4 py-2.5 rounded-lg transition-all duration-300 ${
                activeSection === section.key 
                  ? 'bg-gradient-to-r from-primary to-blue-800 text-white shadow-md' 
                  : 'bg-white/90 backdrop-blur-sm border border-accent/20 text-gray-700 hover:bg-accent/10 hover:shadow-sm'
              }`}
            >
              <div className="text-left">
                <div className="font-medium text-sm font-poppins">{section.label}</div>
                <div className="text-xs opacity-75">{section.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Visual separator between tabs and content */}
        <div className="mt-4 mb-6">
          <div className="h-px w-full bg-accent/30"></div>
        </div>

        {/* Mobile Showcase Management Buttons */}
        {activeSection === 'mobile_showcase' && (
          <div className="mt-4 space-y-4">
            <div>
              <button
                onClick={() => setShowMobileImagesManager(true)}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins"
              >
                <PhotoIcon className="w-5 h-5" />
                Manage Mobile Showcase Images
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Add, edit, and organize multiple images for the mobile showcase section
              </p>
            </div>
            
            <div>
              <button
                onClick={() => setShowMobileShowcaseCardManager(true)}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl hover:from-green-700 hover:to-green-900 transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins"
              >
                <PhotoIcon className="w-5 h-5" />
                Manage Mobile Showcase Card
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Add, edit, and manage the download card with app store links and descriptions
              </p>
            </div>
          </div>
        )}

        {/* Security Cards Management Button */}
        {activeSection === 'security' && (
          <div className="mt-4">
            <button
              onClick={() => setShowSecurityCardsManager(true)}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-xl hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins"
            >
              <PhotoIcon className="w-5 h-5" />
              Manage Security Cards
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Add, edit, and organize multiple security feature cards with images and descriptions
            </p>
          </div>
        )}

        {/* Services Cards Management Button */}
        {activeSection === 'services' && (
          <div className="mt-4">
            <button
              onClick={() => setShowServicesCardsManager(true)}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins"
            >
              <PhotoIcon className="w-5 h-5" />
              Manage Services Cards
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Add, edit, and organize multiple service cards with images, descriptions, and modal content
            </p>
          </div>
        )}

        {/* Clients Management Button */}
        {activeSection === 'clients' && (
          <div className="mt-4">
            <button
              onClick={() => setShowClientsManager(true)}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-900 transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins"
            >
              <PhotoIcon className="w-5 h-5" />
              Manage Clients
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Add, edit, and organize client logos with website links and company information
            </p>
          </div>
        )}

        {/* Features & Benefits Management Button */}
        {activeSection === 'features' && (
          <div className="mt-4">
            <button
              onClick={() => setShowFeaturesAndBenefitsManager(true)}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-900 transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins"
            >
              <PhotoIcon className="w-5 h-5" />
              Manage Features & Benefits
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Add, edit, and organize app features and benefits with categories and descriptions
            </p>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
          <span className="ml-2 text-gray-600">Loading sections...</span>
        </div>
      )}

      {/* Current Section Content */}
      {!isLoading && (
        <div className="space-y-6">
          {/* Current Section Data */}
          {getCurrentSectionData() ? (
            <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional border border-accent/20 hover:shadow-xl-professional transition-all duration-300 group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {getCurrentSectionData().section_key}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-primary font-poppins mb-2">
                      {getCurrentSectionData().title || 'Untitled Section'}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {getCurrentSectionData().description || 'No description provided'}
                    </p>
                  </div>
                </div>

                {/* Image Previews */}
                <div className="mb-4">
                  <div className={`grid gap-4 ${getCurrentSectionConfig().hasMainImage && getCurrentSectionConfig().hasBackgroundImage ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                    {/* Main Image - Only show for sections that use main images */}
                    {getCurrentSectionConfig().hasMainImage && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2">Main Image</label>
                        {getCurrentSectionData().image_url ? (
                          <div className="relative">
                            <img
                              src={getCurrentSectionData().image_url}
                              alt="Section image"
                              className="w-full h-32 object-cover rounded-lg border border-accent/30 shadow-sm"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-32 bg-gray-100 rounded-lg border border-accent/30 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">No image</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Background Image - Only show for sections that use background images */}
                    {getCurrentSectionConfig().hasBackgroundImage && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2">
                          {activeSection === 'hero' ? 'Hero Background Image' : 'Background Image'}
                        </label>
                        {getCurrentSectionData().background_image_url ? (
                          <div 
                            className="relative cursor-pointer group"
                            onClick={() => openImageModal(getCurrentSectionData().background_image_url)}
                          >
                            <img
                              src={getCurrentSectionData().background_image_url}
                              alt="Background image"
                              className="w-full h-32 object-cover rounded-lg border border-accent/30 shadow-sm group-hover:opacity-90 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                Click to enlarge
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-32 bg-gray-100 rounded-lg border border-accent/30 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">No background image</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-accent/20">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(getCurrentSectionData())}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="View"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleEdit}
                      className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <ClockIcon className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No section data found</h3>
              <p className="text-gray-500 mb-4">
                No data exists for the "{sectionConfigs.find(s => s.key === activeSection)?.label}" section.
              </p>
            </div>
          )}
        </div>
      )}


      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-xl-professional border border-accent/20 p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-primary font-poppins">
                  {editingItem ? 'Edit Section' : 'Add New Section'}
                </h3>
                <p className="text-gray-600 mt-1">
                  {editingItem ? 'Update section details' : 'Create a new homepage section'}
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
              if (editingItem) {
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
                    onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                    className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                    placeholder="Enter section title"
                    required
                  />
                </div>

                {getCurrentSectionConfig().hasSubtitle && (
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                      className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                      placeholder="Enter section subtitle"
                    />
                  </div>
                )}
              </div>

              {getCurrentSectionConfig().usesDescription && (
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Description
                  </label>
                  <div className="rich-text-container">
                    <RichTextEditor
                      value={formData.description || ''}
                      onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                      placeholder="Enter section description... (Use the toolbar for formatting)"
                      height="200px"
                    />
                  </div>
                </div>
              )}

              {/* Separator */}
              <div className="border-t border-accent/20 my-6"></div>

              {/* Image Upload Section */}
              <div className={`grid gap-6 ${getCurrentSectionConfig().hasMainImage && getCurrentSectionConfig().hasBackgroundImage ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {/* Main Image Upload - Only show for sections that use main images */}
                {getCurrentSectionConfig().hasMainImage && (
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                      Main Image Upload
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          name="image"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={handleInputChange}
                          className="hidden"
                          id="main-image-upload"
                        />
                        <label
                          htmlFor="main-image-upload"
                          className="flex items-center gap-2 px-4 py-3 bg-secondary text-white rounded-xl hover:bg-orange-500 transition-all duration-200 cursor-pointer font-medium text-sm"
                        >
                          <PhotoIcon className="w-4 h-4" />
                          Choose File
                        </label>
                        <span className="text-sm text-gray-500">
                          {formData.image ? formData.image.name : 'No file chosen'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Supported formats: JPEG, PNG, GIF, WEBP. Maximum size: 5MB
                      </p>
                      <p className="text-xs text-blue-600 font-medium">
                        Recommended resolution: 1920x1080px for background images, 800x600px for main images
                      </p>
                      
                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-primary mb-2">Preview:</p>
                          <div className="relative inline-block">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-xl border border-accent/30 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview(null);
                                setFormData(prev => ({ ...prev, image: null }));
                                // Reset file input
                                const fileInput = document.getElementById('main-image-upload');
                                if (fileInput) fileInput.value = '';
                              }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Background Image Upload - Only show for sections that use background images */}
                {getCurrentSectionConfig().hasBackgroundImage && (
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                      {activeSection === 'hero' ? 'Hero Background Image Upload' : 'Background Image Upload'}
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          name="background_image"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={handleInputChange}
                          className="hidden"
                          id="background-image-upload"
                        />
                        <label
                          htmlFor="background-image-upload"
                          className="flex items-center gap-2 px-4 py-3 bg-secondary text-white rounded-xl hover:bg-orange-500 transition-all duration-200 cursor-pointer font-medium text-sm"
                        >
                          <PhotoIcon className="w-4 h-4" />
                          Choose File
                        </label>
                        <span className="text-sm text-gray-500">
                          {formData.background_image ? formData.background_image.name : 'No file chosen'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Supported formats: JPEG, PNG, GIF, WEBP. Maximum size: 5MB
                      </p>
                      <p className="text-xs text-blue-600 font-medium">
                        Recommended resolution: 1920x1080px for background images, 800x600px for main images
                      </p>

                      {/* Background Image Preview */}
                      {backgroundImagePreview && (
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-primary mb-2">Preview:</p>
                          <div className="relative inline-block group">
                            <div
                              className="cursor-pointer"
                              onClick={() => openImageModal(backgroundImagePreview)}
                            >
                              <img
                                src={backgroundImagePreview}
                                alt="Background Preview"
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
                                setBackgroundImagePreview(null);
                                setFormData(prev => ({ ...prev, background_image: null }));
                                // Reset file input
                                const fileInput = document.getElementById('background-image-upload');
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
                )}
              </div>

              {/* Button Fields - Only show for sections that use buttons */}
              {(activeSection === 'philosophy') && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                      Button Text
                    </label>
                    <input
                      type="text"
                      name="button_text"
                      value={formData.button_text || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                      className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                      placeholder="Enter button text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                      Button Link
                    </label>
                    <input
                      type="text"
                      name="button_link"
                      value={formData.button_link || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                      className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                      placeholder="Enter button link"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                      Button Variant
                    </label>
                    <select
                      name="button_variant"
                      value={formData.button_variant || 'primary'}
                      onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                      className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="accent">Accent</option>
                    </select>
                  </div>
                </div>
              )}


              {/* Dynamic Content Fields */}
              {renderDynamicContentFields()}

              {/* Preview Section */}
              

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
                  disabled={editingItem && !hasFormDataChanged()}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 shadow-lg font-medium font-poppins ${
                    editingItem && !hasFormDataChanged()
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-secondary to-orange-500 text-white hover:from-orange-500 hover:to-secondary hover:shadow-xl'
                  }`}
                >
                  {editingItem ? 'Update' : 'Add'} Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-xl-professional border border-accent/20 p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-primary font-poppins">
                  Section Details
                </h3>
                <p className="text-gray-600 mt-1">View complete section information</p>
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
                  <p className="text-lg font-medium text-gray-900">{viewingItem.title || 'Untitled Section'}</p>
                </div>

              </div>

              {getCurrentSectionConfig().hasSubtitle && viewingItem.subtitle && (
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                    Subtitle
                  </label>
                  <p className="text-lg font-medium text-gray-900">{viewingItem.subtitle}</p>
                </div>
              )}

              {getCurrentSectionConfig().usesDescription && (
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Description
                  </label>
                  <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-6 border border-accent/30">
                    <div 
                      className="text-gray-800 text-lg leading-relaxed prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: viewingItem.description || 'No description provided' }}
                    />
                  </div>
                </div>
              )}

              {(viewingItem.image_url || viewingItem.background_image_url) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {viewingItem.image_url && (
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                        Image URL
                      </label>
                      <p className="text-sm text-gray-600 break-all">{viewingItem.image_url}</p>
                    </div>
                  )}

                  {viewingItem.background_image_url && (
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                        Background Image URL
                      </label>
                      <p className="text-sm text-gray-600 break-all">{viewingItem.background_image_url}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Button Fields - Only show for sections that use buttons */}
              {getCurrentSectionConfig().hasButtons && (viewingItem.button_text || viewingItem.button_link) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {viewingItem.button_text && (
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                        Button Text
                      </label>
                      <p className="text-lg font-medium text-gray-900">{viewingItem.button_text}</p>
                    </div>
                  )}

                  {viewingItem.button_link && (
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                        Button Link
                      </label>
                      <p className="text-sm text-gray-600 break-all">{viewingItem.button_link}</p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                  Section Key
                </label>
                <p className="text-lg font-medium text-gray-900">{viewingItem.section_key}</p>
              </div>

              {viewingItem.content && (
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
                    Additional Content
                  </label>
                  <div className="space-y-4">
                    {renderViewContentFields(viewingItem.content)}
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
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
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
        </div>
      )}

      {/* Mobile Showcase Images Manager Modal */}
      {showMobileImagesManager && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen flex items-start justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl-professional border border-accent/20 w-full max-w-7xl my-8">
              <div className="flex items-center justify-between p-6 border-b border-accent/20">
                <h2 className="text-2xl font-bold text-primary font-poppins">
                  Mobile Showcase Images Management
                </h2>
                <button
                  onClick={() => setShowMobileImagesManager(false)}
                  className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-0">
                <MobileShowcaseImagesManager />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Showcase Card Manager Modal */}
      {showMobileShowcaseCardManager && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen flex items-start justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl-professional border border-accent/20 w-full max-w-7xl my-8">
              <div className="flex items-center justify-between p-6 border-b border-accent/20">
                <h2 className="text-2xl font-bold text-primary font-poppins">
                  Mobile Showcase Card Management
                </h2>
                <button
                  onClick={() => setShowMobileShowcaseCardManager(false)}
                  className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-0">
                <MobileShowcaseCardManager />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Cards Manager Modal */}
      {showSecurityCardsManager && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen flex items-start justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl-professional border border-accent/20 w-full max-w-7xl my-8">
              <div className="flex items-center justify-between p-6 border-b border-accent/20">
                <h2 className="text-2xl font-bold text-primary font-poppins">
                  Security Cards Management
                </h2>
                <button
                  onClick={() => setShowSecurityCardsManager(false)}
                  className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-0">
                <SecurityCardsManager />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Cards Manager Modal */}
      {showServicesCardsManager && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen flex items-start justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl-professional border border-accent/20 w-full max-w-7xl my-8">
              <div className="flex items-center justify-between p-6 border-b border-accent/20">
                <h2 className="text-2xl font-bold text-primary font-poppins">
                  Services Cards Management
                </h2>
                <button
                  onClick={() => setShowServicesCardsManager(false)}
                  className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-0">
                <ServicesCardsManager />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clients Manager Modal */}
      {showClientsManager && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen flex items-start justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl-professional border border-accent/20 w-full max-w-7xl my-8">
              <div className="flex items-center justify-between p-6 border-b border-accent/20">
                <h2 className="text-2xl font-bold text-primary font-poppins">
                  Clients Management
                </h2>
                <button
                  onClick={() => setShowClientsManager(false)}
                  className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-0">
                <ClientsManager />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features & Benefits Manager Modal */}
      {showFeaturesAndBenefitsManager && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen flex items-start justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl-professional border border-accent/20 w-full max-w-7xl my-8">
              <div className="flex items-center justify-between p-6 border-b border-accent/20">
                <h2 className="text-2xl font-bold text-primary font-poppins">
                  Features & Benefits Management
                </h2>
                <button
                  onClick={() => setShowFeaturesAndBenefitsManager(false)}
                  className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-0">
                <FeaturesAndBenefitsManager />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomepageSectionsManager;