import React from 'react';
import { AssetImage } from './AssetImage';
import { LOGOS } from '@/lib/assets';
import { useLogos } from '@/hooks/useAssets';
import { cn } from '@/lib/utils';

interface LogoDisplayProps {
  type?: keyof typeof LOGOS;
  className?: string;
  fallback?: React.ReactNode;
}

export const LogoDisplay: React.FC<LogoDisplayProps> = ({
  type = 'primary',
  className,
  fallback
}) => {
  const { assets: logoAssets, loading } = useLogos();
  
  // Cherche le logo correspondant ou utilise la config statique
  const matchingLogo = logoAssets.find(logo => 
    logo.id.includes(type) || logo.name.toLowerCase().includes(type)
  );
  
  const logo = matchingLogo ? {
    src: matchingLogo.src,
    alt: matchingLogo.alt,
    width: 120,
    height: 40,
    type: matchingLogo.type
  } : LOGOS[type] || LOGOS.primary;

  if (loading) {
    return (
      <div className={cn("flex items-center animate-pulse", className)}>
        <div className="w-[120px] h-[40px] bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      <AssetImage
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        type={logo.type}
        className="object-contain"
        fallbackSrc={fallback ? undefined : '/placeholder.svg'}
      />
      {fallback && (
        <div className="hidden [&:has(+img[src*='placeholder'])]:block">
          {fallback}
        </div>
      )}
    </div>
  );
};