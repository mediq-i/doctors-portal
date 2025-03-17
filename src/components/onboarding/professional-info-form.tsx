import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  personalInfoSchema,
  type PersonalInfoFormValues,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PersonalInfoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
  });

  const onSubmit = async (data: PersonalInfoFormValues) => {
    try {
      console.log("Form data:", data);
      //navigate to the next step
    } catch (error) {
      console.error(error);
    }
  };

  // Helper function to format date input as user types
  const formatDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    let value = input.value.replace(/[^\d]/g, ""); // Remove all non-digits
    const cursorPosition = input.selectionStart || 0;
    const previousValue = input.value;

    // Calculate how many slashes were before the cursor
    const slashesBeforeCursor = (
      previousValue.substring(0, cursorPosition).match(/\//g) || []
    ).length;

    // Format with slashes
    if (value.length > 4) {
      value = `${value.substring(0, 2)}/${value.substring(2, 4)}/${value.substring(4, 8)}`;
    } else if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    } else if (value.length === 2) {
      value = `${value}/`;
    }

    // Limit to 10 characters total (DD/MM/YYYY)
    if (value.length > 10) {
      value = value.substring(0, 10);
    }

    // Set the new value
    input.value = value;

    // Calculate new cursor position
    const newSlashesBeforeCursor = (
      value.substring(0, cursorPosition).match(/\//g) || []
    ).length;
    const slashDifference = newSlashesBeforeCursor - slashesBeforeCursor;

    // Adjust cursor position if we added slashes
    setTimeout(() => {
      input.selectionStart = input.selectionEnd =
        cursorPosition + slashDifference;
    }, 0);

    return value;
  };

  return (
    <div className="w-full md:max-w-md mx-auto lg:max-w-3xl pt-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Enter your Personal Information</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="legalFirstName"
            className="text-sm text-muted-foreground"
          >
            Legal First Name
          </Label>
          <Input
            id="legalFirstName"
            placeholder="Legal first name"
            {...register("legalFirstName")}
            className={errors.legalFirstName ? "border-destructive" : "py-5"}
          />
          {errors.legalFirstName && (
            <p className="text-sm text-destructive">
              {errors.legalFirstName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="legalLastName"
            className="text-sm text-muted-foreground"
          >
            Legal Last Name
          </Label>
          <Input
            id="legalLastName"
            placeholder="Legal last name"
            {...register("legalLastName")}
            className={errors.legalLastName ? "border-destructive" : "py-5"}
          />
          {errors.legalLastName && (
            <p className="text-sm text-destructive">
              {errors.legalLastName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="dateOfBirth"
            className="text-sm text-muted-foreground"
          >
            Date of Birth
          </Label>
          <Input
            id="dateOfBirth"
            placeholder="DD/MM/YYYY"
            {...register("dateOfBirth")}
            onChange={(e) => {
              formatDateInput(e);
              register("dateOfBirth").onChange(e); // Make sure React Hook Form knows about the change
            }}
            className={errors.dateOfBirth ? "border-destructive" : "py-5"}
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-destructive">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-primary text-white hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Continue"}
        </Button>
      </form>
    </div>
  );
}
