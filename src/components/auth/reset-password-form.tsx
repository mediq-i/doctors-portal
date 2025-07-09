import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations";
import { AuthAdapter, authMutation } from "../adapters";
import { getErrorMessage } from "@/utils";
import { toast } from "sonner";

export default function ResetPasswordForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [refreshToken, setRefreshToken] = useState<string | null>("");
  const { isPending, isSuccess, mutateAsync } = authMutation(
    AuthAdapter.resetPassword,
    ""
  );

  useEffect(() => {
    // Get the full URL fragment
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token"); // Extract access_token
    const refreshToken = hashParams.get("refresh_token"); // Extract refresh_token
    setRefreshToken(refreshToken);

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    } else if (!refreshToken) {
      toast.error("No refresh token found");
    } else {
      toast.error("No access token found");
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    const resetPasswordPayload = {
      refreshToken,
      password: data.password,
    };

    try {
      await mutateAsync(resetPasswordPayload);
      toast.success("Reset password Successful");
      navigate({ to: "/auth/login" });
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto border border-blue-100 rounded-lg p-8">
      {!isSuccess ? (
        <>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
            <p className="text-gray-500 text-sm">
              Create a new password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  {...register("password")}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
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
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  {...register("confirmPassword")}
                  className={
                    errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Password requirements:
              </p>
              <ul className="text-xs text-gray-600 space-y-1 pl-5 list-disc">
                <li>At least 8 characters long</li>
                <li>At least one uppercase letter</li>
                <li>At least one lowercase letter</li>
                <li>At least one number</li>
              </ul>
            </div> */}

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={isPending}
            >
              {isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center py-6">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-2">
            Password Reset Successful
          </h2>

          <p className="text-sm text-gray-700 mb-6">
            Your password has been successfully reset. You can now log in with
            your new password.
          </p>

          <Link to="/auth/login" className="block">
            <Button
              type="button"
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Back to Login
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
