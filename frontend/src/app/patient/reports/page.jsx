"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { cancerTypes } from "@/constants";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/lib/context/AuthContext";
import ReportDetailsModal from "@/components/patient/reports/ReportDetailsModal";
import ReportCard from "@/components/patient/reports/ReportCard";
import ReportsFilters from "@/components/patient/reports/ReportsFilters";
import StatsCards from "@/components/patient/reports/StatsCards";

export default function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    cancerType: "",
    classification: "",
    dateRange: "",
  });

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch screening history (reports)
      const reportsQuery = query(
        collection(db, "screening_history"),
        where("patientId", "==", user.uid),
        where("reportPdfUrl", "!=", ""), // Only get reports with PDF
        orderBy("reportPdfUrl"),
        orderBy("createdAt", "desc")
      );

      const reportsSnapshot = await getDocs(reportsQuery);
      const reportsData = reportsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Get unique doctor IDs
      const doctorIds = [
        ...new Set(reportsData.map((report) => report.doctorId)),
      ].filter(Boolean);

      // Fetch doctor details
      const doctorsData = {};
      for (const doctorId of doctorIds) {
        try {
          const doctorQuery = query(
            collection(db, "doctor"),
            where("uid", "==", doctorId)
          );
          const doctorSnapshot = await getDocs(doctorQuery);
          if (!doctorSnapshot.empty) {
            doctorsData[doctorId] = doctorSnapshot.docs[0].data();
          }
        } catch (error) {
          console.error(`Error fetching doctor ${doctorId}:`, error);
        }
      }

      setReports(reportsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  // Filter reports based on current filters
  const filteredReports = reports.filter((report) => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const doctor = doctors[report.doctorId];
      const doctorName = doctor
        ? `${doctor.firstName} ${doctor.lastName}`.toLowerCase()
        : "";
      const cancerTypeName =
        cancerTypes
          .find((t) => t.id === report.cancerType)
          ?.name.toLowerCase() || "";

      if (
        !doctorName.includes(searchTerm) &&
        !cancerTypeName.includes(searchTerm) &&
        !report.classification.toLowerCase().includes(searchTerm)
      ) {
        return false;
      }
    }

    // Cancer type filter
    if (filters.cancerType && report.cancerType !== filters.cancerType) {
      return false;
    }

    // Classification filter
    if (
      filters.classification &&
      report.classification !== filters.classification
    ) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const reportDate = report.createdAt?.seconds
        ? new Date(report.createdAt.seconds * 1000)
        : new Date(report.createdAt);
      const now = new Date();
      let cutoffDate;

      switch (filters.dateRange) {
        case "week":
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "quarter":
          cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "year":
          cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          return true;
      }

      if (reportDate < cutoffDate) {
        return false;
      }
    }

    return true;
  });

  // Statistics
  const stats = {
    total: reports.length,
    Cancer: reports.filter((r) => r.classification === "Cancer").length,
    noCancer: reports.filter((r) => r.classification === "noCancer").length,
    thisMonth: reports.filter((r) => {
      const reportDate = r.createdAt?.seconds
        ? new Date(r.createdAt.seconds * 1000)
        : new Date(r.createdAt);
      const now = new Date();
      const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
      return reportDate >= monthAgo;
    }).length,
  };

  const handleDownloadReport = (reportUrl) => {
    window.open(reportUrl, "_blank");
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      cancerType: "",
      classification: "",
      dateRange: "",
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Medical Reports
            </h1>
            <p className="text-gray-600 mt-1">
              View and download your medical screening reports
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">
              {stats.total}
            </span>
          </div>
        </div>

        {/* Statistics Cards */}
        <StatsCards stats={stats} />

        {/* Filters */}
        <ReportsFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
        />
        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {reports.length === 0
                  ? "No reports yet"
                  : "No reports match your filters"}
              </h3>
              <p className="text-gray-600">
                {reports.length === 0
                  ? "Your medical reports will appear here after screenings"
                  : "Try adjusting your search criteria"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReports.map((report) => {
              const doctor = doctors[report.doctorId];

              return (
                <ReportCard
                  key={report.id}
                  report={report}
                  doctor={doctor}
                  onViewReport={handleViewReport}
                  onDownloadReport={handleDownloadReport}
                />
              );
            })}
          </div>
        )}

        {/* Report Details Modal */}
        <ReportDetailsModal
          isOpen={showReportModal}
          onClose={setShowReportModal}
          selectedReport={selectedReport}
          doctors={doctors}
          onDownloadReport={handleDownloadReport}
        />
      </div>
    </div>
  );
}
