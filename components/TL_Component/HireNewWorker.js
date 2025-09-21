"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  User,
  FileText,
  Camera,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Building,
  Clock,
  CreditCard,
} from "lucide-react";
import { toast } from "../ui/use-toast";

export default function HireWorkerForm({
  onClose = () => {},
  onSuccess = () => {},
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    // Step 1 - Basic Info
    name: "",
    employeeId: "", // e.g. #HY907
    status: "Active", // Active / Inactive
    email: "",
    phone: "",
    photo: null,
    photoUrl: "",

    // Step 2 - Position & Contract
    department: "Marketing Team",
    position: "",
    reportingTo: "",
    workLocation: "",
    contractStart: "",
    contractEnd: "",
    workingHours: "",

    // Step 3 - Compensation
    baseSalary: "", // number string or formatted
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";


  const handleInputChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (formErrors[field]) setFormErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleFileChange = async (field, file) => {
    if (!file) return;
    // same validation as earlier
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors((p) => ({
        ...p,
        photo: "Please select an image smaller than 5MB",
      }));
      return;
    }
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setFormErrors((p) => ({
        ...p,
        photo: "Please select a JPG, PNG, or GIF image",
      }));
      return;
    }

    setUploadingImage(true);
    setFormErrors((p) => ({ ...p, photo: "" }));

    try {
      // demo placeholder behaviour (no real upload)
      const demoUrl = "https://via.placeholder.com/300x300.png?text=Profile";
      setFormData((prev) => ({ ...prev, [field]: file, photoUrl: demoUrl }));
      toast({
        title: "Image set (demo)",
        description: "Profile photo URL set to demo placeholder.",
      });
    } catch (err) {
      console.error(err);
      setFormErrors((p) => ({
        ...p,
        photo: "Something went wrong uploading image",
      }));
    } finally {
      setUploadingImage(false);
    }
  };

  const validateStep = (step) => {
    const errors = {};
    let ok = true;

    if (step === 1) {
      if (!formData.name) {
        errors.name = "Full name is required";
        ok = false;
      }
      if (!formData.employeeId) {
        errors.employeeId = "Employee ID is required";
        ok = false;
      }
      if (!formData.email) {
        errors.email = "Email is required";
        ok = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Invalid email";
        ok = false;
      }
      if (!formData.phone) {
        errors.phone = "Phone is required";
        ok = false;
      } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ""))) {
        errors.phone = "Enter 10 digit phone";
        ok = false;
      }
    }

    if (step === 2) {
      if (!formData.position) {
        errors.position = "Position is required";
        ok = false;
      }
      if (!formData.department) {
        errors.department = "Department is required";
        ok = false;
      }
      if (!formData.contractStart) {
        errors.contractStart = "Contract start is required";
        ok = false;
      }
      if (!formData.contractEnd) {
        errors.contractEnd = "Contract end is required";
        ok = false;
      }
      // optional: ensure end >= start
      if (formData.contractStart && formData.contractEnd) {
        const s = new Date(formData.contractStart),
          e = new Date(formData.contractEnd);
        if (e < s) {
          errors.contractEnd = "Contract end must be after start";
          ok = false;
        }
      }
      if (!formData.workingHours) {
        errors.workingHours = "Working hours required";
        ok = false;
      }
    }

    if (step === 3) {
      if (!formData.baseSalary) {
        errors.baseSalary = "Base salary is required";
        ok = false;
      } else if (
        isNaN(Number(String(formData.baseSalary).replace(/[^0-9.]/g, "")))
      ) {
        errors.baseSalary = "Enter a valid number";
        ok = false;
      }
    }

    setFormErrors(errors);
    return ok;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) setCurrentStep((p) => p + 1);
  };
  const prevStep = () => setCurrentStep((p) => Math.max(1, p - 1));

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setLoading(true);
    try {
      // Prepare payload matching your Employee object
      const payload = {
        name: formData.name,
        employeeId: formData.employeeId,
        status: formData.status,
        avatar: formData.photoUrl || "/placeholder.svg",
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
        reportingTo: formData.reportingTo,
        workLocation: formData.workLocation,
        contractStart: formData.contractStart,
        contractEnd: formData.contractEnd,
        workingHours: formData.workingHours,
        baseSalary: formData.baseSalary,
      };

      // POST to local API route
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teamleader/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to save employee");
      }

      const result = await res.json();
      toast({
        title: "Employee created",
        description: "Employee saved successfully",
      });
      onSuccess(result.employee);
      onClose();
    } catch (err) {
      console.error(err);
      setFormErrors((p) => ({
        ...p,
        submit: err.message || "Failed to create employee",
      }));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Basic Info", icon: User },
    { number: 2, title: "Position & Contract", icon: Building },
    { number: 3, title: "Compensation", icon: CreditCard },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto py-8">
      <Card className="w-full max-w-2xl mx-4 bg-white">
        <CardHeader className="sticky top-0 bg-white z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Add Employee</CardTitle>
              <CardDescription>
                Add a new employee to your system
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full"
            >
              ×
            </Button>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between mt-6 px-2">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="flex flex-col items-center flex-1"
              >
                <div className="flex items-center w-full">
                  {index !== 0 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > step.number
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      currentStep >= step.number
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  {index !== steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > step.number
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
                <p
                  className={`text-xs mt-2 text-center ${
                    currentStep >= step.number
                      ? "text-blue-500 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              Step {currentStep} of {steps.length}:{" "}
              {steps[currentStep - 1]?.title}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 py-6">
          {formErrors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {formErrors.submit}
            </div>
          )}

          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src={formData.photoUrl || "/placeholder.svg"}
                    alt={formData.name || "Avatar"}
                  />
                  <AvatarFallback>
                    {(formData.name || "U")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="h-11"
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="employeeId">Employee ID *</Label>
                      <Input
                        id="employeeId"
                        value={formData.employeeId}
                        onChange={(e) =>
                          handleInputChange("employeeId", e.target.value)
                        }
                        className="h-11"
                        placeholder="#HY907"
                      />
                      {formErrors.employeeId && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.employeeId}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="h-11"
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange(
                            "phone",
                            e.target.value.replace(/\D/g, "").slice(0, 10)
                          )
                        }
                        className="h-11"
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      onValueChange={(v) => handleInputChange("status", v)}
                      value={formData.status}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="photo">Profile Photo (optional)</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center ${
                    formErrors.photo
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <Camera className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange("photo", e.target.files?.[0])
                    }
                    className="hidden"
                  />
                  <label htmlFor="photo" className="cursor-pointer text-sm">
                    <span className="text-blue-500 hover:text-blue-600 font-medium">
                      {uploadingImage
                        ? "Uploading..."
                        : "Click to upload photo"}
                    </span>
                    <p className="text-xs mt-1">JPG, PNG or GIF (max 5MB)</p>
                  </label>

                  {formData.photo && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600 font-medium">
                        {formData.photo.name} selected
                      </p>
                    </div>
                  )}
                  {formErrors.photo && (
                    <p className="text-red-500 text-xs mt-2">
                      {formErrors.photo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    className="h-11"
                  />
                  {formErrors.department && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.department}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) =>
                      handleInputChange("position", e.target.value)
                    }
                    className="h-11"
                  />
                  {formErrors.position && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.position}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="reportingTo">Reporting To</Label>
                  <Input
                    id="reportingTo"
                    value={formData.reportingTo}
                    onChange={(e) =>
                      handleInputChange("reportingTo", e.target.value)
                    }
                    className="h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="workLocation">Work Location</Label>
                  <Input
                    id="workLocation"
                    value={formData.workLocation}
                    onChange={(e) =>
                      handleInputChange("workLocation", e.target.value)
                    }
                    className="h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="contractStart">Contract Start *</Label>
                  <Input
                    id="contractStart"
                    type="date"
                    value={formData.contractStart}
                    onChange={(e) =>
                      handleInputChange("contractStart", e.target.value)
                    }
                    className="h-11"
                  />
                  {formErrors.contractStart && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.contractStart}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contractEnd">Contract End *</Label>
                  <Input
                    id="contractEnd"
                    type="date"
                    value={formData.contractEnd}
                    onChange={(e) =>
                      handleInputChange("contractEnd", e.target.value)
                    }
                    className="h-11"
                  />
                  {formErrors.contractEnd && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.contractEnd}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="workingHours">Working Hours (per week)</Label>
                <Input
                  id="workingHours"
                  value={formData.workingHours}
                  onChange={(e) =>
                    handleInputChange("workingHours", e.target.value)
                  }
                  className="h-11"
                  placeholder="30 hours"
                />
                {formErrors.workingHours && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.workingHours}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="baseSalary">
                    Base Salary (monthly in ₹) *
                  </Label>
                  <Input
                    id="baseSalary"
                    type="number"
                    value={formData.baseSalary}
                    onChange={(e) =>
                      handleInputChange("baseSalary", e.target.value)
                    }
                    className="h-11"
                    placeholder="8000"
                  />
                  {formErrors.baseSalary && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.baseSalary}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="misc">Misc Notes (optional)</Label>
                  <Textarea
                    id="misc"
                    value={formData.misc}
                    onChange={(e) => handleInputChange("misc", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t mt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 h-11 px-4"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2 h-11 px-6"
              >
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading || uploadingImage}
                className="flex items-center gap-2 h-11 px-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                  </>
                ) : uploadingImage ? (
                  "Uploading Image..."
                ) : (
                  <>
                    Create Employee <Check className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
