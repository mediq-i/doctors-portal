"use client";

import type React from "react";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { usePersonalProfessionalInfoStore } from "@/store/personal-professional-info-store";

interface PersonalInfoFormProps {
  onSubmit: (data: PersonalInfoFormValues) => void;
  defaultValues?: Partial<PersonalInfoFormValues>;
}

export default function PersonalInfoForm({
  onSubmit,
  defaultValues = {},
}: PersonalInfoFormProps) {
  // Use a ref to track if we're updating programmatically to prevent loops
  const [isInternalUpdate, setIsInternalUpdate] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const updateFormData = usePersonalProfessionalInfoStore(
    (state) => state.updateFormData
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
    mode: "onBlur", // Only validate on blur, not on every keystroke
  });

  const dateOfBirth = watch("dateOfBirth");

  // Memoize the date parser function
  const parseDateString = useCallback((dateString: string): Date | null => {
    if (!dateString || dateString.length !== 10) return null;

    try {
      const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
      return isValid(parsedDate) ? parsedDate : null;
    } catch {
      return null;
    }
  }, []);

  // Update the input field when the calendar date changes
  const handleCalendarSelect = useCallback(
    (selectedDate: Date | undefined) => {
      if (!selectedDate) return;

      setDate(selectedDate);
      setIsInternalUpdate(true);
      setValue("dateOfBirth", format(selectedDate, "dd/MM/yyyy"));
      setIsCalendarOpen(false); // Close the calendar after selection

      // Reset the flag after the update
      setTimeout(() => setIsInternalUpdate(false), 0);
    },
    [setValue]
  );

  // Update the calendar when the input field changes, but only if it's not from an internal update
  useEffect(() => {
    if (isInternalUpdate || !dateOfBirth) return;

    const parsedDate = parseDateString(dateOfBirth);
    if (parsedDate) {
      setDate(parsedDate);
    }
  }, [dateOfBirth, parseDateString, isInternalUpdate]);

  const onSubmitUserInfo = async (data: PersonalInfoFormValues) => {
    try {
      // Create a copy of the data for formatting
      const formattedData = { ...data };

      // Format date of birth
      if (data.dateOfBirth) {
        const parsedDate = parseDateString(data.dateOfBirth);
        if (parsedDate) {
          formattedData.dateOfBirth = parsedDate.toISOString();
        }
      }

      // Update other fields if languages is empty
      updateFormData({
        legalFirstName: data.legalFirstName,
        legalLastName: data.legalLastName,
        dateOfBirth: formattedData.dateOfBirth,
        languages: data.languages,
      });

      console.log("Form data:", data);
      console.log("Formatted data for backend:", formattedData);

      // Call the onSubmit prop with the original form data
      onSubmit(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Optimized formatter that doesn't use setTimeout
  const formatDateInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const originalValue = input.value;
      const selectionStart = input.selectionStart || 0;

      // Count slashes before cursor
      const slashesBeforeCursor = (
        originalValue.substring(0, selectionStart).match(/\//g) || []
      ).length;

      // Remove non-digits and format
      let digitsOnly = originalValue.replace(/[^\d]/g, "");
      if (digitsOnly.length > 8) digitsOnly = digitsOnly.substring(0, 8);

      let formattedValue = "";
      if (digitsOnly.length > 0) {
        formattedValue += digitsOnly.substring(0, 2);
        if (digitsOnly.length >= 2) formattedValue += "/";
      }
      if (digitsOnly.length > 2) {
        formattedValue += digitsOnly.substring(2, 4);
        if (digitsOnly.length >= 4) formattedValue += "/";
      }
      if (digitsOnly.length > 4) {
        formattedValue += digitsOnly.substring(4, 8);
      }

      // Only update if the value actually changed
      if (formattedValue !== originalValue) {
        // Calculate new cursor position
        const newSlashesBeforeCursor = (
          formattedValue.substring(0, selectionStart).match(/\//g) || []
        ).length;
        const slashDifference = newSlashesBeforeCursor - slashesBeforeCursor;

        // Update value and cursor in one go
        input.value = formattedValue;

        // Set cursor position synchronously
        const newPosition = selectionStart + slashDifference;
        input.setSelectionRange(newPosition, newPosition);
      }

      return formattedValue;
    },
    []
  );

  // Register the date input with a custom onChange handler
  const dateInputProps = register("dateOfBirth");
  const handleDateInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      formatDateInput(e);
      dateInputProps.onChange(e);
    },
    [formatDateInput, dateInputProps]
  );

  // Memoize calendar props to prevent unnecessary re-renders
  const calendarProps = useMemo(
    () => ({
      mode: "single" as const,
      selected: date,
      onSelect: handleCalendarSelect,
      initialFocus: true,
      disabled: (date: Date) => date > new Date(),
      fromYear: 1900,
      toYear: new Date().getFullYear(),
      captionLayout: "dropdown-buttons" as const,
    }),
    [date, handleCalendarSelect]
  );

  return (
    <div className="w-full md:max-w-md mx-auto lg:max-w-3xl pt-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Enter your Personal Information</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmitUserInfo)} className="space-y-6">
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
            className={`${errors.legalFirstName ? "border-destructive" : ""} py-5`}
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
            className={`${errors.legalLastName ? "border-destructive" : ""} py-5`}
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
              {...dateInputProps}
              onChange={handleDateInputChange}
              className={`${errors.dateOfBirth ? "border-destructive" : ""} py-5 pr-10`}
            />
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
                  onClick={() => setIsCalendarOpen(true)}
                >
                  <CalendarIcon className="h-5 w-5" />
                  <span className="sr-only">Open calendar</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                {isCalendarOpen && <Calendar {...calendarProps} />}
              </PopoverContent>
            </Popover>
          </div>
          {errors.dateOfBirth && (
            <p className="text-sm text-destructive">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="languages" className="text-sm text-muted-foreground">
            Languages
          </Label>
          <Input
            id="languages"
            placeholder="Please enter all the languages you speak separated by commas"
            {...register("languages")}
            className={`${errors.languages ? "border-destructive" : ""} py-5`}
          />
          {errors.languages && (
            <p className="text-sm text-destructive">
              {errors.languages.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Example: English, French, Spanish
          </p>
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
