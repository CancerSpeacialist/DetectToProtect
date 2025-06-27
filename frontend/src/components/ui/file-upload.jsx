"use client";

import {  useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileImage, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
// import { Alert, AlertDescription } from "@/components/ui/alert";

export function FileUpload({
  onFileSelect,
  selectedFile,
  screeningForm,
  setScreeningForm,
  disabled = false,
  maxSize = 10 * 1024 * 1024, // 10MB cloudinary limit
  uploadProgress = 0,
  isUploading = false,
  onCancel,
  // error,
}) {

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      // Handle file rejections
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        let errorMessage = "File upload failed";

        if (rejection.errors.some((error) => error.code === "file-too-large")) {
          errorMessage = `File is too large. Maximum size is ${formatFileSize(
            maxSize
          )}`;
        } else if (
          rejection.errors.some((error) => error.code === "file-invalid-type")
        ) {
          errorMessage =
            "Invalid file type. Please upload a medical image file";
        }

        // You might want to pass this error up to the parent component
        console.error(errorMessage);
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        // Create preview for image files
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setScreeningForm((prev) => ({
              ...prev,
              previewUrl: e.target?.result,
            }));
          };
          reader.readAsDataURL(file);
        } else {
          setScreeningForm((prev) => ({
            ...prev,
            selectedFile: null,
            previewUrl: null,
          }));
        }

        onFileSelect(file);
      }
    },
    [onFileSelect, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/dicom": [".dicom", ".dcm"],
      "application/octet-stream": [".nrrd", ".dcm"],
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    maxFiles: 1,
    maxSize: maxSize,
    disabled: disabled || isUploading,
  });

  const removeFile = () => {
    onFileSelect(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileTypeLabel = (file) => {
  let extension = "";
  if (file.name && file.name.includes(".")) {
    extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
  }
  return `${extension ? extension : "Unknown File Type"}`;
};

  return (
    <div className="space-y-4">
      {/* {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )} */}

      <Card className="w-full">
        <CardContent className="p-6">
          {!selectedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : disabled
                  ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload
                className={`mx-auto h-12 w-12 mb-4 ${
                  disabled ? "text-gray-300" : "text-gray-400"
                }`}
              />

              <p
                className={`text-lg font-medium mb-2 ${
                  disabled ? "text-gray-400" : "text-gray-900"
                }`}
              >
                {isDragActive
                  ? "Drop your medical image here"
                  : "Upload Medical Image"}
              </p>

              <p
                className={`text-sm mb-4 ${
                  disabled ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {isDragActive
                  ? "Release to upload your file"
                  : "Drag and drop your medical image here, or click to browse"}
              </p>

              <p
                className={`text-xs ${
                  disabled ? "text-gray-300" : "text-gray-400"
                }`}
              >
                Supports: DICOM (.dcm), JPEG, PNG, NRRD • Max size:{" "}
                {formatFileSize(maxSize)}
              </p>

              {disabled && (
                <p className="text-xs text-red-400 mt-2">
                  Please wait for current operation to complete
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info */}
              <div
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${
                  isUploading
                    ? "bg-blue-50 border-blue-200"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isUploading ? "bg-blue-100" : "bg-green-100"
                    }`}
                  >
                    <FileImage
                      className={`h-6 w-6 ${
                        isUploading ? "text-blue-600" : "text-green-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {selectedFile.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{formatFileSize(selectedFile.size)}</span>
                      <span>•</span>
                      <span>{getFileTypeLabel(selectedFile)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isUploading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      <span className="text-xs text-blue-600 font-medium">
                        Uploading
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">
                        Ready
                      </span>
                    </div>
                  )}

                  {!isUploading && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}

                  {isUploading && onCancel && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onCancel}
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Image Preview */}
              {screeningForm.previewUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Preview:
                  </p>
                  <div className="border-2 border-gray-200 rounded-lg p-2 bg-gray-50">
                    <img
                      src={screeningForm.previewUrl}
                      alt="Medical image preview"
                      className="max-w-full h-48 object-contain mx-auto rounded border bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      <span className="text-blue-600 font-medium">
                        Uploading to secure server...
                      </span>
                    </div>
                    <span className="text-blue-600 font-mono">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>

                  <Progress value={uploadProgress} className="w-full h-2" />

                  <div className="text-xs text-gray-500 text-center">
                    Please don't close this window while uploading
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
