import React from "react";
import { Calendar } from "lucide-react";
import AppointmentCard from "./AppointmentCard";

function AppointmentsList({
  appointments,
  patients,
  onAccept,
  onReject,
  onViewDetails,
  onStartScreening,
  showActions = false,
  showScreeningAction = false,
}) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No appointments found
        </h3>
        <p className="text-gray-600">No appointments in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          patient={patients[appointment.patientId]}
          onAccept={onAccept}
          onReject={onReject}
          onViewDetails={onViewDetails}
          onStartScreening={onStartScreening}
          showActions={showActions}
          showScreeningAction={showScreeningAction}
        />
      ))}
    </div>
  );
}

export default AppointmentsList;
