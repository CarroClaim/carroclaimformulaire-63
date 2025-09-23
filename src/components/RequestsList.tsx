import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Calendar, MapPin, Mail } from 'lucide-react';
import { RequestProgress } from './RequestProgress';

interface RequestSnapshot {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  request_type: string;
  created_at: string;
  snapshot_url?: string;
}

interface RequestsListProps {
  requests: RequestSnapshot[];
  selectedRequestId: string | null;
  onRequestSelect: (requestId: string) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  loading?: boolean;
}

export const RequestsList: React.FC<RequestsListProps> = ({
  requests,
  selectedRequestId,
  onRequestSelect,
  getStatusColor,
  getStatusLabel,
  loading = false
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredRequests = requests.filter(request => 
    `${request.first_name} ${request.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 
      'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-red-500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Aujourd'hui";
    if (diffDays === 2) return "Hier";
    if (diffDays <= 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="w-80 border-r bg-muted/20 p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r bg-muted/20 flex flex-col">
      {/* Search Header */}
      <div className="p-4 border-b bg-background">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher des demandes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Requests List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune demande trouvée</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <Card
                key={request.id}
                className={`p-3 cursor-pointer transition-all hover:bg-muted/50 ${
                  selectedRequestId === request.id 
                    ? 'bg-primary/10 border-primary' 
                    : 'hover:shadow-sm'
                }`}
                onClick={() => onRequestSelect(request.id)}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(request.first_name)}`}>
                    {getInitials(request.first_name, request.last_name)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm truncate">
                        {request.first_name} {request.last_name}
                      </h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getStatusColor(request.status)}`}
                      >
                        {getStatusLabel(request.status)}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground truncate mb-2">
                      {request.email}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(request.created_at)}
                      </span>
                      <span className="capitalize text-xs">
                        {request.request_type}
                      </span>
                    </div>

                    {/* Progress indicator */}
                    <div className="mt-2">
                      <RequestProgress status={request.status} />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};