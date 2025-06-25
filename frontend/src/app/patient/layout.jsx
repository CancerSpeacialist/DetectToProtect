// src/app/patient/layout.tsx
"use client";

import { Loader2 } from "lucide-react";
import PatientNavbar from "@/components/patient/PatientNavbar";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";
import Loader from "@/components/ui/Loader";

export default function PatientLayout({ children }) {
   const { user, loading, redirecting } = useRoleRedirect(null, {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
      <PatientNavbar />
      <main className="pt-16">{children}</main>
    </div>
  );
}
