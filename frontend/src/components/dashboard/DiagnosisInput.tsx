import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Stethoscope, Save } from "lucide-react";
import { toast } from "sonner";

export function DiagnosisInput() {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [notes, setNotes] = useState("");

  const patients = [
    { id: "P001", name: "John Doe" },
    { id: "P002", name: "Sarah Wilson" },
    { id: "P003", name: "Mike Johnson" },
    { id: "P004", name: "Emma Davis" },
    { id: "P005", name: "Robert Brown" },
  ];

  const handleSave = () => {
    if (!selectedPatient || !notes.trim()) {
      toast("Missing Information", {
        description: "Please select a patient and add diagnosis notes.",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      });
      return;
    }

    toast("Diagnosis Saved", {
      description:
        "The diagnosis has been successfully saved to the patient's record.",
      action: {
        label: "Close",
        onClick: () => console.log("Close"),
      },
    });

    // Reset form
    setSelectedPatient("");
    setNotes("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Stethoscope className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Diagnosis Input</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Patient Diagnosis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="patient-select">Select Patient</Label>
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
                <Label htmlFor="diagnosis-notes">
                  Doctor's Notes & Diagnosis
                </Label>
                <Textarea
                  id="diagnosis-notes"
                  placeholder="Enter your diagnosis, observations, treatment plan, and recommendations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[300px] resize-none"
                />
                <p className="text-sm text-gray-500">
                  {notes.length}/1000 characters
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Diagnosis
                </Button>
                <Button variant="outline">Save as Draft</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() =>
                  setNotes("Patient presents with symptoms consistent with...")
                }
              >
                General Consultation
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => setNotes("Follow-up examination shows...")}
              >
                Follow-up Visit
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() =>
                  setNotes("Preventive care assessment indicates...")
                }
              >
                Preventive Care
              </Button>
            </CardContent>
          </Card>

          {selectedPatient && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Patient History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Last Visit:</span>
                    <p className="text-gray-600">
                      Jan 15, 2024 - Routine checkup
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Allergies:</span>
                    <p className="text-gray-600">Penicillin, Latex</p>
                  </div>
                  <div>
                    <span className="font-medium">Current Medications:</span>
                    <p className="text-gray-600">
                      Lisinopril 10mg, Metformin 500mg
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
