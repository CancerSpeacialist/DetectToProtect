import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function AcceptAppointmentModal({
  open,
  onOpenChange,
  onClose,
  selectedAppointment,
  patients,
  acceptForm,
  setAcceptForm,
  submitting,
  handleAcceptAppointment,
}) {
  const patient =
    selectedAppointment && patients[selectedAppointment.patientId];

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Accept Appointment</DialogTitle>
          <DialogDescription>
            Schedule appointment with{" "}
            {patient
              ? `${patient.firstName} ${patient.lastName}`
              : "Patient"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointmentDate">Appointment Date*</Label>
              <Input
                id="appointmentDate"
                type="date"
                value={acceptForm.appointmentDate}
                onChange={(e) =>
                  setAcceptForm((prev) => ({
                    ...prev,
                    appointmentDate: e.target.value,
                  }))
                }
                min={minDate}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointmentTime">Appointment Time*</Label>
              <Select
                value={acceptForm.appointmentTime}
                onValueChange={(value) =>
                  setAcceptForm((prev) => ({
                    ...prev,
                    appointmentTime: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 18 }, (_, i) => {
                    const hour = Math.floor(i / 2) + 9;
                    const minute = i % 2 === 0 ? "00" : "30";
                    const time12 = `${
                      hour > 12 ? hour - 12 : hour
                    }:${minute} ${hour >= 12 ? "PM" : "AM"}`;
                    const time24 = `${hour.toString().padStart(2, "0")}:${minute}`;
                    return (
                      <SelectItem key={time24} value={time24}>
                        {time12}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctorNotes">Notes (Optional)</Label>
            <Textarea
              id="doctorNotes"
              placeholder="Any special instructions or notes for the patient..."
              value={acceptForm.doctorNotes}
              onChange={(e) =>
                setAcceptForm((prev) => ({
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
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAcceptAppointment}
            disabled={
              submitting ||
              !acceptForm.appointmentDate ||
              !acceptForm.appointmentTime
            }
          >
            {submitting ? "Accepting..." : "Accept Appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AcceptAppointmentModal;

