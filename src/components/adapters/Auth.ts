import { useQuery, useMutation } from "@tanstack/react-query";
import { type MutationCallBack, type QueryCallBack } from "./helpers";
import { ApiService } from "@/services";
import {
  LoginFormValues,
  CreateAccountSchema,
  EmailSchema,
  ForgotPasswordFormValues,
} from "@/lib/validations";
import { VerifyEmailTypes, ResetPasswordTypes } from "@/lib/types";
import { AxiosResponse } from "axios";

interface SignUpResponse {
  auth_id: string;
}

//API SERVICE INITIALIZER
const authService = new ApiService<{}, {}>("/auth");

// mutation utility
function authMutation<T>(
  mutationCallback: MutationCallBack<T>,
  params: string
) {
  return useMutation({
    mutationFn: (variables: T) => mutationCallback(variables, params),
  });
}

// query utility
function authQuery<B>(
  queryCallback: QueryCallBack<B>,
  queryKey: string[],
  params: string
) {
  return useQuery({
    queryKey: queryKey,
    queryFn: () => queryCallback(params),
  });
}

const AuthAdapter = {
  loginAdmin: async function (payload: LoginFormValues) {
    const res = await authService.mutate("login", payload, "JSON", "POST");
    return res;
  },
  signUp: async function (payload: CreateAccountSchema) {
    const res = await authService.mutate(
      "signup?type=service_provider",
      payload,
      "JSON",
      "POST"
    );
    return res as AxiosResponse<SignUpResponse, any>;
  },
  verifyEmail: async function (payload: VerifyEmailTypes) {
    const res = await authService.mutate(
      "verify-email",
      payload,
      "JSON",
      "POST"
    );
    return res;
  },
  resendOtp: async function (payload: EmailSchema) {
    const res = await authService.mutate("resend-otp", payload, "JSON", "POST");
    return res;
  },
  sendPasswordRecoveryEmail: async function (
    payload: ForgotPasswordFormValues
  ) {
    const res = await authService.mutate(
      "password-recovery",
      payload,
      "JSON",
      "POST"
    );
    return res;
  },
  resetPassword: async function (payload: ResetPasswordTypes) {
    const res = await authService.mutate(
      "reset-password",
      payload,
      "JSON",
      "PATCH"
    );
    return res;
  },
};

export { authMutation, authQuery, AuthAdapter };
