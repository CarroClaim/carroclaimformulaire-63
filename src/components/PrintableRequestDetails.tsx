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

      {/* Client Information */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 border-b pb-1">
          Informations client
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">{request.first_name} {request.last_name}</p>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <Mail className="h-3 w-3 mr-1" />
              {request.email}
            </p>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <Phone className="h-3 w-3 mr-1" />
              {request.phone}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 flex items-start">
              <MapPin className="h-3 w-3 mr-1 mt-0.5" />
              <span>
                {request.address}<br />
                {request.postal_code} {request.city}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Type de demande */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 border-b pb-1">
          Type de demande
        </h2>
        <p className="capitalize font-medium">{request.request_type}</p>
      </div>

      {/* Rendez-vous */}
      {(request.preferred_date || request.preferred_time) && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 border-b pb-1">
            Rendez-vous souhaité
          </h2>
          <p className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {formatDateTime(request.preferred_date, request.preferred_time)}
          </p>
        </div>
      )}

      {/* Description */}
      {request.description && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 border-b pb-1">
            Description
          </h2>
          <p className="text-sm whitespace-pre-wrap">{request.description}</p>
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

      {/* Photos */}
      {request.photos.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 border-b pb-1">
            Photos jointes ({request.photos.length})
          </h2>
          
          {/* First 4 photos displayed */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {request.photos.slice(0, 4).map((photo, index) => (
              <div key={photo.id} className="text-center">
                <img
                  src={photo.public_url}
                  alt={photo.file_name}
                  className="print-photo w-full rounded border"
                />
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  {photo.photo_type}
                </p>
              </div>
            ))}
          </div>
          
          {/* Additional photos summary if more than 4 */}
          {request.photos.length > 4 && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
              <p className="font-medium">Photos supplémentaires :</p>
              <p className="text-xs">
                {request.photos.length - 4} photo{request.photos.length - 4 > 1 ? 's' : ''} supplémentaire{request.photos.length - 4 > 1 ? 's' : ''} - 
                Types : {[...new Set(request.photos.slice(4).map(p => p.photo_type))].join(', ')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t text-xs text-gray-500">
        <p>Document généré automatiquement le {new Date().toLocaleString('fr-FR')}</p>
      </div>
    </div>
  );
};