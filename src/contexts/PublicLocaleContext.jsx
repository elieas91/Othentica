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
      // Do NOT set document lang/dir - only DB content switches to Arabic/RTL.
      // Menu, tabs, and layout stay in English and LTR.
    } catch (e) {
      console.warn('Could not persist public locale:', e);
    }
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
