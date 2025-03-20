import { createFileRoute } from "@tanstack/react-router";
// import { VerifyEmailForm } from "@/components/onboarding";
// import MultiStepForm from "@/components/partials/multi-step-form";
import OnboardingController from "@/components/partials/onboarding-controller";

export const Route = createFileRoute("/onboarding/verify-email")({
  component: RouteComponent,
});

function RouteComponent() {
  // return <VerifyEmailForm />;
  return <OnboardingController />;
}
