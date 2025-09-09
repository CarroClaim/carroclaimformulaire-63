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
  return <div className="space-y-4">
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
  const renderUploadArea = () => <div className="space-y-3">
      <div className="text-center mb-2">
        
        <p className="text-muted-foreground text-xs text-center font-bold">Télécharger photos</p>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {/* Upload carte grise */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-2 bg-muted/50">
            <h5 className="text-xs font-semibold text-foreground mb-1">Carte grise</h5>
          </div>
          <div className="aspect-[4/3] bg-muted relative">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id={`${inputId}-carte`} disabled={photos.length >= maxFiles} />
            <label htmlFor={`${inputId}-carte`} className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors">
              <div className="text-center">
                <Camera className="w-6 h-6 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Cliquer pour uploader</p>
              </div>
            </label>
          </div>
        </div>

        {/* Upload compteur */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-2 bg-muted/50">
            <h5 className="text-xs font-semibold text-foreground mb-1">Compteur</h5>
          </div>
          <div className="aspect-[4/3] bg-muted relative">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id={`${inputId}-compteur`} disabled={photos.length >= maxFiles} />
            <label htmlFor={`${inputId}-compteur`} className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors">
              <div className="text-center">
                <Camera className="w-6 h-6 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Cliquer pour uploader</p>
              </div>
            </label>
          </div>
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
  return <div className="space-y-4 mx-0">
      <div>
        
        {description}
      </div>

      {showGuide ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </div> : <>
          {renderUploadArea()}
        </>}
    </div>;
};