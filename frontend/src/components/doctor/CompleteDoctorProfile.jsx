"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserCheck, X } from "lucide-react";
import { completeDoctorProfile } from "@/lib/firebase/db";
import cancerTypes from "@/cancerTypes";

// Fixed schema - removed the string fields for specializations and qualifications
// since we handle them as arrays separately
const completeDoctorProfileSchema = z.object({
  licenseNumber: z
    .string()
    .min(5, "License number must be at least 5 characters"),
  hospital: z.string().min(2, "Hospital name is required"),
  experience: z.number().min(0, "Experience must be a positive number"),
  consultationFee: z.number().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  // Removed specializations and qualifications from schema as they're handled separately
});

// type CompleteDoctorProfileFormData = z.infer<
//   typeof completeDoctorProfileSchema
// >;

// interface CompleteDoctorProfileProps {
//   doctorUid: string;
//   onSuccess?: () => void;
// }

export default function CompleteDoctorProfile({ doctorUid, onSuccess }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [currentSpec, setCurrentSpec] = useState("");
  const [currentQual, setCurrentQual] = useState("");
  const [cancerSpecializations, setCancerSpecializations] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(completeDoctorProfileSchema),
  });

  const addSpecialization = () => {
    if (currentSpec.trim() && !specializations.includes(currentSpec.trim())) {
      setSpecializations([...specializations, currentSpec.trim()]);
      setCurrentSpec("");
    }
  };

  const removeSpecialization = (spec) => {
    setSpecializations(specializations.filter((s) => s !== spec));
  };

  const addQualification = () => {
    if (currentQual.trim() && !qualifications.includes(currentQual.trim())) {
      setQualifications([...qualifications, currentQual.trim()]);
      setCurrentQual("");
    }
  };

  const removeQualification = (qual) => {
    setQualifications(qualifications.filter((q) => q !== qual));
  };

  const onSubmit = async (data) => {
    try {
      setError("");
      setLoading(true);

      if (specializations.length === 0) {
        setError("Please add at least one specialization");
        return;
      }

      if (qualifications.length === 0) {
        setError("Please add at least one qualification");
        return;
      }
      
      if (cancerSpecializations.length === 0) {
        setError("Please select at least one cancer specialization");
        return;
      }

      const profileData = {
        licenseNumber: data.licenseNumber,
        specialization: specializations,
        hospital: data.hospital,
        experience: data.experience,
        qualifications: qualifications,
        phoneNumber: data.phoneNumber || undefined,
        address: data.address || undefined,
        consultationFee: data.consultationFee || undefined,
        cancerSpecializations,
      };

      await completeDoctorProfile(doctorUid, profileData);
      onSuccess?.();
    } catch (error) {
      setError(error.message || "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to handle Enter key press
  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-blue-200">
          <CardHeader className="text-center bg-blue-50">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <UserCheck className="w-6 h-6 text-blue-600" />
              Complete Your Doctor Profile
            </CardTitle>
            <CardDescription>
              Please complete your professional information to activate your
              account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription>
                  <strong>Important:</strong> Your account will be submitted for
                  admin approval once you complete this profile.
                </AlertDescription>
              </Alert>

              {/* License and Hospital Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">
                    Medical License Number *
                  </Label>
                  <Input
                    id="licenseNumber"
                    placeholder="e.g., MD123456789"
                    {...register("licenseNumber")}
                  />
                  {errors.licenseNumber && (
                    <p className="text-sm text-red-600">
                      {errors.licenseNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital/Clinic *</Label>
                  <Input
                    id="hospital"
                    placeholder="e.g., City General Hospital"
                    {...register("hospital")}
                  />
                  {errors.hospital && (
                    <p className="text-sm text-red-600">
                      {errors.hospital.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Experience and Fee */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    placeholder="e.g., 5"
                    {...register("experience", { valueAsNumber: true })}
                  />
                  {errors.experience && (
                    <p className="text-sm text-red-600">
                      {errors.experience.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultationFee">
                    Consultation Fee (Optional)
                  </Label>
                  <Input
                    id="consultationFee"
                    type="number"
                    min="0"
                    placeholder="e.g., 150"
                    {...register("consultationFee", { valueAsNumber: true })}
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    {...register("phoneNumber")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Hospital/Clinic Address"
                    {...register("address")}
                  />
                </div>
              </div>

              {/* Cancer Specializations */}
              <div className="space-y-4">
                <Label>Cancer Specializations *</Label>
                <div className="flex flex-wrap gap-2">
                  {cancerTypes.map((type) => (
                    <Badge
                      key={type.id}
                      variant={
                        cancerSpecializations.includes(type.id)
                          ? "default"
                          : "secondary"
                      }
                      className="cursor-pointer"
                      onClick={() => {
                        setCancerSpecializations((prev) =>
                          prev.includes(type.id)
                            ? prev.filter((id) => id !== type.id)
                            : [...prev, type.id]
                        );
                      }}
                    >
                      {type.icon} {type.name}
                    </Badge>
                  ))}
                </div>
                {cancerSpecializations.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Please select at least one cancer specialization
                  </p>
                )}
              </div>

              {/* Specializations */}
              <div className="space-y-4">
                <Label>Medical Specializations *</Label>
                <div className="flex gap-2">
                  <Input
                    value={currentSpec}
                    onChange={(e) => setCurrentSpec(e.target.value)}
                    placeholder="e.g., Cardiology, Oncology"
                    onKeyPress={(e) => handleKeyPress(e, addSpecialization)}
                  />
                  <Button type="button" onClick={addSpecialization}>
                    Add
                  </Button>
                </div>
                {specializations.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Please add at least one specialization
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec) => (
                    <Badge key={spec} variant="secondary" className="gap-1">
                      {spec}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-600"
                        onClick={() => removeSpecialization(spec)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Qualifications */}
              <div className="space-y-4">
                <Label>Qualifications & Certifications *</Label>
                <div className="flex gap-2">
                  <Input
                    value={currentQual}
                    onChange={(e) => setCurrentQual(e.target.value)}
                    placeholder="e.g., MBBS, MD, Fellowship in Cardiology"
                    onKeyPress={(e) => handleKeyPress(e, addQualification)}
                  />
                  <Button type="button" onClick={addQualification}>
                    Add
                  </Button>
                </div>
                {qualifications.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Please add at least one qualification
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {qualifications.map((qual) => (
                    <Badge key={qual} variant="secondary" className="gap-1">
                      {qual}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-600"
                        onClick={() => removeQualification(qual)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={
                  loading ||
                  specializations.length === 0 ||
                  qualifications.length === 0
                }
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Completing Profile...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Complete Profile & Submit for Approval
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
