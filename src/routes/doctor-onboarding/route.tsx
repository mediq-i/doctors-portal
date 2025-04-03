import { DoctorOnboarding } from "@/components/doctor-onboarding";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/doctor-onboarding")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <DoctorOnboarding />
    </div>
  );
}
