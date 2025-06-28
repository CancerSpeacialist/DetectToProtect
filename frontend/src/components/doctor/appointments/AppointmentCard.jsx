import React from "react";
import {
  Calendar,
  Camera,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  cancerTypes,
  statusConfig,
  urgencyConfig,
  formatDate,
  formatDateTime,
} from "@/constants";

function AppointmentCard({
  appointment,
  patient,
  onAccept,
  onReject,
  onViewDetails,
  onStartScreening,
  showActions,
  showScreeningAction,
}) {
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
                <User className="h-6 w-6 text-blue-600" />
              </div>

              <div className="flex-1 space-y-3">
                {/* Patient Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {patient
                      ? `${patient.firstName} ${patient.lastName}`
                      : "Unknown Patient"}
                  </h3>
                  <p className="text-sm text-gray-600">{patient?.email}</p>
                </div>

                {/* Cancer Type & Status */}
                <div className="flex items-center gap-4 flex-wrap">
                  <Badge className="bg-purple-100 text-purple-800">
                    {cancerTypeInfo?.icon}{" "}
                    {cancerTypeInfo?.name || appointment.cancerType}
                  </Badge>
                  <Badge className={statusConfig[appointment.status]?.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </Badge>
                  <Badge className={urgencyConfig[appointment.urgency]?.color}>
                    {urgencyConfig[appointment.urgency]?.label}
                  </Badge>
                </div>

                {/* Appointment Details */}
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
                  {appointment.preferredDateRange && (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Preferred: {appointment.preferredDateRange}</span>
                    </div>
                  )}
                </div>

                {/* Patient Notes Preview */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Patient Notes:
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {appointment.patientNotes}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(appointment)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>

            {showActions && (
              <>
                <Button size="sm" onClick={() => onAccept(appointment)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onReject(appointment)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}

            {showScreeningAction && (
              <Button
                size="sm"
                onClick={() => onStartScreening(appointment)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Camera className="h-4 w-4 mr-2" />
                Start Screening
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AppointmentCard;
