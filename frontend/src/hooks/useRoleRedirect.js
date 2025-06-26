"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

const ROLE_REDIRECTS = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  admin: "/admin/dashboard",
};

export function useRoleRedirect(requireRole = null, options = {}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  // Default options
  const {
    delay = 0,
    fallback = "/sign-in", // Fallback route
  } = options;

  useEffect(() => {
    if (loading) return;

    if (user) {
      // Set redirecting state if delay is specified
      if (delay > 0) {
        setRedirecting(true);
      }

      const executeRedirect = () => {
        // If requireRole is "redirectByRole", redirect any authenticated user to their dashboard
        if (requireRole === "redirectByRole") {
          const defaultRedirect = ROLE_REDIRECTS[user.role] || fallback;
          router.push(defaultRedirect);
          return;
        }

        if (requireRole && user.role !== requireRole) {
          const defaultRedirect = ROLE_REDIRECTS[user.role] || fallback;
          router.push(defaultRedirect);
          return;
        }
      };

      // Apply delay if specified, otherwise redirect immediately
      if (delay > 0) {
        const timer = setTimeout(executeRedirect, delay);
        return () => clearTimeout(timer);
      } else {
        executeRedirect();
      }
    } else {
      // If no user, redirect to fallback route
      router.push(fallback);
      return;
    }
  }, [user, loading, router, delay, requireRole, fallback]);

  return { user, loading, redirecting, signOut };
}
