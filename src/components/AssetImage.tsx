import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface AssetImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  fallbackSrc?: string;
  type?: 'image' | 'gif' | 'svg';
  lazy?: boolean;
  width?: number;
  height?: number;
}

export const AssetImage: React.FC<AssetImageProps> = ({
  src,
  alt,
  title,
  className,
  fallbackSrc,
  type = 'image',
  lazy = true,
  width,
  height
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const finalSrc = imageError && fallbackSrc ? fallbackSrc : src;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
          <div className="w-8 h-8 bg-muted-foreground/20 rounded-full animate-spin border-2 border-primary border-t-transparent" />
        </div>
      )}
      
      <img
        src={finalSrc}
        alt={alt}
        title={title}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          type === 'gif' && "rounded-lg"
        )}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading={lazy ? "lazy" : "eager"}
        width={width}
        height={height}
      />
      
      {imageError && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-xs">
          Image non disponible
        </div>
      )}
    </div>
  );
};