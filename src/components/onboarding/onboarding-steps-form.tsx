import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export function OnboardingStepsForm() {
  return (
    <Card className="w-full max-w-md mx-auto p-6">
      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-1 w-8 rounded-full bg-primary"></div>
        <div className="h-1 w-8 rounded-full bg-slate-200"></div>
        <div className="h-1 w-8 rounded-full bg-slate-200"></div>
      </div>

      {/* Icon */}
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto">
          <img
            src="/placeholder.svg?height=64&width=64"
            alt="Medical bag icon"
            className="w-full h-full text-blue-500"
          />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">
        Personal & professional information
      </h1>

      {/* Steps List */}
      <div className="space-y-4 mb-8">
        {/* Step 1 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-muted-foreground">
              Create your account
            </span>
          </div>
          <span className="text-xs text-primary">Completed</span>
        </div>

        {/* Step 2 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-sm">
              2
            </div>
            <span className="text-sm">Personal & professional information</span>
          </div>
          <span className="text-xs text-muted-foreground">5 min</span>
        </div>

        {/* Step 3 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-sm">
              3
            </div>
            <span className="text-sm text-muted-foreground">
              Practice & work history
            </span>
          </div>
          <span className="text-xs text-muted-foreground">5 min</span>
        </div>
      </div>

      {/* Start Button */}
      <Link
        to="/onboarding/personal-professional-information"
        className="block"
      >
        <Button className="w-full bg-primary text-white hover:bg-primary/90">
          Start
        </Button>
      </Link>
    </Card>
  );
}
