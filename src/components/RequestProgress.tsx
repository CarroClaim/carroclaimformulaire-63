import React from 'react';
import { CheckCircle, Clock, PlayCircle, Archive } from 'lucide-react';

interface RequestProgressProps {
  status: string;
}

const statusSteps = [
  { id: 'pending', title: 'En attente', icon: Clock },
  { id: 'processing', title: 'En cours', icon: PlayCircle },
  { id: 'completed', title: 'Traité', icon: CheckCircle },
  { id: 'archived', title: 'Archivé', icon: Archive },
];

export const RequestProgress: React.FC<RequestProgressProps> = ({ status }) => {
  const getCurrentStepIndex = () => {
    const index = statusSteps.findIndex(step => step.id === status);
    return index === -1 ? 0 : index;
  };

  const currentStep = getCurrentStepIndex();

  return (
    <div className="w-full py-1">
      <div className="flex justify-between items-center relative px-1">
        {/* Progress Line */}
        <div className="absolute top-[10px] left-4 right-4 h-0.5 bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out" 
            style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
          />
        </div>

        {statusSteps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center justify-center relative z-10 min-w-0">
              <div className={`
                w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300
                ${isCompleted 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : isCurrent 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'bg-background border-muted-foreground/30 text-muted-foreground'
                }
              `}>
                {isCompleted ? (
                  <CheckCircle className="w-2.5 h-2.5" />
                ) : (
                  <step.icon className="w-2.5 h-2.5" />
                )}
              </div>
              <div className="mt-0.5 text-center px-0.5 max-w-[45px]">
                <p className={`
                  text-[6px] font-medium transition-colors duration-300 leading-tight break-words
                  ${isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}
                `}>
                  {step.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};