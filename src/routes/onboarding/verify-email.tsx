import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmailForm } from "@/components/onboarding";

export const Route = createFileRoute("/onboarding/verify-email")({
  component: RouteComponent,
});

function RouteComponent() {
  return <VerifyEmailForm />;
}
