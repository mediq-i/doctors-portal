import ApiService from "./utils/api-service";
import TanstackWrapper from "./utils/tanstack-wrapper";
import {
  BookAppointment,
  GetAgoraToken,
  SessionHistory,
} from "./types/BookingAdapterTypes";
import { MutationCallBackArgs } from "./types/TanstackUtilTypes";

// api service initilizer
const bookingService = new ApiService("appointments");
const useBookingMutation = TanstackWrapper.mutation;
const useUserQuery = TanstackWrapper.query;

const BookingAdapter = {
  bookAppointment: async ({
    payload,
  }: MutationCallBackArgs<BookAppointment>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await bookingService.mutate<BookAppointment, any>({
      slug: `create-appointment`,
      payload,
      type: "JSON",
      method: "POST",
    });

    return response;
  },

  getSessionHistory: async (params: string | undefined) => {
    const response = await bookingService.fetch<SessionHistory>(
      `/get-appointments?status=${params}`
    );
    return response;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateToken: async ({ payload, params }: MutationCallBackArgs<any>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await bookingService.mutate<any, GetAgoraToken>({
      slug: `generate-agora-token/${params}`,
      payload,
      type: "JSON",
      method: "POST",
    });

    return response;
  },
};

export { BookingAdapter, useBookingMutation, useUserQuery };
