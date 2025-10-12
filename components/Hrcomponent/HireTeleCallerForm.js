"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import {
  User,
  CreditCard,
  FileText,
  Camera,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Building,
  Banknote,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { toast } from "../ui/use-toast"
import { ImageUploadService } from '../../services/imageUploadService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function HireTelecallerForm({ onClose, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [formData, setFormData] = useState({
    // Step 1 - Basic Info
    name: "",
    phone: "",
    email: "",
    password: "",

    // Step 2 - Documents & Personal Details
    aadhar: "",
    pan: "",
    photo: null,
    photoUrl: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",

    // Step 3 - Banking Details
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branch: "",

    // Step 4 - Employment Details
    employeeType: "full-time",
    department: "Customer Service",
    joiningDate: "",
    salary: "",
    designation: "Telecaller",
    experience: "",
    qualification: "",
    previousCompany: "",
    shift: "",
    dailyCallTarget: "",
    specialization: "",
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileChange = async (field, file) => {
    if (!file) return;

    setUploadingImage(true);
    setFormErrors((prev) => ({ ...prev, photo: "" }));

    try {

      const imageUrl = await ImageUploadService.uploadToCloudinary(file);

      setFormData((prev) => ({
        ...prev,
        [field]: imageUrl, // Store Cloudinary URL
        photoUrl: imageUrl, // For preview
      }));

      toast({
        title: "Image uploaded successfully",
        description: "Image ready to use",
      });

    } catch (error) {
      setFormErrors((prev) => ({ ...prev, photo: error.message }));
    } finally {
      setUploadingImage(false);
    }
  };

  const validateStep = (step) => {
    const errors = {}
    let isValid = true

    switch (step) {
      case 1:
        if (!formData.name) {
          errors.name = "Full name is required"
          isValid = false
        }
        if (!formData.phone) {
          errors.phone = "Phone number is required"
          isValid = false
        } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ""))) {
          errors.phone = "Please enter a valid 10-digit phone number"
          isValid = false
        }
        if (!formData.email) {
          errors.email = "Email is required"
          isValid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errors.email = "Please enter a valid email address"
          isValid = false
        }
        if (!formData.password) {
          errors.password = "Password is required"
          isValid = false
        } else if (formData.password.length < 6) {
          errors.password = "Password must be at least 6 characters"
          isValid = false
        }
        break
      case 2:
        if (!formData.aadhar) {
          errors.aadhar = "Aadhar number is required"
          isValid = false
        } else if (!/^[0-9]{12}$/.test(formData.aadhar.replace(/\D/g, ""))) {
          errors.aadhar = "Please enter a valid 12-digit Aadhar number"
          isValid = false
        }
        if (!formData.pan) {
          errors.pan = "PAN number is required"
          isValid = false
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
          errors.pan = "Please enter a valid PAN number"
          isValid = false
        }
        if (!formData.address) {
          errors.address = "Address is required"
          isValid = false
        }
        break
      case 3:
        if (!formData.accountNumber) {
          errors.accountNumber = "Account number is required"
          isValid = false
        }
        if (!formData.ifscCode) {
          errors.ifscCode = "IFSC code is required"
          isValid = false
        }
        if (!formData.bankName) {
          errors.bankName = "Bank name is required"
          isValid = false
        }
        if (!formData.branch) {
          errors.branch = "Branch name is required"
          isValid = false
        }
        break
      case 4:
        if (!formData.joiningDate) {
          errors.joiningDate = "Joining date is required"
          isValid = false
        }
        if (!formData.salary) {
          errors.salary = "Salary is required"
          isValid = false
        } else if (formData.salary <= 0) {
          errors.salary = "Salary must be a positive number"
          isValid = false
        }
        if (!formData.shift) {
          errors.shift = "Shift is required"
          isValid = false
        }
        if (!formData.dailyCallTarget) {
          errors.dailyCallTarget = "Daily call target is required"
          isValid = false
        }
        break
      default:
        isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      return
    }

    setLoading(true)
    try {
      const submissionData = {
        ...formData,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relation: formData.emergencyContactRelation,
        },
        bankAccount: {
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          bankName: formData.bankName,
          branch: formData.branch,
        },
      }

      const response = await fetch(`${API_URL}/api/hr/telecaller/hire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(submissionData),
      })

      if (response.ok) {
        const result = await response.json()
        setModalMessage(`${formData.name} has been successfully added as a Telecaller!`)
        setShowSuccessModal(true)
        setTimeout(() => {
          setShowSuccessModal(false)
          onSuccess(result)
          onClose()
        }, 2000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to hire Telecaller")
      }
    } catch (error) {
      setModalMessage(error.message || "Failed to hire Telecaller. Please try again.")
      setShowErrorModal(true)
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: "Basic Information", icon: User },
    { number: 2, title: "Documents & Personal", icon: FileText },
    { number: 3, title: "Banking Details", icon: Banknote },
    { number: 4, title: "Employment Details", icon: CreditCard },
  ]

  return (
    <>
      <div className="w-full h-full p-6">
        <Card className="w-full h-full bg-white shadow-2xl p-6">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
            <div className="mt-8 mb-4">
              <div className="flex items-center justify-between relative">
                {steps.map((step, index) => (
                  <div
                    key={step.number}
                    className="flex flex-col items-center z-10 bg-gradient-to-r from-orange-50 to-red-50 px-2"
                  >
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${currentStep >= step.number
                          ? "bg-orange-500 border-orange-500 text-white shadow-lg"
                          : "border-gray-300 text-gray-400 bg-white"
                        }`}
                    >
                      {currentStep > step.number ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                    </div>
                    <p
                      className={`text-xs mt-2 text-center font-medium max-w-20 ${currentStep >= step.number ? "text-orange-600" : "text-gray-500"
                        }`}
                    >
                      {step.title}
                    </p>
                  </div>
                ))}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                  <div
                    className="h-full bg-orange-500 transition-all duration-500 ease-in-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="text-center mt-6">
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 px-4 py-1">
                  Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* <div className="text-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-2">
                                        <User className="w-5 h-5 text-blue-500" />
                                        Basic Information
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">Enter the basic details for the new team leader</p>
                                </div> */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter full name"
                      className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      aria-invalid={!!formErrors.name}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, ""))}
                      placeholder="9876543210"
                      maxLength={10}
                      className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      aria-invalid={!!formErrors.phone}
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Company Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="telecaller@company.com"
                    className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    aria-invalid={!!formErrors.email}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Temporary Password *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Create temporary password"
                    className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    aria-invalid={!!formErrors.password}
                  />
                  {formErrors.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.password}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                    Telecaller will be asked to change this on first login
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Documents & Personal Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* <div className="text-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-2">
                                        <FileText className="w-5 h-5 text-blue-500" />
                                        Documents & Personal Details
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Provide identification documents and personal information
                                    </p>
                                </div> */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="aadhar" className="text-sm font-medium text-gray-700">
                      Aadhar Number *
                    </Label>
                    <Input
                      id="aadhar"
                      value={formData.aadhar}
                      onChange={(e) => handleInputChange("aadhar", e.target.value.replace(/\D/g, "").slice(0, 12))}
                      placeholder="1234 5678 9012"
                      maxLength={12}
                      className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      aria-invalid={!!formErrors.aadhar}
                    />
                    {formErrors.aadhar && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.aadhar}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan" className="text-sm font-medium text-gray-700">
                      PAN Number *
                    </Label>
                    <Input
                      id="pan"
                      value={formData.pan}
                      onChange={(e) =>
                        handleInputChange(
                          "pan",
                          e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, "")
                            .slice(0, 10),
                        )
                      }
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      aria-invalid={!!formErrors.pan}
                    />
                    {formErrors.pan && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.pan}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo" className="text-sm font-medium text-gray-700">
                    Profile Photo (Optional)
                  </Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${formErrors.photo
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                      }`}
                  >
                    <Camera className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange("photo", e.target.files[0])}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                    <Label htmlFor="photo" className="cursor-pointer">
                      <span className="text-orange-500 hover:text-orange-600 font-medium">
                        {uploadingImage ? "Uploading..." : "Click to upload photo"}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (max 5MB)</p>
                    </Label>
                    {formData.photo && (
                      <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                        <p className="text-sm text-green-700 font-medium">{formData.photo.name} selected</p>
                      </div>
                    )}
                    {formErrors.photo && (
                      <p className="text-red-500 text-xs mt-2 flex items-center justify-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.photo}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Address *
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter complete address"
                    rows={3}
                    className="resize-none border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    aria-invalid={!!formErrors.address}
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.address}
                    </p>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold mb-4 text-gray-800">Emergency Contact (Optional)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactName" className="text-sm font-medium text-gray-700">
                        Contact Name
                      </Label>
                      <Input
                        id="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                        placeholder="Contact name"
                        className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactPhone" className="text-sm font-medium text-gray-700">
                        Contact Phone
                      </Label>
                      <Input
                        id="emergencyContactPhone"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value.replace(/\D/g, ""))}
                        placeholder="Phone number"
                        maxLength={10}
                        className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactRelation" className="text-sm font-medium text-gray-700">
                        Relation
                      </Label>
                      <Input
                        id="emergencyContactRelation"
                        value={formData.emergencyContactRelation}
                        onChange={(e) => handleInputChange("emergencyContactRelation", e.target.value)}
                        placeholder="Relation"
                        className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                {/* <div className="text-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-2">
                                        <Banknote className="w-5 h-5 text-blue-500" />
                                        Banking Details
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">Provide bank account information for salary processing</p>
                                </div> */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">
                      Account Number *
                    </Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                      placeholder="Account number"
                      className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      aria-invalid={!!formErrors.accountNumber}
                    />
                    {formErrors.accountNumber && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.accountNumber}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode" className="text-sm font-medium text-gray-700">
                      IFSC Code *
                    </Label>
                    <Input
                      id="ifscCode"
                      value={formData.ifscCode}
                      onChange={(e) => handleInputChange("ifscCode", e.target.value.toUpperCase())}
                      placeholder="IFSC code"
                      className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      aria-invalid={!!formErrors.ifscCode}
                    />
                    {formErrors.ifscCode && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.ifscCode}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankName" className="text-sm font-medium text-gray-700">
                      Bank Name *
                    </Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange("bankName", e.target.value)}
                      placeholder="Bank name"
                      className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      aria-invalid={!!formErrors.bankName}
                    />
                    {formErrors.bankName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.bankName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch" className="text-sm font-medium text-gray-700">
                      Branch *
                    </Label>
                    <Input
                      id="branch"
                      value={formData.branch}
                      onChange={(e) => handleInputChange("branch", e.target.value)}
                      placeholder="Branch name"
                      className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      aria-invalid={!!formErrors.branch}
                    />
                    {formErrors.branch && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.branch}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-900">Bank Account Verification</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        Please ensure all banking details are accurate. This information will be used for salary
                        processing and cannot be easily changed later.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                {/* <div className="text-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-2">
                                        <CreditCard className="w-5 h-5 text-blue-500" />
                                        Employment Details
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">Configure job-related information and targets</p>
                                </div> */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="joiningDate" className="text-sm font-medium text-gray-700">
                      Joining Date *
                    </Label>
                    <Input
                      id="joiningDate"
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => handleInputChange("joiningDate", e.target.value)}
                      className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      aria-invalid={!!formErrors.joiningDate}
                    />
                    {formErrors.joiningDate && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.joiningDate}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary" className="text-sm font-medium text-gray-700">
                      Monthly Salary (₹) *
                    </Label>
                    <Input
                      id="salary"
                      type="number"
                      value={formData.salary}
                      onChange={(e) => handleInputChange("salary", e.target.value)}
                      placeholder="25000"
                      className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      aria-invalid={!!formErrors.salary}
                    />
                    {formErrors.salary && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.salary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="shift" className="text-sm font-medium text-gray-700">
                      Shift *
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("shift", value)} value={formData.shift}>
                      <SelectTrigger className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (9 AM - 6 PM)</SelectItem>
                        <SelectItem value="evening">Evening (2 PM - 11 PM)</SelectItem>
                        <SelectItem value="night">Night (10 PM - 7 AM)</SelectItem>
                        <SelectItem value="rotational">Rotational</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.shift && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.shift}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dailyCallTarget" className="text-sm font-medium text-gray-700">
                      Daily Call Target *
                    </Label>
                    <Input
                      id="dailyCallTarget"
                      type="number"
                      value={formData.dailyCallTarget}
                      onChange={(e) => handleInputChange("dailyCallTarget", e.target.value)}
                      placeholder="50"
                      className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      aria-invalid={!!formErrors.dailyCallTarget}
                    />
                    {formErrors.dailyCallTarget && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.dailyCallTarget}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                      Experience (Years)
                    </Label>
                    <Input
                      id="experience"
                      type="number"
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      placeholder="Years of experience"
                      className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qualification" className="text-sm font-medium text-gray-700">
                      Qualification
                    </Label>
                    <Input
                      id="qualification"
                      value={formData.qualification}
                      onChange={(e) => handleInputChange("qualification", e.target.value)}
                      placeholder="Highest qualification"
                      className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previousCompany" className="text-sm font-medium text-gray-700">
                    Previous Company
                  </Label>
                  <Input
                    id="previousCompany"
                    value={formData.previousCompany}
                    onChange={(e) => handleInputChange("previousCompany", e.target.value)}
                    placeholder="Previous company name"
                    className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="employeeType" className="text-sm font-medium text-gray-700">
                      Employee Type
                    </Label>
                    <Select
                      onValueChange={(value) => handleInputChange("employeeType", value)}
                      value={formData.employeeType}
                    >
                      <SelectTrigger className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                        <SelectValue placeholder="Select employee type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation" className="text-sm font-medium text-gray-700">
                      Designation
                    </Label>
                    <Input
                      id="designation"
                      value={formData.designation}
                      onChange={(e) => handleInputChange("designation", e.target.value)}
                      placeholder="Designation"
                      className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-sm font-medium text-gray-700">
                    Specialization (Optional)
                  </Label>
                  <Select
                    onValueChange={(value) => handleInputChange("specialization", value)}
                    value={formData.specialization}
                  >
                    <SelectTrigger className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inbound-sales">Inbound Sales</SelectItem>
                      <SelectItem value="outbound-sales">Outbound Sales</SelectItem>
                      <SelectItem value="customer-support">Customer Support</SelectItem>
                      <SelectItem value="lead-generation">Lead Generation</SelectItem>
                      <SelectItem value="appointment-setting">Appointment Setting</SelectItem>
                      <SelectItem value="survey-research">Survey & Research</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-8 border-t mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 h-12 px-6 border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  className="flex items-center gap-2 h-12 px-8 bg-orange-500 hover:bg-orange-600"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading || uploadingImage}
                  className="flex items-center gap-2 h-12 px-8 bg-green-500 hover:bg-green-600"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : uploadingImage ? (
                    "Uploading Image..."
                  ) : (
                    <>
                      Hire Telecaller
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Error
            </DialogTitle>
            <DialogDescription className="text-gray-600">{modalMessage}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowErrorModal(false)} variant="outline">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              Success!
            </DialogTitle>
            <DialogDescription className="text-gray-600">{modalMessage}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
