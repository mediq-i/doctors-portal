import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/layouts";
import {
  DocumentUploadForm,
  IDVerificationForm,
  PersonalInfoForm,
  ProfessionalInfoForm,
  SettingsSection,
} from "@/components/settings";
import { toast } from "sonner";
import {
  ServiceProviderAdapter,
  useUserQuery,
} from "@/adapters/ServiceProviders";
import { Skeleton } from "@/components/ui/skeleton";
import ProtectedRoute from "@/utils/helpers/protected-route";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
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

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your profile information and credentials
            </p>
          </div>

          <div className="space-y-6">
            <SettingsSection
              title="Personal Information"
              description="Update your personal details and contact information"
              defaultOpen={true}
              onSave={() => handleSaveSection("Personal Information")}
            >
              {/* @ts-expect-error - TODO: fix this */}
              <PersonalInfoForm initialData={personalInfo} />
            </SettingsSection>

            <SettingsSection
              title="ID Verification"
              description="Update your identification documents"
              onSave={() => handleSaveSection("ID Verification")}
            >
              {/* @ts-expect-error - TODO: fix this */}
              <IDVerificationForm initialData={idVerification} />
            </SettingsSection>

            <SettingsSection
              title="Professional Information"
              description="Update your medical credentials and specialties"
              onSave={() => handleSaveSection("Professional Information")}
            >
              {/* @ts-expect-error - TODO: fix this */}
              <ProfessionalInfoForm initialData={professionalInfo} />
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
