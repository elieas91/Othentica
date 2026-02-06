// Translation utility using Google Translate API (free endpoint)

export const translateText = async (text, targetLang = 'ar', sourceLang = 'en') => {
  if (!text || text.trim() === '') {
    return '';
  }

  try {
    // Using Google Translate free API endpoint
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    
    // Extract translated text from the response
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0].map((item) => item[0]).join('');
    }
    
    return text; // Return original if translation fails
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
};

/**
 * Translate multiple fields to Arabic
 * @param {Object} fields - Object with field names and values
 * @param {Array<string>} fieldNames - Array of field names to translate
 * @returns {Promise<Object>} - Object with Arabic translations
 */
export const translateFieldsToArabic = async (fields, fieldNames) => {
  const translations = {};
  
  for (const fieldName of fieldNames) {
    if (fields[fieldName] && typeof fields[fieldName] === 'string' && fields[fieldName].trim().length > 0) {
      try {
        translations[`${fieldName}_ar`] = await translateText(fields[fieldName], 'ar', 'en');
      } catch (error) {
        console.error(`Error translating field ${fieldName}:`, error);
        translations[`${fieldName}_ar`] = ''; // Set empty string on error
      }
    } else {
      translations[`${fieldName}_ar`] = '';
    }
  }

  return translations;
};
