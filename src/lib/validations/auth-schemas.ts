import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Infer the type from the schema
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
