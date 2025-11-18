// components/PM_Component/payment-submission-form.js
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Upload } from "lucide-react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/cloudinary";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PaymentSubmissionForm({ 
    paymentId, 
    onSuccess, 
    onClose 
}) {
    const [submitting, setSubmitting] = useState(false);
    const [paymentForm, setPaymentForm] = useState({
        screenshotFile: null,
        screenshotPreview: null,
        paymentMethod: "",
        transactionId: "",
        additionalNotes: ""
    });

    const handleScreenshotUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (JPEG, PNG, etc.)');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5MB');
            return;
        }

        try {
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPaymentForm(prev => ({
                    ...prev,
                    screenshotFile: file,
                    screenshotPreview: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Error processing image');
        }
    };

    const submitPaymentProof = async () => {
        if (!paymentForm.screenshotFile || !paymentForm.paymentMethod) {
            alert('Please fill all required fields: Screenshot and Payment Method');
            return;
        }

        try {
            setSubmitting(true);

            // Upload screenshot to Cloudinary using our API route
            const uploadResult = await uploadToCloudinary(paymentForm.screenshotFile);
            
            if (!uploadResult.url) {
                throw new Error('Failed to upload screenshot');
            }

            // Submit payment proof - REMOVE hardcoded user IDs
            const submitResponse = await fetch(`${API_URL}/api/project-manager/payments/${paymentId}/submit-payment`, {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // Only send the data that backend needs, user info will be extracted from token
                    screenshot: uploadResult.url,
                    paymentMethod: paymentForm.paymentMethod,
                    transactionId: paymentForm.transactionId,
                    additionalNotes: paymentForm.additionalNotes
                })
            });

            if (!submitResponse.ok) {
                throw new Error(`HTTP error! status: ${submitResponse.status}`);
            }

            const result = await submitResponse.json();

            if (result.success) {
                onSuccess(result.data);
                setPaymentForm({
                    screenshotFile: null,
                    screenshotPreview: null,
                    paymentMethod: "",
                    transactionId: "",
                    additionalNotes: ""
                });
                alert('Payment proof submitted successfully!');
            } else {
                throw new Error(result.message || "Failed to submit payment proof");
            }
        } catch (err) {
            console.error("Error submitting payment proof:", err);
            alert("Failed to submit payment proof: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Submit Payment Proof</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                        >
                            ✕
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {/* Screenshot Upload */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Payment Screenshot *
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                {paymentForm.screenshotPreview ? (
                                    <div className="space-y-2">
                                        <Image
                                            src={paymentForm.screenshotPreview}
                                            alt="Screenshot preview"
                                            width={200}
                                            height={150}
                                            className="mx-auto rounded-md"
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPaymentForm(prev => ({ 
                                                ...prev, 
                                                screenshotFile: null,
                                                screenshotPreview: null 
                                            }))}
                                        >
                                            Change Image
                                        </Button>
                                    </div>
                                ) : (
                                    <div>
                                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 mb-2">
                                            Upload payment screenshot
                                        </p>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleScreenshotUpload}
                                            className="hidden"
                                            id="screenshot-upload"
                                        />
                                        <Button asChild variant="outline">
                                            <label htmlFor="screenshot-upload" className="cursor-pointer">
                                                Choose File
                                            </label>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Payment Method *
                            </label>
                            <Select
                                value={paymentForm.paymentMethod}
                                onValueChange={(value) => setPaymentForm(prev => ({ ...prev, paymentMethod: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UPI">UPI</SelectItem>
                                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="Cheque">Cheque</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Transaction ID */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Transaction ID (Optional)
                            </label>
                            <Input
                                type="text"
                                placeholder="Enter transaction ID"
                                value={paymentForm.transactionId}
                                onChange={(e) => setPaymentForm(prev => ({ ...prev, transactionId: e.target.value }))}
                            />
                        </div>

                        {/* Additional Notes */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Additional Notes (Optional)
                            </label>
                            <Textarea
                                placeholder="Any additional information..."
                                value={paymentForm.additionalNotes}
                                onChange={(e) => setPaymentForm(prev => ({ ...prev, additionalNotes: e.target.value }))}
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={submitPaymentProof}
                                disabled={submitting || !paymentForm.screenshotFile || !paymentForm.paymentMethod}
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                                {submitting ? "Submitting..." : "Submit Proof"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}