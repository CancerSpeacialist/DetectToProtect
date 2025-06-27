import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Stethoscope } from "lucide-react";
import { urgencyConfig } from "@/constants";

export default function AppointmentContextCard({ appointment, patient }) {
  if (!appointment || !patient) return null;

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Calendar className="h-5 w-5" />
          Linked Appointment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Patient:</span>
            <span>
              {patient.firstName} {patient.lastName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Date:</span>
            <span>
              {appointment.appointmentDate
                ? new Date(
                    appointment.appointmentDate.seconds * 1000
                  ).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Urgency:</span>
            <Badge
              className={
                urgencyConfig[appointment.urgency]?.color ||
                "bg-gray-100 text-gray-800"
              }
            >
              {appointment.urgency}
            </Badge>
          </div>
        </div>
        {appointment.patientNotes && (
          <div className="mt-3 p-3 bg-white rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Patient Notes:
            </p>
            <p className="text-sm text-gray-600">
              {appointment.patientNotes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}