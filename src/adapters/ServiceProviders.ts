/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  SearchServiceProvider,
  ServiceProviderDetails,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await userService.mutate<FormData, any>({
      slug: `update`,
      payload,
      type: "FormData",
      method: "PATCH",
    });

    return response;
  },
};

export { ServiceProviderAdapter, useUserMutation, useUserQuery };
