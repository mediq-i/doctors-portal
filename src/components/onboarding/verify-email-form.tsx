import { useForm, Controller } from "react-hook-form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type VerificationCodeSchema,
  verificationCodeValidator,
} from "@/lib/validations";
import { LoadingIcon } from "../icons";
import { VerifyIcon } from "../icons";
import { useNavigate } from "@tanstack/react-router";
import { AuthAdapter, authMutation } from "../adapters";
import { getErrorMessage } from "@/utils";
import { useAuthStore } from "@/store/auth-store";
import { useFormStore } from "@/store/form-store";
import { useUserDetailsStore } from "@/store/user-details-store";
import { useOnboardingProgressStore } from "@/store/onboarding-progress";

interface VerifyEmailFormProps {
  onSubmit: (data: VerificationCodeSchema) => void;
  defaultValues?: Partial<VerificationCodeSchema>;
}

export default function VerifyEmailForm() {
  //   {
  //   onSubmit,
  //   defaultValues = {},
  // }: VerifyEmailFormProps
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationCodeSchema>({
    resolver: zodResolver(verificationCodeValidator),
  });

  const { isPending, mutateAsync } = authMutation(AuthAdapter.verifyEmail, "");

  const resendOTPMutation = authMutation(AuthAdapter.resendOtp, "");

  // const { formData } = useFormStore.getState();
  // const { email, firstName, lastName } = formData;
  const { email, firstName, lastName } = useUserDetailsStore((state) => state);
  const { nextStep } = useOnboardingProgressStore();

  const navigate = useNavigate();

  const onClickResendOTP = async () => {
    try {
      const res = resendOTPMutation.mutateAsync({ email: email! });
      console.log(res);
      toast.success("Please check your email for a new otp");
    } catch (error: any) {
      // toast.error(error.response.data.message);
      console.log(error);
      toast.error(getErrorMessage(error));
    }
  };

  const onSubmitVerificationCode = async (data: VerificationCodeSchema) => {
    // const { auth_id } = useAuthStore.getState();

    // if (!auth_id || !email || !firstName || !lastName) {
    //   toast.error("Missing user details. Please sign up again.");
    //   return;
    // }

    // const verificationPayload = {
    //   auth_id,
    //   email,
    //   firstName,
    //   lastName,
    //   userType: "service_provider",
    //   otp: data.otp,
    // };

    try {
      // const res = await mutateAsync(verificationPayload);
      // console.log("verify email response: ", res?.data);
      // localStorage.setItem("access_token", res?.data.session.access_token);
      // localStorage.setItem("refreshtoken", res?.data.session.access_token);
      console.log("verify email submit");

      // onSubmit(data);
      toast.success(
        "Email Verification Successful. Your account has been created"
      );
      nextStep();
      navigate({ to: "/onboarding/onboarding-steps" });
    } catch (error: any) {
      toast.error(getErrorMessage(error));
      console.log(error);
    }
  };

  return (
    <section className="w-full mx-auto pt-8 text-center  lg:max-w-3xl">
      <div className="flex flex-col items-center">
        <VerifyIcon />
        <h1 className="pb-2 leading-8 lg:leading-10 text-3xl font-bold pt-6">
          Verify your email
        </h1>
        <p className="pb-4 text-base font-medium text-[#707070]">
          Input the 6 digit verification code sent to your email{" "}
          {decodeURIComponent(email!)}
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmitVerificationCode)}
        className="flex flex-col gap-y-8 justify-center items-center mt-6"
      >
        <Controller
          name="otp"
          control={control}
          rules={{ required: true, minLength: 6, maxLength: 6 }}
          render={({ field }) => (
            <InputOTP
              maxLength={6}
              value={field.value}
              onChange={(value) => field.onChange(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          )}
        />
        {errors.otp && (
          <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
        )}

        <Button
          type="submit"
          className="w-full text-center text-base bg-primary border text-white py-6 rounded-lg transition-all duration-600 hover:text-neutral-50 hover:shadow-md"
          disabled={isPending}
        >
          {isPending ? <LoadingIcon /> : "Continue"}
        </Button>
      </form>

      <div className="mt-8 flex justify-center">
        <Button
          className="text-gunmetal text-sm flex gap-x-2 justify-center bg-transparent py-2.5 rounded-lg transition-all duration-300 hover:underline hover:bg-transparent hover:scale-105"
          onClick={() => onClickResendOTP()}
          disabled={resendOTPMutation.isPending}
        >
          {/* Resend code in
            <span className="text-sm text-primary-shade">02:00</span> */}
          {resendOTPMutation.isPending ? "Please Wait..." : "Resend OTP code"}
        </Button>
      </div>
    </section>
  );
}
