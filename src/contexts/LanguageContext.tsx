import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export type Language = {
  code: string;
  name: string;
  flag: string;
};

export const supportedLanguages: Language[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sq', name: 'Shqip', flag: '🇦🇱' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  languages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const DEFAULT_LANGUAGE = 'fr';

// Fonction pour détecter la langue du navigateur
const detectBrowserLanguage = (): string => {
  const browserLang = navigator.language.split('-')[0];
  const supportedCodes = supportedLanguages.map(l => l.code);
  return supportedCodes.includes(browserLang) ? browserLang : DEFAULT_LANGUAGE;
};

// Cache pour les traductions chargées
const translationCache: Record<string, Record<string, any>> = {};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { lang } = useParams();
  
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    // Priorité : URL > localStorage > navigateur > défaut
    if (lang && supportedLanguages.find(l => l.code === lang)) {
      return lang;
    }
    const stored = localStorage.getItem('preferred-language');
    return stored || detectBrowserLanguage();
  });

  const [translations, setTranslations] = useState<Record<string, any>>({});

  // Chargement des traductions
  useEffect(() => {
    const loadTranslations = async () => {
      if (translationCache[currentLanguage]) {
        setTranslations(translationCache[currentLanguage]);
        return;
      }

      try {
        const translationModule = await import(`../locales/${currentLanguage}.ts`);
        const translations = translationModule.default || translationModule;
        translationCache[currentLanguage] = translations;
        setTranslations(translations);
      } catch (error) {
        console.error(`Failed to load translations for ${currentLanguage}:`, error);
        // Fallback vers le français si échec
        if (currentLanguage !== DEFAULT_LANGUAGE) {
          try {
            const fallbackModule = await import(`../locales/${DEFAULT_LANGUAGE}.ts`);
            const fallbackTranslations = fallbackModule.default || fallbackModule;
            setTranslations(fallbackTranslations);
          } catch (fallbackError) {
            console.error('Failed to load fallback translations:', fallbackError);
          }
        }
      }
    };

    loadTranslations();
  }, [currentLanguage]);

  // Sauvegarde de la préférence et navigation
  const setLanguage = (newLang: string) => {
    if (supportedLanguages.find(language => language.code === newLang)) {
      setCurrentLanguage(newLang);
      localStorage.setItem('preferred-language', newLang);
      
      // Mettre à jour l'URL avec la nouvelle langue
      const currentPath = window.location.pathname;
      const isAdmin = currentPath.includes('/admin');
      
      if (isAdmin) {
        navigate(`/${newLang}/admin`);
      } else {
        navigate(`/${newLang}`);
      }
    }
  };

  // Effet pour synchroniser l'URL avec les changements de langue
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

  // Fonction de traduction avec interpolation de variables
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key} for language ${currentLanguage}`);
        return key; // Retourne la clé si traduction non trouvée
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }

    // Interpolation des paramètres {{param}}
    if (params) {
      return (value as string).replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param]?.toString() || match;
      });
    }

    return value as string;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        languages: supportedLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};