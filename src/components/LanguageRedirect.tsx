import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supportedLanguages } from '@/contexts/LanguageContext';

const detectBrowserLanguage = (): string => {
  const browserLang = navigator.language.split('-')[0];
  const supportedCodes = supportedLanguages.map(l => l.code);
  return supportedCodes.includes(browserLang) ? browserLang : 'fr';
};

export const LanguageRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Détecter la langue préférée de l'utilisateur
    const stored = localStorage.getItem('preferred-language');
    const language = stored || detectBrowserLanguage();
    
    // Rediriger vers la langue appropriée
    navigate(`/${language}`, { replace: true });
  }, [navigate]);

  return null; // Ce composant ne rend rien
};