import ApiService from "./utils/api-service";
import TanstackWrapper from "./utils/tanstack-wrapper";
import { BookAppointment, SessionHistory } from "./types/BookingAdapterTypes";
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
};

export { BookingAdapter, useBookingMutation, useUserQuery };
