"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  MapPin,
  Star,
  Clock,
  DollarSign,
  Calendar,
  Stethoscope,
  Filter,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/context/AuthContext";
import {
  bookAppointment,
  getPatientProfile,
  getAllVerifiedDoctors,
} from "@/lib/firebase/db";
import DoctorCard from "@/components/patient/appointment/DoctorCard";
import Loader from "@/components/ui/Loader";
import cancerTypes from "@/cancerTypes";

const urgencyLevels = [
  {
    value: "low",
    label: "Low - Routine checkup",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "medium",
    label: "Medium - Some concerns",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "high",
    label: "High - Urgent consultation",
    color: "bg-red-100 text-red-800",
  },
];

import DoctorFilters from "@/components/patient/appointment/DoctorFilters";
import DoctorGrid from "@/components/patient/appointment/DoctorGrid";
import BookingModal from "@/components/patient/appointment/BookingModal";

export default function PatientAppointments() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCancerType, setSelectedCancerType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState("all");
  const [feeRange, setFeeRange] = useState({ min: "", max: "" });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    patientNotes: "",
    urgency: "medium",
    preferredDateRange: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const selectedCancerTypeName = cancerTypes.find(
    (t) => t.id === selectedCancerType
  )?.name;

  // Fetch approved doctors
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Filter doctors based on criteria
  useEffect(() => {
    filterDoctors();
  }, [doctors, selectedCancerType, searchTerm, hospitalFilter, feeRange]);

  const fetchDoctors = async () => {
    try {
      const doctorsData = await getAllVerifiedDoctors();
      setDoctors(doctorsData);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = [...doctors];

    // Filter by cancer type specialization
    if (selectedCancerType) {
      filtered = filtered.filter((doctor) =>
        doctor.cancerSpecializations?.includes(selectedCancerType)
      );
    }

    // Filter by search term (name or specialization)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (doctor) =>
          doctor.firstName?.toLowerCase().includes(term) ||
          doctor.lastName?.toLowerCase().includes(term) ||
          doctor.specialization?.some((spec) =>
            spec.toLowerCase().includes(term)
          )
      );
    }

    // Filter by hospital
    if (hospitalFilter && hospitalFilter !== "all") {
      const hospital = hospitalFilter.toLowerCase();
      filtered = filtered.filter((doctor) =>
        doctor.hospital?.toLowerCase().includes(hospital)
      );
    }

    // Filter by consultation fee range
    if (feeRange.min || feeRange.max) {
      filtered = filtered.filter((doctor) => {
        const fee = doctor.consultationFee || 0;
        const min = feeRange.min ? parseFloat(feeRange.min) : 0;
        const max = feeRange.max ? parseFloat(feeRange.max) : Infinity;
        return fee >= min && fee <= max;
      });
    }

    setFilteredDoctors(filtered);
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const submitBooking = async () => {
    if (!selectedDoctor || !user || !selectedCancerType) {
      toast.error("Please select a cancer type and doctor");
      return;
    }

    if (!bookingForm.patientNotes.trim()) {
      toast.error("Please describe your symptoms or concerns");
      return;
    }

    setSubmitting(true);

    try {
      // Get patient data
      const patientProfile = await getPatientProfile(user.uid);

      if (!patientProfile) {
        toast.error("Patient profile not found");
        return;
      }

      const appointmentData = {
        patientId: patientProfile.uid,
        doctorId: selectedDoctor.uid,
        cancerType: selectedCancerType,
        status: "pending",
        patientNotes: bookingForm.patientNotes.trim(),
        urgency: bookingForm.urgency,
        preferredDateRange: bookingForm.preferredDateRange,
        appointmentDate: null,
        appointmentTime: null,
        doctorNotes: "",
        rejectionReason: "",
      };

      await bookAppointment(appointmentData);

      toast.success("Appointment request submitted successfully!");
      setShowBookingModal(false);
      setBookingForm({
        patientNotes: "",
        urgency: "medium",
        preferredDateRange: "",
      });
      setSelectedDoctor(null);
    } catch (error) {
      console.error("Error submitting appointment:", error);
      toast.error("Failed to submit appointment request");
    } finally {
      setSubmitting(false);
    }
  };

  const getUniqueHospitals = () => {
    const hospitals = doctors.map((doc) => doc.hospital).filter(Boolean);
    return [...new Set(hospitals)];
  };

  if (loading) {
    return <Loader />;
  }

  // return (
  //   <div className="min-h-screen bg-gray-50 p-6">
  //     <div className="max-w-7xl mx-auto">
  //       {/* Header */}
  //       <div className="mb-8">
  //         <h1 className="text-3xl font-bold text-gray-900 mb-2">
  //           Book an Appointment
  //         </h1>
  //         <p className="text-gray-600">
  //           Find and book appointments with specialized cancer doctors
  //         </p>
  //       </div>

  //       {/* Filters */}
  //       <Card className="mb-6">
  //         <CardHeader>
  //           <CardTitle className="flex items-center gap-2">
  //             <Filter className="h-5 w-5" />
  //             Filter Doctors
  //           </CardTitle>
  //         </CardHeader>
  //         <CardContent className="space-y-4">
  //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  //             {/* Cancer Type Selection */}
  //             <div className="space-y-2">
  //               <Label>Cancer Type *</Label>
  //               <Select
  //                 value={selectedCancerType}
  //                 onValueChange={setSelectedCancerType}
  //               >
  //                 <SelectTrigger>
  //                   <SelectValue placeholder="Select cancer type" />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   {cancerTypes.map((type) => (
  //                     <SelectItem key={type.id} value={type.id}>
  //                       <div className="flex items-center gap-2">
  //                         <span>{type.icon}</span>
  //                         <span>{type.name}</span>
  //                       </div>
  //                     </SelectItem>
  //                   ))}
  //                 </SelectContent>
  //               </Select>
  //             </div>

  //             {/* Doctor Name Search */}
  //             <div className="space-y-2">
  //               <Label>Doctor Name</Label>
  //               <div className="relative">
  //                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
  //                 <Input
  //                   placeholder="Search by doctor name..."
  //                   value={searchTerm}
  //                   onChange={(e) => setSearchTerm(e.target.value)}
  //                   className="pl-10"
  //                 />
  //               </div>
  //             </div>

  //             {/* Hospital Filter */}
  //             <div className="space-y-2">
  //               <Label>Hospital</Label>
  //               <Select
  //                 value={hospitalFilter}
  //                 onValueChange={setHospitalFilter}
  //               >
  //                 <SelectTrigger>
  //                   <SelectValue placeholder="All hospitals" />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   <SelectItem value="all">All hospitals</SelectItem>
  //                   {getUniqueHospitals().map((hospital) => (
  //                     <SelectItem key={hospital} value={hospital}>
  //                       {hospital}
  //                     </SelectItem>
  //                   ))}
  //                 </SelectContent>
  //               </Select>
  //             </div>

  //             {/* Consultation Fee Range */}
  //             <div className="space-y-2">
  //               <Label>Consultation Fee ($)</Label>
  //               <div className="flex gap-2">
  //                 <Input
  //                   placeholder="Min"
  //                   type="number"
  //                   value={feeRange.min}
  //                   onChange={(e) =>
  //                     setFeeRange((prev) => ({ ...prev, min: e.target.value }))
  //                   }
  //                 />
  //                 <Input
  //                   placeholder="Max"
  //                   type="number"
  //                   value={feeRange.max}
  //                   onChange={(e) =>
  //                     setFeeRange((prev) => ({ ...prev, max: e.target.value }))
  //                   }
  //                 />
  //               </div>
  //             </div>
  //           </div>

  //           {selectedCancerType && (
  //             <div className="flex items-center gap-2 mt-4">
  //               <AlertCircle className="h-4 w-4 text-blue-600" />
  //               <span className="text-sm text-blue-600">
  //                 Showing doctors specialized in{" "}
  //                 {cancerTypes.find((t) => t.id === selectedCancerType)?.name}
  //               </span>
  //             </div>
  //           )}
  //         </CardContent>
  //       </Card>

  //       {/* Results */}
  //       <div className="mb-4 flex items-center justify-between">
  //         <p className="text-gray-600">
  //           {filteredDoctors.length} doctor
  //           {filteredDoctors.length !== 1 ? "s" : ""} found
  //         </p>
  //         {!selectedCancerType && (
  //           <Badge
  //             variant="outline"
  //             className="text-orange-600 border-orange-600"
  //           >
  //             Please select a cancer type to see specialized doctors
  //           </Badge>
  //         )}
  //       </div>

  //       {/* Doctors Grid */}
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //         {filteredDoctors.map((doctor, index) => (
  //           <DoctorCard
  //             key={index}
  //             doctor={doctor}
  //             onBookAppointment={handleBookAppointment}
  //             selectedCancerType={selectedCancerType}
  //           />
  //         ))}
  //       </div>

  //       {filteredDoctors.length === 0 && selectedCancerType && (
  //         <div className="text-center py-12">
  //           <Stethoscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
  //           <h3 className="text-lg font-medium text-gray-900 mb-2">
  //             No doctors found
  //           </h3>
  //           <p className="text-gray-600">
  //             Try adjusting your filters or search terms to find more doctors.
  //           </p>
  //         </div>
  //       )}

  //       {/* Booking Modal */}
  //       <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
  //         <DialogContent className="max-w-2xl">
  //           <DialogHeader>
  //             <DialogTitle>Book Appointment</DialogTitle>
  //             <DialogDescription>
  //               Book an appointment with Dr. {selectedDoctor?.firstName}{" "}
  //               {selectedDoctor?.lastName}
  //             </DialogDescription>
  //           </DialogHeader>

  //           <div className="space-y-4">
  //             {/* Doctor Info */}
  //             {selectedDoctor && (
  //               <Card>
  //                 <CardContent className="pt-6">
  //                   <div className="flex items-start gap-4">
  //                     <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
  //                       <Stethoscope className="h-6 w-6 text-blue-600" />
  //                     </div>
  //                     <div className="flex-1">
  //                       <h3 className="font-semibold text-lg">
  //                         Dr. {selectedDoctor.firstName}{" "}
  //                         {selectedDoctor.lastName}
  //                       </h3>
  //                       <p className="text-gray-600">
  //                         {selectedDoctor.hospital}
  //                       </p>
  //                       <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
  //                         <span className="flex items-center gap-1">
  //                           <DollarSign className="h-4 w-4" />$
  //                           {selectedDoctor.consultationFee}
  //                         </span>
  //                         <span className="flex items-center gap-1">
  //                           <Clock className="h-4 w-4" />
  //                           {selectedDoctor.experience}+ years
  //                         </span>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </CardContent>
  //               </Card>
  //             )}

  //             {/* Symptoms/Notes */}
  //             <div className="space-y-2">
  //               <Label htmlFor="symptoms">
  //                 Describe your symptoms or concerns *
  //               </Label>
  //               <Textarea
  //                 id="symptoms"
  //                 placeholder="Please describe your symptoms, concerns, or reason for this appointment..."
  //                 value={bookingForm.patientNotes}
  //                 onChange={(e) =>
  //                   setBookingForm((prev) => ({
  //                     ...prev,
  //                     patientNotes: e.target.value,
  //                   }))
  //                 }
  //                 className="min-h-[120px]"
  //               />
  //             </div>

  //             {/* Urgency Level */}
  //             <div className="space-y-2">
  //               <Label>Urgency Level</Label>
  //               <Select
  //                 value={bookingForm.urgency}
  //                 onValueChange={(value) =>
  //                   setBookingForm((prev) => ({ ...prev, urgency: value }))
  //                 }
  //               >
  //                 <SelectTrigger>
  //                   <SelectValue />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   {urgencyLevels.map((level) => (
  //                     <SelectItem key={level.value} value={level.value}>
  //                       <div className="flex items-center gap-2">
  //                         <Badge className={level.color}>{level.label}</Badge>
  //                       </div>
  //                     </SelectItem>
  //                   ))}
  //                 </SelectContent>
  //               </Select>
  //             </div>

  //             {/* Preferred Date Range */}
  //             <div className="space-y-2">
  //               <Label htmlFor="dateRange">
  //                 Preferred Date Range (Optional)
  //               </Label>
  //               <Input
  //                 id="dateRange"
  //                 placeholder="e.g., Next week, After December 1st, Weekdays only..."
  //                 value={bookingForm.preferredDateRange}
  //                 onChange={(e) =>
  //                   setBookingForm((prev) => ({
  //                     ...prev,
  //                     preferredDateRange: e.target.value,
  //                   }))
  //                 }
  //               />
  //             </div>
  //           </div>

  //           <DialogFooter>
  //             <Button
  //               variant="outline"
  //               onClick={() => setShowBookingModal(false)}
  //               disabled={submitting}
  //             >
  //               Cancel
  //             </Button>
  //             <Button
  //               onClick={submitBooking}
  //               disabled={submitting || !bookingForm.patientNotes.trim()}
  //             >
  //               {submitting ? "Submitting..." : "Book Appointment"}
  //             </Button>
  //           </DialogFooter>
  //         </DialogContent>
  //       </Dialog>
  //     </div>
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book an Appointment
          </h1>
          <p className="text-gray-600">
            Find and book appointments with specialized cancer doctors
          </p>
        </div>

        {/* Filters */}
        <DoctorFilters
          selectedCancerType={selectedCancerType}
          setSelectedCancerType={setSelectedCancerType}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          hospitalFilter={hospitalFilter}
          setHospitalFilter={setHospitalFilter}
          feeRange={feeRange}
          setFeeRange={setFeeRange}
          getUniqueHospitals={getUniqueHospitals}
          selectedCancerTypeName={selectedCancerTypeName}
        />

        {/* Results */}
        <DoctorGrid
          filteredDoctors={filteredDoctors}
          selectedCancerType={selectedCancerType}
          handleBookAppointment={handleBookAppointment}
        />

        {/* Booking Modal */}
        <BookingModal
          showBookingModal={showBookingModal}
          setShowBookingModal={setShowBookingModal}
          selectedDoctor={selectedDoctor}
          bookingForm={bookingForm}
          setBookingForm={setBookingForm}
          urgencyLevels={urgencyLevels}
          submitting={submitting}
          submitBooking={submitBooking}
        />
      </div>
    </div>
  );
}
