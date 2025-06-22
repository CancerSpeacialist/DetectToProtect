"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "../firebase/config";
import { getUserProfile, getDetailedProfile } from "../firebase/db";
import {
  User,
  PatientProfile,
  DoctorProfile,
  AuthContextType,
  PatientSignUpData,
} from "../types/auth";
import {
  signUpPatient,
  signInUser,
  signOutUser,
  resetUserPassword,
} from "../firebase/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          if (userProfile) {
            setUser(userProfile);
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { user: firebaseUser, role } = await signInUser(email, password);
      const userProfile = await getUserProfile(firebaseUser.uid);
      if (userProfile) {
        setUser(userProfile);
      }
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (userData: PatientSignUpData) => {
    try {
      const firebaseUser = await signUpPatient(userData);

      const userProfile = await getUserProfile(firebaseUser.uid);
      if (userProfile) {
        setUser(userProfile);
      }
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await signOutUser();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await resetUserPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
