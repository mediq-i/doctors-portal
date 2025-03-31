export type GetWalletResponse = {
  data: {
    id: string;
    created_at: string;
    updated_at: string;
    pending_balance: number;
    available_balance: number;
    service_provider_id: string;
    currency: string;
    bank_account_details: string | null;
  };
};
