"use client";

import { format } from "date-fns";
import { Calendar, Clock, FileText, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Appointment } from "@/components/dashboard/appointment-card";

interface AppointmentDetailsModalProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
}

export default function AppointmentDetailsModal({
  appointment,
  isOpen,
  onClose,
}: AppointmentDetailsModalProps) {
  const handleCancelAppointment = () => {
    // Here you would implement the actual cancellation logic
    // For now, we'll just close the modal
    alert(`Appointment with ${appointment.patient_name} has been cancelled`);
    onClose();
  };

  const handleViewMedicalReport = () => {
    if (appointment.medical_document_url) {
      window.open(appointment.medical_document_url, "_blank");
    }
  };   

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>
            Appointment with {appointment.patient_name} on{" "}
            {format(appointment.date, "MMMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span className="font-medium">{appointment.patient_name}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Date</p>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(appointment.date, "MMMM d, yyyy")}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Time</p>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.time}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-medium">Symptoms</p>
            <div className="flex flex-wrap gap-1">
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

          <div className="space-y-2">
            <p className="text-sm font-medium">Duration</p>
            <p className="text-sm">{appointment.symptomsDuration}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Description</p>
            <p className="text-sm">{appointment.description}</p>
          </div>

          {appointment.medical_document_url && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Medical Report</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleViewMedicalReport}
                  >
                    <FileText className="h-4 w-4" />
                    View Report
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Patient has attached a medical report for this appointment
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="destructive" onClick={handleCancelAppointment}>
            Cancel Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
