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

const FeaturesAndBenefitsManager = () => {
  const { isArabic } = useContext(DashboardLanguageContext);
  const prevIsArabic = useRef(isArabic);
  const [translatingList, setTranslatingList] = useState(false);
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
  const [featuresContentAr, setFeaturesContentAr] = useState('');
  const [benefitsContentAr, setBenefitsContentAr] = useState('');
  const [originalFeaturesContent, setOriginalFeaturesContent] = useState('');
  const [originalBenefitsContent, setOriginalBenefitsContent] = useState('');
  const [originalFeaturesContentAr, setOriginalFeaturesContentAr] = useState('');
  const [originalBenefitsContentAr, setOriginalBenefitsContentAr] = useState('');

  // Function to convert array of items to HTML list (useArabic: use feature_ar/benefit_ar only, no fallback to EN)
  const convertArrayToHtmlList = (items, type = null, useArabic = false) => {
    const itemType = type || activeTab;
    if (!items || items.length === 0) return '';
    const filteredItems = items.filter(item => item.is_active === 1 || item.is_active === true);
    const sortedItems = filteredItems.sort((a, b) => a.display_order - b.display_order);
    const listItems = sortedItems
      .map(item => {
        const text = itemType === 'features'
          ? (useArabic ? (item.feature_ar ?? '') : item.feature)
          : (useArabic ? (item.benefit_ar ?? '') : item.benefit);
        return `<li>${text || ''}</li>`;
      })
      .join('');
    return `<ul>${listItems}</ul>`;
  };

  // Function to convert HTML list to array of items (fieldKey: 'feature' | 'benefit' | 'feature_ar' | 'benefit_ar')
  const convertHtmlListToArray = (htmlContent, fieldKey) => {
    if (!htmlContent) return [];
    const listItemRegex = /<li[^>]*>(.*?)<\/li>/gi;
    const matches = htmlContent.match(listItemRegex);
    if (!matches) return [];
    return matches.map((match, index) => {
      const text = match.replace(/<[^>]*>/g, '').trim();
      return {
        id: `temp_${index}`,
        [fieldKey]: text,
        category: '',
        is_active: true,
        display_order: index + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });
  };

  // Function to check if content has changed (EN or AR)
  const hasContentChanged = () => {
    if (activeTab === 'features') {
      return featuresContent !== originalFeaturesContent || featuresContentAr !== originalFeaturesContentAr;
    } else {
      return benefitsContent !== originalBenefitsContent || benefitsContentAr !== originalBenefitsContentAr;
    }
  };

  const handleTranslateListToArabic = async () => {
    const enContent = activeTab === 'features' ? featuresContent : benefitsContent;
    const items = convertHtmlListToArray(enContent, activeTab === 'features' ? 'feature' : 'benefit');
    if (!items.length) return;
    setTranslatingList(true);
    try {
      const translated = await Promise.all(
        items.map((item) => {
          const text = activeTab === 'features' ? item.feature : item.benefit;
          return text ? translateText(text, 'ar', 'en') : Promise.resolve('');
        })
      );
      const arListItems = translated.map((t) => `<li>${t}</li>`).join('');
      const arHtml = `<ul>${arListItems}</ul>`;
      if (activeTab === 'features') {
        setFeaturesContentAr(arHtml);
      } else {
        setBenefitsContentAr(arHtml);
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setTranslatingList(false);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [featuresRes, benefitsRes] = await Promise.all([
        apiService.getAppFeatures(),
        apiService.getAppBenefits()
      ]);

      if (featuresRes.success) {
        setFeatures(featuresRes.data);
        const featuresHtml = convertArrayToHtmlList(featuresRes.data, 'features', false);
        const featuresHtmlAr = convertArrayToHtmlList(featuresRes.data, 'features', true);
        setFeaturesContent(featuresHtml);
        setFeaturesContentAr(featuresHtmlAr);
        setOriginalFeaturesContent(featuresHtml);
        setOriginalFeaturesContentAr(featuresHtmlAr);
      } else {
        console.error('Features fetch failed:', featuresRes);
      }
      
      if (benefitsRes.success) {
        setBenefits(benefitsRes.data);
        const benefitsHtml = convertArrayToHtmlList(benefitsRes.data, 'benefits', false);
        const benefitsHtmlAr = convertArrayToHtmlList(benefitsRes.data, 'benefits', true);
        setBenefitsContent(benefitsHtml);
        setBenefitsContentAr(benefitsHtmlAr);
        setOriginalBenefitsContent(benefitsHtml);
        setOriginalBenefitsContentAr(benefitsHtmlAr);
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

  useEffect(() => {
    if (prevIsArabic.current !== isArabic) {
      prevIsArabic.current = isArabic;
      fetchData();
    }
  }, [isArabic, fetchData]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const fieldKey = activeTab === 'features' ? 'feature' : 'benefit';
      const fieldKeyAr = activeTab === 'features' ? 'feature_ar' : 'benefit_ar';
      const enItems = convertHtmlListToArray(activeTab === 'features' ? featuresContent : benefitsContent, fieldKey);
      const arItems = convertHtmlListToArray(activeTab === 'features' ? featuresContentAr : benefitsContentAr, fieldKeyAr);
      const merged = enItems.map((en, i) => ({
        ...en,
        [fieldKeyAr]: arItems[i]?.[fieldKeyAr] ?? ''
      }));

      const existingItems = activeTab === 'features' ? features : benefits;
      for (const item of existingItems) {
        if (activeTab === 'features') {
          await apiService.deleteAppFeature(item.id);
        } else {
          await apiService.deleteAppBenefit(item.id);
        }
      }

      for (const item of merged) {
        if (activeTab === 'features') {
          await apiService.createAppFeature({
            feature: item.feature,
            feature_ar: item.feature_ar ?? '',
            category: item.category,
            display_order: item.display_order,
            is_active: true
          });
        } else {
          await apiService.createAppBenefit({
            benefit: item.benefit,
            benefit_ar: item.benefit_ar ?? '',
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
      setFeaturesContentAr(originalFeaturesContentAr);
    } else {
      setBenefitsContent(originalBenefitsContent);
      setBenefitsContentAr(originalBenefitsContentAr);
    }
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const currentContent = isArabic
    ? (activeTab === 'features' ? featuresContentAr : benefitsContentAr)
    : (activeTab === 'features' ? featuresContent : benefitsContent);
  const currentData = activeTab === 'features' ? features : benefits;

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
      <div className="mb-6 flex flex-wrap items-center gap-4">
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
            <button
              type="button"
              onClick={handleTranslateListToArabic}
              disabled={translatingList || !(activeTab === 'features' ? featuresContent : benefitsContent).trim()}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Translate list to Arabic"
            >
              {translatingList ? (
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
              ) : (
                <LanguageIcon className="w-4 h-4" />
              )}
              Translate to Arabic
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
            <div className="rich-text-container space-y-6">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2 font-poppins">
                  English list
                </label>
                <RichTextEditor
                  value={activeTab === 'features' ? featuresContent : benefitsContent}
                  onChange={(value) => {
                    if (activeTab === 'features') setFeaturesContent(value);
                    else setBenefitsContent(value);
                  }}
                  placeholder={`Enter your ${activeTab === 'features' ? 'features' : 'benefits'} as a list (EN)...`}
                  height="280px"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2 font-poppins" dir="rtl">
                  القائمة بالعربية
                </label>
                <RichTextEditor
                  value={activeTab === 'features' ? featuresContentAr : benefitsContentAr}
                  onChange={(value) => {
                    if (activeTab === 'features') setFeaturesContentAr(value);
                    else setBenefitsContentAr(value);
                  }}
                  placeholder="القائمة بالعربية..."
                  height="280px"
                />
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-6 border border-accent/30" dir={isArabic ? 'rtl' : 'ltr'}>
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
