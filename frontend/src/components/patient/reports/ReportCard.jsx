import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Stethoscope, Eye, Download } from "lucide-react";
import { cancerTypes, formatDate } from "@/constants";

export default function ReportCard({
  report,
  doctor,
  onViewReport,
  onDownloadReport,
}) {
  const cancerTypeInfo = cancerTypes.find((t) => t.id === report.cancerType);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">{cancerTypeInfo?.icon || "🏥"}</span>
            </div>
            <div>
              <CardTitle className="text-lg">
                {cancerTypeInfo?.name || "Medical"} Screening Report
              </CardTitle>
              <p className="text-sm text-gray-600">
                {formatDate(report.createdAt)}
              </p>
            </div>
          </div>
          <Badge
            className={
              report.classification === "Cancer"
                ? "bg-red-100 text-red-800"
                : report.classification === "Suspicious"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }
          >
            {report.classification}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>
            Dr. {doctor ? `${doctor.firstName} ${doctor.lastName}` : "Unknown"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Stethoscope className="h-4 w-4" />
          <span>Confidence: {report.confidence}%</span>
        </div>

        {report.doctorReview && (
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-800 mb-1">
              Doctor's Review:
            </p>
            <p className="text-sm text-blue-700">{report.doctorReview}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewReport(report)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button
            size="sm"
            onClick={() => onDownloadReport(report.reportPdfUrl)}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
