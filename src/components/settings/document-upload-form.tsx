import type React from "react";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { FileImage, X, FileText } from "lucide-react";
import { CloudIcon } from "@/components/icons";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ServiceProviderAdapter,
  useUserMutation,
} from "@/adapters/ServiceProviders";
import { useQueryClient } from "@tanstack/react-query";

interface FileWithPreview extends File {
  preview: string;
  isInitial?: boolean; // Flag to track if this is the initial file
}

interface DocumentUploadFormProps {
  documentType: "medicalLicense" | "universityDegree";
  documentName: string;
  initialData: {
    documentUrl?: string;
    documentName?: string;
    uploadDate?: string;
    expiryDate?: string;
  };
}

export default function DocumentUploadForm({
  documentType,
  documentName,
  initialData,
}: DocumentUploadFormProps) {
  const queryClient = useQueryClient();

  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [expiryDate, setExpiryDate] = useState(initialData.expiryDate || "");
  const [initialExpiryDate] = useState(initialData.expiryDate || "");

  const { mutateAsync, isPending } = useUserMutation({
    mutationCallback: ServiceProviderAdapter.updateServiceProvider,
  });

  // Determine if the file is an image based on URL extension
  const isImageUrl = useMemo(() => {
    if (!initialData.documentUrl) return false;
    const url = initialData.documentUrl.toLowerCase();
    return (
      url.endsWith(".jpg") ||
      url.endsWith(".jpeg") ||
      url.endsWith(".png") ||
      url.endsWith(".gif")
    );
  }, [initialData.documentUrl]);

  // Initialize with existing document if available
  useEffect(() => {
    if (initialData.documentUrl && !file) {
      // Create a file object with the URL as preview
      const fileType = isImageUrl ? "image/jpeg" : "application/pdf";
      const fileName =
        initialData.documentName ||
        (isImageUrl ? `${documentName}.jpg` : `${documentName}.pdf`);

      const mockFile = new File([""], fileName, { type: fileType });

      const fileWithPreview = Object.assign(mockFile, {
        preview: initialData.documentUrl,
        isInitial: true, // Mark this as the initial file
      }) as FileWithPreview;

      setFile(fileWithPreview);
    }
  }, [
    initialData.documentUrl,
    initialData.documentName,
    documentName,
    file,
    isImageUrl,
  ]);

  // Check if form data has changed from initial data
  const hasChanges = useMemo(() => {
    if (!file) return false;
    // If this isn't the initial file, then it's a new upload
    if (!file.isInitial) return true;

    // For medical license, also check if expiry date changed
    if (documentType === "medicalLicense" && expiryDate !== initialExpiryDate) {
      return true;
    }
    // If No changes detected
    return false;
  }, [file, documentType, expiryDate, initialExpiryDate]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      const selectedFile = acceptedFiles[0];
      const fileWithPreview = Object.assign(selectedFile, {
        preview: URL.createObjectURL(selectedFile),
        isInitial: false, // This is a new file, not the initial one
      }) as FileWithPreview;

      setFile(fileWithPreview);
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
      // Only revoke if it's not the initial file (which uses a remote URL)
      if (!file.isInitial) {
        URL.revokeObjectURL(file.preview);
      }
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If no changes, don't submit
    if (!hasChanges) {
      return;
    }

    // if (file) {
    //   // Here you would submit the file to your API
    //   toast.success(`${documentName} updated successfully`);
    // }
    try {
      // Create FormData for the update
      const formDataToSend = new FormData();

      if (documentType === "medicalLicense") {
        formDataToSend.append("medical_license_file", file as Blob);
      } else if (documentType === "universityDegree") {
        formDataToSend.append("university_degree_file", file as Blob);
      }
      // formDataToSend.append("expiry_date", expiryDate);

      await mutateAsync(formDataToSend);
      queryClient.invalidateQueries({ queryKey: ["provider"] });
      toast.success("Document has been updated successfully");
    } catch (error) {
      toast.error("Failed to update document");
    }
  };

  // Function to determine if we should show a preview
  const shouldShowPreview = () => {
    if (!file) return false;

    // For images, always show preview
    if (file.type.startsWith("image/") || isImageUrl) return true;

    // For PDFs, we can't show a preview directly
    return false;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
              {shouldShowPreview() ? (
                <img
                  src={file.preview || "/placeholder.svg"}
                  alt="Document preview"
                  className="max-h-[120px] max-w-full object-contain"
                  onLoad={() => {
                    // Only revoke if it's not the initial file
                    if (!file.isInitial) {
                      URL.revokeObjectURL(file.preview);
                    }
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
                <div className="flex flex-col items-center">
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

        <div className="mt-1 flex items-center gap-4">
          {initialData.documentUrl && (
            <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Current document</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-2 h-auto p-0 text-xs font-medium text-primary"
                onClick={() => window.open(initialData.documentUrl, "_blank")}
              >
                View
              </Button>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Accepted formats: PDF, JPG, JPEG, PNG. Max size: 5MB
        </p>

        {documentType === "medicalLicense" && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Expiry Date
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={!hasChanges || isPending}
        className="w-full rounded-xl py-6 font-semibold text-base"
      >
        {isPending ? "Updating..." : "Save Changes"}
      </Button>
    </form>
  );
}
