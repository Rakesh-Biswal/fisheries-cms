"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import CeoSidebar from "../../../../../components/CeoComponent/CeoSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Badge } from "../../../../../components/ui/badge"
import { Button } from "../../../../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../components/ui/avatar"
import { Separator } from "../../../../../components/ui/separator"
import { Progress } from "../../../../../components/ui/progress"
import { ArrowLeft, Mail, Phone, Calendar, User, Clock, Award, TrendingUp, Users, Loader2 } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function HrProfilePage() {
    const searchParams = useSearchParams()
    const id = searchParams.get("id")
    console.log("HR Profile ID from URL:", id)
    const router = useRouter()
    const [hrEmployee, setHrEmployee] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchHrProfile = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${API_URL}/api/ceo/hr/profile/${id}`, {
                method: "GET",
                credentials: "include", // ✅ Pass cookies/session credentials
            })

            if (response.ok) {
                const data = await response.json()
                setHrEmployee(data.data)
            } else {
                throw new Error("Failed to fetch HR profile")
            }
        } catch (err) {
            console.error("Error fetching HR profile:", err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (id) {
            fetchHrProfile()
        }
    }, [id])

    if (loading) {
        return (
            <div className="flex h-screen bg-background">
                <CeoSidebar activeSection="hr" />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading HR profile...</p>
                    </div>
                </main>
            </div>
        )
    }

    if (error || !hrEmployee) {
        return (
            <div className="flex h-screen bg-background">
                <CeoSidebar activeSection="hr" />
                <main className="flex-1 flex items-center justify-center">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-red-600">Error</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">{error || "HR profile not found"}</p>
                            <Button onClick={() => router.back()}>Go Back</Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-background">
            <CeoSidebar activeSection="hr" />
            <main className="flex-1 overflow-auto p-4 md:p-6 space-y-4 md:space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to HR Dashboard
                    </Button>
                </div>

                {/* Profile Header */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex flex-col items-center md:items-start">
                                <Avatar className="w-24 h-24 mb-4">
                                    <AvatarImage src={hrEmployee.photo || "/placeholder.svg"} />
                                    <AvatarFallback className="text-2xl">
                                        {hrEmployee.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <Badge variant={hrEmployee.status === "active" ? "default" : "secondary"} className="mb-2">
                                    {hrEmployee.status}
                                </Badge>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold">{hrEmployee.name}</h1>
                                    <p className="text-lg text-muted-foreground">{hrEmployee.designation || "HR Executive"}</p>
                                    <p className="text-sm text-muted-foreground">Employee ID: {hrEmployee.empCode}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{hrEmployee.companyEmail}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{hrEmployee.phone}</span>
                                    </div>
                                    <span className="text-sm">
                                        Joined: {hrEmployee.businessData?.joiningDate ? new Date(hrEmployee.businessData.joiningDate).toLocaleDateString() : "N/A"}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{hrEmployee.businessData.employeeType}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Full Name:</span>
                                <span className="font-medium">{hrEmployee.name}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Phone:</span>
                                <span className="font-medium">{hrEmployee.phone}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Company Email:</span>
                                <span className="font-medium">{hrEmployee.companyEmail}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Aadhar Number:</span>
                                <span className="font-medium">****-****-{hrEmployee.aadhar?.slice(-4) || "****"}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">PAN Number:</span>
                                <span className="font-medium">{hrEmployee.pan || "Not provided"}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Employment Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Employee Code:</span>
                                <span className="font-medium">{hrEmployee.empCode}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Department:</span>
                                <span className="font-medium">Human Resources</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Employee Type:</span>
                                <span className="font-medium">{hrEmployee.businessData.employeeType}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Joining Date:</span>
                                <span className="font-medium">
                                    {hrEmployee.businessData?.joiningDate
                                        ? new Date(hrEmployee.businessData.joiningDate).toLocaleDateString()
                                        : "N/A"}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <Badge variant={hrEmployee.status === "active" ? "default" : "secondary"}>{hrEmployee.status}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                                Attendance Rate
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">94.5%</div>
                            <Progress value={94.5} className="mt-2" />
                            <p className="text-xs text-muted-foreground mt-1">Above average (90%)</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center">
                                <Award className="w-4 h-4 mr-2 text-yellow-500" />
                                Performance Score
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">8.7/10</div>
                            <Progress value={87} className="mt-2" />
                            <p className="text-xs text-muted-foreground mt-1">Excellent performance</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center">
                                <Users className="w-4 h-4 mr-2 text-green-500" />
                                Team Satisfaction
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">9.2/10</div>
                            <Progress value={92} className="mt-2" />
                            <p className="text-xs text-muted-foreground mt-1">High team satisfaction</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activities */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                        <CardDescription>Latest HR activities and achievements</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <Award className="w-5 h-5 text-yellow-500 mt-0.5" />
                                <div>
                                    <p className="font-medium">Completed Leadership Training</p>
                                    <p className="text-sm text-muted-foreground">
                                        Successfully completed advanced leadership certification program
                                    </p>
                                    <p className="text-xs text-muted-foreground">2 days ago</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <Users className="w-5 h-5 text-blue-500 mt-0.5" />
                                <div>
                                    <p className="font-medium">Conducted Team Building Session</p>
                                    <p className="text-sm text-muted-foreground">
                                        Organized and led team building activities for engineering department
                                    </p>
                                    <p className="text-xs text-muted-foreground">1 week ago</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                                <div>
                                    <p className="font-medium">Improved Recruitment Process</p>
                                    <p className="text-sm text-muted-foreground">
                                        Implemented new screening process reducing hiring time by 30%
                                    </p>
                                    <p className="text-xs text-muted-foreground">2 weeks ago</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
