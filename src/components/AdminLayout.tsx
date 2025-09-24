import React, { useEffect, useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/contexts/LanguageContext';
import { AdminSidebar } from './AdminSidebar';
import { monitoringService, HealthCheck } from '@/services/monitoringService';
import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeSection,
  onSectionChange,
  onLogout
}) => {
  const { t } = useTranslation();
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'warning' | 'error'>('healthy');
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);

  useEffect(() => {
    // Démarre le monitoring
    monitoringService.start();

    // Check initial
    loadHealthStatus();

    // Check périodique
    const interval = setInterval(loadHealthStatus, 30000); // 30 secondes

    return () => {
      clearInterval(interval);
      monitoringService.stop();
    };
  }, []);

  const loadHealthStatus = async () => {
    try {
      const report = await monitoringService.getHealthReport();
      setHealthStatus(report.overall);
      setHealthChecks(report.checks);
    } catch (error) {
      console.error('Failed to load health status:', error);
      setHealthStatus('error');
    }
  };

  const getHealthIcon = () => {
    switch (healthStatus) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getHealthColor = () => {
    switch (healthStatus) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
    }
  };

  return (
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
      <SidebarProvider>
        {/* Global header with trigger and monitoring */}
        <header className="h-12 flex items-center justify-between border-b bg-background px-4 fixed top-0 left-0 right-0 z-50">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="mr-2" />
            <h1 className="font-semibold">{t('admin.title')}</h1>
            
            {/* Status de santé */}
            <Badge variant="outline" className="flex items-center gap-1">
              {getHealthIcon()}
              <span className="text-xs">
                {healthStatus === 'healthy' && 'Système sain'}
                {healthStatus === 'warning' && 'Avertissements'}
                {healthStatus === 'error' && 'Erreurs'}
              </span>
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Indicateur de monitoring */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Activity className="h-3 w-3" />
              <div className={`w-2 h-2 rounded-full ${getHealthColor()} animate-pulse`} />
            </div>

            {onLogout && (
              <Button variant="outline" onClick={onLogout} size="sm">
                {t('admin.logout')}
              </Button>
            )}
          </div>
        </header>

        <div className="flex min-h-screen w-full pt-12">
          <AdminSidebar 
            activeSection={activeSection} 
            onSectionChange={onSectionChange} 
          />
          
          <main className="flex-1 flex">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};