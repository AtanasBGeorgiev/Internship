import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import bg from './locales/bg/translation.json';
import en from './locales/en/translation.json';

// Get saved language preference or use default
const getSavedLanguage = (): string => {
    const savedLang = localStorage.getItem('preferredLanguage');
    return savedLang || 'bg'; // Default to Bulgarian if no preference saved
};

// Save language preference to localStorage
export const saveLanguagePreference = (language: string) => {
    localStorage.setItem('preferredLanguage', language);
};

// Initialize language preference on app startup
export const initializeLanguage = () => {
    const savedLang = getSavedLanguage();
    if (savedLang && i18n.language !== savedLang) {
        i18n.changeLanguage(savedLang);
    }
};

// Get current saved language
export const getCurrentSavedLanguage = (): string => {
    return getSavedLanguage();
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      bg: { translation: bg },
      en: { translation: en },
    },
    lng: getSavedLanguage(), // Use saved language instead of hardcoded 'bg'
    fallbackLng: 'bg',
    interpolation: { escapeValue: false },
  });

// Initialize language after i18n is ready
i18n.on('initialized', () => {
    initializeLanguage();
});

// Also initialize when language changes to ensure consistency
i18n.on('languageChanged', (lng: string) => {
    // This ensures that if language is changed programmatically, it's saved
    if (lng !== getSavedLanguage()) {
        saveLanguagePreference(lng);
    }
});

export default i18n;