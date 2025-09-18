"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Users, Plus, Loader2, Target, MapPin, TrendingUp } from "lucide-react"
import HireTeamLeaderForm from "./HireTeamLeaderForm"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function TeamLeaderSection({ currentHr }) {
    const [teamLeaders, setTeamLeaders] = useState([])
    const [loading, setLoading] = useState(true)
    const [showHireForm, setShowHireForm] = useState(false)
    const [error, setError] = useState(null)

    const fetchTeamLeaders = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${API_URL}/api/hr/team-leaders/fetch-data`, {
                credentials: 'include'
            })

            if (response.ok) {
                const data = await response.json()
                setTeamLeaders(data.data)
            } else {
                throw new Error("Failed to fetch team leaders")
            }
        } catch (err) {
            console.error("Error fetching team leaders:", err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTeamLeaders()
    }, [])

    const handleHireSuccess = (newTeamLeader) => {
        fetchTeamLeaders() // Refresh data after successful hire
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading team leaders...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-red-600">Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={fetchTeamLeaders}>Try Again</Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Team Leaders</h1>
                    <p className="text-muted-foreground">Manage sales team leaders and their performance</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Badge variant="default" className="bg-blue-500 w-fit">
                        <Users className="w-4 h-4 mr-1" />
                        {teamLeaders.length} Team Leaders
                    </Badge>
                    <Button onClick={() => setShowHireForm(true)} size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Hire New Team Leader
                    </Button>
                </div>
            </div>

            {/* Team Leaders Grid */}
            {teamLeaders.length === 0 ? (
                <Card className="text-center p-8">
                    <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Team Leaders Yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Start by hiring your first team leader to manage sales operations.
                    </p>
                    <Button onClick={() => setShowHireForm(true)}>
                        <Plus className="w-4 h-4 mr-1" />
                        Hire First Team Leader
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamLeaders.map((leader) => (
                        <Card key={leader._id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-4">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={leader.photo || "/placeholder.svg"} />
                                        <AvatarFallback className="bg-blue-100 text-blue-600">
                                            {leader.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">{leader.name}</CardTitle>
                                        <CardDescription>{leader.businessData?.designation}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Zone:</span>
                                    <span className="font-medium flex items-center">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {leader.businessData?.assignedZone || "Not assigned"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Team Size:</span>
                                    <span className="font-medium">
                                        {leader.businessData?.teamSize || 0} members
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Monthly Target:</span>
                                    <span className="font-medium">
                                        ₹{leader.businessData?.monthlyTarget?.toLocaleString() || "0"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Status:</span>
                                    <Badge variant={leader.status === "active" ? "default" : "secondary"}>
                                        {leader.status}
                                    </Badge>
                                </div>
                                <div className="pt-3 border-t">
                                    <Button variant="outline" size="sm" className="w-full">
                                        View Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Performance Overview */}
            {teamLeaders.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Team Leaders Performance Overview
                        </CardTitle>
                        <CardDescription>
                            Summary of all team leaders' performance metrics
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    {teamLeaders.length}
                                </div>
                                <div className="text-sm text-muted-foreground">Total Leaders</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {teamLeaders.filter(l => l.status === "active").length}
                                </div>
                                <div className="text-sm text-muted-foreground">Active Leaders</div>
                            </div>
                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">
                                    {teamLeaders.reduce((sum, leader) => sum + (leader.businessData?.teamSize || 0), 0)}
                                </div>
                                <div className="text-sm text-muted-foreground">Total Team Members</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">
                                    ₹{teamLeaders.reduce((sum, leader) => sum + (leader.businessData?.monthlyTarget || 0), 0).toLocaleString()}
                                </div>
                                <div className="text-sm text-muted-foreground">Total Monthly Target</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Hire Team Leader Form Modal */}
            {showHireForm && (
                <HireTeamLeaderForm
                    onClose={() => setShowHireForm(false)}
                    onSuccess={handleHireSuccess}
                    currentHr={currentHr}
                />
            )}
        </div>
    )
}