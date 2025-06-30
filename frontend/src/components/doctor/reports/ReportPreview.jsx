import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  User, 
  Calendar, 
  FileText, 
  Brain,
  MessageSquare,
  ClipboardList,
  Download 
} from "lucide-react";

const cancerTypes = {
  "breast-cancer": { name: "Breast Cancer", icon: "🎗️" },
  "lung-cancer": { name: "Lung Cancer", icon: "🫁" },
  "skin-cancer": { name: "Skin Cancer", icon: "🔬" },
  "brain-tumor": { name: "Brain Tumor", icon: "🧠" },
  "prostate-cancer": { name: "Prostate Cancer", icon: "⚕️" },
  "pancreatic-cancer": { name: "Pancreatic Cancer", icon: "🏥" },
  "liver-cancer": { name: "Liver Cancer", icon: "🔬" },
  "esophagus-cancer": { name: "Esophagus Cancer", icon: "⚕️" }
};

export default function ReportPreview({ report, onClose }) {
  if (!report) return null;

  const cancerInfo = cancerTypes[report.cancerType] || { name: "Medical Report", icon: "🏥" };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Report Details</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Report Header */}
        <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{cancerInfo.icon}</span>
            <div>
              <h3 className="text-lg font-semibold">
                {cancerInfo.name} Report
              </h3>
              <p className="text-gray-600">
                {formatDate(report.createdAt)}
              </p>
            </div>
          </div>
          <Badge
            className={
              report.classification === "Cancer"
                ? "bg-red-100 text-red-800"
                : report.classification === "noCancer"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }
          >
            {report.classification}
          </Badge>
        </div>

        {/* Patient Information */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Patient Information
          </h4>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="font-medium">{report.patientName}</p>
            <p className="text-sm text-gray-600">Patient ID: {report.patientId}</p>
          </div>
        </div>

        <Separator />

        {/* Analysis Results */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Analysis Results
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Classification:</span>
              <p>{report.classification}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Confidence:</span>
              <p>{report.confidence}%</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Cancer Type:</span>
              <p>{cancerInfo.name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <p className="capitalize">{report.status}</p>
            </div>
          </div>
        </div>

        {/* Doctor's Review */}
        {report.doctorReview && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Doctor's Review
              </h4>
              <div className="bg-blue-50 grid grid-cols-1 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 leading-relaxed  break-words">
                  {report.doctorReview}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Doctor's Diagnosis */}
        {report.doctorDiagnosis && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold  mb-3 flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Doctor's Diagnosis
              </h4>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 leading-relaxed  break-words">
                  {report.doctorDiagnosis}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Images */}
        {(report.inputImageUrl || report.resultImageUrl) && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-3">Medical Images</h4>
              <div className="grid grid-cols-1 gap-4">
                {report.inputImageUrl && (
                  <div>
                    <h5 className="font-medium mb-2">Input Image</h5>
                    <img
                      src={report.inputImageUrl}
                      alt="Input scan"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
                {report.resultImageUrl && (
                  <div>
                    <h5 className="font-medium mb-2">Analysis Result</h5>
                    <img
                      src={report.resultImageUrl}
                      alt="Analysis result"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Download Button */}
        {report.reportUrl && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => window.open(report.reportUrl, '_blank')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Full Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}