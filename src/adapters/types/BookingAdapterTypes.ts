export type BookAppointment = {
  appointment_date: Date | undefined;
  patient_symptoms: string[];
  patient_ailment_description: string;
  patient_symptom_duration: string;
  status: string;
  service_provider_id: string | null;
};

export type Session = {
  id: string;
  created_at: string;
  updated_at: string;
  appointment_date: string;
  patient_symptoms: string[];
  patient_ailment_description: string;
  patient_symptom_duration: string;
  status: string;
  cancellation_reason: string | null;
  cancellation_date: string | null;
  service_provider_id: string;
  patient_id: string;
  payment_status: string | null;
  payment_id: string | null;
};

export type SessionHistory = {
  data: Session[];
};
