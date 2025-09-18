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

      const response = await fetch(`${API_URL}/api/hr/sales-employee/hire`, {
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
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                        currentStep >= step.number
                          ? "bg-purple-500 border-purple-500 text-white shadow-lg"
                          : "border-gray-300 text-gray-400 bg-white"
                      }`}
                    >
                      {currentStep > step.number ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                    </div>
                    <p
                      className={`text-xs mt-2 text-center font-medium max-w-20 ${
                        currentStep >= step.number ? "text-purple-600" : "text-gray-500"
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

            {/* Step 4: Employment Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
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
                    <Input
                      id="assignedZone"
                      value={formData.assignedZone}
                      onChange={(e) => handleInputChange("assignedZone", e.target.value)}
                      placeholder="e.g., North Zone, South Zone"
                      className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      aria-invalid={!!formErrors.assignedZone}
                    />
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
    </>
  )
}
