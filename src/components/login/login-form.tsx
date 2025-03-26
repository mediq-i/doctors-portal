"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { type LoginFormValues, loginSchema } from "@/lib/validations";
import { AuthAdapter, authMutation } from "../adapters";
import { getErrorMessage } from "@/utils";
import { toast } from "sonner";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { isPending, mutateAsync } = authMutation(AuthAdapter.loginAdmin, "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await mutateAsync(data);
      console.log(res?.data);
      localStorage.setItem("token", res?.data.token);

      // Redirect to dashboard or home page after successful login
      // router.push('/dashboard')
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="w-full md:max-w-md mx-auto lg:max-w-3xl pt-4 px-0 sm:px-6 xl:px-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-dimgrey">Enter your email address and password</p>
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
            className={`${errors.email ? "border-red-500" : ""} py-5`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className={`${errors.password ? "border-red-500 pr-10" : "pr-10"} py-5`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>

        <div className="flex pt-2 pb-6 justify-end">
          <Link
            to="/auth/forgot-password"
            className="text-blue-500 text-sm hover:underline"
          >
            Forgot Password
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full mt-6 rounded-xl py-6 font-semibold text-base"
          disabled={isPending}
        >
          {isPending ? "Logging in..." : "Continue"}
        </Button>

        <div className="relative flex items-center justify-center my-4">
          <div className="absolute border-t border-gray-300 w-full"></div>
          <span className="relative bg-white px-4 text-sm text-gray-500">
            or
          </span>
        </div>

        <div className="text-center text-base text-gray-500 pt-2">
          Don't have an account?{" "}
          <Link
            to="/onboarding/create-account"
            className="text-blue-500 hover:underline"
          >
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
}
