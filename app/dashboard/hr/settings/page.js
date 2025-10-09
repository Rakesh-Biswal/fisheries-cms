"use client"

import DashboardLayout from "@/components/Hrcomponent/dashboard-layout"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  User,
  Bell,
  Shield,
  Mail,
  Smartphone,
  Key,
  Building,
  Save,
  Camera,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
} from "lucide-react"
import ImageUploadService from "@/services/ImageUploadService"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

const settingsSections = [
  {
    id: "profile",
    title: "Profile Settings",
    icon: User,
    description: "Manage your personal information and preferences",
  },
  {
    id: "business",
    title: "Business Details",
    icon: Building,
    description: "Update your employment and business information",
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    description: "Configure notification preferences and alerts",
  },
  {
    id: "security",
    title: "Security",
    icon: Shield,
    description: "Manage password and security settings",
  },
]

export default function HrProfilePage() {
  const [activeSection, setActiveSection] = useState("profile")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    twoFactorAuth: false,
  })

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    phone: "",
    companyEmail: "",
    personalEmail: "",
    emergencyContact: {
      name: "",
      phone: "",
      relation: ""
    },
    address: {
      street: "",
      city: "",
      state: "",
      pincode: ""
    },
    qualification: {
      degree: "",
      institution: "",
      year: ""
    },
    experience: 0
  })

  const [businessInfo, setBusinessInfo] = useState({
    employeeType: "full-time",
    department: "Human Resources",
    designation: "HR Executive",
    joiningDate: "",
    deptStatus: "active",
    probationPeriod: 6,
    confirmationDate: "",
    performanceRating: null,
    notes: ""
  })

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/hr/profile/fetch`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setProfileData(data.data)
        populateFormData(data.data)
      } else {
        throw new Error('Failed to fetch profile data')
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
      toast.error('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const populateFormData = (data) => {
    // Personal Information
    setPersonalInfo({
      name: data.name || "",
      phone: data.phone || "",
      companyEmail: data.companyEmail || "",
      personalEmail: data.personalEmail || "",
      emergencyContact: data.emergencyContact || {
        name: "",
        phone: "",
        relation: ""
      },
      address: data.address || {
        street: "",
        city: "",
        state: "",
        pincode: ""
      },
      qualification: data.qualification || {
        degree: "",
        institution: "",
        year: ""
      },
      experience: data.experience || 0
    })

    // Business Information
    if (data.businessData) {
      setBusinessInfo({
        employeeType: data.businessData.employeeType || "full-time",
        department: data.businessData.department || "Human Resources",
        designation: data.businessData.designation || "HR Executive",
        joiningDate: data.businessData.joiningDate ?
          new Date(data.businessData.joiningDate).toISOString().split('T')[0] : "",
        deptStatus: data.businessData.deptStatus || "active",
        probationPeriod: data.businessData.probationPeriod || 6,
        confirmationDate: data.businessData.confirmationDate ?
          new Date(data.businessData.confirmationDate).toISOString().split('T')[0] : "",
        performanceRating: data.businessData.performanceRating || null,
        notes: data.businessData.notes || ""
      })
    }
  }

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handlePersonalInfoChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setPersonalInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setPersonalInfo(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleBusinessInfoChange = (field, value) => {
    setBusinessInfo(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field, value) => {
    setPasswordInfo(prev => ({ ...prev, [field]: value }))
  }

  const savePersonalInfo = async () => {
    try {
      setSaving(true)
      const response = await fetch(`${API_URL}/api/hr/profile/update-personal-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(personalInfo)
      })

      if (response.ok) {
        const data = await response.json()
        setProfileData(data.data)
        toast.success('Personal information updated successfully')
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update personal information')
      }
    } catch (error) {
      console.error('Error updating personal info:', error)
      toast.error(error.message || 'Failed to update personal information')
    } finally {
      setSaving(false)
    }
  }

  const saveBusinessInfo = async () => {
    try {
      setSaving(true)
      const response = await fetch(`${API_URL}/api/hr/profile/update-business-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(businessInfo)
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Business information updated successfully')
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update business information')
      }
    } catch (error) {
      console.error('Error updating business info:', error)
      toast.error(error.message || 'Failed to update business information')
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async () => {
    try {
      setSaving(true)
      const response = await fetch(`${API_URL}/api/hr/profile/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(passwordInfo)
      })

      if (response.ok) {
        toast.success('Password changed successfully')
        setPasswordInfo({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error(error.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      // Upload to Cloudinary and get the actual URL
      const cloudinaryUrl = await ImageUploadService.uploadToCloudinary(file)

      const response = await fetch(`${API_URL}/api/hr/profile/update-profile-photo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ photoUrl: cloudinaryUrl }) // Send Cloudinary URL to backend
      })

      if (response.ok) {
        const data = await response.json()
        setProfileData(data.data)
        toast.success('Profile photo updated successfully')
      } else {
        throw new Error('Failed to update profile photo')
      }
    } catch (error) {
      console.error('Error updating profile photo:', error)
      toast.error(error.message || 'Failed to update profile photo')
    }
  }

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Photo */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-gray-200">
                <AvatarImage src={profileData?.photo || "/placeholder-user.jpg"} />
                <AvatarFallback className="text-lg">
                  {profileData?.name?.split(' ').map(n => n[0]).join('') || 'HR'}
                </AvatarFallback>
              </Avatar>
              <Label htmlFor="photo-upload" className="absolute bottom-0 right-0 cursor-pointer">
                <div className="bg-blue-600 rounded-full p-2 hover:bg-blue-700 transition-colors">
                  <Camera className="h-4 w-4 text-white" />
                </div>
              </Label>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
            <div>
              <p className="font-medium">Profile Photo</p>
              <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={personalInfo.name}
                onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <Label htmlFor="companyEmail">Company Email *</Label>
              <Input
                id="companyEmail"
                type="email"
                value={personalInfo.companyEmail}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="personalEmail">Personal Email</Label>
              <Input
                id="personalEmail"
                type="email"
                value={personalInfo.personalEmail}
                onChange={(e) => handlePersonalInfoChange('personalEmail', e.target.value)}
                placeholder="personal@example.com"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Emergency Contact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="emergencyName">Contact Name</Label>
                <Input
                  id="emergencyName"
                  value={personalInfo.emergencyContact.name}
                  onChange={(e) => handlePersonalInfoChange('emergencyContact.name', e.target.value)}
                  placeholder="Emergency contact name"
                />
              </div>
              <div>
                <Label htmlFor="emergencyPhone">Phone Number</Label>
                <Input
                  id="emergencyPhone"
                  value={personalInfo.emergencyContact.phone}
                  onChange={(e) => handlePersonalInfoChange('emergencyContact.phone', e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <Label htmlFor="emergencyRelation">Relation</Label>
                <Input
                  id="emergencyRelation"
                  value={personalInfo.emergencyContact.relation}
                  onChange={(e) => handlePersonalInfoChange('emergencyContact.relation', e.target.value)}
                  placeholder="Father/Mother/Spouse"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={personalInfo.address.street}
                  onChange={(e) => handlePersonalInfoChange('address.street', e.target.value)}
                  placeholder="Enter street address"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={personalInfo.address.city}
                  onChange={(e) => handlePersonalInfoChange('address.city', e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={personalInfo.address.state}
                  onChange={(e) => handlePersonalInfoChange('address.state', e.target.value)}
                  placeholder="Enter state"
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={personalInfo.address.pincode}
                  onChange={(e) => handlePersonalInfoChange('address.pincode', e.target.value)}
                  placeholder="Enter pincode"
                />
              </div>
            </div>
          </div>

          {/* Qualification & Experience */}

          <Button onClick={savePersonalInfo} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Personal Information"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderBusinessSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Employment Details</CardTitle>
          <CardDescription>Update your professional and employment information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employeeType">Employee Type</Label>
              <Select value={businessInfo.employeeType} onValueChange={(value) => handleBusinessInfoChange('employeeType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="intern">Intern</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={businessInfo.department}
                onChange={(e) => handleBusinessInfoChange('department', e.target.value)}
                placeholder="Human Resources"
              />
            </div>
            <div>
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                value={businessInfo.designation}
                onChange={(e) => handleBusinessInfoChange('designation', e.target.value)}
                placeholder="HR Manager"
              />
            </div>
            <div>
              <Label htmlFor="deptStatus">Department Status</Label>
              <Select value={businessInfo.deptStatus} onValueChange={(value) => handleBusinessInfoChange('deptStatus', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="joiningDate">Joining Date</Label>
              <Input
                id="joiningDate"
                type="date"
                value={businessInfo.joiningDate}
                onChange={(e) => handleBusinessInfoChange('joiningDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="confirmationDate">Confirmation Date</Label>
              <Input
                id="confirmationDate"
                type="date"
                value={businessInfo.confirmationDate}
                onChange={(e) => handleBusinessInfoChange('confirmationDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="probationPeriod">Probation Period (Months)</Label>
              <Input
                id="probationPeriod"
                type="number"
                value={businessInfo.probationPeriod}
                onChange={(e) => handleBusinessInfoChange('probationPeriod', parseInt(e.target.value) || 0)}
                placeholder="6"
              />
            </div>
            <div>
              <Label htmlFor="performanceRating">Performance Rating (1-5)</Label>
              <Input
                id="performanceRating"
                type="number"
                min="1"
                max="5"
                value={businessInfo.performanceRating || ""}
                onChange={(e) => handleBusinessInfoChange('performanceRating', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="4.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={businessInfo.notes}
              onChange={(e) => handleBusinessInfoChange('notes', e.target.value)}
              placeholder="Any additional information or notes..."
              rows={3}
            />
          </div>

          <Button onClick={saveBusinessInfo} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Business Information"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Configure how you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive push notifications on your device</p>
              </div>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">Weekly Reports</p>
                <p className="text-sm text-gray-500">Receive weekly summary reports</p>
              </div>
            </div>
            <Switch
              checked={settings.weeklyReports}
              onCheckedChange={(checked) => handleSettingChange("weeklyReports", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordInfo.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordInfo.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordInfo.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          <Button onClick={changePassword} disabled={saving}>
            <Key className="h-4 w-4 mr-2" />
            {saving ? "Updating..." : "Update Password"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Require a verification code for login</p>
              </div>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
            />
          </div>
          {settings.twoFactorAuth && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Two-factor authentication is enabled. Use your authenticator app to generate codes.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderSectionContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )
    }

    switch (activeSection) {
      case "profile":
        return renderProfileSettings()
      case "business":
        return renderBusinessSettings()
      case "notifications":
        return renderNotificationSettings()
      case "security":
        return renderSecuritySettings()
      default:
        return renderProfileSettings()
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">HR Profile Settings</h1>
            <p className="text-gray-600">Manage your account and professional information</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {profileData?.empCode || 'HR001'}
            </Badge>
            <Badge variant={profileData?.status === 'active' ? 'default' : 'secondary'}>
              {profileData?.status || 'active'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <Card className="lg:col-span-1">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {settingsSections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${activeSection === section.id
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      <div>
                        <p className="font-medium text-sm">{section.title}</p>
                        <p className="text-xs text-gray-500">{section.description}</p>
                      </div>
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}