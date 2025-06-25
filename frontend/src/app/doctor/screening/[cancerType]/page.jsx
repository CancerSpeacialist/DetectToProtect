// src/app/doctor/screening/[cancerType]/page.jsx

// interface AnalysisResult {
//   id: string;
//   classification: string;
//   confidence: number;
//   status: "processing" | "completed" | "error";
//   processingTime?: number;
//   additionalInfo?: {
//     regions?: string[];
//     recommendations?: string[];
//   };
// }

"use client";

import React, { useEffect } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { AnalysisResults } from "@/components/doctor/screening/analysis-results";
import { PDFGenerator } from "@/components/doctor/screening/pdf-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useCancerScreening } from "@/hooks/useCancerScreening";

export default function CancerScreeningPage({ params }) {
  const { cancerType } = React.use(params);

  const {
    selectedFile,
    isUploading,
    isAnalyzing,
    uploadProgress,
    analysisResult,
    imageUrl,
    error,
    handleFileSelect,
    handleAnalyze,
    cancelUpload,
    cleanup,
    isProcessing,
    canAnalyze,
  } = useCancerScreening(cancerType);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {cancerType
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}{" "}
          Cancer Detection
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Upload your medical images for AI-powered analysis. Our advanced
          machine learning models will help detect potential abnormalities with
          high accuracy.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column - Upload and Controls */}
        <div className="space-y-6">
          <Card className="border-2 border-dashed border-blue-200 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <FileText className="w-6 h-6" />
                Upload Medical Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                disabled={isProcessing}
                acceptedTypes={["image/jpeg", "image/png", "image/dicom"]}
                maxSize={10 * 1024 * 1024} // 10MB
                uploadProgress={uploadProgress}
                isUploading={isUploading}
                onCancel={cancelUpload}
                error={error}
              />
            </CardContent>
          </Card>

          {/* Analysis Button */}
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                {isUploading && "Uploading..."}
                {isAnalyzing && "Analyzing with AI..."}
                {!isProcessing && selectedFile && "Start AI Analysis"}
                {!isProcessing && !selectedFile && "Select Image First"}
              </Button>

              {isProcessing && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      {isUploading
                        ? "Uploading image..."
                        : "Processing with AI..."}
                    </span>
                    {isUploading && <span>{Math.round(uploadProgress)}%</span>}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: isUploading
                          ? `${uploadProgress}%`
                          : isAnalyzing
                          ? "100%"
                          : "0%",
                        animation: isAnalyzing ? "pulse 2s infinite" : "none",
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          <Card className="min-h-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysisResult ? (
                <AnalysisResults
                  result={analysisResult}
                  cancerType={cancerType}
                  imageUrl={imageUrl}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <div className="w-16 h-16 border-4 border-gray-200 border-dashed rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <p className="text-lg font-medium mb-2">No Analysis Yet</p>
                  <p className="text-sm text-center max-w-xs">
                    Upload an image and click "Start AI Analysis" to see
                    detailed results here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* PDF Generation Section */}
          {analysisResult && analysisResult.status === "completed" && (
            <PDFGenerator
              analysisResult={analysisResult}
              cancerType={cancerType}
              imageUrl={imageUrl}
              patientInfo={{
                name: "Current User", // This should come from auth context
                id: "P-" + new Date().getTime(),
                date: new Date().toLocaleDateString(),
              }}
            />
          )}
        </div>
      </div>

      {/* Bottom Section - Additional Info */}
      {analysisResult && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-blue-700">
                Analysis Complete
              </h3>
              <p className="text-blue-600">
                Your medical image has been successfully analyzed. Please
                consult with a medical professional for proper interpretation of
                these results.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
