"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { type LoginFormValues, loginSchema } from "@/lib/validations";

export default function LoginForm() {
  const [showPasscode, setShowPasscode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      passcode: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Here you would typically send the data to your API
      console.log("Form data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to dashboard or home page after successful login
      // router.push('/dashboard')
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto border border-blue-100 rounded-lg p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
        <p className="text-gray-500 text-sm">
          Enter the email address and passcode
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
            placeholder="Email address"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="passcode" className="text-sm">
            Passcode
          </Label>
          <div className="relative">
            <Input
              id="passcode"
              type={showPasscode ? "text" : "password"}
              placeholder="Passcode"
              {...register("passcode")}
              className={errors.passcode ? "border-red-500 pr-10" : "pr-10"}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPasscode(!showPasscode)}
            >
              {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.passcode && (
            <p className="text-red-500 text-xs">{errors.passcode.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="rememberMe" {...register("rememberMe")} />
            <Label htmlFor="rememberMe" className="text-sm font-normal">
              Remember me
            </Label>
          </div>
          <Link
            to="/auth/forgot-password"
            className="text-blue-500 text-sm hover:underline"
          >
            Forgot Password
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Continue"}
        </Button>

        <div className="text-center text-sm text-gray-500 mt-4">
          <span>or</span>
          <div className="mt-2">
            Don't have an account?{" "}
            <Link
              to="/onboarding/create-account"
              className="text-blue-500 hover:underline"
            >
              Create account
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
