// Gestionnaire de plugins pour l'interface d'administration
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Puzzle, 
  Settings, 
  Power, 
  Info, 
  AlertTriangle,
  CheckCircle,
  Download,
  Trash2
} from 'lucide-react';
import { pluginRegistry, Plugin } from '@/services/pluginRegistry';
import { examplePlugin } from '@/plugins/examplePlugin';

export const PluginManager: React.FC = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlugins();
    
    // Enregistre le plugin d'exemple automatiquement
    pluginRegistry.register(examplePlugin);
  }, []);

  const loadPlugins = async () => {
    try {
      setLoading(true);
      const allPlugins = pluginRegistry.getPlugins();
      const pluginStats = pluginRegistry.getStats();
      
      setPlugins(allPlugins);
      setStats(pluginStats);
    } catch (error) {
      console.error('Failed to load plugins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePlugin = async (pluginId: string, enabled: boolean) => {
    try {
      if (enabled) {
        await pluginRegistry.enable(pluginId);
      } else {
        await pluginRegistry.disable(pluginId);
      }
      loadPlugins();
    } catch (error) {
      console.error('Failed to toggle plugin:', error);
    }
  };

  const handleUninstallPlugin = async (pluginId: string) => {
    if (confirm('Êtes-vous sûr de vouloir désinstaller ce plugin ?')) {
      try {
        await pluginRegistry.unregister(pluginId);
        loadPlugins();
      } catch (error) {
        console.error('Failed to uninstall plugin:', error);
      }
    }
  };

  const getPluginIcon = (plugin: Plugin) => {
    if (plugin.enabled) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <Power className="h-4 w-4 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Chargement des plugins...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Gestionnaire de Plugins</h2>
        <p className="text-muted-foreground">
          Gérez les plugins pour étendre les fonctionnalités de l'application.
        </p>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Puzzle className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Actifs</p>
                  <p className="text-2xl font-bold text-green-600">{stats.enabled}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Power className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Inactifs</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.disabled}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Hooks</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.hooks}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Liste des plugins */}
      <div className="space-y-4">
        {plugins.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Puzzle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun plugin installé</h3>
              <p className="text-muted-foreground">
                Les plugins permettent d'étendre les fonctionnalités de l'application.
              </p>
            </CardContent>
          </Card>
        ) : (
          plugins.map(plugin => (
            <Card key={plugin.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getPluginIcon(plugin)}
                    <div>
                      <CardTitle className="text-lg">{plugin.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          v{plugin.version}
                        </Badge>
                        {plugin.author && (
                          <span className="text-xs text-muted-foreground">
                            par {plugin.author}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={plugin.enabled}
                      onCheckedChange={(enabled) => 
                        handleTogglePlugin(plugin.id, enabled)
                      }
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUninstallPlugin(plugin.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {plugin.description}
                </p>
                
                {plugin.dependencies && plugin.dependencies.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Dépendances:</p>
                    <div className="flex flex-wrap gap-1">
                      {plugin.dependencies.map(dep => (
                        <Badge key={dep} variant="secondary" className="text-xs">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {plugin.config && (
                  <div>
                    <p className="text-sm font-medium mb-2">Configuration:</p>
                    <div className="bg-muted p-3 rounded-lg">
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(plugin.config, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Installer de nouveaux plugins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Fonctionnalité à venir : Installation de plugins depuis un marketplace.
            </p>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Info className="h-4 w-4 text-blue-500" />
              <span className="text-sm">
                Pour l'instant, les plugins doivent être ajoutés manuellement dans le code.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};