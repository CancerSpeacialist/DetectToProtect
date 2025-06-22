import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";
import { auth } from "./config";
import {
  createUserProfile,
  createPatientProfile,
  getUserProfile,
  checkDoctorExists,
} from "./db";
import { PatientSignUpData, UserRole } from "../types/auth";

// Sign up new patient
export async function signUpPatient(
  userData: PatientSignUpData
): Promise<FirebaseUser> {
  try {
    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    const user = userCredential.user;

    // Update display name
    await updateProfile(user, {
      displayName: `${userData.firstName} ${userData.lastName}`,
    });

    // Create user profile in Firestore
    await createUserProfile(user.uid, {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: "patient",
    });

    // Create detailed patient profile (without password)
    await createPatientProfile(user.uid, {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      dateOfBirth: userData.dateOfBirth,
      phoneNumber: userData.phoneNumber,
      uid: user.uid,
      role: "patient",
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return user;
  } catch (error: any) {
    console.error("Error signing up patient:", error);
    throw new Error(error.message || "Failed to create account");
  }
}

// Sign in user
export async function signInUser(
  email: string,
  password: string
): Promise<{
  user: FirebaseUser;
  role: UserRole;
}> {
  try {
    // Check if user is trying to sign in as doctor
    const isDoctorEmail = await checkDoctorExists(email);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Get user profile to determine role
    const userProfile = await getUserProfile(user.uid);

    if (!userProfile) {
      throw new Error("User profile not found");
    }

    // Verify role matches expectation
    if (isDoctorEmail && userProfile.role !== "doctor") {
      throw new Error("Invalid credentials for doctor account");
    }

    return {
      user,
      role: userProfile.role,
    };
  } catch (error: any) {
    console.error("Error signing in:", error);
    throw new Error(error.message || "Failed to sign in");
  }
}

// Sign out user
export async function signOutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw new Error("Failed to sign out");
  }
}

// Reset password
export async function resetUserPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Error resetting password:", error);
    throw new Error(error.message || "Failed to send reset email");
  }
}
