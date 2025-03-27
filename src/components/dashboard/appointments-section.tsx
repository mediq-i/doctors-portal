"use client";

import { useState } from "react";
import { Calendar, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const TIME_SLOTS = [
  "8:00 AM - 9:00 AM",
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
];

interface AvailabilityDay {
  day: string;
  available: boolean;
  timeSlots: string[];
}

export function AvailabilitySection() {
  const [availability, setAvailability] = useState<AvailabilityDay[]>(
    DAYS.map((day) => ({
      day,
      available: false,
      timeSlots: [],
    }))
  );
  const [selectedDay, setSelectedDay] = useState<string>(DAYS[0]);

  const handleDayToggle = (day: string, checked: boolean) => {
    setAvailability(
      availability.map((item) =>
        item.day === day ? { ...item, available: checked } : item
      )
    );
  };

  const handleTimeSlotToggle = (
    day: string,
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

  const currentDayData = availability.find(
    (item) => item.day === selectedDay
  ) || {
    day: selectedDay,
    available: false,
    timeSlots: [],
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Availability Settings</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Available Days
            </CardTitle>
            <CardDescription>
              Select the days you are available for appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {DAYS.map((day) => {
                const dayData = availability.find((item) => item.day === day);
                return (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day}`}
                      checked={dayData?.available}
                      onCheckedChange={(checked) =>
                        handleDayToggle(day, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`day-${day}`}
                      className="flex w-full cursor-pointer justify-between"
                    >
                      <span>{day}</span>
                      {dayData?.available && (
                        <span className="text-xs text-muted-foreground">
                          {dayData.timeSlots.length} time slots
                        </span>
                      )}
                    </Label>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time Slots
            </CardTitle>
            <CardDescription>
              Set your available time slots for each day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="space-y-2">
                {currentDayData.available ? (
                  TIME_SLOTS.map((timeSlot) => (
                    <div key={timeSlot} className="flex items-center space-x-2">
                      <Checkbox
                        id={`time-${timeSlot}`}
                        checked={currentDayData.timeSlots.includes(timeSlot)}
                        onCheckedChange={(checked) =>
                          handleTimeSlotToggle(
                            selectedDay,
                            timeSlot,
                            checked as boolean
                          )
                        }
                      />
                      <Label
                        htmlFor={`time-${timeSlot}`}
                        className="cursor-pointer"
                      >
                        {timeSlot}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Please mark this day as available first
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Save Availability</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
