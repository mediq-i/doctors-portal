import { createFileRoute } from "@tanstack/react-router";
import { CreateAccountForm } from "@/components/onboarding";

export const Route = createFileRoute("/onboarding/create-account")({
  component: CreateAccount,
});

function CreateAccount() {
  return <CreateAccountForm />;
}
