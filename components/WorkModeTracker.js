// components/WorkModeTracker.js
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Power, CheckCircle, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function WorkModeTracker() {
  const [workMode, setWorkMode] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    checkTodayAttendance()
  }, [])

  const checkTodayAttendance = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/tl/attendance/today`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setWorkMode(data.data)
      } else {
        setWorkMode(null)
      }
    } catch (error) {
      console.error('Error checking attendance:', error)
      toast.error('Failed to load attendance data')
    } finally {
      setLoading(false)
    }
  }

  const handleWorkModeOn = async () => {
    try {
      setActionLoading(true)
      
      // Get current location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
      })

      const coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }

      const response = await fetch(`${API_URL}/api/tl/attendance/work-mode-on`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          coordinates,
          workType: "Field Work"
        })
      })

      if (response.ok) {
        const data = await response.json()
        setWorkMode(data.data)
        toast.success('Work mode started successfully!')
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to start work mode')
      }
    } catch (error) {
      console.error('Error starting work mode:', error)
      if (error.name === 'GeolocationPositionError') {
        toast.error('Location access required to start work mode')
      } else {
        toast.error(error.message || 'Failed to start work mode')
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleWorkModeOff = async () => {
    try {
      setActionLoading(true)
      
      // Get current location for check-out
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
      })

      const coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }

      const response = await fetch(`${API_URL}/api/tl/attendance/work-mode-off`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          coordinates
        })
      })

      if (response.ok) {
        const data = await response.json()
        setWorkMode(data.data)
        toast.success('Work mode ended successfully!')
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to end work mode')
      }
    } catch (error) {
      console.error('Error ending work mode:', error)
      if (error.name === 'GeolocationPositionError') {
        toast.error('Location access required to end work mode')
      } else {
        toast.error(error.message || 'Failed to end work mode')
      }
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // No attendance record for today - show work mode on prompt
  if (!workMode) {
    return (
      <Card className="bg-yellow-50 border-yellow-200 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Work Mode Not Started</h3>
                <p className="text-yellow-700 text-sm">
                  You need to start work mode to begin tracking your activities for today.
                </p>
              </div>
            </div>
            <Button 
              onClick={handleWorkModeOn}
              disabled={actionLoading}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <Power className="h-4 w-4 mr-2" />
              {actionLoading ? "Starting..." : "Start Work Mode"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Work mode is active - show current status
  if (workMode.isActive) {
    return (
      <Card className="bg-green-50 border-green-200 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold text-green-800">Work Mode Active</h3>
                  <Badge variant="secondary" className="bg-green-200 text-green-800">
                    Live
                  </Badge>
                </div>
                <div className="flex items-center space-x-6 text-sm text-green-700">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Started: {new Date(workMode.workModeOnTime).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Location: Tracked</span>
                  </div>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleWorkModeOff}
              disabled={actionLoading}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <Power className="h-4 w-4 mr-2" />
              {actionLoading ? "Ending..." : "End Work Mode"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Work mode was active today but ended
  return (
    <Card className="bg-blue-50 border-blue-200 mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-800">Work Mode Completed</h3>
              <div className="flex items-center space-x-6 text-sm text-blue-700">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {workMode.totalWorkDuration} hours</span>
                </div>
                <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                  {workMode.status}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" disabled className="text-blue-700">
            Completed for Today
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}