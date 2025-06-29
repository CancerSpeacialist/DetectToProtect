import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Stethoscope,
  Eye,
  Download,
  MessageSquare,
  ClipboardList,
} from "lucide-react";
import { cancerTypes, formatDate } from "@/constants";

export default function ReportCard({
  report,
  doctor,
  onViewReport,
  onDownloadReport,
}) {
  const cancerTypeInfo = cancerTypes.find((t) => t.id === report.cancerType);

  // Function to truncate long text
  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-sm">
              <span className="text-2xl">{cancerTypeInfo?.icon || "🏥"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight truncate">
                {cancerTypeInfo?.name || "Medical"} Screening
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {formatDate(report.createdAt)}
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={`
              shrink-0 font-medium
              ${
                report.classification === "Cancer"
                  ? "bg-red-100 text-red-800 border-red-200"
                  : report.classification === "Suspicious"
                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                  : "bg-green-100 text-green-800 border-green-200"
              }
            `}
          >
            {report.classification}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Doctor and Confidence Info */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4 shrink-0" />
            <span className="truncate">
              Dr.{" "}
              {doctor ? `${doctor.firstName} ${doctor.lastName}` : "Unknown"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Stethoscope className="h-4 w-4 shrink-0" />
            <span>Confidence: {report.confidence}%</span>
          </div>
        </div>

        {/* Doctor's Review */}
        {report.doctorReview && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-medium text-blue-800">Review</p>
            </div>
            <p className="text-sm text-blue-700 leading-relaxed break-words overflow-hidden">
              {truncateText(report.doctorReview, 120)}
              {report.doctorReview.length > 120 && (
                <button
                  onClick={() => onViewReport(report)}
                  className="text-blue-600 hover:text-blue-800 ml-1 underline whitespace-nowrap"
                >
                  Read more
                </button>
              )}
            </p>
          </div>
        )}

        {/* Doctor's Diagnosis */}
        {report.doctorDiagnosis && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="h-4 w-4 text-green-600" />
              <p className="text-sm font-medium text-green-800">Diagnosis</p>
            </div>
            <p className="text-sm text-green-700 leading-relaxed break-words overflow-hidden">
              {truncateText(report.doctorDiagnosis, 120)}
              {report.doctorDiagnosis.length > 120 && (
                <button
                  onClick={() => onViewReport(report)}
                  className="text-green-600 hover:text-green-800 ml-1 underline whitespace-nowrap"
                >
                  Read more
                </button>
              )}
            </p>
          </div>
        )}

        <Separator className="my-4" />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewReport(report)}
            className="flex-1 hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button
            size="sm"
            onClick={() => onDownloadReport(report.reportPdfUrl)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
