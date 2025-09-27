import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('saral-seva-language');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }

    // Listen for language change events
    const handleLanguageChange = (event) => {
      if (event.detail && event.detail.language) {
        changeLanguage(event.detail.language);
      }
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const changeLanguage = async (languageCode) => {
    if (!translations[languageCode]) {
      console.error(`Translation not available for language: ${languageCode}`);
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCurrentLanguage(languageCode);
      localStorage.setItem('saral-seva-language', languageCode);
      
      // Update document direction for RTL languages
      const rtlLanguages = ['ur', 'ar'];
      document.dir = rtlLanguages.includes(languageCode) ? 'rtl' : 'ltr';
      
      // Update document language
      document.documentElement.lang = languageCode;
      
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const translate = (key, fallback = '') => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return fallback || key;
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : fallback || key;
  };

  const formatNumber = (number) => {
    try {
      return new Intl.NumberFormat(currentLanguage).format(number);
    } catch {
      return number.toString();
    }
  };

  const formatDate = (date) => {
    try {
      return new Intl.DateTimeFormat(currentLanguage, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(date));
    } catch {
      return date.toString();
    }
  };

  const formatCurrency = (amount, currency = 'INR') => {
    try {
      return new Intl.NumberFormat(currentLanguage, {
        style: 'currency',
        currency: currency
      }).format(amount);
    } catch {
      return `${currency} ${amount}`;
    }
  };

  const getCurrentLanguageInfo = () => {
    const languages = {
      en: { name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr' },
      hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', direction: 'ltr' },
      bn: { name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', direction: 'ltr' },
      te: { name: 'Telugu', nativeName: 'తెలుగు', flag: '🏴󠁩󠁮󠁴󠁧󠁿', direction: 'ltr' },
      mr: { name: 'Marathi', nativeName: 'मराठी', flag: '🏴󠁩󠁮󠁭󠁨󠁿', direction: 'ltr' },
      ta: { name: 'Tamil', nativeName: 'தமிழ்', flag: '🏴󠁩󠁮󠁴󠁮󠁿', direction: 'ltr' },
      gu: { name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🏴󠁩󠁮󠁧󠁪󠁿', direction: 'ltr' },
      ur: { name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', direction: 'rtl' },
      kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🏴󠁩󠁮󠁫󠁡󠁿', direction: 'ltr' },
      ml: { name: 'Malayalam', nativeName: 'മലയാളം', flag: '🏴󠁩󠁮󠁫󠁬󠁿', direction: 'ltr' },
      pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🏴󠁩󠁮󠁰󠁢󠁿', direction: 'ltr' },
      or: { name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🏴󠁩󠁮󠁯󠁲󠁿', direction: 'ltr' },
      as: { name: 'Assamese', nativeName: 'অসমীয়া', flag: '🏴󠁩󠁮󠁡󠁳󠁿', direction: 'ltr' }
    };
    
    return languages[currentLanguage] || languages.en;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    translate: translate,
    t: translate, // Short alias
    formatNumber,
    formatDate,
    formatCurrency,
    getCurrentLanguageInfo,
    isLoading,
    availableLanguages: Object.keys(translations)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};