import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the types for our form data
interface FormData {
  // Account creation
  email?: string;
  password?: string;

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

  // Additional steps can be added here
  [key: string]: any;
}

// Define the store state and actions
interface FormState {
  // State
  formData: FormData;
  currentStep: number;
  totalSteps: number;

  // Actions
  updateFormData: (data: Partial<FormData>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;

  // Computed
  isLastStep: boolean;
  isFirstStep: boolean;
}

// Total number of steps in the form
const TOTAL_STEPS = 8;

// Create the store with persistence
export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      // Initial state
      formData: {},
      currentStep: 1,
      totalSteps: TOTAL_STEPS,

      // Actions
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      goToNextStep: () =>
        set((state) => ({
          currentStep:
            state.currentStep < state.totalSteps
              ? state.currentStep + 1
              : state.currentStep,
        })),

      goToPreviousStep: () =>
        set((state) => ({
          currentStep:
            state.currentStep > 1 ? state.currentStep - 1 : state.currentStep,
        })),

      goToStep: (step) =>
        set((state) => ({
          currentStep:
            step >= 1 && step <= state.totalSteps ? step : state.currentStep,
        })),

      resetForm: () =>
        set({
          formData: {},
          currentStep: 1,
        }),

      // Computed properties
      get isLastStep() {
        return get().currentStep === get().totalSteps;
      },

      get isFirstStep() {
        return get().currentStep === 1;
      },
    }),
    {
      name: "multi-step-form-storage", // Name for the storage
      partialize: (state) => {
        // Don't persist the File object as it can't be serialized
        const { formData, ...rest } = state;
        const { documentFile, ...restFormData } = formData;

        return {
          ...rest,
          formData: restFormData,
        };
      },
    }
  )
);
