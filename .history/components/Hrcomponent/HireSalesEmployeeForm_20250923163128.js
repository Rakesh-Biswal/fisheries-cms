"use client"

import { useState, useEffect } from "react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Mail, Phone, Briefcase, Target, Calendar, Upload, X, AlertCircle } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function HireSalesEmployeeForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    assignedZone: "",
    monthlyTarget: "",
    joiningDate: "",
    designation: "Sales Executive",
    photo: null,
    address: ""
  })
  
  const [previewUrl, setPreviewUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showErrorModal, setShowErrorModal] = useState(false)

  const salesZones = [
    "North Zone",
    "South Zone", 
    "East Zone",
    "West Zone",
    "Central Zone"
  ]

  const designations = [
    "Sales Executive",
    "Senior Sales Executive",
    "Sales Manager",
    "Area Sales Manager",
    "Regional Sales Manager"
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }))
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const removePhoto = () => {
    setFormData(prev => ({
      ...prev,
      photo: null
    }))
    setPreviewUrl("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const submitData = new FormData()
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'photo' && formData.photo) {
          submitData.append('photo', formData.photo)
        } else {
          submitData.append(key, formData[key])
        }
      })

      const response = await fetch(`${API_URL}/api/hr/sales-employees/hire`, {
        method: "POST",
        credentials: "include",
        body: submitData,
      })

      const result = await response.json()

      if (response.ok) {
        onSuccess(result.data)
      } else {
        throw new Error(result.message || "Failed to hire sales employee")
      }
    } catch (err) {
      console.error("Error hiring sales employee:", err)
      setError(err.message)
      setShowErrorModal(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-6 h-6" />
                Hire New Sales Employee
              </CardTitle>
              <CardDescription className="text-white/90">
                Fill in the details to add a new sales employee to your team
              </CardDescription>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload Section */}
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-20 w-20 border-2 border-purple-200">
                  {previewUrl ? (
                    <AvatarImage src={previewUrl} alt="Preview" />
                  ) : (
                    <AvatarFallback className="bg-purple-100 text-purple-600 text-lg">
                      <Upload className="w-6 h-6" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex gap-2">
                  <Label htmlFor="photo" className="cursor-pointer">
                    <span className="text-sm bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600 transition-colors">
                      Upload Photo
                    </span>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </Label>
                  {previewUrl && (
                    <Button type="button" variant="outline" size="sm" onClick={removePhoto}>
                      Remove
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Experience (Years) *</Label>
                <Input
                  id="experience"
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="Years of experience"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Business Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="designation">Designation *</Label>
                <Select name="designation" value={formData.designation} onValueChange={(value) => setFormData(prev => ({ ...prev, designation: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {designations.map((designation) => (
                      <SelectItem key={designation} value={designation}>
                        {designation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assignedZone">Assigned Zone *</Label>
                <Select name="assignedZone" value={formData.assignedZone} onValueChange={(value) => setFormData(prev => ({ ...prev, assignedZone: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesZones.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {zone}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Targets and Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyTarget">Monthly Target (₹) *</Label>
                <Input
                  id="monthlyTarget"
                  name="monthlyTarget"
                  type="number"
                  value={formData.monthlyTarget}
                  onChange={handleInputChange}
                  placeholder="Enter monthly target amount"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date *</Label>
                <Input
                  id="joiningDate"
                  name="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter full address"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="bg-purple-500 hover:bg-purple-600 flex-1">
                {loading ? "Hiring..." : "Hire Sales Employee"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Error
            </DialogTitle>
            <DialogDescription>
              {error}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button onClick={() => setShowErrorModal(false)} className="flex-1">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}