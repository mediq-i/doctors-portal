import { useFormStore, OnboardingStep } from "@/store/form-store";
import { FormLayout } from "./form-layout";
import {
  CreateAccountForm,
  VerifyEmailForm,
  OnboardingStepsForm,
  PersonalInfoForm,
  SelectIdVerificationForm,
  VerifyIdForm,
  ProfessionalInfoForm,
  UploadMedicalLicense,
} from "../onboarding";

function StepContent() {
  const { formData, goToNextStep, updateFormData, currentStep } =
    useFormStore();

  // Handle form submission for each step
  const handleStepSubmit = (data?: any) => {
    if (data) {
      updateFormData(data);
    }
    goToNextStep();
  };

  switch (currentStep) {
    case OnboardingStep.CREATE_ACCOUNT:
      return (
        <CreateAccountForm
          onSubmit={handleStepSubmit}
          defaultValues={formData}
        />
      );
    case OnboardingStep.VERIFY_EMAIL:
      return (
        <VerifyEmailForm onSubmit={handleStepSubmit} defaultValues={formData} />
      );
    case OnboardingStep.ONBOARDING_STEPS:
      return <OnboardingStepsForm onSubmit={handleStepSubmit} />;
    case OnboardingStep.PERSONAL_INFO:
      return (
        <PersonalInfoForm
          onSubmit={handleStepSubmit}
          defaultValues={formData}
        />
      );
    case OnboardingStep.SELECT_ID_VERIFICATION:
      return <SelectIdVerificationForm onSubmit={handleStepSubmit} />;
    case OnboardingStep.VERIFY_ID:
      return (
        <VerifyIdForm onSubmit={handleStepSubmit} defaultValues={formData} />
      );
    case OnboardingStep.PROFESSIONAL_INFO:
      return (
        <ProfessionalInfoForm
          onSubmit={handleStepSubmit}
          defaultValues={formData}
        />
      );
    case OnboardingStep.UPLOAD_MEDICAL_LICENSE:
      return (
        <UploadMedicalLicense
          onSubmit={handleStepSubmit}
          defaultValues={formData}
        />
      );
    default:
      return <div>Unknown step</div>;
  }
}

// Main form container
export default function MultiStepForm() {
  // For the completion page (step 9), we still show the progress as complete
  //   const displayStep = Math.min(currentStep, totalSteps + 1);
  //   const isCompletionPage = currentStep > totalSteps;

  return (
    <FormLayout>
      <StepContent />
    </FormLayout>
  );
}
