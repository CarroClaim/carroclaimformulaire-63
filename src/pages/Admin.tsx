import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import { useToast } from '@/hooks/use-toast';
import { AdminLayout } from '@/components/AdminLayout';
import StatisticsDashboard from '@/components/StatisticsDashboard';
import { RequestsList } from '@/components/RequestsList';
import { RequestDetails } from '@/components/RequestDetails';
import { zipDownloadService } from '@/services/zipDownloadService';
import { 
  Play, 
  Check, 
  Archive, 
  Trash2
} from 'lucide-react';

interface RequestSnapshot {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  request_type: 'quote' | 'appointment';
  created_at: string;
  snapshot_url?: string;
}

interface AdminRequestDetail {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  status: string;
  request_type: string;
  description?: string;
  preferred_date?: string;
  preferred_time?: string;
  damage_screenshot?: string;
  created_at: string;
  updated_at: string;
  photos: Array<{
    id: string;
    photo_type: string;
    public_url: string;
    file_name: string;
  }>;
  damages: Array<{
    name: string;
    description?: string;
  }>;
}

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [requests, setRequests] = useState<RequestSnapshot[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<AdminRequestDetail | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const [loading, setLoading] = useState(true);
  const [requestDetailLoading, setRequestDetailLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
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
        return true;
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  };

  const loadRequests = async (authHeader?: string) => {
    setLoading(true);
    try {
      const auth = authHeader || localStorage.getItem('adminAuth');
      if (!auth) {
        setIsAuthenticated(false);
        return;
      }

      const url = 'https://buvkkggimmpxgwquakuw.supabase.co/functions/v1/admin-auth';

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

  const loadRequestDetail = async (requestId: string) => {
    if (!isAuthenticated) return;
    
    setRequestDetailLoading(true);
    setSelectedRequestId(requestId);
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
      // Transform the data to match our AdminRequestDetail interface
      const transformedData: AdminRequestDetail = {
        ...data,
        damages: data.request_damages?.map((rd: any) => ({
          name: rd.damage_parts.name,
          description: rd.damage_parts.description
        })) || []
      };
      setSelectedRequest(transformedData);
    } catch (error) {
      console.error('Error loading request detail:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails de la demande.",
        variant: "destructive",
      });
    } finally {
      setRequestDetailLoading(false);
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
      await loadRequests(auth);

      // Update selected request if it's the same one
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest({ ...selectedRequest, status: newStatus });
      }
      
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
    setActiveSection('dashboard');
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (section === 'requests') {
      loadRequests();
    }
    // Clear selected request when changing sections
    setSelectedRequest(null);
    setSelectedRequestId(null);
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

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth) {
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeSection === 'requests') {
      loadRequests();
    }
  }, [isAuthenticated, activeSection]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-yellow-50';
      case 'processing': return 'bg-blue-500 text-blue-50';
      case 'completed': return 'bg-green-500 text-green-50';
      case 'archived': return 'bg-gray-500 text-gray-50';
      case 'deleted': return 'bg-red-500 text-red-50';
      default: return 'bg-gray-500 text-gray-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En cours';
      case 'completed': return 'Traité';
      case 'archived': return 'Archivé';
      case 'deleted': return 'Supprimé';
      default: return status;
    }
  };

  const getStatusActions = (request: AdminRequestDetail) => {
    const actions = [];
    
    if (request.status === 'pending') {
      actions.push(
        <Button
          key="start"
          size="sm"
          onClick={() => updateRequestStatus(request.id, 'processing')}
          disabled={updatingStatus === request.id}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Play className="h-4 w-4 mr-1" />
          Commencer
        </Button>
      );
    }
    
    if (request.status === 'processing') {
      actions.push(
        <Button
          key="complete"
          size="sm"
          onClick={() => updateRequestStatus(request.id, 'completed')}
          disabled={updatingStatus === request.id}
          className="bg-green-600 hover:bg-green-700"
        >
          <Check className="h-4 w-4 mr-1" />
          Terminer
        </Button>
      );
    }
    
    if (request.status === 'completed') {
      actions.push(
        <Button
          key="archive"
          size="sm"
          onClick={() => updateRequestStatus(request.id, 'archived')}
          disabled={updatingStatus === request.id}
          className="bg-gray-600 hover:bg-gray-700"
        >
          <Archive className="h-4 w-4 mr-1" />
          Archiver
        </Button>
      );
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
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Supprimer
        </Button>
      );
    }
    
    return actions;
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
    >
      {activeSection === 'dashboard' && (
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
            <Button variant="outline" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
          <StatisticsDashboard />
        </div>
      )}

      {activeSection === 'requests' && (
        <>
          {/* Requests tabs header */}
          <div className="border-b bg-background p-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Gestion des demandes</h1>
              <Button variant="outline" onClick={handleLogout}>
                Déconnexion
              </Button>
            </div>
            
          </div>

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
              getStatusActions={getStatusActions}
              onDownloadZip={handleDownloadZip}
            />
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Admin;