import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, User } from "lucide-react";
import { formatDate } from "@/constants";

export default function PatientInfoCard({ patient, onViewHistory }) {
  if (!patient) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Patient Information</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewHistory(patient.uid)}
        >
          <History className="w-4 h-4 mr-2" />
          View History
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="font-medium">
              {patient.firstName} {patient.lastName}
            </span>
          </div>
          <div>
            <span className="font-medium">Email:</span>
            <p className="text-gray-600">{patient.email}</p>
          </div>
          <div>
            <span className="font-medium">Phone:</span>
            <p className="text-gray-600">{patient.phoneNumber || "N/A"}</p>
          </div>
          <div>
            <span className="font-medium">Date of Birth:</span>
            <p className="text-gray-600">
              {patient.dateOfBirth ? formatDate(patient.dateOfBirth) : "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
