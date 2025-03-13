import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding/create-account")({
  component: CreateAccount,
});

function CreateAccount() {
  return <div>Create your account</div>;
}
