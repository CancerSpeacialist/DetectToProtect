import {
  cancerTypes,
  formatDate,
  formatDateTime,
  statusConfig,
} from "@/constants";
import { Separator } from "@radix-ui/react-select";
import { Badge } from "lucide-react";

// Appointment Details Component (for modal)
export default function AppointmentDetails({ appointment, doctor }) {
  const cancerTypeInfo = cancerTypes.find(
    (type) => type.id === appointment.cancerType
  );

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold mb-3">Doctor Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Name:</span>
            <p>
              {doctor
                ? `Dr. ${doctor.firstName} ${doctor.lastName}`
                : "Unknown"}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Hospital:</span>
            <p>{doctor?.hospital || "N/A"}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Specialization:</span>
            <p>{doctor?.specialization?.join(", ") || "N/A"}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Experience:</span>
            <p>{doctor?.experience ? `${doctor.experience}+ years` : "N/A"}</p>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-lg font-semibold mb-3">Appointment Details</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Cancer Type:</span>
            <p>
              {cancerTypeInfo?.icon} {cancerTypeInfo?.name}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Status:</span>
            <Badge className={statusConfig[appointment.status]?.color}>
              {statusConfig[appointment.status]?.label}
            </Badge>
          </div>
          <div>
            <span className="font-medium text-gray-700">Requested Date:</span>
            <p>{formatDate(appointment.requestedDate)}</p>
          </div>
          {appointment.appointmentDate && (
            <div>
              <span className="font-medium text-gray-700">Scheduled:</span>
              <p>
                {formatDateTime(
                  appointment.appointmentDate,
                  appointment.appointmentTime
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-lg font-semibold mb-3">Your Notes</h4>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-600">{appointment.patientNotes}</p>
        </div>
      </div>

      {appointment.doctorNotes && (
        <>
          <Separator />
          <div>
            <h4 className="text-lg font-semibold mb-3">Doctor's Notes</h4>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-800">{appointment.doctorNotes}</p>
            </div>
          </div>
        </>
      )}

      {appointment.rejectionReason && (
        <>
          <Separator />
          <div>
            <h4 className="text-lg font-semibold mb-3">Rejection Reason</h4>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-sm text-red-800">
                {appointment.rejectionReason}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
