// @/components/TL_Component/meeting-section.jsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Plus, Clock, Video, CheckCircle, Dot } from "lucide-react"
import MeetingModal from "./meeting-modal"

export default function MeetingSection() {
  const [showMeetingModal, setShowMeetingModal] = useState(false)
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(false)

  // API Base URL
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://your-production-url.com' 
    : 'http://localhost:5000';

  // Fetch meetings data
  useEffect(() => {
    async function fetchMeetings() {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/team-leader/meetings`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setMeetings(result.data);
          }
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMeetings();
  }, []);

  // Check if meeting is ongoing
  const isMeetingOngoing = (meeting) => {
    if (!meeting.timeSlots?.[0]) return false;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    
    const meetingDate = meeting.timeSlots[0].date;
    const startTime = meeting.timeSlots[0].startTime;
    const endTime = meeting.timeSlots[0].endTime;
    
    return meetingDate === today && currentTime >= startTime && currentTime <= endTime;
  };

  // Check if meeting is upcoming (today but not started)
  const isMeetingUpcoming = (meeting) => {
    if (!meeting.timeSlots?.[0]) return false;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    const meetingDate = meeting.timeSlots[0].date;
    const startTime = meeting.timeSlots[0].startTime;
    
    return meetingDate === today && currentTime < startTime;
  };

  // Get featured meeting (first upcoming or ongoing meeting)
  const featuredMeeting = meetings.find(meeting => isMeetingOngoing(meeting) || isMeetingUpcoming(meeting));
  
  // Get ongoing meetings
  const ongoingMeetings = meetings.filter(meeting => isMeetingOngoing(meeting));
  
  // Get past meetings (excluding featured and ongoing)
  const pastMeetings = meetings.filter(meeting => 
    !isMeetingOngoing(meeting) && 
    !isMeetingUpcoming(meeting) &&
    meeting !== featuredMeeting
  ).slice(0, 3); // Show only last 3 past meetings

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-blue-600" />
            Team Meetings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Schedule Meeting Button */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Schedule and manage team meetings with sales employees
            </p>
            <Button 
              onClick={() => setShowMeetingModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>

          {/* Featured/Upcoming Meeting */}
          {featuredMeeting && (
            <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-900">Featured Meeting</h4>
                {isMeetingOngoing(featuredMeeting) ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <Dot className="w-4 h-4 animate-pulse" />
                    Live Now
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-blue-100 text-blue-700">
                    Upcoming
                  </Badge>
                )}
              </div>
              
              <div className="space-y-2">
                <h5 className="font-medium text-sm">{featuredMeeting.title}</h5>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  {featuredMeeting.timeSlots?.[0] ? 
                    `${featuredMeeting.timeSlots[0].date} • ${featuredMeeting.timeSlots[0].startTime} - ${featuredMeeting.timeSlots[0].endTime}` : 
                    'Time not set'
                  }
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Users className="w-3 h-3" />
                  {featuredMeeting.participants?.length || 0} participants
                </div>
              </div>
              
              <Button 
                asChild
                size="sm" 
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
              >
                <a 
                  href={featuredMeeting.googleMeetLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  {isMeetingOngoing(featuredMeeting) ? 'Join Meeting' : 'Join Link'}
                </a>
              </Button>
            </div>
          )}

          {/* Ongoing Meetings */}
          {ongoingMeetings.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Ongoing Now</span>
              </div>
              {ongoingMeetings.map(meeting => (
                <div key={meeting._id} className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{meeting.title}</p>
                    <p className="text-xs text-green-600">
                      {meeting.participants?.length || 0} people
                    </p>
                  </div>
                  <Button 
                    asChild
                    size="sm" 
                    variant="outline"
                    className="bg-white hover:bg-green-50"
                  >
                    <a 
                      href={meeting.googleMeetLink} 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      Join
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Past Meetings */}
          {pastMeetings.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700">Recent Meetings</h5>
              {pastMeetings.map(meeting => (
                <div key={meeting._id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{meeting.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {meeting.timeSlots?.[0]?.date || 'No date'}
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      Completed
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {meeting.participants?.length || 0}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!featuredMeeting && ongoingMeetings.length === 0 && pastMeetings.length === 0 && !loading && (
            <div className="text-center py-4 text-gray-500">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No meetings scheduled</p>
              <p className="text-xs">Schedule your first meeting to get started</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-4">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meeting Modal */}
      {showMeetingModal && (
        <MeetingModal 
          isOpen={showMeetingModal}
          onClose={() => setShowMeetingModal(false)}
        />
      )}
    </>
  )
}