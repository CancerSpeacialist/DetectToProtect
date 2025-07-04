"use client";

import Loader from "@/components/ui/Loader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

export default function AuthLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.role === "admin") {
      router.replace("/admin/sign-in");
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loader />;
  }
  // Don't render auth forms if user is admin
  if (user && user.role === "admin") {
    return null;
  }

  return <div className="min-h-screen">{children}</div>;
}