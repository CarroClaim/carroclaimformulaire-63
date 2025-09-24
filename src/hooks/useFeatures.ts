// Hook pour gestion des fonctionnalités et feature flags
import { useState, useEffect } from 'react';
import { configurationService, FeatureFlags } from '@/services/configurationService';

export interface UseFeatureReturn {
  isEnabled: (feature: keyof FeatureFlags) => boolean;
  toggleFeature: (feature: keyof FeatureFlags, enabled?: boolean) => void;
  features: FeatureFlags;
  config: ReturnType<typeof configurationService.getConfig>;
  updateConfig: typeof configurationService.updateConfig;
}

export const useFeatures = (): UseFeatureReturn => {
  const [config, setConfig] = useState(configurationService.getConfig());

  useEffect(() => {
    const unsubscribe = configurationService.subscribe(setConfig);
    return unsubscribe;
  }, []);

  const isEnabled = (feature: keyof FeatureFlags): boolean => {
    return config.features[feature];
  };

  const toggleFeature = (feature: keyof FeatureFlags, enabled?: boolean): void => {
    configurationService.toggleFeature(feature, enabled);
  };

  const updateConfig = (updates: Parameters<typeof configurationService.updateConfig>[0]) => {
    configurationService.updateConfig(updates);
  };

  return {
    isEnabled,
    toggleFeature,
    features: config.features,
    config,
    updateConfig
  };
};