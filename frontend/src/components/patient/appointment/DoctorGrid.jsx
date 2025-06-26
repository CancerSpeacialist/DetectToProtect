import { Badge } from "@/components/ui/badge";
import DoctorCard from "@/components/patient/appointment/DoctorCard";
import { Stethoscope } from "lucide-react";

export default function DoctorGrid({
  filteredDoctors,
  selectedCancerType,
  handleBookAppointment,
}) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-600">
          {filteredDoctors.length} doctor
          {filteredDoctors.length !== 1 ? "s" : ""} found
        </p>
        {!selectedCancerType && (
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-600"
          >
            Please select a cancer type to see specialized doctors
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor, index) => (
          <DoctorCard
            key={index}
            doctor={doctor}
            onBookAppointment={handleBookAppointment}
            selectedCancerType={selectedCancerType}
          />
        ))}
      </div>
      {filteredDoctors.length === 0 && selectedCancerType && (
        <div className="text-center py-12">
          <Stethoscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No doctors found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or search terms to find more doctors.
          </p>
        </div>
      )}
    </>
  );
}
