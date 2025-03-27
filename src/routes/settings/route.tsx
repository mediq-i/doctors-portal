import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/layouts";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile information and credentials
          </p>
        </div>

        {/* <div className="space-y-6">
          <SettingsSection
            title="Personal Information"
            description="Update your personal details and contact information"
            defaultOpen={true}
            onSave={() => handleSaveSection("Personal Information")}
          >
            <PersonalInfoForm initialData={mockPersonalInfo} />
          </SettingsSection>

          <SettingsSection
            title="ID Verification"
            description="Update your identification documents"
            onSave={() => handleSaveSection("ID Verification")}
          >
            <IDVerificationForm initialData={mockIdVerification} />
          </SettingsSection>

          <SettingsSection
            title="Professional Information"
            description="Update your medical credentials and specialties"
            onSave={() => handleSaveSection("Professional Information")}
          >
            <ProfessionalInfoForm initialData={mockProfessionalInfo} />
          </SettingsSection>

          <SettingsSection title="Medical License" description="Update your medical license documentation">
            <DocumentUploadForm
              documentType="medicalLicense"
              documentName="Medical License"
              initialData={mockMedicalLicense}
            />
          </SettingsSection>

          <SettingsSection title="University Degree" description="Update your university degree documentation">
            <DocumentUploadForm
              documentType="universityDegree"
              documentName="University Degree"
              initialData={mockUniversityDegree}
            />
          </SettingsSection>
        </div> */}
      </div>
    </DashboardLayout>
  );
}
