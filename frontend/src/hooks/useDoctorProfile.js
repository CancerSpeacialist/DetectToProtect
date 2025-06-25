"use client";

import { useState, useEffect } from "react";
import { getDoctorProfile } from "@/lib/firebase/db";

export function useDoctorProfile(doctorUid) {
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const loadDoctorProfile = async () => {
    if (!doctorUid) return;

    try {
      setProfileLoading(true);
      const profile = await getDoctorProfile(doctorUid);
      setDoctorProfile(profile);
    } catch (error) {
      console.error("Error loading doctor profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorProfile();
  }, [doctorUid]);

  return {
    doctorProfile,
    profileLoading,
    refreshProfile: loadDoctorProfile,
  };
}
