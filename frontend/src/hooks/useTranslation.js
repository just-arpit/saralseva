import { useLanguage } from '../contexts/LanguageContext';

// Hook for easier translation usage
export const useTranslation = () => {
  const { t, currentLanguage, changeLanguage, formatDate, formatNumber, formatCurrency, getCurrentLanguageInfo } = useLanguage();
  
  return {
    t,
    currentLanguage,
    changeLanguage,
    formatDate,
    formatNumber,
    formatCurrency,
    getCurrentLanguageInfo
  };
};

// Higher-order component for components that need translations
export const withTranslation = (Component) => {
  return function TranslatedComponent(props) {
    const translation = useTranslation();
    return <Component {...props} {...translation} />;
  };
};