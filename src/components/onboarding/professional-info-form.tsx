import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  personalInfoSchema,
  type PersonalInfoFormValues,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, parse, isValid } from "date-fns";

export default function PersonalInfoForm() {
  const [date, setDate] = useState<Date | undefined>(undefined);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
  });

  const dateOfBirth = watch("dateOfBirth");

  // Update the input field when the calendar date changes
  useEffect(() => {
    if (date) {
      setValue("dateOfBirth", format(date, "dd/MM/yyyy"), {
        shouldValidate: true,
      });
    }
  }, [date, setDate]);

  // Update the calendar when the input field changes
  useEffect(() => {
    if (dateOfBirth && dateOfBirth.length === 10) {
      const parsedDate = parse(dateOfBirth, "dd/MM/yyyy", new Date());
      if (isValid(parsedDate)) {
        setDate(parsedDate);
      }
    }
  }, [dateOfBirth]);

  const onSubmit = async (data: PersonalInfoFormValues) => {
    try {
      // Convert the string date to a Date object or ISO string before sending to backend
      const formattedData = { ...data };

      if (data.dateOfBirth) {
        const [day, month, year] = data.dateOfBirth.split("/").map(Number);
        const dateObj = new Date(year, month - 1, day);

        // You can use either ISO string or timestamp depending on your backend requirements
        formattedData.dateOfBirth = dateObj.toISOString();
        // Or if you prefer timestamp: formattedData.dateOfBirthTimestamp = dateObj.getTime()
      }

      console.log("Form data:", data);
      console.log("Formatted data for backend:", formattedData);
      //navigate to the next step
      //navigate to the next step
    } catch (error) {
      console.error(error);
    }
  };

  // Helper function to format date input as user types
  const formatDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    let value = input.value.replace(/[^\d]/g, ""); // Remove all non-digit characters
    let formattedValue = "";
    let cursorPosition = input.selectionStart || 0;

    // Apply formatting logic
    if (value.length > 0) {
      formattedValue += value.substring(0, 2); // Day
      if (value.length >= 2) formattedValue += "/"; // Auto-insert first slash
    }
    if (value.length > 2) {
      formattedValue += value.substring(2, 4); // Month
      if (value.length >= 4) formattedValue += "/"; // Auto-insert second slash
    }
    if (value.length > 4) {
      formattedValue += value.substring(4, 8); // Year
    }

    // Limit to 10 characters (DD/MM/YYYY)
    formattedValue = formattedValue.substring(0, 10);

    // Preserve cursor position intelligently
    if (cursorPosition === 2 || cursorPosition === 5) {
      cursorPosition += 1;
    }

    // Update input field
    input.value = formattedValue;

    setTimeout(() => {
      input.selectionStart = input.selectionEnd = cursorPosition;
    }, 0);
  };

  return (
    <div className="w-full md:max-w-md mx-auto lg:max-w-3xl pt-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Enter your Personal Information</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="legalFirstName"
            className="text-sm text-muted-foreground"
          >
            Legal First Name
          </Label>
          <Input
            id="legalFirstName"
            placeholder="Legal first name"
            {...register("legalFirstName")}
            className={errors.legalFirstName ? "border-destructive" : "py-5"}
          />
          {errors.legalFirstName && (
            <p className="text-sm text-destructive">
              {errors.legalFirstName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="legalLastName"
            className="text-sm text-muted-foreground"
          >
            Legal Last Name
          </Label>
          <Input
            id="legalLastName"
            placeholder="Legal last name"
            {...register("legalLastName")}
            className={errors.legalLastName ? "border-destructive" : "py-5"}
          />
          {errors.legalLastName && (
            <p className="text-sm text-destructive">
              {errors.legalLastName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="dateOfBirth"
            className="text-sm text-muted-foreground"
          >
            Date of Birth
          </Label>
          <div className="relative">
            <Input
              id="dateOfBirth"
              placeholder="DD/MM/YYYY"
              {...register("dateOfBirth")}
              onChange={(e) => {
                formatDateInput(e);
                register("dateOfBirth").onChange(e);
              }}
              className={`${errors.dateOfBirth ? "border-destructive" : "py-5"} pr-10`}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                >
                  <CalendarIcon className="h-5 w-5" />
                  <span className="sr-only">Open calendar</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => {
                    // Disable future dates
                    return date > new Date();
                  }}
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                  captionLayout="dropdown-buttons"
                />
              </PopoverContent>
            </Popover>
          </div>
          {errors.dateOfBirth && (
            <p className="text-sm text-destructive">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-6 rounded-xl py-6 font-semibold text-base"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Continue"}
        </Button>
      </form>
    </div>
  );
}
