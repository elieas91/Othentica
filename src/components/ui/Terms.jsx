import { useEffect, useState, useContext } from 'react';
import { PublicLocaleContext } from '../../contexts/PublicLocaleContext';

export default function Terms({ form, handleChange }) {
  const { locale, isArabic } = useContext(PublicLocaleContext);
  const [termsHtml, setTermsHtml] = useState('');

  useEffect(() => {
    const file = locale === 'ar' ? '/terms-arabic.html' : '/terms-english.html';
    fetch(file)
      .then((res) => res.text())
      .then((html) => setTermsHtml(html))
      .catch((err) => console.error('Failed to load terms:', err));
  }, [locale]);

  return (
    <div className="mt-6 h-96 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm border border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Scrollable text with checkbox at the end */}
      <div className="overflow-y-auto mb-4 flex-1">
        <div
          dangerouslySetInnerHTML={{ __html: termsHtml }}
          className={`${isArabic ? 'text-right' : 'text-left'}`}
          dir={isArabic ? 'rtl' : 'ltr'}
        />
        {/* Checkbox at the end of scrollable area */}
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            id="termsAgree"
            name="termsAgree"
            checked={form.termsAgree}
            onChange={handleChange}
            required
            className="mr-2"
          />
          <label
            htmlFor="termsAgree"
            className="text-sm text-gray-700 dark:text-gray-300"
          >
            {isArabic
              ? 'أوافق على الشروط والأحكام'
              : 'I agree to the Terms & Conditions.'}
          </label>
        </div>
        <div className="flex items-center mt-3">
          <input
            type="checkbox"
            id="healthDisclaimerAgree"
            name="healthDisclaimerAgree"
            checked={form.healthDisclaimerAgree}
            onChange={handleChange}
            required
            className="mr-2"
          />
          <label
            htmlFor="healthDisclaimerAgree"
            className="text-sm text-gray-700 dark:text-gray-300"
          >
            {isArabic
              ? 'أقر بأنني قرأت إخلاء المسؤولية الصحية وأفهم مضمونه'
              : 'I have read and understand the Health Disclaimer.'}
          </label>
        </div>
      </div>
    </div>
  );
}
