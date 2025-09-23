import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { RequestProgress } from './RequestProgress';
import { PhotoViewer } from './PhotoViewer';
import CarDamageSelector from './CarDamageSelector';
import { PrintableRequestDetails } from './PrintableRequestDetails';
import { mapDBToUI } from '@/lib/damageMapping';
import { 
  User, Mail, Phone, MapPin, Calendar, Clock, 
  FileText, Camera, Download, Edit, Archive, 
  Check, Play, Trash2, Car, Printer
} from 'lucide-react';

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

interface RequestDetailsProps {
  request: AdminRequestDetail | null;
  loading: boolean;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  getStatusActions: (request: AdminRequestDetail) => React.ReactNode;
  onDownloadZip?: () => void;
}

export const RequestDetails: React.FC<RequestDetailsProps> = ({
  request,
  loading,
  getStatusColor,
  getStatusLabel,
  getStatusActions,
  onDownloadZip
}) => {
  const [photoViewerOpen, setPhotoViewerOpen] = React.useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = React.useState(0);

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Sélectionnez une demande
          </h3>
          <p className="text-sm text-muted-foreground">
            Choisissez une demande dans la liste pour voir les détails
          </p>
        </div>
      </div>
    );
  }

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
    setPhotoViewerOpen(true);
  };

  const formatDateTime = (dateString: string, timeString?: string) => {
    const date = new Date(dateString);
    const dateFormatted = date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (timeString) {
      return `${dateFormatted} à ${timeString}`;
    }
    return dateFormatted;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-y-auto no-print">
      {/* Header */}
      <div className="border-b bg-background p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                {request.first_name.charAt(0)}{request.last_name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {request.first_name} {request.last_name}
                </h1>
                <p className="text-muted-foreground">{request.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className={getStatusColor(request.status)}>
                {getStatusLabel(request.status)}
              </Badge>
              <span className="text-sm text-muted-foreground capitalize">
                {request.request_type}
              </span>
              <span className="text-sm text-muted-foreground">
                Créé le {formatDateTime(request.created_at)}
              </span>
            </div>

            <RequestProgress status={request.status} />
          </div>

          <div className="flex space-x-2">
            {getStatusActions(request)}
            {request.photos.length > 0 && (
              <Button variant="outline" onClick={onDownloadZip}>
                <Download className="h-4 w-4 mr-2" />
                ZIP
              </Button>
            )}
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informations de contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{request.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{request.phone}</span>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <div>{request.address}</div>
                <div>{request.postal_code} {request.city}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Details */}
        {(request.preferred_date || request.preferred_time) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Rendez-vous souhaité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {formatDateTime(request.preferred_date, request.preferred_time)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Description */}
        {request.description && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{request.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Damages - Always show section, even if empty */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="h-5 w-5 mr-2" />
              {request.damages.length > 0 
                ? `Dommages signalés (${request.damages.length})` 
                : 'Aucun dommage signalé'
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* SVG Car Damage Visualization */}
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-8 shadow-lg border border-border max-w-3xl w-full">
                  <div className="relative">
                    <CarDamageSelector
                      selectedAreas={request.damages.map(d => mapDBToUI(d.name))}
                      onAreaSelect={() => {}} // Read-only mode
                    />
                  {request.damages.length > 0 && (
                    <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
                      {request.damages.length}
                    </div>
                  )}
                </div>
                <div className="mt-6 text-center">
                  {request.damages.length > 0 ? (
                    <div className="inline-flex items-center space-x-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full">
                      <div className="w-3 h-3 bg-destructive rounded-full"></div>
                      <span className="text-sm font-medium">
                        Zones endommagées ({request.damages.length} zone{request.damages.length > 1 ? 's' : ''})
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">
                        Véhicule sans dommage visible
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Damage List */}
            {request.damages.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground mb-3">Détail des dommages :</h4>
                {request.damages.map((damage, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-sm">{damage.name}</div>
                      {damage.description && (
                        <div className="text-sm text-muted-foreground">{damage.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Photos */}
        {request.photos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Photos ({request.photos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {request.photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="relative group cursor-pointer"
                    onClick={() => handlePhotoClick(index)}
                  >
                    <img
                      src={photo.public_url}
                      alt={photo.file_name}
                      className="w-full h-40 object-cover rounded-lg group-hover:opacity-90 transition-all duration-300 shadow-sm group-hover:shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <Badge variant="secondary" className="text-xs font-medium bg-white/90 text-gray-900">
                        {photo.photo_type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Photo Viewer */}
      <PhotoViewer
        photos={request.photos}
        initialIndex={selectedPhotoIndex}
        isOpen={photoViewerOpen}
        onClose={() => setPhotoViewerOpen(false)}
      />

      {/* Printable version - hidden on screen, visible when printing */}
      <PrintableRequestDetails
        request={request}
        getStatusColor={getStatusColor}
        getStatusLabel={getStatusLabel}
      />
    </div>
  );
};