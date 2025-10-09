"use client"

import DashboardLayout from "@/components/TL_Component/dashboard-layout"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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

export default function TLProfilePage() {
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
      const response = await fetch(`${API_URL}/api/tl/profile/fetch`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setProfileData(data.data)
        setFormData({
          name: data.data.name || "",
          phone: data.data.phone || "",
          personalEmail: data.data.personalEmail || "",
          address: data.data.address || "",
          emergencyContact: data.data.emergencyContact || { name: "", phone: "", relation: "" },
          qualification: data.data.qualification || "",
          experience: data.data.experience || 0,
          previousCompany: data.data.previousCompany || "",
          bankAccount: data.data.bankAccount || {
            accountNumber: "",
            ifscCode: "",
            bankName: "",
            branch: ""
          }
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
      const response = await fetch(`${API_URL}/api/tl/profile/update-profile-data`, {
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
      const response = await fetch(`${API_URL}/api/tl/profile/change-password`, {
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

    // In a real application, you would upload to Cloudflare R2 here
    // For demo purposes, we'll use a placeholder
    const demoPhotoUrl = "https://via.placeholder.com/150x150.png?text=Team+Leader"

    try {
      const response = await fetch(`${API_URL}/api/tl/profile/update-profile-photo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ photoUrl: demoPhotoUrl })
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
                {profileData?.name?.split(' ').map(n => n[0]).join('') || 'TL'}
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

          <div>
            <Label htmlFor="address">Address *</Label>
            <Textarea 
              id="address" 
              value={formData.address || ""}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
            />
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
              <Label htmlFor="emergencyName">Contact Name</Label>
              <Input 
                id="emergencyName" 
                value={formData.emergencyContact?.name || ""}
                onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="emergencyPhone">Phone Number</Label>
              <Input 
                id="emergencyPhone" 
                value={formData.emergencyContact?.phone || ""}
                onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="emergencyRelation">Relation</Label>
              <Input 
                id="emergencyRelation" 
                value={formData.emergencyContact?.relation || ""}
                onChange={(e) => handleInputChange('emergencyContact.relation', e.target.value)}
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
              <Label htmlFor="qualification">Highest Qualification</Label>
              <Input 
                id="qualification" 
                value={formData.qualification || ""}
                onChange={(e) => handleInputChange('qualification', e.target.value)}
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

      {/* Banking Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Banking Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="accountNumber">Account Number *</Label>
              <Input 
                id="accountNumber" 
                value={formData.bankAccount?.accountNumber || ""}
                onChange={(e) => handleInputChange('bankAccount.accountNumber', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ifscCode">IFSC Code *</Label>
              <Input 
                id="ifscCode" 
                value={formData.bankAccount?.ifscCode || ""}
                onChange={(e) => handleInputChange('bankAccount.ifscCode', e.target.value.toUpperCase())}
              />
            </div>
            <div>
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input 
                id="bankName" 
                value={formData.bankAccount?.bankName || ""}
                onChange={(e) => handleInputChange('bankAccount.bankName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="branch">Branch *</Label>
              <Input 
                id="branch" 
                value={formData.bankAccount?.branch || ""}
                onChange={(e) => handleInputChange('bankAccount.branch', e.target.value)}
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
            <Input value={profileData?.businessData?.designation || "Team Leader"} disabled className="bg-gray-50" />
          </div>
          <div>
            <Label>Department</Label>
            <Input value={profileData?.businessData?.department || "Sales"} disabled className="bg-gray-50" />
          </div>
          <div>
            <Label>Assigned Zone</Label>
            <Input value={profileData?.businessData?.assignedZone || ""} disabled className="bg-gray-50" />
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
            <Label>Team Size</Label>
            <Input value={profileData?.businessData?.teamSize || 0} disabled className="bg-gray-50" />
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
      <DashboardLayout title="Profile Settings">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Profile Settings">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>
          <Button onClick={handleSaveProfile} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
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
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeSection === section.id
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