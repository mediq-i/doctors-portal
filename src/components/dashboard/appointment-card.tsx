"use client";

import { format } from "date-fns";
import { Calendar, Clock, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export interface Appointment {
  id: string;
  patientName: string;
  date: Date;
  time: string;
  symptoms: string[];
  symptomsDuration: string;
  description: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  onViewDetails: (appointment: Appointment) => void;
}

export default function AppointmentCard({
  appointment,
  onViewDetails,
}: AppointmentCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span className="font-medium">{appointment.patientName}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{format(appointment.date, "MMM d, yyyy")}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{appointment.time}</span>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Symptoms:
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              {appointment.symptoms.map((symptom) => (
                <span
                  key={symptom}
                  className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => onViewDetails(appointment)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
