import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    // "/doctor/sign-up",
    "/admin/sign-in",
    "/api", // Allow all API routes
    "/_next", // Next.js internals
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
  ];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected routes that require specific roles
  const protectedRoutes = {
    patient: ["/patient"],
    doctor: ["/doctor"],
    admin: ["/admin"],
  };

  // Check if accessing a role-specific protected route
  for (const role in protectedRoutes) {
    const routes = protectedRoutes[role];
    if (routes.some((route) => pathname.startsWith(route))) {
      // For now, let the layout components handle authentication
      // This middleware just ensures routing structure
      return NextResponse.next();
    }
  }

  // Default: allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico|txt|css|js|woff|woff2)).*)",
  ],
};
