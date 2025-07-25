import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { Loader } from "lucide-react";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Detect to Protect - AI Cancer Detection",
  description: "AI-powered cancer detection platform for patients and doctors",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Suspense fallback={<Loader />}>{children}</Suspense>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
