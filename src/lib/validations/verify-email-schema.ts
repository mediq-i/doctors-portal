import { z } from "zod";

export const verificationCodeValidator = z.object({
  code: z
    .string()
    .length(6, { message: "Verification code must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "Verification code must only contain digits" }),
});

export type VerificationCodeSchema = z.infer<typeof verificationCodeValidator>;

export const emailValidator = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email",
  }),
});

export type EmailSchema = z.infer<typeof emailValidator>;
