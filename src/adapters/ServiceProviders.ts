import {
  SearchServiceProvider,
  ServiceProviderDetails,
  UpdateWorkingHoursPayload,
  GetAllPatientsResponse,
  PrescriptionPayload,
  GetPatientVitalsResponse,
  GetPrescriptionsResponse,
  GetPatientsDetailsResponse,
  MonthlyAvailabilityPayload,
  MonthlyAvailability,
} from "./types/ServiceProviderTypes";
import { MutationCallBackArgs } from "./types/TanstackUtilTypes";
import ApiService from "./utils/api-service";
import TanstackWrapper from "./utils/tanstack-wrapper";

// api service initilizer
const userService = new ApiService("service-providers");
const useUserMutation = TanstackWrapper.mutation;
const useUserQuery = TanstackWrapper.query;

const ServiceProviderAdapter = {
  searchServiceProvider: async ({
    specialty,
    languages,
    rating,
  }: {
    specialty: string | null;
    languages: string[] | undefined;
    rating: string | null;
  }): Promise<SearchServiceProvider> => {
    const response = await userService.fetch<SearchServiceProvider>(
      `/search?specialty=${specialty}&languages=${languages}&rating=${rating}`
    );

    return response;
  },

  getServiceProviderDetails: async ({
    id,
  }: {
    id: string | null;
  }): Promise<ServiceProviderDetails> => {
    const response = await userService.fetch<ServiceProviderDetails>(
      `/get-service-provider/${id}`
    );

    return response;
  },

  updateServiceProvider: async ({
    payload,
  }: MutationCallBackArgs<FormData>) => {
    const response = await userService.mutate<FormData, unknown>({
      slug: `update`,
      payload,
      type: "FormData",
      method: "PATCH",
    });

    return response;
  },

  updateWorkingHours: async ({
    payload,
  }: MutationCallBackArgs<UpdateWorkingHoursPayload>) => {
    const response = await userService.mutate<
      UpdateWorkingHoursPayload,
      unknown
    >({
      slug: `working-hours`,
      payload,
      type: "JSON",
      method: "PATCH",
    });

    return response;
  },

  // Get all patients under a service provider
  getPatients: async (): Promise<GetAllPatientsResponse> => {
    const response =
      await userService.fetch<GetAllPatientsResponse>(`/patients`);

    return response;
  },

  // Get detailed information about a specific patient
  getPatientDetails: async ({
    patientId,
  }: {
    patientId: string;
  }): Promise<GetPatientsDetailsResponse> => {
    const response = await userService.fetch<GetPatientsDetailsResponse>(
      `/patients/${patientId}`
    );

    return response;
  },

  // Get vitals history for a specific patient
  getPatientVitals: async ({
    patientId,
  }: {
    patientId: string;
  }): Promise<GetPatientVitalsResponse> => {
    const response = await userService.fetch<GetPatientVitalsResponse>(
      `/patients/${patientId}/vitals`
    );

    return response;
  },

  // Get prescriptions for a specific patient
  getPrescriptions: async ({
    patientId,
  }: {
    patientId: string;
  }): Promise<GetPrescriptionsResponse> => {
    const response = await userService.fetch<GetPrescriptionsResponse>(
      `/patients/${patientId}/prescriptions`
    );

    return response;
  },

  getMonthlyAvailability: async (): Promise<MonthlyAvailability> => {
    const response = await userService.fetch<MonthlyAvailability>(
      `/monthly-availability`
    );

    return response;
  },

  // Add a new prescription for a patient
  addPrescription: async ({
    payload,
  }: MutationCallBackArgs<PrescriptionPayload>) => {
    const response = await userService.mutate<PrescriptionPayload, unknown>({
      slug: `patients/${payload.patientId}/prescriptions`,
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
    const response = await userService.mutate<{ id: string }, unknown>({
      slug: `prescriptions/${payload.id}`,
      payload,
      type: "JSON",
      method: "DELETE",
    });

    return response;
  },

  updateMonthlyAvailability: async ({
    payload,
  }: MutationCallBackArgs<MonthlyAvailabilityPayload>) => {
    const response = await userService.mutate<
      MonthlyAvailabilityPayload,
      unknown
    >({
      slug: `monthly-availability`,
      payload,
      type: "JSON",
      method: "PUT",
    });

    return response;
  },

  updateBankDetails: async ({
    payload,
  }: MutationCallBackArgs<{
    account_name: string;
    bank_name: string;
    account_number: string;
  }>) => {
    const response = await userService.mutate<
      {
        account_name: string;
        bank_name: string;
        account_number: string;
      },
      unknown
    >({
      slug: `bank-details`,
      payload,
      type: "JSON",
      method: "PATCH",
    });

    return response;
  },
};

export { ServiceProviderAdapter, useUserMutation, useUserQuery };
