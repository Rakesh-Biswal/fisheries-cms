import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useState, useEffect } from "react"; // NEW: Import useState and useEffect

const FieldWorkDayDialog = ({
  isOpen,
  onClose,
  candidate,
  day,
  onUpdate,
  loading,
}) => {
  if (!candidate || !day) return null;

  const fieldWorkDay = candidate.postHireInfo?.fieldWorkDays?.find(
    (d) => d.day === day
  );
  if (!fieldWorkDay) return null;

  // NEW: State for real-time updates
  const [formData, setFormData] = useState({
    completed: fieldWorkDay.completed || false,
    notes: fieldWorkDay.notes || "",
    rating: fieldWorkDay.rating || 0,
  });

  // NEW: Update form data when fieldWorkDay changes
  useEffect(() => {
    setFormData({
      completed: fieldWorkDay.completed || false,
      notes: fieldWorkDay.notes || "",
      rating: fieldWorkDay.rating || 0,
    });
  }, [fieldWorkDay]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(day, formData);
  };

  // NEW: Real-time form updates
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // NEW: Handle star click
  const handleStarClick = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating: rating,
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Field Work Day {day}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="py-4 space-y-4">
            <div>
              <p className="text-sm text-gray-600">
                Date: {formatDate(fieldWorkDay.date)}
              </p>
              <p className="text-sm text-gray-600">
                Status: {formData.completed ? "✅ Completed" : "⏳ Pending"}
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="completed"
                  checked={formData.completed}
                  onChange={(e) =>
                    handleInputChange("completed", e.target.checked)
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Mark as completed
                </span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Rating:
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        formData.rating >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Selected: {formData.rating} of 5 stars
                {formData.rating > 0 && (
                  <span className="ml-2">
                    {formData.rating === 1 && "❌ Poor"}
                    {formData.rating === 2 && "⚠️ Fair"}
                    {formData.rating === 3 && "✅ Good"}
                    {formData.rating === 4 && "👍 Very Good"}
                    {formData.rating === 5 && "🏆 Excellent"}
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="notes"
                className="text-sm font-medium text-gray-700"
              >
                Notes:
              </label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add notes about this day's performance..."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="w-full"
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
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Day"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FieldWorkDayDialog;
