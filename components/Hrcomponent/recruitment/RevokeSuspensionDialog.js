import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

const RevokeSuspensionDialog = ({
  isOpen,
  onClose,
  candidate,
  onRevoke,
  loading,
  getStatusDisplay,
}) => {
  if (!candidate) return null;

  const [newStatus, setNewStatus] = useState("hired");
  const [revokeReason, setRevokeReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onRevoke(newStatus, revokeReason);
  };

  const statusOptions = [
    {
      value: "hired",
      label: "Hired",
      description: "Directly hire the candidate",
    },
    { value: "offer", label: "Offer", description: "Send employment offer" },
    {
      value: "final_interview",
      label: "Final Interview",
      description: "Schedule final interview",
    },
    {
      value: "interview",
      label: "Interview",
      description: "Schedule initial interview",
    },
    {
      value: "technical_test",
      label: "Technical Test",
      description: "Assign technical test",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Revoke Suspension</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="py-4 space-y-4">
            <p className="text-gray-700">
              Revoke suspension for{" "}
              <strong>
                {candidate.firstName} {candidate.lastName}
              </strong>{" "}
              and move to a new status.
            </p>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Select new status:
              </Label>
              <RadioGroup
                value={newStatus}
                onValueChange={setNewStatus}
                className="space-y-2"
              >
                {statusOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50"
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label
                      htmlFor={option.value}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">
                        {option.description}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="revokeReason"
                className="text-sm font-medium text-gray-700"
              >
                Reason for revocation:
              </Label>
              <Textarea
                id="revokeReason"
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="Explain why the suspension is being revoked..."
                className="w-full"
                required
                rows={3}
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
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Revoking..." : "Revoke Suspension"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RevokeSuspensionDialog;
