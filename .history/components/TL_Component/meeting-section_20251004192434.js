// @/components/TL_Component/meeting-section.jsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Plus } from "lucide-react"
import MeetingModal from "./meeting-modal"

export default function MeetingSection() {
  const [showMeetingModal, setShowMeetingModal] = useState(false)

  return (
    <>
      <Card className="cursor-pointer hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-blue-600" />
            Team Meetings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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