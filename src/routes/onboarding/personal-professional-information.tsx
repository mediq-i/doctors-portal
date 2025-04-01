import { createFileRoute } from "@tanstack/react-router";
import Onboarding from "@/components/partials/onboarding-wrapper";

export const Route = createFileRoute(
  "/onboarding/personal-professional-information"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <Onboarding />;
}
