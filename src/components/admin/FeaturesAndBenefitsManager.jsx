import React, { useState, useEffect, useCallback } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import apiService from '../../services/api';
import RichTextEditor from '../ui/RichTextEditor';

const FeaturesAndBenefitsManager = () => {
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

  const [activeTab, setActiveTab] = useState('features');
  const [features, setFeatures] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [featuresContent, setFeaturesContent] = useState('');
  const [benefitsContent, setBenefitsContent] = useState('');
  const [originalFeaturesContent, setOriginalFeaturesContent] = useState('');
  const [originalBenefitsContent, setOriginalBenefitsContent] = useState('');

  // Function to convert array of items to HTML list
  const convertArrayToHtmlList = (items, type = null) => {
    const itemType = type || activeTab;
    console.log('convertArrayToHtmlList called with:', items);
    console.log('itemType:', itemType);
    
    if (!items || items.length === 0) {
      console.log('No items or empty array, returning empty string');
      return '';
    }
    
    const filteredItems = items.filter(item => item.is_active === 1 || item.is_active === true);
    console.log('Filtered active items:', filteredItems);
    
    const sortedItems = filteredItems.sort((a, b) => a.display_order - b.display_order);
    console.log('Sorted items:', sortedItems);
    
    const listItems = sortedItems
      .map(item => {
        const text = itemType === 'features' ? item.feature : item.benefit;
        console.log(`Item: ${JSON.stringify(item)}, text: ${text}`);
        return `<li>${text}</li>`;
      })
      .join('');
    
    const result = `<ul>${listItems}</ul>`;
    console.log('Final HTML result:', result);
    return result;
  };

  // Function to convert HTML list to array of items
  const convertHtmlListToArray = (htmlContent, type) => {
    if (!htmlContent) return [];
    
    // Extract list items from HTML
    const listItemRegex = /<li[^>]*>(.*?)<\/li>/gi;
    const matches = htmlContent.match(listItemRegex);
    
    if (!matches) return [];
    
    return matches.map((match, index) => {
      // Remove HTML tags and get clean text
      const text = match.replace(/<[^>]*>/g, '').trim();
      return {
        id: `temp_${index}`,
        [type]: text,
        category: '',
        is_active: true,
        display_order: index + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });
  };

  // Function to check if content has changed
  const hasContentChanged = () => {
    if (activeTab === 'features') {
      return featuresContent !== originalFeaturesContent;
    } else {
      return benefitsContent !== originalBenefitsContent;
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Fetching features and benefits...');
      
      const [featuresRes, benefitsRes] = await Promise.all([
        apiService.getAppFeatures(),
        apiService.getAppBenefits()
      ]);

      console.log('Features response:', featuresRes);
      console.log('Benefits response:', benefitsRes);

      if (featuresRes.success) {
        console.log('Features data:', featuresRes.data);
        setFeatures(featuresRes.data);
        const featuresHtml = convertArrayToHtmlList(featuresRes.data, 'features');
        console.log('Features HTML:', featuresHtml);
        setFeaturesContent(featuresHtml);
        setOriginalFeaturesContent(featuresHtml);
      } else {
        console.error('Features fetch failed:', featuresRes);
      }
      
      if (benefitsRes.success) {
        console.log('Benefits data:', benefitsRes.data);
        setBenefits(benefitsRes.data);
        const benefitsHtml = convertArrayToHtmlList(benefitsRes.data, 'benefits');
        console.log('Benefits HTML:', benefitsHtml);
        setBenefitsContent(benefitsHtml);
        setOriginalBenefitsContent(benefitsHtml);
      } else {
        console.error('Benefits fetch failed:', benefitsRes);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      await showErrorAlert('Error', 'Failed to load features and benefits');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      const currentContent = activeTab === 'features' ? featuresContent : benefitsContent;
      const items = convertHtmlListToArray(currentContent, activeTab === 'features' ? 'feature' : 'benefit');
      
      // First, delete all existing items
      const existingItems = activeTab === 'features' ? features : benefits;
      for (const item of existingItems) {
        if (activeTab === 'features') {
          await apiService.deleteAppFeature(item.id);
        } else {
          await apiService.deleteAppBenefit(item.id);
        }
      }
      
      // Then create new items from the rich text editor content
      for (const item of items) {
        if (activeTab === 'features') {
          await apiService.createAppFeature({
            feature: item.feature,
            category: item.category,
            display_order: item.display_order,
            is_active: true
          });
        } else {
          await apiService.createAppBenefit({
            benefit: item.benefit,
            category: item.category,
            display_order: item.display_order,
            is_active: true
          });
        }
      }
      
      await showSuccessAlert('Success!', `${activeTab === 'features' ? 'Features' : 'Benefits'} updated successfully!`);
      await fetchData();
      setIsEditing(false);
      
    } catch (err) {
      await showErrorAlert('Error', `Failed to save ${activeTab === 'features' ? 'features' : 'benefits'}: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (activeTab === 'features') {
      setFeaturesContent(originalFeaturesContent);
    } else {
      setBenefitsContent(originalBenefitsContent);
    }
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const currentContent = activeTab === 'features' ? featuresContent : benefitsContent;
  const currentData = activeTab === 'features' ? features : benefits;
  
  console.log('Render - activeTab:', activeTab);
  console.log('Render - currentContent:', currentContent);
  console.log('Render - currentData:', currentData);
  console.log('Render - features:', features);
  console.log('Render - benefits:', benefits);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl font-bold text-primary font-poppins mb-2">
            Features & Benefits Management
          </h3>
          <p className="text-gray-600">Edit app features and benefits as lists using the rich text editor</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('features')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium font-poppins ${
              activeTab === 'features' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            App Features
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium font-poppins ${
              activeTab === 'benefits' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            App Benefits
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-4">
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-blue-800 text-white rounded-xl hover:from-blue-800 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl font-medium font-poppins"
          >
            <PencilIcon className="w-5 h-5" />
            Edit {activeTab === 'features' ? 'Features' : 'Benefits'}
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={!hasContentChanged() || isLoading}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg font-medium font-poppins ${
                !hasContentChanged() || isLoading
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-800 text-white hover:from-green-700 hover:to-green-900 hover:shadow-xl'
              }`}
            >
              <CheckCircleIcon className="w-5 h-5" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-3 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium font-poppins"
            >
              <XMarkIcon className="w-5 h-5" />
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
          <span className="ml-2 text-gray-600">Loading {activeTab}...</span>
        </div>
      )}

      {/* Rich Text Editor */}
      {!isLoading && (
        <div className="bg-gradient-to-br from-white to-accent/10 rounded-2xl shadow-professional border border-accent/20 p-8">
          <div className="mb-6">
            <h4 className="text-xl font-bold text-primary font-poppins mb-2">
              {activeTab === 'features' ? 'App Features' : 'App Benefits'}
            </h4>
            <p className="text-gray-600 text-sm">
              {isEditing 
                ? 'Edit the list below. Each list item will become a separate feature/benefit. Use the toolbar to format text, add links, or create lists.'
                : 'Click "Edit" to modify this list. Each list item represents a separate feature/benefit.'
              }
            </p>
          </div>

          {isEditing ? (
            <div className="rich-text-container">
              <RichTextEditor
                value={currentContent}
                onChange={(value) => {
                  if (activeTab === 'features') {
                    setFeaturesContent(value);
                  } else {
                    setBenefitsContent(value);
                  }
                }}
                placeholder={`Enter your ${activeTab === 'features' ? 'features' : 'benefits'} as a list. Each list item will become a separate ${activeTab === 'features' ? 'feature' : 'benefit'}...`}
                height="400px"
              />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-6 border border-accent/30">
              <div 
                className="text-gray-800 text-lg leading-relaxed prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: currentContent || `<p class="text-gray-400 italic">No ${activeTab} available. Click "Edit" to add some.</p>` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h5 className="text-lg font-semibold text-blue-900 mb-3 font-poppins">
          💡 How to use this editor
        </h5>
        <ul className="text-blue-800 space-y-2 text-sm">
          <li>• <strong>Create lists:</strong> Use the list button in the toolbar to create bullet points</li>
          <li>• <strong>Each list item</strong> becomes a separate {activeTab === 'features' ? 'feature' : 'benefit'}</li>
          <li>• <strong>Format text:</strong> Use bold, italic, or links to enhance your content</li>
          <li>• <strong>Order matters:</strong> The order of list items determines the display order</li>
          <li>• <strong>Save changes:</strong> Click "Save Changes" to update the database</li>
        </ul>
      </div>

    </div>
  );
};

export default FeaturesAndBenefitsManager;
