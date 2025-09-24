// Service de configuration centralisé et extensible
// Gère la configuration dynamique de l'application

export interface AppConfig {
  features: FeatureFlags;
  ui: UIConfig;
  assets: AssetConfig;
  admin: AdminConfig;
  api: ApiConfig;
  performance: PerformanceConfig;
}

export interface FeatureFlags {
  statistics: boolean;
  assetAutoDiscovery: boolean;
  advancedAdmin: boolean;
  performanceMonitoring: boolean;
  errorReporting: boolean;
  caching: boolean;
  lazyLoading: boolean;
  pluginSystem: boolean;
}

export interface UIConfig {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  animations: boolean;
  compactMode: boolean;
  debugMode: boolean;
}

export interface AssetConfig {
  maxCacheSize: number;
  cacheTTL: number; // Time to live en millisecondes
  autoRefresh: boolean;
  supportedFormats: string[];
  maxFileSize: number;
}

export interface AdminConfig {
  authTimeout: number;
  autoRefreshInterval: number;
  batchSize: number;
  exportFormats: string[];
}

export interface ApiConfig {
  timeout: number;
  retryAttempts: number;
  rateLimitWindow: number;
  batchSize: number;
}

export interface PerformanceConfig {
  enableServiceWorker: boolean;
  preloadCriticalAssets: boolean;
  lazyLoadThreshold: number;
  imageCaching: boolean;
}

class ConfigurationService {
  private config: AppConfig;
  private listeners = new Set<(config: AppConfig) => void>();
  private storage = window.localStorage;
  private storageKey = 'app_config';

  constructor() {
    this.config = this.loadConfig();
  }

  /**
   * Configuration par défaut
   */
  private getDefaultConfig(): AppConfig {
    return {
      features: {
        statistics: true,
        assetAutoDiscovery: true,
        advancedAdmin: true,
        performanceMonitoring: true,
        errorReporting: true,
        caching: true,
        lazyLoading: true,
        pluginSystem: true,
      },
      ui: {
        theme: 'auto',
        language: 'fr',
        animations: true,
        compactMode: false,
        debugMode: import.meta.env.DEV,
      },
      assets: {
        maxCacheSize: 50 * 1024 * 1024, // 50MB
        cacheTTL: 24 * 60 * 60 * 1000, // 24h
        autoRefresh: true,
        supportedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
        maxFileSize: 10 * 1024 * 1024, // 10MB
      },
      admin: {
        authTimeout: 30 * 60 * 1000, // 30 minutes
        autoRefreshInterval: 30 * 1000, // 30 secondes
        batchSize: 20,
        exportFormats: ['pdf', 'csv', 'json'],
      },
      api: {
        timeout: 30000, // 30 secondes
        retryAttempts: 3,
        rateLimitWindow: 60000, // 1 minute
        batchSize: 10,
      },
      performance: {
        enableServiceWorker: 'serviceWorker' in navigator,
        preloadCriticalAssets: true,
        lazyLoadThreshold: 300, // pixels
        imageCaching: true,
      },
    };
  }

  /**
   * Charge la configuration depuis le stockage local
   */
  private loadConfig(): AppConfig {
    try {
      const stored = this.storage.getItem(this.storageKey);
      if (stored) {
        const parsedConfig = JSON.parse(stored);
        // Merge avec la config par défaut pour gérer les nouvelles propriétés
        return this.mergeConfigs(this.getDefaultConfig(), parsedConfig);
      }
    } catch (error) {
      console.warn('Failed to load config from storage:', error);
    }

    return this.getDefaultConfig();
  }

  /**
   * Fusionne deux configurations
   */
  private mergeConfigs(defaultConfig: AppConfig, userConfig: Partial<AppConfig>): AppConfig {
    return {
      features: { ...defaultConfig.features, ...userConfig.features },
      ui: { ...defaultConfig.ui, ...userConfig.ui },
      assets: { ...defaultConfig.assets, ...userConfig.assets },
      admin: { ...defaultConfig.admin, ...userConfig.admin },
      api: { ...defaultConfig.api, ...userConfig.api },
      performance: { ...defaultConfig.performance, ...userConfig.performance },
    };
  }

  /**
   * Sauvegarde la configuration
   */
  private saveConfig(): void {
    try {
      this.storage.setItem(this.storageKey, JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }

  /**
   * Obtient la configuration complète
   */
  getConfig(): Readonly<AppConfig> {
    return { ...this.config };
  }

  /**
   * Obtient une section spécifique de la configuration
   */
  getSection<K extends keyof AppConfig>(section: K): Readonly<AppConfig[K]> {
    return { ...this.config[section] };
  }

  /**
   * Met à jour une section de la configuration
   */
  updateSection<K extends keyof AppConfig>(
    section: K, 
    updates: Partial<AppConfig[K]>
  ): void {
    this.config[section] = { ...this.config[section], ...updates };
    this.saveConfig();
    this.notifyListeners();
  }

  /**
   * Met à jour la configuration complète
   */
  updateConfig(updates: Partial<AppConfig>): void {
    this.config = this.mergeConfigs(this.config, updates);
    this.saveConfig();
    this.notifyListeners();
  }

  /**
   * Vérifie si une fonctionnalité est activée
   */
  isFeatureEnabled(feature: keyof FeatureFlags): boolean {
    return this.config.features[feature];
  }

  /**
   * Active/désactive une fonctionnalité
   */
  toggleFeature(feature: keyof FeatureFlags, enabled?: boolean): void {
    const newValue = enabled !== undefined ? enabled : !this.config.features[feature];
    this.updateSection('features', { [feature]: newValue });
  }

  /**
   * Obtient une valeur de configuration avec valeur par défaut
   */
  get<T>(path: string, defaultValue?: T): T {
    const keys = path.split('.');
    let current: any = this.config;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue as T;
      }
    }
    
    return current as T;
  }

  /**
   * Définit une valeur de configuration
   */
  set(path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop();
    if (!lastKey) return;

    let current: any = this.config;
    for (const key of keys) {
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[lastKey] = value;
    this.saveConfig();
    this.notifyListeners();
  }

  /**
   * Écoute les changements de configuration
   */
  subscribe(listener: (config: AppConfig) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notifie les listeners des changements
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getConfig());
      } catch (error) {
        console.error('Config listener error:', error);
      }
    });
  }

  /**
   * Remet la configuration à zéro
   */
  reset(): void {
    this.config = this.getDefaultConfig();
    this.saveConfig();
    this.notifyListeners();
  }

  /**
   * Exporte la configuration
   */
  export(): string {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Importe une configuration
   */
  import(configJson: string): boolean {
    try {
      const importedConfig = JSON.parse(configJson);
      this.config = this.mergeConfigs(this.getDefaultConfig(), importedConfig);
      this.saveConfig();
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Failed to import config:', error);
      return false;
    }
  }
}

export const configurationService = new ConfigurationService();