// Composant de status système pour le monitoring
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  RefreshCw,
  ChevronDown,
  Monitor,
  Database,
  Wifi,
  HardDrive
} from 'lucide-react';
import { monitoringService, HealthCheck } from '@/services/monitoringService';
import { useFeatures } from '@/hooks/useFeatures';

interface SystemStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ 
  className,
  showDetails = false 
}) => {
  const [healthReport, setHealthReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(showDetails);
  const { isEnabled } = useFeatures();

  useEffect(() => {
    if (!isEnabled('performanceMonitoring')) {
      setLoading(false);
      return;
    }

    loadHealthReport();
    const interval = setInterval(loadHealthReport, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, [isEnabled]);

  const loadHealthReport = async () => {
    try {
      setLoading(true);
      const report = await monitoringService.getHealthReport();
      setHealthReport(report);
    } catch (error) {
      console.error('Failed to load health report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCheckIcon = (name: string) => {
    if (name.toLowerCase().includes('memory')) return <HardDrive className="h-4 w-4" />;
    if (name.toLowerCase().includes('network') || name.toLowerCase().includes('connectivity')) 
      return <Wifi className="h-4 w-4" />;
    if (name.toLowerCase().includes('storage')) return <Database className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  if (!isEnabled('performanceMonitoring')) {
    return null;
  }

  if (loading && !healthReport) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 animate-spin" />
            <span className="text-sm">Vérification du système...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!healthReport) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm">Monitoring indisponible</span>
            </div>
            <Button size="sm" variant="outline" onClick={loadHealthReport}>
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {getStatusIcon(healthReport.overall)}
                <span>État du système</span>
                <Badge variant="outline" className="text-xs">
                  {healthReport.checks.length} vérifications
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(healthReport.overall)} animate-pulse`} />
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {/* Résumé des vérifications */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-green-50 dark:bg-green-950 p-2 rounded-lg">
                  <div className="text-sm font-medium text-green-700 dark:text-green-300">
                    {healthReport.checks.filter((c: HealthCheck) => c.status === 'healthy').length}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">Sain</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-950 p-2 rounded-lg">
                  <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    {healthReport.checks.filter((c: HealthCheck) => c.status === 'warning').length}
                  </div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">Attention</div>
                </div>
                <div className="bg-red-50 dark:bg-red-950 p-2 rounded-lg">
                  <div className="text-sm font-medium text-red-700 dark:text-red-300">
                    {healthReport.checks.filter((c: HealthCheck) => c.status === 'error').length}
                  </div>
                  <div className="text-xs text-red-600 dark:text-red-400">Erreur</div>
                </div>
              </div>

              {/* Détail des vérifications */}
              <div className="space-y-2">
                {healthReport.checks.map((check: HealthCheck, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 flex-1">
                      {getCheckIcon(check.name)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{check.name}</span>
                          {check.duration && (
                            <span className="text-xs text-muted-foreground">
                              {check.duration}ms
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {check.message}
                        </div>
                      </div>
                    </div>
                    {getStatusIcon(check.status)}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  Dernière vérification: {new Date().toLocaleTimeString('fr-FR')}
                </span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={loadHealthReport}
                  disabled={loading}
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  Actualiser
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};