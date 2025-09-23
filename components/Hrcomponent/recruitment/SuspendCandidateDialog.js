import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SuspendCandidateDialog = ({
  isOpen,
  onClose,
  candidate,
  onSuspend,
  loading,
  getStatusDisplay,
}) => {
  if (!candidate) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const suspensionReason = formData.get("suspensionReason");
    onSuspend(suspensionReason);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Suspend Candidate</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <p className="text-gray-700 mb-4">
              Suspend{" "}
              <strong>
                {candidate.firstName} {candidate.lastName}
              </strong>{" "}
              who is currently{" "}
              <span className="font-semibold capitalize">
                {getStatusDisplay(candidate.status)}
              </span>
              . This action cannot be undone.
            </p>

            <div className="space-y-2">
              <label
                htmlFor="suspensionReason"
                className="text-sm font-medium text-gray-700"
              >
                Reason for suspension:
              </label>
              <Textarea
                id="suspensionReason"
                name="suspensionReason"
                placeholder="Explain why this candidate is being suspended..."
                className="w-full"
                required
                rows={4}
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
            <Button type="submit" variant="destructive" disabled={loading}>
              {loading ? "Suspending..." : "Suspend Candidate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SuspendCandidateDialog;
