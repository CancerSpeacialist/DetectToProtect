import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, DollarSign, Clock } from "lucide-react";

export default function BookingModal({
  showBookingModal,
  setShowBookingModal,
  selectedDoctor,
  bookingForm,
  setBookingForm,
  urgencyLevels,
  submitting,
  submitBooking,
}) {
  return (
    <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Book an appointment with Dr. {selectedDoctor?.firstName}{" "}
            {selectedDoctor?.lastName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Doctor Info */}
          {selectedDoctor && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                    </h3>
                    <p className="text-gray-600">{selectedDoctor.hospital}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />$
                        {selectedDoctor.consultationFee}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {selectedDoctor.experience}+ years
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Symptoms/Notes */}
          <div className="space-y-2">
            <Label htmlFor="symptoms">
              Describe your symptoms or concerns *
            </Label>
            <Textarea
              id="symptoms"
              placeholder="Please describe your symptoms, concerns, or reason for this appointment..."
              value={bookingForm.patientNotes}
              onChange={(e) =>
                setBookingForm((prev) => ({
                  ...prev,
                  patientNotes: e.target.value,
                }))
              }
              className="min-h-[120px]"
            />
          </div>
          {/* Urgency Level */}
          <div className="space-y-2">
            <Label>Urgency Level</Label>
            <Select
              value={bookingForm.urgency}
              onValueChange={(value) =>
                setBookingForm((prev) => ({ ...prev, urgency: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {urgencyLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div className="flex items-center gap-2">
                      <Badge className={level.color}>{level.label}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Preferred Date Range */}
          <div className="space-y-2">
            <Label htmlFor="dateRange">Preferred Date Range (Optional)</Label>
            <Input
              id="dateRange"
              placeholder="e.g., Next week, After December 1st, Weekdays only..."
              value={bookingForm.preferredDateRange}
              onChange={(e) =>
                setBookingForm((prev) => ({
                  ...prev,
                  preferredDateRange: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowBookingModal(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={submitBooking}
            disabled={submitting || !bookingForm.patientNotes.trim()}
          >
            {submitting ? "Submitting..." : "Book Appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
