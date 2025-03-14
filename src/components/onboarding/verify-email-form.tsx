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
  VerificationCodeSchema,
  verificationCodeValidator,
  EmailSchema,
} from "@/lib/validations";
import { LoadingIcon } from "../icons";
import { VerifyIcon } from "../icons";

export default function VerifyEmailForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerificationCodeSchema>({
    resolver: zodResolver(verificationCodeValidator),
  });

  const email = "alvinokafor@gmail.com";

  const onClickResendOTP = async (data: EmailSchema) => {
    try {
      console.log(data);
      toast.success("Please check your mail for a new OTP");
    } catch (error: any) {
      // toast.error(error.response.data.message);
      toast.error(error);
    }
  };

  const onSubmit = async (data: VerificationCodeSchema) => {
    // console.log({ ...data, session_id });
    try {
      console.log(data);
      toast.success("Email Verification Successful");
      //   router.push("/");
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <section className="w-full mx-auto pt-8 text-center  lg:max-w-3xl">
      <div className="flex flex-col items-center">
        <VerifyIcon />
        <h1 className="pb-2 leading-10 text-3xl font-bold pt-6">
          Verify your email
        </h1>
        <p className="pb-4 text-base font-medium text-[#707070]">
          Input the 6 digit verification code sent to your email{" "}
          {decodeURIComponent(email!)}
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-8 justify-center items-center mt-6"
      >
        <Controller
          name="code"
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
        {errors.code && (
          <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
        )}

        <Button
          type="submit"
          className="w-full text-center text-base bg-primary border text-white py-6 rounded-lg transition-all duration-600 hover:text-neutral-50 hover:shadow-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingIcon /> : "Continue"}
        </Button>
      </form>

      <div className="mt-8 flex justify-center">
        <Button
          className="text-gunmetal text-sm flex gap-x-2 justify-center bg-transparent py-2.5 rounded-lg transition-all duration-300 hover:underline hover:bg-transparent hover:scale-105"
          onClick={() => onClickResendOTP({ email: email ?? "" })}
          disabled={isSubmitting}
        >
          {/* Resend code in
            <span className="text-sm text-primary-shade">02:00</span> */}
          {isSubmitting ? "Please Wait..." : "Resend OTP code"}
        </Button>
      </div>
    </section>
  );
}
