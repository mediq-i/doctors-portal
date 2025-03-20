import { createFileRoute } from "@tanstack/react-router";
import {
  PersonalInfoForm,
  SelectIdVerificationForm,
  VerifyIdForm,
  ProfessionalInfoForm,
  UploadMedicalLicense,
} from "@/components/onboarding";
import MultiStepForm from "@/components/partials/multi-step-form";

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
    // <ProfessionalInfoForm />
    // <UploadMedicalLicense />
    <MultiStepForm />
  );
}
