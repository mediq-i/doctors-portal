import { CreateAccountForm } from "@/components/onboarding";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/create-account")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreateAccountForm />;
}
