import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations";
import { AuthAdapter, authMutation } from "../adapters";
import { getErrorMessage } from "@/utils";
import { toast } from "sonner";
import { useState } from "react";

export default function ForgotPasswordForm() {
  const [submittedEmail, setSubmittedEmail] = useState("");
  const { isSuccess, mutateAsync } = authMutation(
    AuthAdapter.sendPasswordRecoveryEmail,
    ""
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await mutateAsync({
        email: data.email,
        domainOrigin: "service-provider-portal",
      });

      toast.success(
        "Please check your mail for the next steps on how to proceed"
      );
      setSubmittedEmail(data.email);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="w-full md:max-w-md mx-auto lg:max-w-3xl pt-4 px-0 sm:px-6 xl:px-10">
      {!isSuccess ? (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
            <p className="text-gray-500 text-sm">
              Enter your email address and we'll send you a link to reset your
              password
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                {...register("email")}
                className={`${errors.email ? "border-red-500" : ""} py-6`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-6 rounded-xl py-6 font-semibold text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center mt-4">
              <Link
                to="/auth/login"
                className="inline-flex items-center text-sm text-blue-500 hover:underline"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to login
              </Link>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center py-6">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-2">Check your email</h2>

          <div className="bg-blue-50 rounded-lg p-4 mb-4 flex">
            <Mail className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              We've sent a password reset link to{" "}
              <span className="font-medium">{submittedEmail}</span>. Please
              check your inbox and follow the instructions to reset your
              password.
            </p>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            If you don't see the email, check your spam folder or try again.
          </p>

          <div className="space-y-3">
            <Link to="/auth/login" className="block">
              <Button
                type="button"
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                Back to login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
