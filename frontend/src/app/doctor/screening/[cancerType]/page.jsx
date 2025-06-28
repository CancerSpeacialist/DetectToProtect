"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/lib/context/AuthContext";
import {
  getAppointmentAndPatientById,
  getDoctorProfile,
  saveScreeningResultAndUpdateAppointment,
} from "@/lib/firebase/db";
import { uploadScreeningImageToCloudinary } from "@/lib/cloudinary/cloudinary";
import { cancerTypes } from "@/constants";
import AppointmentContextCard from "@/components/doctor/screening/AppointmentContextCard";
import AnalysisGuidelines from "@/components/doctor/screening/AnalysisGuidelines";
import ImageUploadBox from "@/components/doctor/screening/ImageUploadBox";
import ResultsModal from "@/components/doctor/screening/ResultsModal";
import CancerHeader from "@/components/doctor/screening/CancerHeader";

export default function CancerScreening() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const cancerType = params.cancerType;
  const appointmentId = searchParams.get("appointmentId");

  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [doctor, setdoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // File upload states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processing, setProcessing] = useState(false);

  const [resultsSaved, setResultsSaved] = useState(false);
  const [screeningForm, setScreeningForm] = useState({
    selectedFile: null,
    previewUrl: null,
    doctorReview: "",
    additionalFindings: [],
    status: "completed",
  });

  const [saving, setSaving] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);

  useEffect(() => {
    if (appointmentId && user) {
      fetchAppointmentData();
    } else if (user) {
      setLoading(false);
    }
  }, [appointmentId, user]);

  // fetch appointment and patient data
  const fetchAppointmentData = async () => {
    try {
      const { appointment, patient } = await getAppointmentAndPatientById(
        appointmentId
      );
      const doc = await getDoctorProfile(user.uid);
      if (doc) setdoctor(doc);
      if (appointment) setAppointment(appointment);
      if (patient) setPatient(patient);
    } catch (error) {
      console.error("Error fetching appointment data:", error);
      toast.error("Failed to load appointment details");
    } finally {
      setLoading(false);
    }
  };

  const generatePDFReport = async ({
    inputImageUrl,
    aiResults,
    cancerType,
    patient,
    appointment,
    doctor,
  }) => {
    try {
      // 1. Generate PDF via API
      const pdfRes = await fetch("/api/generatePdfReport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputImageUrl,
          resultImageUrl: aiResults.resultImageUrl || "",
          aiResults,
          cancerType,
          patient,
          appointment,
          doctor,
        }),
      });

      if (!pdfRes.ok) {
        throw new Error("Failed to generate PDF report");
      }

      // 2. Get PDF as Blob
      const pdfBlob = await pdfRes.blob();

      // 3. Upload PDF to Cloudinary via API
      const formData = new FormData();
      formData.append("file", pdfBlob, `screening_report_${Date.now()}.pdf`);

      const uploadRes = await fetch("/api/uploadPdfToCloudinary", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload PDF report");
      }

      const { url: reportPdfUrl } = await uploadRes.json();

      return reportPdfUrl;
    } catch (error) {
      console.error("PDF generation/upload error:", error);
      throw new Error("Failed to generate and upload PDF report");
    }
  };

  // Process image with AI Model
  const processWithAI = async (imageUrl) => {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl,
        patientId: user.uid,
        cancerType: cancerType,
        timestamp: new Date().toISOString(),
      }),
      signal: abortControllerRef.current.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Analysis failed with status ${response.status}`
      );
    }

    const analysisData = await response.json();
    return analysisData.result;
  };

  const abortControllerRef = useRef(null);

  // Cancel upload handler
  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setUploadProgress(0);
    setProcessing(false);
    setScreeningForm((prev) => ({
      ...prev,
      selectedFile: null,
      previewUrl: null,
    }));
  };

  const handleFileSelect = (file) => {
    setScreeningForm((prev) => ({
      ...prev,
      selectedFile: file,
      previewUrl: file ? URL.createObjectURL(file) : null,
    }));
    setUploadProgress(0);
  };

  const handleAnalyze = useCallback(async () => {
    if (!screeningForm.selectedFile || !user) {
      setAiResults(null);
      toast.error("Please select an image first");
      return;
    }
    abortControllerRef.current = new AbortController();
    setUploadProgress(0);

    try {
      // Step 1: Upload input image to Cloudinary
      setProcessing(true);
      setUploadProgress(25);
      const inputImageUrl = await uploadScreeningImageToCloudinary({
        file: screeningForm.selectedFile,
        cancerType,
        abortController: abortControllerRef.current,
      });

      // Step 2: Process with AI
      setUploadProgress(50);
      const aiResults = await processWithAI(inputImageUrl);

      // Step 3: Generate PDF report
      setUploadProgress(75);
      const reportPdfUrl = await generatePDFReport({
        inputImageUrl,
        aiResults,
        cancerType,
        patient,
        appointment,
        doctor,
      });

      setUploadProgress(100);

      setAiResults({
        ...aiResults,
        inputImageUrl,
        reportPdfUrl,
      });

      setShowResultsModal(true);
      toast.success("Analysis completed successfully!");
    } catch (error) {
      setAiResults(null);
      console.error("Analysis error:", error);

      if (error.name === "AbortError") {
        setError("Upload was cancelled");
        toast.error(error.message || "Upload was cancelled");
      } else if (error.message.includes("fetch")) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        toast.error(error.message || "Analysis failed");
      }
    } finally {
      setProcessing(false);
      setUploadProgress(0);
    }
  }, [
    screeningForm.selectedFile,
    user,
    cancerType,
    patient,
    appointment,
    generatePDFReport,
    processWithAI,
  ]);

  const handleSaveScreening = async () => {
    if (!aiResults) {
      toast.error("No analysis results to save");
      return;
    }

    setSaving(true);

    try {
      // Save to screening_history collection
      const screeningData = {
        appointmentId: appointmentId || null,
        patientId: appointment?.patientId || null,
        doctorId: user.uid,
        cancerType,
        inputImageUrl: aiResults.inputImageUrl,
        resultImageUrl: aiResults.resultImageUrl || "",
        classification: aiResults.classification,
        confidence: aiResults.confidence,
        reportPdfUrl: aiResults.reportPdfUrl,
        aiModelVersion: aiResults.modelVersion || "not_specified",
        additionalFindings: aiResults.additionalFindings || [],
        doctorReview: screeningForm.doctorReview,
        status: screeningForm.status,
      };

      await saveScreeningResultAndUpdateAppointment(screeningData);

      toast.success("Screening results saved successfully!");
      setShowResultsModal(false);
      setResultsSaved(true);
      // Redirect to appointments or ask user
      // setTimeout(() => {
      //   router.push("/doctor/appointments");
      // }, 2000);
    } catch (error) {
      console.error("Error saving screening:", error);
      toast.error("Failed to save screening results");
    } finally {
      setSaving(false);
    }
  };

  const cancerInfo = cancerTypes.find((type) => type.id === cancerType);

  if (loading) {
    return <Loader />;
  }

  if (!cancerInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Cancer Type
          </h2>
          <p className="text-gray-600">
            The specified cancer type is not supported.
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}

        <CancerHeader cancerInfo={cancerInfo} />

        {/* Appointment Context (if linked) */}
        <AppointmentContextCard appointment={appointment} patient={patient} />

        {/* Image Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ImageUploadBox
            screeningForm={screeningForm}
            setScreeningForm={setScreeningForm}
            processing={processing}
            uploadProgress={uploadProgress}
            handleAnalyze={handleAnalyze}
            handleFileSelect={handleFileSelect}
            handleCancel={handleCancel}
          />

          {/* Analysis Guidelines */}
          <AnalysisGuidelines />
        </div>
        {!resultsSaved && aiResults && (
          <div className="flex justify-end mt-6 ">
            <Button
              variant="outline"
              onClick={() => setShowResultsModal((prev) => !prev)}
            >
              {showResultsModal ? "Hide Results" : "Show Results"}
            </Button>
          </div>
        )}
        <ResultsModal
          open={showResultsModal}
          onOpenChange={setShowResultsModal}
          aiResults={aiResults}
          screeningForm={screeningForm}
          setScreeningForm={setScreeningForm}
          saving={saving}
          handleSaveScreening={handleSaveScreening}
        />
      </div>
    </div>
  );
}
