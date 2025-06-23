// src/app/patient/layout.tsx
"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import PatientNavbar from "@/components/patient/PatientNavbar";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/sign-in");
      } else if (user.role !== "patient") {
        switch (user.role) {
          case "doctor":
            router.push("/doctor/dashboard");
            break;
          // case "admin":
          //   router.push("/admin/dashboard");
          //   break;
          default:
            router.push("/sign-in");
        }
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
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