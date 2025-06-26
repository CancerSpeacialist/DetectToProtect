import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function RejectAppointmentModal({
  open,
  onOpenChange,
  rejectForm,
  setRejectForm,
  submitting,
  onReject,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reject Appointment</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this appointment request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rejectionReason">Reason for Rejection *</Label>
            <Textarea
              id="rejectionReason"
              placeholder="Please explain why you cannot accept this appointment..."
              value={rejectForm.rejectionReason}
              onChange={(e) =>
                setRejectForm((prev) => ({
                  ...prev,
                  rejectionReason: e.target.value,
                }))
              }
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctorNotesReject">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="doctorNotesReject"
              placeholder="Any additional notes or suggestions for the patient..."
              value={rejectForm.doctorNotes}
              onChange={(e) =>
                setRejectForm((prev) => ({
                  ...prev,
                  doctorNotes: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onReject}
            disabled={submitting || !rejectForm.rejectionReason.trim()}
          >
            {submitting ? "Rejecting..." : "Reject Appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
