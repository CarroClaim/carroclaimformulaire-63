import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import html2canvas from 'html2canvas';

interface Vehicle2DSelectorProps {
  selectedDamages: string[];
  onSelectionChange: (damages: string[]) => void;
  onCapture?: (captureBlob: Blob) => void;
}

const Vehicle2DSelector: React.FC<Vehicle2DSelectorProps> = ({
  selectedDamages,
  onSelectionChange,
  onCapture
}) => {
  const vehicleRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const damageAreas = [
    // Avant
    { id: 'pare_chocs_avant', name: 'Pare-chocs avant', x: 40, y: 20, width: 20, height: 8 },
    { id: 'capot', name: 'Capot', x: 35, y: 30, width: 30, height: 20 },
    { id: 'phare_avant_gauche', name: 'Phare avant gauche', x: 25, y: 25, width: 8, height: 6 },
    { id: 'phare_avant_droit', name: 'Phare avant droit', x: 67, y: 25, width: 8, height: 6 },
    
    // Latéral gauche
    { id: 'aile_avant_gauche', name: 'Aile avant gauche', x: 15, y: 35, width: 15, height: 15 },
    { id: 'portiere_avant_gauche', name: 'Portière avant gauche', x: 15, y: 55, width: 15, height: 20 },
    { id: 'portiere_arriere_gauche', name: 'Portière arrière gauche', x: 15, y: 80, width: 15, height: 20 },
    { id: 'aile_arriere_gauche', name: 'Aile arrière gauche', x: 15, y: 105, width: 15, height: 15 },
    
    // Latéral droit
    { id: 'aile_avant_droite', name: 'Aile avant droite', x: 70, y: 35, width: 15, height: 15 },
    { id: 'portiere_avant_droite', name: 'Portière avant droite', x: 70, y: 55, width: 15, height: 20 },
    { id: 'portiere_arriere_droite', name: 'Portière arrière droite', x: 70, y: 80, width: 15, height: 20 },
    { id: 'aile_arriere_droite', name: 'Aile arrière droite', x: 70, y: 105, width: 15, height: 15 },
    
    // Centre
    { id: 'toit', name: 'Toit', x: 35, y: 55, width: 30, height: 40 },
    
    // Arrière
    { id: 'coffre', name: 'Coffre/Hayon', x: 35, y: 100, width: 30, height: 20 },
    { id: 'pare_chocs_arriere', name: 'Pare-chocs arrière', x: 40, y: 125, width: 20, height: 8 },
    { id: 'feu_arriere_gauche', name: 'Feu arrière gauche', x: 25, y: 110, width: 8, height: 6 },
    { id: 'feu_arriere_droit', name: 'Feu arrière droit', x: 67, y: 110, width: 8, height: 6 }
  ];

  const toggleDamage = (damageId: string) => {
    const newSelection = selectedDamages.includes(damageId)
      ? selectedDamages.filter(id => id !== damageId)
      : [...selectedDamages, damageId];
    onSelectionChange(newSelection);
  };

  const captureSelection = async () => {
    if (!vehicleRef.current || !onCapture) return;
    
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(vehicleRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      canvas.toBlob((blob) => {
        if (blob) {
          onCapture(blob);
        }
      }, 'image/png', 0.9);
    } catch (error) {
      console.error('Erreur lors de la capture:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Sélection visuelle des dommages</h3>
        <p className="text-sm text-muted-foreground">Cliquez sur les zones endommagées du véhicule</p>
      </div>

      {/* Vue 2D du véhicule */}
      <div ref={vehicleRef} className="relative bg-white border-2 border-border rounded-lg p-8 mx-auto" style={{ width: '400px', height: '600px' }}>
        <div className="relative w-full h-full">
          {/* Contour du véhicule */}
          <svg
            viewBox="0 0 100 150"
            className="w-full h-full absolute inset-0"
            style={{ zIndex: 1 }}
          >
            {/* Corps principal du véhicule */}
            <path
              d="M 30 25 L 70 25 L 85 40 L 85 110 L 70 125 L 30 125 L 15 110 L 15 40 Z"
              fill="none"
              stroke="#333"
              strokeWidth="2"
            />
            {/* Pare-brise avant */}
            <path d="M 35 25 L 65 25 L 65 35 L 35 35 Z" fill="none" stroke="#333" strokeWidth="1" />
            {/* Lunette arrière */}
            <path d="M 35 115 L 65 115 L 65 125 L 35 125 Z" fill="none" stroke="#333" strokeWidth="1" />
            {/* Roues */}
            <circle cx="20" cy="45" r="4" fill="none" stroke="#333" strokeWidth="1" />
            <circle cx="80" cy="45" r="4" fill="none" stroke="#333" strokeWidth="1" />
            <circle cx="20" cy="105" r="4" fill="none" stroke="#333" strokeWidth="1" />
            <circle cx="80" cy="105" r="4" fill="none" stroke="#333" strokeWidth="1" />
          </svg>

          {/* Zones cliquables */}
          {damageAreas.map((area) => {
            const isSelected = selectedDamages.includes(area.id);
            return (
              <div
                key={area.id}
                className={`absolute cursor-pointer border-2 rounded transition-all duration-200 flex items-center justify-center text-xs font-medium ${
                  isSelected
                    ? 'bg-red-500/80 border-red-600 text-white shadow-lg'
                    : 'bg-transparent border-gray-300 hover:bg-blue-100 hover:border-blue-400'
                }`}
                style={{
                  left: `${area.x}%`,
                  top: `${area.y}%`,
                  width: `${area.width}%`,
                  height: `${area.height}%`,
                  zIndex: 2
                }}
                onClick={() => toggleDamage(area.id)}
                title={area.name}
              >
                {isSelected && (
                  <span className="text-xs">✓</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Légende */}
        <div className="absolute bottom-2 left-2 right-2 text-xs text-center text-muted-foreground">
          Vue de dessus du véhicule
        </div>
      </div>

      {/* Liste des sélections */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Dommages sélectionnés ({selectedDamages.length})
          </span>
          {onCapture && (
            <Button
              size="sm"
              variant="outline"
              onClick={captureSelection}
              disabled={isCapturing || selectedDamages.length === 0}
            >
              {isCapturing ? 'Capture...' : 'Capturer la sélection'}
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {selectedDamages.map((damageId) => {
            const area = damageAreas.find(a => a.id === damageId);
            return (
              <Badge
                key={damageId}
                variant="destructive"
                className="cursor-pointer"
                onClick={() => toggleDamage(damageId)}
              >
                {area?.name} ✕
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Vehicle2DSelector;