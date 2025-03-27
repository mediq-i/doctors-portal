import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/layouts";
import {
  WalletSection,
  AvailabilitySection,
  AppointmentsSection,
} from "@/components/dashboard";
import type { Appointment } from "@/components/dashboard/appointment-card";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

// Mock data - replace with actual data fetching in production
const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "John Doe",
    date: new Date("2024-04-05"),
    time: "10:00 AM - 11:00 AM",
    symptoms: ["Headache", "Fever"],
    symptomsDuration: "3 days",
    description:
      "Patient has been experiencing severe headaches and fever for the past 3 days.",
  },
  {
    id: "2",
    patientName: "Jane Smith",
    date: new Date("2024-04-06"),
    time: "2:00 PM - 3:00 PM",
    symptoms: ["Back pain", "Difficulty sleeping"],
    symptomsDuration: "2 weeks",
    description:
      "Patient reports lower back pain that worsens at night, causing difficulty sleeping.",
  },
  {
    id: "3",
    patientName: "Michael Johnson",
    date: new Date("2024-04-07"),
    time: "9:00 AM - 10:00 AM",
    symptoms: ["Cough", "Shortness of breath"],
    symptomsDuration: "5 days",
    description:
      "Patient has developed a persistent cough and occasional shortness of breath.",
  },
];

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

        <AvailabilitySection />

        <AppointmentsSection appointments={mockAppointments} />
      </div>
    </DashboardLayout>
  );
}
