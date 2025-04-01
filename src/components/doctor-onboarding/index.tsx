import { LogoBlue } from "@/components/icons";
import { ProgressBar } from "@/components/partials/progress-bar";
import { ArrowLeft } from "lucide-react";
import useDoctorOnboardingStore from "@/store/doctor-onboarding-store";
import {
  PersonalInfoForm,
  ProfessionalInfoForm,
  SelectIdVerificationForm,
  DocumentUploadForm,
  OnboardingCompleted,
} from "./steps";

const TOTAL_STEPS = 4;

export function DoctorOnboarding() {
  const { formStep, updateFormStep } = useDoctorOnboardingStore();

  const handlePrevStep = () => {
    if (formStep > 1) {
      updateFormStep(formStep - 1);
    }
  };

  const renderStep = () => {
    switch (formStep) {
      case 1:
        return <PersonalInfoForm />;
      case 2:
        return <ProfessionalInfoForm />;
      case 3:
        return <SelectIdVerificationForm />;
      case 4:
        return <DocumentUploadForm />;
      case 5:
        return <OnboardingCompleted />;
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Fixed Marketing content */}
      <div className="hidden lg:block lg:w-1/2 fixed left-0 top-0 h-screen">
        <div className="h-[500px]">
          <img
            src="/images/onboarding-img.png"
            alt="doctor's image"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="bg-gunmetal h-[calc(100vh-500px)] py-8 px-6">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-semibold mb-4 text-white">
              Optimize your healthcare operations with our intelligent medical
              admin dashboard
            </h1>
            <p className="text-white/80 mb-6 font-medium text-sm max-w-2xl">
              This comprehensive digital solution centralizes and streamlines
              essential tasks, data, and processes, empowering healthcare
              providers to deliver better patient care and enhance operational
              efficiency.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Scrollable Form content */}
      <div className="flex-1 w-full lg:ml-[50%]">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 lg:py-12">
          <div className="mb-8">
            <LogoBlue />
          </div>

          {formStep < 5 && (
            <div className="flex items-center gap-x-5">
              <ArrowLeft
                onClick={handlePrevStep}
                className={
                  formStep === 1
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }
              />
              <ProgressBar currentStep={formStep} totalSteps={TOTAL_STEPS} />
            </div>
          )}

          {renderStep()}
        </div>
      </div>
    </div>
  );
}
