import ApiService from "./utils/api-service";
import TanstackWrapper from "./utils/tanstack-wrapper";
import { MutationCallBackArgs } from "./types/TanstackUtilTypes";
import {
  CreatePaymentIntent,
  TransactionHistory,
  VerifyPaymentPayload,
  SubAccountPayload,
} from "./types/PaymentAdapterTypes";

// api service initilizer
const paymentService = new ApiService("payments");
const usePaymentMutation = TanstackWrapper.mutation;
const usePaymentQuery = TanstackWrapper.query;

const PaymentAdapter = {
  createPaymentIntent: async ({
    payload,
  }: MutationCallBackArgs<CreatePaymentIntent>) => {
    const response = await paymentService.mutate<CreatePaymentIntent, unknown>({
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
    const response = await paymentService.mutate<VerifyPaymentPayload, unknown>(
      {
        slug: `verify`,
        payload,
        type: "JSON",
        method: "POST",
      }
    );

    return response;
  },
  getPaymentHistory: async ({
    id,
  }: {
    id: string | undefined;
  }): Promise<TransactionHistory> => {
    const response = await paymentService.fetch<TransactionHistory>(
      `/history/${id}`
    );

    return response;
  },
  createSubAccount: async ({
    payload,
    params,
  }: MutationCallBackArgs<SubAccountPayload>) => {
    const response = await paymentService.mutate<SubAccountPayload, unknown>({
      slug: `${params}/sub-account`,
      payload,
      type: "JSON",
      method: "POST",
    });

    return response;
  },
  updateSubAccount: async ({
    payload,
    params,
  }: MutationCallBackArgs<SubAccountPayload>) => {
    const response = await paymentService.mutate<SubAccountPayload, unknown>({
      slug: `${params}/sub-account`,
      payload,
      type: "JSON",
      method: "PUT",
    });

    return response;
  },
};

export { PaymentAdapter, usePaymentMutation, usePaymentQuery };
