export interface Prescription {
  created_at: string;
  dosage: string | null;
  duration: string | null;
  frequency: string | null;
  id: number;
  medication: string | null;
  notes: string | null;
  patient_id: string | null;
  updated_at: string | null;
}

export interface PrescriptionPayload {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  patient_id: string;
}

export interface GetPrescriptionsResponse {
  data: Prescription[];
}
