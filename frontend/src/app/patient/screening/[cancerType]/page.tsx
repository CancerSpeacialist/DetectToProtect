// // src/app/patient/screening/[cancerType]/page.tsx
"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { AnalysisResults } from "@/components/patient/screening/analysis-results";
import { PDFGenerator } from "@/components/patient/screening/pdf-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface AnalysisResult {
  id: string;
  classification: string;
  confidence: number;
  status: "processing" | "completed" | "error";
  processingTime?: number;
  additionalInfo?: {
    regions?: string[];
    recommendations?: string[];
  };
}

export default function CancerScreeningPage({
  params,
}: {
  params: { cancerType: string };
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    try {
      // Step 1: Upload to Cloudinary
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("cancerType", params.cancerType);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const uploadData = await uploadResponse.json();
      setImageUrl(uploadData.imageUrl);
      setIsUploading(false);

      // Step 2: Analyze with ML model
      setIsAnalyzing(true);

      const analysisResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadData.imageUrl,
          patientId: "patient-123", // This should come from auth
          cancerType: params.cancerType,
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error("Analysis failed");
      }

      const analysisData = await analysisResponse.json();
      setAnalysisResult(analysisData.result);
      setIsAnalyzing(false);
    } catch (error) {
      console.error("Error:", error);
      setIsUploading(false);
      setIsAnalyzing(false);
      setAnalysisResult({
        id: "error",
        classification: "Error",
        confidence: 0,
        status: "error",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          {params.cancerType.charAt(0).toUpperCase() +
            params.cancerType.slice(1).replace("-", " ")}{" "}
          Screening
        </h1>
        <p className="text-lg text-gray-600">
          Upload your CT scan for AI-powered analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload CT Scan</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                onFileSelect={handleFileSelect}
                isLoading={isUploading}
                uploadProgress={uploadProgress}
              />

              {selectedFile && !isUploading && (
                <div className="mt-4">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full"
                    size="lg"
                  >
                    {isAnalyzing ? "Analyzing..." : "Start Analysis"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <AnalysisResults result={analysisResult} isAnalyzing={isAnalyzing} />

          {analysisResult?.status === "completed" && imageUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Generate Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PDFGenerator
                  analysisResult={analysisResult}
                  imageUrl={imageUrl}
                  patientId="patient-123"
                  cancerType={params.cancerType}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
