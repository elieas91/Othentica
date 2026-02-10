import React, { createContext, useState, useEffect } from 'react';

const PUBLIC_LANG_KEY = 'othentica_public_lang';

export const PublicLocaleContext = createContext({
  locale: 'en',
  setLocale: () => {},
  isArabic: false,
});

export const PublicLocaleProvider = ({ children }) => {
  const [locale, setLocaleState] = useState(() => {
    try {
      return localStorage.getItem(PUBLIC_LANG_KEY) || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PUBLIC_LANG_KEY, locale);
    } catch (e) {
      console.warn('Could not persist public locale:', e);
    }
  }, [locale]);

  // Set document direction and language so all content is RTL when Arabic is selected
  useEffect(() => {
    const isArabic = locale === 'ar';
    document.documentElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', isArabic ? 'ar' : 'en');
  }, [locale]);

  const setLocale = (lang) => {
    if (lang === 'en' || lang === 'ar') {
      setLocaleState(lang);
    }
  };

  return (
    <PublicLocaleContext.Provider
      value={{
        locale,
        setLocale,
        isArabic: locale === 'ar',
      }}
    >
      {children}
    </PublicLocaleContext.Provider>
  );
};
