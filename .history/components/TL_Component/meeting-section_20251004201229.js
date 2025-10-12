// @/components/TL_Component/meeting-section.jsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Plus, Clock, Video, CheckCircle, Dot, ChevronDown, ChevronUp } from "lucide-react"
import MeetingModal from "./meeting-modal"

export default function MeetingSection() {
  const [showMeetingModal, setShowMeetingModal] = useState(false)
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAllUpcoming, setShowAllUpcoming] = useState(false)
  const [showAllPast, setShowAllPast] = useState(false)

  // API Base URL
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://your-production-url.com' 
    : 'http://localhost:5000';

  // Convert 24-hour time to 12-hour AM/PM format
  const formatTimeTo12Hour = (time24) => {
    if (!time24) return '--:--';
    
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        weekday: 'short'
      });
    }
  };

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

  // Get upcoming meetings (today's meetings that haven't started yet)
  const upcomingMeetings = meetings.filter(meeting => 
    isMeetingUpcoming(meeting) && !isMeetingOngoing(meeting)
  ).sort((a, b) => {
    // Sort by time
    const timeA = a.timeSlots?.[0]?.startTime || '23:59';
    const timeB = b.timeSlots?.[0]?.startTime || '23:59';
    return timeA.localeCompare(timeB);
  });

  // Get ongoing meetings
  const ongoingMeetings = meetings.filter(meeting => isMeetingOngoing(meeting));

  // Get past meetings (completed meetings)
  const pastMeetings = meetings.filter(meeting => {
    if (!meeting.timeSlots?.[0]) return false;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    const meetingDate = meeting.timeSlots[0].date;
    const endTime = meeting.timeSlots[0].endTime;
    
    // Meeting is past if date is before today OR if date is today but time has passed
    return meetingDate < today || (meetingDate === today && currentTime > endTime);
  }).sort((a, b) => {
    // Sort by date and time (most recent first)
    const dateA = new Date(a.timeSlots?.[0]?.date || 0);
    const dateB = new Date(b.timeSlots?.[0]?.date || 0);
    return dateB - dateA;
  });

  // Get first upcoming meeting for featured section
  const featuredUpcomingMeeting = upcomingMeetings[0];
  
  // Get first ongoing meeting
  const featuredOngoingMeeting = ongoingMeetings[0];
  
  // Get first past meeting
  const featuredPastMeeting = pastMeetings[0];

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

          {/* Ongoing Meeting Section */}
          {featuredOngoingMeeting && (
            <div className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-green-900 flex items-center gap-2">
                  <Dot className="w-4 h-4 text-green-600 animate-pulse" />
                  Live Now
                </h4>
                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                  Ongoing
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-medium text-sm text-gray-900 line-clamp-2">
                  {featuredOngoingMeeting.title}
                </h5>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  {featuredOngoingMeeting.timeSlots?.[0] ? 
                    `${formatDate(featuredOngoingMeeting.timeSlots[0].date)} • ${formatTimeTo12Hour(featuredOngoingMeeting.timeSlots[0].startTime)} - ${formatTimeTo12Hour(featuredOngoingMeeting.timeSlots[0].endTime)}` : 
                    'Time not set'
                  }
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Users className="w-3 h-3" />
                  {featuredOngoingMeeting.participants?.length || 0} participants
                </div>
              </div>
              
              <Button 
                asChild
                size="sm" 
                className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white"
              >
                <a 
                  href={featuredOngoingMeeting.googleMeetLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Join Meeting Now
                </a>
              </Button>

              {/* Show more ongoing meetings if available */}
              {ongoingMeetings.length > 1 && !showAllUpcoming && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-xs text-green-600 hover:text-green-700"
                  onClick={() => setShowAllUpcoming(true)}
                >
                  <ChevronDown className="w-3 h-3 mr-1" />
                  {ongoingMeetings.length - 1} more ongoing meeting{ongoingMeetings.length - 1 > 1 ? 's' : ''}
                </Button>
              )}

              {/* Show all ongoing meetings when expanded */}
              {showAllUpcoming && ongoingMeetings.slice(1).map(meeting => (
                <div key={meeting._id} className="mt-2 p-2 bg-white rounded border border-green-100">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{meeting.title}</p>
                      <p className="text-xs text-gray-500">
                        {formatTimeTo12Hour(meeting.timeSlots?.[0]?.startTime)}
                      </p>
                    </div>
                    <Button 
                      asChild
                      size="sm" 
                      variant="outline"
                      className="ml-2 bg-white hover:bg-green-50 border-green-200"
                    >
                      <a 
                        href={meeting.googleMeetLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs"
                      >
                        Join
                      </a>
                    </Button>
                  </div>
                </div>
              ))}

              {showAllUpcoming && ongoingMeetings.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-xs text-green-600 hover:text-green-700"
                  onClick={() => setShowAllUpcoming(false)}
                >
                  <ChevronUp className="w-3 h-3 mr-1" />
                  Show less
                </Button>
              )}
            </div>
          )}

          {/* Upcoming Meeting Section */}
          {featuredUpcomingMeeting && !featuredOngoingMeeting && (
            <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-blue-900">Next Meeting</h4>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                  Upcoming
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-medium text-sm text-gray-900 line-clamp-2">
                  {featuredUpcomingMeeting.title}
                </h5>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  {featuredUpcomingMeeting.timeSlots?.[0] ? 
                    `${formatDate(featuredUpcomingMeeting.timeSlots[0].date)} • ${formatTimeTo12Hour(featuredUpcomingMeeting.timeSlots[0].startTime)} - ${formatTimeTo12Hour(featuredUpcomingMeeting.timeSlots[0].endTime)}` : 
                    'Time not set'
                  }
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Users className="w-3 h-3" />
                  {featuredUpcomingMeeting.participants?.length || 0} participants
                </div>
              </div>
              
              <Button 
                asChild
                size="sm" 
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <a 
                  href={featuredUpcomingMeeting.googleMeetLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Join Meeting
                </a>
              </Button>

              {/* Show more upcoming meetings if available */}
              {upcomingMeetings.length > 1 && !showAllUpcoming && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-xs text-blue-600 hover:text-blue-700"
                  onClick={() => setShowAllUpcoming(true)}
                >
                  <ChevronDown className="w-3 h-3 mr-1" />
                  {upcomingMeetings.length - 1} more upcoming meeting{upcomingMeetings.length - 1 > 1 ? 's' : ''}
                </Button>
              )}

              {/* Show all upcoming meetings when expanded */}
              {showAllUpcoming && upcomingMeetings.slice(1).map(meeting => (
                <div key={meeting._id} className="mt-2 p-2 bg-white rounded border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{meeting.title}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(meeting.timeSlots?.[0]?.date)} • {formatTimeTo12Hour(meeting.timeSlots?.[0]?.startTime)}
                      </p>
                    </div>
                    <Button 
                      asChild
                      size="sm" 
                      variant="outline"
                      className="ml-2 bg-white hover:bg-blue-50 border-blue-200"
                    >
                      <a 
                        href={meeting.googleMeetLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs"
                      >
                        Join
                      </a>
                    </Button>
                  </div>
                </div>
              ))}

              {showAllUpcoming && upcomingMeetings.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-xs text-blue-600 hover:text-blue-700"
                  onClick={() => setShowAllUpcoming(false)}
                >
                  <ChevronUp className="w-3 h-3 mr-1" />
                  Show less
                </Button>
              )}
            </div>
          )}

          {/* Past Meeting Section */}
          {featuredPastMeeting && (
            <div className="border rounded-lg p-4 bg-gray-50 border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-700">Recent Meeting</h4>
                <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300 text-xs">
                  Completed
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-medium text-sm text-gray-900 line-clamp-2">
                  {featuredPastMeeting.title}
                </h5>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  {featuredPastMeeting.timeSlots?.[0] ? 
                    `${formatDate(featuredPastMeeting.timeSlots[0].date)} • ${formatTimeTo12Hour(featuredPastMeeting.timeSlots[0].startTime)} - ${formatTimeTo12Hour(featuredPastMeeting.timeSlots[0].endTime)}` : 
                    'Time not set'
                  }
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Users className="w-3 h-3" />
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  {featuredPastMeeting.participants?.length || 0} attended
                </div>
              </div>

              {/* Show more past meetings if available */}
              {pastMeetings.length > 1 && !showAllPast && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3 text-xs text-gray-600 hover:text-gray-700"
                  onClick={() => setShowAllPast(true)}
                >
                  <ChevronDown className="w-3 h-3 mr-1" />
                  {pastMeetings.length - 1} more past meeting{pastMeetings.length - 1 > 1 ? 's' : ''}
                </Button>
              )}

              {/* Show all past meetings when expanded */}
              {showAllPast && pastMeetings.slice(1).map(meeting => (
                <div key={meeting._id} className="mt-2 p-2 bg-white rounded border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{meeting.title}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(meeting.timeSlots?.[0]?.date)} • {formatTimeTo12Hour(meeting.timeSlots?.[0]?.startTime)}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2 text-xs bg-gray-100">
                      {meeting.participants?.length || 0}
                    </Badge>
                  </div>
                </div>
              ))}

              {showAllPast && pastMeetings.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-xs text-gray-600 hover:text-gray-700"
                  onClick={() => setShowAllPast(false)}
                >
                  <ChevronUp className="w-3 h-3 mr-1" />
                  Show less
                </Button>
              )}
            </div>
          )}

          {/* Empty State */}
          {!featuredOngoingMeeting && !featuredUpcomingMeeting && !featuredPastMeeting && !loading && (
            <div className="text-center py-6 text-gray-500">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No meetings scheduled</p>
              <p className="text-xs mt-1">Schedule your first meeting to get started</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
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