import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/layouts";
import {
  WalletSection,
  AvailabilitySection,
  AppointmentsSection,
} from "@/components/dashboard";
import {
  ServiceProviderAdapter,
  useUserQuery,
} from "@/adapters/ServiceProviders";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ProtectedRoute from "@/utils/helpers/protected-route";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const userId = localStorage.getItem("user_id");

  const { data: providerData } = useUserQuery({
    queryKey: ["serviceProvider", userId!],
    queryCallback: () =>
      ServiceProviderAdapter.getServiceProviderDetails({ id: userId! }),
    enabled: !!userId,
  });

  const providerName = providerData
    ? `${providerData.data.first_name} ${providerData.data.last_name}`
    : "--";

  const isVerified = providerData?.data.verified;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Hello, Dr. {providerName}</p>
          </div>

          {(isVerified === null || isVerified === false) && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <AlertTitle className="text-yellow-800 font-medium">
                Account Under Review
              </AlertTitle>
              <AlertDescription className="text-yellow-700">
                Your account is currently under review. We are verifying your
                credentials and documentation. You will be notified once the
                verification process is complete. This usually takes 1-7
                business days.
              </AlertDescription>
            </Alert>
          )}

          <WalletSection />

          <AvailabilitySection />

          <AppointmentsSection />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
