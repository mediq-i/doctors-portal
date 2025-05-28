export type Bank = {
  active: boolean;
  code: string;
  country: string;
  createdAt: string;
  currency: string;
  gateway: null | string;
  id: number;
  is_deleted: boolean;
  longcode: string;
  name: string;
  pay_with_bank: boolean;
  slug: string;
  supports_transfer: boolean;
  type: string;
  updatedAt: string;
};

export type BankDetails = {
  data: {
    data: Bank[];
  };
};
