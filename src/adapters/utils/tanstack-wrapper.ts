import {
  UseMutationResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  MutationCallBackArgs,
  QueryCallBackArgs,
} from "../types/TanstackUtilTypes";

export const TanstackWrapper = {
  mutation: <TData, TVariables, TError = unknown, TContext = unknown>({
    mutationCallback,
    params,
  }: {
    mutationCallback: ({
      payload,
      params,
    }: MutationCallBackArgs<TVariables>) => Promise<TData>;
    params?: string;
  }): UseMutationResult<TData, TError, TVariables, TContext> => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMutation<TData, TError, TVariables, TContext>({
      mutationFn: (payload: TVariables) =>
        mutationCallback({ payload, params }),
    });
  },
  query: <B>({
    queryCallback,
    queryKey,
    slug,
    enabled,
  }: QueryCallBackArgs<B>) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useQuery({
      queryKey: queryKey,
      queryFn: () => queryCallback(slug),
      enabled: enabled,
    });
  },
};

export default TanstackWrapper;
