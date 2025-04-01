import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FormData {
  // Personal info
  legalFirstName?: string;
  legalLastName?: string;
  languages?: string;
  dateOfBirth?: string;

  // Professional info
  medicalLicenseNumber?: string;
  issuingMedicalBoard?: string;
  specialty?: string;
  yearsOfExperience?: string;
  professionalAssociations?: string;

  // Document upload
  documentType?: string;
  documentFile?: File;
  medicalLicense?: File;
  universityDegree?: File;

  // File metadata (since we can't store the actual files)
  documentFileName?: string;
  medicalLicenseFileName?: string;
  universityDegreeFileName?: string;
}

interface OnboardingProgressState {
  formData: FormData;
  currentStep: number;
  totalSteps: number; // Total number of steps (10)

  // Actions
  updateFormData: (data: Partial<FormData>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  setStep: (step: number) => void; // Function to set a specific step
}

// Total number of steps in the form including completion
const TOTAL_STEPS = 10;

export const useOnboardingProgressStore = create<OnboardingProgressState>()(
  persist(
    (set, get) => ({
      formData: {},
      currentStep: 1,
      totalSteps: TOTAL_STEPS,
      setStep: (step: number) =>
        set(() => ({
          currentStep: step > 0 && step <= TOTAL_STEPS ? step : 1,
        })),

      updateFormData: (data) =>
        set((state) => ({ formData: { ...state.formData, ...data } })),

      goToNextStep: () =>
        set((state) => ({ currentStep: state.currentStep + 1 })),

      goToPreviousStep: () => {
        if (get().currentStep > 1) {
          set((state) => ({ currentStep: state.currentStep - 1 }));
        }
      },
    }),
    {
      name: "onboarding-progress-store", // Storage key
    }
  )
);
