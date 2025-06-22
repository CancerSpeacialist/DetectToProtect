"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getDoctorProfile } from "@/lib/firebase/db";
import { DoctorProfile } from "@/lib/types/auth";
import CompleteDoctorProfile from "@/components/doctor/CompleteDoctorProfile";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(
    null
  );
  const [profileLoading, setProfileLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to load doctor profile
  const loadDoctorProfile = async () => {
    if (!user || user.role !== "doctor") return;

    try {
      setProfileLoading(true);

      const profile = await getDoctorProfile(user.uid);

      setDoctorProfile(profile);
    } catch (error) {
      console.error("Error loading doctor profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    } else if (!loading && user && user.role !== "doctor") {
      router.push("/patient/dashboard");
    } else if (user && user.role === "doctor") {
      loadDoctorProfile();
    }
  }, [user, loading, router, refreshTrigger]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "doctor") {
    return null;
  }

  // If doctor profile is incomplete, show completion form
  if (doctorProfile && !doctorProfile.profileCompleted) {
    return (
      <CompleteDoctorProfile
        doctorUid={user.uid}
        onSuccess={() => {
          console.log("Profile completion success callback triggered"); // Debug log
          // Force refresh by updating the trigger
          setRefreshTrigger((prev) => prev + 1);
        }}
      />
    );
  }

  // If doctor is not approved yet, show pending message
  if (
    doctorProfile &&
    doctorProfile.profileCompleted &&
    !doctorProfile.isApproved
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Account Under Review
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for completing your profile, Dr. {user.firstName}. Your
              account is currently under admin review. You'll receive email
              notification once approved.
            </p>
            <div className="text-sm text-gray-500 mb-4">
              Profile Status: ✅ Completed | Approval Status: ⏳ Pending
            </div>
            <Button onClick={signOut} variant="outline" className="w-full">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">
              Detect to Protect - Doctor Portal
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Dr. {user.firstName} {user.lastName}
              </span>
              <Button onClick={signOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
