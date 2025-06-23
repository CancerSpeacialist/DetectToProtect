"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Button
} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  LogOut,
  Settings,
  User,
  Calendar,
  FileText,
  Image,
  Stethoscope,
  Users,
  BarChart3,
  Loader2,
} from "lucide-react";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { getDoctorProfile } from "@/lib/firebase/db";
import { DoctorProfile } from "@/lib/types/auth";
import CompleteDoctorProfile from "@/components/doctor/CompleteDoctorProfile";

const menuItems = [
  { title: "Dashboard", icon: BarChart3, key: "dashboard" },
  { title: "Patient Management", icon: Users, key: "patients" },
  { title: "Image Analysis", icon: Image, key: "images" },
  { title: "Diagnosis Input", icon: Stethoscope, key: "diagnosis" },
  { title: "Reports", icon: FileText, key: "reports" },
  { title: "Consultations", icon: Calendar, key: "consultations" },
];

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentPage, setCurrentPage] = useState("dashboard");

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

  if (!user || user.role !== "doctor") return null;

  if (doctorProfile && !doctorProfile.profileCompleted) {
    return (
      <CompleteDoctorProfile
        doctorUid={user.uid}
        onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
      />
    );
  }

  if (doctorProfile?.profileCompleted && !doctorProfile.isApproved) {
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
              account is currently under admin review. You'll receive an email once approved.
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

  // ✅ MAIN DASHBOARD RENDERED HERE
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="border-r border-gray-200">
          <SidebarContent>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-blue-600">HealthAI</h2>
            </div>
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-600 font-medium px-6 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        onClick={() => setCurrentPage(item.key)}
                        className={`mx-2 ${currentPage === item.key ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Topbar & Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold text-gray-800">
                  Doctor Dashboard – {menuItems.find(i => i.key === currentPage)?.title}
                </h1>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg" alt="Dr. Smith" />
                      <AvatarFallback className="bg-blue-100 text-blue-600">DS</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border border-gray-200" align="end">
                  <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-50">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-50">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                    onClick={signOut}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
