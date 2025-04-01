import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { FileImage } from "lucide-react";
import { CloudIcon } from "@/components/icons";
import useDoctorOnboardingStore from "@/store/doctor-onboarding-store";
import { toast } from "sonner";
import {
  ServiceProviderAdapter,
  useUserMutation,
} from "@/adapters/ServiceProviders";

export function DocumentUploadForm() {
  const {
    updateFormStep,
    updateDocumentInfo,
    personalInfo,
    professionalInfo,
    documentInfo,
  } = useDoctorOnboardingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (files: File[], type: keyof typeof documentInfo) => {
    if (files?.length) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      updateDocumentInfo(type, file);
      return previewUrl;
    }
    return null;
  };

  const { mutateAsync: updateServiceProvider, isPending } = useUserMutation({
    mutationCallback: ServiceProviderAdapter.updateServiceProvider,
  });

  const { getRootProps: getIdProps, getInputProps: getIdInputProps } =
    useDropzone({
      onDrop: (files) => handleFileUpload(files, "identification_file"),
      accept: {
        "image/jpeg": [],
        "image/png": [],
        "application/pdf": [],
      },
      maxSize: 50485760,
      maxFiles: 1,
    });

  const { getRootProps: getLicenseProps, getInputProps: getLicenseInputProps } =
    useDropzone({
      onDrop: (files) => handleFileUpload(files, "medical_license_file"),
      accept: {
        "image/jpeg": [],
        "image/png": [],
        "application/pdf": [],
      },
      maxSize: 50485760,
      maxFiles: 1,
    });

  const { getRootProps: getDegreeProps, getInputProps: getDegreeInputProps } =
    useDropzone({
      onDrop: (files) => handleFileUpload(files, "university_degree_file"),
      accept: {
        "image/jpeg": [],
        "image/png": [],
        "application/pdf": [],
      },
      maxSize: 50485760,
      maxFiles: 1,
    });

  const handleSubmit = async () => {
    if (
      !documentInfo.identification_file ||
      !documentInfo.medical_license_file ||
      !documentInfo.university_degree_file
    ) {
      toast.error("Please upload all required documents");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("identification_file", documentInfo.identification_file);
      formData.append(
        "identification_type",
        documentInfo.identification_type as string
      );
      formData.append(
        "medical_license_file",
        documentInfo.medical_license_file
      );
      formData.append(
        "university_degree_file",
        documentInfo.university_degree_file
      );

      // Add other information
      Object.entries(personalInfo).forEach(([key, value]) => {
        formData.append(key, value);
      });
      Object.entries(professionalInfo).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await updateServiceProvider(formData);

      toast.success("Profile updated successfully!");
      updateFormStep(5);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDropzone = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRootProps: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getInputProps: any,
    file: File | undefined,
    title: string
  ) => (
    <div className="space-y-2">
      <h3 className="font-medium">{title}</h3>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 transition-colors duration-200
          ${file ? "bg-gray-50" : "hover:bg-gray-50"}
          flex flex-col items-center justify-center text-center
          h-[180px] cursor-pointer relative
        `}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex flex-col items-center">
            <FileImage className="h-12 w-12 text-primary mb-2" />
            <span className="text-sm text-gray-500">{file.name}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <CloudIcon />
            <p className="text-sm font-medium mt-4">
              <span className="text-primary">Choose a file </span>
              or drag & drop it here
            </p>
            <p className="text-xs text-gray-500 mt-2">
              JPEG, PNG, PDF formats, up to 50MB
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full md:max-w-md mx-auto lg:max-w-3xl pt-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Upload Required Documents</h1>
        <p className="text-gray-500 mt-2">
          Please upload all required documents to complete your profile
        </p>
      </div>

      <div className="space-y-6">
        {renderDropzone(
          getIdProps,
          getIdInputProps,
          documentInfo.identification_file,
          "Identification Document"
        )}
        {renderDropzone(
          getLicenseProps,
          getLicenseInputProps,
          documentInfo.medical_license_file,
          "Medical License"
        )}
        {renderDropzone(
          getDegreeProps,
          getDegreeInputProps,
          documentInfo.university_degree_file,
          "University Degree"
        )}

        <Button
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            !documentInfo.identification_file ||
            !documentInfo.medical_license_file ||
            !documentInfo.university_degree_file
          }
          className="w-full mt-6 rounded-xl py-6 font-semibold text-base"
        >
          {isPending ? "Uploading..." : "Complete Registration"}
        </Button>
      </div>
    </div>
  );
}
