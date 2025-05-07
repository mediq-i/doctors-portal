import { createFileRoute } from "@tanstack/react-router";
import {
  ServiceProviderAdapter,
  useUserQuery,
} from "@/adapters/ServiceProviders";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardLayout } from "@/layouts";
import { Calendar, Clock, Mail, Phone, User } from "lucide-react";
import ProtectedRoute from "@/utils/helpers/protected-route";
import { VitalsTable } from "@/components/patients/vitals-table";
import { PrescriptionsList } from "@/components/patients/prescriptions-list";

export const Route = createFileRoute("/patient/$patientId")({
  component: RouteComponent,
});

export function RouteComponent() {
  const { patientId } = Route.useParams();

  const { data: patient, isLoading: isPatientLoading } = useUserQuery({
    queryKey: ["patient", patientId],
    queryCallback: () =>
      ServiceProviderAdapter.getPatientDetails({
        patientId: patientId as string,
      }),
    slug: patientId as string,
  });

  console.log(patient);

  const { data: vitals, isLoading: isVitalsLoading } = useUserQuery({
    queryKey: ["vitals", patientId],
    queryCallback: () =>
      ServiceProviderAdapter.getPatientVitals({
        patientId: patientId as string,
      }),
    slug: patientId as string,
  });

  if (isPatientLoading || isVitalsLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-1/4 bg-gray-200 rounded" />
              <div className="h-64 bg-gray-200 rounded" />
              <div className="h-8 w-1/4 bg-gray-200 rounded" />
              <div className="h-64 bg-gray-200 rounded" />
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6 space-y-6">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>
                Basic details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {patient?.data?.first_name} {patient?.data?.last_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{patient?.data?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{patient?.data?.phone_number || "Not provided"}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Date of Birth:{" "}
                      {patient?.data?.dob
                        ? new Date(patient?.data?.dob).toLocaleDateString()
                        : "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Blood Type: {patient?.data?.blood_type || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vitals and Prescriptions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Vitals History - 3 columns */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Vitals History</CardTitle>
                  <CardDescription>
                    Record of patient's vital signs over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VitalsTable vitals={vitals?.data || []} />
                </CardContent>
              </Card>
            </div>

            {/* Prescriptions - 1 column */}
            <div className="md:col-span-2">
              <PrescriptionsList patientId={patientId as string} />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
