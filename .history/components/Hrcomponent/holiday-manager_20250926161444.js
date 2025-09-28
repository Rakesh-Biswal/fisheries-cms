"use client"

import { useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function HolidayCalendar() {
  const [events, setEvents] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [formData, setFormData] = useState({
    department: "",
    status: "",
    time: "",
    title: "",
    description: "",
  })

  // Handle date click
  const handleDateClick = (info) => {
    const exists = events.find((e) => e.start === info.dateStr)
    if (exists) {
      alert("This date already has an entry.")
      return
    }
    setSelectedDate(info.dateStr)
    setOpen(true)
  }

  // Handle form submit
  const handleSubmit = () => {
    if (!formData.department || !formData.status) {
      alert("Please fill all required fields")
      return
    }

    const newEvent = {
      id: Date.now(),
      title: `${formData.title} (${formData.status})`,
      start: selectedDate,
      extendedProps: {
        department: formData.department,
        time: formData.time,
        description: formData.description,
        status: formData.status,
      },
    }

    setEvents([...events, newEvent])
    setFormData({ department: "", status: "", time: "", title: "", description: "" })
    setOpen(false)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Attendance / Holiday Management</h2>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        height="auto"
      />

      {/* Popup Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="bg-white p-6 rounded-lg shadow-md w-[400px]">
          <h3 className="text-lg font-semibold mb-4">Add Holiday / Attendance</h3>

          <div className="mb-3">
            <Label>Department</Label>
            <Select
              value={formData.department}
              onValueChange={(val) => setFormData({ ...formData, department: val })}
            >
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

          <div className="mb-3">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(val) => setFormData({ ...formData, status: val })}
            >
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

          <div className="mb-3">
            <Label>Time</Label>
            <Input
              type="text"
              placeholder="e.g. 9:00 AM - 5:00 PM"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Holiday / Attendance title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <Label>Description</Label>
            <Textarea
              placeholder="Details about this day"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <Button className="mt-4 w-full" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </Dialog>
    </div>
  )
}
