import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const RejectCandidateDialog = ({
  isOpen,
  onClose,
  candidate,
  onReject,
  loading,
  getStatusDisplay,
}) => {
  if (!candidate) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rejectionReason = formData.get("rejectionReason");
    onReject(rejectionReason);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Candidate</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <p className="text-gray-700 mb-4">
              Reject{" "}
              <strong>
                {candidate.firstName} {candidate.lastName}
              </strong>{" "}
              who is currently in{" "}
              <span className="font-semibold capitalize">
                {getStatusDisplay(candidate.status)}
              </span>{" "}
              status?
            </p>

            <div className="space-y-2">
              <label
                htmlFor="rejectionReason"
                className="text-sm font-medium text-gray-700"
              >
                Reason for rejection:
              </label>
              <Textarea
                id="rejectionReason"
                name="rejectionReason"
                placeholder="Explain why this candidate is being rejected..."
                className="w-full"
                required
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
              {loading ? "Processing..." : "Reject Candidate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RejectCandidateDialog;
