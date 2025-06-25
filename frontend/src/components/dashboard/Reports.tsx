import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileText, Download, Eye } from "lucide-react";
import { toast } from "sonner";

export function Reports() {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [reportType, setReportType] = useState("");

  const patients = [
    { id: "P001", name: "John Doe" },
    { id: "P002", name: "Sarah Wilson" },
    { id: "P003", name: "Mike Johnson" },
    { id: "P004", name: "Emma Davis" },
    { id: "P005", name: "Robert Brown" },
  ];

  const reportTypes = [
    { value: "comprehensive", label: "Comprehensive Medical Report" },
    { value: "diagnosis", label: "Diagnosis Summary" },
    { value: "treatment", label: "Treatment Plan" },
    { value: "lab", label: "Lab Results Summary" },
    { value: "imaging", label: "Imaging Report" },
  ];

  const recentReports = [
    {
      id: "R001",
      patient: "John Doe",
      type: "Comprehensive",
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: "R002",
      patient: "Sarah Wilson",
      type: "Lab Results",
      date: "2024-01-14",
      status: "completed",
    },
    {
      id: "R003",
      patient: "Mike Johnson",
      type: "Imaging",
      date: "2024-01-12",
      status: "pending",
    },
    {
      id: "R004",
      patient: "Emma Davis",
      type: "Treatment Plan",
      date: "2024-01-10",
      status: "completed",
    },
  ];

  const handleGenerateReport = () => {
    if (!selectedPatient || !reportType) {
      toast("Missing Information", {
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
        description: "Please select both a patient and report type.",
      });
      return;
    }

    toast("Report Generated", {
      action: {
        label: "Close",
        onClick: () => console.log("Close"),
      },
      description: "The PDF report has been generated successfully.",
    });
  };

  const reportPreview =
    selectedPatient && reportType
      ? {
          title: `${reportTypes.find((r) => r.value === reportType)?.label} - ${
            patients.find((p) => p.id === selectedPatient)?.name
          }`,
          sections: [
            "Patient Demographics",
            "Medical History",
            "Current Diagnosis",
            "Treatment Plan",
            "Medications",
            "Follow-up Instructions",
          ],
        }
      : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Report Generation</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Patient</Label>
                <Select
                  value={selectedPatient}
                  onValueChange={setSelectedPatient}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a patient..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} ({patient.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose report type..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
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
                  onClick={handleGenerateReport}
                  className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Generate PDF Report
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Eye className="w-4 h-4" />
                  Preview Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{report.patient}</p>
                      <p className="text-sm text-gray-600">
                        {report.type} - {report.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          report.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {report.status}
                      </span>
                      {report.status === "completed" && (
                        <Button size="sm" variant="outline" className="gap-1">
                          <Download className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {!reportPreview ? (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Select a patient and report type to see preview
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900">
                      {reportPreview.title}
                    </h3>
                    <p className="text-sm text-blue-700">
                      Generated on {new Date().toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Report Sections:</h4>
                    <ul className="space-y-2">
                      {reportPreview.sections.map((section, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          {section}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      This report will include all relevant medical information,
                      diagnosis details, and treatment recommendations based on
                      the selected patient's current medical records.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
