import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ScheduleFieldWorkDialog = ({
  isOpen,
  onClose,
  candidate,
  onSchedule,
  loading,
}) => {
  if (!candidate) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fieldWorkStartDate = formData.get("fieldWorkStartDate");

    if (!fieldWorkStartDate) {
      alert("Please select a start date");
      return;
    }

    onSchedule(fieldWorkStartDate);
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 3); // At least 3 days from now (2 days training + buffer)
    return today.toISOString().split("T")[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Field Work</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <p className="text-gray-700 mb-4">
              Schedule 7-day field work for{" "}
              <strong>
                {candidate.firstName} {candidate.lastName}
              </strong>
              . The candidate will complete 2 days of training before starting
              field work.
            </p>

            <div className="space-y-2">
              <label
                htmlFor="fieldWorkStartDate"
                className="text-sm font-medium text-gray-700"
              >
                Field Work Start Date:
              </label>
              <Input
                id="fieldWorkStartDate"
                name="fieldWorkStartDate"
                type="date"
                min={getMinDate()}
                className="w-full"
                required
              />
              <p className="text-xs text-gray-500">
                Training will be scheduled for 2 days before this date
              </p>
            </div>
          </div>

          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Scheduling..." : "Schedule Field Work"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleFieldWorkDialog;