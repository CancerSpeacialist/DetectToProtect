import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import {
  User,
  PatientProfile,
  DoctorProfile,
  UserRole,
} from "@/lib/types/auth";

// Collections
export const COLLECTIONS = {
  USERS: "users",
  PATIENTS: "patients",
  DOCTORS: "doctors",
  APPOINTMENTS: "appointments",
  REPORTS: "reports",
} as const;

// Create user profile in Firestore
export async function createUserProfile(
  uid: string,
  userData: Partial<User>
): Promise<void> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const timestamp = serverTimestamp();

    await setDoc(userRef, {
      ...userData,
      uid,
      createdAt: timestamp,
      updatedAt: timestamp,
      isVerified: false,
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw new Error("Failed to create user profile");
  }
}

// Create patient profile
export async function createPatientProfile(
  uid: string,
  patientData: Partial<PatientProfile>
): Promise<void> {
  try {
    const patientRef = doc(db, COLLECTIONS.PATIENTS, uid);
    const timestamp = serverTimestamp();

    await setDoc(patientRef, {
      ...patientData,
      uid,
      role: "patient" as UserRole,
      createdAt: timestamp,
      updatedAt: timestamp,
      medicalHistory: [],
      allergies: [],
    });
  } catch (error) {
    console.error("Error creating patient profile:", error);
    throw new Error("Failed to create patient profile");
  }
}

// Create doctor profile (admin only)
export async function createDoctorProfile(
  uid: string,
  doctorData: Partial<DoctorProfile>
): Promise<void> {
  try {
    const doctorRef = doc(db, COLLECTIONS.DOCTORS, uid);
    const timestamp = serverTimestamp();

    await setDoc(doctorRef, {
      ...doctorData,
      uid,
      role: "doctor" as UserRole,
      createdAt: timestamp,
      updatedAt: timestamp,
      isApproved: false,
      specialization: doctorData.specialization || [],
      qualifications: doctorData.qualifications || [],
    });
  } catch (error) {
    console.error("Error creating doctor profile:", error);
    throw new Error("Failed to create doctor profile");
  }
}

// Get user profile
export async function getUserProfile(uid: string): Promise<User | null> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        ...userData,
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date(),
      } as User;
    }

    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

// Get detailed profile based on role
export async function getDetailedProfile(
  uid: string,
  role: UserRole
): Promise<PatientProfile | DoctorProfile | null> {
  try {
    const collection =
      role === "patient" ? COLLECTIONS.PATIENTS : COLLECTIONS.DOCTORS;
    const profileRef = doc(db, collection, uid);
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
      const profileData = profileSnap.data();
      return {
        ...profileData,
        createdAt: profileData.createdAt?.toDate() || new Date(),
        updatedAt: profileData.updatedAt?.toDate() || new Date(),
        dateOfBirth: profileData.dateOfBirth?.toDate() || undefined,
      } as PatientProfile | DoctorProfile;
    }

    return null;
  } catch (error) {
    console.error("Error getting detailed profile:", error);
    return null;
  }
}

// Check if email exists in doctors collection
export async function checkDoctorExists(email: string): Promise<boolean> {
  try {
    const doctorsRef = collection(db, COLLECTIONS.DOCTORS);
    const q = query(doctorsRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking doctor exists:", error);
    return false;
  }
}

// Update user profile
export async function updateUserProfile(
  uid: string,
  updates: Partial<User>
): Promise<void> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
}
