import { Clock, CheckCircle, XCircle, Stethoscope } from "lucide-react";

export const cancerTypes = [
  {
    key: "brain-tumor",
    name: "Brain Tumor/Cancer",
    icon: "🧠",
    description: "MRI/CT scan analysis",
  },
  {
    key: "breast-cancer",
    name: "Breast Cancer",
    icon: "🎗️",
    description: "Mammography screening",
  },
  {
    key: "prostate-cancer",
    name: "Prostate Cancer",
    icon: "🔵",
    description: "PSA & imaging analysis",
  },
  {
    key: "pancreatic-cancer",
    name: "Pancreatic Cancer",
    icon: "🟡",
    description: "CT/MRI scan evaluation",
  },
  {
    key: "liver-cancer",
    name: "Liver Cancer",
    icon: "🟤",
    description: "Hepatic imaging analysis",
  },
  {
    key: "esophagus-cancer",
    name: "Esophagus Cancer",
    icon: "🔴",
    description: "Endoscopy & imaging",
  },
  {
    key: "lung-cancer",
    name: "Lung Cancer",
    icon: "🌬️",
    description: "Chest X-ray & CT analysis",
  },
];

// Appointment Status Configuration
export const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
  accepted: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
  completed: { color: "bg-blue-100 text-blue-800", icon: Stethoscope },
  cancelled: { color: "bg-gray-100 text-gray-800", icon: XCircle },
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
