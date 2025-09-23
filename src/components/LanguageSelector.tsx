import React from 'react';
import { Globe } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, languages } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  
  const currentLang = languages.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = (newLang: string) => {
    const currentPath = window.location.pathname;
    const isAdmin = currentPath.includes('/admin');
    
    if (isAdmin) {
      navigate(`/${newLang}/admin`);
    } else {
      navigate(`/${newLang}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Globe className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline mr-1">{currentLang?.name}</span>
          <span className="text-base">{currentLang?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-background border border-border shadow-lg">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`cursor-pointer hover:bg-accent hover:text-accent-foreground ${
              currentLanguage === language.code ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <span className="mr-2 text-base">{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};