"use client";

import { useState } from "react";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import DoctorHeader from "@/components/doctor/DoctorHeader";
import { useDoctorProfile } from "@/hooks/useDoctorProfile";
import CompleteDoctorProfile from "@/components/doctor/CompleteDoctorProfile";
import DoctorApprovalPending from "@/components/doctor/DoctorApprovalPending";
import Loader from "../ui/Loader";

export default function DoctorLayoutClient({ children }) {
  const { user, loading, signOut } = useRoleRedirect("doctor", {
    delay: 500, // Delay for 500ms before redirecting
    fallback: "/sign-in",
  });

  const { doctorProfile, profileLoading, refreshProfile } = useDoctorProfile(
    user?.uid
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show loading state
  if (loading || profileLoading) {
    return <Loader />;
  }

  // Redirect if not doctor
  if (!user || user.role !== "doctor") {
    return null;
  }

  if (!doctorProfile) {
    return null;
  }

  // Show profile completion if needed
  if (doctorProfile && !doctorProfile.profileCompleted) {
    return (
      <CompleteDoctorProfile doctorUid={user.uid} onSuccess={refreshProfile} />
    );
  }

  // Show approval pending if not approved
  if (doctorProfile?.profileCompleted && !doctorProfile?.isApproved) {
    return <DoctorApprovalPending user={user} signOut={signOut} />;
  }

  return (
    <>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <DoctorHeader
          user={user}
          doctorProfile={doctorProfile}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          signOut={signOut}
        />
      </div>
      <div className="flex min-h-screen bg-gray-50 pt-16">
        {" "}
        {/* pt-16 for header height */}
        {/* Fixed Sidebar */}
        <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] z-30">
          <DoctorSidebar
            user={user}
            doctorProfile={doctorProfile}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 overflow-auto">{children}</main>
      </div>
    </>
  );
}
