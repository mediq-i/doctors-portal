import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ProfessionalInfoFormValues,
  professionalInfoSchema,
} from "@/lib/validations";
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
import { medicalBoards, specialties } from "../data/constants";

interface ProfessionalInfoFormProps {
  onSubmit: (data: ProfessionalInfoFormValues) => void;
  defaultValues?: Partial<ProfessionalInfoFormValues>;
}

export default function ProfessionalInfoForm({
  onSubmit,
  defaultValues = {},
}: ProfessionalInfoFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfessionalInfoFormValues>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues,
  });

  const onSubmitFormInput = async (data: ProfessionalInfoFormValues) => {
    try {
      console.log("Form data:", data);
      onSubmit(data);
      // Here you would typically send the data to your API
      // await submitProfessionalInfo(data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to the next step
      // navigate("/next-step")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full md:max-w-md lg:max-w-3xl pt-4">
      <div className="mb-6">
        <h1 className="pb-2 leading-8 lg:leading-10 text-xl md:text-2xl lg:text-3xl font-bold pt-6 max-w-lg">
          Enter your professional information
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmitFormInput)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="medicalLicenseNumber">Medical License Number</Label>
          <Input
            id="medicalLicenseNumber"
            placeholder="Enter 12 digits"
            {...register("medicalLicenseNumber")}
            className={errors.medicalLicenseNumber ? "border-destructive" : ""}
          />
          {errors.medicalLicenseNumber && (
            <p className="text-sm text-destructive">
              {errors.medicalLicenseNumber.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="issuingMedicalBoard">Issuing Medical Board</Label>
          <Select
            onValueChange={(value) => {
              const selectedBoard = medicalBoards.find(
                (board) => board.id === value
              );
              setValue(
                "issuingMedicalBoard",
                selectedBoard ? selectedBoard.name : ""
              );
            }}
            defaultValue={
              medicalBoards.find(
                (board) => board.name === defaultValues?.issuingMedicalBoard
              )?.id || ""
            }
          >
            <SelectTrigger
              id="issuingMedicalBoard"
              className={`${errors.issuingMedicalBoard ? "border-destructive" : ""} w-full`}
            >
              <SelectValue placeholder="ex. Nigerian dental association" />
            </SelectTrigger>
            <SelectContent>
              {medicalBoards.map((board) => (
                <SelectItem key={board.id} value={board.id}>
                  {board.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.issuingMedicalBoard && (
            <p className="text-sm text-destructive">
              {errors.issuingMedicalBoard.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialty">Specialty/Sub-specialties</Label>
          <Select
            onValueChange={(value) => {
              const selectedSpecialty = specialties.find(
                (specialty) => specialty.id === value
              );
              setValue(
                "specialty",
                selectedSpecialty ? selectedSpecialty.name : ""
              );
            }}
            defaultValue={
              specialties.find(
                (specialty) => specialty.name === defaultValues?.specialty
              )?.id || ""
            }
          >
            <SelectTrigger
              id="specialty"
              className={`${errors.specialty ? "border-destructive" : ""} w-full`}
            >
              <SelectValue placeholder="ex. Cardiologist" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem key={specialty.id} value={specialty.id}>
                  {specialty.name}
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
          <Label htmlFor="yearsOfExperience">Years of Experience</Label>
          <Input
            id="yearsOfExperience"
            placeholder="Years of experience"
            {...register("yearsOfExperience")}
            className={errors.yearsOfExperience ? "border-destructive" : ""}
          />
          {errors.yearsOfExperience && (
            <p className="text-sm text-destructive">
              {errors.yearsOfExperience.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="professionalAssociations">
            Professional Associations
          </Label>
          <Input
            id="professionalAssociations"
            placeholder="Enter professional associations"
            {...register("professionalAssociations")}
            className={
              errors.professionalAssociations ? "border-destructive" : ""
            }
          />
          {errors.professionalAssociations && (
            <p className="text-sm text-destructive">
              {errors.professionalAssociations.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-6 rounded-xl py-6 font-semibold text-base"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Continue"}
        </Button>
      </form>
    </div>
  );
}
