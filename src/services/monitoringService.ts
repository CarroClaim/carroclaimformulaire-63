// Service de monitoring et diagnostic en temps réel
// Surveille la santé de l'application et détecte les problèmes

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  timestamp: number;
  details?: Record<string, any>;
  duration?: number;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  category: 'memory' | 'network' | 'render' | 'api' | 'user';
}

export interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  component?: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
  userAgent?: string;
  url?: string;
}

class MonitoringService {
  private healthChecks = new Set<() => Promise<HealthCheck> | HealthCheck>();
  private metrics: PerformanceMetric[] = [];
  private errors: ErrorReport[] = [];
  private isMonitoring = false;
  private checkInterval?: NodeJS.Timeout;
  private maxMetrics = 1000;
  private maxErrors = 500;

  constructor() {
    this.registerDefaultHealthChecks();
  }

  /**
   * Démarre le monitoring
   */
  start(intervalMs = 30000): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.checkInterval = setInterval(() => {
      this.runHealthChecks();
    }, intervalMs);

    // Monitoring des erreurs globales
    window.addEventListener('error', this.handleGlobalError.bind(this));
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));

    // Monitoring des performances
    this.startPerformanceMonitoring();
  }

  /**
   * Arrête le monitoring
   */
  stop(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = undefined;
    }

    window.removeEventListener('error', this.handleGlobalError.bind(this));
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
  }

  /**
   * Enregistre un health check personnalisé
   */
  registerHealthCheck(check: () => Promise<HealthCheck> | HealthCheck): void {
    this.healthChecks.add(check);
  }

  /**
   * Supprime un health check
   */
  unregisterHealthCheck(check: () => Promise<HealthCheck> | HealthCheck): void {
    this.healthChecks.delete(check);
  }

  /**
   * Exécute tous les health checks
   */
  async runHealthChecks(): Promise<HealthCheck[]> {
    const results: HealthCheck[] = [];

    for (const check of this.healthChecks) {
      try {
        const startTime = performance.now();
        const result = await check();
        const duration = performance.now() - startTime;
        
        results.push({
          ...result,
          duration: Math.round(duration * 100) / 100
        });
      } catch (error) {
        results.push({
          name: 'Unknown Check',
          status: 'error',
          message: error instanceof Error ? error.message : 'Check failed',
          timestamp: Date.now()
        });
      }
    }

    return results;
  }

  /**
   * Enregistre une métrique de performance
   */
  recordMetric(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    this.metrics.push({
      ...metric,
      timestamp: Date.now()
    });

    // Garde seulement les métriques récentes
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * Obtient les métriques par catégorie
   */
  getMetrics(category?: PerformanceMetric['category'], limit = 100): PerformanceMetric[] {
    let filtered = category 
      ? this.metrics.filter(m => m.category === category)
      : this.metrics;

    return filtered.slice(-limit);
  }

  /**
   * Enregistre une erreur
   */
  reportError(error: Omit<ErrorReport, 'id' | 'timestamp'>): string {
    const id = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const errorReport: ErrorReport = {
      id,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...error
    };

    this.errors.push(errorReport);

    // Garde seulement les erreurs récentes
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log critique immédiatement
    if (error.severity === 'critical') {
      console.error('CRITICAL ERROR:', errorReport);
    }

    return id;
  }

  /**
   * Obtient les erreurs par sévérité
   */
  getErrors(severity?: ErrorReport['severity'], limit = 50): ErrorReport[] {
    let filtered = severity 
      ? this.errors.filter(e => e.severity === severity)
      : this.errors;

    return filtered.slice(-limit);
  }

  /**
   * Obtient un rapport de santé complet
   */
  async getHealthReport(): Promise<{
    overall: 'healthy' | 'warning' | 'error';
    checks: HealthCheck[];
    metrics: {
      memory: PerformanceMetric[];
      network: PerformanceMetric[];
      render: PerformanceMetric[];
    };
    errors: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
  }> {
    const checks = await this.runHealthChecks();
    const overallStatus = this.determineOverallHealth(checks);

    return {
      overall: overallStatus,
      checks,
      metrics: {
        memory: this.getMetrics('memory', 10),
        network: this.getMetrics('network', 10),
        render: this.getMetrics('render', 10),
      },
      errors: {
        critical: this.getErrors('critical').length,
        high: this.getErrors('high').length,
        medium: this.getErrors('medium').length,
        low: this.getErrors('low').length,
      }
    };
  }

  /**
   * Health checks par défaut
   */
  private registerDefaultHealthChecks(): void {
    // Check de la mémoire
    this.registerHealthCheck(() => {
      const memory = (performance as any).memory;
      if (memory) {
        const usedPercent = (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;
        return {
          name: 'Memory Usage',
          status: usedPercent > 80 ? 'error' : usedPercent > 60 ? 'warning' : 'healthy',
          message: `Memory usage: ${usedPercent.toFixed(1)}%`,
          timestamp: Date.now(),
          details: {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit
          }
        };
      }
      return {
        name: 'Memory Usage',
        status: 'warning',
        message: 'Memory info not available',
        timestamp: Date.now()
      };
    });

    // Check de la connectivité
    this.registerHealthCheck(async () => {
      try {
        const startTime = performance.now();
        const response = await fetch('/favicon.ico', { method: 'HEAD' });
        const duration = performance.now() - startTime;
        
        return {
          name: 'Network Connectivity',
          status: response.ok ? 'healthy' : 'error',
          message: response.ok ? 'Network is responsive' : 'Network issues detected',
          timestamp: Date.now(),
          details: { responseTime: Math.round(duration), status: response.status }
        };
      } catch (error) {
        return {
          name: 'Network Connectivity',
          status: 'error',
          message: 'Network check failed',
          timestamp: Date.now(),
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        };
      }
    });

    // Check du localStorage
    this.registerHealthCheck(() => {
      try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        
        return {
          name: 'Local Storage',
          status: 'healthy',
          message: 'Local storage is working',
          timestamp: Date.now()
        };
      } catch (error) {
        return {
          name: 'Local Storage',
          status: 'error',
          message: 'Local storage is not available',
          timestamp: Date.now()
        };
      }
    });
  }

  /**
   * Démarre le monitoring des performances
   */
  private startPerformanceMonitoring(): void {
    // Observer des performance API
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric({
            name: entry.name,
            value: entry.duration,
            unit: 'ms',
            category: 'render'
          });
        }
      });
      
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    }

    // Monitoring mémoire périodique
    setInterval(() => {
      const memory = (performance as any).memory;
      if (memory) {
        this.recordMetric({
          name: 'heap_used',
          value: memory.usedJSHeapSize,
          unit: 'bytes',
          category: 'memory'
        });
      }
    }, 10000);
  }

  /**
   * Gère les erreurs globales
   */
  private handleGlobalError(event: ErrorEvent): void {
    this.reportError({
      message: event.message,
      stack: event.error?.stack,
      severity: 'high',
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    });
  }

  /**
   * Gère les promesses rejetées
   */
  private handleUnhandledRejection(event: PromiseRejectionEvent): void {
    this.reportError({
      message: `Unhandled promise rejection: ${event.reason}`,
      severity: 'medium',
      context: {
        reason: event.reason
      }
    });
  }

  /**
   * Détermine la santé globale
   */
  private determineOverallHealth(checks: HealthCheck[]): 'healthy' | 'warning' | 'error' {
    if (checks.some(c => c.status === 'error')) return 'error';
    if (checks.some(c => c.status === 'warning')) return 'warning';
    return 'healthy';
  }
}

export const monitoringService = new MonitoringService();