import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Loader2, Save } from "lucide-react";
import { statusOptions } from "@/constants";

export default function ResultsModal({
  open,
  onOpenChange,
  aiResults,
  screeningForm,
  setScreeningForm,
  saving,
  handleSaveScreening,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            AI Analysis Results
          </DialogTitle>
          <DialogDescription>
            Review the AI analysis results and add your professional assessment
          </DialogDescription>
        </DialogHeader>

        {aiResults && (
          <div className="space-y-6">
            {/* AI Results Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  AI Classification Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Classification
                    </Label>
                    <div className="mt-1">
                      <Badge
                        className={
                          aiResults.classification === "Malignant"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {aiResults.classification}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Confidence Level
                    </Label>
                    <div className="mt-1">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={aiResults.confidence * 100}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium">
                          {aiResults.confidence * 100}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {aiResults.additionalFindings &&
                  aiResults.additionalFindings.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        AI Findings
                      </Label>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600">
                        {aiResults.additionalFindings.map((finding, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Doctor Review Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Doctor's Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctorReview">Professional Review</Label>
                  <Textarea
                    id="doctorReview"
                    placeholder="Enter your professional assessment, additional observations, and recommendations..."
                    value={screeningForm.doctorReview}
                    onChange={(e) =>
                      setScreeningForm((prev) => ({
                        ...prev,
                        doctorReview: e.target.value,
                      }))
                    }
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Screening Status</Label>
                  <Select
                    value={screeningForm.status}
                    onValueChange={(value) =>
                      setScreeningForm((prev) => ({
                        ...prev,
                        status: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Badge className={option.color}>
                              {option.label}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => window.open(aiResults.reportPdfUrl, "_blank")}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveScreening} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Screening
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
