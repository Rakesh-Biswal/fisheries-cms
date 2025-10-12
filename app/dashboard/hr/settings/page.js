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
import { toast } from "sonner"
import {
  User,
  Bell,
  Shield,
  Mail,
  Smartphone,
  Key,
  Save,
  Camera,
  Building,
  MapPin,
  GraduationCap,
  Briefcase,
  CreditCard,
  UserPlus,
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
  const [formData, setFormData] = useState({})
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
  })

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hr/profile/fetch`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setProfileData(data.data)
        setFormData({
          name: data.data.name || "",
          phone: data.data.phone || "",
          personalEmail: data.data.personalEmail || "",
          address: data.data.address || {
            street: "",
            city: "",
            state: "",
            pincode: ""
          },
          emergencyContact: data.data.emergencyContact || {
            name: "",
            phone: "",
            relation: ""
          },
          qualification: data.data.qualification || {
            degree: "",
            institution: "",
            year: ""
          },
          experience: data.data.experience || 0,
          previousCompany: data.data.previousCompany || "",
        })
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

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.')
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }
      }
      return { ...prev, [field]: value }
    })
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const response = await fetch(`${API_URL}/api/hr/profile/update-profile-data`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setProfileData(data.data)
        toast.success('Profile updated successfully')
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`${API_URL}/api/hr/profile/change-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      if (response.ok) {
        toast.success('Password changed successfully')
        setPasswordData({
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

  const handlePhotoChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Please select an image smaller than 2MB')
      return
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a JPG, PNG, or GIF image')
      return
    }

    try {
      // Upload to Cloudinary and get the actual URL
      const cloudinaryUrl = await ImageUploadService.uploadToCloudinary(file)

      const response = await fetch(`${API_URL}/api/hr/profile/update-profile-photo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ photoUrl: cloudinaryUrl })
      })

      if (response.ok) {
        const data = await response.json()
        setProfileData(data.data)
        toast.success('Profile photo updated successfully')
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update photo')
      }
    } catch (error) {
      console.error('Error updating photo:', error)
      toast.error(error.message || 'Failed to update photo')
    }
  }

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const renderProfileSettings = () => (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileData?.photo || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">
                {profileData?.name?.split(' ').map(n => n[0]).join('') || 'HR'}
              </AvatarFallback>
            </Avatar>
            <div>
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <Label htmlFor="photo-upload">
                <Button variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </span>
                </Button>
              </Label>
              <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input
                id="companyEmail"
                value={profileData?.companyEmail || ""}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="personalEmail">Personal Email</Label>
              <Input
                id="personalEmail"
                type="email"
                value={formData.personalEmail || ""}
                onChange={(e) => handleInputChange('personalEmail', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="emergencyContact.name">Contact Name</Label>
              <Input
                id="emergencyContact.name"
                value={formData.emergencyContact?.name || ""}
                onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="emergencyContact.phone">Phone Number</Label>
              <Input
                id="emergencyContact.phone"
                value={formData.emergencyContact?.phone || ""}
                onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="emergencyContact.relation">Relation</Label>
              <Input
                id="emergencyContact.relation"
                value={formData.emergencyContact?.relation || ""}
                onChange={(e) => handleInputChange('emergencyContact.relation', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="address.street">Street Address</Label>
              <Input
                id="address.street"
                value={formData.address?.street || ""}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="address.city">City</Label>
              <Input
                id="address.city"
                value={formData.address?.city || ""}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="address.state">State</Label>
              <Input
                id="address.state"
                value={formData.address?.state || ""}
                onChange={(e) => handleInputChange('address.state', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="address.pincode">Pincode</Label>
              <Input
                id="address.pincode"
                value={formData.address?.pincode || ""}
                onChange={(e) => handleInputChange('address.pincode', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Qualifications & Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Qualifications & Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="qualification.degree">Highest Qualification</Label>
              <Input
                id="qualification.degree"
                value={formData.qualification?.degree || ""}
                onChange={(e) => handleInputChange('qualification.degree', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="experience">Total Experience (Years)</Label>
              <Input
                id="experience"
                type="number"
                value={formData.experience || 0}
                onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="qualification.institution">Institution</Label>
              <Input
                id="qualification.institution"
                value={formData.qualification?.institution || ""}
                onChange={(e) => handleInputChange('qualification.institution', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="qualification.year">Year of Completion</Label>
              <Input
                id="qualification.year"
                value={formData.qualification?.year || ""}
                onChange={(e) => handleInputChange('qualification.year', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="previousCompany">Previous Company</Label>
              <Input
                id="previousCompany"
                value={formData.previousCompany || ""}
                onChange={(e) => handleInputChange('previousCompany', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
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
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            />
          </div>
          <Button onClick={handleChangePassword} disabled={saving}>
            {saving ? "Updating..." : "Change Password"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderBusinessInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Business Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Employee Code</Label>
            <Input value={profileData?.empCode || ""} disabled className="bg-gray-50" />
          </div>
          <div>
            <Label>Designation</Label>
            <Input value={profileData?.businessData?.designation || "HR Executive"} disabled className="bg-gray-50" />
          </div>
          <div>
            <Label>Department</Label>
            <Input value={profileData?.businessData?.department || "Human Resources"} disabled className="bg-gray-50" />
          </div>
          <div>
            <Label>Employee Type</Label>
            <Input value={profileData?.businessData?.employeeType || "Full-time"} disabled className="bg-gray-50" />
          </div>
          <div>
            <Label>Joining Date</Label>
            <Input
              value={profileData?.businessData?.joiningDate ? new Date(profileData.businessData.joiningDate).toLocaleDateString() : ""}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div>
            <Label>Status</Label>
            <Input value={profileData?.businessData?.deptStatus || "Active"} disabled className="bg-gray-50" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderSectionContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-6">
            {renderProfileSettings()}
            {renderBusinessInfo()}
          </div>
        )
      case "notifications":
        return renderNotificationSettings()
      case "security":
        return renderSecuritySettings()
      default:
        return renderProfileSettings()
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="HR Profile Settings">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="HR Profile Settings">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">HR Profile Settings</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {profileData?.empCode || 'HR001'}
              </Badge>
              <Badge variant={profileData?.status === 'active' ? 'default' : 'secondary'}>
                {profileData?.status || 'active'}
              </Badge>
            </div>
            <Button onClick={handleSaveProfile} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
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