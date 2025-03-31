import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingProgressState {
  currentStep: number; // Current step (1-10)
  totalSteps: number; // Total number of steps (10)
  nextStep: () => void; // Function to go to the next step
  prevStep: () => void; // Function to go to the previous step
}

// Total number of steps in the form including completion
const TOTAL_STEPS = 10;

export const useOnboardingProgressStore = create<OnboardingProgressState>()(
  persist(
    (set) => ({
      currentStep: 1, // Starts from step 1 (Create Account)
      totalSteps: TOTAL_STEPS,
      nextStep: () =>
        set((state) => ({
          currentStep:
            state.currentStep < 10 ? state.currentStep + 1 : state.currentStep, // Max step = 10
        })),

      prevStep: () =>
        set((state) => ({
          currentStep:
            state.currentStep > 1 ? state.currentStep - 1 : state.currentStep, // Min step = 1
        })),
    }),
    { name: "onboarding-progress-storage" } // Saves progress in localStorage
  )
);
