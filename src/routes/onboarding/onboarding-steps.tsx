import { createFileRoute } from "@tanstack/react-router";
import { OnboardingStepsForm } from "@/components/onboarding";

// import OnboardingController from "@/components/partials/onboarding-controller";

export const Route = createFileRoute("/onboarding/onboarding-steps")({
  component: OnboardingSteps,
});

function OnboardingSteps() {
  return <OnboardingStepsForm />;
  // return <OnboardingController />;
}
