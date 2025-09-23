import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CarDamageSelector from './CarDamageSelector';
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
    <>
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 2cm;
            }
            
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .no-print {
              display: none !important;
            }
            
            .print-only {
              display: block !important;
            }
          }
          
          @media screen {
            .print-only {
              display: none !important;
            }
          }
        `}
      </style>
      
      <div className="print-only bg-white text-black p-8">
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

      {/* Damages with Car Diagram */}
      {request.damages.length > 0 && (
        <div className="mb-6 page-break-inside-avoid">
          <h2 className="text-lg font-semibold mb-3 border-b pb-1 flex items-center">
            <Car className="h-5 w-5 mr-2" />
            Dommages signalés ({request.damages.length})
          </h2>
          
          {/* Car SVG */}
          <div className="flex justify-center mb-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <CarDamageSelector
                selectedAreas={request.damages.map(d => d.name)}
                onAreaSelect={() => {}} // Read-only mode
              />
              <p className="text-xs text-center mt-2 text-gray-600">
                Zones endommagées en rouge ({request.damages.length} zone{request.damages.length > 1 ? 's' : ''})
              </p>
            </div>
          </div>
          
          {/* Damage List */}
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
        </div>
      )}

      {/* Photos Summary */}
      {request.photos.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 border-b pb-1">
            Photos jointes
          </h2>
          <p className="text-sm text-gray-600">
            {request.photos.length} photo{request.photos.length > 1 ? 's' : ''} fournie{request.photos.length > 1 ? 's' : ''}
          </p>
          <div className="text-xs text-gray-500 mt-1">
            Types : {[...new Set(request.photos.map(p => p.photo_type))].join(', ')}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t text-xs text-gray-500">
        <p>Document généré automatiquement le {new Date().toLocaleString('fr-FR')}</p>
      </div>
      </div>
    </>
  );
};