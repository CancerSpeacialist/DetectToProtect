export type UserRole = 'patient' | 'doctor' | 'admin'

export interface User {
  uid: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
  profileImage?: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PatientProfile extends User {
  role: 'patient'
  dateOfBirth?: Date
  phoneNumber?: string
  address?: string
  emergencyContact?: {
    name: string
    phone: string
    relation: string
  }
  medicalHistory?: string[]
  allergies?: string[]
}

export interface DoctorProfile extends User {
  role: 'doctor'
  licenseNumber: string
  specialization: string[]
  hospital: string
  experience: number
  qualifications: string[]
  consultationFee?: number
  availability?: {
    days: string[]
    hours: string
  }
  isApproved: boolean
}

// Separate interface for signup data that includes password
export interface PatientSignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
  dateOfBirth?: Date
  phoneNumber?: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (userData: PatientSignUpData) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}