import { cn } from "@/lib/utils";

interface ProgressBarProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
}

export function ProgressBar({
  totalSteps,
  currentStep,
  className,
}: ProgressBarProps) {
  // Calculate progress percentage
  const progress = Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100);

  return (
    <div className={cn("w-full mb-8", className)}>
      <div className="flex items-center gap-2 mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-1 w-8 rounded-full transition-colors duration-300",
              index < currentStep ? "bg-primary" : "bg-slate-200"
            )}
          />
        ))}
      </div>
      <div className="text-xs text-muted-foreground text-right">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
}
