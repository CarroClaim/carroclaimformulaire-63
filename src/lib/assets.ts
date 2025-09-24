// Système de gestion centralisé des assets (Legacy - Utilise maintenant assetDiscoveryService)
// Permet d'ajouter facilement logos personnalisés et images d'exemples
// DEPRECATED: Utilise maintenant useAssets() hook pour la découverte dynamique

import { assetDiscoveryService } from '@/services/assetDiscoveryService';
import { configurationService } from '@/services/configurationService';

// Types pour la sécurité TypeScript
interface AssetConfig {
  src: string;
  alt: string;
  title?: string;
  type?: 'image' | 'gif' | 'svg';
}

interface LogoConfig extends AssetConfig {
  width?: number;
  height?: number;
}

// Configuration des logos personnalisés
export const LOGOS: Record<string, LogoConfig> = {
  primary: {
    src: '/assets/logos/logo-primary.png',
    alt: 'Logo principal',
    width: 120,
    height: 40,
    type: 'image'
  },
  header: {
    src: '/assets/logos/logo-header.png', 
    alt: 'Logo en-tête',
    width: 100,
    height: 32,
    type: 'image'
  },
  // Ajoutez vos logos personnalisés ici
  custom: {
    src: '/assets/logos/logo-custom.png',
    alt: 'Logo personnalisé',
    width: 80,
    height: 30,
    type: 'image'
  }
};

// Configuration des exemples pour le formulaire
export const EXAMPLES: Record<string, AssetConfig[]> = {
  // Exemples de documents
  'carte-grise': [
    {
      src: '/assets/examples/documents/carte-grise-example-1.jpg',
      alt: 'Exemple carte grise - recto',
      title: 'Carte grise - recto',
      type: 'image'
    },
    {
      src: '/assets/examples/documents/carte-grise-example-2.jpg', 
      alt: 'Exemple carte grise - verso',
      title: 'Carte grise - verso',
      type: 'image'
    }
  ],
  
  // Exemples de compteur kilométrique
  compteur: [
    {
      src: '/assets/examples/documents/compteur-example-1.jpg',
      alt: 'Exemple compteur kilométrique',
      title: 'Compteur kilométrique',
      type: 'image'
    },
    {
      src: '/assets/examples/documents/compteur-animated.gif',
      alt: 'Animation compteur kilométrique',
      title: 'Comment photographier le compteur',
      type: 'gif'
    }
  ],

  // Exemples d'angles de véhicule
  'vehicle-angles': [
    {
      src: '/assets/examples/vehicles/car-front-left-example.jpg',
      alt: 'Exemple photo avant gauche',
      title: 'Vue avant gauche',
      type: 'image'
    },
    {
      src: '/assets/examples/vehicles/car-rear-left-example.jpg',
      alt: 'Exemple photo arrière gauche', 
      title: 'Vue arrière gauche',
      type: 'image'
    },
    {
      src: '/assets/examples/vehicles/car-rear-right-example.jpg',
      alt: 'Exemple photo arrière droite',
      title: 'Vue arrière droite', 
      type: 'image'
    },
    {
      src: '/assets/examples/vehicles/car-front-right-example.jpg',
      alt: 'Exemple photo avant droite',
      title: 'Vue avant droite',
      type: 'image'
    }
  ],

  // Exemples de dommages
  damages: [
    {
      src: '/assets/examples/damages/damage-close-example.jpg',
      alt: 'Exemple dommage - vue rapprochée',
      title: 'Photo rapprochée du dommage',
      type: 'image'
    },
    {
      src: '/assets/examples/damages/damage-wide-example.jpg',
      alt: 'Exemple dommage - vue d\'ensemble',
      title: 'Photo d\'ensemble du dommage',
      type: 'image'
    },
    {
      src: '/assets/examples/damages/how-to-photograph.gif',
      alt: 'Animation comment photographier les dommages',
      title: 'Comment bien photographier',
      type: 'gif'
    }
  ]
};

// Fonctions utilitaires pour la rétrocompatibilité
// DEPRECATED: Utilise useAssets() hook pour les nouveaux développements

/**
 * @deprecated Utilise useAssets({ category }) à la place
 */
export const getAsset = async (category: keyof typeof EXAMPLES, index?: number): Promise<AssetConfig | AssetConfig[]> => {
  if (!configurationService.isFeatureEnabled('assetAutoDiscovery')) {
    // Fallback vers l'ancienne méthode
    const assets = EXAMPLES[category];
    if (!assets) return [];
    
    if (typeof index === 'number') {
      return assets[index] || assets[0];
    }
    
    return assets;
  }

  // Nouvelle méthode dynamique
  try {
    const discoveredAssets = await assetDiscoveryService.getAssetsByCategory(category);
    
    if (typeof index === 'number') {
      return discoveredAssets[index] || discoveredAssets[0] || [];
    }
    
    return discoveredAssets.map(asset => ({
      src: asset.src,
      alt: asset.alt,
      title: asset.name,
      type: asset.type
    }));
  } catch (error) {
    console.warn('Failed to get dynamic assets, falling back to static config:', error);
    const assets = EXAMPLES[category];
    return assets || [];
  }
};

/**
 * @deprecated Utilise useLogos() hook à la place
 */
export const getLogo = async (type: keyof typeof LOGOS = 'primary'): Promise<LogoConfig> => {
  if (!configurationService.isFeatureEnabled('assetAutoDiscovery')) {
    return LOGOS[type] || LOGOS.primary;
  }

  try {
    const logoAssets = await assetDiscoveryService.getAssetsByCategory('logos');
    const matchingLogo = logoAssets.find(logo => 
      logo.id.includes(type) || logo.name.toLowerCase().includes(type)
    );

    if (matchingLogo) {
      return {
        src: matchingLogo.src,
        alt: matchingLogo.alt,
        type: matchingLogo.type,
        width: 120, // Valeurs par défaut
        height: 40
      };
    }
  } catch (error) {
    console.warn('Failed to get dynamic logo, falling back to static config:', error);
  }

  return LOGOS[type] || LOGOS.primary;
};

// Fonction pour vérifier si un asset existe (peut être étendue avec une vérification réseau)
export const assetExists = (src: string): boolean => {
  // Pour l'instant, retourne true - peut être étendu avec une vérification réelle
  return true;
};

// Fonction pour obtenir le type d'asset depuis l'extension
export const getAssetType = (src: string): 'image' | 'gif' | 'svg' => {
  const extension = src.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'gif':
      return 'gif';
    case 'svg':
      return 'svg';
    default:
      return 'image';
  }
};

// Nouvelle API recommandée
export * from '@/services/assetDiscoveryService';