"use client";

// Importing necessary dependencies and UI components
import { useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Dropdown menu UI components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Navigation menu components
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

// Avatar and badge UI elements
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Icons used in the navbar
import {
  Bell,
  Calendar,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Heart,
  Activity,
  Shield,
  Home,
  FileText,
  Phone,
} from "lucide-react";
import Link from "next/link"; 

export default function PatientNavbar() {
  // Extract user info and logout method from auth context
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Dummy notifications count (you could replace this with dynamic data later)
  const [notifications] = useState(3);

  // Sign-out function: logs out and redirects to sign-in page
  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo and Brand Name */}
          <div className="flex items-center space-x-4">
            <Link
              href="/patient/dashboard"
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" /> {/* Logo icon */}
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                DetectToProtect
              </span>
            </Link>
          </div>

          {/* Center: Navigation Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Dashboard Link */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/patient/dashboard"
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Cancer Screening Dropdown */}
                {/* <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Cancer Screening
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[500px] lg:w-[600px] lg:grid-cols-2">
                      {cancerTypes.map((cancer) => (
                        <Link
                          key={cancer.id}
                          href={`/patient/screening/${cancer.id}`}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{cancer.icon}</div>
                            <div>
                              <div className="text-sm leading-none font-medium group-hover:text-blue-600">
                                {cancer.name}
                              </div>
                              <p className="text-xs line-clamp-2 leading-snug text-muted-foreground mt-1">
                                {cancer.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem> */}

                {/* Appointments Link */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/patient/appointments"
                    className="group bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 inline-flex h-10 w-max items-center justify-center rounded-md"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Reports Link */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/patient/reports"
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    My Reports
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right: Notifications and User Dropdown */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {/* Badge showing number of notifications */}
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center bg-red-500">
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 pl-2"
                >
                  <Avatar className="w-8 h-8">
                    {/* User image or initials */}
                    <AvatarImage src="/defaultPfp.png" />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {/* Show name and role on medium+ screens */}
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-xs text-gray-500">Patient</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              {/* Dropdown Menu Items */}
              <DropdownMenuContent className="w-56" align="end">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />

                {/* Links to various user pages */}
                <DropdownMenuItem asChild>
                  <Link href="/patient/profile" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/patient/health-summary"
                    className="flex items-center"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Health Summary
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/patient/settings" className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/patient/support" className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Support
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
