import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/layouts";
import { AppointmentsSection } from "@/components/dashboard";
import type { Appointment } from "@/components/dashboard/appointment-card";

export const Route = createFileRoute("/appointments")({
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
  {
    id: "4",
    patientName: "Emily Wilson",
    date: new Date("2024-04-08"),
    time: "1:00 PM - 2:00 PM",
    symptoms: ["Skin rash", "Itching"],
    symptomsDuration: "1 week",
    description:
      "Patient has developed a skin rash on arms and legs with severe itching.",
  },
  {
    id: "5",
    patientName: "Robert Brown",
    date: new Date("2024-04-09"),
    time: "11:00 AM - 12:00 PM",
    symptoms: ["Joint pain", "Swelling"],
    symptomsDuration: "3 weeks",
    description:
      "Patient experiencing joint pain in knees and ankles with visible swelling.",
  },
  {
    id: "6",
    patientName: "Sarah Davis",
    date: new Date("2024-04-10"),
    time: "3:00 PM - 4:00 PM",
    symptoms: ["Dizziness", "Nausea"],
    symptomsDuration: "2 days",
    description:
      "Patient reports episodes of dizziness accompanied by nausea, especially when standing up quickly.",
  },
];

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

        <AppointmentsSection appointments={mockAppointments} />
      </div>
    </DashboardLayout>
  );
}
