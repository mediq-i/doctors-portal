import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordForm } from "@/components/auth";

export const Route = createFileRoute("/auth/reset-password")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ResetPasswordForm />;
}
