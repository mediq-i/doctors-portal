import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/layouts";
import { AppointmentsSection } from "@/components/dashboard";

export const Route = createFileRoute("/appointments")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">
            Manage all your upcoming appointments
          </p>
        </div>

        <AppointmentsSection />
      </div>
    </DashboardLayout>
  );
}
