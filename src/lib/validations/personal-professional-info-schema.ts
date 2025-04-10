import { z } from "zod";

// Zod schema for the form
export const personalInfoSchema = z.object({
  legalFirstName: z.string().min(1, "Legal first name is required"),
  legalLastName: z.string().min(1, "Legal last name is required"),
  languages: z.string().min(1, "Please enter at least one language"),
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

export const professionalInfoSchema = z.object({
  medicalLicenseNumber: z
    .string()
    .min(1, "Medical license number is required")
    .regex(/^\d+$/, "License number must contain only digits")
    .length(12, "License number must be exactly 12 digits"),

  issuingMedicalBoard: z.string().min(1, "Issuing medical board is required"),

  specialty: z.string().min(1, "Specialty is required"),

  yearsOfExperience: z
    .string()
    .min(1, "Years of experience is required")
    .regex(/^\d+$/, "Years must be a number")
    .refine((val) => Number.parseInt(val) >= 0 && Number.parseInt(val) <= 70, {
      message: "Years of experience must be between 0 and 70",
    }),

  professionalAssociations: z
    .string()
    .min(1, "Professional associations are required")
    .max(500, "Professional associations cannot exceed 500 characters"),
});

export type ProfessionalInfoFormValues = z.infer<typeof professionalInfoSchema>;
