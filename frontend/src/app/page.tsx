"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, redirect to appropriate dashboard
        switch (user.role) {
          case "patient":
            router.push("/patient/dashboard");
            break;
          case "doctor":
            router.push("/doctor/dashboard");
            break;
          // case "admin":
          //   router.push("/admin/dashboard");
          //   break;
          default:
            router.push("/sign-in");
        }
      } else {
        // User not authenticated, show landing page or redirect to sign in
        router.push("/sign-in");
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

  return null;
}
