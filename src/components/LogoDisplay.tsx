import React from 'react';
import { AssetImage } from './AssetImage';
import { getLogo, LOGOS } from '@/lib/assets';
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
  const logo = getLogo(type);

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