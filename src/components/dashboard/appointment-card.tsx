"use client";

import { format } from "date-fns";
import { Calendar, Clock, Loader2, User, Video } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BookingAdapter, useBookingMutation } from "@/adapters/BookingAdapter";
import { toast } from "sonner";

export interface Appointment {
  id: string;
  patientName: string;
  date: Date;
  time: string;
  symptoms: string[];
  symptomsDuration: string;
  description: string;
  status: string;
  cancellation_reason: string | null;
  cancellation_date: string | null;
  patient_id: string;
  payment_status: string | null;
  payment_id: string | null;
  agora_token: string | null;
  agora_channel: string | null;
  service_provider_name: string;
  patient_name: string;
  medical_document_url: string | null;
}

interface AppointmentCardProps {
  appointment: Appointment;
  onViewDetails: (appointment: Appointment) => void;
  onJoinSession?: (appointment: Appointment) => void;
}

export default function AppointmentCard({
  appointment,
  onViewDetails,
}: AppointmentCardProps) {
  const router = useRouter();
  // Generate 8-digit numeric UID
  const uid = Math.floor(10000000 + Math.random() * 90000000);
  const isToday =
    format(appointment.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const canJoinSession =
    appointment.agora_token &&
    appointment.agora_channel &&
    isToday &&
    appointment.status === "confirmed";

  const { mutate: generateToken, isPending: isGeneratingToken } =
    useBookingMutation({
      mutationCallback: BookingAdapter.generateToken,
      params: appointment.id,
    });

  const handleJoinSession = async () => {
    // Check if we already have Agora credentials
    if (appointment.agora_token && appointment.agora_channel) {
      // Join directly with existing credentials
      router.navigate({
        to: `/appointment-room?token=${appointment.agora_token}&channel=${appointment.agora_channel}&uid=${uid}`,
      });
    } else {
      // Generate new token if none exists
      generateToken(
        {},
        {
          onSuccess: (response) => {
            const { token, channelName, uid, appId } =
              response.data.agoraTokenData;
            router.navigate({
              to: `/appointment-room?token=${token}&channel=${channelName}&uid=${uid}&appId=${appId}`,
            });
          },
          onError: (error) => {
            toast.error("Failed to generate video call credentials", {
              description:
                "Please try again or contact support if the issue persists.",
            });
            console.error("Token generation error:", error);
          },
        }
      );
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex  flex-col justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span className="font-medium">
                Appointment with {appointment.patient_name}
              </span>
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
      <CardFooter className="border-t bg-muted/50 px-4 py-2 flex flex-wrap gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={() => onViewDetails(appointment)}
        >
          View Details
        </Button>

        <Button
          variant="default"
          size="sm"
          className="flex-1 gap-2"
          onClick={handleJoinSession}
          disabled={!canJoinSession}
        >
          {isGeneratingToken ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Video className="h-4 w-4" />
          )}
          {isGeneratingToken ? "Joining..." : "Join Session"}
        </Button>
      </CardFooter>
    </Card>
  );
}
