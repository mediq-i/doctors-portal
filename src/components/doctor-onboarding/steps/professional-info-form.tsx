import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDoctorOnboardingStore from "@/store/doctor-onboarding-store";
import { useState } from "react";

const MEDICAL_BOARDS = [
  { value: "mdcn", label: "Medical and Dental Council of Nigeria (MDCN)" },
  { value: "nmcn", label: "Nursing and Midwifery Council of Nigeria (NMCN)" },
  { value: "pcn", label: "Pharmacists Council of Nigeria (PCN)" },
  { value: "others", label: "Others" },
];

const SPECIALTIES = [
  { value: "general-medicine", label: "General Medicine" },
  { value: "cardiology", label: "Cardiology" },
  { value: "dermatology", label: "Dermatology" },
  { value: "endocrinology", label: "Endocrinology" },
  { value: "gastroenterology", label: "Gastroenterology" },
  { value: "neurology", label: "Neurology" },
  { value: "oncology", label: "Oncology" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "psychiatry", label: "Psychiatry" },
  { value: "surgery", label: "Surgery" },
  { value: "urology", label: "Urology" },
  { value: "dietetics", label: "Dietetics" },
  { value: "nutrition", label: "Nutritionist" },
  { value: "physiotherapy", label: "Physiotherapy" },
  { value: "psychology", label: "Psychology" },
  { value: "radiology", label: "Radiology" },
  { value: "radiotherapy", label: "Radiotherapy" },
  { value: "rehabilitation", label: "Rehabilitation" },
];

const professionalInfoSchema = z.object({
  medical_license_no: z.string().min(1, "Medical license number is required"),
  issuing_medical_board: z.string().min(1, "Issuing medical board is required"),
  custom_medical_board: z.string().optional(),
  specialty: z.string().min(1, "Specialty is required"),
  years_of_experience: z.string().min(1, "Years of experience is required"),
  professional_associations: z.string().optional(),
});

type ProfessionalInfoFormValues = z.infer<typeof professionalInfoSchema>;

export function ProfessionalInfoForm() {
  const { updateFormStep, updateProfessionalInfo, professionalInfo } =
    useDoctorOnboardingStore();
  const [showCustomBoard, setShowCustomBoard] = useState(false);
  const [customBoardName, setCustomBoardName] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfessionalInfoFormValues>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: professionalInfo,
  });

  const onSubmit = (data: ProfessionalInfoFormValues) => {
    const finalData = {
      ...data,
      issuing_medical_board:
        data.issuing_medical_board === "others"
          ? customBoardName
          : data.issuing_medical_board,
    };

    Object.entries(finalData).forEach(([key, value]) => {
      updateProfessionalInfo(key as keyof typeof professionalInfo, value);
    });

    updateFormStep(3);
  };

  return (
    <div className="w-full md:max-w-md mx-auto lg:max-w-3xl pt-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Professional Information</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="medical_license_no">Medical License Number</Label>
          <Input
            id="medical_license_no"
            {...register("medical_license_no")}
            className={errors.medical_license_no ? "border-destructive" : ""}
            onChange={(e) => {
              setValue("medical_license_no", e.target.value);
              updateProfessionalInfo("medical_license_no", e.target.value);
            }}
          />
          {errors.medical_license_no && (
            <p className="text-sm text-destructive">
              {errors.medical_license_no.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="issuingMedicalBoard">Issuing Medical Board</Label>
          <Select
            defaultValue={professionalInfo.issuing_medical_board}
            onValueChange={(value) => {
              setValue("issuing_medical_board", value);
              setShowCustomBoard(value === "others");
              updateProfessionalInfo("issuing_medical_board", value);
            }}
          >
            <SelectTrigger
              className={`w-full ${errors.issuing_medical_board ? "border-destructive" : ""}`}
            >
              <SelectValue placeholder="Select a medical board" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {MEDICAL_BOARDS.map((board) => (
                <SelectItem key={board.value} value={board.value}>
                  {board.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.issuing_medical_board && (
            <p className="text-sm text-destructive">
              {errors.issuing_medical_board.message}
            </p>
          )}
          {showCustomBoard && (
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Enter medical board name"
                value={customBoardName}
                onChange={(e) => setCustomBoardName(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => {
                  if (customBoardName.trim()) {
                    updateProfessionalInfo(
                      "issuing_medical_board",
                      customBoardName
                    );
                  }
                }}
              >
                Add
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialty">Specialty</Label>
          <Select
            defaultValue={professionalInfo.specialty}
            onValueChange={(value) => {
              setValue("specialty", value);
              updateProfessionalInfo("specialty", value);
            }}
          >
            <SelectTrigger
              className={`w-full ${errors.specialty ? "border-destructive" : ""}`}
            >
              <SelectValue placeholder="Select a specialty" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {SPECIALTIES.map((specialty) => (
                <SelectItem key={specialty.value} value={specialty.value}>
                  {specialty.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.specialty && (
            <p className="text-sm text-destructive">
              {errors.specialty.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="years_of_experience">Years of Experience</Label>
          <Input
            id="years_of_experience"
            type="number"
            {...register("years_of_experience")}
            className={errors.years_of_experience ? "border-destructive" : ""}
            onChange={(e) => {
              setValue("years_of_experience", e.target.value);
              updateProfessionalInfo("years_of_experience", e.target.value);
            }}
          />
          {errors.years_of_experience && (
            <p className="text-sm text-destructive">
              {errors.years_of_experience.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="professional_associations">
            Professional Associations
          </Label>
          <Input
            id="professional_associations"
            {...register("professional_associations")}
            className={
              errors.professional_associations ? "border-destructive" : ""
            }
            onChange={(e) => {
              setValue("professional_associations", e.target.value);
              updateProfessionalInfo(
                "professional_associations",
                e.target.value
              );
            }}
          />
          {errors.professional_associations && (
            <p className="text-sm text-destructive">
              {errors.professional_associations.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-6 rounded-xl py-6 font-semibold text-base"
        >
          Continue
        </Button>
      </form>
    </div>
  );
}
