import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

export const AssignEmployeesModal = ({ 
  open, 
  onOpenChange, 
  availableEmployees, 
  onAssign, 
  loading 
}) => {
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEmployees = availableEmployees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    )
  }

  const handleAssign = () => {
    onAssign(selectedEmployees)
    setSelectedEmployees([])
  }

  const handleClose = () => {
    onOpenChange(false)
    setSelectedEmployees([])
    setSearchTerm("")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Assign Employees to Team</DialogTitle>
          <p className="text-sm text-gray-600">Select employees to add to this team</p>
        </DialogHeader>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search employees by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Employees List */}
        <div className="flex-1 overflow-y-auto border rounded-lg">
          {filteredEmployees.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No available employees found
            </div>
          ) : (
            <div className="divide-y">
              {filteredEmployees.map((employee) => (
                <div key={employee._id} className="flex items-center space-x-3 p-4 hover:bg-gray-50">
                  <Checkbox
                    checked={selectedEmployees.includes(employee._id)}
                    onCheckedChange={() => handleEmployeeSelect(employee._id)}
                  />
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={employee.photo} />
                    <AvatarFallback>
                      {employee.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{employee.name}</p>
                    <p className="text-xs text-gray-600">{employee.email}</p>
                    <p className="text-xs text-gray-500">{employee.designation}</p>
                  </div>
                  <Badge variant={employee.status === "active" ? "default" : "secondary"} className="text-xs">
                    {employee.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            {selectedEmployees.length} employee(s) selected
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssign} 
              disabled={selectedEmployees.length === 0 || loading}
            >
              {loading ? "Assigning..." : `Assign (${selectedEmployees.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}