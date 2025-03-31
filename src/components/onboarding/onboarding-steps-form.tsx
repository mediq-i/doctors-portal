import { Button } from "@/components/ui/button";
import { OnboardIcon } from "../icons";
import { useNavigate } from "@tanstack/react-router";
import { useOnboardingProgressStore } from "@/store/onboarding-progress";

export function OnboardingStepsForm() {
  const navigate = useNavigate();
  const { nextStep } = useOnboardingProgressStore();

  return (
    <div className="w-full lg:max-w-3xl mx-auto pt-6 lg:pt-10 px-4 md:px-0 xl:px-8">
      {/* Icon */}
      <div className="flex justify-center">
        <OnboardIcon />
      </div>

      {/* Title */}
      <h1 className="pb-2 leading-8 lg:leading-10 text-xl md:text-2xl lg:text-3xl font-bold pt-6 max-w-lg">
        Personal & professional information
      </h1>

      {/* Steps List */}
      <div className="space-y-4 mb-12 mt-6">
        {/* Step 1 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <p className="text-xs text-white">1</p>
            </div>
            <span className="text-base md:text-lg font-medium text-night">
              Create your account
            </span>
          </div>
          <span className="text-base text-primary">Completed</span>
        </div>

        {/* Step 2 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <p className="text-xs text-white">2</p>
            </div>
            <span className="text-base md:text-lg font-medium text-night">
              Personal & professional information
            </span>
          </div>
          <span className="text-base text-muted-foreground">5 min</span>
        </div>
      </div>

      {/* Start Button */}
      <Button
        className="w-full bg-primary text-white hover:bg-primary/90 py-6 rounded-lg"
        onClick={() => {
          nextStep();
          navigate({ to: "/onboarding/personal-professional-information" });
        }}
      >
        Start
      </Button>
    </div>
  );
}
