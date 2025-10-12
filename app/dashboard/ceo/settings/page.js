"use client"

import { useState } from "react"
import DashboardLayout from "@/components/CeoComponent/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, Building2, Plus, Trash2, Save, Users, Shield } from "lucide-react"

const settingsSections = [
  {
    id: "working-hours",
    title: "Working Hours",
    icon: Clock,
    description: "Set company working hours and policies",
  },
  {
    id: "holidays",
    title: "Holidays",
    icon: CalendarIcon,
    description: "Manage national and company holidays",
  },
  {
    id: "policies",
    title: "Company Policies",
    icon: Shield,
    description: "General company settings and policies",
  },
]

export default function CompanySettings() {
  const [activeSection, setActiveSection] = useState("working-hours")
  const [saving, setSaving] = useState(false)
  
  const [holidays, setHolidays] = useState([
    { id: 1, name: "New Year Day", date: "2024-01-01", type: "national" },
    { id: 2, name: "Independence Day", date: "2024-07-04", type: "national" },
    { id: 3, name: "Christmas", date: "2024-12-25", type: "national" },
    { id: 4, name: "Company Anniversary", date: "2024-06-15", type: "company" },
  ])

  const [workingDays, setWorkingDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  })

  const [workingHours, setWorkingHours] = useState({
    startTime: "09:00",
    endTime: "17:00",
    lunchBreak: "60",
    flexibleHours: true,
  })

  const [companyPolicies, setCompanyPolicies] = useState({
    remoteWork: true,
    overtimeApproval: true,
    autoTimeTracking: false,
    departmentNotifications: true,
    performanceAlerts: true,
    weeklyReports: true,
  })

  const [newHoliday, setNewHoliday] = useState({ name: "", date: "", type: "company" })

  const addHoliday = () => {
    if (newHoliday.name && newHoliday.date) {
      setHolidays([
        ...holidays,
        {
          id: Date.now(),
          ...newHoliday,
        },
      ])
      setNewHoliday({ name: "", date: "", type: "company" })
    }
  }

  const removeHoliday = (id) => {
    setHolidays(holidays.filter((h) => h.id !== id))
  }

  const handlePolicyChange = (key, value) => {
    setCompanyPolicies((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Settings saved:', { workingHours, workingDays, holidays, companyPolicies })
      // Add your actual save logic here
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const renderWorkingHours = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Working Hours Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={workingHours.startTime}
                onChange={(e) => setWorkingHours({ ...workingHours, startTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={workingHours.endTime}
                onChange={(e) => setWorkingHours({ ...workingHours, endTime: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lunchBreak">Lunch Break Duration (minutes) *</Label>
            <Input
              id="lunchBreak"
              type="number"
              value={workingHours.lunchBreak}
              onChange={(e) => setWorkingHours({ ...workingHours, lunchBreak: e.target.value })}
              placeholder="60"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="flexibleHours" className="text-base">Flexible Working Hours</Label>
              <p className="text-sm text-gray-500">Allow employees to choose their working hours within limits</p>
            </div>
            <Switch
              id="flexibleHours"
              checked={workingHours.flexibleHours}
              onCheckedChange={(checked) => setWorkingHours({ ...workingHours, flexibleHours: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Working Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(workingDays).map(([day, isWorking]) => (
              <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                <Label htmlFor={day} className="capitalize text-base font-medium">
                  {day}
                </Label>
                <Switch
                  id={day}
                  checked={isWorking}
                  onCheckedChange={(checked) => setWorkingDays({ ...workingDays, [day]: checked })}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderHolidays = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Manage Company Holidays
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Holiday */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Holiday</CardTitle>
              <CardDescription>Create new national or company holidays</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="holidayName">Holiday Name</Label>
                  <Input
                    id="holidayName"
                    placeholder="Enter holiday name"
                    value={newHoliday.name}
                    onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="holidayDate">Date</Label>
                  <Input
                    id="holidayDate"
                    type="date"
                    value={newHoliday.date}
                    onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="holidayType">Type</Label>
                  <select
                    id="holidayType"
                    className="w-full px-3 py-2 border rounded-md"
                    value={newHoliday.type}
                    onChange={(e) => setNewHoliday({ ...newHoliday, type: e.target.value })}
                  >
                    <option value="company">Company</option>
                    <option value="national">National</option>
                  </select>
                </div>
              </div>
              <Button onClick={addHoliday} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Holiday
              </Button>
            </CardContent>
          </Card>

          {/* Holidays List */}
          <Card>
            <CardHeader>
              <CardTitle>Current Holidays</CardTitle>
              <CardDescription>List of all company and national holidays</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {holidays.map((holiday) => (
                  <div key={holiday.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <CalendarIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{holiday.name}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(holiday.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={holiday.type === "national" ? "default" : "secondary"}>
                        {holiday.type}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeHoliday(holiday.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )

  const renderPolicies = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Company Policies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label className="text-base">Remote Work Policy</Label>
                <p className="text-sm text-gray-500">Allow employees to work remotely</p>
              </div>
              <Switch
                checked={companyPolicies.remoteWork}
                onCheckedChange={(checked) => handlePolicyChange('remoteWork', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label className="text-base">Overtime Approval Required</Label>
                <p className="text-sm text-gray-500">Require manager approval for overtime work</p>
              </div>
              <Switch
                checked={companyPolicies.overtimeApproval}
                onCheckedChange={(checked) => handlePolicyChange('overtimeApproval', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label className="text-base">Automatic Time Tracking</Label>
                <p className="text-sm text-gray-500">Automatically track employee working hours</p>
              </div>
              <Switch
                checked={companyPolicies.autoTimeTracking}
                onCheckedChange={(checked) => handlePolicyChange('autoTimeTracking', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label className="text-base">Department Notifications</Label>
                <p className="text-sm text-gray-500">Send notifications for department updates</p>
              </div>
              <Switch
                checked={companyPolicies.departmentNotifications}
                onCheckedChange={(checked) => handlePolicyChange('departmentNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label className="text-base">Performance Alerts</Label>
                <p className="text-sm text-gray-500">Receive alerts for performance issues</p>
              </div>
              <Switch
                checked={companyPolicies.performanceAlerts}
                onCheckedChange={(checked) => handlePolicyChange('performanceAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label className="text-base">Weekly Reports</Label>
                <p className="text-sm text-gray-500">Generate and send weekly performance reports</p>
              </div>
              <Switch
                checked={companyPolicies.weeklyReports}
                onCheckedChange={(checked) => handlePolicyChange('weeklyReports', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSectionContent = () => {
    switch (activeSection) {
      case "working-hours":
        return renderWorkingHours()
      case "holidays":
        return renderHolidays()
      case "policies":
        return renderPolicies()
      default:
        return renderWorkingHours()
    }
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
            <p className="text-gray-600">Manage company policies, holidays, and working hours</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              CEO Access
            </Badge>
            <Button onClick={handleSaveSettings} disabled={saving}>
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