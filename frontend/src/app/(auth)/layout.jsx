"use client";

import { useRoleRedirect } from "@/hooks/useRoleRedirect";
import { Loader2 } from "lucide-react";

export default function AuthLayout({ children }) {
  const { user, loading } = useRoleRedirect();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Don't render auth forms if user is already authenticated
  if (user) {
    return null;
  }

  return <div className="min-h-screen">{children}</div>;
}