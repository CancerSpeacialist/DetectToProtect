"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Clock, User, CheckCircle, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/context/AuthContext";
import Loader from "@/components/ui/Loader";
import RejectAppointmentModal from "@/components/doctor/appointments/RejectAppointmentModal";
import AppointmentDetailsModal from "@/components/doctor/appointments/AppointmentDetailsModal";
import AcceptAppointmentModal from "@/components/doctor/appointments/AcceptAppointmentModal";
import StatsCard from "@/components/doctor/appointments/StatCard";
import AppointmentsList from "@/components/doctor/appointments/AppointmentsList";
import {
  acceptAppointment,
  getDoctorAppointmentsWithPatients,
  rejectAppointment,
} from "@/lib/firebase/db";

export default function DoctorPatients() {
  const { user } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [acceptForm, setAcceptForm] = useState({
    appointmentDate: "",
    appointmentTime: "",
    doctorNotes: "",
  });
  const [rejectForm, setRejectForm] = useState({
    rejectionReason: "",
    doctorNotes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  // Fetch appointments for the logged-in doctor
  const fetchAppointments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { appointments, patients } =
        await getDoctorAppointmentsWithPatients(user.uid);
      setAppointments(appointments);
      setPatients(patients);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // Handle accepting an appointment
  const handleAcceptAppointment = async () => {
    if (
      !selectedAppointment ||
      !acceptForm.appointmentDate ||
      !acceptForm.appointmentTime
    ) {
      toast.error("Please provide appointment date and time");
      return;
    }

    setSubmitting(true);

    try {
      await acceptAppointment(selectedAppointment.id, {
        appointmentDate: acceptForm.appointmentDate,
        appointmentTime: acceptForm.appointmentTime,
        doctorNotes: acceptForm.doctorNotes,
      });

      toast.success("Appointment accepted successfully!");
      setShowAcceptModal(false);
      setAcceptForm({
        appointmentDate: "",
        appointmentTime: "",
        doctorNotes: "",
      });
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (error) {
      console.error("Error accepting appointment:", error);
      toast.error("Failed to accept appointment");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle rejecting an appointment
  const handleRejectAppointment = async () => {
    if (!selectedAppointment || !rejectForm.rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setSubmitting(true);

    try {
      await rejectAppointment(selectedAppointment.id, {
        rejectionReason: rejectForm.rejectionReason,
        doctorNotes: rejectForm.doctorNotes,
      });

      toast.success("Appointment rejected");
      setShowRejectModal(false);
      setRejectForm({ rejectionReason: "", doctorNotes: "" });
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      toast.error("Failed to reject appointment");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle starting screening for an accepted appointment
  const handleStartScreening = (appointment) => {
    // Redirect to screening page with cancer type and appointment ID
    router.push(
      `/doctor/screening/${appointment.cancerType}?appointmentId=${appointment.id}`
    );
  };

  // Filter appointments by status
  const getFilteredAppointments = (status) => {
    return appointments.filter((apt) => apt.status === status);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Patient Appointments
          </h1>
          <p className="text-gray-600">
            Manage your patient appointments and consultations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Pending"
            count={getFilteredAppointments("pending").length}
            icon={Clock}
            color="text-yellow-600 bg-yellow-100"
          />
          <StatsCard
            title="Accepted"
            count={getFilteredAppointments("accepted").length}
            icon={CheckCircle}
            color="text-green-600 bg-green-100"
          />
          <StatsCard
            title="Completed"
            count={getFilteredAppointments("completed").length}
            icon={Stethoscope}
            color="text-blue-600 bg-blue-100"
          />
          <StatsCard
            title="Total"
            count={appointments.length}
            icon={User}
            color="text-gray-600 bg-gray-100"
          />
        </div>

        {/* Appointments Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pending">
              Pending ({getFilteredAppointments("pending").length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted ({getFilteredAppointments("accepted").length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({getFilteredAppointments("completed").length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({getFilteredAppointments("rejected").length})
            </TabsTrigger>
            <TabsTrigger value="all">All ({appointments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <AppointmentsList
              appointments={getFilteredAppointments("pending")}
              patients={patients}
              onAccept={(apt) => {
                setSelectedAppointment(apt);
                setShowAcceptModal(true);
              }}
              onReject={(apt) => {
                setSelectedAppointment(apt);
                setShowRejectModal(true);
              }}
              onViewDetails={(apt) => {
                setSelectedAppointment(apt);
                setShowDetailsModal(true);
              }}
              showActions={true}
            />
          </TabsContent>

          <TabsContent value="accepted">
            <AppointmentsList
              appointments={getFilteredAppointments("accepted")}
              patients={patients}
              onStartScreening={handleStartScreening}
              onViewDetails={(apt) => {
                setSelectedAppointment(apt);
                setShowDetailsModal(true);
              }}
              showScreeningAction={true}
            />
          </TabsContent>

          <TabsContent value="completed">
            <AppointmentsList
              appointments={getFilteredAppointments("completed")}
              patients={patients}
              onViewDetails={(apt) => {
                setSelectedAppointment(apt);
                setShowDetailsModal(true);
              }}
            />
          </TabsContent>

          <TabsContent value="rejected">
            <AppointmentsList
              appointments={getFilteredAppointments("rejected")}
              patients={patients}
              onViewDetails={(apt) => {
                setSelectedAppointment(apt);
                setShowDetailsModal(true);
              }}
            />
          </TabsContent>

          <TabsContent value="all">
            <AppointmentsList
              appointments={appointments}
              patients={patients}
              onViewDetails={(apt) => {
                setSelectedAppointment(apt);
                setShowDetailsModal(true);
              }}
            />
          </TabsContent>
        </Tabs>

        {/* Accept Appointment Modal */}
        <AcceptAppointmentModal
          open={showAcceptModal}
          onOpenChange={setShowAcceptModal}
          onClose={() => setShowAcceptModal(false)}
          selectedAppointment={selectedAppointment}
          patients={patients}
          acceptForm={acceptForm}
          setAcceptForm={setAcceptForm}
          submitting={submitting}
          handleAcceptAppointment={handleAcceptAppointment}
        />

        {/* Reject Appointment Modal */}
        <RejectAppointmentModal
          open={showRejectModal}
          onOpenChange={setShowRejectModal}
          rejectForm={rejectForm}
          setRejectForm={setRejectForm}
          submitting={submitting}
          onReject={handleRejectAppointment}
        />

        {/* Appointment Details Modal */}
        <AppointmentDetailsModal
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          appointment={selectedAppointment}
          patient={
            selectedAppointment
              ? patients[selectedAppointment.patientId]
              : undefined
          }
        />
      </div>
    </div>
  );
}
