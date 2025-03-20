import { useFormStore } from "@/store/form-store";
import { FormLayout } from "./form-layout";
import { CreateAccountForm, VerifyEmailForm } from "../onboarding";

const stepTitles: string[] = [
  "Create your account",
  "Enter your personal information",
  "Enter your professional information",
  "Verify your identity",
  "Practice & work history",
  "Education & training",
  "References",
  "Review & submit",
  "Application complete",
];

function StepContent({ step }: { step: number }) {
  const { formData, goToNextStep, goToPreviousStep, updateFormData } =
    useFormStore();

  // Handle form submission for each step
  const handleStepSubmit = (data: any) => {
    updateFormData(data);
    goToNextStep();
  };

  switch (step) {
    case 1:
      return (
        <CreateAccountForm
          onSubmit={handleStepSubmit}
          defaultValues={formData}
        />
      );
    // case 2:
    //   return <VerifyEmailForm onSubmit={handleStepSubmit} defaultValues={formData} />
    default:
      return <div>Unknown step</div>;
  }
}

// Main form container
export default function MultiStepForm() {
  const { currentStep, totalSteps } = useFormStore();

  // For the completion page (step 9), we still show the progress as complete
  const displayStep = Math.min(currentStep, totalSteps + 1);
  const isCompletionPage = currentStep > totalSteps;

  return (
    <FormLayout
      currentStep={isCompletionPage ? totalSteps : currentStep}
      totalSteps={totalSteps}
      title={stepTitles[currentStep - 1]}
    >
      <StepContent step={currentStep} />
    </FormLayout>
  );
}
