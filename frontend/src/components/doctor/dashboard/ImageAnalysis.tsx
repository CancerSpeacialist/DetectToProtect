
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";

export function ImageAnalysis() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        // Simulate AI analysis results
        setTimeout(() => {
          setAnalysisResults({
            confidence: 92,
            findings: [
              { label: 'Normal tissue', confidence: 95, severity: 'low' },
              { label: 'Slight inflammation', confidence: 87, severity: 'medium' },
              { label: 'No abnormalities detected', confidence: 98, severity: 'low' }
            ],
            recommendation: 'Continue monitoring. Follow-up in 3 months recommended.'
          });
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Image Analysis</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Upload Medical Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to upload medical image</p>
                <p className="text-sm text-gray-500">Supports: JPG, PNG, DICOM</p>
              </label>
            </div>

            {uploadedImage && (
              <div className="mt-6">
                <img
                  src={uploadedImage}
                  alt="Uploaded medical image"
                  className="w-full h-64 object-cover rounded-lg border"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {!analysisResults ? (
              <div className="text-center py-8">
                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Upload an image to see AI analysis results</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Analysis Complete</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {analysisResults.confidence}% Confidence
                  </Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Findings:</h4>
                  {analysisResults.findings.map((finding: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className={`w-4 h-4 ${
                          finding.severity === 'high' ? 'text-red-500' :
                          finding.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                        }`} />
                        <span>{finding.label}</span>
                      </div>
                      <span className="text-sm text-gray-500">{finding.confidence}%</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Recommendation:</h4>
                  <p className="text-blue-800">{analysisResults.recommendation}</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Confirm & Annotate
                  </Button>
                  <Button variant="outline">
                    Request Second Opinion
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
