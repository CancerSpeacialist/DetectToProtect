"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  CheckCircle,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/context/AuthContext";
import Loader from "@/components/ui/Loader";
import AppointmentDetails from "@/components/patient/dashboard/AppointmentDetails";
import MedicalReportsList from "@/components/patient/dashboard/MedicalReportsList";
import ScreeningHistoryList from "@/components/patient/dashboard/ScreeningHistoryList";
import AppointmentsList from "@/components/patient/dashboard/AppointmentsList";
import StatsCard from "@/components/patient/dashboard/StatsCard";
import { getDoctorProfile, getPatientProfile } from "@/lib/firebase/db";
import FilterComponent from "@/components/patient/dashboard/FilterComponent";
import { cancerTypes } from "@/constants";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [screeningHistory, setScreeningHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // filter states
  const [appointmentFilters, setAppointmentFilters] = useState({});
  const [screeningFilters, setScreeningFilters] = useState({});
  const [reportFilters, setReportFilters] = useState({});

  useEffect(() => {
    if (user) {
      fetchPatientData();
    }
  }, [user]);

  const fetchPatientData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch patient document to get appointment ID
      const patientDoc = await getPatientProfile(user.uid);
      const appointmentIds = patientDoc.appointments || [];

      // Fetch appointments by IDs
      let appointmentsData = [];
      if (appointmentIds.length > 0) {
        const appointmentsCollection = collection(db, "appointments");
        // Firestore doesn't allow 'in' queries with more than 10 items, so batch if needed
        const batchSize = 10;
        for (let i = 0; i < appointmentIds.length; i += batchSize) {
          const batchIds = appointmentIds.slice(i, i + batchSize);
          const appointmentsQuery = query(
            appointmentsCollection,
            where("__name__", "in", batchIds)
          );
          const appointmentsSnapshot = await getDocs(appointmentsQuery);
          appointmentsData = appointmentsData.concat(
            appointmentsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        }
        // Sort by createdAt desc
        appointmentsData.sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );
      }

      // Fetch screening history
      const screeningQuery = query(
        collection(db, "screening_history"),
        where("patientId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const screeningSnapshot = await getDocs(screeningQuery);
      const screeningData = screeningSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Get unique doctor IDs
      const doctorIds = [
        ...new Set([
          ...appointmentsData.map((apt) => apt.doctorId),
          ...screeningData.map((screening) => screening.doctorId),
        ]),
      ].filter(Boolean);

      // Fetch doctor details
      const doctorsData = {};
      for (const doctorId of doctorIds) {
        doctorsData[doctorId] = await getDoctorProfile(doctorId);
      }

      setAppointments(appointmentsData);
      setScreeningHistory(screeningData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error("Error fetching patient data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Add filter functions
  const filterAppointments = (appointments) => {
    return appointments.filter((appointment) => {
      // Search filter
      if (appointmentFilters.search) {
        const searchTerm = appointmentFilters.search.toLowerCase();
        const doctor = doctors[appointment.doctorId];
        const doctorName = doctor
          ? `${doctor.firstName} ${doctor.lastName}`.toLowerCase()
          : "";
        const cancerType =
          cancerTypes
            .find((t) => t.id === appointment.cancerType)
            ?.name.toLowerCase() || "";

        if (
          !doctorName.includes(searchTerm) &&
          !cancerType.includes(searchTerm)
        ) {
          return false;
        }
      }
      // Status filter
      if (
        appointmentFilters.status &&
        appointment.status !== appointmentFilters.status
      ) {
        return false;
      }

      // Cancer type filter
      if (
        appointmentFilters.cancerType &&
        appointment.cancerType !== appointmentFilters.cancerType
      ) {
        return false;
      }

      // Date range filter
      if (appointmentFilters.dateFrom || appointmentFilters.dateTo) {
        const appointmentDate = appointment.createdAt?.seconds
          ? new Date(appointment.createdAt.seconds * 1000)
          : new Date(appointment.createdAt);

        if (
          appointmentFilters.dateFrom &&
          appointmentDate < appointmentFilters.dateFrom
        ) {
          return false;
        }
        if (
          appointmentFilters.dateTo &&
          appointmentDate > appointmentFilters.dateTo
        ) {
          return false;
        }
      }

      return true;
    });
  };

  const filterScreenings = (screenings) => {
    return screenings.filter((screening) => {
      // Similar filtering logic for screenings
      if (screeningFilters.search) {
        const searchTerm = screeningFilters.search.toLowerCase();
        const doctor = doctors[screening.doctorId];
        const doctorName = doctor
          ? `${doctor.firstName} ${doctor.lastName}`.toLowerCase()
          : "";
        const cancerType =
          cancerTypes
            .find((t) => t.id === screening.cancerType)
            ?.name.toLowerCase() || "";

        if (
          !doctorName.includes(searchTerm) &&
          !cancerType.includes(searchTerm)
        ) {
          return false;
        }
      }
 // Status filter
      if (
        screeningFilters.status &&
        screening.status !== screeningFilters.status
      ) {
        return false;
      }
// Cancer type filter
      if (
        screeningFilters.cancerType &&
        screening.cancerType !== screeningFilters.cancerType
      ) {
        return false;
      }
// Classification filter
      if (
        screeningFilters.classification &&
        screening.classification !== screeningFilters.classification
      ) {
        return false;
      }

      // Date range filter for screenings
      if (screeningFilters.dateFrom || screeningFilters.dateTo) {
        const screeningDate = screening.createdAt?.seconds
          ? new Date(screening.createdAt.seconds * 1000)
          : new Date(screening.createdAt);

        if (
          screeningFilters.dateFrom &&
          screeningDate < screeningFilters.dateFrom
        ) {
          return false;
        }

        if (
          screeningFilters.dateTo &&
          screeningDate > screeningFilters.dateTo
        ) {
          return false;
        }
      }

      return true;
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8"></div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Appointments"
            count={appointments.length}
            icon={Calendar}
            color="text-blue-600 bg-blue-100"
          />
          <StatsCard
            title="Pending Appointments"
            count={
              appointments.filter((apt) => apt.status === "pending").length
            }
            icon={Clock}
            color="text-yellow-600 bg-yellow-100"
          />
          <StatsCard
            title="Completed Screenings"
            count={screeningHistory.length}
            icon={Stethoscope}
            color="text-green-600 bg-green-100"
          />
          <StatsCard
            title="Upcoming Appointments"
            count={
              appointments.filter((apt) => apt.status === "accepted").length
            }
            icon={CheckCircle}
            color="text-purple-600 bg-purple-100"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments">My Appointments</TabsTrigger>
            <TabsTrigger value="screenings">Screening History</TabsTrigger>
            <TabsTrigger value="reports">Medical Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <FilterComponent
              filters={appointmentFilters}
              onFiltersChange={setAppointmentFilters}
              onClearFilters={() => setAppointmentFilters({})}
              filterType="appointments"
            />
            <AppointmentsList
              appointments={filterAppointments(appointments)}
              doctors={doctors}
              onViewDetails={(apt) => {
                setSelectedAppointment(apt);
                setShowDetailsModal(true);
              }}
            />
          </TabsContent>

          <TabsContent value="screenings">
            <FilterComponent
              filters={screeningFilters}
              onFiltersChange={setScreeningFilters}
              onClearFilters={() => setScreeningFilters({})}
              filterType="screenings"
            />
            <ScreeningHistoryList
              screenings={filterScreenings(screeningHistory)}
              doctors={doctors}
              appointments={appointments}
            />
          </TabsContent>

          <TabsContent value="reports">
            <FilterComponent
              filters={reportFilters}
              onFiltersChange={setReportFilters}
              onClearFilters={() => setReportFilters({})}
              filterType="reports"
            />
            <MedicalReportsList
              screenings={filterScreenings(
                screeningHistory.filter((s) => s.reportPdfUrl)
              )}
              doctors={doctors}
            />
          </TabsContent>
        </Tabs>

        {/* Appointment Details Modal */}
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
            </DialogHeader>

            {selectedAppointment && (
              <AppointmentDetails
                appointment={selectedAppointment}
                doctor={doctors[selectedAppointment.doctorId]}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
