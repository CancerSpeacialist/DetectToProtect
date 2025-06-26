import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
  arrayUnion,
} from "firebase/firestore";
import { db } from "./config";

// Collections
export const COLLECTIONS = {
  USERS: "users",
  PATIENTS: "patients",
  DOCTORS: "doctors",
  ADMINS: "admins",
  APPOINTMENTS: "appointments",
  REPORTS: "reports",
};

// Create user profile in Firestore
export async function createUserProfile(uid, userData) {
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
export async function createPatientProfile(uid, patientData) {
  try {
    const patientRef = doc(db, COLLECTIONS.PATIENTS, uid);
    const timestamp = serverTimestamp();

    await setDoc(patientRef, {
      ...patientData,
      uid,
      role: "patient",
      createdAt: timestamp,
      updatedAt: timestamp,
      // medicalHistory: patientData.medicalHistory || [],
      // allergies: patientData.allergies || [],
    });
  } catch (error) {
    console.error("Error creating patient profile:", error);
    throw new Error("Failed to create patient profile");
  }
}

// Create admin profile
export async function createAdminProfile(uid, adminData) {
  try {
    const adminRef = doc(db, COLLECTIONS.ADMINS, uid);
    const timestamp = serverTimestamp();

    await setDoc(adminRef, {
      ...adminData,
      uid,
      role: "admin",
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
export async function getUserProfile(uid) {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        ...userData,
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date(),
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

// Get detailed profile based on role with proper type handling    NOT USED ANYWHERE
// export async function getDetailedProfile(uid, role) {
//   try {
//     let collectionName;
//     switch (role) {
//       case "patient":
//         collectionName = COLLECTIONS.PATIENTS;
//         break;
//       case "doctor":
//         collectionName = COLLECTIONS.DOCTORS;
//         break;
//       case "admin":
//         collectionName = COLLECTIONS.ADMINS;
//         break;
//       default:
//         return null;
//     }

//     const profileRef = doc(db, collectionName, uid);
//     const profileSnap = await getDoc(profileRef);

//     if (profileSnap.exists()) {
//       const profileData = profileSnap.data();

//       // Convert Firestore timestamps to dates
//       const baseProfile = {
//         ...profileData,
//         createdAt: profileData.createdAt?.toDate() || new Date(),
//         updatedAt: profileData.updatedAt?.toDate() || new Date(),
//       };

//       // Handle role-specific type conversions
//       switch (role) {
//         case "patient":
//           return {
//             ...baseProfile,
//             dateOfBirth: profileData.dateOfBirth?.toDate() || undefined,
//             // medicalHistory: profileData.medicalHistory || [],
//             // allergies: profileData.allergies || [],
//           };

//         case "doctor":
//           return {
//             ...baseProfile,
//             specialization: profileData.specialization || [],
//             qualifications: profileData.qualifications || [],
//             isApproved: profileData.isApproved || false,
//             experience: profileData.experience || 0,
//             licenseNumber: profileData.licenseNumber || "",
//             hospital: profileData.hospital || "",
//           };

//         case "admin":
//           return {
//             ...baseProfile,
//             permissions: profileData.permissions || ["read"],
//             isSuperAdmin: profileData.isSuperAdmin || false,
//             lastLogin: profileData.lastLogin?.toDate() || undefined,
//           };

//         default:
//           return null;
//       }
//     }

//     return null;
//   } catch (error) {
//     console.error("Error getting detailed profile:", error);
//     return null;
//   }
// }

// Get patient profile specifically

export async function getPatientProfile(uid) {
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
        // medicalHistory: profileData.medicalHistory || [],
        // allergies: profileData.allergies || [],
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting patient profile:", error);
    return null;
  }
}

export async function getDoctorProfile(uid) {
  try {
    const doctorRef = doc(db, COLLECTIONS.DOCTORS, uid);
    const doctorSnap = await getDoc(doctorRef);

    if (doctorSnap.exists()) {
      const profileData = doctorSnap.data();
      const profile = {
        ...profileData,
        createdAt: profileData.createdAt?.toDate() || new Date(),
        updatedAt: profileData.updatedAt?.toDate() || new Date(),
        specialization: profileData.specialization || [],
        qualifications: profileData.qualifications || [],
        isApproved: profileData.isApproved || false,
        profileCompleted: profileData.profileCompleted || false,
        experience: profileData.experience || 0,
        licenseNumber: profileData.licenseNumber || "",
        hospital: profileData.hospital || "",
      };

      return profile;
    }

    return null;
  } catch (error) {
    console.error("Error getting doctor profile:", error);
    return null;
  }
}

// Get admin profile specifically
export async function getAdminProfile(uid) {
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
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting admin profile:", error);
    return null;
  }
}

// Check if email exists in doctors collection
export async function checkDoctorExists(email) {
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
export async function checkAdminExists(email) {
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
export async function updateUserProfile(uid, updates) {
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
export async function updateAdminLastLogin(uid) {
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
export async function getAllPatients() {
  try {
    const patientsRef = collection(db, COLLECTIONS.PATIENTS);
    const querySnapshot = await getDocs(patientsRef);

    const patients = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      patients.push({
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        dateOfBirth: data.dateOfBirth?.toDate() || undefined,
        // medicalHistory: data.medicalHistory || [],
        // allergies: data.allergies || [],
      });
    });

    return patients;
  } catch (error) {
    console.error("Error getting all patients:", error);
    return [];
  }
}

// Get all doctors (admin only)
export async function getAllDoctors() {
  try {
    const doctorsRef = collection(db, COLLECTIONS.DOCTORS);
    const querySnapshot = await getDocs(doctorsRef);

    const doctors = [];
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
      });
    });

    return doctors;
  } catch (error) {
    console.error("Error getting all doctors:", error);
    return [];
  }
}

// Get all admins (super admin only)
export async function getAllAdmins() {
  try {
    const adminsRef = collection(db, COLLECTIONS.ADMINS);
    const querySnapshot = await getDocs(adminsRef);

    const admins = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      admins.push({
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        permissions: data.permissions || ["read"],
        isSuperAdmin: data.isSuperAdmin || false,
        lastLogin: data.lastLogin?.toDate() || undefined,
      });
    });

    return admins;
  } catch (error) {
    console.error("Error getting all admins:", error);
    return [];
  }
}

// Approve doctor (admin only)
export async function approveDoctorAccount(uid) {
  try {
    const doctorRef = doc(db, COLLECTIONS.DOCTORS, uid);
    await updateDoc(doctorRef, {
      isApproved: true,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error approving doctor account:", error);
    throw new Error("Failed to approve doctor account");
  }
}

// Reject doctor (admin only)
export async function rejectDoctorAccount(uid) {
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

export async function completeDoctorProfile(uid, profileData) {
  try {
    const doctorRef = doc(db, COLLECTIONS.DOCTORS, uid);
    const timestamp = serverTimestamp();

    await updateDoc(doctorRef, {
      ...profileData,
      profileCompleted: true,
      updatedAt: timestamp,
    });
  } catch (error) {
    console.error("Error completing doctor profile:", error);
    throw new Error("Failed to complete doctor profile");
  }
}

// Create doctor profile (admin only)
export async function createDoctorProfile(uid, doctorData) {
  try {
    const doctorRef = doc(db, COLLECTIONS.DOCTORS, uid);
    const timestamp = serverTimestamp();

    await setDoc(doctorRef, {
      ...doctorData,
      uid,
      role: "doctor",
      createdAt: timestamp,
      updatedAt: timestamp,
      isApproved: doctorData.isApproved || false,
      profileCompleted: doctorData.profileCompleted || false,
      specialization: doctorData.specialization || [],
      qualifications: doctorData.qualifications || [],
      experience: doctorData.experience || 0,
    });
  } catch (error) {
    console.error("Error creating doctor profile:", error);
    throw new Error("Failed to create doctor profile");
  }
}

// Get incomplete doctor profiles (for admin dashboard)
export async function getAllIncompleteDoctorProfiles() {
  try {
    const doctorsRef = collection(db, COLLECTIONS.DOCTORS);
    const q = query(doctorsRef, where("profileCompleted", "==", false));
    const querySnapshot = await getDocs(q);

    const incompleteDoctors = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      incompleteDoctors.push({
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        specialization: data.specialization || [],
        qualifications: data.qualifications || [],
        isApproved: data.isApproved || false,
        profileCompleted: data.profileCompleted || false,
        experience: data.experience || 0,
      });
    });

    return incompleteDoctors;
  } catch (error) {
    console.error("Error getting incomplete doctor profiles:", error);
    return [];
  }
}

// Book an appointment and update references in patient & doctor docs
export async function bookAppointment(appointmentData) {
  // 1. Add appointment and get the doc ref
  const docRef = await addDoc(collection(db, COLLECTIONS.APPOINTMENTS), {
    ...appointmentData,
    requestedDate: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // 2. Update the appointment with its own ID
  await updateDoc(docRef, { appointmentId: docRef.id });

  // 3. Add appointmentId to patient's appointments array
  const patientRef = doc(db, COLLECTIONS.PATIENTS, appointmentData.patientId);
  await updateDoc(patientRef, {
    appointments: arrayUnion(docRef.id),
  });

  // 4. Add appointmentId to doctor's appointments array
  const doctorRef = doc(db, COLLECTIONS.DOCTORS, appointmentData.doctorId);
  await updateDoc(doctorRef, {
    appointments: arrayUnion(docRef.id),
  });

  return docRef.id;
}

// Fetch all approved and profile-completed doctors (Verified)
export async function getAllVerifiedDoctors() {
  const doctorsQuery = query(
    collection(db, COLLECTIONS.DOCTORS),
    where("isApproved", "==", true),
    where("profileCompleted", "==", true)
  );
  const doctorsSnapshot = await getDocs(doctorsQuery);
  return doctorsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Reject the  appointment of a patient
export async function rejectAppointment(
  appointmentId,
  { rejectionReason, doctorNotes }
) {
  const appointmentRef = doc(db, COLLECTIONS.APPOINTMENTS, appointmentId);
  await updateDoc(appointmentRef, {
    status: "rejected",
    rejectionReason,
    doctorNotes,
    updatedAt: serverTimestamp(),
  });
}

// Accept the appointment of a patient
export async function acceptAppointment(
  appointmentId,
  { appointmentDate, appointmentTime, doctorNotes }
) {
  const appointmentRef = doc(db, COLLECTIONS.APPOINTMENTS, appointmentId);
  await updateDoc(appointmentRef, {
    status: "accepted",
    appointmentDate: appointmentDate,
    appointmentTime,
    doctorNotes,
    updatedAt: serverTimestamp(),
  });
}


// FirebaseError: The query requires an index. You can create it here: 
// https://console.firebase.google.com/v1/r/project/detecttoprotect-8e2f2/firestore/indexes?create_composite=Clpwcm9qZWN0cy9kZXRlY3R0b3Byb3RlY3QtOGUyZjIvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2FwcG9pbnRtZW50cy9pbmRleGVzL18QARoMCghkb2N0b3JJZBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI

// Fetch appointments for a doctor and their patients' details
export async function getDoctorAppointmentsWithPatients(doctorUid) {
  // Fetch appointments for this doctor
  const appointmentsQuery = query(
    collection(db, COLLECTIONS.APPOINTMENTS),
    where("doctorId", "==", doctorUid),
    orderBy("createdAt", "desc")
  );
  const appointmentsSnapshot = await getDocs(appointmentsQuery);
  const appointmentsData = appointmentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Get unique patient IDs
  const patientIds = [...new Set(appointmentsData.map((apt) => apt.patientId))];

  // Fetch patient details
  const patientsData = {};
  for (const patientId of patientIds) {
    const patientQuery = query(
      collection(db, COLLECTIONS.PATIENTS),
      where("uid", "==", patientId)
    );
    const patientSnapshot = await getDocs(patientQuery);
    if (!patientSnapshot.empty) {
      patientsData[patientId] = patientSnapshot.docs[0].data();
    }
  }

  return { appointments: appointmentsData, patients: patientsData };
}
