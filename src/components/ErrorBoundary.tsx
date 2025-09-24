// Composant Error Boundary robuste avec monitoring intégré
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { monitoringService } from '@/services/monitoringService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RotateCcw, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Report l'erreur au monitoring service  
    const errorId = monitoringService.reportError({
      message: error.message,
      stack: error.stack,
      component: errorInfo.componentStack,
      severity: 'high',
      context: {
        errorInfo,
        retryCount: this.retryCount
      }
    });

    this.setState({
      errorInfo,
      errorId
    });

    // Callback personnalisé
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null
      });
    } else {
      // Recharge la page si trop de retries
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Fallback personnalisé
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Interface d'erreur par défaut
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">Une erreur s'est produite</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                L'application a rencontré une erreur inattendue. 
                Nous avons enregistré ce problème et travaillons à le résoudre.
              </p>

              {this.props.showDetails && this.state.error && (
                <details className="bg-muted p-4 rounded-lg">
                  <summary className="cursor-pointer font-medium flex items-center gap-2">
                    <Bug className="h-4 w-4" />
                    Détails techniques
                  </summary>
                  <div className="mt-2 space-y-2">
                    <div>
                      <strong>Erreur:</strong>
                      <pre className="text-xs bg-background p-2 rounded mt-1 overflow-auto">
                        {this.state.error.message}
                      </pre>
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <strong>Stack trace:</strong>
                        <pre className="text-xs bg-background p-2 rounded mt-1 overflow-auto max-h-32">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorId && (
                      <div>
                        <strong>ID d'erreur:</strong>
                        <code className="text-xs bg-background px-2 py-1 rounded">
                          {this.state.errorId}
                        </code>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex justify-center gap-4">
                <Button onClick={this.handleRetry} variant="default">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {this.retryCount < this.maxRetries ? 'Réessayer' : 'Recharger la page'}
                </Button>
                
                <Button 
                  onClick={() => window.location.href = '/'} 
                  variant="outline"
                >
                  Retour à l'accueil
                </Button>
              </div>

              {this.retryCount > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  Tentative {this.retryCount}/{this.maxRetries}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;