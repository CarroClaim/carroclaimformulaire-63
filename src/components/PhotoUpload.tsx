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
const DocumentExampleGuide = () => {
  return <div className="space-y-3">
      <div className="text-center mb-2">
        <h4 className="text-xs font-semibold text-foreground mb-1">Exemples</h4>
        <p className="text-xs text-muted-foreground">Documents lisibles</p>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {/* Exemple carte grise */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-2 bg-muted/50">
            <h5 className="text-xs font-semibold text-foreground mb-1">Carte grise</h5>
          </div>
          <div className="aspect-[4/3] bg-muted">
            <img src={carteGrisseExample} alt="Exemple de carte grise suisse" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Exemple compteur */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-2 bg-muted/50">
            <h5 className="text-xs font-semibold text-foreground mb-1">Compteur</h5>
          </div>
          <div className="aspect-[4/3] bg-muted">
            <img src={compteurExample} alt="Exemple de compteur kilométrique" className="w-full h-full object-cover" />
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
  return (
    <div className="space-y-3">
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
            <div className="text-center">
              <Camera className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Détail du dommage</p>
            </div>
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
      // For vehicle angles (4 angles)
      return (
        <div className="space-y-3">
          <div className="text-center mb-2">
            <p className="text-muted-foreground text-xs text-center font-bold">Télécharger photos</p>
          </div>
          
          <div className="space-y-3">
            {/* Upload avant gauche */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-2 bg-muted/50">
                <h5 className="text-xs font-semibold text-foreground mb-1">Photo de l'avant gauche</h5>
              </div>
              <div className="aspect-[4/3] bg-muted relative">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id={`${inputId}-avant-gauche`} disabled={photos.length >= maxFiles} />
                <label htmlFor={`${inputId}-avant-gauche`} className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors">
                  <div className="text-center">
                    <Camera className="w-6 h-6 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Cliquer pour uploader</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Upload arrière gauche */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-2 bg-muted/50">
                <h5 className="text-xs font-semibold text-foreground mb-1">Photo de l'arrière gauche</h5>
              </div>
              <div className="aspect-[4/3] bg-muted relative">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id={`${inputId}-arriere-gauche`} disabled={photos.length >= maxFiles} />
                <label htmlFor={`${inputId}-arriere-gauche`} className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors">
                  <div className="text-center">
                    <Camera className="w-6 h-6 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Cliquer pour uploader</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Upload arrière droit */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-2 bg-muted/50">
                <h5 className="text-xs font-semibold text-foreground mb-1">Photo de l'arrière droit</h5>
              </div>
              <div className="aspect-[4/3] bg-muted relative">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id={`${inputId}-arriere-droit`} disabled={photos.length >= maxFiles} />
                <label htmlFor={`${inputId}-arriere-droit`} className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors">
                  <div className="text-center">
                    <Camera className="w-6 h-6 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Cliquer pour uploader</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Upload avant droite */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-2 bg-muted/50">
                <h5 className="text-xs font-semibold text-foreground mb-1">Photo de l'avant droite</h5>
              </div>
              <div className="aspect-[4/3] bg-muted relative">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id={`${inputId}-avant-droite`} disabled={photos.length >= maxFiles} />
                <label htmlFor={`${inputId}-avant-droite`} className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors">
                  <div className="text-center">
                    <Camera className="w-6 h-6 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Cliquer pour uploader</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {photos.length > 0 && (
            <div className="bg-info/10 border border-info/20 rounded-lg p-2">
              <div className="flex items-start space-x-2">
                <Camera className="w-3 h-3 text-info flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-info">Photos ajoutées:</p>
                  <p className="text-xs text-info/80 mt-1">{photos.length}/{maxFiles} photo{maxFiles > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (showDamageExamples || showDocumentExamples) {
      // For damage photos or document photos (simple uploader)
      if (showDocumentExamples) {
        // Specific uploaders for documents (carte grise + compteur)
        return (
          <div className="space-y-3">
            <div className="text-center mb-2">
              <p className="text-muted-foreground text-xs text-center font-bold">Télécharger documents</p>
            </div>
            
            {/* Combined uploader for both documents */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-2 bg-muted/50">
                <h5 className="text-xs font-semibold text-foreground mb-1">Documents officiels</h5>
                <p className="text-xs text-muted-foreground">Carte grise et compteur kilométrique</p>
              </div>
              <div className="p-3 space-y-3">
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple
                  onChange={handleFileChange} 
                  className="hidden" 
                  id={`${inputId}-documents`} 
                  disabled={photos.length >= maxFiles} 
                />
                <label 
                  htmlFor={`${inputId}-documents`} 
                  className="flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors border-2 border-dashed border-muted-foreground/25 rounded-lg p-6"
                >
                  <div className="text-center">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium text-foreground">Cliquer pour ajouter des photos</p>
                    <p className="text-xs text-muted-foreground mt-1">Carte grise et compteur ({photos.length}/{maxFiles} photos)</p>
                  </div>
                </label>
                
                {/* Preview uploaded photos */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                          <img 
                            src={URL.createObjectURL(photo)} 
                            alt={`Document ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <p className="text-xs text-muted-foreground text-center mt-1">
                          {photo.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {photos.length > 0 && (
              <div className="bg-info/10 border border-info/20 rounded-lg p-2">
                <div className="flex items-start space-x-2">
                  <Camera className="w-3 h-3 text-info flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-info">Photos ajoutées:</p>
                    <p className="text-xs text-info/80 mt-1">{photos.length}/{maxFiles} photo{maxFiles > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      // For damage photos (simple uploader)
      return (
        <div className="space-y-3">
          <div className="text-center mb-2">
            <p className="text-muted-foreground text-xs text-center font-bold">Télécharger photos</p>
          </div>
          
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-2 bg-muted/50">
              <h5 className="text-xs font-semibold text-foreground mb-1">{label}</h5>
            </div>
            <div className="aspect-[4/3] bg-muted relative">
              <input 
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleFileChange} 
                className="hidden" 
                id={inputId} 
                disabled={photos.length >= maxFiles} 
              />
              <label 
                htmlFor={inputId} 
                className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors"
              >
                <div className="text-center">
                  <Camera className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Cliquer pour uploader</p>
                  <p className="text-xs text-muted-foreground mt-1">({maxFiles} photo{maxFiles > 1 ? 's' : ''} max)</p>
                </div>
              </label>
            </div>
          </div>

          {photos.length > 0 && (
            <div className="bg-info/10 border border-info/20 rounded-lg p-2">
              <div className="flex items-start space-x-2">
                <Camera className="w-3 h-3 text-info flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-info">Photos ajoutées:</p>
                  <p className="text-xs text-info/80 mt-1">{photos.length}/{maxFiles} photo{maxFiles > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };
  return <div className="space-y-4 mx-0">
      

      {showGuide ? <div className="grid grid-cols-2 gap-2 md:gap-6">
          <div>
            <VehicleAngleGuide />
          </div>
          <div>
            {renderUploadArea()}
          </div>
        </div> : showDocumentExamples ? <div className="grid grid-cols-2 gap-4 items-start">
          <div className="space-y-3">
            <DocumentExampleGuide />
          </div>
          <div className="space-y-3">
            {renderUploadArea()}
          </div>
        </div> : showDamageExamples ? <div className="grid grid-cols-2 gap-4 items-start">
          <div className="space-y-3">
            <DamageExampleGuide />
          </div>
          <div className="space-y-3">
            {renderUploadArea()}
          </div>
        </div> : null}
    </div>;
};