"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { MapPin, Calendar, Phone, User, Mail, Target, Clock, CheckCircle, Image as ImageIcon, X, ZoomIn } from "lucide-react"
import { useState, useEffect } from "react"

const TaskDetailsPopup = ({
    isOpen,
    onClose,
    taskDetails,
    isLoading,
    selectedTask
}) => {
    const [selectedImage, setSelectedImage] = useState(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            document.body.style.overflow = 'hidden'
        } else {
            setIsVisible(false)
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(() => {
            onClose()
        }, 300)
    }

    const getPriorityBadge = (priority) => {
        const variants = {
            high: "destructive",
            medium: "secondary",
            low: "outline"
        }
        return <Badge variant={variants[priority]} className="text-xs px-2 py-1">{priority}</Badge>
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getStatusBadge = (status) => {
        const variants = {
            'Approved': 'default',
            'Pending': 'secondary',
            'Rejected': 'destructive'
        }
        return <Badge variant={variants[status]} className="text-xs px-2 py-1">{status}</Badge>
    }

    const ImageGallery = ({ images, title }) => {
        if (!images || images.length === 0) return null

        return (
            <div className="mt-4">
                <Label className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <ImageIcon className="h-4 w-4" />
                    {title} ({images.length})
                </Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                    {images.map((image, index) => (
                        <div key={index} className="relative group cursor-pointer" onClick={() => setSelectedImage(image)}>
                            <div className="aspect-square rounded-lg border-2 border-gray-200 overflow-hidden group-hover:border-blue-500 transition-all duration-200 group-hover:scale-105 shadow-sm bg-gray-100">
                                <img
                                    src={image}
                                    alt={`${title} ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg" />
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <ZoomIn className="h-3 w-3 text-white bg-black bg-opacity-50 rounded p-0.5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const ImageModal = ({ image, onClose }) => {
        if (!image) return null

        return (
            <div
                className="fixed inset-0 bg-black bg-opacity-90 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
                onClick={onClose}
            >
                <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all duration-200"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img
                            src={image}
                            alt="Enlarged view"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            </div>
        )
    }

    const FarmerDetailsCard = ({ lead }) => (
        <Card className="p-4 border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-200 bg-white h-full rounded-xl">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-base text-gray-900 mb-2 break-words">{lead.farmerName}</h4>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium break-all">{lead.farmerPhone}</span>
                        </div>
                        {lead.farmerEmail && (
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                <span className="break-all text-gray-600">{lead.farmerEmail}</span>
                            </div>
                        )}
                        <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2 break-words leading-relaxed text-gray-600">{lead.farmerAddress}</span>
                        </div>
                        {lead.farmSize && (
                            <div className="flex items-center gap-2 text-sm">
                                <Target className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                <span className="break-words text-gray-600">Farm Size: {lead.farmSize}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-shrink-0">
                    {getStatusBadge(lead.status)}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-3">
                {lead.farmerAge && (
                    <div className="break-words">Age: {lead.farmerAge}y</div>
                )}
                {lead.farmingExperience && (
                    <div className="break-words">Experience: {lead.farmingExperience}y</div>
                )}
                {lead.farmType && (
                    <div className="break-words">Type: {lead.farmType}</div>
                )}
                {lead.preferredFishType && (
                    <div className="break-words">Fish: {lead.preferredFishType}</div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 pt-3 border-t text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    {formatDate(lead.submissionDate)}
                </div>
                {lead.nextFollowUpDate && (
                    <div className="flex items-center gap-1 text-orange-600 font-medium">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span>Follow-up:</span>
                        {formatDate(lead.nextFollowUpDate)}
                    </div>
                )}
            </div>

            {lead.salesEmployeePhotos && lead.salesEmployeePhotos.length > 0 && (
                <ImageGallery images={lead.salesEmployeePhotos} title="Proof Photos" />
            )}
        </Card>
    )

    const TaskResponseSummary = ({ response }) => (
        <Card className="bg-white rounded-xl">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Task Response Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 text-sm">
                    <div className="space-y-1">
                        <Label className="font-semibold text-xs">Work Status</Label>
                        <Badge variant="outline" className="text-xs capitalize px-2 py-1">
                            {response.workStatus}
                        </Badge>
                    </div>
                    <div className="space-y-1">
                        <Label className="font-semibold text-xs">Completion</Label>
                        <div className="flex items-center gap-2">
                            <Progress value={response.completionPercentage} className="h-2 flex-1 min-w-[50px]" />
                            <span className="text-xs font-bold whitespace-nowrap">{response.completionPercentage}%</span>
                        </div>
                    </div>
                    {response.hoursSpent && (
                        <div className="space-y-1">
                            <Label className="font-semibold text-xs">Hours Spent</Label>
                            <p className="font-bold text-sm">{response.hoursSpent}h</p>
                        </div>
                    )}
                    {response.rating && (
                        <div className="space-y-1">
                            <Label className="font-semibold text-xs">Rating</Label>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-3 h-3 rounded-full ${i < response.rating ? 'bg-yellow-400' : 'bg-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {response.submittedAt && (
                        <div className="space-y-1">
                            <Label className="font-semibold text-xs">Submitted</Label>
                            <p className="font-semibold text-xs">{formatDate(response.submittedAt)}</p>
                        </div>
                    )}
                </div>

                {(response.responseTitle || response.responseDescription) && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {response.responseTitle && (
                            <div>
                                <Label className="font-semibold text-xs mb-1 block">Response Title</Label>
                                <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200 break-words">
                                    {response.responseTitle}
                                </p>
                            </div>
                        )}
                        {response.responseDescription && (
                            <div>
                                <Label className="font-semibold text-xs mb-1 block">Response Description</Label>
                                <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200 break-words leading-relaxed">
                                    {response.responseDescription}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {(response.challengesFaced || response.keyPoints?.length > 0) && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {response.challengesFaced && (
                            <div>
                                <Label className="font-semibold text-xs mb-1 block">Challenges Faced</Label>
                                <p className="text-sm mt-1 p-3 bg-orange-50 rounded-lg border border-orange-200 break-words leading-relaxed">
                                    {response.challengesFaced}
                                </p>
                            </div>
                        )}
                        {response.keyPoints?.length > 0 && (
                            <div>
                                <Label className="font-semibold text-xs mb-1 block">Key Points</Label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {response.keyPoints.map((point, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs py-1 px-3">
                                            {point}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {response.nextSteps && (
                    <div>
                        <Label className="font-semibold text-xs mb-1 block">Next Steps</Label>
                        <p className="text-sm mt-1 p-3 bg-green-50 rounded-lg border border-green-200 break-words leading-relaxed">
                            {response.nextSteps}
                        </p>
                    </div>
                )}

                <ImageGallery images={response.images} title="Response Images" />
            </CardContent>
        </Card>
    )

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black z-50 transition-opacity duration-300 ${isVisible ? 'opacity-50' : 'opacity-0'
                    }`}
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className={`fixed inset-4 bg-white z-50 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b px-6 py-4 relative">
                    <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-200"
                        onClick={handleClose}
                    >
                        <X className="h-4 w-4" />
                    </button>

                    <div className="text-left pr-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                            Task Details & Work Progress
                        </h2>
                        <p className="text-sm text-gray-600">
                            Complete overview of task information and collected farmer leads
                        </p>
                    </div>
                </div>

                {/* Content Area - Full width scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50 h-[calc(100vh-120px)]">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : taskDetails ? (
                        <div className="space-y-6 max-w-none">
                            {/* Main Grid */}
                            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                                {/* Task Information */}
                                <div className="xl:col-span-3 space-y-6">
                                    <Card className="bg-white border-0 shadow-lg rounded-xl">
                                        <CardHeader className="pb-4 border-b">
                                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-3">
                                                <div className="w-3 h-8 bg-blue-500 rounded-full"></div>
                                                Task Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4 space-y-6">
                                            <div>
                                                <Label className="text-base font-semibold text-gray-700 mb-3 block">Title & Description</Label>
                                                <div className="space-y-3">
                                                    <p className="font-bold text-xl text-gray-900 break-words leading-tight">
                                                        {taskDetails.title}
                                                    </p>
                                                    <p className="text-gray-600 text-sm break-words leading-relaxed">
                                                        {taskDetails.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-gray-600">Priority</Label>
                                                    <div className="text-base">{getPriorityBadge(taskDetails.priority)}</div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-gray-600">Status</Label>
                                                    <Badge variant="outline" className="capitalize text-sm px-3 py-1">
                                                        {taskDetails.status}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-gray-600">Progress</Label>
                                                    <div className="flex items-center gap-3">
                                                        <Progress value={taskDetails.progress} className="h-2 flex-1" />
                                                        <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                                                            {taskDetails.progress}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {taskDetails.highlights && taskDetails.highlights.length > 0 && (
                                                <div>
                                                    <Label className="text-base font-semibold text-gray-700 mb-3 block">Highlights</Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {taskDetails.highlights.map((highlight, index) => (
                                                            <Badge key={index} variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                                                                {highlight}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Farmer Leads Section */}
                                    <Card className="bg-white border-0 shadow-lg rounded-xl">
                                        <CardHeader className="pb-4 border-b">
                                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-3">
                                                <User className="h-5 w-5 text-blue-500" />
                                                Farmer Leads Collected
                                                <Badge variant="secondary" className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1">
                                                    {taskDetails.farmerLeads?.length || 0} Leads
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            {taskDetails.farmerLeads && taskDetails.farmerLeads.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                                                    {taskDetails.farmerLeads.map((lead) => (
                                                        <FarmerDetailsCard key={lead._id} lead={lead} />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                                                    <User className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                                    <p className="text-gray-500 text-base font-semibold">No farmer leads collected yet</p>
                                                    <p className="text-gray-400 text-sm mt-2">
                                                        The sales employee hasn't submitted any farmer leads for this task.
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Timeline Card */}
                                    <Card className="bg-white border-0 shadow-lg rounded-xl">
                                        <CardHeader className="pb-4 border-b">
                                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-3">
                                                <div className="w-3 h-8 bg-green-500 rounded-full"></div>
                                                Timeline
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4 space-y-4">
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <Label className="text-sm font-semibold text-gray-700">Assigned</Label>
                                                <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                                                    {formatDate(taskDetails.assignmentDate)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <Label className="text-sm font-semibold text-gray-700">Due Date</Label>
                                                <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                                                    {formatDate(taskDetails.deadline)}
                                                </span>
                                            </div>
                                            {taskDetails.completedAt && (
                                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                    <Label className="text-sm font-semibold text-gray-700">Completed</Label>
                                                    <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                                                        {formatDate(taskDetails.completedAt)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center py-2">
                                                <Label className="text-sm font-semibold text-gray-700">Created</Label>
                                                <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                                                    {formatDate(taskDetails.createdAt)}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Assigned To Card */}
                                    <Card className="bg-white border-0 shadow-lg rounded-xl">
                                        <CardHeader className="pb-4 border-b">
                                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-3">
                                                <div className="w-3 h-8 bg-purple-500 rounded-full"></div>
                                                Assigned To
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <div className="flex flex-col items-center text-center gap-4">
                                                <Avatar className="h-16 w-16 border-2 border-gray-200">
                                                    <AvatarImage src={taskDetails.assignedTo?.photo} />
                                                    <AvatarFallback className="text-base font-bold bg-blue-100 text-blue-600">
                                                        {taskDetails.assignedTo?.name?.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-base text-gray-900 break-words mb-2">
                                                        {taskDetails.assignedTo?.name}
                                                    </div>
                                                    <div className="text-sm text-gray-600 mb-2">
                                                        {taskDetails.assignedTo?.empCode} • {taskDetails.assignedTo?.designation}
                                                    </div>
                                                    <div className="text-sm text-gray-500 break-words">
                                                        {taskDetails.assignedTo?.companyEmail}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Assigned By Card */}
                                    <Card className="bg-white border-0 shadow-lg rounded-xl">
                                        <CardHeader className="pb-4 border-b">
                                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-3">
                                                <div className="w-3 h-8 bg-orange-500 rounded-full"></div>
                                                Assigned By
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <div className="flex flex-col items-center text-center gap-4">
                                                <Avatar className="h-16 w-16 border-2 border-gray-200">
                                                    <AvatarImage src={taskDetails.assignedBy?.photo} />
                                                    <AvatarFallback className="text-base font-bold bg-orange-100 text-orange-600">
                                                        {taskDetails.assignedBy?.name?.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-base text-gray-900 break-words mb-2">
                                                        {taskDetails.assignedBy?.name}
                                                    </div>
                                                    <div className="text-sm text-gray-600 mb-2">
                                                        {taskDetails.assignedBy?.empCode}
                                                    </div>
                                                    <div className="text-sm text-gray-500 break-words">
                                                        {taskDetails.assignedBy?.companyEmail}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Task Response */}
                            {taskDetails.response && (
                                <div className="mt-6">
                                    <TaskResponseSummary response={taskDetails.response} />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-gray-500">
                            <p className="text-lg font-semibold">Unable to load task details</p>
                            <p className="text-sm mt-2">Please try again later</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedImage && (
                <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
            )}
        </>
    )
}

export default TaskDetailsPopup