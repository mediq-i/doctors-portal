import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define all possible steps in your onboarding flow
export enum OnboardingStep {
  CREATE_ACCOUNT = 1,
  VERIFY_EMAIL = 2,
  ONBOARDING_STEPS = 3,
  PERSONAL_INFO = 4,
  SELECT_ID_VERIFICATION = 5,
  VERIFY_ID = 6,
  PROFESSIONAL_INFO = 7,
  UPLOAD_MEDICAL_LICENSE = 8,
  COMPLETION = 9,
}

// Map steps to routes for navigation
export const stepToRouteMap = {
  [OnboardingStep.CREATE_ACCOUNT]: "/onboarding/create-account",
  [OnboardingStep.VERIFY_EMAIL]: "/onboarding/verify-email",
  [OnboardingStep.ONBOARDING_STEPS]: "/onboarding/onboarding-steps",
  [OnboardingStep.PERSONAL_INFO]:
    "/onboarding/personal-professional-information",
  [OnboardingStep.SELECT_ID_VERIFICATION]:
    "/onboarding/personal-professional-information",
  [OnboardingStep.VERIFY_ID]: "/onboarding/personal-professional-information",
  [OnboardingStep.PROFESSIONAL_INFO]:
    "/onboarding/personal-professional-information",
  [OnboardingStep.UPLOAD_MEDICAL_LICENSE]:
    "/onboarding/personal-professional-information",
  [OnboardingStep.COMPLETION]: "/onboarding/completion",
};

// Map routes to their first step
export const routeToInitialStepMap = {
  "/onboarding/create-account": OnboardingStep.CREATE_ACCOUNT,
  "/onboarding/verify-email": OnboardingStep.VERIFY_EMAIL,
  "/onboarding/onboarding-steps": OnboardingStep.ONBOARDING_STEPS,
  "/onboarding/personal-professional-information": OnboardingStep.PERSONAL_INFO,
  "/onboarding/completion": OnboardingStep.COMPLETION,
};

// Define the types for our form data
interface FormData {
  // Account creation
  email?: string;
  password?: string;
  code?: string;

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

  // Additional steps can be added here
  [key: string]: any;
}

// Define the store state and actions
interface FormState {
  // State
  formData: FormData;
  currentStep: OnboardingStep;
  totalSteps: number;

  // Actions
  updateFormData: (data: Partial<FormData>) => void;
  goToNextStep: () => OnboardingStep;
  goToPreviousStep: () => OnboardingStep;
  goToStep: (step: OnboardingStep) => void;
  resetForm: () => void;

  // Computed
  isLastStep: boolean;
  isFirstStep: boolean;
}

// Total number of steps in the form excluding completion
const TOTAL_STEPS = 8;

// Create the store with persistence
export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      // Initial state
      formData: {},
      currentStep: OnboardingStep.CREATE_ACCOUNT,
      totalSteps: TOTAL_STEPS,

      // Actions
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      goToNextStep: () => {
        const nextStep = get().currentStep + 1;
        set({ currentStep: nextStep });
        return nextStep;
      },
      goToPreviousStep: () => {
        const prevStep = Math.max(1, get().currentStep - 1);
        set({ currentStep: prevStep });
        return prevStep;
      },

      goToStep: (step) => {
        set({ currentStep: step });
      },

      resetForm: () =>
        set({
          formData: {},
          currentStep: OnboardingStep.CREATE_ACCOUNT,
        }),

      // Computed properties
      get isLastStep() {
        return get().currentStep === get().totalSteps;
      },

      get isFirstStep() {
        return get().currentStep === OnboardingStep.CREATE_ACCOUNT;
      },
    }),
    {
      name: "onboarding-form-storage", // Name for the storage
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
