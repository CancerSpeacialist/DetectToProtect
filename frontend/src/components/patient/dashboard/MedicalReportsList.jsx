import { cancerTypes,formatDate } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

// Medical Reports List Component
function MedicalReportsList({ screenings, doctors }) {
  const reportsWithData = screenings.filter(
    (screening) => screening.reportPdfUrl
  );

  if (reportsWithData.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No medical reports
          </h3>
          <p className="text-gray-600">
            Your medical reports will appear here after screenings
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reportsWithData.map((screening) => {
        const doctor = doctors[screening.doctorId];
        const cancerTypeInfo = cancerTypes.find(
          (type) => type.id === screening.cancerType
        );

        return (
          <Card
            key={screening.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {cancerTypeInfo?.name} Report
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(screening.screeningDate)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Dr.{" "}
                    {doctor
                      ? `${doctor.firstName} ${doctor.lastName}`
                      : "Unknown"}
                  </p>
                </div>

                <div className="flex justify-center">
                  <Badge
                    className={
                      screening.classification === "Malignant"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }
                  >
                    {screening.classification}
                  </Badge>
                </div>

                <Button
                  onClick={() => window.open(screening.reportPdfUrl, "_blank")}
                  className="w-full"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default MedicalReportsList;
