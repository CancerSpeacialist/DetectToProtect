"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import Loader from "@/components/ui/Loader";

export default function AdminRootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user && user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/admin/sign-in");
      }
    }
  }, [user, loading, router]);

  return <Loader />;
}

/// Change this page to LAyout. Since this should be in layout.jsx
