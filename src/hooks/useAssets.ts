// Hook pour accès dynamique aux assets
import { useState, useEffect, useCallback } from 'react';
import { assetDiscoveryService, AssetCategory, DiscoveredAsset } from '@/services/assetDiscoveryService';
import { configurationService } from '@/services/configurationService';

export interface UseAssetsOptions {
  category?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseAssetsReturn {
  assets: DiscoveredAsset[];
  categories: AssetCategory[];
  loading: boolean;
  error: string | null;
  stats: {
    totalAssets: number;
    categoriesCount: number;
    byCategory: Record<string, number>;
    byType: Record<string, number>;
  } | null;
  refresh: () => Promise<void>;
  searchAssets: (query: string) => Promise<DiscoveredAsset[]>;
}

export const useAssets = (options: UseAssetsOptions = {}): UseAssetsReturn => {
  const [assets, setAssets] = useState<DiscoveredAsset[]>([]);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UseAssetsReturn['stats']>(null);

  const { category, autoRefresh = true, refreshInterval = 300000 } = options; // 5 minutes par défaut

  const loadAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [allCategories, assetStats] = await Promise.all([
        assetDiscoveryService.discoverAssets(),
        assetDiscoveryService.getAssetStats()
      ]);

      setCategories(allCategories);
      setStats(assetStats);

      if (category) {
        const categoryAssets = await assetDiscoveryService.getAssetsByCategory(category);
        setAssets(categoryAssets);
      } else {
        const allAssets = allCategories.flatMap(cat => cat.assets);
        setAssets(allAssets);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load assets';
      setError(errorMessage);
      console.error('Asset loading error:', err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  const refresh = useCallback(async () => {
    await assetDiscoveryService.refresh();
    await loadAssets();
  }, [loadAssets]);

  const searchAssets = useCallback(async (query: string): Promise<DiscoveredAsset[]> => {
    try {
      return await assetDiscoveryService.searchAssets(query);
    } catch (err) {
      console.error('Asset search error:', err);
      return [];
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    if (configurationService.isFeatureEnabled('assetAutoDiscovery')) {
      loadAssets();
    }
  }, [loadAssets]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh || !configurationService.isFeatureEnabled('assetAutoDiscovery')) {
      return;
    }

    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refresh]);

  return {
    assets,
    categories,
    loading,
    error,
    stats,
    refresh,
    searchAssets
  };
};

// Hook spécialisé pour les logos
export const useLogos = () => {
  return useAssets({ category: 'logos' });
};

// Hook spécialisé pour les exemples
export const useExamples = (type?: 'documents' | 'vehicles' | 'damages') => {
  return useAssets({ category: type });
};