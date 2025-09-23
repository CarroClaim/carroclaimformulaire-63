import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Calendar, Mail, PlayCircle, CheckCircle, Archive, Trash2 } from 'lucide-react';
import { RequestProgress } from '@/components/RequestProgress';

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

interface RequestsTabProps {
  requests: RequestSnapshot[];
  activeTab: string;
  loadRequestDetail: (id: string) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  getStatusActions: (request: RequestSnapshot) => React.ReactNode[];
}

const RequestsTab: React.FC<RequestsTabProps> = ({
  requests,
  activeTab,
  loadRequestDetail,
  getStatusColor,
  getStatusLabel,
  getStatusActions
}) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default RequestsTab;