import { useQuery, useMutation } from "@tanstack/react-query";
import { type MutationCallBack, type QueryCallBack } from "./helpers";
import { ApiService } from "@/services";

//API SERVICE INITIALIZER
const authService = new ApiService<{}, {}>("/service-providers");

// mutation utility
function serviceProviderMutation<T>(
  mutationCallback: MutationCallBack<T>,
  params: string
) {
  return useMutation({
    mutationFn: (variables: T) => mutationCallback(variables, params),
  });
}

// query utility
function serviceProviderQuery<B>(
  queryCallback: QueryCallBack<B>,
  queryKey: string[],
  params: string
) {
  return useQuery({
    queryKey: queryKey,
    queryFn: () => queryCallback(params),
  });
}

const ServiceProviderAdapter = {
  updateServiceProvider: async function (payload: FormData) {
    const res = await authService.mutate(
      "update",
      payload,
      "FormData",
      "PATCH"
    );
    return res;
  },
};
export {
  ServiceProviderAdapter,
  serviceProviderMutation,
  serviceProviderQuery,
};
