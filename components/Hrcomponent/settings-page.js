"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Mail,
  Smartphone,
  Key,
  Building,
  Save,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
} from "lucide-react"

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
    description: "Manage password, 2FA, and security settings",
  },
  {
    id: "appearance",
    title: "Appearance",
    icon: Palette,
    description: "Customize theme and display preferences",
  },
  {
    id: "company",
    title: "Company Settings",
    icon: Building,
    description: "Configure company-wide settings and policies",
  },
  {
    id: "integrations",
    title: "Integrations",
    icon: Database,
    description: "Manage third-party integrations and APIs",
  },
]

const teamMembers = [
  {
    id: 1,
    name: "Melanie Stone",
    email: "melanie.stone@company.com",
    role: "HR Manager",
    avatar: "/professional-woman-diverse.png",
    status: "Active",
    lastActive: "2024-01-15",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.smith@company.com",
    role: "HR Assistant",
    avatar: "/professional-man.png",
    status: "Active",
    lastActive: "2024-01-15",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Recruiter",
    avatar: "/professional-woman-diverse.png",
    status: "Inactive",
    lastActive: "2024-01-12",
  },
]

const integrations = [
  {
    name: "Slack",
    description: "Team communication and notifications",
    status: "Connected",
    icon: "💬",
    lastSync: "2024-01-15 10:30 AM",
  },
  {
    name: "Google Workspace",
    description: "Email and calendar integration",
    status: "Connected",
    icon: "📧",
    lastSync: "2024-01-15 09:15 AM",
  },
  {
    name: "Zoom",
    description: "Video conferencing for interviews",
    status: "Disconnected",
    icon: "📹",
    lastSync: "Never",
  },
  {
    name: "LinkedIn",
    description: "Recruitment and candidate sourcing",
    status: "Connected",
    icon: "💼",
    lastSync: "2024-01-14 08:45 PM",
  },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile")
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    darkMode: false,
    language: "English",
    timezone: "Asia/Kolkata",
    twoFactorAuth: false,
  })

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/professional-woman-diverse.png" />
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
              <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="Melanie" />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Stone" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="melanie.stone@company.com" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue="+91 98765 43210" />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input id="department" defaultValue="Human Resources" />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input id="position" defaultValue="HR Manager" />
            </div>
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              defaultValue="Experienced HR Manager with 8+ years in talent acquisition and employee relations."
            />
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

      <Card>
        <CardHeader>
          <CardTitle>Alert Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Notify me about:</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="newApplications" defaultChecked />
                <Label htmlFor="newApplications">New job applications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="interviewReminders" defaultChecked />
                <Label htmlFor="interviewReminders">Interview reminders</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="payrollUpdates" defaultChecked />
                <Label htmlFor="payrollUpdates">Payroll updates</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="attendanceAlerts" />
                <Label htmlFor="attendanceAlerts">Attendance alerts</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password & Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" />
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Key className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Login Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Current Session</p>
                <p className="text-sm text-gray-500">Chrome on Windows • Mumbai, India</p>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Mobile App</p>
                <p className="text-sm text-gray-500">iPhone • Last active 2 hours ago</p>
              </div>
              <Button variant="outline" size="sm">
                Revoke
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCompanySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" defaultValue="Neutrack Technologies" />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" defaultValue="Technology" />
            </div>
            <div>
              <Label htmlFor="companySize">Company Size</Label>
              <Input id="companySize" defaultValue="201-500 employees" />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" defaultValue="https://neutrack.com" />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" defaultValue="123 Tech Park, Sector 5, Mumbai, Maharashtra 400001" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team Members</CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">{member.role}</Badge>
                  <Badge variant={member.status === "Active" ? "default" : "secondary"}>{member.status}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderIntegrations = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connected Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{integration.icon}</div>
                  <div>
                    <h4 className="font-medium">{integration.name}</h4>
                    <p className="text-sm text-gray-500">{integration.description}</p>
                    <p className="text-xs text-gray-400">Last sync: {integration.lastSync}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={integration.status === "Connected" ? "default" : "secondary"}
                    className={integration.status === "Connected" ? "bg-green-100 text-green-800" : ""}
                  >
                    {integration.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    {integration.status === "Connected" ? "Configure" : "Connect"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <div className="flex space-x-2">
              <Input id="apiKey" value="nt_live_••••••••••••••••••••••••••••••••" readOnly />
              <Button variant="outline">Regenerate</Button>
            </div>
          </div>
          <div>
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input id="webhookUrl" placeholder="https://your-app.com/webhooks/neutrack" />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="enableWebhooks" />
            <Label htmlFor="enableWebhooks">Enable webhook notifications</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSectionContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSettings()
      case "notifications":
        return renderNotificationSettings()
      case "security":
        return renderSecuritySettings()
      case "company":
        return renderCompanySettings()
      case "integrations":
        return renderIntegrations()
      default:
        return renderProfileSettings()
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and application preferences</p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
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
        <div className="lg:col-span-3">{renderSectionContent()}</div>
      </div>
    </div>
  )
}
