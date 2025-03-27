import type React from "react";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FileImage, X } from "lucide-react";
import { CloudIcon } from "@/components/icons";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FileWithPreview extends File {
  preview: string;
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
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [expiryDate, setExpiryDate] = useState(initialData.expiryDate || "");

  // Initialize with existing document if available
  useEffect(() => {
    if (initialData.documentUrl && !file) {
      // This is just for demo purposes - in a real app you'd fetch the actual file
      // For now we'll just create a placeholder
      const mockFile = new File(
        [""],
        initialData.documentName || `${documentName}.pdf`,
        {
          type: "application/pdf",
        }
      );

      const fileWithPreview = Object.assign(mockFile, {
        preview: initialData.documentUrl,
      }) as FileWithPreview;

      setFile(fileWithPreview);
    }
  }, [initialData.documentUrl, initialData.documentName, documentName, file]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      const selectedFile = acceptedFiles[0];
      const fileWithPreview = Object.assign(selectedFile, {
        preview: URL.createObjectURL(selectedFile),
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
      URL.revokeObjectURL(file.preview);
      setFile(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      // Here you would submit the file to your API
      toast(`${documentName} updated`);
    }
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
        disabled={!file}
        className="w-full rounded-xl py-6 font-semibold text-base"
      >
        Save Changes
      </Button>
    </form>
  );
}
