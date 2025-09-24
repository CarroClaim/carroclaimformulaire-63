import React from 'react';
import { AssetImage } from './AssetImage';
import { getAsset, EXAMPLES } from '@/lib/assets';
import { cn } from '@/lib/utils';

interface ExampleGalleryProps {
  category: keyof typeof EXAMPLES;
  className?: string;
  showTitles?: boolean;
  layout?: 'grid' | 'list' | 'single';
  maxItems?: number;
}

export const ExampleGallery: React.FC<ExampleGalleryProps> = ({
  category,
  className,
  showTitles = true,
  layout = 'grid',
  maxItems
}) => {
  const assets = getAsset(category) as any[];
  
  if (!assets || assets.length === 0) {
    return (
      <div className={cn("text-center p-4 text-muted-foreground", className)}>
        Aucun exemple disponible pour cette catégorie
      </div>
    );
  }

  const displayAssets = maxItems ? assets.slice(0, maxItems) : assets;

  const getLayoutClasses = () => {
    switch (layout) {
      case 'list':
        return 'space-y-3';
      case 'single':
        return 'flex justify-center';
      case 'grid':
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 gap-3';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center">
        <h4 className="text-sm font-semibold text-foreground mb-1">Exemples</h4>
        <p className="text-xs text-muted-foreground">
          {category === 'carte-grise' && 'Document d\'immatriculation'}
          {category === 'compteur' && 'Compteur kilométrique'}
          {category === 'vehicle-angles' && 'Angles de prise de vue'}
          {category === 'damages' && 'Photos de dommages'}
        </p>
      </div>

      <div className={getLayoutClasses()}>
        {displayAssets.map((asset, index) => (
          <div
            key={index}
            className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-sm transition-shadow"
          >
            {showTitles && asset.title && (
              <div className="p-2 bg-muted/50">
                <h5 className="text-xs font-semibold text-foreground">{asset.title}</h5>
              </div>
            )}
            
            <div className="aspect-[4/3] bg-muted relative">
              <AssetImage
                src={asset.src}
                alt={asset.alt}
                title={asset.title}
                type={asset.type}
                className="w-full h-full object-cover"
              />
              
              {asset.type === 'gif' && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  GIF
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};