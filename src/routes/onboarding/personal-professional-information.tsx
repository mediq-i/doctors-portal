import { createFileRoute } from "@tanstack/react-router";
import {
  PersonalInfoForm,
  SelectIdVerificationForm,
  VerifyIdForm,
  ProfessionalInfoForm,
} from "@/components/onboarding";

export const Route = createFileRoute(
  "/onboarding/personal-professional-information"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    // <PersonalInfoForm />
    // <SelectIdVerificationForm />
    // <VerifyIdForm />
    <ProfessionalInfoForm />
  );
}
