import { useLanguage } from '../contexts/LanguageContext';

// Component for inline translations
export const T = ({ k, fallback = '', values = {} }) => {
  const { t } = useLanguage();
  
  let translation = t(k, fallback);
  
  // Simple variable substitution
  Object.keys(values).forEach(key => {
    translation = translation.replace(`{{${key}}}`, values[key]);
  });
  
  return translation;
};

// Component for text with formatting
export const TranslatedText = ({ 
  translationKey, 
  fallback = '', 
  className = '', 
  component: Component = 'span',
  values = {},
  ...props 
}) => {
  const { t } = useLanguage();
  
  let text = t(translationKey, fallback);
  
  // Simple variable substitution
  Object.keys(values).forEach(key => {
    text = text.replace(`{{${key}}}`, values[key]);
  });
  
  return (
    <Component className={className} {...props}>
      {text}
    </Component>
  );
};

// Language direction component
export const LanguageDirection = ({ children }) => {
  const { getCurrentLanguageInfo } = useLanguage();
  const languageInfo = getCurrentLanguageInfo();
  
  return (
    <div dir={languageInfo.direction || 'ltr'}>
      {children}
    </div>
  );
};