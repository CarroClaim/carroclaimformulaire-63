// Service de découverte automatique des assets
// Scan dynamiquement les dossiers public/assets/ et génère la configuration

export interface DiscoveredAsset {
  id: string;
  name: string;
  src: string;
  alt: string;
  type: 'image' | 'gif' | 'svg';
  category: string;
  size?: number;
  dimensions?: { width: number; height: number };
  lastModified?: number;
}

export interface AssetCategory {
  id: string;
  name: string;
  description: string;
  assets: DiscoveredAsset[];
  count: number;
}

class AssetDiscoveryService {
  private cache = new Map<string, AssetCategory[]>();
  private scanPromise: Promise<AssetCategory[]> | null = null;

  /**
   * Découverte automatique des assets depuis les dossiers publics
   */
  async discoverAssets(): Promise<AssetCategory[]> {
    // Évite les scans multiples simultanés
    if (this.scanPromise) return this.scanPromise;

    this.scanPromise = this.performScan();
    return this.scanPromise;
  }

  private async performScan(): Promise<AssetCategory[]> {
    const categories: AssetCategory[] = [];
    
    // Définition des catégories à scanner
    const assetPaths = [
      { path: '/assets/logos/', category: 'logos', name: 'Logos' },
      { path: '/assets/examples/documents/', category: 'documents', name: 'Documents' },
      { path: '/assets/examples/vehicles/', category: 'vehicles', name: 'Véhicules' },
      { path: '/assets/examples/damages/', category: 'damages', name: 'Dommages' },
    ];

    for (const { path, category, name } of assetPaths) {
      try {
        const assets = await this.scanDirectory(path, category);
        categories.push({
          id: category,
          name,
          description: `Assets ${name.toLowerCase()}`,
          assets,
          count: assets.length
        });
      } catch (error) {
        console.warn(`Failed to scan ${path}:`, error);
        // Créer une catégorie vide même si le scan échoue
        categories.push({
          id: category,
          name,
          description: `Assets ${name.toLowerCase()}`,
          assets: [],
          count: 0
        });
      }
    }

    // Cache le résultat
    this.cache.set('all', categories);
    this.scanPromise = null;

    return categories;
  }

  /**
   * Scan d'un répertoire spécifique
   */
  private async scanDirectory(basePath: string, category: string): Promise<DiscoveredAsset[]> {
    const assets: DiscoveredAsset[] = [];
    
    // Extensions supportées
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
    const gifExtensions = ['gif'];
    const svgExtensions = ['svg'];
    
    // Fichiers potentiels à tester (heuristique)
    const potentialFiles = [
      // Logos
      ...(category === 'logos' ? [
        'logo-primary.png', 'logo-header.png', 'logo-custom.png',
        'logo.png', 'logo.svg', 'brand.png', 'brand.svg'
      ] : []),
      // Documents
      ...(category === 'documents' ? [
        'carte-grise-example-1.jpg', 'carte-grise-example-2.jpg',
        'compteur-example-1.jpg', 'compteur-animated.gif'
      ] : []),
      // Véhicules
      ...(category === 'vehicles' ? [
        'car-front-left-example.jpg', 'car-rear-left-example.jpg',
        'car-rear-right-example.jpg', 'car-front-right-example.jpg'
      ] : []),
      // Dommages
      ...(category === 'damages' ? [
        'damage-close-example.jpg', 'damage-wide-example.jpg',
        'how-to-photograph.gif'
      ] : []),
    ];

    // Test de l'existence des fichiers
    for (const fileName of potentialFiles) {
      const fullPath = `${basePath}${fileName}`;
      
      if (await this.fileExists(fullPath)) {
        const asset = await this.createAssetFromPath(fullPath, category, fileName);
        if (asset) assets.push(asset);
      }
    }

    return assets;
  }

  /**
   * Vérifie si un fichier existe
   */
  private async fileExists(path: string): Promise<boolean> {
    try {
      const response = await fetch(path, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Crée un objet Asset depuis un chemin
   */
  private async createAssetFromPath(
    src: string, 
    category: string, 
    fileName: string
  ): Promise<DiscoveredAsset | null> {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) return null;

    const type = this.getAssetType(extension);
    const id = `${category}-${fileName.replace(/\.[^/.]+$/, "")}`;
    
    return {
      id,
      name: this.generateAssetName(fileName),
      src,
      alt: this.generateAltText(fileName, category),
      type,
      category,
      lastModified: Date.now()
    };
  }

  /**
   * Détermine le type d'asset depuis l'extension
   */
  private getAssetType(extension: string): 'image' | 'gif' | 'svg' {
    if (extension === 'gif') return 'gif';
    if (extension === 'svg') return 'svg';
    return 'image';
  }

  /**
   * Génère un nom lisible pour l'asset
   */
  private generateAssetName(fileName: string): string {
    return fileName
      .replace(/\.[^/.]+$/, "") // Retire l'extension
      .replace(/[-_]/g, ' ') // Remplace - et _ par des espaces
      .replace(/\b\w/g, l => l.toUpperCase()); // Met en forme
  }

  /**
   * Génère un texte alt approprié
   */
  private generateAltText(fileName: string, category: string): string {
    const baseName = this.generateAssetName(fileName);
    const categoryNames = {
      logos: 'Logo',
      documents: 'Exemple de document',
      vehicles: 'Exemple de véhicule',
      damages: 'Exemple de dommage'
    };
    
    const prefix = categoryNames[category as keyof typeof categoryNames] || 'Asset';
    return `${prefix} - ${baseName}`;
  }

  /**
   * Obtient les assets d'une catégorie spécifique
   */
  async getAssetsByCategory(categoryId: string): Promise<DiscoveredAsset[]> {
    const categories = await this.discoverAssets();
    const category = categories.find(c => c.id === categoryId);
    return category?.assets || [];
  }

  /**
   * Recherche d'assets par nom ou catégorie
   */
  async searchAssets(query: string): Promise<DiscoveredAsset[]> {
    const categories = await this.discoverAssets();
    const allAssets = categories.flatMap(c => c.assets);
    
    const lowerQuery = query.toLowerCase();
    return allAssets.filter(asset => 
      asset.name.toLowerCase().includes(lowerQuery) ||
      asset.category.toLowerCase().includes(lowerQuery) ||
      asset.alt.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Invalide le cache et force un nouveau scan
   */
  async refresh(): Promise<AssetCategory[]> {
    this.cache.clear();
    this.scanPromise = null;
    return this.discoverAssets();
  }

  /**
   * Obtient les statistiques des assets
   */
  async getAssetStats(): Promise<{
    totalAssets: number;
    categoriesCount: number;
    byCategory: Record<string, number>;
    byType: Record<string, number>;
  }> {
    const categories = await this.discoverAssets();
    const allAssets = categories.flatMap(c => c.assets);
    
    const byCategory = categories.reduce((acc, cat) => {
      acc[cat.id] = cat.count;
      return acc;
    }, {} as Record<string, number>);

    const byType = allAssets.reduce((acc, asset) => {
      acc[asset.type] = (acc[asset.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAssets: allAssets.length,
      categoriesCount: categories.length,
      byCategory,
      byType
    };
  }
}

export const assetDiscoveryService = new AssetDiscoveryService();