"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { User, CreditCard, FileText, Camera, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import { toast } from "../ui/use-toast"
import {ImageUploadService} from "../../services/imageUploadService"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HireHrForm({ onClose, onSuccess }) {
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [formErrors, setFormErrors] = useState({})
    const [formData, setFormData] = useState({
        // Step 1 - Basic Info
        name: "",
        phone: "",
        email: "",
        password: "",

        // Step 2 - Documents
        aadhar: "",
        pan: "",
        photo: null,
        photoUrl: "", // New field for storing the uploaded image URL
        address: "",

        // Step 3 - Employment Details
        employeeType: "",
        department: "HR",
        joiningDate: "",
        salary: "",
        designation: "",
    })

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: "" }))
        }
    }

    const handleFileChange = async (field, file) => {
        if (!file) return;

        setUploadingImage(true);
        setFormErrors(prev => ({ ...prev, photo: "" }))

        try {
            // Upload to Cloudinary and get the URL
            const imageUrl = await ImageUploadService.uploadToCloudinary(file);

            
            setFormData((prev) => ({
                ...prev,
                [field]: imageUrl, // Store Cloudinary URL
                photoUrl: imageUrl // For preview
            }));

            toast({
                title: "Image uploaded successfully",
                description: "Profile photo has been uploaded to Cloudinary",
            });
        } catch (error) {
            console.error("Error uploading image:", error);
            setFormErrors(prev => ({ ...prev, photo: error.message }))
        } finally {
            setUploadingImage(false);
        }
    };

    const validateStep = (step) => {
        const errors = {};
        let isValid = true;

        switch (step) {
            case 1:
                if (!formData.name) {
                    errors.name = "Full name is required";
                    isValid = false;
                }
                if (!formData.phone) {
                    errors.phone = "Phone number is required";
                    isValid = false;
                } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
                    errors.phone = "Please enter a valid 10-digit phone number";
                    isValid = false;
                }
                if (!formData.email) {
                    errors.email = "Email is required";
                    isValid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    errors.email = "Please enter a valid email address";
                    isValid = false;
                }
                if (!formData.password) {
                    errors.password = "Password is required";
                    isValid = false;
                } else if (formData.password.length < 6) {
                    errors.password = "Password must be at least 6 characters";
                    isValid = false;
                }
                break;
            case 2:
                if (!formData.aadhar) {
                    errors.aadhar = "Aadhar number is required";
                    isValid = false;
                } else if (!/^[0-9]{12}$/.test(formData.aadhar.replace(/\D/g, ''))) {
                    errors.aadhar = "Please enter a valid 12-digit Aadhar number";
                    isValid = false;
                }
                if (!formData.pan) {
                    errors.pan = "PAN number is required";
                    isValid = false;
                } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
                    errors.pan = "Please enter a valid PAN number";
                    isValid = false;
                }
                if (!formData.address) {
                    errors.address = "Address is required";
                    isValid = false;
                }
                break;
            case 3:
                if (!formData.employeeType) {
                    errors.employeeType = "Employee type is required";
                    isValid = false;
                }
                if (!formData.designation) {
                    errors.designation = "Designation is required";
                    isValid = false;
                }
                if (!formData.joiningDate) {
                    errors.joiningDate = "Joining date is required";
                    isValid = false;
                }
                if (!formData.salary) {
                    errors.salary = "Salary is required";
                    isValid = false;
                } else if (formData.salary <= 0) {
                    errors.salary = "Salary must be a positive number";
                    isValid = false;
                }
                break;
            default:
                isValid = false;
        }

        setFormErrors(errors);
        return isValid;
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
        if (!validateStep(3)) {
            return;
        }

        setLoading(true)
        try {
            // Prepare data for submission (excluding the file object)
            const submissionData = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                password: formData.password,
                aadhar: formData.aadhar,
                pan: formData.pan,
                photo: formData.photoUrl, // Send the URL instead of the file
                address: formData.address,
                employeeType: formData.employeeType,
                department: formData.department,
                joiningDate: formData.joiningDate,
                salary: formData.salary,
                designation: formData.designation,
            }

            const response = await fetch(`${API_URL}/api/ceo/hr/hire-hr`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include', // Include credentials for cookie authentication
                body: JSON.stringify(submissionData),
            })

            if (response.ok) {
                const result = await response.json()
                toast({
                    title: "HR Hired Successfully!",
                    description: `${formData.name} has been added to the HR department.`,
                })
                onSuccess(result)
                onClose()
            } else {
                const errorData = await response.json()
                throw new Error(errorData.message || "Failed to create HR")
            }
        } catch (error) {
            setFormErrors(prev => ({ ...prev, submit: error.message || "Failed to hire HR. Please try again." }))
        } finally {
            setLoading(false)
        }
    }

    const steps = [
        { number: 1, title: "Basic Information", icon: User },
        { number: 2, title: "Documents & Address", icon: FileText },
        { number: 3, title: "Employment Details", icon: CreditCard },
    ]

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto py-8">
            <Card className="w-full max-w-2xl mx-4 bg-white">
                <CardHeader className="sticky top-0 bg-white z-10 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">Hire New HR</CardTitle>
                            <CardDescription>Add a new HR member to your team</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full">
                            ×
                        </Button>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mt-6 px-2">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex flex-col items-center flex-1">
                                <div className="flex items-center w-full">
                                    {index !== 0 && (
                                        <div className={`flex-1 h-1 mx-2 ${currentStep > step.number ? "bg-blue-500" : "bg-gray-300"}`} />
                                    )}
                                    <div
                                        className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${currentStep >= step.number
                                            ? "bg-blue-500 border-blue-500 text-white"
                                            : "border-gray-300 text-gray-400"
                                            }`}
                                    >
                                        {currentStep > step.number ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                                    </div>
                                    {index !== steps.length - 1 && (
                                        <div className={`flex-1 h-1 mx-2 ${currentStep > step.number ? "bg-blue-500" : "bg-gray-300"}`} />
                                    )}
                                </div>
                                <p className={`text-xs mt-2 text-center ${currentStep >= step.number ? "text-blue-500 font-medium" : "text-gray-500"}`}>
                                    {step.title}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 py-6">
                    {/* Submit Error Message */}
                    {formErrors.submit && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                            {formErrors.submit}
                        </div>
                    )}

                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        placeholder="Enter full name"
                                        className="h-11"
                                        aria-invalid={!!formErrors.name}
                                    />
                                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, ''))}
                                        placeholder="9876543210"
                                        maxLength={10}
                                        className="h-11"
                                        aria-invalid={!!formErrors.phone}
                                    />
                                    {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Company Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    placeholder="hr@company.com"
                                    className="h-11"
                                    aria-invalid={!!formErrors.email}
                                />
                                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">Temporary Password *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    placeholder="Create temporary password"
                                    className="h-11"
                                    aria-invalid={!!formErrors.password}
                                />
                                {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                                <p className="text-xs text-muted-foreground mt-2">
                                    Employee will be asked to change this on first login
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Documents & Address */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="aadhar" className="text-sm font-medium">Aadhar Number *</Label>
                                    <Input
                                        id="aadhar"
                                        value={formData.aadhar}
                                        onChange={(e) => handleInputChange("aadhar", e.target.value.replace(/\D/g, '').slice(0, 12))}
                                        placeholder="1234 5678 9012"
                                        maxLength={12}
                                        className="h-11"
                                        aria-invalid={!!formErrors.aadhar}
                                    />
                                    {formErrors.aadhar && <p className="text-red-500 text-xs mt-1">{formErrors.aadhar}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pan" className="text-sm font-medium">PAN Number *</Label>
                                    <Input
                                        id="pan"
                                        value={formData.pan}
                                        onChange={(e) => handleInputChange("pan", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))}
                                        placeholder="ABCDE1234F"
                                        maxLength={10}
                                        className="h-11"
                                        aria-invalid={!!formErrors.pan}
                                    />
                                    {formErrors.pan && <p className="text-red-500 text-xs mt-1">{formErrors.pan}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="photo" className="text-sm font-medium">Profile Photo (Optional)</Label>
                                <div className={`border-2 border-dashed rounded-lg p-4 text-center ${formErrors.photo ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
                                    <Camera className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                                    <Input
                                        id="photo"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange("photo", e.target.files[0])}
                                        className="hidden"
                                        disabled={uploadingImage}
                                    />
                                    <Label htmlFor="photo" className="cursor-pointer text-sm">
                                        <span className="text-blue-500 hover:text-blue-600 font-medium">
                                            {uploadingImage ? "Uploading..." : "Click to upload photo"}
                                        </span>
                                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF (max 5MB)</p>
                                    </Label>
                                    {formData.photo && (
                                        <div className="mt-2">
                                            <p className="text-sm text-green-600 font-medium">{formData.photo.name} selected</p>
                                            {formData.photoUrl && (
                                                <p className="text-xs text-muted-foreground">Successfully uploaded to cloud storage</p>
                                            )}
                                        </div>
                                    )}
                                    {formErrors.photo && <p className="text-red-500 text-xs mt-2">{formErrors.photo}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-sm font-medium">Address *</Label>
                                <Textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                    placeholder="Enter complete address"
                                    rows={3}
                                    className="resize-none"
                                    aria-invalid={!!formErrors.address}
                                />
                                {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Employment Details */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="employeeType" className="text-sm font-medium">Employee Type *</Label>
                                    <Select
                                        onValueChange={(value) => handleInputChange("employeeType", value)}
                                        value={formData.employeeType}
                                    >
                                        <SelectTrigger className="h-11" aria-invalid={!!formErrors.employeeType}>
                                            <SelectValue placeholder="Select employee type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="full-time">Full Time</SelectItem>
                                            <SelectItem value="part-time">Part Time</SelectItem>
                                            <SelectItem value="contract">Contract</SelectItem>
                                            <SelectItem value="intern">Intern</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {formErrors.employeeType && <p className="text-red-500 text-xs mt-1">{formErrors.employeeType}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="designation" className="text-sm font-medium">Designation *</Label>
                                    <Select
                                        onValueChange={(value) => handleInputChange("designation", value)}
                                        value={formData.designation}
                                    >
                                        <SelectTrigger className="h-11" aria-invalid={!!formErrors.designation}>
                                            <SelectValue placeholder="Select designation" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hr-manager">HR Manager</SelectItem>
                                            <SelectItem value="hr-executive">HR Executive</SelectItem>
                                            <SelectItem value="recruiter">Recruiter</SelectItem>
                                            <SelectItem value="hr-assistant">HR Assistant</SelectItem>
                                            <SelectItem value="training-specialist">Training Specialist</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {formErrors.designation && <p className="text-red-500 text-xs mt-1">{formErrors.designation}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="joiningDate" className="text-sm font-medium">Joining Date *</Label>
                                    <Input
                                        id="joiningDate"
                                        type="date"
                                        value={formData.joiningDate}
                                        onChange={(e) => handleInputChange("joiningDate", e.target.value)}
                                        className="h-11"
                                        aria-invalid={!!formErrors.joiningDate}
                                    />
                                    {formErrors.joiningDate && <p className="text-red-500 text-xs mt-1">{formErrors.joiningDate}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="salary" className="text-sm font-medium">Monthly Salary (₹) *</Label>
                                    <Input
                                        id="salary"
                                        type="number"
                                        value={formData.salary}
                                        onChange={(e) => handleInputChange("salary", e.target.value)}
                                        placeholder="50000"
                                        className="h-11"
                                        aria-invalid={!!formErrors.salary}
                                    />
                                    {formErrors.salary && <p className="text-red-500 text-xs mt-1">{formErrors.salary}</p>}
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
                            <ArrowLeft className="w-4 h-4" />
                            Previous
                        </Button>

                        {currentStep < 3 ? (
                            <Button onClick={nextStep} className="flex items-center gap-2 h-11 px-6">
                                Next
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={loading || uploadingImage}
                                className="flex items-center gap-2 h-11 px-6"
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
                                        Hire HR
                                        <Check className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}