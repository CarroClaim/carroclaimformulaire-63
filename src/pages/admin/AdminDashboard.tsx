import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  LogOut, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Calendar,
  Eye,
  Filter
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Request {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  request_type: 'quote' | 'appointment';
  status: string;
  created_at: string;
  damage_screenshot?: string;
  description?: string;
  preferred_date?: string;
  preferred_time?: string;
}

const AdminDashboard = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    quotes: 0,
    appointments: 0
  });
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [requests, filter]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequests(data || []);
      
      // Calculate stats
      const stats = {
        total: data?.length || 0,
        pending: data?.filter(r => r.status === 'pending').length || 0,
        completed: data?.filter(r => r.status === 'completed').length || 0,
        quotes: data?.filter(r => r.request_type === 'quote').length || 0,
        appointments: data?.filter(r => r.request_type === 'appointment').length || 0
      };
      setStats(stats);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des demandes');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = requests;

    if (filter !== 'all') {
      if (filter === 'quote' || filter === 'appointment') {
        filtered = requests.filter(r => r.request_type === filter);
      } else {
        filtered = requests.filter(r => r.status === filter);
      }
    }

    setFilteredRequests(filtered);
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) throw error;

      setRequests(prev => 
        prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r)
      );
      toast.success('Statut mis à jour');
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      in_progress: 'default',
      completed: 'default'
    } as const;
    
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800', 
      completed: 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || colors.pending}>
        {status === 'pending' && 'En attente'}
        {status === 'in_progress' && 'En cours'}
        {status === 'completed' && 'Terminé'}
      </Badge>
    );
  };

  if (isLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Portail Administratif</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Demandes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terminées</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Devis</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.quotes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rendez-vous</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.appointments}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <Filter className="w-4 h-4" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer les demandes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les demandes</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="in_progress">En cours</SelectItem>
              <SelectItem value="completed">Terminées</SelectItem>
              <SelectItem value="quote">Devis</SelectItem>
              <SelectItem value="appointment">Rendez-vous</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Demandes ({filteredRequests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">
                        {request.first_name} {request.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{request.email}</p>
                      <p className="text-sm text-muted-foreground">{request.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(request.status)}
                      <Badge variant="outline">
                        {request.request_type === 'quote' ? 'Devis' : 'Rendez-vous'}
                      </Badge>
                    </div>
                  </div>

                  {request.damage_screenshot && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Dommages sélectionnés:</p>
                      <img 
                        src={request.damage_screenshot} 
                        alt="Dommages véhicule"
                        className="max-w-xs rounded border"
                      />
                    </div>
                  )}

                  {request.description && (
                    <div>
                      <p className="text-sm font-medium mb-1">Description:</p>
                      <p className="text-sm text-muted-foreground">{request.description}</p>
                    </div>
                  )}

                  {request.preferred_date && (
                    <div>
                      <p className="text-sm font-medium mb-1">Date souhaitée:</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.preferred_date).toLocaleDateString('fr-FR')}
                        {request.preferred_time && ` à ${request.preferred_time}`}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Select
                      value={request.status}
                      onValueChange={(value) => updateRequestStatus(request.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="in_progress">En cours</SelectItem>
                        <SelectItem value="completed">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/admin/requests/${request.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Voir détails
                    </Button>
                  </div>
                </div>
              ))}

              {filteredRequests.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune demande trouvée
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;