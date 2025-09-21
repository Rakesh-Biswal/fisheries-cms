"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem("authToken")
    sessionStorage.clear()

    // Redirect to login page (for now, redirect to home)
    router.push("/")
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogOut className="w-8 h-8 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">Confirm Logout</h1>
          <p className="text-gray-600 mb-8">
            Are you sure you want to logout from AgroFlow CRM? You will need to login again to access your dashboard.
          </p>

          <div className="space-y-3">
            <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white">
              Yes, Logout
            </Button>
            <Button onClick={handleCancel} variant="outline" className="w-full bg-transparent">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
