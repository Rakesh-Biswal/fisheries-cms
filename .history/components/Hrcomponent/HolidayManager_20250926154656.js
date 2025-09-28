"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"

export default function HolidayManager() {
  const [department, setDepartment] = useState("")
  const [date, setDate] = useState(null)
  const [status, setStatus] = useState("")
  const [holidays, setHolidays] = useState([])

  const handleSave = () => {
    if (!department || !date || !status) return
    const newHoliday = { id: Date.now(), department, date, status }
    setHolidays([...holidays, newHoliday])
    setDepartment("")
    setDate(null)
    setStatus("")
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Attendance (Holidays) Management</h2>

      {/* Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label>Department</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Team Leader">Team Leader</SelectItem>
              <SelectItem value="Accountant">Accountant</SelectItem>
              <SelectItem value="Project Manager">Project Manager</SelectItem>
              <SelectItem value="Sales Employee">Sales Employee</SelectItem>
              <SelectItem value="Telecaller">Telecaller</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Date</Label>
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
        </div>

        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full Day Holiday">Full Day Holiday</SelectItem>
              <SelectItem value="Half Day">Half Day</SelectItem>
              <SelectItem value="Working Day">Working Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleSave} className="mb-6">Save Holiday</Button>

      {/* Display Holidays */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Defined Holidays</h3>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((h) => (
              <tr key={h.id} className="border-t">
                <td className="px-4 py-2">{h.department}</td>
                <td className="px-4 py-2">{h.date?.toLocaleDateString()}</td>
                <td className="px-4 py-2">{h.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"

export default function HolidayManager() {
  const [department, setDepartment] = useState("")
  const [date, setDate] = useState(null)
  const [status, setStatus] = useState("")
  const [holidays, setHolidays] = useState([])

  const handleSave = () => {
    if (!department || !date || !status) return
    const newHoliday = { id: Date.now(), department, date, status }
    setHolidays([...holidays, newHoliday])
    setDepartment("")
    setDate(null)
    setStatus("")
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Attendance (Holidays) Management</h2>

      {/* Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label>Department</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Team Leader">Team Leader</SelectItem>
              <SelectItem value="Accountant">Accountant</SelectItem>
              <SelectItem value="Project Manager">Project Manager</SelectItem>
              <SelectItem value="Sales Employee">Sales Employee</SelectItem>
              <SelectItem value="Telecaller">Telecaller</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Date</Label>
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
        </div>

        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full Day Holiday">Full Day Holiday</SelectItem>
              <SelectItem value="Half Day">Half Day</SelectItem>
              <SelectItem value="Working Day">Working Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleSave} className="mb-6">Save Holiday</Button>

      {/* Display Holidays */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Defined Holidays</h3>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((h) => (
              <tr key={h.id} className="border-t">
                <td className="px-4 py-2">{h.department}</td>
                <td className="px-4 py-2">{h.date?.toLocaleDateString()}</td>
                <td className="px-4 py-2">{h.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
