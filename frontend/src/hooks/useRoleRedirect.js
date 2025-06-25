"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

const ROLE_REDIRECTS = {
  patient: '/patient/dashboard',
  doctor: '/doctor/dashboard',
  admin: '/admin/dashboard',
};

export function useRoleRedirect(redirectTo = null, options = {}) {
  const { user, loading , signOut} = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  // Default options
  const {
    delay = 0,          
    fallback = '/sign-in' // Fallback route
  } = options;

  useEffect(() => {
    if (loading) return;

    if (user) {
      // Set redirecting state if delay is specified
      if (delay > 0) {
        setRedirecting(true);
      }

      const executeRedirect = () => {
        // If specific redirect is provided, use it
        if (redirectTo) {
          router.push(redirectTo);
          return;
        }

        // Otherwise, redirect based on role
        const defaultRedirect = ROLE_REDIRECTS[user.role] || fallback;
        router.push(defaultRedirect);
      };

      // Apply delay if specified, otherwise redirect immediately
      if (delay > 0) {
        const timer = setTimeout(executeRedirect, delay);
        return () => clearTimeout(timer);
      } else {
        executeRedirect();
      }
    }
    else {
      // If no user, redirect to fallback route
      router.push(fallback);
    }
  }, [user, loading, router, redirectTo, delay, fallback]);

  return { user, loading, redirecting, signOut };
}