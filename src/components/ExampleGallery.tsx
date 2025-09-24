import React from 'react';
import { AssetImage } from './AssetImage';
import { EXAMPLES } from '@/lib/assets';
import { useAssets } from '@/hooks/useAssets';
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
  maxItems = 6
}) => {
  const { assets: discoveredAssets, loading } = useAssets({ category });
  
  // Utilise les assets découverts ou fallback vers la config statique
  const assets = discoveredAssets.length > 0 
    ? discoveredAssets.map(asset => ({
        src: asset.src,
        alt: asset.alt, 
        title: asset.name,
        type: asset.type
      }))
    : EXAMPLES[category] || [];

  const displayAssets = maxItems ? assets.slice(0, maxItems) : assets;

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
          <div className={cn(
            layout === 'grid' 
              ? "grid grid-cols-2 md:grid-cols-3 gap-4"
              : "flex flex-wrap gap-2"
          )}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-video bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <div className={cn("text-center p-4 text-muted-foreground", className)}>
        Aucun exemple disponible pour cette catégorie
      </div>
    );
  }

  const layoutClasses = {
    grid: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
    list: "flex flex-col space-y-2",
    single: "flex justify-center"
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className={cn(layoutClasses[layout])}>
        {displayAssets.map((asset, index) => (
          <div key={index} className={cn(
            "group cursor-pointer transition-transform hover:scale-105",
            layout === 'list' && "flex items-center space-x-3 p-2 rounded-lg hover:bg-muted"
          )}>
            <AssetImage
              src={asset.src}
              alt={asset.alt}
              title={asset.title}
              type={asset.type}
              className={cn(
                "rounded-lg border border-border overflow-hidden",
                layout === 'grid' && "aspect-video w-full object-cover",
                layout === 'list' && "w-16 h-16 object-cover flex-shrink-0",
                layout === 'single' && "max-w-md object-contain"
              )}
            />
            {showTitles && asset.title && (
              <div className={cn(
                "mt-2 text-sm text-center text-muted-foreground",
                layout === 'list' && "mt-0 text-left flex-1"
              )}>
                {asset.title}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {maxItems && assets.length > maxItems && (
        <div className="text-center text-sm text-muted-foreground">
          Affichage de {maxItems} sur {assets.length} éléments
        </div>
      )}
    </div>
  );
};