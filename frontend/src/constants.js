import { Clock, CheckCircle, XCircle, Stethoscope } from "lucide-react";

// Cancer Types
export const cancerTypes = [
  { id: "brain-tumor", name: "Brain Tumor/Cancer", icon: "🧠" },
  { id: "breast-cancer", name: "Breast Cancer", icon: "🎗️" },
  { id: "prostate-cancer", name: "Prostate Cancer", icon: "🔵" },
  { id: "pancreatic-cancer", name: "Pancreatic Cancer", icon: "🟡" },
  { id: "liver-cancer", name: "Liver Cancer", icon: "🟤" },
  { id: "esophagus-cancer", name: "Esophagus Cancer", icon: "🔴" },
  { id: "lung-cancer", name: "Lung Cancer", icon: "🫁" },
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
