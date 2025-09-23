import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CarDamageSelector from './CarDamageSelector';
import { mapDBToUI } from '@/lib/damageMapping';
import { 
  User, Mail, Phone, MapPin, Calendar, Clock, 
  FileText, Car
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

interface PrintableRequestDetailsProps {
  request: AdminRequestDetail;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export const PrintableRequestDetails: React.FC<PrintableRequestDetailsProps> = ({
  request,
  getStatusColor,
  getStatusLabel
}) => {
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

  return (
    <div className="print-only bg-white text-black p-6 space-y-6">
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 1.5cm;
            }
            
            /* Force SVG color accuracy */
            svg {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            /* Ensure damaged areas show in red */
            svg path[fill="#dc2626"],
            svg path[style*="#dc2626"] {
              fill: #dc2626 !important;
              stroke: #b91c1c !important;
              stroke-width: 2 !important;
            }
            
            /* Photo styling for print */
            .print-photo {
              max-width: 100%;
              max-height: 150px;
              object-fit: cover;
              border: 1px solid #ccc;
            }
            
            .page-break {
              page-break-before: always;
            }
          }
        `}
      </style>
      
      
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Demande de service automobile
              </h1>
              <p className="text-gray-600">Référence: {request.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Créé le {formatDateTime(request.created_at)}
              </p>
              <Badge className={getStatusColor(request.status)}>
                {getStatusLabel(request.status)}
              </Badge>
            </div>
          </div>
        </div>

      {/* Client Information - Enhanced */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">
          Informations complètes du client
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {/* Personal Info */}
          <div>
            <h4 className="font-medium text-sm text-gray-600 mb-2">CONTACT</h4>
            <div className="space-y-1">
              <p className="font-medium flex items-center">
                <User className="h-3 w-3 mr-2" />
                {request.first_name} {request.last_name}
              </p>
              <p className="text-sm flex items-center">
                <Mail className="h-3 w-3 mr-2" />
                {request.email}
              </p>
              <p className="text-sm flex items-center">
                <Phone className="h-3 w-3 mr-2" />
                {request.phone}
              </p>
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-medium text-sm text-gray-600 mb-2">ADRESSE</h4>
            <p className="text-sm flex items-start">
              <MapPin className="h-3 w-3 mr-2 mt-0.5" />
              <span>
                <div className="font-medium">{request.address}</div>
                <div className="text-gray-600">{request.postal_code} {request.city}</div>
              </span>
            </p>
          </div>

          {/* Request Details */}
          <div>
            <h4 className="font-medium text-sm text-gray-600 mb-2">DEMANDE</h4>
            <div className="space-y-1">
              <p className="text-sm flex items-center">
                <FileText className="h-3 w-3 mr-2" />
                <span className="font-medium capitalize">{request.request_type}</span>
              </p>
              <p className="text-sm flex items-center">
                <Calendar className="h-3 w-3 mr-2" />
                Créé le {formatDateTime(request.created_at)}
              </p>
              {(request.preferred_date || request.preferred_time) && (
                <p className="text-sm flex items-center">
                  <Clock className="h-3 w-3 mr-2" />
                  RDV: {formatDateTime(request.preferred_date, request.preferred_time)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Description */}
      {request.description && (
        <div className="mb-8 page-break-inside-avoid">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Description détaillée
          </h2>
          <div className="bg-gray-50 rounded p-4">
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{request.description}</p>
          </div>
        </div>
      )}

      {/* Damages with Car Diagram - Always show */}
      <div className="mb-6 page-break-inside-avoid">
        <h2 className="text-lg font-semibold mb-3 border-b pb-1 flex items-center">
          <Car className="h-5 w-5 mr-2" />
          {request.damages.length > 0 
            ? `Dommages signalés (${request.damages.length})`
            : 'Aucun dommage signalé'
          }
        </h2>
        
        {/* Car SVG */}
        <div className="flex justify-center mb-6">
          <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50" style={{maxWidth: '500px', width: '100%'}}>
            <div className="w-full">
              <CarDamageSelector
                selectedAreas={request.damages.map(d => mapDBToUI(d.name)).filter(name => name)}
                onAreaSelect={() => {}} // Read-only mode
              />
            </div>
            <div className="text-center mt-4 p-2 border rounded">
              {request.damages.length > 0 ? (
                <div className="bg-red-50 border-red-200">
                  <p className="text-sm font-semibold text-red-700">
                    Zones endommagées en rouge ({request.damages.length} zone{request.damages.length > 1 ? 's' : ''})
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 border-green-200">
                  <p className="text-sm font-semibold text-green-700">
                    Véhicule sans dommage visible
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Damage List */}
        {request.damages.length > 0 && (
          <div>
            <h3 className="font-medium text-sm mb-2">Détail des dommages :</h3>
            <div className="space-y-2">
              {request.damages.map((damage, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 border rounded">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-sm">{damage.name}</div>
                    {damage.description && (
                      <div className="text-xs text-gray-600">{damage.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Photos - Enhanced for Print */}
      {request.photos.length > 0 && (
        <div className="mb-8 page-break-inside-avoid">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Photos transmises par le client ({request.photos.length})
          </h2>
          
          {/* Photos organized by type for better printing */}
          <div className="space-y-6">
            {Object.entries(
              request.photos.reduce((acc, photo) => {
                if (!acc[photo.photo_type]) acc[photo.photo_type] = [];
                acc[photo.photo_type].push(photo);
                return acc;
              }, {} as Record<string, typeof request.photos>)
            ).map(([photoType, photos]) => (
              <div key={photoType} className="space-y-3">
                <h3 className="font-medium text-sm border-l-4 border-gray-300 pl-2 capitalize">
                  {photoType.replace('_', ' ')} ({photos.length} photo{photos.length > 1 ? 's' : ''})
                </h3>
                <div className="photo-grid">
                  {photos.slice(0, 4).map((photo) => (
                    <div key={photo.id} className="photo-item">
                      <img
                        src={photo.public_url}
                        alt={photo.file_name}
                        className="w-full h-auto border rounded"
                      />
                      <p className="text-xs text-gray-600 mt-1 truncate">{photo.file_name}</p>
                    </div>
                  ))}
                </div>
                {photos.length > 4 && (
                  <p className="text-xs text-gray-600 italic">
                    + {photos.length - 4} autre{photos.length - 4 > 1 ? 's' : ''} photo{photos.length - 4 > 1 ? 's' : ''} de ce type
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Photos Message for Print */}
      {request.photos.length === 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Photos
          </h2>
          <div className="text-center py-6 border rounded bg-gray-50">
            <p className="text-gray-600">Aucune photo n'a été transmise avec cette demande</p>
          </div>
        </div>
      )}
      {/* Footer */}
      <div className="mt-8 pt-4 border-t text-xs text-gray-500">
        <p>Document généré automatiquement le {new Date().toLocaleString('fr-FR')}</p>
      </div>
    </div>
  );
};