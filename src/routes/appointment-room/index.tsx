import { DashboardLayout } from "@/layouts";
import ProtectedRoute from "@/utils/helpers/protected-route";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import AppointmentRoom from "@/components/sessions/appointment-room";
const appointmentSearchSchema = z.object({
  token: z.string().catch(""),
  channel: z.string().catch(""),
  uid: z.string().catch(""),
  patientId: z.string().catch(""),
  appointmentId: z.string().catch(""),
});

// type AppointmentSearch = z.infer<typeof appointmentSearchSchema>;

export const Route = createFileRoute("/appointment-room/")({
  component: RouteComponent,
  validateSearch: appointmentSearchSchema,
});

function RouteComponent() {
  const { token, channel, uid, patientId, appointmentId } = Route.useSearch();

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <AppointmentRoom
          token={token}
          channel={channel}
          uid={uid}
          patientId={patientId}
          appointmentId={appointmentId}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
