import { useQuery, useMutation } from "@tanstack/react-query";
import { type MutationCallBack, type QueryCallBack } from "./helpers";
import { ApiService } from "@/services";
import {
  LoginFormValues,
  CreateAccountSchema,
  VerificationCodeSchema,
} from "@/lib/validations";
import { VerifyEmailTypes } from "@/lib/types";

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
    return res;
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
};

export { authMutation, authQuery, AuthAdapter };
