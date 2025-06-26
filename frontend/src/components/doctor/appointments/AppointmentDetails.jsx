import React from "react";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { cancerTypes, statusConfig, urgencyConfig } from "@/constants";

const formatDate = (timestamp) => {
  if (!timestamp) return "Not set";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function AppointmentDetails({ appointment, patient }) {
  const cancerTypeInfo = cancerTypes.find(
    (type) => type.id === appointment.cancerType
  );

  return (
    <div className="space-y-6">
      {/* Patient Information */}
      <div>
        <h4 className="text-lg font-semibold mb-3">Patient Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Name:</span>
            <p>
              {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown"}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Email:</span>
            <p>{patient?.email || "N/A"}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Phone:</span>
            <p>{patient?.phoneNumber || "N/A"}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Date of Birth:</span>
            <p>
              {patient?.dateOfBirth ? formatDate(patient.dateOfBirth) : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Appointment Information */}
      <div>
        <h4 className="text-lg font-semibold mb-3">Appointment Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Cancer Type:</span>
            <p>
              {cancerTypeInfo?.icon}{" "}
              {cancerTypeInfo?.name || appointment.cancerType}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Status:</span>
            <Badge className={statusConfig[appointment.status]?.color}>
              {appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1)}
            </Badge>
          </div>
          <div>
            <span className="font-medium text-gray-700">Urgency:</span>
            <Badge className={urgencyConfig[appointment.urgency]?.color}>
              {urgencyConfig[appointment.urgency]?.label}
            </Badge>
          </div>
          <div>
            <span className="font-medium text-gray-700">Requested Date:</span>
            <p>{formatDate(appointment.requestedDate)}</p>
          </div>
          {appointment.appointmentDate && (
            <>
              <div>
                <span className="font-medium text-gray-700">
                  Scheduled Date:
                </span>
                <p>{formatDate(appointment.appointmentDate)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Scheduled Time:
                </span>
                <p>{appointment.appointmentTime}</p>
              </div>
            </>
          )}
          {appointment.preferredDateRange && (
            <div className="col-span-2">
              <span className="font-medium text-gray-700">
                Preferred Date Range:
              </span>
              <p>{appointment.preferredDateRange}</p>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Notes */}
      <div>
        <h4 className="text-lg font-semibold mb-3">Notes</h4>
        <div className="space-y-4">
          <div>
            <span className="font-medium text-gray-700">Patient Notes:</span>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                {appointment.patientNotes}
              </p>
            </div>
          </div>

          {appointment.doctorNotes && (
            <div>
              <span className="font-medium text-gray-700">Doctor Notes:</span>
              <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  {appointment.doctorNotes}
                </p>
              </div>
            </div>
          )}

          {appointment.rejectionReason && (
            <div>
              <span className="font-medium text-gray-700">
                Rejection Reason:
              </span>
              <div className="mt-1 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-800">
                  {appointment.rejectionReason}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetails;
