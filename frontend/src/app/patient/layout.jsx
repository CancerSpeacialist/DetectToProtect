// src/app/patient/layout.tsx
"use client";

import PatientNavbar from "@/components/patient/PatientNavbar";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";
import Loader from "@/components/ui/Loader";
import MedicalChatbot from "@/components/patient/chatbot/MedicalChatbot";

export default function PatientLayout({ children }) {
  const { user, loading } = useRoleRedirect("patient", {
    delay: 500,
    fallback: "/sign-in",
  });

  if (loading) {
    return <Loader />;
  }

  if (!user || user.role !== "patient") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-500">
      <PatientNavbar />
      <main className="pt-16">
        {children}

        {/* Add the floating chatbot */}
        <MedicalChatbot />
      </main>
    </div>
  );
}
