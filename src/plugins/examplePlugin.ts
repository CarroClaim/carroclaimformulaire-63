// Plugin d'exemple pour démontrer le système de plugins
import { Plugin } from '@/services/pluginRegistry';
import { configurationService } from '@/services/configurationService';
import { monitoringService } from '@/services/monitoringService';

export const examplePlugin: Plugin = {
  id: 'example-plugin',
  name: 'Plugin d\'Exemple',
  version: '1.0.0',
  description: 'Un plugin d\'exemple qui démontre les capacités du système de plugins',
  author: 'Système',
  enabled: true,
  
  lifecycle: {
    async onInstall() {
      console.log('Example Plugin: Installation...');
      
      // Configuration par défaut du plugin
      configurationService.set('plugins.example.greeting', 'Bonjour depuis le plugin!');
      configurationService.set('plugins.example.color', '#3b82f6');
    },

    async onEnable() {
      console.log('Example Plugin: Activation...');
      
      // Enregistre un health check personnalisé
      monitoringService.registerHealthCheck(() => ({
        name: 'Example Plugin Status',
        status: 'healthy',
        message: 'Le plugin d\'exemple fonctionne correctement',
        timestamp: Date.now(),
        details: {
          greeting: configurationService.get('plugins.example.greeting'),
          isActive: true
        }
      }));

      // Émet un événement personnalisé
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('example-plugin-ready', {
          detail: { 
            message: configurationService.get('plugins.example.greeting'),
            timestamp: Date.now()
          }
        }));
      }, 1000);
    },

    async onDisable() {
      console.log('Example Plugin: Désactivation...');
      
      // Nettoyage si nécessaire
      window.dispatchEvent(new CustomEvent('example-plugin-disabled'));
    },

    async onUninstall() {
      console.log('Example Plugin: Désinstallation...');
      
      // Supprime la configuration
      configurationService.set('plugins.example', null);
    },

    async onConfigChange(config) {
      console.log('Example Plugin: Configuration mise à jour:', config);
      
      // Réagit aux changements de configuration
      if (config.greeting) {
        window.dispatchEvent(new CustomEvent('example-plugin-greeting-changed', {
          detail: { greeting: config.greeting }
        }));
      }
    }
  },

  config: {
    greeting: 'Bonjour depuis le plugin!',
    color: '#3b82f6',
    showNotifications: true
  }
};

// Fonctions utilitaires du plugin
export const examplePluginUtils = {
  /**
   * Affiche une notification du plugin
   */
  showNotification(message: string) {
    if (configurationService.get('plugins.example.showNotifications')) {
      // Utilise l'API de notification si disponible
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Plugin d\'Exemple', { body: message });
      } else {
        console.log('Plugin Notification:', message);
      }
    }
  },

  /**
   * Obtient la configuration du plugin
   */
  getConfig() {
    return {
      greeting: configurationService.get('plugins.example.greeting'),
      color: configurationService.get('plugins.example.color'),
      showNotifications: configurationService.get('plugins.example.showNotifications')
    };
  },

  /**
   * Met à jour la configuration du plugin
   */
  updateConfig(updates: Record<string, any>) {
    Object.entries(updates).forEach(([key, value]) => {
      configurationService.set(`plugins.example.${key}`, value);
    });
  }
};