import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Calendar, Stethoscope } from "lucide-react";
import {cancerTypes} from "@/constants";

// Doctor Card Component
export default function DoctorCard({
  doctor,
  onBookAppointment,
  selectedCancerType,
}) {
  const cancerTypeInfo = cancerTypes.find(
    (type) => type.id === selectedCancerType
  );

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                Dr. {doctor.firstName} {doctor.lastName}
              </h3>
              <p className="text-sm text-gray-600">{doctor.hospital}</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800">Available</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Specializations */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Specializations:
          </p>
          <div className="flex flex-wrap gap-1">
            {doctor.specialization?.map((spec, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
          </div>
        </div>

        {/* Cancer Specializations */}
        {doctor.cancerSpecializations?.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Cancer Specializations:
            </p>
            <div className="flex flex-wrap gap-1">
              {doctor.cancerSpecializations.map((cancer, index) => {
                const cancerInfo = cancerTypes.find(
                  (type) => type.id === cancer
                );
                const isSelected = cancer === selectedCancerType;
                return (
                  <Badge
                    key={index}
                    className={`text-xs ${
                      isSelected
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {cancerInfo?.icon} {cancerInfo?.name || cancer}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        <Separator />

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{doctor.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{doctor.experience}+ years experience</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span>${doctor.consultationFee} consultation fee</span>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={() => onBookAppointment(doctor)}
          disabled={!selectedCancerType}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book Appointment
        </Button>
      </CardContent>
    </Card>
  );
}
