import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, AlertTriangle } from "lucide-react";

export default function AnalysisGuidelines() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Analysis Guidelines
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">
            Image Requirements:
          </h4>
          <ul className="text-sm text-gray-600 space-y-1 ml-4">
            <li>• High resolution medical scans (MRI, CT, X-ray)</li>
            <li>• Clear, unobstructed view of the area of interest</li>
            <li>• Proper contrast and brightness</li>
            <li>• DICOM or standard image formats</li>
            <li>• NRRD (.nrrd) - Medical research data</li>
          </ul>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">
            AI Analysis Includes:
          </h4>
          <ul className="text-sm text-gray-600 space-y-1 ml-4">
            <li>• Automated cancer classification (present or not)</li>
            <li>• Cancer detection and localization</li>
            <li>• Confidence scoring</li>
            <li>• Comparative analysis with normal patterns</li>
          </ul>
        </div>

        <Separator />

        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-sm text-yellow-800">
            <AlertTriangle className="h-4 w-4 inline mr-1" />
            AI analysis is a diagnostic aid. Final diagnosis should always
            be made by qualified medical professionals.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}