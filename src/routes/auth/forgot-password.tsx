import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordForm } from "@/components/auth";

export const Route = createFileRoute("/auth/forgot-password")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ForgotPasswordForm />;
}
