import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Loader2 } from "lucide-react";

const reportTypes = [
  { value: "breast-cancer", label: "Breast Cancer Screening" },
  { value: "lung-cancer", label: "Lung Cancer Screening" },
  { value: "skin-cancer", label: "Skin Cancer Analysis" },
  { value: "brain-tumor", label: "Brain Tumor Analysis" },
  { value: "prostate-cancer", label: "Prostate Cancer Screening" },
  { value: "pancreatic-cancer", label: "Pancreatic Cancer Screening" },
  { value: "liver-cancer", label: "Liver Cancer Screening" },
  { value: "esophagus-cancer", label: "Esophagus Cancer Screening" },
];

export default function ReportGenerator({
  patients,
  selectedPatient,
  setSelectedPatient,
  reportType,
  setReportType,
  onGenerateReport,
  generating,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>View Patient Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select Patient</Label>
          <Select value={selectedPatient} onValueChange={setSelectedPatient}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a patient..." />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName} ({patient.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Filter by Report Type (Optional)</Label>
          <Select
            value={reportType}
            onValueChange={(value) =>
              setReportType(value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All report types..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Report Types</SelectItem>
              {reportTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 space-y-3">
          <Button
            onClick={onGenerateReport}
            disabled={!selectedPatient || generating}
            className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
          >
            {generating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            {generating ? "Loading Reports..." : "View Patient Reports"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
