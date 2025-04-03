import { AxiosResponse } from "axios";

export type MutationCallBack<R> = (
  payload: R,
  params: string,
  token: string
) => Promise<AxiosResponse | undefined>;

export type QueryCallBack<B> = (slug: string | undefined) => Promise<B>;

export type MutationCallBackArgs<TPayload> = {
  payload: TPayload;
  params?: string;
};

export type QueryCallBackArgs<TResponse> = {
  slug?: string;
  queryCallback: QueryCallBack<TResponse>;
  queryKey: string[];
  enabled?: boolean;
};
