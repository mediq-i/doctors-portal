import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
// import {
//   ServiceProviderAdapter,
//   useUserMutation,
// } from "@/adapters/ServiceProviders";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BankDetails } from "@/lib/types/payment";
import { usePaymentMutation, PaymentAdapter } from "@/adapters/PaymentAdapter";

interface BankDetailsFormProps {
  initialData: {
    accountName: string;
    accountNumber: string;
    providerId: string | undefined;
    bankCode: string | undefined | null;
  };
}

export default function BankDetailsForm({ initialData }: BankDetailsFormProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialData);
  const [hasChanges, setHasChanges] = useState(false);

  const bankDetails = useQuery<BankDetails>({
    queryKey: ["bankDetails"],
    queryFn: () => {
      return axios.get("https://api.paystack.co/bank", {
        headers: {
          Authorization: import.meta.env
            .VITE_STAGING_PAYSTACK_SECRET_KEY as string,
        },
      });
    },
  });

  const { mutateAsync: createBankDetails, isPending: isCreatePending } =
    usePaymentMutation({
      mutationCallback: PaymentAdapter.createSubAccount,
      params: initialData.providerId,
    });

  const { mutateAsync: updateBankDetails, isPending: isUpdatePending } =
    usePaymentMutation({
      mutationCallback: PaymentAdapter.updateSubAccount,
      params: initialData.providerId,
    });

  const hasExistingAccount = !!initialData.accountNumber;

  useEffect(() => {
    const hasFormChanges =
      formData.accountName !== initialData.accountName ||
      formData.accountNumber !== initialData.accountNumber ||
      formData.bankCode !== initialData.bankCode;

    setHasChanges(hasFormChanges);
  }, [formData, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        accountName: formData.accountName,
        bankCode: formData.bankCode || "",
        accountNumber: formData.accountNumber,
      };

      if (hasExistingAccount) {
        await updateBankDetails(payload);
        toast.success("Bank details updated successfully");
      } else {
        await createBankDetails(payload);
        toast.success("Bank details added successfully");
      }

      queryClient.invalidateQueries({ queryKey: ["serviceProvider"] });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update bank details");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="accountName">Account Name</Label>
        <Input
          id="accountName"
          name="accountName"
          value={formData.accountName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bankName">Bank Name</Label>
        <Select
          value={formData.bankCode!}
          onValueChange={(value) => handleSelectChange("bankCode", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a bank">
              {bankDetails.data?.data.data.find(
                (bank) => bank.code === formData.bankCode
              )?.name || "Select a bank"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {bankDetails.data?.data.data.map((bank) => (
              <SelectItem key={bank.id} value={bank.code}>
                {bank.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          required
          maxLength={10}
          pattern="[0-9]{10}"
          title="Please enter a valid 10-digit account number"
        />
        <p className="text-sm text-muted-foreground">
          Enter your 10-digit bank account number
        </p>
      </div>

      <Button
        type="submit"
        className="w-max"
        disabled={isCreatePending || isUpdatePending || !hasChanges}
      >
        {isCreatePending || isUpdatePending
          ? "Processing..."
          : hasExistingAccount
            ? "Save Changes"
            : "Add Bank Details"}
      </Button>
    </form>
  );
}
