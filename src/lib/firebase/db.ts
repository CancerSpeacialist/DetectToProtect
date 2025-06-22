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
  AdminProfile,
  UserRole,
} from "../types/auth";

// Collections
export const COLLECTIONS = {
  USERS: "users",
  PATIENTS: "patients",
  DOCTORS: "doctors",
  ADMINS: "admins",
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
      medicalHistory: patientData.medicalHistory || [],
      allergies: patientData.allergies || [],
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
      isApproved: doctorData.isApproved || false,
      specialization: doctorData.specialization || [],
      qualifications: doctorData.qualifications || [],
    });
  } catch (error) {
    console.error("Error creating doctor profile:", error);
    throw new Error("Failed to create doctor profile");
  }
}

// Create admin profile
export async function createAdminProfile(
  uid: string,
  adminData: Partial<AdminProfile>
): Promise<void> {
  try {
    const adminRef = doc(db, COLLECTIONS.ADMINS, uid);
    const timestamp = serverTimestamp();

    await setDoc(adminRef, {
      ...adminData,
      uid,
      role: "admin" as UserRole,
      createdAt: timestamp,
      updatedAt: timestamp,
      permissions: adminData.permissions || ["read", "write", "delete"],
      isSuperAdmin: adminData.isSuperAdmin || false,
      lastLogin: timestamp,
    });
  } catch (error) {
    console.error("Error creating admin profile:", error);
    throw new Error("Failed to create admin profile");
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

// Get detailed profile based on role with proper type handling
export async function getDetailedProfile(
  uid: string,
  role: UserRole
): Promise<PatientProfile | DoctorProfile | AdminProfile | null> {
  try {
    let collectionName: string;
    switch (role) {
      case "patient":
        collectionName = COLLECTIONS.PATIENTS;
        break;
      case "doctor":
        collectionName = COLLECTIONS.DOCTORS;
        break;
      case "admin":
        collectionName = COLLECTIONS.ADMINS;
        break;
      default:
        return null;
    }

    const profileRef = doc(db, collectionName, uid);
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
      const profileData = profileSnap.data();

      // Convert Firestore timestamps to dates
      const baseProfile = {
        ...profileData,
        createdAt: profileData.createdAt?.toDate() || new Date(),
        updatedAt: profileData.updatedAt?.toDate() || new Date(),
      };

      // Handle role-specific type conversions
      switch (role) {
        case "patient":
          return {
            ...baseProfile,
            dateOfBirth: profileData.dateOfBirth?.toDate() || undefined,
            medicalHistory: profileData.medicalHistory || [],
            allergies: profileData.allergies || [],
          } as PatientProfile;

        case "doctor":
          return {
            ...baseProfile,
            specialization: profileData.specialization || [],
            qualifications: profileData.qualifications || [],
            isApproved: profileData.isApproved || false,
            experience: profileData.experience || 0,
            licenseNumber: profileData.licenseNumber || "",
            hospital: profileData.hospital || "",
          } as DoctorProfile;

        case "admin":
          return {
            ...baseProfile,
            permissions: profileData.permissions || ["read"],
            isSuperAdmin: profileData.isSuperAdmin || false,
            lastLogin: profileData.lastLogin?.toDate() || undefined,
          } as AdminProfile;

        default:
          return null;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting detailed profile:", error);
    return null;
  }
}

// Get patient profile specifically
export async function getPatientProfile(
  uid: string
): Promise<PatientProfile | null> {
  try {
    const patientRef = doc(db, COLLECTIONS.PATIENTS, uid);
    const patientSnap = await getDoc(patientRef);

    if (patientSnap.exists()) {
      const profileData = patientSnap.data();
      return {
        ...profileData,
        createdAt: profileData.createdAt?.toDate() || new Date(),
        updatedAt: profileData.updatedAt?.toDate() || new Date(),
        dateOfBirth: profileData.dateOfBirth?.toDate() || undefined,
        medicalHistory: profileData.medicalHistory || [],
        allergies: profileData.allergies || [],
      } as PatientProfile;
    }

    return null;
  } catch (error) {
    console.error("Error getting patient profile:", error);
    return null;
  }
}

// Get doctor profile specifically
export async function getDoctorProfile(
  uid: string
): Promise<DoctorProfile | null> {
  try {
    const doctorRef = doc(db, COLLECTIONS.DOCTORS, uid);
    const doctorSnap = await getDoc(doctorRef);

    if (doctorSnap.exists()) {
      const profileData = doctorSnap.data();
      return {
        ...profileData,
        createdAt: profileData.createdAt?.toDate() || new Date(),
        updatedAt: profileData.updatedAt?.toDate() || new Date(),
        specialization: profileData.specialization || [],
        qualifications: profileData.qualifications || [],
        isApproved: profileData.isApproved || false,
        experience: profileData.experience || 0,
        licenseNumber: profileData.licenseNumber || "",
        hospital: profileData.hospital || "",
      } as DoctorProfile;
    }

    return null;
  } catch (error) {
    console.error("Error getting doctor profile:", error);
    return null;
  }
}

// Get admin profile specifically
export async function getAdminProfile(
  uid: string
): Promise<AdminProfile | null> {
  try {
    const adminRef = doc(db, COLLECTIONS.ADMINS, uid);
    const adminSnap = await getDoc(adminRef);

    if (adminSnap.exists()) {
      const profileData = adminSnap.data();
      return {
        ...profileData,
        createdAt: profileData.createdAt?.toDate() || new Date(),
        updatedAt: profileData.updatedAt?.toDate() || new Date(),
        permissions: profileData.permissions || ["read"],
        isSuperAdmin: profileData.isSuperAdmin || false,
        lastLogin: profileData.lastLogin?.toDate() || undefined,
      } as AdminProfile;
    }

    return null;
  } catch (error) {
    console.error("Error getting admin profile:", error);
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

// Check if email exists in admins collection
export async function checkAdminExists(email: string): Promise<boolean> {
  try {
    const adminsRef = collection(db, COLLECTIONS.ADMINS);
    const q = query(adminsRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking admin exists:", error);
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

// Update admin last login
export async function updateAdminLastLogin(uid: string): Promise<void> {
  try {
    const adminRef = doc(db, COLLECTIONS.ADMINS, uid);
    await updateDoc(adminRef, {
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating admin last login:", error);
  }
}

// Get all patients (admin only)
export async function getAllPatients(): Promise<PatientProfile[]> {
  try {
    const patientsRef = collection(db, COLLECTIONS.PATIENTS);
    const querySnapshot = await getDocs(patientsRef);

    const patients: PatientProfile[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      patients.push({
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        dateOfBirth: data.dateOfBirth?.toDate() || undefined,
        medicalHistory: data.medicalHistory || [],
        allergies: data.allergies || [],
      } as PatientProfile);
    });

    return patients;
  } catch (error) {
    console.error("Error getting all patients:", error);
    return [];
  }
}

// Get all doctors (admin only)
export async function getAllDoctors(): Promise<DoctorProfile[]> {
  try {
    const doctorsRef = collection(db, COLLECTIONS.DOCTORS);
    const querySnapshot = await getDocs(doctorsRef);

    const doctors: DoctorProfile[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      doctors.push({
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        specialization: data.specialization || [],
        qualifications: data.qualifications || [],
        isApproved: data.isApproved || false,
        experience: data.experience || 0,
        licenseNumber: data.licenseNumber || "",
        hospital: data.hospital || "",
      } as DoctorProfile);
    });

    return doctors;
  } catch (error) {
    console.error("Error getting all doctors:", error);
    return [];
  }
}

// Get all admins (super admin only)
export async function getAllAdmins(): Promise<AdminProfile[]> {
  try {
    const adminsRef = collection(db, COLLECTIONS.ADMINS);
    const querySnapshot = await getDocs(adminsRef);

    const admins: AdminProfile[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      admins.push({
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        permissions: data.permissions || ["read"],
        isSuperAdmin: data.isSuperAdmin || false,
        lastLogin: data.lastLogin?.toDate() || undefined,
      } as AdminProfile);
    });

    return admins;
  } catch (error) {
    console.error("Error getting all admins:", error);
    return [];
  }
}

// Approve doctor (admin only)
export async function approveDoctorAccount(uid: string): Promise<void> {
  try {
    const doctorRef = doc(db, COLLECTIONS.DOCTORS, uid);
    await updateDoc(doctorRef, {
      isApproved: true,
      updatedAt: serverTimestamp(),
    });

    // Also update the user profile
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, {
      isVerified: true,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error approving doctor account:", error);
    throw new Error("Failed to approve doctor account");
  }
}

// Reject doctor (admin only)
export async function rejectDoctorAccount(uid: string): Promise<void> {
  try {
    const doctorRef = doc(db, COLLECTIONS.DOCTORS, uid);
    await updateDoc(doctorRef, {
      isApproved: false,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error rejecting doctor account:", error);
    throw new Error("Failed to reject doctor account");
  }
}
