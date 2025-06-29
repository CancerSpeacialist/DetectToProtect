import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, AlertCircle } from "lucide-react";
import { cancerTypes, statusConfig } from "@/constants";
import { formatDate } from "@/lib/date-utils";

export default function PatientHistoryModal({
  isOpen,
  onClose,
  patientHistory,
  patientName,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {patientName
              ? `${patientName}'s Medical History`
              : "Patient Medical History"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {patientHistory.map((item) => (
            <Card key={`${item.type}-${item.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {item.type === "appointment" ? (
                      <Calendar className="w-5 h-5 text-blue-600" />
                    ) : (
                      <FileText className="w-5 h-5 text-green-600" />
                    )}
                    <div>
                      <h4 className="font-semibold">
                        {item.type === "appointment"
                          ? "Appointment"
                          : "Screening"}
                        {item.cancerType && (
                          <span className="ml-2">
                            -{" "}
                            {
                              cancerTypes.find((t) => t.id === item.cancerType)
                                ?.name
                            }
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formatDate(item.createdAt)}
                        {item.doctors?.[item.doctorId] && (
                          <span className="ml-2">
                            by Dr. {item.doctors[item.doctorId].firstName}{" "}
                            {item.doctors[item.doctorId].lastName}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {item.type === "appointment" && (
                      <Badge className={statusConfig[item.status]?.color}>
                        {statusConfig[item.status]?.label}
                      </Badge>
                    )}
                    {item.type === "screening" && (
                      <Badge
                        className={
                          item.classification === "Cancer"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {item.classification}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Patient Notes */}
                {item.patientNotes && (
                  <div className="mt-3">
                    <span className="text-sm font-medium">Patient Notes:</span>
                    <p className="text-sm text-gray-600">{item.patientNotes}</p>
                  </div>
                )}

                {/* Doctor Notes */}
                {item.doctorNotes && (
                  <div className="mt-3">
                    <span className="text-sm font-medium">Doctor Notes:</span>
                    <p className="text-sm text-gray-600">{item.doctorNotes}</p>
                  </div>
                )}

                {/* Diagnosis */}
                {item.doctorDiagnosis && (
                  <div className="mt-3">
                    <span className="text-sm font-medium">Diagnosis:</span>
                    <p className="text-sm text-gray-600">
                      {item.doctorDiagnosis}
                    </p>
                  </div>
                )}

                {/* Doctor Review */}
                {item.doctorReview && (
                  <div className="mt-3">
                    <span className="text-sm font-medium">Review:</span>
                    <p className="text-sm text-gray-600">{item.doctorReview}</p>
                  </div>
                )}

                {/* Appointment specific fields */}
                {item.type === "appointment" && item.rejectionReason && (
                  <div className="mt-3">
                    <span className="text-sm font-medium">
                      Rejection Reason:
                    </span>
                    <p className="text-sm text-red-600">
                      {item.rejectionReason}
                    </p>
                  </div>
                )}

                {/* Screening specific fields */}
                {item.type === "screening" && (
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">
                        Confidence:
                      </span>
                      <span className="ml-2">{item.confidence}%</span>
                    </div>
                    {item.aiModelVersion && (
                      <div>
                        <span className="font-medium text-gray-700">
                          AI Model:
                        </span>
                        <span className="ml-2">{item.aiModelVersion}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Images */}
                {(item.inputImageUrl || item.resultImageUrl) && (
                  <div className="mt-3">
                    <div className="grid grid-cols-2 gap-2">
                      {item.inputImageUrl && (
                        <div>
                          <span className="text-xs font-medium text-gray-600">
                            Input Image
                          </span>
                          <img
                            src={item.inputImageUrl}
                            alt="Input scan"
                            className="w-full h-20 object-cover rounded border"
                          />
                        </div>
                      )}
                      {item.resultImageUrl && (
                        <div>
                          <span className="text-xs font-medium text-gray-600">
                            Result Image
                          </span>
                          <img
                            src={item.resultImageUrl}
                            alt="Analysis result"
                            className="w-full h-20 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {patientHistory.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No medical history found for this patient.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
