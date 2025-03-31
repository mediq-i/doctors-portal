import { createFileRoute } from "@tanstack/react-router";
import { OnboardingCompleted } from "@/components/onboarding";

export const Route = createFileRoute("/onboarding/completion")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OnboardingCompleted />;
}
