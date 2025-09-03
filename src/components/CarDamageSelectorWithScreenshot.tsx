import React, { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

interface CarDamageSelectorWithScreenshotProps {
  selectedAreas: string[];
  onAreaSelect: (areaId: string) => void;
  onScreenshotCapture?: (screenshot: string) => void;
}

const CarDamageSelectorWithScreenshot: React.FC<CarDamageSelectorWithScreenshotProps> = ({
  selectedAreas,
  onAreaSelect,
  onScreenshotCapture
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const captureScreenshot = useCallback(async () => {
    if (!svgRef.current || selectedAreas.length === 0) {
      toast.error("Veuillez sélectionner au moins une zone endommagée");
      return;
    }

    try {
      const canvas = await html2canvas(svgRef.current.parentElement!, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const screenshot = canvas.toDataURL('image/png');
      onScreenshotCapture?.(screenshot);
      toast.success("Capture d'écran enregistrée");
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      toast.error("Erreur lors de la capture d'écran");
    }
  }, [selectedAreas, onScreenshotCapture]);

  const handleAreaSelect = useCallback((areaId: string) => {
    onAreaSelect(areaId);
    // Auto-capture screenshot after selection
    setTimeout(() => {
      captureScreenshot();
    }, 100);
  }, [onAreaSelect, captureScreenshot]);

  const getPartStyle = (partName: string) => {
    const isSelected = selectedAreas.includes(partName);
    return {
      fill: isSelected ? "hsl(var(--primary))" : "hsl(var(--muted))",
      stroke: isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--border))",
      strokeWidth: "2",
      cursor: "pointer",
      transition: "all 0.3s ease"
    };
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg p-6 flex justify-center bg-background">
        <svg 
          ref={svgRef}
          width="418" 
          height="558" 
          viewBox="0 0 418 558" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-auto max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl"
        >
          <g>
            {/* Portières */}
            <path style={getPartStyle("Portière avant gauche")} d="m 37,195 11.5,-0.5 H 60 74 l 14.5,0.5 v 26 4 c 0,0 0.5,1.5 1,2.5 0.5,1 1,2 1.5,2 h 2 c 1,0 2.3284,1.024 3.5,2 l 4.5,4 3,78 L 90.5,311 74.5,310 56,309 H 38 Z" onClick={() => handleAreaSelect("Portière avant gauche")} />
            <path style={getPartStyle("Portière avant droite")} d="M 382,195.5 370.5,195 H 359 345 l -14.5,0.5 v 26 4 c 0,0 -0.5,1.5 -1,2.5 -0.5,1 -1,2 -1.5,2 h -2 c -1,0 -2.328,1.024 -3.5,2 l -4.5,4 -3,78 13.5,-2.5 16,-1 18.5,-1 h 18 z" onClick={() => handleAreaSelect("Portière avant droite")} />
            <path style={getPartStyle("Portière arrière gauche")} d="m 38,312.5 h 14 l 19.5,0.5 18.5,1 14.5,2.5 2.5,86 c 0,0 -3.305,1.635 -5.5,2.5 -2.2979,0.906 -3.6351,1.288 -6,2 -2.1317,0.642 -3.3088,1.106 -5.5,1.5 -2.5057,0.45 -6.5,0.5 -6.5,0.5 0,0 -1.1297,-4.441 -2.5,-7 -1.5118,-2.823 -2.9433,-4.045 -5,-6.5 -2.7503,-3.283 -4.2428,-5.22 -7.5,-8 -4.534,-3.87 -7.4523,-5.819 -13,-8 -6.0951,-2.396 -16.5,-3 -16.5,-3 z" onClick={() => handleAreaSelect("Portière arrière gauche")} />
            <path style={getPartStyle("Portière arrière droite")} d="m 381,312 h -14 l -19.5,0.5 -18.5,1 -14.5,2.5 -2.5,86 c 0,0 3.305,1.635 5.5,2.5 2.298,0.906 3.635,1.288 6,2 2.132,0.642 3.309,1.106 5.5,1.5 2.506,0.45 6.5,0.5 6.5,0.5 0,0 1.13,-4.441 2.5,-7 1.512,-2.823 2.943,-4.045 5,-6.5 2.75,-3.283 4.243,-5.22 7.5,-8 4.534,-3.87 7.452,-5.819 13,-8 6.095,-2.396 16.5,-3 16.5,-3 z" onClick={() => handleAreaSelect("Portière arrière droite")} />
            
            {/* Rétroviseurs */}
            <path style={getPartStyle("Rétroviseur gauche")} d="m 98.5,230.5 c 5,3 11.5,15.5 10,-18 0,-9.665 -3.529,-17.5 -8.5,-17.5 -12.5,-2.5 -9.5,1.5 -10,18 0.2435,9.422 -3,12.5 8.5,17.5 z" onClick={() => handleAreaSelect("Rétroviseur gauche")} />
            <path style={getPartStyle("Rétroviseur droite")} d="m 320.22,231.183 c -5,3 -11.5,15.5 -10.001,-18 0,-9.665 3.53,-17.5 8.5,-17.5 12.501,-2.5 9.501,1.5 10.001,18 -0.244,9.422 3,12.5 -8.5,17.5 z" onClick={() => handleAreaSelect("Rétroviseur droite")} />
            
            {/* Vitres */}
            <path style={getPartStyle("Vitre avant gauche")} d="m 111,214.5 c 0,0 27.5,39 31,56.5 3.5,17.5 5.5,51 5.5,51 L 106,313.5 c 0,0 -2.5,-72.5 -2.5,-75 0,-2.5 7.5,0 7.5,-8 z" onClick={() => handleAreaSelect("Vitre avant gauche")} />
            <path style={getPartStyle("Vitre avant droite")} d="m 308.5,215 c 0,0 -27.5,39 -31,56.5 -3.5,17.5 -5.5,51 -5.5,51 l 41.5,-8.5 c 0,0 2.5,-72.5 2.5,-75 0,-2.5 -7.5,0 -7.5,-8 z" onClick={() => handleAreaSelect("Vitre avant droite")} />
            <path style={getPartStyle("Vitre arrière gauche")} d="m 107,317 40,7 c 0,0 -2,48 -4.5,55 -2.5,7 -13.5,12 -15.5,13 -2,1 -18,9.5 -18,9.5 z" onClick={() => handleAreaSelect("Vitre arrière gauche")} />
            <path style={getPartStyle("Vitre arrière droite")} d="m 312,317 -40,7 c 0,0 2,48 4.5,55 2.5,7 13.5,12 15.5,13 2,1 18,9.5 18,9.5 z" onClick={() => handleAreaSelect("Vitre arrière droite")} />
            <path style={getPartStyle("Pare-brise")} d="m 130,184 c 0,0 22.077,-12.244 37.5,-16.5 16.296,-4.497 26.094,-5.046 43,-5 16.518,0.045 26.091,0.558 42,5 15.238,4.254 37,16.5 37,16.5 0,0 -7.13,23.043 -11,38 -3.714,14.353 -8.5,37 -8.5,37 0,0 -16.409,-7.031 -27.5,-9.5 -12.252,-2.727 -19.449,-2.885 -32,-3 -13.912,-0.128 -21.966,-0.227 -35.5,3 -10.515,2.508 -26,9.5 -26,9.5 0,0 -4.575,-24.217 -8.5,-39.5 C 136.903,205.497 130,184 130,184 Z" onClick={() => handleAreaSelect("Pare-brise")} />
            <path style={getPartStyle("Lunette arrière")} d="m 154.808,400.5 c 0,0 12.189,4.779 21.192,6.5 12.137,2.32 21.145,2.785 33.5,3 11.144,0.194 21.541,0.03 32.5,-2 10.687,-1.979 22,-8.5 22,-8.5 0,0 0.731,11.597 1.5,19 0.65,6.263 0.903,9.799 2,16 0.941,5.318 1.906,8.211 3,13.5 1.047,5.063 2.5,13 2.5,13 0,0 -6.443,4.997 -11,7.5 -4.832,2.654 -7.729,3.886 -13,5.5 -7.183,2.2 -11.529,2.218 -19,3 -7.584,0.794 -11.877,0.818 -19.5,1 -6.637,0.158 -10.384,0.551 -17,0 -6.91,-0.575 -10.762,-1.364 -17.5,-3 -6.361,-1.545 -10.104,-2.155 -16,-5 -6.195,-2.989 -14.5,-10 -14.5,-10 0,0 2.016,-7.577 3,-12.5 1.315,-6.58 1.475,-10.368 2.5,-17 0.936,-6.059 1.744,-9.415 2.5,-15.5 0.701,-5.642 1.308,-14.5 1.308,-14.5 z" onClick={() => handleAreaSelect("Lunette arrière")} />
            
            {/* Custodes */}
            <path style={getPartStyle("Custode arrière gauche")} d="m 109.5,405 31,-17.5 c 0,0 -6.5,15 -13,24 -6.5,9 -18,19.5 -18,19.5 z" onClick={() => handleAreaSelect("Custode arrière gauche")} />
            <path style={getPartStyle("Custode arrière droite")} d="M 309,404.5 278,387 c 0,0 6.5,15 13,24 6.5,9 18,19.5 18,19.5 z" onClick={() => handleAreaSelect("Custode arrière droite")} />
            
            {/* Carrosserie principale */}
            <path style={getPartStyle("Capot")} d="m 138.25918,72 c 0,0 7.043,-5.0566 12,-7.5 5.761,-2.8398 15.5,-5.5 15.5,-5.5 0,0 2.385,-1.4617 3,-3 0.58,-1.4504 0,-4 0,-4 h 3.5 v 3 c 0,0 22.181,-3.4293 36.5,-3.5 15.097,-0.0746 38.5,3.5 38.5,3.5 l 1,-3 h 3 c 0,0 -0.338,2.667 0.5,4 0.441,0.7014 0.874,0.9579 1.5,1.5 1.85,1.6011 5.5,3 5.5,3 0,0 6.866,2.0496 11,4 4.755,2.2434 11.5,7 11.5,7 0,0 3.851,27.3556 5,45 0.641,9.848 0.609,15.389 1,25.25 0.391,9.861 0.1,15.423 1,25.25 0.574,6.271 2,16 2,16 0,0 -8.741,-4.766 -14.5,-7.5 -5.768,-2.737 -8.977,-4.383 -15,-6.5 -4.605,-1.619 -7.263,-2.32 -12,-3.5 -4.645,-1.157 -7.262,-1.816 -12,-2.5 -4.847,-0.7 -7.612,-0.707 -12.5,-1 -4.877,-0.292 -7.615,-0.441 -12.5,-0.5 0,0 -14.716,-0.341 -24,1 -4.927,0.712 -7.639,1.428 -12.5,2.5 -4.116,0.908 -6.462,1.29 -10.5,2.5 -3.372,1.011 -5.242,1.666 -8.5,3 -3.395,1.39 -5.193,2.412 -8.5,4 -6.691,3.213 -17,8.5 -17,8.5 0,0 1.508,-11.555 2,-19 0.529,-7.991 0.261,-12.495 0.5,-20.5 0.315,-10.547 0.4,-16.466 1,-27 0.991,-17.4202 4,-44.5 4,-44.5 z" onClick={() => handleAreaSelect("Capot")} />
            <path style={getPartStyle("Toit")} d="m 150.5,260 c 0,0 10.5,-10 54,-12 43.5,-2 63.5,11.5 63.5,11.5 0,0 -4,24 -6,69.5 -2,45.5 2,68 2,68 0,0 -13,12 -54.5,11 -41.5,-1 -54.5,-9.5 -54.5,-9.5 0,0 3,-11 1.5,-71 -1.5,-60 -6,-67.5 -6,-67.5 z" onClick={() => handleAreaSelect("Toit")} />
            <path style={getPartStyle("Hayon")} d="m 143.72,462.5 c 0,0 4.983,4.992 9,7 4,2 9.049,4.292 13.55,5.823 4.092,1.392 18.627,5 22.95,5 5,0 10.341,1.275 31,0 5.082,-0.314 17.554,-1.519 22.55,-2.5 5.453,-1.071 8.45,-2.5 13.5,-4.5 2.819,-1.116 5.818,-2.319 8.45,-3.823 3.5,-2 8.55,-5.5 8.55,-5.5 v 9.823 c 0,0 -4.639,0.643 -7.5,1.5 -5.689,1.705 -4.939,1.196 -9.5,5 -1.908,1.592 -4.96,4.867 -5.27,5.177 -2.5,2.5 -5.283,6.513 -5.5,8.323 -0.5,4.177 2.5,5 2.5,5 l 25.27,-2 c 0,0 1.168,5.102 0,8 -1.085,2.692 -2.584,3.89 -5,5.5 -3.349,2.233 -6.068,2.637 -10,3.5 -17.233,3.781 -26.5,3.5 -26.5,3.5 0,0 -48.119,2.57 -68,-2.5 -3.95,-1.008 -9.368,-1.146 -13,-3 -3.235,-1.652 -5.588,-2.412 -7.5,-5.5 -1.976,-3.194 -1.5,-9.5 -1.5,-9.5 10.935,0.781 26.5,2.5 28,2 1.5,-0.5 1.289,-2.903 1.45,-5 0.288,-3.745 -2.557,-5.605 -4.95,-8.5 -2.662,-3.221 -3.945,-3.887 -7.55,-6 -5.541,-3.248 -15.45,-6 -15.45,-6 z" onClick={() => handleAreaSelect("Hayon")} />
          </g>
        </svg>
      </div>

      {selectedAreas.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Zones sélectionnées:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedAreas.map((area) => (
              <div
                key={area}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {area}
                <button
                  onClick={() => onAreaSelect(area)}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDamageSelectorWithScreenshot;