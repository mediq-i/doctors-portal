import {
  ServiceProviderAdapter,
  useUserQuery,
} from "@/adapters/ServiceProviders";
import { PatientCard } from "@/components/patients/patient-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import ProtectedRoute from "@/utils/helpers/protected-route";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/patients")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isLoading, data } = useUserQuery({
    queryKey: ["patients"],
    queryCallback: ServiceProviderAdapter.getPatients,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Patients</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Patients</h1>
          {data?.data.patients.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No patients found. Patients will appear here after you have
              appointments.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data?.data.patients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
