"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

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

interface AnalysisResultsProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

export function AnalysisResults({ result, isAnalyzing }: AnalysisResultsProps) {
  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 animate-spin" />
            Analyzing Image...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Progress value={65} className="flex-1" />
              <span className="text-sm text-gray-500">Processing...</span>
            </div>
            <p className="text-sm text-gray-600">
              Our AI model is analyzing your CT scan. This may take a few
              moments.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {result.status === "completed" ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : result.status === "error" ? (
            <AlertCircle className="h-5 w-5 text-red-500" />
          ) : (
            <Clock className="h-5 w-5 text-yellow-500" />
          )}
          Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {result.status === "completed" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Classification
                </label>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      result.classification === "cat" ? "default" : "secondary"
                    }
                    className="text-sm"
                  >
                    {result.classification.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Confidence Score
                </label>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Confidence</span>
                    <span className="font-medium">
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={result.confidence * 100} className="h-2" />
                </div>
              </div>
            </div>

            {result.processingTime && (
              <div className="text-sm text-gray-500">
                Processing completed in {result.processingTime}ms
              </div>
            )}

            {result.additionalInfo?.recommendations && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Recommendations
                </label>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {result.additionalInfo.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {result.status === "error" && (
          <div className="text-center text-red-600">
            <p>Analysis failed. Please try uploading the image again.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
