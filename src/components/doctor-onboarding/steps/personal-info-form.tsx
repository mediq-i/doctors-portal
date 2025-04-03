import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDoctorOnboardingStore from "@/store/doctor-onboarding-store";

const personalInfoSchema = z.object({
  dob: z.string().min(1, "Date of birth is required"),
  languages: z.string().min(1, "Languages are required"),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

export function PersonalInfoForm() {
  const { updateFormStep, updatePersonalInfo, personalInfo } =
    useDoctorOnboardingStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfo,
  });

  const onSubmit = (data: PersonalInfoFormValues) => {
    Object.entries(data).forEach(([key, value]) => {
      updatePersonalInfo(key as keyof typeof personalInfo, value);
    });

    updateFormStep(2);
  };

  // Calculate max date (today) and min date (120 years ago)
  const today = new Date().toISOString().split("T")[0];
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 120);
  const minDateString = minDate.toISOString().split("T")[0];

  return (
    <div className="w-full md:max-w-md mx-auto lg:max-w-3xl pt-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Enter your Personal Information</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            type="date"
            id="dob"
            max={today}
            min={minDateString}
            {...register("dob")}
            className={`${errors.dob ? "border-destructive" : ""} py-5`}
          />
          {errors.dob && (
            <p className="text-sm text-destructive">{errors.dob.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="languages">Languages</Label>
          <Input
            id="languages"
            placeholder="Enter languages separated by commas"
            {...register("languages")}
            className={errors.languages ? "border-destructive" : ""}
          />
          <p className="text-sm text-muted-foreground">
            Enter all languages you speak, separated by commas (e.g., English,
            French, Yoruba)
          </p>
          {errors.languages && (
            <p className="text-sm text-destructive">
              {errors.languages.message}
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
