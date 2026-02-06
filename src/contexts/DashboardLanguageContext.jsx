import React, { createContext, useState, useEffect } from 'react';

const DASHBOARD_LANG_KEY = 'othentica_dashboard_lang';

export const DashboardLanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  isArabic: false,
});

export const DashboardLanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem(DASHBOARD_LANG_KEY) || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(DASHBOARD_LANG_KEY, language);
    } catch (e) {
      console.warn('Could not persist dashboard language:', e);
    }
  }, [language]);

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'ar') {
      setLanguageState(lang);
    }
  };

  return (
    <DashboardLanguageContext.Provider
      value={{
        language,
        setLanguage,
        isArabic: language === 'ar',
      }}
    >
      {children}
    </DashboardLanguageContext.Provider>
  );
};
