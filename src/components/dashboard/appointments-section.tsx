import { useState } from "react";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { type Appointment } from "@/components/dashboard/appointment-card";
import AppointmentCard from "@/components/dashboard/appointment-card";
import AppointmentDetailsModal from "@/components/dashboard/appointment-details-modal";

interface AppointmentsSectionProps {
  appointments: Appointment[];
}

export default function AppointmentsSection({
  appointments,
}: AppointmentsSectionProps) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
