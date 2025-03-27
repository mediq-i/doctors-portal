import type React from "react";

import { useState } from "react";
import { FileText, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

type IDType = "nin" | "passport" | "driversLicense";

interface IDVerificationFormProps {
  initialData: {
    idType: IDType;
    idNumber: string;
    idExpiryDate?: string;
    idDocument?: string;
  };
}

export default function IDVerificationForm({
  initialData,
}: IDVerificationFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIdTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, idType: value as IDType }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would submit the data to your API
    toast("ID verification updated");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label>ID Type</Label>
        <RadioGroup
          value={formData.idType}
          onValueChange={handleIdTypeChange}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="nin" id="nin" />
            <Label htmlFor="nin">National Identification Number (NIN)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="passport" id="passport" />
            <Label htmlFor="passport">International Passport</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="driversLicense" id="driversLicense" />
            <Label htmlFor="driversLicense">Driver's License</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="idNumber">ID Number</Label>
        <Input
          id="idNumber"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
          required
        />
      </div>

      {(formData.idType === "passport" ||
        formData.idType === "driversLicense") && (
        <div className="space-y-2">
          <Label htmlFor="idExpiryDate">Expiry Date</Label>
          <Input
            id="idExpiryDate"
            name="idExpiryDate"
            type="date"
            value={formData.idExpiryDate}
            onChange={handleChange}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Upload ID Document</Label>
        <div className="mt-1 flex items-center gap-4">
          {initialData.idDocument && (
            <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Current document</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-2 h-auto p-0 text-xs font-medium text-primary"
                onClick={() => window.open(initialData.idDocument, "_blank")}
              >
                View
              </Button>
            </div>
          )}
          <div className="flex-1">
            <Label
              htmlFor="idDocument"
              className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm hover:bg-muted/50"
            >
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {file ? file.name : "Upload new document"}
              </span>
              <Input
                id="idDocument"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
              />
            </Label>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Accepted formats: PDF, JPG, JPEG, PNG. Max size: 5MB
        </p>
      </div>
    </form>
  );
}
