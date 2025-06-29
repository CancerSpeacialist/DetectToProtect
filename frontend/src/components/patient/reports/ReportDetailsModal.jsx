import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Download } from "lucide-react";
import { cancerTypes, formatDate } from "@/constants";

export default function ReportDetailsModal({
  isOpen,
  onClose,
  selectedReport,
  doctors,
  onDownloadReport,
}) {
  if (!selectedReport) return null;

  const doctor = doctors[selectedReport.doctorId];
  const cancerTypeInfo = cancerTypes.find(
    (t) => t.id === selectedReport.cancerType
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Medical Report Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Header */}
          <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold">
                {cancerTypeInfo?.name || "Medical"} Screening
              </h3>
              <p className="text-gray-600">
                {formatDate(selectedReport.createdAt)}
              </p>
            </div>
            <Badge
              className={
                selectedReport.classification === "Cancer"
                  ? "bg-red-100 text-red-800"
                  : selectedReport.classification === "Suspicious"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }
            >
              {selectedReport.classification}
            </Badge>
          </div>

          {/* Doctor Information */}
          <div>
            <h4 className="font-semibold mb-3">Doctor Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <p>
                  Dr.{" "}
                  {doctor
                    ? `${doctor.firstName} ${doctor.lastName}`
                    : "Unknown"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Hospital:</span>
                <p>{doctor?.hospital || "N/A"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Analysis Results */}
          <div>
            <h4 className="font-semibold mb-3">Analysis Results</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">
                  Classification:
                </span>
                <p>{selectedReport.classification}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Confidence:</span>
                <p>{selectedReport.confidence}%</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  AI Model Version:
                </span>
                <p>{selectedReport.aiModelVersion || "N/A"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <p className="capitalize">{selectedReport.status}</p>
              </div>
            </div>
          </div>

          {/* Additional Findings */}
          {selectedReport.additionalFindings?.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3">Additional Findings</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {selectedReport.additionalFindings.map((finding, index) => (
                    <li key={index}>{finding}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Doctor's Review */}
          {selectedReport.doctorReview && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3">Doctor's Review</h4>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    {selectedReport.doctorReview}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedReport.inputImageUrl && (
              <div>
                <h5 className="font-medium mb-2">Input Image</h5>
                <img
                  src={selectedReport.inputImageUrl}
                  alt="Input scan"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}
            {selectedReport.resultImageUrl && (
              <div>
                <h5 className="font-medium mb-2">Analysis Result</h5>
                <img
                  src={selectedReport.resultImageUrl}
                  alt="Analysis result"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* Download Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={() => onDownloadReport(selectedReport.reportPdfUrl)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Full Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
