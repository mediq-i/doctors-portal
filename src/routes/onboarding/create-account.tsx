import { createFileRoute } from "@tanstack/react-router";
// import { CreateAccountForm } from "@/components/onboarding";
// import MultiStepForm from "@/components/partials/multi-step-form";
import OnboardingController from "@/components/partials/onboarding-controller";

export const Route = createFileRoute("/onboarding/create-account")({
  component: CreateAccount,
});

function CreateAccount() {
  return <OnboardingController />;
}
