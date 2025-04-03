import ApiService from "./utils/api-service";
import TanstackWrapper from "./utils/tanstack-wrapper";
import { MutationCallBackArgs } from "./types/TanstackUtilTypes";
import {
  CreatePaymentIntent,
  TransactionHistory,
  VerifyPaymentPayload,
} from "./types/PaymentAdapterTypes";

// api service initilizer
const paymentService = new ApiService("payments");
const usePaymentMutation = TanstackWrapper.mutation;
const usePaymentQuery = TanstackWrapper.query;

const PaymentAdapter = {
  createPaymentIntent: async ({
    payload,
  }: MutationCallBackArgs<CreatePaymentIntent>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await paymentService.mutate<CreatePaymentIntent, any>({
      slug: `create-intent`,
      payload,
      type: "JSON",
      method: "POST",
    });

    return response;
  },
  verifyPayment: async ({
    payload,
  }: MutationCallBackArgs<VerifyPaymentPayload>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await paymentService.mutate<VerifyPaymentPayload, any>({
      slug: `verify`,
      payload,
      type: "JSON",
      method: "POST",
    });

    return response;
  },
  getPaymentHistory: async ({
    id,
  }: {
    id: string | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<TransactionHistory> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await paymentService.fetch<TransactionHistory>(
      `/history/${id}`
    );

    return response;
  },
};

export { PaymentAdapter, usePaymentMutation, usePaymentQuery };
