import React from 'react';
import { CheckCircle } from 'lucide-react';
interface Step {
  id: string;
  title: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}
interface StepProgressProps {
  steps: Step[];
  currentStep: number;
}
export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep
}) => {
  return <div className="w-full py-2 sm:py-4">
      <div className="flex justify-between items-center relative px-2 sm:px-4">
        {/* Progress Line */}
        <div className="absolute top-1/2 transform -translate-y-1/2 left-8 right-8 h-0.5 bg-muted">
          <div className="h-full bg-gradient-primary transition-all duration-500 ease-out" style={{
          width: `${currentStep / (steps.length - 1) * 100}%`
        }} />
        </div>

        {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;
        return <div key={step.id} className="flex flex-col items-center justify-center relative z-10 min-w-0">
              <div className={`
                  w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isCompleted ? 'bg-primary border-primary text-primary-foreground shadow-primary' : isCurrent ? 'bg-primary border-primary text-primary-foreground shadow-primary animate-pulse' : 'bg-background border-muted-foreground/30 text-muted-foreground'}
                `}>
                {isCompleted ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : <step.icon className="w-3 h-3 sm:w-4 sm:h-4" />}
              </div>
              <div className="mt-1 text-center px-0.5 max-w-[60px] sm:max-w-none">
                <p className={`
                    text-[6px] sm:text-[8px] font-medium transition-colors duration-300 leading-tight break-words
                    ${isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}
                  `}>
                  {step.title}
                </p>
              </div>
            </div>;
      })}
      </div>
    </div>;
};