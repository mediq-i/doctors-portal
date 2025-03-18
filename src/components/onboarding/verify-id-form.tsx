import type React from "react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, FileImage } from "lucide-react";
import { CloudIcon } from "../icons";

interface FileWithPreview extends File {
  preview: string;
}

export default function VerifyIdForm() {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [documentType, setDocumentType] = useState<string>("national-id");

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
    maxSize: 50485760, // 10MB
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
      console.log("Document type:", documentType);
      console.log("File:", file);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Verify your identity</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-y-2">
          <label htmlFor="document-type" className="text-sm font-medium">
            Document type
          </label>
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger
              id="document-type"
              className="w-full border-input/50"
            >
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="national-id">National ID</SelectItem>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="drivers-license">Driver's License</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
                    {/* <Upload className="h-10 w-10 text-primary mb-2" /> */}
                    <CloudIcon />
                    <p className="text-sm font-medium text-primary mt-4">
                      Drop your file here
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    {/* <Upload className="h-10 w-10 text-gray-400 mb-2" /> */}
                    <CloudIcon />
                    <p className="text-sm font-medium mt-4">
                      <span className="text-primary">Choose a file </span>
                      or drag & drop it here
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      JPEG, PNG, DOC and MP4 formats, up to 50MB
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
          type="submit"
          disabled={!file}
          className="w-full mt-6 rounded-xl py-6 font-semibold text-base"
        >
          Continue
        </Button>
      </form>
    </div>
  );
}
