import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Eye, Calendar, User, Mail, Phone, PlayCircle, CheckCircle, Archive, Trash2, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { RequestProgress } from '@/components/RequestProgress';
import { PhotoViewer } from '@/components/PhotoViewer';
import { zipDownloadService } from '@/services/zipDownloadService';

interface RequestSnapshot {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  request_type: 'quote' | 'appointment';
  created_at: string;
  snapshot_url: string | null;
}

interface RequestDetail {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  status: string;
  request_type: 'quote' | 'appointment';
  description?: string;
  preferred_date?: string;
  preferred_time?: string;
  damage_screenshot?: string;
  created_at: string;
  photos: Array<{
    id: string;
    photo_type: string;
    public_url: string;
    file_name: string;
  }>;
  request_damages: Array<{
    damage_parts: {
      name: string;
      description?: string;
    };
  }>;
}

const Admin: React.FC = () => {
  const [requests, setRequests] = useState<RequestSnapshot[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { toast } = useToast();

  const authenticate = async (username: string, password: string) => {
    const basicAuth = btoa(`${username}:${password}`);
    
    try {
      const response = await fetch('https://buvkkggimmpxgwquakuw.supabase.co/functions/v1/admin-auth', {
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuth', basicAuth);
        loadRequests(basicAuth);
        return true;
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  };

  const loadRequests = async (authHeader?: string, status?: string) => {
    setLoading(true);
    try {
      const auth = authHeader || localStorage.getItem('adminAuth');
      if (!auth) {
        setIsAuthenticated(false);
        return;
      }

      const url = status && status !== 'all' 
        ? `https://buvkkggimmpxgwquakuw.supabase.co/functions/v1/admin-auth?status=${status}`
        : 'https://buvkkggimmpxgwquakuw.supabase.co/functions/v1/admin-auth';

      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('adminAuth');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      setRequests(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error loading requests:', error);
      setError('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    setUpdatingStatus(requestId);
    try {
      const auth = localStorage.getItem('adminAuth');
      if (!auth) return;

      const response = await fetch(`https://buvkkggimmpxgwquakuw.supabase.co/functions/v1/admin-auth?id=${requestId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Refresh the requests list
      await loadRequests(auth, activeTab);
      
      toast({
        title: "Statut mis à jour",
        description: `Le statut a été changé vers "${getStatusLabel(newStatus)}"`,
      });

    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const loadRequestDetail = async (requestId: string) => {
    try {
      const auth = localStorage.getItem('adminAuth');
      if (!auth) return;

      const response = await fetch(`https://buvkkggimmpxgwquakuw.supabase.co/functions/v1/admin-auth?id=${requestId}`, {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch request detail');
      }

      const data = await response.json();
      setSelectedRequest(data);
    } catch (error) {
      console.error('Error loading request detail:', error);
      setError('Erreur lors du chargement du détail');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      await authenticate(credentials.username, credentials.password);
    } catch (error) {
      setError('Identifiants incorrects');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    setCredentials({ username: '', password: '' });
  };

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth) {
      loadRequests(savedAuth);
    } else {
      setLoading(false);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'archived': return 'bg-gray-500';
      case 'deleted': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En cours de traitement';
      case 'completed': return 'Traité';
      case 'archived': return 'Archivé';
      case 'deleted': return 'Supprimé';
      default: return status;
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    loadRequests(undefined, value);
  };

  const getStatusActions = (request: RequestSnapshot) => {
    const actions = [];
    
    switch (request.status) {
      case 'pending':
        actions.push(
          <Button
            key="processing"
            size="sm"
            variant="outline"
            onClick={() => updateRequestStatus(request.id, 'processing')}
            disabled={updatingStatus === request.id}
            className="flex items-center gap-1"
          >
            <PlayCircle className="h-3 w-3" />
            En cours
          </Button>
        );
        break;
        
      case 'processing':
        actions.push(
          <Button
            key="completed"
            size="sm"
            variant="outline"
            onClick={() => updateRequestStatus(request.id, 'completed')}
            disabled={updatingStatus === request.id}
            className="flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Traité
          </Button>
        );
        break;
        
      case 'completed':
        actions.push(
          <Button
            key="archived"
            size="sm"
            variant="outline"
            onClick={() => updateRequestStatus(request.id, 'archived')}
            disabled={updatingStatus === request.id}
            className="flex items-center gap-1"
          >
            <Archive className="h-3 w-3" />
            Archiver
          </Button>
        );
        break;
    }

    // Add delete option for non-deleted requests
    if (request.status !== 'deleted') {
      actions.push(
        <Button
          key="delete"
          size="sm"
          variant="destructive"
          onClick={() => updateRequestStatus(request.id, 'deleted')}
          disabled={updatingStatus === request.id}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-3 w-3" />
          Supprimer
        </Button>
      );
    }

    return actions;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Administration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1">
                  Utilisateur
                </label>
                <input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm">{error}</div>
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Chargement des demandes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Administration des demandes</h1>
          <Button variant="outline" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="processing">En cours</TabsTrigger>
            <TabsTrigger value="completed">Traitées</TabsTrigger>
            <TabsTrigger value="archived">Archivées</TabsTrigger>
            <TabsTrigger value="deleted">Supprimées</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {request.first_name} {request.last_name}
                      </CardTitle>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusLabel(request.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 mr-2" />
                        {request.email}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(request.created_at).toLocaleDateString('fr-FR')}
                      </div>
                      <Badge variant="secondary">
                        {request.request_type === 'quote' ? 'Devis' : 'Rendez-vous'}
                      </Badge>
                    </div>
                    
                    {/* Progress tracking */}
                    <div className="mb-4">
                      <RequestProgress status={request.status} />
                    </div>
                    
                    {request.snapshot_url && (
                      <div className="mb-4">
                        <img
                          src={request.snapshot_url}
                          alt="Aperçu des dommages"
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Button
                        onClick={() => loadRequestDetail(request.id)}
                        className="w-full"
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir les détails
                      </Button>

                      <div className="flex gap-2 flex-wrap">
                        {getStatusActions(request)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {requests.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeTab === 'all' 
                    ? 'Aucune demande trouvée' 
                    : `Aucune demande ${getStatusLabel(activeTab).toLowerCase()}`
                  }
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Détails de la demande - {selectedRequest?.first_name} {selectedRequest?.last_name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="sr-only" id="dialog-description">
            Détails complets de la demande incluant les informations client, photos et dégâts rapportés.
          </div>
          
          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Informations client</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Nom :</strong> {selectedRequest.first_name} {selectedRequest.last_name}</div>
                    <div><strong>Email :</strong> {selectedRequest.email}</div>
                    <div><strong>Téléphone :</strong> {selectedRequest.phone}</div>
                    <div><strong>Adresse :</strong> {selectedRequest.address}, {selectedRequest.city} {selectedRequest.postal_code}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Détails de la demande</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Type :</strong> {selectedRequest.request_type === 'quote' ? 'Devis' : 'Rendez-vous'}</div>
                    <div><strong>Statut :</strong> <Badge className={getStatusColor(selectedRequest.status)}>{getStatusLabel(selectedRequest.status)}</Badge></div>
                    <div><strong>Date de soumission :</strong> {new Date(selectedRequest.created_at).toLocaleString('fr-FR')}</div>
                    {selectedRequest.preferred_date && <div><strong>Date préférée :</strong> {selectedRequest.preferred_date}</div>}
                    {selectedRequest.preferred_time && <div><strong>Heure préférée :</strong> {selectedRequest.preferred_time}</div>}
                  </div>
                </div>
              </div>

              {selectedRequest.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm bg-muted p-3 rounded-md">{selectedRequest.description}</p>
                </div>
              )}

              {selectedRequest.damage_screenshot && (
                <div>
                  <h3 className="font-semibold mb-2">Schéma des dommages</h3>
                  <div className="border rounded-md p-2 bg-white">
                    <img
                      src={selectedRequest.damage_screenshot}
                      alt="Schéma des dommages sélectionnés"
                      className="w-full max-w-md h-auto mx-auto rounded-md"
                    />
                  </div>
                </div>
              )}

              {selectedRequest.request_damages && selectedRequest.request_damages.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Dommages rapportés</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.request_damages.map((damage, index) => (
                      <Badge key={index} variant="secondary">
                        {damage.damage_parts.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedRequest.photos && selectedRequest.photos.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Photos ({selectedRequest.photos.length})</h3>
                    <Button
                      onClick={handleDownloadZip}
                      disabled={downloadingZip}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {downloadingZip ? `${Math.round(downloadProgress)}%` : 'Télécharger ZIP'}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedRequest.photos.map((photo, index) => (
                      <div key={photo.id} className="space-y-2">
                        <img
                          src={photo.public_url}
                          alt={photo.file_name}
                          className="w-full h-32 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            setPhotoViewerIndex(index);
                            setPhotoViewerOpen(true);
                          }}
                        />
                        <p className="text-xs text-muted-foreground text-center">
                          {photo.photo_type}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Photo Viewer */}
      {selectedRequest?.photos && (
        <PhotoViewer
          photos={selectedRequest.photos}
          initialIndex={photoViewerIndex}
          isOpen={photoViewerOpen}
          onClose={() => setPhotoViewerOpen(false)}
        />
      )}
    </div>
  );

  async function handleDownloadZip() {
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
  }
};

export default Admin;