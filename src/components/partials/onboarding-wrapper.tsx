import {
  CreateAccountForm,
  VerifyEmailForm,
  OnboardingStepsForm,
  PersonalInfoForm,
  SelectIdVerificationForm,
  VerifyIdForm,
  ProfessionalInfoForm,
  UploadMedicalLicense,
  UploadUniversityDegree,
} from "../onboarding";
import { useOnboardingProgressStore } from "@/store/onboarding-progress";

const Onboarding = () => {
  const { currentStep, goToNextStep, formData, totalSteps, updateFormData } =
    useOnboardingProgressStore();

  console.log(totalSteps);

  // Handle form submission for each step
  const handleStepSubmit = (data?: any) => {
    if (data) {
      updateFormData(data);
    }
    goToNextStep();
  };

  // Define step mapping to components
  const steps = [
    <CreateAccountForm key="1" />,
    <VerifyEmailForm key="2" />,
    <OnboardingStepsForm key="3" />,
    <PersonalInfoForm
      key="4"
      onSubmit={handleStepSubmit}
      defaultValues={formData}
    />,
    <SelectIdVerificationForm key="5" onSubmit={handleStepSubmit} />,
    <VerifyIdForm
      key="6"
      onSubmit={handleStepSubmit}
      defaultValues={formData}
    />,
    <ProfessionalInfoForm
      key="7"
      onSubmit={handleStepSubmit}
      defaultValues={formData}
    />,
    <UploadMedicalLicense
      key="8"
      onSubmit={handleStepSubmit}
      defaultValues={formData}
    />,
    <UploadUniversityDegree
      key="9"
      onSubmit={handleStepSubmit}
      defaultValues={formData}
    />,
  ];

  return (
    <div className="onboarding-container">
      {steps[currentStep - 1]} {/* Display the correct form */}
      {/* <div className="buttons">
        {currentStep > 1 && <button onClick={goToPreviousStep}>Back</button>}
        {currentStep < steps.length && (
          <button onClick={goToNextStep}>Continue</button>
        )}
      </div> */}
    </div>
  );
};

export default Onboarding;
