import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/layouts";
import { WalletSection } from "@/components/dashboard";

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

        <WalletSection />

        {/* 

        <AvailabilitySection />

        <AppointmentsSection appointments={mockAppointments} /> */}
      </div>
    </DashboardLayout>
  );
}
