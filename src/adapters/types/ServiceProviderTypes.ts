export type SearchServiceProvider = {
  data: [
    {
      created_at: string;
      updated_at: string;
      languages: string[];
      specialty: string;
      rating: number;
      price: string | number | null;
      practice_start_date: string | null;
      verified: boolean | null;
      status: string | null;
      email: string;
      service_type: string | null;
      working_hours: string | null;
      first_name: string;
      last_name: string;
      id: string;
      bio: string | null;
    },
  ];
};
type IDType = "nin" | "passport" | "drivers_license";

export type ServiceProviderDetails = {
  data: {
    created_at: string;
    updated_at: string;
    languages: string;
    specialty: string;
    rating: number;
    price: string | number | null;
    practice_start_date: string | null;
    verified: boolean | null;
    status: string | null;
    email: string;
    service_type: string | null;
    first_name: string;
    last_name: string;
    id: string;
    bio: string | null;
    medical_license_file: string;
    medical_license_no: string;
    identification_file: string;
    identification_no: string | null;
    identification_type: IDType;
    university_degree_file: string;
    years_of_experience: string;
    issuing_medical_board: string;
    professional_associations: string;
    profile_image: string | null;
    dob: string;
    gender: string;
    working_hours: {
      monday?: DaySchedule;
      tuesday?: DaySchedule;
      wednesday?: DaySchedule;
      thursday?: DaySchedule;
      friday?: DaySchedule;
      saturday?: DaySchedule;
      sunday?: DaySchedule;
    };
  };
};

export type UpdateWorkingHoursPayload = {
  working_hours: {
    monday?: DaySchedule;
    tuesday?: DaySchedule;
    wednesday?: DaySchedule;
    thursday?: DaySchedule;
    friday?: DaySchedule;
    saturday?: DaySchedule;
    sunday?: DaySchedule;
  };
};

export type DaySchedule = {
  isAvailable: boolean;
  slots: { start: string; end: string }[];
};

export interface Patient {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  dob: string | null;
  email: string;
  phone_number: string | null;
  profile_completed: boolean | null;
  gender: string | null;
  blood_type: string | null;
  blood_group: string | null;
  appointments: null;
}

export interface GetAllPatientsResponse {
  data: {
    patients: Patient[];
    total: 1;
    page: 1;
    limit: 10;
    totalPages: 1;
  };
}
export interface GetPatientsDetailsResponse {
  data: Patient;
}

export interface GetPatientVitalsResponse {
  data: PatientVitals[];
}

export interface PatientVitals {
  blood_pressure: string | null;
  created_at: string;
  heart_rate: string | null;
  id: string;
  patient_id: string | null;
  sugar_level: string | null;
  temperature: string | null;
}

export interface PrescriptionPayload {
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GetPrescriptionsResponse {
  data: Prescription[];
}
