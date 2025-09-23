import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Calendar, User, Mail, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

  const loadRequests = async (authHeader?: string) => {
    setLoading(true);
    try {
      const auth = authHeader || localStorage.getItem('adminAuth');
      if (!auth) {
        setIsAuthenticated(false);
        return;
      }

      const response = await fetch('https://buvkkggimmpxgwquakuw.supabase.co/functions/v1/admin-auth', {
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
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En cours';
      case 'completed': return 'Terminé';
      case 'failed': return 'Échec';
      default: return status;
    }
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <Card key={request.id} className="cursor-pointer hover:shadow-lg transition-shadow">
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
                
                {request.snapshot_url && (
                  <div className="mb-4">
                    <img
                      src={request.snapshot_url}
                      alt="Aperçu des dommages"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}

                <Button
                  onClick={() => loadRequestDetail(request.id)}
                  className="w-full"
                  variant="outline"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Voir les détails
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {requests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune demande trouvée</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Détails de la demande - {selectedRequest?.first_name} {selectedRequest?.last_name}
            </DialogTitle>
          </DialogHeader>
          
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
                  <h3 className="font-semibold mb-2">Photos ({selectedRequest.photos.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedRequest.photos.map((photo) => (
                      <div key={photo.id} className="space-y-2">
                        <img
                          src={photo.public_url}
                          alt={photo.file_name}
                          className="w-full h-32 object-cover rounded-md border"
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
    </div>
  );
};

export default Admin;