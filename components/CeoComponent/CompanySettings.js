"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { Badge } from "../ui/badge"
import { CalendarIcon, Clock, Building2, Plus, Trash2 } from "lucide-react"

export default function CompanySettings() {
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Company Settings</h1>
          <p className="text-muted-foreground">Manage holidays, working days, and company policies</p>
        </div>
        <Badge variant="outline">CEO Access</Badge>
      </div>

      {/* Working Days & Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Working Hours
            </CardTitle>
            <CardDescription>Set company working hours and policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={workingHours.startTime}
                  onChange={(e) => setWorkingHours({ ...workingHours, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={workingHours.endTime}
                  onChange={(e) => setWorkingHours({ ...workingHours, endTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="lunchBreak">Lunch Break (minutes)</Label>
              <Input
                id="lunchBreak"
                type="number"
                value={workingHours.lunchBreak}
                onChange={(e) => setWorkingHours({ ...workingHours, lunchBreak: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="flexibleHours">Flexible Working Hours</Label>
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
            <CardTitle className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Working Days
            </CardTitle>
            <CardDescription>Configure which days are working days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(workingDays).map(([day, isWorking]) => (
              <div key={day} className="flex items-center justify-between">
                <Label htmlFor={day} className="capitalize">
                  {day}
                </Label>
                <Switch
                  id={day}
                  checked={isWorking}
                  onCheckedChange={(checked) => setWorkingDays({ ...workingDays, [day]: checked })}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Holidays Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2" />
            Company Holidays
          </CardTitle>
          <CardDescription>Manage national and company holidays</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Holiday */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
            <Input
              placeholder="Holiday name"
              value={newHoliday.name}
              onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
            />
            <Input
              type="date"
              value={newHoliday.date}
              onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
            />
            <select
              className="px-3 py-2 border rounded-md"
              value={newHoliday.type}
              onChange={(e) => setNewHoliday({ ...newHoliday, type: e.target.value })}
            >
              <option value="company">Company</option>
              <option value="national">National</option>
            </select>
            <Button onClick={addHoliday}>
              <Plus className="w-4 h-4 mr-2" />
              Add Holiday
            </Button>
          </div>

          {/* Holidays List */}
          <div className="space-y-2">
            {holidays.map((holiday) => (
              <div key={holiday.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{holiday.name}</div>
                    <div className="text-sm text-muted-foreground">{holiday.date}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={holiday.type === "national" ? "default" : "secondary"}>{holiday.type}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => removeHoliday(holiday.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Company Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Company Policies
          </CardTitle>
          <CardDescription>General company settings and policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Remote Work Policy</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Overtime Approval Required</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Automatic Time Tracking</Label>
                <Switch />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Department Notifications</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Performance Alerts</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Weekly Reports</Label>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Reset to Default</Button>
        <Button>Save All Settings</Button>
      </div>
    </div>
  )
}
