import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from '@/contexts/LanguageContext';
import { supportedLanguages } from '@/contexts/LanguageContext';

export const LanguageSync = () => {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { currentLanguage, setLanguage } = useTranslation();

  // Synchroniser la langue basée sur l'URL
  useEffect(() => {
    if (lang && supportedLanguages.find(l => l.code === lang) && lang !== currentLanguage) {
      setLanguage(lang);
    }
  }, [lang, currentLanguage, setLanguage]);

  // Gérer la navigation quand la langue change
  useEffect(() => {
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    const isAdmin = currentPath.includes('/admin');
    
    // Si pas de langue dans l'URL ou mauvaise langue, rediriger
    if (!lang || lang !== currentLanguage) {
      if (pathSegments.length === 0 || pathSegments[0] === 'admin') {
        // Cas où on est sur "/" ou "/admin" sans préfixe de langue
        if (isAdmin) {
          navigate(`/${currentLanguage}/admin`, { replace: true });
        } else {
          navigate(`/${currentLanguage}`, { replace: true });
        }
      } else if (!supportedLanguages.find(l => l.code === pathSegments[0])) {
        // Cas où le premier segment n'est pas une langue valide
        if (isAdmin) {
          navigate(`/${currentLanguage}/admin`, { replace: true });
        } else {
          navigate(`/${currentLanguage}`, { replace: true });
        }
      }
    }
  }, [currentLanguage, lang, navigate]);

  return null; // Ce composant ne rend rien
};