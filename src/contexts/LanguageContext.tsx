import React, { createContext, useContext, useEffect, useState } from 'react';

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
  t: (key: string, params?: Record<string, string | number | boolean>) => any;
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
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    // Priorité : localStorage > navigateur > défaut
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

  // Sauvegarde de la préférence
  const setLanguage = (newLang: string) => {
    if (supportedLanguages.find(language => language.code === newLang)) {
      setCurrentLanguage(newLang);
      localStorage.setItem('preferred-language', newLang);
    }
  };

  // Fonction de traduction avec interpolation de variables et support des objets/arrays
  const t = (key: string, params?: Record<string, string | number | boolean>): any => {
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

    // Si returnObjects est true, retourne la valeur telle quelle (array ou object)
    if (params && params.returnObjects === true) {
      return value;
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