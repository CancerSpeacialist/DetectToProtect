import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  Users,
  Image,
  Stethoscope,
  FileText,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  NotebookPenIcon,
} from "lucide-react";
import { cancerTypes } from "@/constants";

const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/doctor/dashboard",
  },
  {
    title: "Patient Management",
    icon: Users,
    href: "/doctor/patients",
  },
  {
    title: "Cancer Screening",
    icon: Image,
    href: "/doctor/screening",
    hasDropdown: true,
  },
  {
    title: "Diagnosis Input",
    icon: Stethoscope,
    href: "/doctor/diagnosis",
  },
  {
    title: "Reports",
    icon: FileText,
    href: "/doctor/reports",
  },
  {
    title: "Consultations",
    icon: Calendar,
    href: "/doctor/consultations",
  },
  {
    title: "Appointments",
    icon: NotebookPenIcon,
    href: "/doctor/appointments",
  },
];

function DoctorSidebar({ user, doctorProfile, isOpen, onToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(!isOpen);
  const [showCancerTypes, setShowCancerTypes] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (item) => {
    if (item.hasDropdown) {
      setShowCancerTypes(!showCancerTypes);
    } else {
      router.push(item.href);
      // Close mobile sidebar after navigation
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        onToggle();
      }
    }
  };

  const handleCancerTypeClick = (cancerType) => {
    router.push(`/doctor/screening/${cancerType.id}`);
    setShowCancerTypes(false);
    // Close mobile sidebar after navigation
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      onToggle();
    }
  };

  const isActiveRoute = (href) => {
    if (!pathname) return false;

    if (href === "/doctor/screening") {
      return pathname.startsWith("/doctor/screening");
    }
    return pathname === href;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed h-full inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isCollapsed ? "w-16" : "w-64"}
        lg:static lg:block
      `}
        onMouseEnter={() => {
          onToggle();
          return isCollapsed && setIsCollapsed(false);
        }}
        onMouseLeave={() => {
          onToggle();
          return !isCollapsed && setIsCollapsed(true);
        }}
      >
        <div className="flex flex-col h-full ">
          {/* Doctor Profile Section */}
          {!isCollapsed && (
            <div className="p-4 border-b border-gray-100 mt-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                  <AvatarImage
                    src="/defaultPfp.png"
                    alt={`Dr. ${user?.firstName}`}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    Dr. {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {doctorProfile?.specialization || "General Practice"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto mt-4">
            {menuItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              const Icon = item.icon;

              return (
                <div key={item.title}>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation(item)}
                    className={`
                      w-full justify-start h-11 transition-all duration-200
                      ${isCollapsed ? "px-3" : "px-3"}
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon
                      className={`${
                        isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
                      } flex-shrink-0`}
                    />
                    {!isCollapsed && (
                      <>
                        <span className="truncate flex-1 text-left">
                          {item.title}
                        </span>
                        {item.hasDropdown && (
                          <div className="ml-2">
                            {showCancerTypes ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </Button>

                  {/* Cancer Types Dropdown */}
                  {item.hasDropdown && showCancerTypes && !isCollapsed && (
                    <div className="mt-2 ml-4 space-y-2 pb-2">
                      <div className="grid gap-2">
                        {cancerTypes.map((cancerType) => (
                          <Card
                            key={cancerType.id}
                            className={`
                              cursor-pointer transition-all duration-200 hover:shadow-md border
                              ${cancerType.color}
                            `}
                            onClick={() => handleCancerTypeClick(cancerType)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
                                  {cancerType.icon}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">
                                    {cancerType.name}
                                  </p>
                                  <p className="text-xs opacity-75 truncate">
                                    {cancerType.description}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

export default DoctorSidebar;
