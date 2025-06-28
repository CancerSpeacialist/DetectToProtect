import AppointmentCard from "./AppointmentCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

// Appointments List Component
function AppointmentsList({ appointments, doctors, onViewDetails }) {
  const router = useRouter();
  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No appointments yet
          </h3>
          <p className="text-gray-600 mb-4">
            Book your first appointment to get started
          </p>
          <Button onClick={() => router.push("/patient/appointment")}>
            Book Appointment
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          doctor={doctors[appointment.doctorId]}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
export default AppointmentsList;
