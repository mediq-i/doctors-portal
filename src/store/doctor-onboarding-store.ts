import { create } from "zustand";
import { persist } from "zustand/middleware";

type DoctorOnboardingState = {
  formStep: number;
  personalInfo: {
    dob: string;
    languages: string;
  };
  professionalInfo: {
    medical_license_no: string;
    issuing_medical_board: string;
    specialty: string;
    years_of_experience: string;
    professional_associations: string;
  };
  documentInfo: {
    identification_type?: string;
    identification_file?: File;
    medical_license_file?: File;
    university_degree_file?: File;
  };
};

type DoctorOnboardingActions = {
  updateFormStep: (step: number) => void;
  updatePersonalInfo: (
    key: keyof DoctorOnboardingState["personalInfo"],
    value: string
  ) => void;
  updateProfessionalInfo: (
    key: keyof DoctorOnboardingState["professionalInfo"],
    value: string
  ) => void;
  updateDocumentInfo: (
    key: keyof DoctorOnboardingState["documentInfo"],
    value: File | string | undefined
  ) => void;
  resetStore: () => void;
};

const initialState: DoctorOnboardingState = {
  formStep: 1,
  personalInfo: {
    dob: "",
    languages: "",
  },
  professionalInfo: {
    medical_license_no: "",
    issuing_medical_board: "",
    specialty: "",
    years_of_experience: "",
    professional_associations: "",
  },
  documentInfo: {},
};

const useDoctorOnboardingStore = create<
  DoctorOnboardingState & DoctorOnboardingActions
>()(
  persist(
    (set) => ({
      ...initialState,

      updateFormStep(step) {
        set((state) => ({ ...state, formStep: step }));
      },

      updatePersonalInfo(key, value) {
        set((state) => ({
          ...state,
          personalInfo: { ...state.personalInfo, [key]: value },
        }));
      },

      updateProfessionalInfo(key, value) {
        set((state) => ({
          ...state,
          professionalInfo: { ...state.professionalInfo, [key]: value },
        }));
      },

      updateDocumentInfo(key, value) {
        set((state) => ({
          ...state,
          documentInfo: { ...state.documentInfo, [key]: value },
        }));
      },

      resetStore() {
        set(initialState);
      },
    }),
    {
      name: "doctor-onboarding-store",
    }
  )
);

export default useDoctorOnboardingStore;
