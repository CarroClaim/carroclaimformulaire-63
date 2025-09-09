import React from 'react';
import { Camera, X, Car } from 'lucide-react';
import carteGrisseExample from '../assets/carte-grise-suisse-example.jpg';
import compteurExample from '../assets/compteur-kilometrique-example.jpg';

interface PhotoUploadProps {
  label: string;
  description?: string;
  photos: File[];
  onPhotosChange: (photos: File[]) => void;
  maxFiles?: number;
  showGuide?: boolean;
  showDocumentExamples?: boolean;
}

const VehicleAngleGuide = () => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-3">
        <h4 className="text-sm font-semibold text-foreground mb-1">Exemples de photos à transmettre</h4>
        <p className="text-xs text-muted-foreground">Positionnez-vous à 2-3 mètres du véhicule</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3 p-4 bg-card rounded-lg border border-border">
        <div className="text-center">
          <div className="w-16 h-12 bg-primary/10 mx-auto mb-2 rounded flex items-center justify-center relative">
            <Car className="w-6 h-6 text-primary rotate-0" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full flex items-center justify-center">
              <Camera className="w-2 h-2 text-white" />
            </div>
          </div>
          <p className="text-xs font-medium text-foreground">AVANT</p>
          <p className="text-xs text-muted-foreground">Vue de face complète</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-12 bg-primary/10 mx-auto mb-2 rounded flex items-center justify-center relative">
            <Car className="w-6 h-6 text-primary rotate-180" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full flex items-center justify-center">
              <Camera className="w-2 h-2 text-white" />
            </div>
          </div>
          <p className="text-xs font-medium text-foreground">ARRIÈRE</p>
          <p className="text-xs text-muted-foreground">Vue de dos complète</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-12 bg-primary/10 mx-auto mb-2 rounded flex items-center justify-center relative">
            <Car className="w-6 h-6 text-primary -rotate-90" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full flex items-center justify-center">
              <Camera className="w-2 h-2 text-white" />
            </div>
          </div>
          <p className="text-xs font-medium text-foreground">GAUCHE</p>
          <p className="text-xs text-muted-foreground">Côté conducteur</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-12 bg-primary/10 mx-auto mb-2 rounded flex items-center justify-center relative">
            <Car className="w-6 h-6 text-primary rotate-90" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full flex items-center justify-center">
              <Camera className="w-2 h-2 text-white" />
            </div>
          </div>
          <p className="text-xs font-medium text-foreground">DROITE</p>
          <p className="text-xs text-muted-foreground">Côté passager</p>
        </div>
      </div>
      
      <div className="bg-info/10 border border-info/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Camera className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-info">Conseils pour de bonnes photos :</p>
            <ul className="text-xs text-info/80 mt-1 space-y-1">
              <li>• Éclairage naturel de préférence</li>
              <li>• Véhicule visible en entier sur chaque photo</li>
              <li>• Éviter les reflets et ombres importantes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentExampleGuide = () => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-3">
        <h4 className="text-sm font-semibold text-foreground mb-1">Exemples de documents</h4>
        <p className="text-xs text-muted-foreground">Assurez-vous que tous les détails sont lisibles</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Exemple carte grise */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-3 bg-muted/50">
            <h5 className="text-xs font-semibold text-foreground mb-1">Certificat d'immatriculation (carte grise)</h5>
            <p className="text-xs text-muted-foreground">Document complet et lisible</p>
          </div>
          <div className="aspect-[4/3] bg-muted">
            <img 
              src={carteGrisseExample} 
              alt="Exemple de carte grise suisse" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Exemple compteur */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-3 bg-muted/50">
            <h5 className="text-xs font-semibold text-foreground mb-1">Compteur kilométrique</h5>
            <p className="text-xs text-muted-foreground">Kilométrage clairement visible</p>
          </div>
          <div className="aspect-[4/3] bg-muted">
            <img 
              src={compteurExample} 
              alt="Exemple de compteur kilométrique" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-info/10 border border-info/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Camera className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-info">Points importants :</p>
            <ul className="text-xs text-info/80 mt-1 space-y-1">
              <li>• Tous les champs doivent être lisibles</li>
              <li>• Photo bien cadrée sans coupure</li>
              <li>• Éviter les reflets sur les documents</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  label, 
  description, 
  photos, 
  onPhotosChange, 
  maxFiles = 1, 
  showGuide = false,
  showDocumentExamples = false 
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

  const renderUploadArea = () => (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          multiple={maxFiles > 1}
          onChange={handleFileChange}
          className="hidden"
          id={inputId}
          disabled={photos.length >= maxFiles}
        />
        <label
          htmlFor={inputId}
          className={`
            relative block w-full border-2 border-dashed rounded-xl p-6 text-center 
            transition-all duration-300 cursor-pointer group
            ${photos.length >= maxFiles 
              ? 'border-muted bg-muted/20 cursor-not-allowed' 
              : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5 hover:shadow-primary'
            }
          `}
        >
          <div className="flex flex-col items-center space-y-3">
            <div className={`
              p-3 rounded-full transition-colors duration-300
              ${photos.length >= maxFiles 
                ? 'bg-muted text-muted-foreground' 
                : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
              }
            `}>
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <p className={`text-sm font-medium ${photos.length >= maxFiles ? 'text-muted-foreground' : 'text-foreground'}`}>
                {photos.length >= maxFiles 
                  ? `Limite atteinte (${photos.length}/${maxFiles})`
                  : `Cliquez pour ajouter ${maxFiles === 1 ? 'une photo' : 'des photos'}`
                }
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {photos.length}/{maxFiles} photo{maxFiles > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </label>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted border border-border shadow-sm">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <button
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/80 transition-colors shadow-md"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">{label}</label>
        {description && <p className="text-sm text-muted-foreground mb-3">{description}</p>}
      </div>

      {showGuide ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <VehicleAngleGuide />
          </div>
          <div>
            {renderUploadArea()}
          </div>
        </div>
      ) : showDocumentExamples ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">Exemple de document</h4>
              <p className="text-sm text-muted-foreground">Veuillez télécharger une photo du recto de votre carte grise dépliée afin que nous puissions identifier votre véhicule (voir exemple).</p>
              <p className="text-sm text-muted-foreground mt-2">Veuillez utiliser votre appareil en format paysage.</p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6 text-center">
              <div className="aspect-[4/3] bg-muted rounded border-2 border-dashed border-muted-foreground/25 flex items-center justify-center mb-4">
                <img 
                  src={carteGrisseExample} 
                  alt="Exemple de carte grise suisse" 
                  className="w-full h-full object-contain rounded"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-sm font-semibold text-foreground mb-2">Télécharger votre document</h4>
            </div>
            {renderUploadArea()}
          </div>
        </div>
      ) : (
        <>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              multiple={maxFiles > 1}
              onChange={handleFileChange}
              className="hidden"
              id={inputId}
              disabled={photos.length >= maxFiles}
            />
            <label
              htmlFor={inputId}
              className={`
                relative block w-full border-2 border-dashed rounded-xl p-8 text-center 
                transition-all duration-300 cursor-pointer group
                ${photos.length >= maxFiles 
                  ? 'border-muted bg-muted/20 cursor-not-allowed' 
                  : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5 hover:shadow-primary'
                }
              `}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className={`
                  p-3 rounded-full transition-colors duration-300
                  ${photos.length >= maxFiles 
                    ? 'bg-muted text-muted-foreground' 
                    : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                  }
                `}>
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${photos.length >= maxFiles ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {photos.length >= maxFiles 
                      ? `Limite atteinte (${photos.length}/${maxFiles})`
                      : `Cliquez pour ajouter ${maxFiles === 1 ? 'une photo' : 'des photos'}`
                    }
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {photos.length}/{maxFiles} photo{maxFiles > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </label>
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted border border-border shadow-sm">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/80 transition-colors shadow-md"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};