import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { AdminLayout } from '@/components/AdminLayout';
import StatisticsDashboard from '@/components/StatisticsDashboard';
import { RequestsList } from '@/components/RequestsList';
import { RequestDetails } from '@/components/RequestDetails';
import { zipDownloadService } from '@/services/zipDownloadService';
import { useAdminState } from '@/hooks/useAdminState';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { getStatusColor, getStatusLabel, getStatusActions } from '@/utils/statusHelpers';
import { useToast } from '@/hooks/use-toast';

const Admin: React.FC = () => {
  // État des téléchargements (non géré par useAdminState car spécifique au composant)
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  // État d'authentification local (pour le formulaire de login)
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  
  const { toast } = useToast();
  const { error, clearError } = useErrorHandler();
  
  // Utiliser le hook centralisé pour l'état admin
  const {
    isAuthenticated,
    authLoading,
    requests,
    selectedRequest,
    selectedRequestId,
    activeSection,
    loading,
    requestDetailLoading,
    updatingStatus,
    authenticate,
    logout,
    loadRequestDetail,
    updateRequestStatus,
    handleSectionChange
  } = useAdminState();

  // Gérer la connexion (utilise le service via le hook)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await authenticate(credentials);
    if (!success) {
      // L'erreur est déjà gérée par useErrorHandler dans useAdminState
    }
  };

  // Gérer la déconnexion
  const handleLogout = () => {
    logout();
    setCredentials({ username: '', password: '' });
  };

  const handleDownloadZip = async () => {
    if (!selectedRequest?.photos || selectedRequest.photos.length === 0) {
      toast({
        title: "Erreur",
        description: "Aucune photo à télécharger",
        variant: "destructive",
      });
      return;
    }

    setDownloadingZip(true);
    setDownloadProgress(0);

    try {
      await zipDownloadService.createAndDownloadZip(
        selectedRequest.photos,
        selectedRequest.id,
        `${selectedRequest.first_name}_${selectedRequest.last_name}`,
        (progress) => setDownloadProgress(progress)
      );

      toast({
        title: "Succès",
        description: "Le fichier ZIP a été téléchargé avec succès",
      });
    } catch (error) {
      console.error('Error downloading ZIP:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement du ZIP",
        variant: "destructive",
      });
    } finally {
      setDownloadingZip(false);
      setDownloadProgress(0);
    }
  };

  // Générer les actions de statut pour un request
  const generateStatusActions = (request: any) => {
    if (!selectedRequest) return [];
    
    const statusActions = getStatusActions(selectedRequest.status);
    return statusActions.map((action) => {
      const IconComponent = action.icon;
      return (
        <Button
          key={action.key}
          size="sm"
          onClick={() => updateRequestStatus(request.id, action.status)}
          disabled={updatingStatus === request.id}
          className={action.className}
          variant={action.key === 'delete' ? 'destructive' : 'default'}
        >
          <IconComponent className="h-4 w-4 mr-1" />
          {action.label}
        </Button>
      );
    });
  };


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connexion Administrateur</CardTitle>
            <CardDescription>
              Connectez-vous pour accéder au portail d'administration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              {error && (
                <div className="text-destructive text-sm">{error}</div>
              )}
              <Button type="submit" className="w-full" disabled={authLoading}>
                {authLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AdminLayout 
      activeSection={activeSection} 
      onSectionChange={handleSectionChange}
      onLogout={handleLogout}
    >
      {activeSection === 'dashboard' && (
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
          </div>
          <StatisticsDashboard />
        </div>
      )}

      {activeSection === 'requests' && (
        <>

          {/* Email-like interface */}
          <div className="flex flex-1">
            <RequestsList
              requests={requests}
              selectedRequestId={selectedRequestId}
              onRequestSelect={loadRequestDetail}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
              loading={loading}
            />
            
            <RequestDetails
              request={selectedRequest}
              loading={requestDetailLoading}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
              getStatusActions={generateStatusActions}
              onDownloadZip={handleDownloadZip}
            />
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Admin;