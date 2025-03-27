import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/layouts";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Dr. Sarah Wilson
          </p>
        </div>

        {/* <WalletSection pendingBalance={450.0} availableBalance={1250.75} />

        <AvailabilitySection />

        <AppointmentsSection appointments={mockAppointments} /> */}
      </div>
    </DashboardLayout>
  );
}
