"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"
import { User, CreditCard, FileText, ArrowLeft, ArrowRight, Check, Loader2, Banknote, AlertCircle } from "lucide-react"
import { toast } from "../ui/use-toast"


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function HireSalesEmployeeForm({ onClose, onSuccess }) {
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
    department: "Sales",
    joiningDate: "",
    salary: "",
    designation: "Sales Executive",
    experience: "",
    qualification: "",
    previousCompany: "",
    assignedZone: "",
    monthlyTarget: "",
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileChange = async (field, file) => {
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setFormErrors((prev) => ({ ...prev, photo: "Please select an image smaller than 5MB" }))
      return
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      setFormErrors((prev) => ({ ...prev, photo: "Please select a JPG, PNG, or GIF image" }))
      return
    }

    setUploadingImage(true)
    setFormErrors((prev) => ({ ...prev, photo: "" }))

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Image = reader.result

        setFormData((prev) => ({
          ...prev,
          [field]: base64Image,
          photoUrl: base64Image,
        }))

        toast({
          title: "Image selected successfully",
          description: "Base64 string generated — ready to send to backend.",
        })
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error handling image:", error)
      setFormErrors((prev) => ({ ...prev, photo: "Something went wrong. Please try again." }))
    } finally {
      setUploadingImage(false)
    }
  }

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
        if (!formData.employeeType) {
          errors.employeeType = "Employee type is required"
          isValid = false
        }
        if (!formData.department) {
          errors.department = "Department is required"
          isValid = false
        }
        if (!formData.designation) {
          errors.designation = "Designation is required"
          isValid = false
        }
        if (!formData.experience) {
          errors.experience = "Experience is required"
          isValid = false
        } else if (formData.experience < 0 || formData.experience > 50) {
          errors.experience = "Experience must be between 0 and 50 years"
          isValid = false
        }
        if (!formData.qualification) {
          errors.qualification = "Qualification is required"
          isValid = false
        }
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
        if (!formData.assignedZone) {
          errors.assignedZone = "Assigned zone is required"
          isValid = false
        }
        if (!formData.monthlyTarget) {
          errors.monthlyTarget = "Monthly target is required"
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

      const response = await fetch(`${API_URL}/api/hr/sales-employees/hire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(submissionData),
      })

      if (response.ok) {
        const result = await response.json()
        setModalMessage(`${formData.name} has been successfully added as a Sales Employee!`)
        setShowSuccessModal(true)
        setTimeout(() => {
          setShowSuccessModal(false)
          onSuccess(result)
          onClose()
        }, 2000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to hire Sales Employee")
      }
    } catch (error) {
      setModalMessage(error.message || "Failed to hire Sales Employee. Please try again.")
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
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <div className="mt-8 mb-4">
              <div className="flex items-center justify-between relative">
                {steps.map((step, index) => (
                  <div
                    key={step.number}
                    className="flex flex-col items-center z-10 bg-gradient-to-r from-purple-50 to-pink-50 px-2"
                  >
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${currentStep >= step.number
                          ? "bg-purple-500 border-purple-500 text-white shadow-lg"
                          : "border-gray-300 text-gray-400 bg-white"
                        }`}
                    >
                      {currentStep > step.number ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                    </div>
                    <p
                      className={`text-xs mt-2 text-center font-medium max-w-20 ${currentStep >= step.number ? "text-purple-600" : "text-gray-500"
                        }`}
                    >
                      {step.title}
                    </p>
                  </div>
                ))}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                  <div
                    className="h-full bg-purple-500 transition-all duration-500 ease-in-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="text-center mt-6">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-4 py-1">
                  Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
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
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                    placeholder="sales.employee@company.com"
                    className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                    className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    aria-invalid={!!formErrors.password}
                  />
                  {formErrors.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.password}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                    Sales Employee will be asked to change this on first login
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Documents & Personal Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="aadhar" className="text-sm font-medium text-gray-700">
                      Aadhar Number *
                    </Label>
                    <Input
                      id="aadhar"
                      value={formData.aadhar}
                      onChange={(e) => handleInputChange("aadhar", e.target.value.replace(/\D/g, ""))}
                      placeholder="1234 5678 9012"
                      maxLength={12}
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                      onChange={(e) => handleInputChange("pan", e.target.value.toUpperCase())}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                    Profile Photo
                  </Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("photo", e.target.files[0])}
                    className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    aria-invalid={!!formErrors.photo}
                  />
                  {formErrors.photo && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.photo}
                    </p>
                  )}
                  {formData.photoUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.photoUrl || "/placeholder.svg"}
                        alt="Profile preview"
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Complete Address *
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter complete address"
                    className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    aria-invalid={!!formErrors.address}
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName" className="text-sm font-medium text-gray-700">
                      Emergency Contact Name
                    </Label>
                    <Input
                      id="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                      placeholder="Contact person name"
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone" className="text-sm font-medium text-gray-700">
                      Emergency Contact Phone
                    </Label>
                    <Input
                      id="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value.replace(/\D/g, ""))}
                      placeholder="9876543210"
                      maxLength={10}
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                      placeholder="Father/Mother/Spouse"
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Banking Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">
                      Account Number *
                    </Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                      placeholder="Enter account number"
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                      placeholder="SBIN0001234"
                      maxLength={11}
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      aria-invalid={!!formErrors.ifscCode}
                    />
                    {formErrors.ifscCode && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.ifscCode}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bankName" className="text-sm font-medium text-gray-700">
                      Bank Name *
                    </Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange("bankName", e.target.value)}
                      placeholder="State Bank of India"
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                      Branch Name *
                    </Label>
                    <Input
                      id="branch"
                      value={formData.branch}
                      onChange={(e) => handleInputChange("branch", e.target.value)}
                      placeholder="Main Branch"
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-700">
                    <strong>Note:</strong> Banking details are required for salary processing. Please ensure all
                    information is accurate.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Employment Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="employeeType" className="text-sm font-medium text-gray-700">
                      Employee Type *
                    </Label>
                    <select
                      id="employeeType"
                      value={formData.employeeType}
                      onChange={(e) => handleInputChange("employeeType", e.target.value)}
                      className="h-12 w-full border border-gray-300 rounded-md px-3 focus:border-purple-500 focus:ring-purple-500"
                    >
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="intern">Intern</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                      Department *
                    </Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      placeholder="Sales"
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="designation" className="text-sm font-medium text-gray-700">
                      Designation *
                    </Label>
                    <select
                      id="designation"
                      value={formData.designation}
                      onChange={(e) => handleInputChange("designation", e.target.value)}
                      className="h-12 w-full border border-gray-300 rounded-md px-3 focus:border-purple-500 focus:ring-purple-500"
                    >
                      <option value="Sales Executive">Sales Executive</option>
                      <option value="Sales Associate">Sales Associate</option>
                      <option value="Senior Sales Executive">Senior Sales Executive</option>
                      <option value="Sales Representative">Sales Representative</option>
                      <option value="Business Development Executive">Business Development Executive</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                      Experience (Years) *
                    </Label>
                    <Input
                      id="experience"
                      type="number"
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      placeholder="2"
                      min="0"
                      max="50"
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="qualification" className="text-sm font-medium text-gray-700">
                      Qualification *
                    </Label>
                    <select
                      id="qualification"
                      value={formData.qualification}
                      onChange={(e) => handleInputChange("qualification", e.target.value)}
                      className="h-12 w-full border border-gray-300 rounded-md px-3 focus:border-purple-500 focus:ring-purple-500"
                    >
                      <option value="">Select Qualification</option>
                      <option value="10th">10th Pass</option>
                      <option value="12th">12th Pass</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Post Graduate">Post Graduate</option>
                      <option value="MBA">MBA</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="previousCompany" className="text-sm font-medium text-gray-700">
                      Previous Company
                    </Label>
                    <Input
                      id="previousCompany"
                      value={formData.previousCompany}
                      onChange={(e) => handleInputChange("previousCompany", e.target.value)}
                      placeholder="Previous company name (if any)"
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

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
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                      placeholder="30000"
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                    <Label htmlFor="assignedZone" className="text-sm font-medium text-gray-700">
                      Assigned Zone *
                    </Label>
                    <select
                      id="assignedZone"
                      value={formData.assignedZone}
                      onChange={(e) => handleInputChange("assignedZone", e.target.value)}
                      className="h-12 w-full border border-gray-300 rounded-md px-3 focus:border-purple-500 focus:ring-purple-500"
                      aria-invalid={!!formErrors.assignedZone}
                    >
                      <option value="">Select Zone</option>
                      <option value="North Zone">North Zone</option>
                      <option value="South Zone">South Zone</option>
                      <option value="East Zone">East Zone</option>
                      <option value="West Zone">West Zone</option>
                      <option value="Central Zone">Central Zone</option>
                      <option value="Metro Zone">Metro Zone</option>
                    </select>
                    {formErrors.assignedZone && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.assignedZone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyTarget" className="text-sm font-medium text-gray-700">
                      Monthly Sales Target (₹) *
                    </Label>
                    <Input
                      id="monthlyTarget"
                      type="number"
                      value={formData.monthlyTarget}
                      onChange={(e) => handleInputChange("monthlyTarget", e.target.value)}
                      placeholder="50000"
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      aria-invalid={!!formErrors.monthlyTarget}
                    />
                    {formErrors.monthlyTarget && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.monthlyTarget}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-700">
                    <strong>Note:</strong> All employment details are required for proper onboarding and role
                    assignment.
                  </p>
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
                  className="flex items-center gap-2 h-12 px-8 bg-purple-500 hover:bg-purple-600"
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
                      Hire Sales Employee
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
