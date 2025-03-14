import { createFileRoute } from "@tanstack/react-router";
import { OnboardingStepsForm } from "@/components/onboarding";

export const Route = createFileRoute("/onboarding/onboarding-steps")({
  component: OnboardingSteps,
});

function OnboardingSteps() {
  return <OnboardingStepsForm />;
}
