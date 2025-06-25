"use client";

import { useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { signInSchema } from "@/lib/validations/auth";

export function useSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { signIn } = useAuth();

  const validateForm = (data) => {
    try {
      signInSchema.parse(data);
      setFieldErrors({});
      return true;
    } catch (error) {
      if (error.errors) {
        const errors = {};
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setFieldErrors(errors);
      }
      return false;
    }
  };

  const handleSignIn = async (formData) => {
    setError("");

    if (!validateForm(formData)) {
      return { success: false };
    }

    try {
      setLoading(true);
      await signIn(formData.email, formData.password);
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || "Failed to sign in";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Optional: If you want to handle sign-in via API route instead of direct Firebase
  const handleSignInwithAPI = async (formData) => {
    setError("");

    if (!validateForm(formData)) {
      return { success: false };
    }

    try {
      setLoading(true);

      // Call your API route instead of direct Firebase
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      // Trigger context update manually or refresh the page
      window.location.reload(); // Simple approach

      return { success: true, user: data.user };
    } catch (error) {
      const errorMessage = error.message || "Failed to sign in";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  
  return {
    loading,
    error,
    fieldErrors,
    signIn: handleSignIn,
    clearError: () => setError(""),
    clearFieldErrors: () => setFieldErrors({}),
  };
}
