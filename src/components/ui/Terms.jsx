import { useEffect, useState } from 'react';

export default function Terms({ form, handleChange }) {
  const [termsHtml, setTermsHtml] = useState('');

  useEffect(() => {
    fetch('/terms.html')
      .then((res) => res.text())
      .then((html) => setTermsHtml(html))
      .catch((err) => console.error('Failed to load terms:', err));
  }, []);

  return (
    <div className="mt-6 h-96 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm border border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Scrollable text with checkbox at the end */}
      <div className="overflow-y-auto mb-4 flex-1">
        <div dangerouslySetInnerHTML={{ __html: termsHtml }} />
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
            I agree to the Terms, and I've read the Privacy Policy and
            Disclaimer.
          </label>
        </div>
      </div>
    </div>
  );
}
