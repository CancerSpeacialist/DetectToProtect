export type UserRole = "patient" | "doctor" | "admin";

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  profileImage?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientProfile extends User {
  role: "patient";
  dateOfBirth?: Date;
  phoneNumber?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  medicalHistory?: string[];
  allergies?: string[];
}

export interface DoctorProfile extends User {
  role: "doctor";
  licenseNumber?: string; // Made optional for initial creation
  specialization?: string[]; // Made optional for initial creation
  hospital?: string; // Made optional for initial creation
  experience?: number; // Made optional for initial creation
  qualifications?: string[]; // Made optional for initial creation
  consultationFee?: number;
  availability?: {
    days: string[];
    hours: string;
  };
  isApproved: boolean;
  profileCompleted: boolean; // New field to track profile completion
  phoneNumber?: string;
  address?: string;
}

export interface AdminProfile extends User {
  role: "admin";
  permissions: string[];
  lastLogin?: Date;
  isSuperAdmin: boolean;
}

// Separate interface for signup data that includes password
export interface PatientSignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
}

export interface AdminSignInData {
  email: string;
  password: string;
}

// New interface for admin creating doctor accounts
export interface CreateDoctorData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

// Interface for doctor completing their profile
export interface CompleteDoctorProfileData {
  licenseNumber: string;
  specialization: string[];
  hospital: string;
  experience: number;
  qualifications: string[];
  phoneNumber?: string;
  address?: string;
  consultationFee?: number;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: PatientSignUpData) => Promise<void>;
  adminSignIn: (credentials: AdminSignInData) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
