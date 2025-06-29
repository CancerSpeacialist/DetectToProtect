"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Stethoscope,
  Save,
  History,
  User,
  Calendar,
  FileText,
  Eye,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cancerTypes, statusConfig, formatDate, formatDateTime } from "@/constants";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/lib/context/AuthContext";
import { getPatientProfile } from "@/lib/firebase/db";
import PatientHistoryModal from "@/components/doctor/diagnosis/PatientHistoryModal";
import QuickTemplates from "@/components/doctor/diagnosis/QuickTemplates";
import PatientInfoCard from "@/components/doctor/diagnosis/PatientInfoCard";

export default function DiagnosisInput() {
  const { user } = useAuth();
  const [selectedScreening, setSelectedScreening] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data states
  const [screenings, setScreenings] = useState([]);
  const [patients, setPatients] = useState({});
  const [selectedPatientHistory, setSelectedPatientHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDoctorScreenings();
    }
  }, [user]);

  const fetchDoctorScreenings = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch screenings for this doctor that don't have diagnosis yet
      const screeningsQuery = query(
        collection(db, "screening_history"),
        where("doctorId", "==", user.uid),
        // where("status", "==", "completed"),
        orderBy("createdAt", "desc")
      );

      const screeningsSnapshot = await getDocs(screeningsQuery);
      const screeningsData = screeningsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Get unique patient IDs
      const patientIds = [...new Set(screeningsData.map((s) => s.patientId))];

      // Fetch patient details
      const patientsData = {};
      for (const patientId of patientIds) {
        try {
          patientsData[patientId] = await getPatientProfile(patientId);
        } catch (error) {
          console.error(`Error fetching patient ${patientId}:`, error);
        }
      }

      setScreenings(screeningsData);
      setPatients(patientsData);
    } catch (error) {
      console.error("Error fetching screenings:", error);
      toast.error("Failed to load screenings");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientHistory = async (patientId) => {
    try {
      // Fetch all appointments for this patient
      const appointmentsQuery = query(
        collection(db, "appointments"),
        where("patientId", "==", patientId),
        orderBy("createdAt", "desc")
      );

      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      const appointments = appointmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch all screenings for this patient
      const screeningsQuery = query(
        collection(db, "screening_history"),
        where("patientId", "==", patientId),
        orderBy("createdAt", "desc")
      );

      const screeningsSnapshot = await getDocs(screeningsQuery);
      const screenings = screeningsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Get doctor details for appointments
      const doctorIds = [...new Set(appointments.map((a) => a.doctorId))];
      const doctorsData = {};

      for (const doctorId of doctorIds) {
        try {
          const doctorQuery = query(
            collection(db, "doctor"),
            where("uid", "==", doctorId)
          );
          const doctorSnapshot = await getDocs(doctorQuery);
          if (!doctorSnapshot.empty) {
            doctorsData[doctorId] = doctorSnapshot.docs[0].data();
          }
        } catch (error) {
          console.error(`Error fetching doctor ${doctorId}:`, error);
        }
      }

      // Combine and sort by date
      const history = [
        ...appointments.map((apt) => ({
          ...apt,
          type: "appointment",
          doctors: doctorsData,
        })),
        ...screenings.map((scr) => ({
          ...scr,
          type: "screening",
          doctors: doctorsData,
        })),
      ].sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );

      setSelectedPatientHistory(history);
      setShowHistoryModal(true);
    } catch (error) {
      console.error("Error fetching patient history:", error);
      toast.error("Failed to load patient history");
    }
  };

  const handleSaveDiagnosis = async () => {
    if (!selectedScreening || !diagnosis.trim()) {
      toast.error("Please select a screening and enter diagnosis");
      return;
    }

    try {
      setSaving(true);

      const screeningRef = doc(db, "screening_history", selectedScreening);
      await updateDoc(screeningRef, {
        doctorDiagnosis: diagnosis,
        status: "reviewed",
        updatedAt: new Date(),
      });

      toast.success("Diagnosis saved successfully");

      // Reset form
      setSelectedScreening("");
      setDiagnosis("");

      // Refresh screenings
      fetchDoctorScreenings();
    } catch (error) {
      console.error("Error saving diagnosis:", error);
      toast.error("Failed to save diagnosis");
    } finally {
      setSaving(false);
    }
  };

  const selectedScreeningData = screenings.find(
    (s) => s.id === selectedScreening
  );
  const selectedPatient = selectedScreeningData
    ? patients[selectedScreeningData.patientId]
    : null;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Stethoscope className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Patient Diagnosis
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Diagnosis Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Add Diagnosis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Screening Selection */}
                <div className="space-y-2">
                  <Label htmlFor="screening-select">Select Screening</Label>
                  <Select
                    value={selectedScreening}
                    onValueChange={setSelectedScreening}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a screening to diagnose..." />
                    </SelectTrigger>
                    <SelectContent>
                      {screenings.map((screening) => {
                        const patient = patients[screening.patientId];
                        const cancerType = cancerTypes.find(
                          (t) => t.id === screening.cancerType
                        );

                        return (
                          <SelectItem key={screening.id} value={screening.id}>
                            <div className="flex items-center gap-2">
                              <span>{cancerType?.icon}</span>
                              <span>
                                {patient
                                  ? `${patient.firstName} ${patient.lastName}`
                                  : "Unknown Patient"}{" "}
                                -{cancerType?.name} (
                                {formatDate(screening.createdAt)})
                              </span>
                              {screening.doctorDiagnosis && (
                                <Badge variant="outline" className="ml-2">
                                  Diagnosed
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Screening Details */}
                {selectedScreeningData && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Screening Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Classification:</span>
                          <Badge
                            className={
                              selectedScreeningData.classification === "Cancer"
                                ? "bg-red-100 text-red-800 ml-2"
                                : "bg-green-100 text-green-800 ml-2"
                            }
                          >
                            {selectedScreeningData.classification}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium">Confidence:</span>
                          <span className="ml-2">
                            {selectedScreeningData.confidence}%
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Screening Date:</span>
                          <span className="ml-2">
                            {formatDate(selectedScreeningData.createdAt)}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Current Status:</span>
                          <span className="ml-2 capitalize">
                            {selectedScreeningData.status}
                          </span>
                        </div>
                      </div>

                      {selectedScreeningData.doctorReview && (
                        <div className="mt-3">
                          <span className="font-medium">Previous Review:</span>
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedScreeningData.doctorReview}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Diagnosis Input */}
                <div className="space-y-2">
                  <Label htmlFor="diagnosis-notes">
                    Diagnosis & Treatment Plan
                  </Label>
                  <Textarea
                    id="diagnosis-notes"
                    placeholder="Enter your detailed diagnosis, treatment recommendations, follow-up instructions, and any additional notes..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="min-h-[300px] resize-none"
                  />
                  <p className="text-sm text-gray-500">
                    {diagnosis.length}/2000 characters
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleSaveDiagnosis}
                    disabled={!selectedScreening || !diagnosis.trim() || saving}
                    className="bg-blue-600 hover:bg-blue-700 gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save Diagnosis"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedScreening("");
                      setDiagnosis("");
                    }}
                  >
                    Clear Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Templates */}
            <QuickTemplates setDiagnosis={setDiagnosis} />

            {/* Patient Information */}
            {selectedPatient && (
              <PatientInfoCard
                patient={selectedPatient}
                onViewHistory={fetchPatientHistory}
              />
            )}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Screenings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {screenings.slice(0, 5).map((screening) => {
                    const patient = patients[screening.patientId];
                    const cancerType = cancerTypes.find(
                      (t) => t.id === screening.cancerType
                    );

                    return (
                      <div
                        key={screening.id}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex items-center gap-2">
                          <span>{cancerType?.icon}</span>
                          <div>
                            <p className="text-sm font-medium">
                              {patient
                                ? `${patient.firstName} ${patient.lastName}`
                                : "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(screening.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            screening.doctorDiagnosis
                              ? "border-green-500 text-green-700"
                              : "border-yellow-500 text-yellow-700"
                          }
                        >
                          {screening.doctorDiagnosis ? "Diagnosed" : "Pending"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Patient History Modal */}
        <PatientHistoryModal
          isOpen={showHistoryModal}
          onClose={setShowHistoryModal}
          patientHistory={selectedPatientHistory}
          patientName={
            selectedPatient
              ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
              : null
          }
        />
      </div>
    </div>
  );
}
