
  import { GetSessionNotesResponse, SessionNotePayload } from "./types/SessionNotesTypes";
  import { MutationCallBackArgs } from "./types/TanstackUtilTypes";
  import ApiService from "./utils/api-service";
  import TanstackWrapper from "./utils/tanstack-wrapper";
  
  // api service initilizer
  const apiService = new ApiService("session-notes");
  const useSessionNotesMutation = TanstackWrapper.mutation;
  const useSessionNotesQuery = TanstackWrapper.query;
  
  const SessionNotesAdapter = {
    getSessionNotes: async ({
      patientId,
    }: {
      patientId: string;
    }): Promise<GetSessionNotesResponse> => {
      const response = await apiService.fetch<GetSessionNotesResponse>(
        `/patient/${patientId}`
      );
  
      return response;
    },

    addSessionNote: async ({
      payload,
    }: MutationCallBackArgs<SessionNotePayload>) => {
      const response = await apiService.mutate<SessionNotePayload, unknown>({
        slug: ``,
        payload,
        type: "JSON",
        method: "POST",
      });
  
      return response;
    },
  
 
    deleteSessionNote: async ({
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
  
  export { SessionNotesAdapter, useSessionNotesMutation, useSessionNotesQuery };
  