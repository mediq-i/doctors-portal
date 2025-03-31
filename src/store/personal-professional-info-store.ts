import { create } from "zustand";
import { persist } from "zustand/middleware";

//define te types for the form data
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

//define the store state and actions
interface FormState {
  formData: FormData;
  currentStep: number;

  //Actions
  updateFormData: (data: Partial<FormData>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

// Create Zustand store with persistence
export const usePersonalProfessionalInfoStore = create<FormState>()(
  persist(
    (set) => ({
      formData: {},
      currentStep: 1,

      updateFormData: (data) =>
        set((state) => ({ formData: { ...state.formData, ...data } })),

      goToNextStep: () =>
        set((state) => ({ currentStep: state.currentStep + 1 })),

      goToPreviousStep: () =>
        set((state) => ({
          currentStep: state.currentStep > 1 ? state.currentStep - 1 : 1,
        })),
    }),
    {
      name: "personal-professional-info-store", // Storage key
    }
  )
);
