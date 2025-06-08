import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/layouts";
import {
  // WalletSection,
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
        <div className="space-y-8 max-w-5xl mx-auto w-full">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-base md:text-lg flex items-center gap-2">
              Dr. {providerName}
              {isVerified === true && (
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 12 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5 6.5C11.5 5.6978 11.0063 5.00219 10.2715 4.62634C10.5295 3.84659 10.3837 2.99951 9.81707 2.43293C9.25049 1.86634 8.40341 1.72049 7.62366 1.97854C7.25341 1.24366 6.5522 0.75 5.75 0.75C4.9478 0.75 4.2522 1.24366 3.88195 1.97854C3.09659 1.72049 2.24951 1.86634 1.68293 2.43293C1.11634 2.99951 0.976098 3.84659 1.23415 4.62634C0.499268 5.00219 0 5.6978 0 6.5C0 7.3022 0.499268 7.99781 1.23415 8.37366C0.976098 9.15341 1.11634 10.0005 1.68293 10.5671C2.24951 11.1337 3.09659 11.2739 3.87634 11.0215C4.25219 11.7563 4.9478 12.25 5.75 12.25C6.5522 12.25 7.25341 11.7563 7.62366 11.0215C8.40341 11.2739 9.25049 11.1337 9.81707 10.5671C10.3837 10.0005 10.5295 9.15341 10.2715 8.37366C11.0063 7.99781 11.5 7.3022 11.5 6.5ZM4.93098 8.8561L2.83293 6.75805L3.6239 5.96146L4.89171 7.22927L7.58439 4.29537L8.40902 5.05829L4.93098 8.8561Z"
                    fill="#3697F1"
                  />
                </svg>
              )}
            </p>
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

          {/* <WalletSection /> */}
          <AvailabilitySection />
          <AppointmentsSection />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
