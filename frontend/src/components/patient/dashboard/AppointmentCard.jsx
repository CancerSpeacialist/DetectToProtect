import {
  cancerTypes,
  statusConfig,
  formatDate,
  formatDateTime,
} from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stethoscope, Calendar, Clock, Eye } from "lucide-react";

// Appointment Card Component
function AppointmentCard({ appointment, doctor, onViewDetails }) {
  const cancerTypeInfo = cancerTypes.find(
    (type) => type.id === appointment.cancerType
  );
  const StatusIcon = statusConfig[appointment.status]?.icon || Clock;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {doctor
                      ? `Dr. ${doctor.firstName} ${doctor.lastName}`
                      : "Doctor"}
                  </h3>
                  <p className="text-sm text-gray-600">{doctor?.hospital}</p>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <Badge className="bg-purple-100 text-purple-800">
                    {cancerTypeInfo?.icon}{" "}
                    {cancerTypeInfo?.name || appointment.cancerType}
                  </Badge>
                  <Badge className={statusConfig[appointment.status]?.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig[appointment.status]?.label}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Requested: {formatDate(appointment.requestedDate)}
                    </span>
                  </div>
                  {appointment.appointmentDate && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        Scheduled:{" "}
                        {formatDateTime(
                          appointment.appointmentDate,
                          appointment.appointmentTime
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status-specific messages */}
                {appointment.status === "accepted" &&
                  appointment.doctorNotes && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-800 mb-1">
                        Doctor's Notes:
                      </p>
                      <p className="text-sm text-green-700">
                        {appointment.doctorNotes}
                      </p>
                    </div>
                  )}

                {appointment.status === "rejected" &&
                  appointment.rejectionReason && (
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-800 mb-1">
                        Rejection Reason:
                      </p>
                      <p className="text-sm text-red-700">
                        {appointment.rejectionReason}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(appointment)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AppointmentCard;
