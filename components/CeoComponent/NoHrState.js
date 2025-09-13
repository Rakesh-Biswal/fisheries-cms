"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Users, Plus, UserPlus, Building } from "lucide-react"

export default function NoHrState({ onHireClick }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader className="pb-6">
          <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-blue-500" />
          </div>
          <CardTitle className="text-2xl text-gray-900">No HR Hired Yet</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Build your HR team to manage employee operations effectively
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="p-4 bg-gray-50 rounded-lg">
              <UserPlus className="w-8 h-8 text-blue-500 mb-2" />
              <h3 className="font-semibold text-sm">Recruitment</h3>
              <p className="text-xs text-gray-600">Hire and onboard new employees</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Building className="w-8 h-8 text-green-500 mb-2" />
              <h3 className="font-semibold text-sm">Employee Management</h3>
              <p className="text-xs text-gray-600">Manage attendance and performance</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Users className="w-8 h-8 text-purple-500 mb-2" />
              <h3 className="font-semibold text-sm">Team Development</h3>
              <p className="text-xs text-gray-600">Training and skill development</p>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={onHireClick} size="lg" className="w-full md:w-auto px-8 py-3 text-base font-semibold">
              <Plus className="w-5 h-5 mr-2" />
              Hire Your First HR
            </Button>
            <p className="text-sm text-gray-500 mt-3">Start building your HR department to streamline operations</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
