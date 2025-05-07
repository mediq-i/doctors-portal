import {
  GetPrescriptionsResponse,
  PrescriptionPayload,
} from "./types/PrescriptionTypes";
import { MutationCallBackArgs } from "./types/TanstackUtilTypes";
import ApiService from "./utils/api-service";
import TanstackWrapper from "./utils/tanstack-wrapper";

// api service initilizer
const apiService = new ApiService("prescriptions");
const usePrescriptionMutation = TanstackWrapper.mutation;
const usePrescriptionQuery = TanstackWrapper.query;

const PrescriptionsAdapter = {
  // Get prescriptions for a specific patient
  getPrescriptions: async ({
    patientId,
  }: {
    patientId: string;
  }): Promise<GetPrescriptionsResponse> => {
    const response = await apiService.fetch<GetPrescriptionsResponse>(
      `/patient/${patientId}`
    );

    return response;
  },

  // Add a new prescription for a patient
  addPrescription: async ({
    payload,
  }: MutationCallBackArgs<PrescriptionPayload>) => {
    const response = await apiService.mutate<PrescriptionPayload, unknown>({
      slug: ``,
      payload,
      type: "JSON",
      method: "POST",
    });

    return response;
  },

  // Delete a prescription
  deletePrescription: async ({
    payload,
  }: MutationCallBackArgs<{ id: string }>) => {
    const response = await apiService.mutate<{ id: string }, unknown>({
      slug: `${payload.id}`,
      payload,
      type: "JSON",
      method: "DELETE",
    });

    return response;
  },
};

export { PrescriptionsAdapter, usePrescriptionMutation, usePrescriptionQuery };
