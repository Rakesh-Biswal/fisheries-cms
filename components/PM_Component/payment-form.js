// components/PM_Component/payment-form.js
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IndianRupee, Plus, Trash2, X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PaymentForm({ farmer, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        paymentTitle: "",
        description: "",
        amount: "",
        reasonForPayment: "",
        requirements: [""]
    });

    const handleRequirementChange = (index, value) => {
        const newRequirements = [...formData.requirements];
        newRequirements[index] = value;
        setFormData({ ...formData, requirements: newRequirements });
    };

    const addRequirement = () => {
        setFormData({
            ...formData,
            requirements: [...formData.requirements, ""]
        });
    };

    const removeRequirement = (index) => {
        const newRequirements = formData.requirements.filter((_, i) => i !== index);
        setFormData({ ...formData, requirements: newRequirements });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.paymentTitle || !formData.description || !formData.amount || !formData.reasonForPayment) {
            alert("Please fill in all required fields");
            return;
        }

        setLoading(true);

        try {
            const paymentData = {
                farmerLeadId: farmer._id,
                projectManagerId: "65d8f5a8e7b8c4a9b1234567", // This should come from auth context
                paymentTitle: formData.paymentTitle,
                description: formData.description,
                amount: parseFloat(formData.amount),
                reasonForPayment: formData.reasonForPayment,
                requirements: formData.requirements.filter(req => req.trim() !== "").map(description => ({
                    description,
                    isCompleted: false
                }))
            };

            const response = await fetch(`${API_URL}/api/project-manager/payments/create`, {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                onSuccess();
                alert("Payment created successfully!");
            } else {
                throw new Error(result.message || "Failed to create payment");
            }
        } catch (error) {
            console.error("Error creating payment:", error);
            alert(`Error creating payment: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Create New Payment</span>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </DialogTitle>
                    <DialogDescription>
                        Create a new payment for {farmer.name}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Payment Basic Info */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Payment Information</h3>

                        <div>
                            <Label htmlFor="paymentTitle">Payment Title *</Label>
                            <Input
                                id="paymentTitle"
                                value={formData.paymentTitle}
                                onChange={(e) => setFormData({ ...formData, paymentTitle: e.target.value })}
                                placeholder="e.g., Seed Purchase, Equipment Setup"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe what this payment is for..."
                                rows={3}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="amount">Amount (₹) *</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="reasonForPayment">Reason for Payment *</Label>
                            <Textarea
                                id="reasonForPayment"
                                value={formData.reasonForPayment}
                                onChange={(e) => setFormData({ ...formData, reasonForPayment: e.target.value })}
                                placeholder="Explain why this payment is necessary..."
                                rows={2}
                                required
                            />
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Requirements</h3>
                            <Button type="button" variant="outline" size="sm" onClick={addRequirement}>
                                <Plus className="w-4 h-4 mr-1" />
                                Add Requirement
                            </Button>
                        </div>

                        {formData.requirements.map((requirement, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={requirement}
                                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                                    placeholder={`Requirement ${index + 1}`}
                                />
                                {formData.requirements.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeRequirement(index)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <IndianRupee className="w-4 h-4 mr-2" />
                                    Create Payment
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}