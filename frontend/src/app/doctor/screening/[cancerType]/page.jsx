"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/lib/context/AuthContext";
import {
  getAppointmentAndPatientById,
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
      if (appointment) setAppointment(appointment);
      if (patient) setPatient(patient);
    } catch (error) {
      console.error("Error fetching appointment data:", error);
      toast.error("Failed to load appointment details");
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  // const handleFileSelect = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     if (file.type.startsWith("image/")) {
  //       setScreeningForm((prev) => ({
  //         ...prev,
  //         selectedFile: file,
  //         previewUrl: URL.createObjectURL(file),
  //       }));
  //     } else {
  //       toast.error("Please select a valid image file");
  //     }
  //   }
  // };

  // have to do by PDF Comoponents
  const generatePDFReport = async (screeningData) => {
    // Simulate PDF generation - replace with actual PDF service
    try {
      const mockPdfUrl = `https://res.cloudinary.com/your-cloud/raw/upload/v1/reports/screening_${Date.now()}.pdf`;
      return mockPdfUrl;
    } catch (error) {
      console.error("PDF generation error:", error);
      throw new Error("Failed to generate PDF report");
    }
  };

  // has to do by API
  const processWithAI = async (imageUrl) => {
    // Simulate AI processing - replace with actual AI service call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock AI results - replace with actual AI API call
        const mockResults = {
          classification: Math.random() > 0.5 ? "Malignant" : "Benign",
          confidence: Math.floor(Math.random() * 30) + 70, // 70-99%
          additionalFindings: [
            "Irregular mass detected in upper quadrant",
            "Increased vascular activity observed",
            "Tissue density appears abnormal",
          ],
          resultImageUrl: imageUrl,
        };
        resolve(mockResults);
      }, 3000);
    });
  };

  const handleAnalyze = async (abortController) => {
    if (!screeningForm.selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    setProcessing(true);
    setUploadProgress(0);

    try {
      // Step 1: Upload input image to Cloudinary
      setUploadProgress(25);
      setIsUploading(true);
      const inputImageUrl = await uploadScreeningImageToCloudinary({
        file: screeningForm.selectedFile,
        cancerType,
        abortController,
      });
      setIsUploading(false);

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
      setIsUploading(false);
      console.error("Analysis error:", error);
      toast.error(error.message || "Analysis failed");
    } finally {
      setProcessing(false);
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

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
        resultImageUrl: aiResults.resultImageUrl,
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

  const cancerInfo = cancerTypes.find((type) => type.key === cancerType);

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
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            handleAnalyze={handleAnalyze}
            setUploadProgress={setUploadProgress}
            setProcessing={setProcessing}
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
