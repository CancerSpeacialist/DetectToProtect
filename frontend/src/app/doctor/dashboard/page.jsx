"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  FileText,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { formatTime, getTimeAgo } from "@/constants";
import Loader from "@/components/ui/Loader";
import { toast } from "sonner";
import { getDoctorProfile, getPatientProfile } from "@/lib/firebase/db";
import { useAuth } from "@/lib/context/AuthContext";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    reportsGenerated: 0,
    pendingReviews: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch doctor info
      const doctorData = await getDoctorProfile(user.uid);
      setDoctorInfo(doctorData);

      // Get today's date range
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      // Fetch appointments
      let allAppointments = [];
      if (doctorData?.appointments?.length > 0) {
        const appointmentPromises = doctorData.appointments.map(
          async (appointmentId) => {
            try {
              const appointmentDoc = await getDoc(
                doc(db, "appointments", appointmentId)
              );
              if (appointmentDoc.exists()) {
                return {
                  id: appointmentDoc.id,
                  ...appointmentDoc.data(),
                };
              }
            } catch (error) {
              console.error(
                `Error fetching appointment ${appointmentId}:`,
                error
              );
            }
            return null;
          }
        );

        const appointmentResults = await Promise.all(appointmentPromises);
        allAppointments = appointmentResults.filter((apt) => apt !== null);

        // Sort by creation date
        allAppointments.sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );
      }

      // Filter today's appointments
      const todayAppts = allAppointments.filter((apt) => {
        if (!apt.appointmentDate) return false;

        // Handle both Firebase Timestamp and regular Date objects
        const aptDate = apt.appointmentDate.toDate
          ? apt.appointmentDate.toDate()
          : new Date(apt.appointmentDate);

        return aptDate >= startOfDay && aptDate < endOfDay;
      });

      // Fetch screening history (reports)
      const screeningsQuery = query(
        collection(db, "screening_history"),
        where("doctorId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const screeningsSnapshot = await getDocs(screeningsQuery);
      const allScreenings = screeningsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Count pending reviews (screenings without diagnosis)
      const pendingReviews = allScreenings.filter(
        (screening) =>
          !screening.doctorDiagnosis && screening.status === "completed"
      ).length;

      // Get unique patients
      const uniquePatients = new Set([
        ...allAppointments.map((apt) => apt.patientId),
        ...allScreenings.map((scr) => scr.patientId),
      ]);

      const uniquePatientIds = [
        ...new Set([
          ...allAppointments.map((apt) => apt.patientId),
          ...allScreenings.map((scr) => scr.patientId),
        ]),
      ].filter(Boolean);

      // Update stats
      setStats({
        totalPatients: uniquePatients.size,
        todayAppointments: todayAppts.length,
        reportsGenerated: allScreenings.length,
        pendingReviews: pendingReviews,
      });

      setTodayAppointments(todayAppts.slice(0, 5)); // Show only first 5

      // Fetch patient details
      const patients = {};
      for (const patientId of uniquePatientIds) {
        try {
          patients[patientId] = await getPatientProfile(patientId);
        } catch (error) {
          console.error(`Error fetching patient ${patientId}:`, error);
        }
      }

      // Create recent activity from appointments and screenings
      const activities = [];

      // Add recent appointments
      allAppointments.slice(0, 10).forEach((apt) => {
        const patient = patients[apt.patientId];
        const patientName = patient
          ? `${patient.firstName} ${patient.lastName}`
          : `Patient ${apt.patientId.substring(0, 8)}...`;

        activities.push({
          id: `apt-${apt.id}`,
          action: getActivityAction(apt.status, "appointment"),
          patient: patientName,
          time: getTimeAgo(apt.createdAt),
          status: apt.status,
          type: "appointment",
          createdAt: apt.createdAt,
        });
      });

      // Add recent screenings
      allScreenings.slice(0, 10).forEach((screening) => {
        const patient = patients[screening.patientId];
        const patientName = patient
          ? `${patient.firstName} ${patient.lastName}`
          : `Patient ${screening.patientId.substring(0, 8)}...`;

        activities.push({
          id: `scr-${screening.id}`,
          action: screening.doctorDiagnosis
            ? "Diagnosis completed"
            : "Screening analysis completed",
          patient: patientName,
          time: getTimeAgo(screening.createdAt),
          status: screening.doctorDiagnosis ? "diagnosed" : "analyzed",
          type: "screening",
          createdAt: screening.createdAt,
        });
      });

      // Sort by creation time and take recent 8
      activities.sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );
      setRecentActivity(activities.slice(0, 8));

      // Update today's appointments to show patient names
      const todayApptsWithNames = todayAppts.slice(0, 5).map((appointment) => {
        const patient = patients[appointment.patientId];
        return {
          ...appointment,
          patientName: patient
            ? `${patient.firstName} ${patient.lastName}`
            : `Patient ${appointment.patientId.substring(0, 8)}...`,
        };
      });

      setTodayAppointments(todayApptsWithNames);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getActivityAction = (status, type) => {
    if (type === "appointment") {
      switch (status) {
        case "pending":
          return "New appointment request";
        case "confirmed":
          return "Appointment confirmed";
        case "completed":
          return "Consultation completed";
        case "cancelled":
          return "Appointment cancelled";
        default:
          return "Appointment updated";
      }
    }
    return "Activity recorded";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getStatusBadge = (status, type) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      confirmed: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800", icon: AlertCircle },
      analyzed: { color: "bg-purple-100 text-purple-800", icon: FileText },
      diagnosed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return <Badge className={config.color}>{status}</Badge>;
  };

  if (loading) {
    return <Loader />;
  }

  const statsCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Reports Generated",
      value: stats.reportsGenerated,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Pending Reviews",
      value: stats.pendingReviews,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">
            {getGreeting()}, Dr.{" "}
            {doctorInfo
              ? `${doctorInfo.firstName} ${doctorInfo.lastName}`
              : "Doctor"}
          </h1>
          <p className="text-blue-100">
            Welcome back to your dashboard. You have {stats.todayAppointments}{" "}
            appointments scheduled for today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Updated now</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Recent Activity
              </CardTitle>
              <Button variant="outline" size="sm" onClick={fetchDashboardData}>
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activity.patient}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(activity.status, activity.type)}
                        <span className="text-sm text-gray-500">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {appointment.patientName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatTime(appointment.appointmentDate)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(appointment.status, "appointment")}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      No appointments scheduled for today
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
