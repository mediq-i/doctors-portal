import ApiService from "./utils/api-service";
import TanstackWrapper from "./utils/tanstack-wrapper";
// import { MutationCallBackArgs } from "./types/TanstackUtilTypes";
import { GetWalletResponse } from "./types/WalletsAdapterTypes";

// api service initilizer
const walletsService = new ApiService("wallets/service_provider");
const useWalletsMutation = TanstackWrapper.mutation;
const useWalletsQuery = TanstackWrapper.query;

const WalletsAdapter = {
  getWallet: async ({
    params,
  }: {
    params: string | null;
  }): Promise<GetWalletResponse> => {
    const response = await walletsService.fetch<GetWalletResponse>(
      `/${params}`
    );

    return response;
  },
};

export { WalletsAdapter, useWalletsMutation, useWalletsQuery };
