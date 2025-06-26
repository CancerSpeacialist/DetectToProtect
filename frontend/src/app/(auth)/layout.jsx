"use client";

import Loader from "@/components/ui/Loader";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";

export default function AuthLayout({ children }) {
  const { user, loading } = useRoleRedirect("redirectByRole", {
    delay: 500,
    fallback: "/sign-in",
  });

  if (loading) {
    return <Loader />;
  }

  // Don't render auth forms if user is already authenticated
  if (user) {
    return null;
  }

  return <div className="min-h-screen">{children}</div>;
}