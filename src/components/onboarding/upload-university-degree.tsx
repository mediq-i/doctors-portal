import type React from "react";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { X, FileImage } from "lucide-react";
import { CloudIcon } from "../icons";
import { useNavigate } from "@tanstack/react-router";
import { LoadingIcon } from "../icons";
import {
  serviceProviderMutation,
  ServiceProviderAdapter,
} from "../adapters/ServiceProvider";
import { getErrorMessage, fileCache } from "@/utils";
import { toast } from "sonner";
// import { useOnboardingProgressStore } from "@/store/onboarding-progress";

interface FileWithPreview extends File {
  preview: string;
}

interface DocumentUploadProps {
  onSubmit: (data: { universityDegree?: File }) => void;
  defaultValues?: { universityDegree?: File };
}

export default function UploadUniversityDegree({
  onSubmit,
  defaultValues = {},
}: DocumentUploadProps) {
  const navigate = useNavigate();

  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isPending, mutateAsync } = serviceProviderMutation(
    ServiceProviderAdapter.updateServiceProvider,
    ""
  );

  // Initialize file if defaultValues has documentFile
  useEffect(() => {
    // Check for default values
    if (
      defaultValues.universityDegree &&
      !file &&
      defaultValues.universityDegree instanceof File
    ) {
      const fileWithPreview = Object.assign(defaultValues.universityDegree, {
        preview: URL.createObjectURL(defaultValues.universityDegree),
      }) as FileWithPreview;

      setFile(fileWithPreview);
    }

    // Check if we have a cached file
    const cachedFile = fileCache.get("universityDegree");
    if (cachedFile && !file && cachedFile instanceof File) {
      const fileWithPreview = Object.assign(cachedFile, {
        preview: URL.createObjectURL(cachedFile),
      }) as FileWithPreview;

      setFile(fileWithPreview);
    }
  }, [defaultValues.universityDegree, file]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      const selectedFile = acceptedFiles[0];
      const fileWithPreview = Object.assign(selectedFile, {
        preview: URL.createObjectURL(selectedFile),
      }) as FileWithPreview;

      setFile(fileWithPreview);

      // Store the file in our cache
      fileCache.set("universityDegree", selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "application/pdf": [],
    },
    maxSize: 50485760, // 50MB
    maxFiles: 1,
    noClick: !!file, // Disable click when file is already selected
    noKeyboard: !!file, // Disable keyboard when file is already selected
  });

  const removeFile = () => {
    if (file) {
      URL.revokeObjectURL(file.preview);
      setFile(null);

      // Remove from cache
      fileCache.delete("universityDegree");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate file exists before proceeding
      if (!file) {
        toast.error("Please upload your university degree");
        setIsSubmitting(false);
        return;
      }
      onSubmit({ universityDegree: file || undefined });

      // Retrieve stored form data from localStorage
      const storedData = localStorage.getItem(
        "personal-professional-info-store"
      );
      if (!storedData) {
        console.error("No stored form data found.");
        toast.error(
          "No stored form data found. Please complete previous steps first."
        );
        return;
      }
      const parsedData = JSON.parse(storedData!);

      const formData = new FormData();

      // Append text fields
      if (parsedData.state.formData.medicalLicenseNumber) {
        formData.append(
          "medical_license_no",
          parsedData.state.formData.medicalLicenseNumber
        );
      }

      if (parsedData.state.formData.yearsOfExperience) {
        formData.append(
          "years_of_experience",
          parsedData.state.formData.yearsOfExperience
        );
      }

      if (parsedData.state.formData.documentType) {
        formData.append(
          "identification_type",
          parsedData.state.formData.documentType
        );
      }

      if (parsedData.state.formData.issuingMedicalBoard) {
        formData.append(
          "issuing_medical_board",
          parsedData.state.formData.issuingMedicalBoard
        );
      }

      if (parsedData.state.formData.professionalAssociations) {
        formData.append(
          "professional_associations",
          parsedData.state.formData.professionalAssociations
        );
      }

      if (parsedData.state.formData.specialty) {
        formData.append("specialty", parsedData.state.formData.specialty);
      }

      // Handle languages array properly
      if (parsedData.state.formData.languages) {
        // If languages is an array, join it with commas
        if (Array.isArray(parsedData.state.formData.languages)) {
          formData.append(
            "languages",
            parsedData.state.formData.languages.join(", ")
          );
        } else {
          // If it's already a string, use it directly
          formData.append("languages", parsedData.state.formData.languages);
        }
      }

      // Append file fields - Get files from our cache
      if (parsedData.state.formData.documentFile) {
        formData.append(
          "identification_file",
          parsedData.state.formData.documentFile
        );
      }

      if (parsedData.state.formData.medicalLicense) {
        formData.append(
          "medical_license_file",
          parsedData.state.formData.medicalLicense
        );
      }

      // Add the university degree file
      formData.append("university_degree_file", file);

      // Log the FormData for debugging
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // Submit the form data
      const res = await mutateAsync(formData);
      console.log("File upload response: ", res?.data);

      // Navigate to completion page on success
      navigate({ to: "/onboarding/completion" });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="w-full max-w-md p-6 pl-2">
      <h1 className="pb-2 leading-8 lg:leading-10 text-xl md:text-2xl lg:text-3xl font-bold pt-6 max-w-lg">
        Upload University Degree
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        <div className="space-y-2">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-6 transition-colors duration-200
              ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300"}
              ${file ? "bg-gray-50" : "hover:bg-gray-50"}
              flex flex-col items-center justify-center text-center
              h-[180px] cursor-pointer relative
            `}
          >
            <input {...getInputProps()} />

            {file ? (
              <div className="w-full h-full flex flex-col items-center justify-center relative">
                {file.type.startsWith("image/") ? (
                  <img
                    src={file.preview || "/placeholder.svg"}
                    alt="Document preview"
                    className="max-h-[120px] max-w-full object-contain"
                    onLoad={() => {
                      URL.revokeObjectURL(file.preview);
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <FileImage className="h-12 w-12 text-primary mb-2" />
                    <span className="text-sm text-gray-500">{file.name}</span>
                  </div>
                )}

                <div className="absolute top-0 right-0 flex space-x-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {isDragActive ? (
                  <div className="flex flex-col items-center ">
                    <CloudIcon />
                    <p className="text-sm font-medium text-primary mt-4">
                      Drop your file here
                    </p>
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
              </>
            )}
          </div>

          {file && (
            <div className="flex justify-center mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={open}
                className="text-xs"
              >
                Choose another file
              </Button>
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!file || isSubmitting || isPending}
          className="w-full mt-6 rounded-xl py-6 font-semibold text-base"
        >
          {isSubmitting || isPending ? <LoadingIcon /> : "Submit"}
        </Button>
      </form>
    </div>
  );
}
