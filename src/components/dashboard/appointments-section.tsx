import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Appointment } from "@/components/dashboard/appointment-card";
import AppointmentCard from "@/components/dashboard/appointment-card";
import AppointmentDetailsModal from "@/components/dashboard/appointment-details-modal";
import { BookingAdapter, useUserQuery } from "@/adapters/BookingAdapter";
import { Skeleton } from "@/components/ui/skeleton";
import { Session } from "@/adapters/types/BookingAdapterTypes";

// Helper function to convert Session to Appointment type
const mapSessionToAppointment = (session: Session): Appointment => {
  return {
    id: session.id,
    patientName: session.patient_id,
    date: new Date(session.appointment_date),
    time: new Date(session.appointment_date).toLocaleTimeString(),
    symptoms: session.patient_symptoms,
    symptomsDuration: session.patient_symptom_duration,
    description: session.patient_ailment_description,
    status: session.status,
    cancellation_reason: session.cancellation_reason,
    cancellation_date: session.cancellation_date,
    patient_id: session.patient_id,
    payment_status: session.payment_status,
    payment_id: session.payment_id,
    agora_token: session.agora_token,
    agora_channel: session.agora_channel,
    service_provider_name: session.service_provider_name,
    patient_name: session.patient_name,
    medical_document_url: session.medical_document_url,
  };
};

export default function AppointmentsSection() {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: sessionData, isLoading } = useUserQuery({
    queryKey: ["appointments", "upcoming"],
    queryCallback: () => BookingAdapter.getSessionHistory("confirmed"),
  });

  const appointments = sessionData?.data.map(mapSessionToAppointment) ?? [];

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Upcoming Appointments</h2>
          <Button variant="ghost" size="sm" className="gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Upcoming Appointments</h2>
        <Button variant="ghost" size="sm" className="gap-1">
          View All <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {appointments.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No upcoming appointments</p>
        </div>
      )}

      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
