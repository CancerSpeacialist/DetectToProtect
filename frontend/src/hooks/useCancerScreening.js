"use client";

import { useState, useCallback, useRef } from "react";
import { useAuth } from "@/lib/context/AuthContext";

export function useCancerScreening(cancerType) {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  // Refs to track intervals and abort controllers
  const progressIntervalRef = useRef(null);
  const abortControllerRef = useRef(null);

  const clearProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const resetState = useCallback(() => {
    setIsUploading(false);
    setIsAnalyzing(false);
    setUploadProgress(0);
    setError(null);
    clearProgress();
  }, [clearProgress]);

  const handleFileSelect = useCallback((file) => {
    setSelectedFile(file);
    setAnalysisResult(null);
    setImageUrl(null);
    setError(null);
    setUploadProgress(0);
  }, []);

  const simulateProgress = useCallback(() => {
    let progress = 0;
    const increment = Math.random() * 15 + 5; // Random increment between 5-20%
    
    progressIntervalRef.current = setInterval(() => {
      progress += increment;
      
      if (progress >= 85) {
        setUploadProgress(85); // Stop at 85% until real response
        clearProgress();
      } else {
        setUploadProgress(Math.min(progress, 85));
      }
    }, 300 + Math.random() * 200); // Random interval between 300-500ms
  }, [clearProgress]);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile || !user) {
      setError("Please select a file and ensure you're logged in");
      return;
    }

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      resetState();
      setIsUploading(true);
      
      // Start progress simulation
      simulateProgress();

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("cancerType", cancerType);
      formData.append("patientId", user.uid);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      // Clear progress simulation and set to completion
      clearProgress();
      setUploadProgress(100);

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status ${uploadResponse.status}`);
      }

      const uploadData = await uploadResponse.json();
      setImageUrl(uploadData.imageUrl);
      setIsUploading(false);

      // Step 2: Analyze with ML model
      setIsAnalyzing(true);

      const analysisResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadData.imageUrl,
          patientId: user.uid,
          cancerType: cancerType,
          timestamp: new Date().toISOString(),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `Analysis failed with status ${analysisResponse.status}`);
      }

      const analysisData = await analysisResponse.json();
      setAnalysisResult(analysisData.result);
      setIsAnalyzing(false);

    } catch (error) {
      console.error("Screening error:", error);
      
      // Handle different error types
      if (error.name === 'AbortError') {
        setError("Upload was cancelled");
      } else if (error.message.includes('fetch')) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(error.message || "An unexpected error occurred");
      }

      resetState();
      
      // Set error state for analysis result
      setAnalysisResult({
        id: `error-${Date.now()}`,
        classification: "Error",
        confidence: 0,
        status: "error",
        error: error.message,
      });
    }
  }, [selectedFile, user, cancerType, simulateProgress, clearProgress, resetState]);

  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    resetState();
  }, [resetState]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    clearProgress();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, [clearProgress]);

  return {
    // State
    selectedFile,
    isUploading,
    isAnalyzing,
    uploadProgress,
    analysisResult,
    imageUrl,
    error,
    
    // Actions
    handleFileSelect,
    handleAnalyze,
    cancelUpload,
    cleanup,
    
    // Computed
    isProcessing: isUploading || isAnalyzing,
    canAnalyze: selectedFile && !isUploading && !isAnalyzing,
  };
}