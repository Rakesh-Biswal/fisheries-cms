"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  Video, 
  Calendar, 
  Users, 
  Clock, 
  Plus, 
  MoreHorizontal,
  MapPin,
  PlayCircle,
  Loader2,
  Building
} from "lucide-react"
import { format, parseISO, isToday, isTomorrow, isAfter, startOfDay } from "date-fns"
import { toast } from "sonner"
import CreateMeetingModal from "./CreateMeetingModal"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const DEPARTMENT_CONFIG = {
  hr: { name: "HR", color: "bg-purple-500" },
  ceo: { name: "CEO", color: "bg-blue-500" },
  team_leader: { name: "Team Leaders", color: "bg-green-500" },
  project_manager: { name: "Project Managers", color: "bg-orange-500" },
  accountant: { name: "Accountants", color: "bg-red-500" },
  telecaller: { name: "Telecallers", color: "bg-indigo-500" },
  sales: { name: "Sales Team", color: "bg-cyan-500" }
};

export default function MeetingSection() {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [stats, setStats] = useState({})
  const [departments, setDepartments] = useState([])
  const [createMeetingModalOpen, setCreateMeetingModalOpen] = useState(false)

  useEffect(() => {
    fetchMeetingData();
  }, [])

  const fetchMeetingData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchMeetings(),
        fetchMeetingStats(),
        fetchDepartments()
      ]);
    } catch (error) {
      console.error('Error fetching meeting data:', error);
      toast.error('Failed to load meeting data');
    } finally {
      setLoading(false);
    }
  }

  const fetchMeetings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hr/meetings/fetch-all`, {
        credentials: 'include',
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const data = await response.json()
        setMeetings(data.data || [])
      } else {
        throw new Error('Failed to fetch meetings')
      }
    } catch (error) {
      console.error('Error fetching meetings:', error)
      throw error;
    }
  }

  const fetchMeetingStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hr/meetings/fetch-stats`, {
        credentials: 'include',
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.data || {})
      }
    } catch (error) {
      console.error('Error fetching meeting stats:', error)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hr/meetings/fetch-departments`, {
        credentials: 'include',
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const data = await response.json()
        setDepartments(data.data || [])
      } else {
        throw new Error('Failed to fetch departments')
      }
    } catch (error) {
      console.error("❌ Error fetching departments:", error)
      throw error;
    }
  }

  const handleCreateMeeting = async (meetingData) => {
    try {
      console.log("🔄 Creating meeting with data:", meetingData)
      
      const response = await fetch(`${API_URL}/api/hr/meetings/create`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(meetingData)
      })

      console.log("📥 Create meeting response status:", response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log("✅ Meeting created successfully:", result)
        
        setMeetings(prev => [result.data, ...prev])
        toast.success('Meeting created successfully')
        setCreateMeetingModalOpen(false)
        fetchMeetingStats()
      } else {
        const errorData = await response.json()
        console.error("❌ Failed to create meeting:", errorData)
        throw new Error(errorData.message || 'Failed to create meeting')
      }
    } catch (error) {
      console.error('❌ Error creating meeting:', error)
      toast.error(error.message || 'Failed to create meeting')
    }
  }

  const getMeetingsForSelectedDate = () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    return meetings.filter(meeting => meeting.schedule.date === dateStr)
  }

  const getCurrentMeetings = () => {
    const now = new Date()
    return meetings.filter(meeting => {
      const meetingDateTime = new Date(`${meeting.schedule.date}T${meeting.schedule.startTime}`)
      const meetingEndDateTime = new Date(`${meeting.schedule.date}T${meeting.schedule.endTime}`)
      return now >= meetingDateTime && now <= meetingEndDateTime && meeting.status === 'scheduled'
    })
  }

  const getUpcomingMeetings = () => {
    const today = startOfDay(new Date())
    return meetings.filter(meeting => {
      const meetingDate = startOfDay(parseISO(meeting.schedule.date))
      return isAfter(meetingDate, today) && meeting.status === 'scheduled'
    }).sort((a, b) => parseISO(a.schedule.date).getTime() - parseISO(b.schedule.date).getTime())
  }

  const getMeetingStatus = (meeting) => {
    const now = new Date()
    const meetingDate = parseISO(meeting.schedule.date)
    const meetingDateTime = new Date(`${meeting.schedule.date}T${meeting.schedule.startTime}`)
    const meetingEndDateTime = new Date(`${meeting.schedule.date}T${meeting.schedule.endTime}`)

    if (meeting.status === 'cancelled') {
      return { status: "Cancelled", variant: "outline", icon: Calendar }
    }

    if (meeting.status === 'completed') {
      return { status: "Completed", variant: "secondary", icon: Calendar }
    }

    if (now >= meetingDateTime && now <= meetingEndDateTime && meeting.status === 'scheduled') {
      return { status: "Live Now", variant: "destructive", icon: PlayCircle }
    } else if (now < meetingDateTime && isToday(meetingDate) && meeting.status === 'scheduled') {
      return { status: "Starting Soon", variant: "default", icon: Clock }
    } else if (isToday(meetingDate) && meeting.status === 'scheduled') {
      return { status: "Today", variant: "secondary", icon: Calendar }
    } else if (isTomorrow(meetingDate) && meeting.status === 'scheduled') {
      return { status: "Tomorrow", variant: "outline", icon: Calendar }
    } else if (meeting.status === 'scheduled') {
      return { status: format(meetingDate, "MMM d"), variant: "outline", icon: Calendar }
    } else {
      return { status: meeting.status, variant: "outline", icon: Calendar }
    }
  }

  const handleJoinMeeting = (meeting) => {
    if (meeting.meetingLink) {
      window.open(meeting.meetingLink, '_blank')
    } else {
      toast.error('No meeting link available')
    }
  }

  if (loading) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">HR Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2">Loading meetings...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentMeetings = getCurrentMeetings()
  const selectedDateMeetings = getMeetingsForSelectedDate()
  const upcomingMeetings = getUpcomingMeetings()

  return (
    <>
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-600" />
            HR Department Meetings
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setSelectedDate(new Date())}
              className={isToday(selectedDate) ? "bg-blue-50 border-blue-200 text-blue-700" : ""}
            >
              Today
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1">
              <TabsTrigger 
                value="today" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Clock className="h-4 w-4" />
                Today
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 bg-blue-100 text-blue-700">
                  {stats.today || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="upcoming" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Calendar className="h-4 w-4" />
                Upcoming
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 bg-green-100 text-green-700">
                  {stats.upcoming || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="all" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Users className="h-4 w-4" />
                All
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 bg-gray-200 text-gray-700">
                  {stats.total || 0}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-4 pt-4">
              {/* Date Selector */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
                <input
                  type="date"
                  value={format(selectedDate, "yyyy-MM-dd")}
                  onChange={(e) => setSelectedDate(parseISO(e.target.value))}
                  className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Current Meetings */}
              {currentMeetings.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3 p-2 bg-red-50 rounded-lg border border-red-200">
                    <PlayCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700">Live Now</span>
                    <Badge variant="destructive" className="ml-auto bg-red-100 text-red-700 border-red-200">
                      {currentMeetings.length}
                    </Badge>
                  </div>
                  {currentMeetings.map(meeting => (
                    <MeetingCard 
                      key={meeting._id} 
                      meeting={meeting} 
                      statusInfo={getMeetingStatus(meeting)}
                      onJoin={() => handleJoinMeeting(meeting)}
                    />
                  ))}
                </div>
              )}

              {/* Today's Meetings */}
              <div className="space-y-3">
                {selectedDateMeetings
                  .filter(meeting => !getMeetingStatus(meeting).status.includes("Live"))
                  .map(meeting => (
                    <MeetingCard 
                      key={meeting._id} 
                      meeting={meeting} 
                      statusInfo={getMeetingStatus(meeting)}
                      onJoin={() => handleJoinMeeting(meeting)}
                    />
                  ))}
                
                {selectedDateMeetings.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium text-gray-600">No meetings scheduled</p>
                    <p className="text-sm mt-1 text-gray-500">You're all caught up for {format(selectedDate, "MMMM d")}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="pt-4">
              <div className="space-y-3">
                {upcomingMeetings.slice(0, 5).map(meeting => (
                  <MeetingCard 
                    key={meeting._id} 
                    meeting={meeting} 
                    statusInfo={getMeetingStatus(meeting)}
                    onJoin={() => handleJoinMeeting(meeting)}
                  />
                ))}
                
                {upcomingMeetings.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium text-gray-600">No upcoming meetings</p>
                    <p className="text-sm mt-1 text-gray-500">Schedule new meetings to see them here</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="all" className="pt-4">
              <div className="space-y-3">
                {meetings.slice(0, 5).map(meeting => (
                  <MeetingCard 
                    key={meeting._id} 
                    meeting={meeting} 
                    statusInfo={getMeetingStatus(meeting)}
                    onJoin={() => handleJoinMeeting(meeting)}
                  />
                ))}
                
                {meetings.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium text-gray-600">No meetings found</p>
                    <p className="text-sm mt-1 text-gray-500">Create your first meeting to get started</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              size="sm" 
              className="flex-1" 
              variant="outline"
              onClick={() => setCreateMeetingModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
            <Button size="sm" className="flex-1" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar View
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Meeting Modal */}
      <CreateMeetingModal
        open={createMeetingModalOpen}
        onOpenChange={setCreateMeetingModalOpen}
        onCreateMeeting={handleCreateMeeting}
        departments={departments}
      />
    </>
  )
}

// Meeting Card Component
