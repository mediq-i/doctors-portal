import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAccountSchema,
  type CreateAccountSchema,
} from "@/lib/validations";
import { useObfuscationToggle } from "@/hooks";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateAccountForm() {
  const [InputType, Icon, setVisible] = useObfuscationToggle();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountSchema>({
    resolver: zodResolver(createAccountSchema),
  });

  const createAccountHandler = async (data: CreateAccountSchema) => {
    try {
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full mx-auto max-w-3xl pt-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create your account</h1>
      </div>

      <form onSubmit={handleSubmit(createAccountHandler)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="First Name"
            {...register("firstName")}
            className={errors.firstName ? "border-destructive" : "py-5"}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Last Name"
            {...register("lastName")}
            className={errors.lastName ? "border-destructive" : "py-5"}
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            {...register("email")}
            className={errors.email ? "border-destructive" : "py-5"}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={InputType}
              placeholder="xxxxxxxxxx"
              {...register("password")}
              className={errors.password ? "border-destructive" : "py-5"}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-0 h-full px-3 py-2 text-muted-foreground"
              onClick={() => setVisible((prev) => !prev)}
            >
              {Icon}
              <span className="sr-only">
                {InputType === "password" ? "Show password" : "Hide password"}
              </span>
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="text-sm font-medium text-muted-foreground mt-4 text-center">
          Once your account is created we'll send you a verification link.
        </div>

        <Button
          type="submit"
          className="w-full mt-6 rounded-xl py-6 font-semibold text-base"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Start"}
        </Button>
      </form>

      <div className="mt-6 text-center text-dimgrey font-semibold text-base">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}
