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
import { Mail, Phone, User, Activity } from "lucide-react";
import ProtectedRoute from "@/utils/helpers/protected-route";
import { VitalsTable } from "@/components/patients/vitals-table";
import { PrescriptionsList } from "@/components/patients/prescriptions-list";
import { SessionNotesList } from "@/components/patients/session-notes-list";

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
            <div className="animate-pulse space-y-6">
              {/* Header skeleton */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gray-200 rounded-full" />
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-gray-200 rounded" />
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
              </div>

              {/* Cards skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-32 bg-gray-200 rounded-lg" />
                <div className="h-32 bg-gray-200 rounded-lg" />
                <div className="h-32 bg-gray-200 rounded-lg" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-96 bg-gray-200 rounded-lg" />
                <div className="h-96 bg-gray-200 rounded-lg" />
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6 space-y-8">
          {/* Patient Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {patient?.data?.first_name} {patient?.data?.last_name}
                </h1>
              </div>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Email
                    </p>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {patient?.data?.email || "Not provided"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      Phone
                    </p>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {patient?.data?.phone_number || "Not provided"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      Blood Type
                    </p>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {patient?.data?.blood_type || "Not provided"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vitals Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Vitals History</CardTitle>
                  <CardDescription>
                    Record of patient's vital signs over time
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <VitalsTable vitals={vitals?.data || []} />
            </CardContent>
          </Card>

          {/* Prescriptions Section */}
          <PrescriptionsList patientId={patientId as string} />

          {/* Session Notes Section */}
          <SessionNotesList patientId={patientId as string} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
