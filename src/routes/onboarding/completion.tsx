import { createFileRoute } from "@tanstack/react-router";
import OnboardingController from "@/components/partials/onboarding-controller";
// import { useEffect } from "react";
// import { useFormStore, OnboardingStep } from "@/store/form-store";

export const Route = createFileRoute("/onboarding/completion")({
  component: RouteComponent,
});

function RouteComponent() {
  // const { goToStep } = useFormStore();

  // Ensure we're on the completion step when this route is loaded
  // useEffect(() => {
  //   goToStep(OnboardingStep.COMPLETION);
  // }, [goToStep]);

  return <OnboardingController />;
}
