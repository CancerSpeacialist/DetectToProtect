// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { auth } from '@/auth'

// export default async function middleware(request: NextRequest) {
//   // Use the auth() function to get the session
//   const session = await auth()

//   // List of public paths that don't require authentication
//   const publicPaths = ['/api/auth/signin', '/api/auth/error']
//   const isPublicPath = publicPaths.some(path =>
//     request.nextUrl.pathname.startsWith(path)
//   )

//   // Auth-related paths that shouldn't be protected or redirected
//   const authRelatedPaths = ['/api/auth']
//   const isAuthPath = authRelatedPaths.some(path =>
//     request.nextUrl.pathname.startsWith(path)
//   )

//   // Skip middleware for auth API routes
//   if (isAuthPath && request.nextUrl.pathname !== '/api/auth/signin' && request.nextUrl.pathname !== '/api/auth/error') {
//     return NextResponse.next()
//   }

//   if (!session && !isPublicPath) {
//     // Redirect unauthenticated users to login page
//     const signInUrl = new URL('/api/auth/signin', request.url)
//     signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
//     return NextResponse.redirect(signInUrl)
//   }

//   if (session && isPublicPath) {
//     // Redirect authenticated users to home page if they try to access auth pages
//     return NextResponse.redirect(new URL('/', request.url))
//   }

//   return NextResponse.next()
// }

// // Configure which routes use this middleware
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - public folder
//      * - Images and other static assets
//      */
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico|txt|css|js|woff|woff2)).*)',
//   ],
// }

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
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
  for (const [role, routes] of Object.entries(protectedRoutes)) {
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
