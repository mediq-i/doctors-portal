export type CreatePaymentIntent = {
  patientId: string | undefined;
  providerId: string | null;
  appointmentId: string | undefined;
  amount: number;
  currency: string;
  description: string;
};

export type VerifyPaymentPayload = {
  reference: string;
};

type PaymentMethodDetails = {
  account_name: string | null;
  authorization_code: string;
  bank: string;
  bin: string;
  brand: string;
  card_type: string;
  channel: string;
  country_code: string;
  exp_month: string;
  exp_year: string;
  last4: string;
  receiver_bank: string | null;
  receiver_bank_account_number: string | null;
  reusable: boolean;
  signature: string;
};

export type Payment = {
  amount: number;
  appointment_id: string;
  created_at: string;
  currency: string;
  id: string;
  patient_id: string;
  payment_intent_id: string;
  payment_method: "CARD" | string;
  payment_method_details: PaymentMethodDetails;
  transaction_id: string;
  status: string;
  paystack_reference: string;
};

export type TransactionHistory = {
  data: {
    transactions: Payment[];
  };
};

export type SubAccountPayload = {
  bankCode: string;
  accountNumber: string;
  accountName: string;
};
