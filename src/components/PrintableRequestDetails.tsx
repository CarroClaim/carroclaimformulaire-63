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
              margin: 1.5cm;
            }
            
            /* Hide everything except our printable content */
            body * {
              visibility: hidden;
            }
            
            .print-only, .print-only * {
              visibility: visible;
            }
            
            .print-only {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              background: white !important;
              color: black !important;
            }
            
            /* Ensure SVG prints correctly */
            svg {
              max-width: 100% !important;
              height: auto !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            /* Force red color for damaged areas in SVG */
            svg path[style*="#dc2626"] {
              fill: #dc2626 !important;
              stroke: #b91c1c !important;
              stroke-width: 2 !important;
            }
            
            /* Hide buttons and interactive elements */
            button {
              display: none !important;
            }
            
            /* Optimize text for print */
            .print-text {
              color: black !important;
              background: transparent !important;
            }
            
            /* Ensure proper spacing for print */
            .car-damage-container {
              page-break-inside: avoid;
              margin: 1rem 0;
            }
          }
          
          @media screen {
            .print-only {
              display: none !important;
            }
          }
        `}
      </style>
      
      <div className="print-only bg-white text-black p-6 print-text">
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
            <div className="border rounded-lg p-4 bg-gray-50 car-damage-container" style={{maxWidth: '400px'}}>
              <div className="w-full" style={{transform: 'scale(0.9)', transformOrigin: 'center'}}>
                <CarDamageSelector
                  selectedAreas={request.damages.map(d => d.name)}
                  onAreaSelect={() => {}} // Read-only mode
                />
              </div>
              <p className="text-xs text-center mt-2 text-gray-600 print-text">
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