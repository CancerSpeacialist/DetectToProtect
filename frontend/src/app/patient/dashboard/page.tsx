// src/app/patient/dashboard/page.tsx
"use client";

import { useAuth } from "@/lib/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Camera,
  Bell,
  Heart,
  Shield,
  Zap,
  Target,
  Plus,
  Eye,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// Mock data - replace with real data
const mockData = {
  healthScore: 85,
  recentScans: 3,
  upcomingAppointments: 2,
  riskLevel: "Low",
  lastScanDate: "2025-06-15",
  nextAppointment: "2025-07-05",
};

const recentActivity = [
  {
    id: 1,
    type: "scan",
    title: "Lung Cancer Screening",
    date: "2025-06-20",
    status: "completed",
    result: "Normal",
  },
  {
    id: 2,
    type: "appointment",
    title: "Follow-up with Dr. Smith",
    date: "2025-06-18",
    status: "completed",
    result: "Scheduled next scan",
  },
  {
    id: 3,
    type: "scan",
    title: "Breast Cancer Screening",
    date: "2025-06-15",
    status: "completed",
    result: "Normal",
  },
];

const cancerScreenings = [
  {
    id: "brain-tumor",
    name: "Brain Tumor",
    icon: "🧠",
    description: "MRI/CT scan analysis",
    lastScan: "Never",
    status: "Due",
    color: "border-purple-200 hover:border-purple-300",
    bgColor: "bg-purple-50",
  },
  {
    id: "breast-cancer",
    name: "Breast Cancer",
    icon: "🎗️",
    description: "Mammography screening",
    lastScan: "2025-06-15",
    status: "Normal",
    color: "border-pink-200 hover:border-pink-300",
    bgColor: "bg-pink-50",
  },
  {
    id: "lung-cancer",
    name: "Lung Cancer",
    icon: "🫁",
    description: "Chest X-ray analysis",
    lastScan: "2025-06-20",
    status: "Normal",
    color: "border-green-200 hover:border-green-300",
    bgColor: "bg-green-50",
  },
  {
    id: "prostate-cancer",
    name: "Prostate Cancer",
    icon: "🔵",
    description: "PSA & imaging analysis",
    lastScan: "Never",
    status: "Recommended",
    color: "border-blue-200 hover:border-blue-300",
    bgColor: "bg-blue-50",
  },
];

export default function PatientDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Ready to monitor your health with AI-powered cancer detection
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{mockData.healthScore}%</div>
              <div className="text-sm text-blue-200">Health Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Overall Risk
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {mockData.riskLevel}
                </p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Recent Scans
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {mockData.recentScans}
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Health Score
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {mockData.healthScore}%
                </p>
              </div>
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">
                  Appointments
                </p>
                <p className="text-2xl font-bold text-orange-900">
                  {mockData.upcomingAppointments}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Cancer Screenings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Cancer Screenings
            </h2>
            <Button asChild>
              <Link href="/patient/screening">
                <Plus className="w-4 h-4 mr-2" />
                New Screening
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cancerScreenings.map((screening) => (
              <Card
                key={screening.id}
                className={`${screening.color} transition-all duration-200 hover:shadow-md`}
              >
                <CardContent className={`p-6 ${screening.bgColor}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{screening.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {screening.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {screening.description}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        screening.status === "Normal"
                          ? "default"
                          : screening.status === "Due"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {screening.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Scan:</span>
                      <span className="font-medium">{screening.lastScan}</span>
                    </div>

                    <Button asChild className="w-full" size="sm">
                      <Link href={`/patient/screening/${screening.id}`}>
                        <Camera className="w-4 h-4 mr-2" />
                        Start Screening
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {activity.type === "scan" ? (
                        <Camera className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Calendar className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.result}
                    </Badge>
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full mt-4" asChild>
                <Link href="/patient/activity">
                  View All Activity
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/patient/appointments">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Link>
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href="/patient/reports">
                  <FileText className="w-4 h-4 mr-2" />
                  View Reports
                </Link>
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href="/patient/emergency">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Emergency Contact
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Health Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Health Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 text-sm">
                    Stay Hydrated
                  </h4>
                  <p className="text-xs text-blue-700 mt-1">
                    Drink at least 8 glasses of water daily for optimal health.
                  </p>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 text-sm">
                    Regular Exercise
                  </h4>
                  <p className="text-xs text-green-700 mt-1">
                    30 minutes of moderate exercise can reduce cancer risk.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
