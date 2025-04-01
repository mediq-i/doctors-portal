import { createFileRoute } from "@tanstack/react-router";
import Onboarding from "@/components/partials/onboarding-wrapper";
import { UploadUniversityDegree } from "@/components/onboarding";
import { useOnboardingProgressStore } from "@/store/onboarding-progress";

export const Route = createFileRoute(
  "/onboarding/personal-professional-information"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { goToNextStep, formData, updateFormData } =
    useOnboardingProgressStore();

  // Handle form submission for each step
  const handleStepSubmit = (data?: any) => {
    if (data) {
      updateFormData(data);
    }
    goToNextStep(); //update progress bar
    goToNextStep(); //moves to the next step in the personal-professional-info form
  };

  // return <Onboarding />;
  return (
    <UploadUniversityDegree
      onSubmit={handleStepSubmit}
      defaultValues={formData}
    />
  );
}
