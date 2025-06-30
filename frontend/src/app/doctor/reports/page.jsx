"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { db } from "@/lib/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";
import ReportGenerator from "@/components/doctor/reports/ReportGenerator";
import RecentReports from "@/components/doctor/reports/RecentReports";
import ReportPreview from "@/components/doctor/reports/ReportPreview";

export default function ReportsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [reportType, setReportType] = useState("");
  const [generating, setGenerating] = useState(false);
  const [filteredPatientName, setFilteredPatientName] = useState("");
  const [selectedReportForPreview, setSelectedReportForPreview] =
    useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchPatients(), fetchRecentReports()]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      // Get doctor's appointments to find patients
      const appointmentsQuery = query(
        collection(db, "appointments"),
        where("doctorId", "==", user.uid)
      );
      const appointmentsSnapshot = await getDocs(appointmentsQuery);

      // Get unique patient IDs
      const patientIds = [
        ...new Set(
          appointmentsSnapshot.docs.map((doc) => doc.data().patientId)
        ),
      ];

      // Fetch patient details
      const patientDetails = [];
      for (const patientId of patientIds) {
        try {
          const patientDoc = await getDoc(doc(db, "patients", patientId));
          if (patientDoc.exists()) {
            patientDetails.push({
              id: patientId,
              ...patientDoc.data(),
            });
          }
        } catch (error) {
          console.error(`Error fetching patient ${patientId}:`, error);
        }
      }

      setPatients(patientDetails);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchRecentReports = async () => {
    try {
      // Fetch screening history as reports
      const reportsQuery = query(
        collection(db, "screening_history"),
        where("doctorId", "==", user.uid),
        where("reportPdfUrl", "!=", ""),
        orderBy("reportPdfUrl"),
        orderBy("createdAt", "desc")
      );

      const reportsSnapshot = await getDocs(reportsQuery);
      const reports = [];

      for (const reportDoc of reportsSnapshot.docs) {
        const reportData = reportDoc.data();

        // Get patient name
        let patientName = "Unknown Patient";
        try {
          const patientDoc = await getDoc(
            doc(db, "patients", reportData.patientId)
          );
          if (patientDoc.exists()) {
            const patient = patientDoc.data();
            patientName = `${patient.firstName} ${patient.lastName}`;
          }
        } catch (error) {
          console.error("Error fetching patient name:", error);
        }

        reports.push({
          id: reportDoc.id,
          patientName,
          type: getReportType(reportData.cancerType),
          date:
            reportData.createdAt?.toDate()?.toLocaleDateString() || "Unknown",
          status: reportData.status,
          reportUrl: reportData.reportPdfUrl,
          ...reportData,
        });
      }

      setRecentReports(reports);
    } catch (error) {
      console.error("Error fetching recent reports:", error);
    }
  };

  const getReportType = (cancerType) => {
    const types = {
      "breast-cancer": "Breast Cancer Screening",
      "lung-cancer": "Lung Cancer Screening",
      "skin-cancer": "Skin Cancer Analysis",
      "brain-tumor": "Brain Tumor Analysis",
      "prostate-cancer": "Prostate Cancer Screening",
      "pancreatic-cancer": "Pancreatic Cancer Screening",
      "liver-cancer": "Liver Cancer Screening",
      "esophagus-cancer": "Esophagus Cancer Screening",
    };
    return types[cancerType] || "Medical Report";
  };

  // const handleGenerateReport = async () => {
  //   if (!selectedPatient) {
  //     toast.error("Please select a patient");
  //     return;
  //   }

  //   try {
  //     setGenerating(true);

  //     // Get patient data
  //     const selectedPatientData = patients.find(p => p.id === selectedPatient);

  //     // Build Firestore query
  //     let patientReportsQuery;
  //     if (reportType) {
  //       patientReportsQuery = query(
  //         collection(db, "screening_history"),
  //         where("patientId", "==", selectedPatient),
  //         where("doctorId", "==", user.uid),
  //         where("cancerType", "==", reportType),
  //         orderBy("createdAt", "desc")
  //       );
  //     } else {
  //       patientReportsQuery = query(
  //         collection(db, "screening_history"),
  //         where("patientId", "==", selectedPatient),
  //         where("doctorId", "==", user.uid),
  //         orderBy("createdAt", "desc")
  //       );
  //     }

  //     const reportsSnapshot = await getDocs(patientReportsQuery);
  //     const patientReports = [];

  //     for (const reportDoc of reportsSnapshot.docs) {
  //       const reportData = reportDoc.data();

  //       patientReports.push({
  //         id: reportDoc.id,
  //         patientName: selectedPatientData
  //           ? `${selectedPatientData.firstName} ${selectedPatientData.lastName}`
  //           : "Unknown Patient",
  //         type: getReportType(reportData.cancerType),
  //         date: reportData.createdAt?.toDate()?.toLocaleDateString() || "Unknown",
  //         status: reportData.status,
  //         reportUrl: reportData.reportPdfUrl,
  //         classification: reportData.classification,
  //         confidence: reportData.confidence,
  //         doctorReview: reportData.doctorReview,
  //         doctorDiagnosis: reportData.doctorDiagnosis,
  //         cancerType: reportData.cancerType,
  //         ...reportData
  //       });
  //     }

  //     if (patientReports.length === 0) {
  //       toast.info(
  //         `No reports found for ${
  //           selectedPatientData
  //             ? `${selectedPatientData.firstName} ${selectedPatientData.lastName}`
  //             : "selected patient"
  //         }${reportType ? ` (${getReportType(reportType)})` : ""}`
  //       );
  //       setRecentReports([]); // Clear reports if none found
  //       return;
  //     }

  //     setRecentReports(patientReports);
  //     toast.success(
  //       `Found ${patientReports.length} report(s) for ${
  //         selectedPatientData
  //           ? `${selectedPatientData.firstName} ${selectedPatientData.lastName}`
  //           : "selected patient"
  //       }${reportType ? ` (${getReportType(reportType)})` : ""}`
  //     );
  //   } catch (error) {
  //     console.error("Error fetching patient reports:", error);
  //     toast.error("Failed to fetch patient reports");
  //   } finally {
  //     setGenerating(false);
  //   }
  // };

  const handleGenerateReport = async () => {
    if (!selectedPatient) {
      toast.error("Please select a patient");
      return;
    }

    try {
      setGenerating(true);
      setShowPreview(false); // Hide preview when loading new reports

      // Get patient data
      const selectedPatientData = patients.find(
        (p) => p.id === selectedPatient
      );

      // Build Firestore query
      let patientReportsQuery;
      if (reportType) {
        patientReportsQuery = query(
          collection(db, "screening_history"),
          where("patientId", "==", selectedPatient),
          where("doctorId", "==", user.uid),
          where("cancerType", "==", reportType),
          orderBy("createdAt", "desc")
        );
      } else {
        patientReportsQuery = query(
          collection(db, "screening_history"),
          where("patientId", "==", selectedPatient),
          where("doctorId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
      }

      const reportsSnapshot = await getDocs(patientReportsQuery);
      const patientReports = [];

      for (const reportDoc of reportsSnapshot.docs) {
        const reportData = reportDoc.data();

        patientReports.push({
          id: reportDoc.id,
          patientName: selectedPatientData
            ? `${selectedPatientData.firstName} ${selectedPatientData.lastName}`
            : "Unknown Patient",
          type: getReportType(reportData.cancerType),
          date:
            reportData.createdAt?.toDate()?.toLocaleDateString() || "Unknown",
          status: reportData.status,
          reportUrl: reportData.reportPdfUrl,
          classification: reportData.classification,
          confidence: reportData.confidence,
          doctorReview: reportData.doctorReview,
          doctorDiagnosis: reportData.doctorDiagnosis,
          cancerType: reportData.cancerType,
          ...reportData,
        });
      }

      if (patientReports.length === 0) {
        toast.info(
          `No reports found for ${
            selectedPatientData
              ? `${selectedPatientData.firstName} ${selectedPatientData.lastName}`
              : "selected patient"
          }${reportType ? ` (${getReportType(reportType)})` : ""}`
        );
        setRecentReports([]);
        setFilteredPatientName("");
        return;
      }

      setRecentReports(patientReports);
      setFilteredPatientName(
        selectedPatientData
          ? `${selectedPatientData.firstName} ${selectedPatientData.lastName}`
          : "Selected Patient"
      );

      toast.success(
        `Found ${patientReports.length} report(s) for ${
          selectedPatientData
            ? `${selectedPatientData.firstName} ${selectedPatientData.lastName}`
            : "selected patient"
        }${reportType ? ` (${getReportType(reportType)})` : ""}`
      );
    } catch (error) {
      console.error("Error fetching patient reports:", error);
      toast.error("Failed to fetch patient reports");
    } finally {
      setGenerating(false);
    }
  };

  const handlePreviewReport = (report) => {
    setSelectedReportForPreview(report);
    setShowPreview(true);
  };

  const handleShowAllReports = async () => {
    setFilteredPatientName("");
    setShowPreview(false);
    setSelectedReportForPreview(null);
    await fetchRecentReports(); // Reset to all doctor's reports
  };

  const handleDownloadReport = (reportUrl) => {
    if (reportUrl) {
      window.open(reportUrl, "_blank");
    } else {
      toast.error("Report not available for download");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Report Management
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ReportGenerator
              patients={patients}
              selectedPatient={selectedPatient}
              setSelectedPatient={setSelectedPatient}
              reportType={reportType}
              setReportType={setReportType}
              onGenerateReport={handleGenerateReport}
              generating={generating}
            />

            <RecentReports
              reports={recentReports}
              onDownloadReport={handleDownloadReport}
              onPreviewReport={handlePreviewReport}
              filteredPatientName={filteredPatientName}
              onShowAllReports={handleShowAllReports}
            />
          </div>

          {showPreview ? (
            <ReportPreview
              report={selectedReportForPreview}
              onClose={() => setShowPreview(false)}
            />
          ) : (
            <div className="flex items-center justify-center min-h-[400px] bg-white rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Click "Preview" on any report to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
