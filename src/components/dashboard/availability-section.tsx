"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  ServiceProviderAdapter,
  useUserMutation,
  useUserQuery,
} from "@/adapters/ServiceProviders";
import { toast } from "sonner";
import type {
  UpdateWorkingHoursPayload,
  DaySchedule,
  ServiceProviderDetails,
} from "@/adapters/types/ServiceProviderTypes";
import { cn } from "@/lib/utils";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const TIME_SLOTS = [
  { display: "8:00 AM - 9:00 AM", start: "08:00", end: "09:00" },
  { display: "9:00 AM - 10:00 AM", start: "09:00", end: "10:00" },
  { display: "10:00 AM - 11:00 AM", start: "10:00", end: "11:00" },
  { display: "11:00 AM - 12:00 PM", start: "11:00", end: "12:00" },
  { display: "1:00 PM - 2:00 PM", start: "13:00", end: "14:00" },
  { display: "2:00 PM - 3:00 PM", start: "14:00", end: "15:00" },
  { display: "3:00 PM - 4:00 PM", start: "15:00", end: "16:00" },
  { display: "4:00 PM - 5:00 PM", start: "16:00", end: "17:00" },
];

interface AvailabilityDay {
  day: (typeof DAYS)[number];
  available: boolean;
  timeSlots: string[];
}

export default function AvailabilitySection() {
  const [availability, setAvailability] = useState<AvailabilityDay[]>(
    DAYS.map((day) => ({
      day,
      available: false,
      timeSlots: [],
    }))
  );
  const [selectedDay, setSelectedDay] = useState<(typeof DAYS)[number]>(
    DAYS[0]
  );

  // Get user ID from local storage
  const userId = localStorage.getItem("user_id");
  // Fetch service provider details
  const { data: providerData, isLoading } =
    useUserQuery<ServiceProviderDetails>({
      queryKey: ["provider-details", userId!],
      queryCallback: () =>
        ServiceProviderAdapter.getServiceProviderDetails({ id: userId }),
      enabled: !!userId,
    });

  // Update mutation
  const { mutateAsync, isPending } = useUserMutation({
    mutationCallback: ServiceProviderAdapter.updateWorkingHours,
  });

  // Initialize availability state with provider data
  useEffect(() => {
    if (providerData?.data?.working_hours) {
      const workingHours = providerData.data.working_hours;

      const initialAvailability = DAYS.map((day) => {
        const daySchedule = workingHours[day];
        if (!daySchedule) {
          return { day, available: false, timeSlots: [] };
        }

        // Convert the API time slots to display format
        const timeSlots = daySchedule.slots
          .map((slot) => {
            const matchingSlot = TIME_SLOTS.find(
              (t) => t.start === slot.start && t.end === slot.end
            );
            return matchingSlot?.display || "";
          })
          .filter(Boolean);

        return {
          day,
          available: daySchedule.isAvailable,
          timeSlots,
        };
      });

      setAvailability(initialAvailability);
    }
  }, [providerData]);

  const handleDayToggle = (day: (typeof DAYS)[number], checked: boolean) => {
    setAvailability(
      availability.map((item) =>
        item.day === day ? { ...item, available: checked } : item
      )
    );
    setSelectedDay(day);
  };

  const handleTimeSlotToggle = (
    day: (typeof DAYS)[number],
    timeSlot: string,
    checked: boolean
  ) => {
    setAvailability(
      availability.map((item) => {
        if (item.day === day) {
          return {
            ...item,
            timeSlots: checked
              ? [...item.timeSlots, timeSlot]
              : item.timeSlots.filter((slot) => slot !== timeSlot),
          };
        }
        return item;
      })
    );
  };

  const handleSaveAvailability = async () => {
    try {
      // Convert availability state to the expected API payload format
      const payload: UpdateWorkingHoursPayload = { working_hours: {} };

      availability.forEach((dayData) => {
        if (dayData.available) {
          const daySchedule: DaySchedule = {
            isAvailable: true,
            slots: dayData.timeSlots.map((slot) => {
              const timeSlotData = TIME_SLOTS.find((t) => t.display === slot);
              return {
                start: timeSlotData!.start,
                end: timeSlotData!.end,
              };
            }),
          };
          payload.working_hours[dayData.day] = daySchedule;
        } else {
          payload.working_hours[dayData.day] = {
            isAvailable: false,
            slots: [],
          };
        }
      });

      await mutateAsync({ working_hours: payload.working_hours });
      toast.success("Working hours updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update working hours");
    }
  };

  const currentDayData = availability.find(
    (item) => item.day === selectedDay
  ) || {
    day: selectedDay,
    available: false,
    timeSlots: [],
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Availability Settings</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Loading your schedule...
            </p>
          </div>
        </div>
        <div className="flex gap-8 animate-pulse">
          <div className="w-1/3 space-y-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-14 bg-slate-100 rounded-lg" />
            ))}
          </div>
          <div className="flex-1 bg-slate-50 rounded-xl p-6">
            <div className="grid grid-cols-2 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Availability Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Set your weekly schedule and available time slots
          </p>
        </div>
        <Button
          onClick={handleSaveAvailability}
          disabled={isPending}
          className="px-6"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Days Column */}
        <div className="w-1/3 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Select Working Days
          </h3>
          {DAYS.map((day) => {
            const dayData = availability.find((item) => item.day === day);
            const isSelected = selectedDay === day;
            return (
              <div
                key={day}
                className={cn(
                  "p-4 rounded-lg border cursor-pointer transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                  dayData?.available && "bg-primary/5 border-primary/50"
                )}
                onClick={() => setSelectedDay(day)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`day-${day}`}
                      checked={dayData?.available}
                      onCheckedChange={(checked) =>
                        handleDayToggle(day, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`day-${day}`}
                      className="capitalize font-medium cursor-pointer"
                    >
                      {day}
                    </Label>
                  </div>
                  {dayData?.available && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {dayData.timeSlots.length} slots
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Slots Column */}
        <div className="flex-1 bg-slate-50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="font-medium capitalize">{selectedDay} Time Slots</h3>
          </div>

          {currentDayData.available ? (
            <div className="grid grid-cols-2 gap-3">
              {TIME_SLOTS.map((timeSlot) => {
                const isSelected = currentDayData.timeSlots.includes(
                  timeSlot.display
                );
                return (
                  <div
                    key={timeSlot.display}
                    className={cn(
                      "p-4 rounded-lg border bg-white cursor-pointer transition-all",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() =>
                      handleTimeSlotToggle(
                        selectedDay,
                        timeSlot.display,
                        !isSelected
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{timeSlot.display}</span>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                Please mark this day as available to set time slots
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
