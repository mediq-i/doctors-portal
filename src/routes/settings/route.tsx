import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/layouts";
import {
  DocumentUploadForm,
  IDVerificationForm,
  PersonalInfoForm,
  ProfessionalInfoForm,
  SettingsSection,
  BankDetailsForm,
} from "@/components/settings";
import { toast } from "sonner";
import {
  ServiceProviderAdapter,
  useUserQuery,
} from "@/adapters/ServiceProviders";
import { Skeleton } from "@/components/ui/skeleton";
import ProtectedRoute from "@/utils/helpers/protected-route";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: SettingsComponent,
});

function SettingsComponent() {
  const userId = localStorage.getItem("user_id");

  const {
    data: providerData,
    isLoading,
    error,
  } = useUserQuery({
    queryKey: ["serviceProvider", userId!],
    queryCallback: () =>
      ServiceProviderAdapter.getServiceProviderDetails({ id: userId }),
    enabled: !!userId,
  });

  const handleSaveSection = (section: string) => {
    toast(`${section} updated`);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <div>
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-72 mt-2" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="text-center py-8">
            <p className="text-destructive">Failed to load provider details</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const provider = providerData?.data;

  // Map API data to form structures
  const personalInfo = {
    firstName: provider?.first_name || "",
    lastName: provider?.last_name || "",
    email: provider?.email || "",
    bio: provider?.bio || "",
    dob: provider?.dob || "",
    languages: provider?.languages || "",
    gender: provider?.gender || "",
  };

  const idVerification = {
    idType: provider?.identification_type || "",
    idNumber: provider?.identification_no || "",
    idDocument: provider?.identification_file || "",
  };

  const professionalInfo = {
    licenseNumber: provider?.medical_license_no || "",
    issuingBoard: provider?.issuing_medical_board || "",
    specialty: provider?.specialty || "",
    yearsOfExperience: provider?.years_of_experience || "",
    professionalAssociations: provider?.professional_associations || "",
  };

  const medicalLicense = {
    documentUrl: provider?.medical_license_file || "",
    documentName: "Medical License",
    uploadDate: provider?.updated_at,
  };

  const universityDegree = {
    documentUrl: provider?.university_degree_file || "",
    documentName: "University Degree",
    uploadDate: provider?.updated_at,
  };

  const bankDetails = {
    accountName: provider?.bank_account_name || "",
    accountNumber: provider?.account_number || "",
    bankCode: provider?.bank_code,
    providerId: provider?.id,
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your profile information and credentials
            </p>

            {providerData?.data.verified && (
              <Alert className="bg-green-50 border-green-200 mt-4">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-800 font-medium">
                  Account Verified
                </AlertTitle>
              </Alert>
            )}

            {providerData?.data.verified === null && (
              <Alert className="bg-yellow-50 border-yellow-200 mt-4">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <AlertTitle className="text-yellow-800 font-medium">
                  Account Under Review
                </AlertTitle>
              </Alert>
            )}
          </div>

          <div className="space-y-6 ">
            <SettingsSection
              title="Personal Information"
              description="Update your personal details and contact information"
              defaultOpen={true}
              onSave={() => handleSaveSection("Personal Information")}
            >
              <PersonalInfoForm initialData={personalInfo} />
            </SettingsSection>

            <SettingsSection
              title="ID Verification"
              description="Update your identification documents"
              onSave={() => handleSaveSection("ID Verification")}
            >
              <IDVerificationForm initialData={idVerification} />
            </SettingsSection>

            <SettingsSection
              title="Professional Information"
              description="Update your medical credentials and specialties"
              onSave={() => handleSaveSection("Professional Information")}
            >
              <ProfessionalInfoForm initialData={professionalInfo} />
            </SettingsSection>

            <SettingsSection
              title="Bank Details"
              description="Update your bank account information for payments"
              onSave={() => handleSaveSection("Bank Details")}
            >
              <BankDetailsForm initialData={bankDetails} />
            </SettingsSection>

            <SettingsSection
              title="Medical License"
              description="Update your medical license documentation"
            >
              <DocumentUploadForm
                documentType="medicalLicense"
                documentName="Medical License"
                initialData={medicalLicense}
              />
            </SettingsSection>

            <SettingsSection
              title="University Degree"
              description="Update your university degree documentation"
            >
              <DocumentUploadForm
                documentType="universityDegree"
                documentName="University Degree"
                initialData={universityDegree}
              />
            </SettingsSection>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
