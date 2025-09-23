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
    <div className="w-full py-2">
      <div className="flex justify-between items-center relative px-2">
        {/* Progress Line */}
        <div className="absolute top-[12px] left-6 right-6 h-0.5 bg-muted">
          <div 
            className="h-full bg-gradient-primary transition-all duration-500 ease-out" 
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
                w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${isCompleted 
                  ? 'bg-primary border-primary text-primary-foreground shadow-primary' 
                  : isCurrent 
                    ? 'bg-primary border-primary text-primary-foreground shadow-primary animate-pulse' 
                    : 'bg-background border-muted-foreground/30 text-muted-foreground'
                }
              `}>
                {isCompleted ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <step.icon className="w-3 h-3" />
                )}
              </div>
              <div className="mt-1 text-center px-0.5 max-w-[50px]">
                <p className={`
                  text-[7px] font-medium transition-colors duration-300 leading-tight break-words
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