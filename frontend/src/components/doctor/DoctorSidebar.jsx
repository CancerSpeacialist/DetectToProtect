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
} from "lucide-react";

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
];

const cancerTypes = [
  {
    id: "brain-tumor",
    name: "Brain Tumor/Cancer",
    icon: "🧠",
    description: "MRI/CT scan analysis",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    id: "breast-cancer",
    name: "Breast Cancer",
    icon: "🎗️",
    description: "Mammography screening",
    color: "bg-pink-100 text-pink-800 border-pink-200",
  },
  {
    id: "prostate-cancer",
    name: "Prostate Cancer",
    icon: "🔵",
    description: "PSA & imaging analysis",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: "pancreatic-cancer",
    name: "Pancreatic Cancer",
    icon: "🟡",
    description: "CT/MRI scan evaluation",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  {
    id: "liver-cancer",
    name: "Liver Cancer",
    icon: "🟤",
    description: "Hepatic imaging analysis",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  {
    id: "esophagus-cancer",
    name: "Esophagus Cancer",
    icon: "🔴",
    description: "Endoscopy & imaging",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  {
    id: "lung-cancer",
    name: "Lung Cancer",
    icon: "🫁",
    description: "Chest X-ray & CT analysis",
    color: "bg-green-100 text-green-800 border-green-200",
  },
];

function DoctorSidebar({ user, doctorProfile, isOpen, onToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
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
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  HealthAI
                </h2>
              )}

              <div className="flex items-center gap-2">
                {/* Collapse button - desktop only */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hidden lg:flex h-8 w-8 p-0"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </Button>

                {/* Close button - mobile only */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="lg:hidden h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Doctor Profile Section */}
          {!isCollapsed && (
            <div className="p-4 border-b border-gray-100">
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
                  <Badge
                    variant="secondary"
                    className="mt-1 bg-green-100 text-green-700 text-xs"
                  >
                    Online
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
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

          {/* Footer */}
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-100">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs font-medium text-blue-900 mb-1">
                  AI-Powered Healthcare
                </p>
                <p className="text-xs text-blue-700 mb-2">
                  Advanced cancer screening & diagnosis
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs h-8"
                >
                  Learn More
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancer Types Grid Overlay - Mobile Alternative */}
      {showCancerTypes && isCollapsed && (
        <div className="fixed left-16 top-0 w-80 h-full bg-white border-r border-gray-200 z-40 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Cancer Screening
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCancerTypes(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-3">
            {cancerTypes.map((cancerType) => (
              <Card
                key={cancerType.id}
                className={`
                  cursor-pointer transition-all duration-200 hover:shadow-md border
                  ${cancerType.color}
                `}
                onClick={() => handleCancerTypeClick(cancerType)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cancerType.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{cancerType.name}</p>
                      <p className="text-xs opacity-75">
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
    </>
  );
}

export default DoctorSidebar;
