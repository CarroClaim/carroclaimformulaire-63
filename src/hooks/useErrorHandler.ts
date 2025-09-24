// Hook centralisé pour la gestion d'erreurs
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ErrorState {
  message: string | null;
  isLoading: boolean;
}

export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleError = (error: unknown, customMessage?: string) => {
    const message = error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite';
    const displayMessage = customMessage || message;
    
    setError(displayMessage);
    
    // Log pour le debugging
    console.error('Error handled:', {
      originalError: error,
      displayMessage,
      timestamp: new Date().toISOString()
    });

    // Toast pour l'utilisateur
    toast({
      title: "Erreur",
      description: displayMessage,
      variant: "destructive",
    });
  };

  const clearError = () => setError(null);

  const handleAsync = async <T>(
    operation: () => Promise<T>,
    loadingMessage?: string,
    errorMessage?: string
  ): Promise<T | null> => {
    try {
      clearError();
      return await operation();
    } catch (err) {
      handleError(err, errorMessage);
      return null;
    }
  };

  return {
    error,
    handleError,
    clearError,
    handleAsync
  };
};