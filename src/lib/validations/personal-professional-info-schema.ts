import { z } from "zod";

// Zod schema for the form
export const personalInfoSchema = z.object({
  legalFirstName: z.string().min(1, "Legal first name is required"),
  legalLastName: z.string().min(1, "Legal last name is required"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine(
      (value) => {
        // Check if the date format is DD/MM/YYYY
        const dateRegex =
          /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d$/;
        return dateRegex.test(value);
      },
      {
        message: "Date must be in DD/MM/YYYY format",
      }
    )
    .refine(
      (value) => {
        // Check if the date is valid
        const [day, month, year] = value.split("/").map(Number);
        const date = new Date(year, month - 1, day);
        return (
          date.getDate() === day &&
          date.getMonth() === month - 1 &&
          date.getFullYear() === year
        );
      },
      {
        message: "Please enter a valid date",
      }
    )
    .refine(
      (value) => {
        // Check if the date is not in the future
        const [day, month, year] = value.split("/").map(Number);
        const date = new Date(year, month - 1, day);
        return date <= new Date();
      },
      {
        message: "Date of birth cannot be in the future",
      }
    )
    .refine(
      (value) => {
        // Check if the person is at least 18 years old
        const [day, month, year] = value.split("/").map(Number);
        const date = new Date(year, month - 1, day);
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < date.getDate())
        ) {
          return age - 1 >= 18;
        }
        return age >= 18;
      },
      {
        message: "You must be at least 18 years old",
      }
    ),
});

// Type for the form values
export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
