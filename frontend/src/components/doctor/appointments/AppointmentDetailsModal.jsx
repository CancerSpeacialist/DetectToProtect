import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AppointmentDetails from "@/components/doctor/appointments/AppointmentDetails";

function AppointmentDetailsModal({ open, onOpenChange, appointment, patient }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>

        {appointment && (
          <AppointmentDetails appointment={appointment} patient={patient} />
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AppointmentDetailsModal;
