// components/Hrcomponent/AttendanceDetailsModal.js
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
    RefreshCw, 
    Eye, 
    User, 
    IdCard, 
    Mail, 
    Phone, 
    Building, 
    FileText, 
    CalendarDays, 
    Clock, 
    MapPin, 
    ImageIcon, 
    Navigation, 
    CheckSquare, 
    XCircle, 
    AlertCircle,
    Calendar,
    Map,
    BarChart3,
    CheckCircle2,
    UserCheck,
    Download,
    X
} from 'lucide-react';

const AttendanceDetailsModal = ({
    detailsDialog,
    setDetailsDialog,
    detailsLoading,
    attendanceDetails,
    selectedAttendance,
    formatTime,
    formatDuration,
    getStatusColor
}) => {
    // Professional coordinate display
    const renderLocationDetails = (locationData, type) => {
        if (!locationData) {
            return (
                <div className="text-center py-6">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No {type.toLowerCase()} location recorded</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm text-gray-700">Timestamp</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        {formatTime(locationData.timestamp)}
                    </Badge>
                </div>
                
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-sm text-gray-700">Geographical Coordinates</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                            <div className="text-xs text-blue-600 font-medium mb-1">LATITUDE</div>
                            <div className="text-sm font-mono font-bold text-blue-800">
                                {locationData.latitude?.toFixed(6) || 'N/A'}
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                            <div className="text-xs text-green-600 font-medium mb-1">LONGITUDE</div>
                            <div className="text-sm font-mono font-bold text-green-800">
                                {locationData.longitude?.toFixed(6) || 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                {locationData.address && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Map className="h-4 w-4 text-purple-600" />
                            <span className="font-medium text-sm text-gray-700">Approximate Location</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border">
                            <p className="text-sm text-gray-700">{locationData.address}</p>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Professional status display
    const renderStatusBadge = (status) => {
        const statusConfig = {
            'Present': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
            'Active': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
            'Holiday': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Calendar },
            'Absent': { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
            'Half Day': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: BarChart3 },
            'Early Leave': { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: UserCheck },
            'AwaitingApproval': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock },
            'Approved': { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
            'Rejected': { color: 'bg-rose-100 text-rose-800 border-rose-200', icon: XCircle }
        };

        const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: FileText };
        const IconComponent = config.icon;

        return (
            <Badge className={`${config.color} border px-3 py-1.5 text-sm font-medium`}>
                <IconComponent className="h-3 w-3 mr-1.5" />
                {status}
            </Badge>
        );
    };

    // Professional info row component
    const InfoRow = ({ icon: Icon, label, value, className = "" }) => (
        <div className={`flex items-start gap-3 p-3 bg-white rounded-lg border ${className}`}>
            <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Icon className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                    {label}
                </Label>
                <p className="text-sm font-semibold text-gray-900 break-words">
                    {value || 'Not Available'}
                </p>
            </div>
        </div>
    );

    // Don't render if dialog is closed
    if (!detailsDialog) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full h-full max-h-[95vh] overflow-hidden flex flex-col">
                {/* Custom Header */}
                <div className="flex items-center justify-between p-6 border-b bg-white shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Eye className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Attendance Record Details
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Comprehensive attendance information for <span className="font-semibold">{selectedAttendance?.name}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setDetailsDialog(false)}
                        className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {detailsLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                        <p className="text-lg font-medium text-gray-700">Loading Attendance Details</p>
                        <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the complete information...</p>
                    </div>
                ) : attendanceDetails ? (
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="max-w-7xl mx-auto space-y-6">
                            {/* Header Summary Card */}
                            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
                                                <User className="h-8 w-8 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {attendanceDetails.employeeInfo.name}
                                                </h3>
                                                <p className="text-gray-600">
                                                    {attendanceDetails.employeeInfo.department} • {attendanceDetails.employeeInfo.employeeId}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            {renderStatusBadge(attendanceDetails.attendanceDetails.status)}
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">
                                                    {format(new Date(attendanceDetails.attendanceDetails.date), 'EEEE, MMMM do, yyyy')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Main Grid Layout - Responsive */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                {/* Column 1 - Employee & Work Details */}
                                <div className="space-y-6">
                                    {/* Employee Information */}
                                    <Card>
                                        <CardHeader className="pb-3 bg-gray-50 rounded-t-lg">
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <User className="h-5 w-5 text-blue-600" />
                                                Employee Profile
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4 space-y-3">
                                            <InfoRow 
                                                icon={IdCard} 
                                                label="Employee ID" 
                                                value={attendanceDetails.employeeInfo.employeeId}
                                            />
                                            <InfoRow 
                                                icon={Mail} 
                                                label="Email Address" 
                                                value={attendanceDetails.employeeInfo.email}
                                            />
                                            <InfoRow 
                                                icon={Phone} 
                                                label="Contact Number" 
                                                value={attendanceDetails.employeeInfo.phone}
                                            />
                                            <InfoRow 
                                                icon={Building} 
                                                label="Department" 
                                                value={attendanceDetails.employeeInfo.department}
                                            />
                                            <InfoRow 
                                                icon={FileText} 
                                                label="Employee Type" 
                                                value={attendanceDetails.employeeInfo.employeeModel}
                                            />
                                        </CardContent>
                                    </Card>

                                    {/* Work Summary */}
                                    <Card>
                                        <CardHeader className="pb-3 bg-gray-50 rounded-t-lg">
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <BarChart3 className="h-5 w-5 text-green-600" />
                                                Work Summary
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4 space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                    <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                                                    <div className="text-xs text-blue-600 font-medium mb-1">TOTAL HOURS</div>
                                                    <div className="text-lg font-bold text-blue-800">
                                                        {formatDuration(attendanceDetails.attendanceDetails.totalWorkDuration)}
                                                    </div>
                                                </div>
                                                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                                                    <Navigation className="h-6 w-6 text-green-600 mx-auto mb-2" />
                                                    <div className="text-xs text-green-600 font-medium mb-1">DISTANCE</div>
                                                    <div className="text-lg font-bold text-green-800">
                                                        {attendanceDetails.travelData.totalDistance || 0} km
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <InfoRow 
                                                    icon={FileText} 
                                                    label="Work Type" 
                                                    value={attendanceDetails.attendanceDetails.workType}
                                                    className="bg-orange-50 border-orange-200"
                                                />
                                                <div className="p-3 bg-gray-50 rounded-lg border">
                                                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
                                                        Work Description
                                                    </Label>
                                                    <p className="text-sm text-gray-700 leading-relaxed">
                                                        {attendanceDetails.attendanceDetails.description || 'No work description provided for this attendance record.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Column 2 - Timeline & Locations */}
                                <div className="space-y-6">
                                    {/* Attendance Timeline */}
                                    <Card>
                                        <CardHeader className="pb-3 bg-gray-50 rounded-t-lg">
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <CalendarDays className="h-5 w-5 text-purple-600" />
                                                Attendance Timeline
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                                                    <div className="flex items-center gap-3">
                                                        <Calendar className="h-6 w-6 text-purple-600" />
                                                        <div>
                                                            <div className="text-xs font-medium text-purple-600 uppercase">WORK DATE</div>
                                                            <div className="text-sm font-semibold text-gray-900">
                                                                {format(new Date(attendanceDetails.attendanceDetails.date), 'MMMM do, yyyy')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                                                        <div className="flex items-center gap-3">
                                                            <Clock className="h-6 w-6 text-green-600" />
                                                            <div>
                                                                <div className="text-xs font-medium text-green-600 uppercase">CHECK-IN TIME</div>
                                                                <div className="text-sm font-semibold text-gray-900">
                                                                    {formatTime(attendanceDetails.attendanceDetails.workModeOnTime)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                        <div className="flex items-center gap-3">
                                                            <Clock className="h-6 w-6 text-blue-600" />
                                                            <div>
                                                                <div className="text-xs font-medium text-blue-600 uppercase">CHECK-OUT TIME</div>
                                                                <div className="text-sm font-semibold text-gray-900">
                                                                    {formatTime(attendanceDetails.attendanceDetails.workModeOffTime)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Location Tracking */}
                                    <Card>
                                        <CardHeader className="pb-3 bg-gray-50 rounded-t-lg">
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <Map className="h-5 w-5 text-red-600" />
                                                Location Tracking
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4 space-y-6">
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-green-600" />
                                                    Check-In Location
                                                </h4>
                                                {renderLocationDetails(attendanceDetails.locationData.workModeOnLocation, 'Check-in')}
                                            </div>
                                            
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-blue-600" />
                                                    Check-Out Location
                                                </h4>
                                                {renderLocationDetails(attendanceDetails.locationData.workModeOffLocation, 'Check-out')}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Column 3 - Media & Approval */}
                                <div className="space-y-6">
                                    {/* Media Evidence */}
                                    {attendanceDetails.mediaData.hasImage && (
                                        <Card>
                                            <CardHeader className="pb-3 bg-gray-50 rounded-t-lg">
                                                <CardTitle className="flex items-center gap-2 text-lg">
                                                    <ImageIcon className="h-5 w-5 text-amber-600" />
                                                    Attendance Evidence
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-4">
                                                <div className="space-y-3">
                                                    <img
                                                        src={attendanceDetails.mediaData.imageURL}
                                                        alt="Attendance verification image"
                                                        className="w-full h-48 object-cover rounded-lg border shadow-sm"
                                                        onError={(e) => {
                                                            e.target.src = '/api/placeholder/400/300';
                                                            e.target.alt = 'Evidence image not available';
                                                        }}
                                                    />
                                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                                        <span>Uploaded evidence image</span>
                                                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                                                            <Download className="h-3 w-3" />
                                                            Download
                                                        </button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Approval Information */}
                                    <Card>
                                        <CardHeader className="pb-3 bg-gray-50 rounded-t-lg">
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <CheckSquare className="h-5 w-5 text-emerald-600" />
                                                Approval Status
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4 space-y-4">
                                            {attendanceDetails.approvalData.approvedBy ? (
                                                <>
                                                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <UserCheck className="h-6 w-6 text-emerald-600" />
                                                            <div>
                                                                <div className="text-xs font-medium text-emerald-600 uppercase">APPROVED BY</div>
                                                                <div className="text-sm font-semibold text-gray-900">
                                                                    {attendanceDetails.approvalData.approvedBy.name}
                                                                </div>
                                                                <div className="text-xs text-gray-600">
                                                                    {attendanceDetails.approvalData.approvedBy.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-2">
                                                            Approved on {formatTime(attendanceDetails.approvalData.approvalDate)}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center py-6 bg-yellow-50 rounded-lg border border-yellow-200">
                                                    <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                                                    <p className="text-sm font-medium text-yellow-800">Pending Approval</p>
                                                    <p className="text-xs text-yellow-600 mt-1">Awaiting manager review</p>
                                                </div>
                                            )}

                                            {attendanceDetails.approvalData.remarks && (
                                                <div className="p-3 bg-gray-50 rounded-lg border">
                                                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
                                                        Approval Remarks
                                                    </Label>
                                                    <p className="text-sm text-gray-700 leading-relaxed">
                                                        {attendanceDetails.approvalData.remarks}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* System Information */}
                                    <Card>
                                        <CardHeader className="pb-3 bg-gray-50 rounded-t-lg">
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <FileText className="h-5 w-5 text-gray-600" />
                                                System Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4 space-y-3">
                                            <InfoRow 
                                                icon={Calendar} 
                                                label="Record Created" 
                                                value={formatTime(attendanceDetails.systemData.createdAt)}
                                            />
                                            <InfoRow 
                                                icon={Clock} 
                                                label="Last Updated" 
                                                value={formatTime(attendanceDetails.systemData.updatedAt)}
                                            />
                                            <div className="p-3 bg-gray-50 rounded-lg border">
                                                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
                                                    Record ID
                                                </Label>
                                                <p className="text-xs font-mono text-gray-600 break-all">
                                                    {attendanceDetails._id}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Travel Logs Section - Full Width */}
                            {attendanceDetails.travelData.totalLogs > 0 && (
                                <Card>
                                    <CardHeader className="pb-3 bg-gray-50 rounded-t-lg">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Navigation className="h-5 w-5 text-indigo-600" />
                                            Travel Logs ({attendanceDetails.travelData.totalLogs} entries)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-2">
                                            {attendanceDetails.travelData.travelLogs.map((log, index) => (
                                                <div key={index} className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                                                            Log #{index + 1}
                                                        </Badge>
                                                        <span className="text-xs text-gray-500">
                                                            {formatTime(log.timestamp)}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">Latitude:</span>
                                                            <span className="font-mono font-semibold text-gray-900">
                                                                {log.coordinates.latitude?.toFixed(6)}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">Longitude:</span>
                                                            <span className="font-mono font-semibold text-gray-900">
                                                                {log.coordinates.longitude?.toFixed(6)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-700 mb-2">No Details Available</p>
                        <p className="text-sm text-gray-500 text-center">
                            Unable to load attendance details for this record.
                            <br />
                            The record may have been deleted or is temporarily unavailable.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceDetailsModal;