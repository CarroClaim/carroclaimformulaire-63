import React from 'react';
import { Camera, X, Car } from 'lucide-react';
import carteGrisseExample from '../assets/carte-grise-suisse-example.jpg';
import compteurExample from '../assets/compteur-kilometrique-example.jpg';
import carRearLeft from '../assets/car-rear-left.png';
import carFrontLeft from '../assets/car-front-left.png';
import carRearRight from '../assets/car-rear-right.png';
import carFrontRight from '../assets/car-front-right.png';
import damageExampleRearRight from '../assets/damage-example-rear-right.jpg';
interface PhotoUploadProps {
  label: string;
  description?: string;
  photos: File[];
  onPhotosChange: (photos: File[]) => void;
  maxFiles?: number;
  showGuide?: boolean;
  showDocumentExamples?: boolean;
  showDamageExamples?: boolean;
  documentType?: 'carte-grise' | 'compteur' | 'both';
}
const VehicleAngleGuide = () => {
  return <div className="space-y-4">
      <div className="text-center mb-3">
        <h4 className="text-sm font-semibold text-foreground mb-1">Exemples</h4>
        <p className="text-xs text-muted-foreground">Angles de prise de vue</p>
      </div>
      
      <div className="space-y-3">
        {/* Photo avant gauche */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-2 bg-muted/50">
            <h5 className="text-xs font-semibold text-foreground">Photo de l'avant gauche</h5>
          </div>
          <div className="aspect-[4/3] bg-muted flex items-center justify-center">
            <div className="text-center">
              <Car className="w-8 h-8 text-primary mx-auto mb-1 -rotate-45" />
              <p className="text-xs text-muted-foreground">Vue avant-gauche</p>
            </div>
          </div>
        </div>

        {/* Photo arrière gauche */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-2 bg-muted/50">
            <h5 className="text-xs font-semibold text-foreground">Photo de l'arrière gauche</h5>
          </div>
          <div className="aspect-[4/3] bg-muted flex items-center justify-center">
            <div className="text-center">
              <Car className="w-8 h-8 text-primary mx-auto mb-1 rotate-[135deg]" />
              <p className="text-xs text-muted-foreground">Vue arrière-gauche</p>
            </div>
          </div>
        </div>

        {/* Photo arrière droit */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-2 bg-muted/50">
            <h5 className="text-xs font-semibold text-foreground">Photo de l'arrière droit</h5>
          </div>
          <div className="aspect-[4/3] bg-muted flex items-center justify-center">
            <div className="text-center">
              <Car className="w-8 h-8 text-primary mx-auto mb-1 rotate-45" />
              <p className="text-xs text-muted-foreground">Vue arrière-droite</p>
            </div>
          </div>
        </div>

        {/* Photo avant droite */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-2 bg-muted/50">
            <h5 className="text-xs font-semibold text-foreground">Photo de l'avant droite</h5>
          </div>
          <div className="aspect-[4/3] bg-muted flex items-center justify-center">
            <div className="text-center">
              <Car className="w-8 h-8 text-primary mx-auto mb-1 -rotate-[135deg]" />
              <p className="text-xs text-muted-foreground">Vue avant-droite</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
const DocumentExampleGuide = ({
  documentType
}: {
  documentType?: string;
}) => {
  if (documentType === 'carte-grise') {
    return <div className="space-y-3">
        {/* Header row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <h4 className="text-xs font-semibold text-foreground mb-1">Exemples</h4>
            <p className="text-xs text-muted-foreground">Document d'immatriculation</p>
          </div>
          <div className="text-center">
            <h4 className="text-xs font-semibold text-foreground mb-1">Télécharger photos</h4>
          </div>
        </div>
        
        {/* Content row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Example column */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="bg-muted flex items-center justify-center" style={{
            width: '136px',
            height: '125px'
          }}>
              <img src={carteGrisseExample} alt="Exemple de carte grise suisse" className="object-cover mx-auto" style={{
              width: '136px',
              height: '125px'
            }} />
            </div>
          </div>
          
          {/* Upload column */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="bg-muted relative" style={{
            width: '136px',
            height: '125px'
          }}>
              <input type="file" accept="image/*" className="hidden" id="upload-carte-grise" />
              <label htmlFor="upload-carte-grise" className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors">
                <div className="text-center">
                  <Camera className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Cliquer pour uploader</p>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-info/10 border border-info/20 rounded-lg p-2">
          <div className="flex items-start space-x-2">
            <Camera className="w-3 h-3 text-info flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-info">Conseils :</p>
              <ul className="text-xs text-info/80 mt-1 space-y-0.5">
                <li>• Documents lisibles</li>
                <li>• Pas de reflets</li>
              </ul>
            </div>
          </div>
        </div>
      </div>;
  }
  if (documentType === 'compteur') {
    return <div className="space-y-3">
        {/* Header row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <h4 className="text-xs font-semibold text-foreground mb-1">Exemples</h4>
            <p className="text-xs text-muted-foreground">Compteur kilométrique</p>
          </div>
          <div className="text-center">
            <h4 className="text-xs font-semibold text-foreground mb-1">Télécharger photos</h4>
          </div>
        </div>
        
        {/* Content row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Example column */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="bg-muted flex items-center justify-center" style={{
            width: '136px',
            height: '125px'
          }}>
              <img src={compteurExample} alt="Exemple de compteur analogique" className="object-cover" style={{
              width: '136px',
              height: '125px'
            }} />
            </div>
          </div>
          
          {/* Upload column */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="bg-muted relative" style={{
            width: '136px',
            height: '125px'
          }}>
              <input type="file" accept="image/*" className="hidden" id="upload-compteur" />
              <label htmlFor="upload-compteur" className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors">
                <div className="text-center">
                  <Camera className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Cliquer pour uploader</p>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-info/10 border border-info/20 rounded-lg p-2">
          <div className="flex items-start space-x-2">
            <Camera className="w-3 h-3 text-info flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-info">Conseils :</p>
              <ul className="text-xs text-info/80 mt-1 space-y-0.5">
                <li>• Kilométrage lisible</li>
                <li>• Photo nette du tableau de bord</li>
              </ul>
            </div>
          </div>
        </div>
      </div>;
  }

  // Fallback for 'both' or undefined
  return <div className="space-y-3">
      {/* Header row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <h4 className="text-xs font-semibold text-foreground mb-1">Exemples</h4>
          <p className="text-xs text-muted-foreground">Documents lisibles</p>
        </div>
        <div className="text-center">
          <h4 className="text-xs font-semibold text-foreground mb-1">Télécharger photos</h4>
        </div>
      </div>
      
      {/* Content rows */}
      <div className="space-y-4">
        {/* Carte grise row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-2 bg-muted/50">
              <h5 className="text-xs font-semibold text-foreground mb-1">Carte grise</h5>
            </div>
            <div className="bg-muted flex items-center justify-center" style={{
            width: '136px',
            height: '125px'
          }}>
              <img src={carteGrisseExample} alt="Exemple de carte grise suisse" className="object-cover mx-auto" style={{
              width: '136px',
              height: '125px'
            }} />
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-2 bg-muted/50">
              <h5 className="text-xs font-semibold text-foreground mb-1">Carte grise</h5>
            </div>
            <div className="bg-muted relative" style={{
            width: '136px',
            height: '125px'
          }}>
              <input type="file" accept="image/*" className="hidden" id="upload-carte-grise-both" />
              <label htmlFor="upload-carte-grise-both" className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors">
                <div className="text-center">
                  <Camera className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Cliquer pour uploader</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Compteur row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-2 bg-muted/50">
              <h5 className="text-xs font-semibold text-foreground mb-1">Compteur</h5>
            </div>
            <div className="bg-muted flex items-center justify-center" style={{
            width: '136px',
            height: '125px'
          }}>
              <img src={compteurExample} alt="Exemple de compteur kilométrique" className="object-cover mx-auto" style={{
              width: '136px',
              height: '125px'
            }} />
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-2 bg-muted/50">
              <h5 className="text-xs font-semibold text-foreground mb-1">Compteur</h5>
            </div>
            <div className="bg-muted relative" style={{
            width: '136px',
            height: '125px'
          }}>
              <input type="file" accept="image/*" className="hidden" id="upload-compteur-both" />
              <label htmlFor="upload-compteur-both" className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors">
                <div className="text-center">
                  <Camera className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Cliquer pour uploader</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-info/10 border border-info/20 rounded-lg p-2">
        <div className="flex items-start space-x-2">
          <Camera className="w-3 h-3 text-info flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-info">Conseils :</p>
            <ul className="text-xs text-info/80 mt-1 space-y-0.5">
              <li>• Documents lisibles</li>
              <li>• Pas de reflets</li>
            </ul>
          </div>
        </div>
      </div>
    </div>;
};
const DamageExampleGuide = () => {
  return <div className="space-y-3">
      <div className="text-center mb-2">
        <h4 className="text-xs font-semibold text-foreground mb-1">Exemples</h4>
        <p className="text-xs text-muted-foreground">Photos de dommages</p>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {/* Exemple photo proche */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-2 bg-muted/50">
            <h5 className="text-xs font-semibold text-foreground mb-1">Photo rapprochée</h5>
          </div>
          <div className="aspect-[4/3] bg-muted flex items-center justify-center">
            <img 
              src={damageExampleRearRight} 
              alt="Exemple de dommage arrière droit" 
              className="object-cover" 
              style={{ width: '136px', height: '125px' }} 
            />
          </div>
        </div>

        {/* Exemple photo éloignée */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-2 bg-muted/50">
            <h5 className="text-xs font-semibold text-foreground mb-1">Photo éloignée</h5>
          </div>
          <div className="aspect-[4/3] bg-muted flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Contexte global</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-info/10 border border-info/20 rounded-lg p-2">
        <div className="flex items-start space-x-2">
          <Camera className="w-3 h-3 text-info flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-info">Conseils :</p>
            <ul className="text-xs text-info/80 mt-1 space-y-0.5">
              <li>• Photos nettes et bien éclairées</li>
              <li>• Différents angles et distances</li>
            </ul>
          </div>
        </div>
      </div>
    </div>;
};
export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  label,
  description,
  photos,
  onPhotosChange,
  maxFiles = 1,
  showGuide = false,
  showDocumentExamples = false,
  showDamageExamples = false,
  documentType = 'both'
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = maxFiles - photos.length;
    const filesToAdd = files.slice(0, remainingSlots);
    onPhotosChange([...photos, ...filesToAdd]);
  };
  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };
  const inputId = `upload-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const renderUploadArea = () => {
    if (showGuide) {
      // For vehicle angles (4 angles) - Grid layout matching reference
      const vehicleAngles = [{
        name: 'Photo de l\'avant-gauche',
        image: carFrontLeft,
        id: 'avant-gauche'
      }, {
        name: 'Photo de l\'arrière-gauche',
        image: carRearLeft,
        id: 'arriere-gauche'
      }, {
        name: 'Photo de l\'arrière-droit',
        image: carRearRight,
        id: 'arriere-droit'
      }, {
        name: 'Photo de l\'avant-droit',
        image: carFrontRight,
        id: 'avant-droit'
      }];
      return <div className="space-y-4">
          {/* Header row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <h4 className="text-sm font-semibold text-foreground">Exemples</h4>
            </div>
            <div className="text-center">
              <h4 className="text-sm font-semibold text-foreground">Télécharger photos</h4>
            </div>
          </div>

          {/* 4 rows for each vehicle angle */}
          <div className="space-y-4">
            {vehicleAngles.map((angle, index) => <div key={angle.id} className="grid grid-cols-2 gap-4">
                {/* Example column */}
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  <div className="p-2 bg-muted/50">
                    <h5 className="text-xs font-semibold text-foreground">{angle.name}</h5>
                  </div>
                  <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                    <div className="text-center p-2">
                      <img src={angle.image} alt={angle.name} className="object-contain mx-auto filter drop-shadow-sm" style={{
                    width: '136px',
                    height: '125px'
                  }} />
                    </div>
                  </div>
                </div>

                {/* Upload column */}
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  <div className="p-2 bg-muted/50">
                    <h5 className="text-xs font-semibold text-foreground">{angle.name}</h5>
                  </div>
                  <div className="aspect-[4/3] bg-muted relative">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id={`${inputId}-${angle.id}`} disabled={photos.length >= maxFiles} />
                    <label htmlFor={`${inputId}-${angle.id}`} className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors">
                      <div className="text-center">
                        <Camera className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="text-xs text-muted-foreground">Cliquer pour uploader</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>)}
          </div>

          {/* Status indicator */}
          {photos.length > 0 && <div className="bg-info/10 border border-info/20 rounded-lg p-3 mt-4">
              <div className="flex items-start space-x-2">
                <Camera className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-info">Photos ajoutées: {photos.length}/{maxFiles}</p>
                  <p className="text-xs text-info/80 mt-1">
                    {photos.map((photo, idx) => photo.name).join(', ')}
                  </p>
                </div>
              </div>
            </div>}
        </div>;
    }
    if (showDamageExamples || showDocumentExamples) {
      // For damage photos or document photos (simple uploader)
      if (showDocumentExamples) {
        // Specific uploaders for individual documents
        return <div className="space-y-4">
            <div className="text-center mb-3">
              
              
            </div>
            
            {/* Upload area */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              
            </div>
          </div>;
      }

      // For damage photos (simple uploader)
      return <div className="space-y-3">
          <div className="text-center mb-2">
            <p className="text-muted-foreground text-xs text-center font-bold">Télécharger photos</p>
          </div>
          
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-2 bg-muted/50">
              <h5 className="text-xs font-semibold text-foreground mb-1">{label}</h5>
            </div>
            <div className="aspect-[4/3] bg-muted relative">
              <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" id={inputId} disabled={photos.length >= maxFiles} />
              <label htmlFor={inputId} className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors">
                <div className="text-center">
                  <Camera className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Cliquer pour uploader</p>
                  <p className="text-xs text-muted-foreground mt-1">({maxFiles} photo{maxFiles > 1 ? 's' : ''} max)</p>
                </div>
              </label>
            </div>
          </div>

          {photos.length > 0 && <div className="bg-info/10 border border-info/20 rounded-lg p-2">
              <div className="flex items-start space-x-2">
                <Camera className="w-3 h-3 text-info flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-info">Photos ajoutées:</p>
                  <p className="text-xs text-info/80 mt-1">{photos.length}/{maxFiles} photo{maxFiles > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>}
        </div>;
    }
    return null;
  };
  return <div className="space-y-4 mx-0">
      {showGuide ? <div className="w-full">
          {renderUploadArea()}
        </div> : showDocumentExamples ? <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 items-start">
            <div className="space-y-3">
              <DocumentExampleGuide documentType={documentType} />
            </div>
            <div className="space-y-3">
              {renderUploadArea()}
            </div>
          </div>
        </div> : showDamageExamples ? <div className="grid grid-cols-2 gap-4 items-start">
          <div className="space-y-3">
            <DamageExampleGuide />
          </div>
          <div className="space-y-3">
            {renderUploadArea()}
          </div>
        </div> : <div>
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground mb-1">{label}</h3>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {renderUploadArea()}
        </div>}
    </div>;
};