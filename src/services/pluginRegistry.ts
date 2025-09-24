// Système de plugins modulaire et extensible
// Permet d'ajouter des fonctionnalités sans modifier le code principal

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author?: string;
  enabled: boolean;
  dependencies?: string[];
  lifecycle: PluginLifecycle;
  config?: Record<string, any>;
}

export interface PluginLifecycle {
  onInstall?: () => Promise<void> | void;
  onEnable?: () => Promise<void> | void;
  onDisable?: () => Promise<void> | void;
  onUninstall?: () => Promise<void> | void;
  onConfigChange?: (config: Record<string, any>) => Promise<void> | void;
}

export interface PluginHook<T = any> {
  id: string;
  priority: number;
  handler: (...args: any[]) => T | Promise<T>;
}

export type PluginEvent = {
  type: string;
  data?: any;
  timestamp: number;
  source: string;
};

class PluginRegistry {
  private plugins = new Map<string, Plugin>();
  private hooks = new Map<string, PluginHook[]>();
  private eventListeners = new Map<string, Set<(event: PluginEvent) => void>>();
  private loadOrder: string[] = [];

  /**
   * Enregistre un nouveau plugin
   */
  async register(plugin: Plugin): Promise<boolean> {
    try {
      // Vérifie les dépendances
      if (plugin.dependencies) {
        for (const dep of plugin.dependencies) {
          if (!this.plugins.has(dep)) {
            throw new Error(`Dependency ${dep} not found`);
          }
        }
      }

      // Installe le plugin
      if (plugin.lifecycle.onInstall) {
        await plugin.lifecycle.onInstall();
      }

      this.plugins.set(plugin.id, plugin);
      this.updateLoadOrder();

      // Active automatiquement si enabled
      if (plugin.enabled) {
        await this.enable(plugin.id);
      }

      this.emit('plugin.registered', { pluginId: plugin.id, plugin });
      return true;
    } catch (error) {
      console.error(`Failed to register plugin ${plugin.id}:`, error);
      return false;
    }
  }

  /**
   * Désinstalle un plugin
   */
  async unregister(pluginId: string): Promise<boolean> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return false;

    try {
      // Désactive d'abord
      if (plugin.enabled) {
        await this.disable(pluginId);
      }

      // Désinstalle
      if (plugin.lifecycle.onUninstall) {
        await plugin.lifecycle.onUninstall();
      }

      this.plugins.delete(pluginId);
      this.updateLoadOrder();

      this.emit('plugin.unregistered', { pluginId, plugin });
      return true;
    } catch (error) {
      console.error(`Failed to unregister plugin ${pluginId}:`, error);
      return false;
    }
  }

  /**
   * Active un plugin
   */
  async enable(pluginId: string): Promise<boolean> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin || plugin.enabled) return false;

    try {
      if (plugin.lifecycle.onEnable) {
        await plugin.lifecycle.onEnable();
      }

      plugin.enabled = true;
      this.emit('plugin.enabled', { pluginId, plugin });
      return true;
    } catch (error) {
      console.error(`Failed to enable plugin ${pluginId}:`, error);
      return false;
    }
  }

  /**
   * Désactive un plugin
   */
  async disable(pluginId: string): Promise<boolean> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin || !plugin.enabled) return false;

    try {
      if (plugin.lifecycle.onDisable) {
        await plugin.lifecycle.onDisable();
      }

      plugin.enabled = false;
      this.emit('plugin.disabled', { pluginId, plugin });
      return true;
    } catch (error) {
      console.error(`Failed to disable plugin ${pluginId}:`, error);
      return false;
    }
  }

  /**
   * Met à jour la configuration d'un plugin
   */
  async updateConfig(pluginId: string, config: Record<string, any>): Promise<boolean> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return false;

    try {
      plugin.config = { ...plugin.config, ...config };
      
      if (plugin.lifecycle.onConfigChange) {
        await plugin.lifecycle.onConfigChange(plugin.config);
      }

      this.emit('plugin.configChanged', { pluginId, config: plugin.config });
      return true;
    } catch (error) {
      console.error(`Failed to update config for plugin ${pluginId}:`, error);
      return false;
    }
  }

  /**
   * Obtient la liste des plugins
   */
  getPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Obtient un plugin spécifique
   */
  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * Obtient les plugins actifs
   */
  getEnabledPlugins(): Plugin[] {
    return this.getPlugins().filter(plugin => plugin.enabled);
  }

  /**
   * Enregistre un hook
   */
  registerHook<T>(
    hookName: string, 
    handler: (...args: any[]) => T | Promise<T>,
    priority = 10,
    pluginId?: string
  ): void {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }

    const hook: PluginHook<T> = {
      id: pluginId || `hook-${Date.now()}`,
      priority,
      handler
    };

    const hooks = this.hooks.get(hookName)!;
    hooks.push(hook);
    hooks.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Supprime un hook
   */
  unregisterHook(hookName: string, hookId: string): void {
    const hooks = this.hooks.get(hookName);
    if (hooks) {
      const index = hooks.findIndex(hook => hook.id === hookId);
      if (index >= 0) {
        hooks.splice(index, 1);
      }
    }
  }

  /**
   * Exécute un hook
   */
  async executeHook<T>(hookName: string, ...args: any[]): Promise<T[]> {
    const hooks = this.hooks.get(hookName) || [];
    const results: T[] = [];

    for (const hook of hooks) {
      try {
        const result = await hook.handler(...args);
        results.push(result);
      } catch (error) {
        console.error(`Hook ${hookName}/${hook.id} failed:`, error);
      }
    }

    return results;
  }

  /**
   * Abonne aux événements
   */
  on(eventType: string, listener: (event: PluginEvent) => void): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }

    const listeners = this.eventListeners.get(eventType)!;
    listeners.add(listener);

    return () => listeners.delete(listener);
  }

  /**
   * Émet un événement
   */
  emit(eventType: string, data?: any): void {
    const event: PluginEvent = {
      type: eventType,
      data,
      timestamp: Date.now(),
      source: 'PluginRegistry'
    };

    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error(`Event listener error for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Met à jour l'ordre de chargement basé sur les dépendances
   */
  private updateLoadOrder(): void {
    const plugins = Array.from(this.plugins.values());
    const resolved = new Set<string>();
    const order: string[] = [];

    const resolve = (plugin: Plugin) => {
      if (resolved.has(plugin.id)) return;

      if (plugin.dependencies) {
        for (const depId of plugin.dependencies) {
          const dep = this.plugins.get(depId);
          if (dep) {
            resolve(dep);
          }
        }
      }

      resolved.add(plugin.id);
      order.push(plugin.id);
    };

    plugins.forEach(resolve);
    this.loadOrder = order;
  }

  /**
   * Obtient l'ordre de chargement
   */
  getLoadOrder(): string[] {
    return [...this.loadOrder];
  }

  /**
   * Obtient les statistiques du registry
   */
  getStats(): {
    total: number;
    enabled: number;
    disabled: number;
    hooks: number;
    events: number;
  } {
    const plugins = this.getPlugins();
    return {
      total: plugins.length,
      enabled: plugins.filter(p => p.enabled).length,
      disabled: plugins.filter(p => !p.enabled).length,
      hooks: Array.from(this.hooks.values()).reduce((sum, hooks) => sum + hooks.length, 0),
      events: this.eventListeners.size
    };
  }
}

export const pluginRegistry = new PluginRegistry();