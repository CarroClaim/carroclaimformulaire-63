import React from 'react';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '@/contexts/LanguageContext';
import carroClaimLogo from '@/assets/carro-claim-logo.png';

interface HeaderProps {
  showLanguageSelector?: boolean;
  logoUrl?: string;
  companyName?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  showLanguageSelector = true, 
  logoUrl, 
  companyName = "Expert Auto" 
}) => {
  const { t } = useTranslation();

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img 
            src={logoUrl || carroClaimLogo} 
            alt="Carro Claim"
            className="h-12 w-auto object-contain"
          />
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {t('common.title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('common.subtitle')}
            </p>
          </div>
        </div>
        
        {showLanguageSelector && (
          <LanguageSelector />
        )}
      </div>
    </header>
  );
};