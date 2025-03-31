import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useOnboardingProgressStore } from "./onboarding-progress";

// Define the types for the form data
interface FormData {
  // Personal info
  legalFirstName?: string;
  legalLastName?: string;
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
}

// Define the store state and actions
interface FormState {
  formData: FormData;
  currentStep: number;

  // Actions
  updateFormData: (data: Partial<FormData>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

// Create Zustand store with persistence
export const usePersonalProfessionalInfoStore = create<FormState>()(
  persist(
    (set, get) => ({
      formData: {},
      currentStep: 1,

      updateFormData: (data) =>
        set((state) => ({ formData: { ...state.formData, ...data } })),

      goToNextStep: () =>
        set((state) => ({ currentStep: state.currentStep + 1 })),

      goToPreviousStep: () => {
        if (get().currentStep > 1) {
          set((state) => ({ currentStep: state.currentStep - 1 }));

          // Also update the onboarding progress store
          useOnboardingProgressStore.getState().prevStep();
        }
      },
    }),
    {
      name: "personal-professional-info-store", // Storage key
    }
  )
);
