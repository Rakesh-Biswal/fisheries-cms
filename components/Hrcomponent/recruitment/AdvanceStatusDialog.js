import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const AdvanceStatusDialog = ({
  isOpen,
  onClose,
  candidate,
  onAdvance,
  loading,
  statusConfig,
  getStatusDisplay,
  getNextActions,
}) => {
  if (!candidate) return null;

  const nextActions = getNextActions(candidate.status).filter(
    (action) => action !== "rejected"
  );
  const nextStatus = nextActions[0]; // Get the first available advancement

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const note = formData.get("note");
    onAdvance(nextStatus, note);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Advance Candidate Status</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <p className="text-gray-700 mb-4">
              Advance{" "}
              <strong>
                {candidate.firstName} {candidate.lastName}
              </strong>{" "}
              from{" "}
              <span className="font-semibold capitalize">
                {getStatusDisplay(candidate.status)}
              </span>{" "}
              to{" "}
              <span className="font-semibold capitalize">
                {getStatusDisplay(nextStatus)}
              </span>
              ?
            </p>

            <div className="space-y-2">
              <label
                htmlFor="note"
                className="text-sm font-medium text-gray-700"
              >
                Add a note (optional):
              </label>
              <Textarea
                id="note"
                name="note"
                placeholder="Add notes about this status change..."
                className="w-full"
              />
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
              {loading
                ? "Processing..."
                : `Advance to ${getStatusDisplay(nextStatus)}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdvanceStatusDialog;
