import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDamageParts } from '@/hooks/useDamageParts';
import { Skeleton } from '@/components/ui/skeleton';

interface CarDamageSelectorProps {
  onSelectionChange?: (selectedDamages: string[]) => void;
  selectedDamages?: string[];
}

const CarDamageSelector: React.FC<CarDamageSelectorProps> = ({ 
  onSelectionChange, 
  selectedDamages = [] 
}) => {
  const [currentSelections, setCurrentSelections] = useState<string[]>(selectedDamages);
  const { data: damagePartsData, isLoading } = useDamageParts();

  // Organiser les parties par zones basées sur les données de la base
  const organizePartsByZones = () => {
    if (!damagePartsData) return {};
    
    const zones: { [key: string]: Array<{ id: string; name: string; description: string }> } = {
      avant: [],
      arriere: [],
      lateral: [],
      autre: []
    };

    damagePartsData.forEach(part => {
      if (part.name.includes('avant') || part.name.includes('capot') || part.name.includes('phare')) {
        zones.avant.push(part);
      } else if (part.name.includes('arriere') || part.name.includes('coffre') || part.name.includes('feu')) {
        zones.arriere.push(part);
      } else if (part.name.includes('portiere') || part.name.includes('retroviseur')) {
        zones.lateral.push(part);
      } else {
        zones.autre.push(part);
      }
    });

    return zones;
  };

  const damageParts = organizePartsByZones();

  const toggleDamage = (damageName: string) => {
    const newSelections = currentSelections.includes(damageName)
      ? currentSelections.filter(d => d !== damageName)
      : [...currentSelections, damageName];
    
    setCurrentSelections(newSelections);
    onSelectionChange?.(newSelections);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sélectionnez les dommages du véhicule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-20" />
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-8" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sélectionnez les dommages du véhicule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(damageParts).map(([zone, damages]) => (
          <div key={zone} className="space-y-3">
            <h3 className="font-semibold text-lg capitalize">
              {zone === 'lateral' ? 'Latéral' : 
               zone === 'avant' ? 'Avant' : 
               zone === 'arriere' ? 'Arrière' : 'Autre'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {damages.map((part) => (
                <Button
                  key={part.id}
                  variant={currentSelections.includes(part.name) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleDamage(part.name)}
                  className="justify-start h-auto py-2 px-3 text-wrap"
                  title={part.description}
                >
                  {part.description}
                </Button>
              ))}
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-3">
            Sélections actuelles ({currentSelections.length}):
          </p>
          <div className="flex flex-wrap gap-1">
            {currentSelections.map((damageName) => {
              const part = damagePartsData?.find(p => p.name === damageName);
              return (
                <Badge 
                  key={damageName}
                  variant="secondary" 
                  className="cursor-pointer"
                  onClick={() => toggleDamage(damageName)}
                >
                  {part?.description || damageName} ✕
                </Badge>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarDamageSelector;