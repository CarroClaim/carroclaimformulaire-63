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
  return <div className="w-full py-[15px]">
      <div className="flex justify-between items-center relative mx-0 px-0 py-0 my-0">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-muted">
          <div className="h-full bg-gradient-primary transition-all duration-500 ease-out" style={{
          width: `${currentStep / (steps.length - 1) * 100}%`
        }} />
        </div>

        {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;
        return <div key={step.id} className="flex flex-col items-center relative z-10 px-0 mx-0 py-0 my-0 rounded-sm">
              <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isCompleted ? 'bg-primary border-primary text-primary-foreground shadow-primary' : isCurrent ? 'bg-primary border-primary text-primary-foreground shadow-primary animate-pulse' : 'bg-background border-muted-foreground/30 text-muted-foreground'}
                `}>
                {isCompleted ? <CheckCircle className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
              </div>
              <div className="mt-2 text-center">
                <p className={`
                    text-xs font-medium transition-colors duration-300
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