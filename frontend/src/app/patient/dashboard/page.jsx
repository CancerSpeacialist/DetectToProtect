"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Stethoscope,
  Eye,
  Download,
  Plus,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import Loader from "@/components/ui/Loader";
import {cancerTypes} from "@/constants/cancerTypes";

const statusConfig = {
  pending: {
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    label: "Pending Review",
  },
  accepted: {
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    label: "Accepted",
  },
  rejected: {
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    label: "Rejected",
  },
  completed: {
    color: "bg-blue-100 text-blue-800",
    icon: Stethoscope,
    label: "Completed",
  },
  cancelled: {
    color: "bg-gray-100 text-gray-800",
    icon: XCircle,
    label: "Cancelled",
  },
};

export default function PatientDashboard() {
  const { user} = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [screeningHistory, setScreeningHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
// https://console.firebase.google.com/v1/r/project/detecttoprotect-8e2f2/firestore/indexes?create_composite=Clpwcm9qZWN0cy9kZXRlY3R0b3Byb3RlY3QtOGUyZjIvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2FwcG9pbnRtZW50cy9pbmRleGVzL18QARoNCglwYXRpZW50SWQQARoNCgljcmVhdGVkQXQQAhoMCghfX25hbWVfXxAC

  useEffect(() => {
    if (user) {
      fetchPatientData();
    }
  }, [user]);

  // const fetchPatientData = async () => {
  //   if (!user) return;

  //   try {
  //     setLoading(true);

  //     // Fetch appointments
  //     const appointmentsQuery = query(
  //       collection(db, "appointments"),
  //       where("patientId", "==", user.uid),
  //       orderBy("createdAt", "desc")
  //     );
  //     const appointmentsSnapshot = await getDocs(appointmentsQuery);
  //     const appointmentsData = appointmentsSnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));

  //     // Fetch screening history
  //     const screeningQuery = query(
  //       collection(db, "screening_history"),
  //       where("patientId", "==", user.uid),
  //       orderBy("createdAt", "desc")
  //     );

  //     const screeningSnapshot = await getDocs(screeningQuery);
  //     const screeningData = screeningSnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));

  //     // Get unique doctor IDs
  //     const doctorIds = [
  //       ...new Set([
  //         ...appointmentsData.map((apt) => apt.doctorId),
  //         ...screeningData.map((screening) => screening.doctorId),
  //       ]),
  //     ];

  //     // Fetch doctor details
  //     const doctorsData = {};
  //     for (const doctorId of doctorIds) {
  //       const doctorQuery = query(
  //         collection(db, "doctor"),
  //         where("uid", "==", doctorId)
  //       );
  //       const doctorSnapshot = await getDocs(doctorQuery);
  //       if (!doctorSnapshot.empty) {
  //         doctorsData[doctorId] = doctorSnapshot.docs[0].data();
  //       }
  //     }

  //     setAppointments(appointmentsData);
  //     setScreeningHistory(screeningData);
  //     setDoctors(doctorsData);
  //   } catch (error) {
  //     console.error("Error fetching patient data:", error);
  //     toast.error("Failed to load dashboard data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const fetchPatientData = async () => {
  if (!user) return;

  try {
    setLoading(true);

    // Fetch patient document to get appointment IDs
    const patientDocRef = collection(db, "patients");
    const patientQuery = query(patientDocRef, where("patientId", "==", user.uid));
    const patientSnapshot = await getDocs(patientQuery);
    if (patientSnapshot.empty) {
      setAppointments([]);
      setScreeningHistory([]);
      setDoctors({});
      setLoading(false);
      return;
    }
    const patientDoc = patientSnapshot.docs[0].data();
    const appointmentIds = patientDoc.appointmentsId || [];

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
      appointmentsData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
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
      const doctorQuery = query(
        collection(db, "doctor"),
        where("uid", "==", doctorId)
      );
      const doctorSnapshot = await getDocs(doctorQuery);
      if (!doctorSnapshot.empty) {
        doctorsData[doctorId] = doctorSnapshot.docs[0].data();
      }
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
  const formatDate = (timestamp) => {
    if (!timestamp) return "Not set";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (date, time) => {
    if (!date || !time) return "Not scheduled";
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return `${dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })} at ${time}`;
  };

  if (loading) {
    return (
     <Loader/>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Patient Dashboard
              </h1>
              <p className="text-gray-600">
                Track your appointments and screening results
              </p>
            </div>
            <Button
              onClick={() => router.push("/patient/appointments")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Book New Appointment
            </Button>
          </div>
        </div>

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
            <AppointmentsList
              appointments={appointments}
              doctors={doctors}
              onViewDetails={(apt) => {
                setSelectedAppointment(apt);
                setShowDetailsModal(true);
              }}
            />
          </TabsContent>

          <TabsContent value="screenings">
            <ScreeningHistoryList
              screenings={screeningHistory}
              doctors={doctors}
              appointments={appointments}
            />
          </TabsContent>

          <TabsContent value="reports">
            <MedicalReportsList
              screenings={screeningHistory}
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

// Stats Card Component
function StatsCard({ title, count, icon: Icon, color }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{count}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Appointments List Component
function AppointmentsList({ appointments, doctors, onViewDetails }) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No appointments yet
          </h3>
          <p className="text-gray-600 mb-4">
            Book your first appointment to get started
          </p>
          <Button >Book Appointment</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          doctor={doctors[appointment.doctorId]}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

// Appointment Card Component
function AppointmentCard({ appointment, doctor, onViewDetails }) {

  const cancerTypeInfo = cancerTypes.find((type) => type.id === appointment.cancerType);
  const StatusIcon = statusConfig[appointment.status]?.icon || Clock;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {doctor
                      ? `Dr. ${doctor.firstName} ${doctor.lastName}`
                      : "Doctor"}
                  </h3>
                  <p className="text-sm text-gray-600">{doctor?.hospital}</p>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <Badge className="bg-purple-100 text-purple-800">
                    {cancerTypeInfo?.icon}{" "}
                    {cancerTypeInfo?.name || appointment.cancerType}
                  </Badge>
                  <Badge className={statusConfig[appointment.status]?.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig[appointment.status]?.label}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Requested: {formatDate(appointment.requestedDate)}
                    </span>
                  </div>
                  {appointment.appointmentDate && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        Scheduled:{" "}
                        {formatDateTime(
                          appointment.appointmentDate,
                          appointment.appointmentTime
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status-specific messages */}
                {appointment.status === "accepted" &&
                  appointment.doctorNotes && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-800 mb-1">
                        Doctor's Notes:
                      </p>
                      <p className="text-sm text-green-700">
                        {appointment.doctorNotes}
                      </p>
                    </div>
                  )}

                {appointment.status === "rejected" &&
                  appointment.rejectionReason && (
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-800 mb-1">
                        Rejection Reason:
                      </p>
                      <p className="text-sm text-red-700">
                        {appointment.rejectionReason}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(appointment)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Screening History List Component
function ScreeningHistoryList({ screenings, doctors, appointments }) {
  if (screenings.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No screening history
          </h3>
          <p className="text-gray-600">
            Your completed screenings will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {screenings.map((screening) => {
        const appointment = appointments.find(
          (apt) => apt.id === screening.appointmentId
        );
        const doctor = doctors[screening.doctorId];
  const cancerTypeInfo = cancerTypes.find((type) => type.id === screening.cancerType);


        return (
          <Card
            key={screening.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{cancerTypeInfo?.icon}</span>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {cancerTypeInfo?.name} Screening
                        </h3>
                        <p className="text-sm text-gray-600">
                          By Dr.{" "}
                          {doctor
                            ? `${doctor.firstName} ${doctor.lastName}`
                            : "Unknown"}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 flex-wrap">
                        <Badge
                          className={
                            screening.classification === "Malignant"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {screening.classification}
                        </Badge>
                        <Badge variant="secondary">
                          {screening.confidence}% confidence
                        </Badge>
                        <Badge
                          className={
                            screening.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : screening.status === "under_review"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {screening.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Screening Date:{" "}
                            {formatDate(screening.screeningDate)}
                          </span>
                        </div>
                        {screening.doctorReview && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="font-medium text-blue-800 mb-1">
                              Doctor's Review:
                            </p>
                            <p className="text-blue-700">
                              {screening.doctorReview}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {screening.reportPdfUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(screening.reportPdfUrl, "_blank")
                      }
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  )}
                  {screening.imageUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(screening.imageUrl, "_blank")}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Scan
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Medical Reports List Component
function MedicalReportsList({ screenings, doctors }) {
  const reportsWithData = screenings.filter(
    (screening) => screening.reportPdfUrl
  );

  if (reportsWithData.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No medical reports
          </h3>
          <p className="text-gray-600">
            Your medical reports will appear here after screenings
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reportsWithData.map((screening) => {
        const doctor = doctors[screening.doctorId];
  const cancerTypeInfo = cancerTypes.find((type) => type.id === screening.cancerType);

        

        return (
          <Card
            key={screening.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {cancerTypeInfo?.name} Report
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(screening.screeningDate)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Dr.{" "}
                    {doctor
                      ? `${doctor.firstName} ${doctor.lastName}`
                      : "Unknown"}
                  </p>
                </div>

                <div className="flex justify-center">
                  <Badge
                    className={
                      screening.classification === "Malignant"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }
                  >
                    {screening.classification}
                  </Badge>
                </div>

                <Button
                  onClick={() => window.open(screening.reportPdfUrl, "_blank")}
                  className="w-full"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Appointment Details Component (for modal)
function AppointmentDetails({ appointment, doctor }) {
  const cancerTypeInfo = cancerTypes.find((type) => type.id === appointment.cancerType);

  

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold mb-3">Doctor Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Name:</span>
            <p>
              {doctor
                ? `Dr. ${doctor.firstName} ${doctor.lastName}`
                : "Unknown"}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Hospital:</span>
            <p>{doctor?.hospital || "N/A"}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Specialization:</span>
            <p>{doctor?.specialization?.join(", ") || "N/A"}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Experience:</span>
            <p>{doctor?.experience ? `${doctor.experience}+ years` : "N/A"}</p>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-lg font-semibold mb-3">Appointment Details</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Cancer Type:</span>
            <p>
              {cancerTypeInfo?.icon} {cancerTypeInfo?.name}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Status:</span>
            <Badge className={statusConfig[appointment.status]?.color}>
              {statusConfig[appointment.status]?.label}
            </Badge>
          </div>
          <div>
            <span className="font-medium text-gray-700">Requested Date:</span>
            <p>{formatDate(appointment.requestedDate)}</p>
          </div>
          {appointment.appointmentDate && (
            <div>
              <span className="font-medium text-gray-700">Scheduled:</span>
              <p>
                {formatDateTime(
                  appointment.appointmentDate,
                  appointment.appointmentTime
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-lg font-semibold mb-3">Your Notes</h4>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-600">{appointment.patientNotes}</p>
        </div>
      </div>

      {appointment.doctorNotes && (
        <>
          <Separator />
          <div>
            <h4 className="text-lg font-semibold mb-3">Doctor's Notes</h4>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-800">{appointment.doctorNotes}</p>
            </div>
          </div>
        </>
      )}

      {appointment.rejectionReason && (
        <>
          <Separator />
          <div>
            <h4 className="text-lg font-semibold mb-3">Rejection Reason</h4>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-sm text-red-800">
                {appointment.rejectionReason}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
