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

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

// Mock data - replace with actual data fetching in production
const mockPersonalInfo = {
  firstName: "Sarah",
  lastName: "Wilson",
  email: "sarah.wilson@example.com",
  phone: "+1 (555) 123-4567",
  gender: "female",
  address: "123 Medical Center Drive",
  city: "Boston",
  state: "Massachusetts",
  country: "United States",
  bio: "Board-certified cardiologist with over 10 years of experience in treating cardiovascular diseases. Specializing in preventive cardiology and heart failure management.",
};

const mockIdVerification = {
  idType: "passport" as const,
  idNumber: "P1234567",
  idExpiryDate: "2028-06-15",
  idDocument: "/placeholder.svg?height=300&width=400",
};

const mockProfessionalInfo = {
  licenseNumber: "MD123456",
  issuingBoard: "Massachusetts Board of Registration in Medicine",
  primarySpecialty: "Cardiology",
  subSpecialties: ["Interventional Cardiology", "Echocardiography"],
  yearsOfExperience: 10,
  professionalAssociations: [
    "American College of Cardiology",
    "American Heart Association",
    "Massachusetts Medical Society",
  ],
};

const mockMedicalLicense = {
  documentUrl: "/placeholder.svg?height=300&width=400",
  documentName: "Medical_License_Wilson.pdf",
  uploadDate: "2023-01-15",
  expiryDate: "2025-01-15",
};

const mockUniversityDegree = {
  documentUrl: "/placeholder.svg?height=300&width=400",
  documentName: "MD_Degree_Harvard_Wilson.pdf",
  uploadDate: "2023-01-15",
};

function RouteComponent() {
  const handleSaveSection = (section: string) => {
    toast(`${section} updated`);
  };

  return (
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

          <SettingsSection
            title="Medical License"
            description="Update your medical license documentation"
          >
            <DocumentUploadForm
              documentType="medicalLicense"
              documentName="Medical License"
              initialData={mockMedicalLicense}
            />
          </SettingsSection>

          <SettingsSection
            title="University Degree"
            description="Update your university degree documentation"
          >
            <DocumentUploadForm
              documentType="universityDegree"
              documentName="University Degree"
              initialData={mockUniversityDegree}
            />
          </SettingsSection>
        </div>
      </div>
    </DashboardLayout>
  );
}
