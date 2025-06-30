import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, AlertCircle, Eye, ArrowLeft } from "lucide-react";

export default function RecentReports({ 
  reports, 
  onDownloadReport, 
  onPreviewReport,
  filteredPatientName,
  onShowAllReports 
}) {
  const getTitle = () => {
    if (filteredPatientName) {
      return `${filteredPatientName}'s Reports`;
    }
    return "Recent Reports";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{getTitle()}</CardTitle>
        {filteredPatientName && (
          <Button
            variant="outline"
            size="sm"
            onClick={onShowAllReports}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            All Reports
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{report.patientName}</p>
                  <p className="text-sm text-gray-600">
                    {report.type} - {report.date}
                  </p>
                  {report.classification && (
                    <p className="text-xs text-gray-500">
                      {report.classification} ({report.confidence}% confidence)
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      report.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {report.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onPreviewReport(report)}
                    className="gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    Preview
                  </Button>
                  {report.reportUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDownloadReport(report.reportUrl)}
                      className="gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {filteredPatientName ? "No reports found for this patient" : "No reports found"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}