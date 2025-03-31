import ApiService from "./utils/api-service";
import {
  CreatePatientPayload,
  ForgotPasswordPayload,
  LoginPayload,
  ResendOTPPayload,
  ResetPasswordPayload,
  SignUpPayload,
  SignUpResponse,
  VerifyEmailAuthPayload,
  VerifyEmailAuthResponse,
} from "./types/AuthAdapterTypes";
import TanstackWrapper from "./utils/tanstack-wrapper";
import { MutationCallBackArgs } from "./types/TanstackUtilTypes";

// api service initilizer
const authService = new ApiService("/auth");
const useAuthMutation = TanstackWrapper.mutation;
const useAuthQuery = TanstackWrapper.query;

const AuthAdapter = {
  signUp: async ({ payload, params }: MutationCallBackArgs<SignUpPayload>) => {
    const response = await authService.mutate<SignUpPayload, SignUpResponse>({
      slug: `signup?type=${params}`,
      payload,
      type: "JSON",
      method: "POST",
    });
    return response;
  },
  verifyEmailAuth: async ({
    payload,
  }: MutationCallBackArgs<VerifyEmailAuthPayload>) => {
    const response = await authService.mutate<
      VerifyEmailAuthPayload,
      VerifyEmailAuthResponse
    >({
      slug: `verify-email`,
      payload,
      type: "JSON",
      method: "POST",
    });
    return response;
  },
  createPatient: async ({
    payload,
  }: MutationCallBackArgs<CreatePatientPayload>) => {
    const response = await authService.mutate<
      CreatePatientPayload,
      CreatePatientPayload
    >({
      slug: `create-patient/${payload.authId}`,
      //@ts-expect-error types not correct, will fix later
      payload: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
      },
      type: "JSON",
      method: "POST",
    });
    return response;
  },
  login: async ({ payload }: MutationCallBackArgs<LoginPayload>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await authService.mutate<any,any>({
      slug: `login`,
      payload: {
        password: payload.password,
        email: payload.email,
      },
      type: "JSON",
      method: "POST",
    });
    return response;
  },
  forgotPassword: async ({ payload }: MutationCallBackArgs<ForgotPasswordPayload>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await authService.mutate<any,any>({
      slug: `password-recovery`,
      payload: {
        email: payload.email,
      },
      type: "JSON",
      method: "POST",
    });
    return response;
  },
  resetPassword: async ({ payload }: MutationCallBackArgs<ResetPasswordPayload>,) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await authService.mutate<any,any>({
      slug: `reset-password`,
      payload: {
        password: payload.password,
        refreshToken: payload.refreshToken,
      },
      type: "JSON",
      method: "PATCH",
      
    });
    return response;
  },
  resendOTP: async ({ payload }: MutationCallBackArgs<ResendOTPPayload>,) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await authService.mutate<any,any>({
      slug: `resend-otp`,
      payload: {
        email: payload.email,
        
      },
      type: "JSON",
      method: "POST",
      
    });
    return response;
  },
};

export { AuthAdapter, useAuthMutation, useAuthQuery };
