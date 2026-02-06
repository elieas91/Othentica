import React, { useState } from 'react';
import { LanguageIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import apiService from '../../services/api';
import Swal from 'sweetalert2';

const ArabicInputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  rows = 3,
  required = false,
  className = '',
  showAutoTranslate = true,
  onTranslationComplete
}) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [arabicValue, setArabicValue] = useState(value || '');
  const arabicName = `${name}_ar`;

  const handleTranslate = async () => {
    if (!value || value.trim().length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No text to translate',
        text: 'Please enter text in the English field first.',
        confirmButtonColor: '#10b981',
      });
      return;
    }

    setIsTranslating(true);
    try {
      const response = await apiService.translateText(value);
      if (response.success) {
        const translated = response.data.translated;
        setArabicValue(translated);
        // Trigger onChange for the Arabic field
        if (onChange) {
          const event = {
            target: {
              name: arabicName,
              value: translated
            }
          };
          onChange(event);
        }
        if (onTranslationComplete) {
          onTranslationComplete(arabicName, translated);
        }
        Swal.fire({
          icon: 'success',
          title: 'Translated!',
          text: 'Text has been translated to Arabic.',
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: '#10b981',
        });
      } else {
        throw new Error(response.message || 'Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Translation Failed',
        text: error.message || 'Failed to translate text. Please check your Google Translation API configuration.',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleArabicChange = (e) => {
    setArabicValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* English Field */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-3 font-poppins">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {type === 'textarea' ? (
          <textarea
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            required={required}
            className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 resize-none"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
          />
        )}
      </div>

      {/* Arabic Field */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-primary font-poppins flex items-center gap-2">
            <LanguageIcon className="w-4 h-4 text-secondary" />
            {label} (Arabic)
          </label>
          {showAutoTranslate && (
            <button
              type="button"
              onClick={handleTranslate}
              disabled={isTranslating || !value || value.trim().length === 0}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-secondary to-orange-500 rounded-lg hover:from-orange-500 hover:to-secondary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon className={`w-3 h-3 ${isTranslating ? 'animate-spin' : ''}`} />
              {isTranslating ? 'Translating...' : 'Auto Translate'}
            </button>
          )}
        </div>
        {type === 'textarea' ? (
          <textarea
            name={arabicName}
            value={arabicValue}
            onChange={handleArabicChange}
            placeholder={`${placeholder} (Arabic)`}
            rows={rows}
            dir="rtl"
            className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200 resize-none"
          />
        ) : (
          <input
            type={type}
            name={arabicName}
            value={arabicValue}
            onChange={handleArabicChange}
            placeholder={`${placeholder} (Arabic)`}
            dir="rtl"
            className="w-full px-4 py-3 border border-accent/30 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent bg-white/50 transition-all duration-200"
          />
        )}
      </div>
    </div>
  );
};

export default ArabicInputField;

