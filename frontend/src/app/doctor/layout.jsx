import DoctorLayoutClient from "@/components/doctor/DoctorLayoutClient";

export const metadata = {
  title: "Doctor Dashboard - Detect to Protect",
  description: "Doctor dashboard for AI-powered cancer detection platform",
};

export default function DoctorLayout({ children }) {
  return <DoctorLayoutClient>{children}</DoctorLayoutClient>;
}
