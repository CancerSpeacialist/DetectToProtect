import { Clock, CheckCircle, XCircle, Stethoscope } from "lucide-react";

export const cancerTypes = [
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
    icon: "🌬️",
    description: "Chest X-ray & CT analysis",
    color: "bg-green-100 text-green-800 border-green-200",
  },
];

// Appointment Status Configuration
export const statusConfig = {
  pending: {
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    label: "Pending",
  },
  accepted: {
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    label: "Accepted",
  },
  rejected: {
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    label: "Rejected",
  },
  completed: {
    color: "bg-blue-100 text-blue-800",
    icon: Stethoscope,
    label: "Completed",
  },
  cancelled: {
    color: "bg-gray-100 text-gray-800",
    icon: XCircle,
    label: "Cancelled",
  },
};

// Appointment Urgency Configuration
export const urgencyConfig = {
  low: { color: "bg-green-100 text-green-800", label: "Low Priority" },
  medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium Priority" },
  high: { color: "bg-red-100 text-red-800", label: "High Priority" },
};

export const statusOptions = [
  {
    value: "completed",
    label: "Completed",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "under_review",
    label: "Under Review",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "follow_up_needed",
    label: "Follow-up Needed",
    color: "bg-red-100 text-red-800",
  },
];

export const formatDate = (timestamp) => {
  if (!timestamp) return "Not set";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (date, time) => {
  if (!date || !time) return "Not scheduled";
  const dateObj = date.toDate ? date.toDate() : new Date(date);
  return `${dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })} at ${time}`;
};


// classification as Cancer or noCancer