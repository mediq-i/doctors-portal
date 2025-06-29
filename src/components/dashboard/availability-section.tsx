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
  DayAvailability,
  MonthlyAvailability,
} from "@/adapters/types/ServiceProviderTypes";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

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

interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayName: (typeof DAYS)[number];
  isSelected: boolean;
  timeSlots: string[];
}

export default function AvailabilitySection() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [monthlyAvailability, setMonthlyAvailability] = useState<{
    [day: number]: { isAvailable: boolean; timeSlots: string[] };
  }>({});
  const queryClient = useQueryClient();
  // Get user ID from local storage
  const userId = localStorage.getItem("user_id");

  // Fetch monthly availability
  const { data: monthlyAvailabilityData, isLoading } =
    useUserQuery<MonthlyAvailability>({
      queryKey: ["monthly-availability", userId!],
      queryCallback: () => ServiceProviderAdapter.getMonthlyAvailability(),
      enabled: !!userId,
    });

  // Update mutation
  const { mutateAsync, isPending } = useUserMutation({
    mutationCallback: ServiceProviderAdapter.updateMonthlyAvailability,
  });

  // Initialize availability state with monthly availability data
  useEffect(() => {
    if (monthlyAvailabilityData?.data) {
      const now = new Date();
      const currentMonth = now.getMonth() + 1; // 1-12
      const currentYear = now.getFullYear();

      console.log("Monthly availability data:", monthlyAvailabilityData);
      console.log("Current month/year:", currentMonth, currentYear);

      // Check if we have data for the current month
      if (
        monthlyAvailabilityData.data.year === currentYear &&
        monthlyAvailabilityData.data.month === currentMonth
      ) {
        // Use existing monthly availability data
        const availability: {
          [day: number]: { isAvailable: boolean; timeSlots: string[] };
        } = {};

        Object.entries(monthlyAvailabilityData.data.days).forEach(
          ([dayStr, dayData]) => {
            const day = parseInt(dayStr);
            const typedDayData = dayData as DayAvailability;
            if (typedDayData.isAvailable) {
              const timeSlots = typedDayData.slots
                .map((slot: { start: string; end: string }) => {
                  const matchingSlot = TIME_SLOTS.find(
                    (t) => t.start === slot.start && t.end === slot.end
                  );
                  return matchingSlot?.display || "";
                })
                .filter(Boolean);

              availability[day] = {
                isAvailable: true,
                timeSlots,
              };
              console.log(
                `Day ${day} is available with ${timeSlots.length} time slots`
              );
            } else {
              availability[day] = {
                isAvailable: false,
                timeSlots: [],
              };
            }
          }
        );

        setMonthlyAvailability(availability);
      } else {
        console.log(
          "No matching month data found, initializing empty availability"
        );
        // Initialize empty availability for current month
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
        const emptyAvailability: {
          [day: number]: { isAvailable: boolean; timeSlots: string[] };
        } = {};

        for (let day = 1; day <= daysInMonth; day++) {
          emptyAvailability[day] = {
            isAvailable: false,
            timeSlots: [],
          };
        }

        setMonthlyAvailability(emptyAvailability);
      }
    }
  }, [monthlyAvailabilityData]);

  // Generate calendar days for current month only
  const generateCalendarDays = (): CalendarDay[] => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay() + 1); // Start from Monday

    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (7 - lastDayOfMonth.getDay())); // End on Sunday

    const days: CalendarDay[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayName =
        DAYS[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1];
      const dayOfMonth = currentDate.getDate();
      const dayData = monthlyAvailability[dayOfMonth];

      const isSelected = dayData?.isAvailable || false;

      if (isSelected) {
        console.log(
          `Calendar day ${dayOfMonth} is selected with ${dayData?.timeSlots?.length || 0} time slots`
        );
      }

      days.push({
        date: new Date(currentDate),
        dayOfMonth: currentDate.getDate(),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: currentDate.toDateString() === now.toDateString(),
        dayName,
        isSelected,
        timeSlots: dayData?.timeSlots || [],
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleDayToggle = (dayOfMonth: number, checked: boolean) => {
    setMonthlyAvailability((prev) => ({
      ...prev,
      [dayOfMonth]: {
        ...prev[dayOfMonth],
        isAvailable: checked,
        timeSlots: checked ? prev[dayOfMonth]?.timeSlots || [] : [],
      },
    }));
  };

  const handleTimeSlotToggle = (
    dayOfMonth: number,
    timeSlot: string,
    checked: boolean
  ) => {
    setMonthlyAvailability((prev) => ({
      ...prev,
      [dayOfMonth]: {
        ...prev[dayOfMonth],
        timeSlots: checked
          ? [...(prev[dayOfMonth]?.timeSlots || []), timeSlot]
          : (prev[dayOfMonth]?.timeSlots || []).filter(
              (slot) => slot !== timeSlot
            ),
      },
    }));
  };

  const handleSaveAvailability = async () => {
    try {
      const now = new Date();
      const currentMonth = now.getMonth() + 1; // 1-12
      const currentYear = now.getFullYear();

      // Convert monthly availability to API payload format
      const payload = {
        body: {
          monthly_availability: {
            year: currentYear,
            month: currentMonth,
            days: {} as { [day: number]: DayAvailability },
          },
        },
      };

      Object.entries(monthlyAvailability).forEach(([dayStr, dayData]) => {
        const day = parseInt(dayStr);
        if (dayData.isAvailable) {
          const dayAvailability: DayAvailability = {
            isAvailable: true,
            slots: dayData.timeSlots.map((slot) => {
              const timeSlotData = TIME_SLOTS.find((t) => t.display === slot);
              return {
                start: timeSlotData!.start,
                end: timeSlotData!.end,
              };
            }),
          };
          payload.body.monthly_availability.days[day] = dayAvailability;
        } else {
          payload.body.monthly_availability.days[day] = {
            isAvailable: false,
            slots: [],
          };
        }
      });

      await mutateAsync({
        body: {
          monthly_availability: {
            year: currentYear,
            month: currentMonth,
            days: payload.body.monthly_availability.days,
          },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      queryClient.invalidateQueries({
        queryKey: ["monthly-availability", userId!],
      });
      toast.success("Monthly availability updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update monthly availability");
    }
  };

  const selectedDayData = selectedDate
    ? monthlyAvailability[selectedDate.getDate()]
    : null;

  const formatCurrentMonth = () => {
    return new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold">Availability Settings</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Loading your schedule...
            </p>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-6 animate-pulse">
          <div className="grid grid-cols-7 gap-2">
            {[...Array(42)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold">Monthly Availability</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Set your availability for {formatCurrentMonth()}
          </p>
        </div>
        <Button
          onClick={handleSaveAvailability}
          disabled={isPending}
          className="w-full sm:w-auto px-6 mt-2 sm:mt-0"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="flex-1 bg-white rounded-xl border p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-center mb-6">
            <h3 className="text-lg font-semibold">{formatCurrentMonth()}</h3>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground py-2"
              >
                {day.slice(0, 3).toUpperCase()}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={cn(
                  "relative h-12 rounded-lg border cursor-pointer transition-all flex items-center justify-center text-sm",
                  !day.isCurrentMonth && "text-muted-foreground/30",
                  day.isToday &&
                    "border-blue-500 bg-blue-50 font-semibold shadow-sm",
                  day.isSelected &&
                    !day.isToday &&
                    "bg-green-100 border-green-500 shadow-md",
                  day.isSelected &&
                    day.isToday &&
                    "bg-green-200 border-green-600 shadow-md",
                  day.isCurrentMonth &&
                    !day.isToday &&
                    !day.isSelected &&
                    "hover:bg-slate-50"
                )}
                onClick={() => handleDateClick(day.date)}
              >
                <span
                  className={cn(
                    day.isToday && "text-blue-700",
                    day.isSelected &&
                      !day.isToday &&
                      "text-green-700 font-semibold",
                    day.isSelected &&
                      day.isToday &&
                      "text-green-800 font-semibold"
                  )}
                >
                  {day.dayOfMonth}
                </span>
                {day.isSelected && day.timeSlots.length > 0 && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
                {day.isSelected && day.timeSlots.length === 0 && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-300 rounded-full border-2 border-white" />
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 border border-green-500 rounded" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-50 border border-blue-500 rounded" />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>With Time Slots</span>
            </div>
          </div>
        </div>

        {/* Time Slots Panel */}
        <div className="w-full lg:w-80 bg-slate-50 rounded-xl p-6">
          {selectedDate ? (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-medium">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <Checkbox
                    id={`day-${selectedDate.getDate()}`}
                    checked={selectedDayData?.isAvailable || false}
                    onCheckedChange={(checked) => {
                      handleDayToggle(
                        selectedDate.getDate(),
                        checked as boolean
                      );
                    }}
                  />
                  <Label
                    htmlFor={`day-${selectedDate.getDate()}`}
                    className="font-medium cursor-pointer"
                  >
                    Available on this day
                  </Label>
                </div>
              </div>

              {selectedDayData?.isAvailable ? (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Time Slots</Label>
                  {TIME_SLOTS.map((timeSlot) => {
                    const isSelected = selectedDayData.timeSlots.includes(
                      timeSlot.display
                    );
                    return (
                      <div
                        key={timeSlot.display}
                        className={cn(
                          "p-3 rounded-lg border bg-white cursor-pointer transition-all",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() =>
                          handleTimeSlotToggle(
                            selectedDate.getDate(),
                            timeSlot.display,
                            !isSelected
                          )
                        }
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{timeSlot.display}</span>
                          {isSelected && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <Calendar className="h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Select a day and mark it as available to set time slots
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <Calendar className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                Click on a day to set availability
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
