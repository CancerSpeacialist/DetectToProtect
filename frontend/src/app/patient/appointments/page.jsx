"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/context/AuthContext";
import {
  bookAppointment,
  getPatientProfile,
  getAllVerifiedDoctors,
} from "@/lib/firebase/db";
import Loader from "@/components/ui/Loader";
import cancerTypes from "@/constants";

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
        preferredDateRange: bookingForm.preferredDateRange || "" ,
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
