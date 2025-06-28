import { cancerTypes, formatDate } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Calendar } from "lucide-react";

// Screening History List Component
function ScreeningHistoryList({ screenings, doctors, appointments }) {
  if (screenings.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No screening history
          </h3>
          <p className="text-gray-600">
            Your completed screenings will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {screenings.map((screening) => {
        const appointment = appointments.find(
          (apt) => apt.id === screening.appointmentId
        );
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
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{cancerTypeInfo?.icon}</span>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {cancerTypeInfo?.name} Screening
                        </h3>
                        <p className="text-sm text-gray-600">
                          By Dr.{" "}
                          {doctor
                            ? `${doctor.firstName} ${doctor.lastName}`
                            : "Unknown"}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 flex-wrap">
                        <Badge
                          className={
                            screening.classification === "Malignant"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {screening.classification}
                        </Badge>
                        <Badge variant="secondary">
                          {screening.confidence}% confidence
                        </Badge>
                        <Badge
                          className={
                            screening.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : screening.status === "under_review"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {screening.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Screening Date:{" "}
                            {formatDate(screening.screeningDate)}
                          </span>
                        </div>
                        {screening.doctorReview && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="font-medium text-blue-800 mb-1">
                              Doctor's Review:
                            </p>
                            <p className="text-blue-700">
                              {screening.doctorReview}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {screening.reportPdfUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(screening.reportPdfUrl, "_blank")
                      }
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  )}
                  {screening.imageUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(screening.imageUrl, "_blank")}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Scan
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default ScreeningHistoryList;
