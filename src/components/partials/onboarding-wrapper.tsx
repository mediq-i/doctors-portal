import {
  PersonalInfoForm,
  SelectIdVerificationForm,
  VerifyIdForm,
  ProfessionalInfoForm,
  UploadMedicalLicense,
  UploadUniversityDegree,
} from "../onboarding";
import { usePersonalProfessionalInfoStore } from "@/store/personal-professional-info-store";

const Onboarding = () => {
  const {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    formData,
    updateFormData,
  } = usePersonalProfessionalInfoStore();

  // Handle form submission for each step
  const handleStepSubmit = (data?: any) => {
    if (data) {
      updateFormData(data);
    }
    goToNextStep();
  };

  // Define step mapping to components
  const steps = [
    <PersonalInfoForm
      key="1"
      onSubmit={handleStepSubmit}
      defaultValues={formData}
    />,
    <SelectIdVerificationForm key="2" onSubmit={handleStepSubmit} />,
    <VerifyIdForm
      key="3"
      onSubmit={handleStepSubmit}
      defaultValues={formData}
    />,
    <ProfessionalInfoForm
      key="4"
      onSubmit={handleStepSubmit}
      defaultValues={formData}
    />,
    <UploadMedicalLicense
      key="5"
      onSubmit={handleStepSubmit}
      defaultValues={formData}
    />,
    <UploadUniversityDegree
      key="6"
      onSubmit={handleStepSubmit}
      defaultValues={formData}
    />,
  ];

  return (
    <div className="onboarding-container">
      {steps[currentStep - 1]} {/* Display the correct form */}
      <div className="buttons">
        {currentStep > 1 && <button onClick={goToPreviousStep}>Back</button>}
        {currentStep < steps.length && (
          <button onClick={goToNextStep}>Continue</button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
