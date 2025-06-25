"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { getUserProfile } from "../firebase/db";
import {
  signUpPatient,
  signInUser,
  signInAdmin,
  signOutUser,
  resetUserPassword,
} from "../firebase/auth";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
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

  const signIn = async (email, password) => {
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

  const signUp = async (userData) => {
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

  const adminSignIn = async (credentials) => {
    try {
      const { user: firebaseUser, role } = await signInAdmin(credentials);
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

  const resetPassword = async (email) => {
    try {
      await resetUserPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    adminSignIn,
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
