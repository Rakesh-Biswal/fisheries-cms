// components/Hrcomponent/attendance-dashboard.js - COMPLETE WITH DETAILED MODAL
"use client"

import React, { useState, useEffect } from 'react';
import { format, parseISO, startOfDay } from 'date-fns';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Users,
    Calendar,
    Filter,
    Download,
    RefreshCw,
    Clock,
    UserCheck,
    UserX,
    AlertCircle,
    Search,
    CheckCircle,
    Edit,
    MoreHorizontal,
    MapPin,
    ImageIcon,
    Navigation,
    FileText,
    Mail,
    Phone,
    IdCard,
    Building,
    User,
    CalendarDays,
    Navigation as NavIcon,
    CheckSquare,
    XCircle,
    Eye
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const AttendanceDashboard = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [summary, setSummary] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [isHoliday, setIsHoliday] = useState(false);
    const [holidayInfo, setHolidayInfo] = useState(null);

    // Modal states
    const [approvalDialog, setApprovalDialog] = useState(false);
    const [statusDialog, setStatusDialog] = useState(false);
    const [detailsDialog, setDetailsDialog] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [attendanceDetails, setAttendanceDetails] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [detailsLoading, setDetailsLoading] = useState(false);

    const departments = [
        'CEO', 'HR', 'Team Leader', 'Project Manager', 'Sales Employee', 'Telecaller', 'Accountant'
    ];

    const statusOptions = [
        'Present', 'Half Day', 'Early Leave', 'Absent', 'Active', 'AwaitingApproval', 'Holiday'
    ];

    const statusUpdateOptions = [
        'Present', 'Half Day', 'Leave', 'Absent', 'Late Arrival', 'Early Leave', 'Approved', 'Rejected'
    ];

    // Fetch attendance data
    const fetchAttendanceData = async () => {
        try {
            setLoading(true);
            const formattedDate = selectedDate;

            const response = await fetch(
                `${API_BASE_URL}/api/hr/attendance-dashboard/daily-attendance?date=${formattedDate}`,
                {
                    credentials: 'include'
                }
            );

            const result = await response.json();

            if (result.success) {
                setAttendanceData(result.data.attendance);
                setSummary(result.data.summary);
                setIsHoliday(result.data.isHoliday);
                setHolidayInfo(result.data.holidayInfo);
            } else {
                console.error('Failed to fetch attendance data:', result.error);
            }
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch COMPLETE detailed attendance data
    const fetchAttendanceDetails = async (attendanceId) => {
        try {
            setDetailsLoading(true);
            console.log("Fetching details for attendance ID:", attendanceId);

            const response = await fetch(
                `${API_BASE_URL}/api/hr/attendance-dashboard/attendance-details/${attendanceId}`,
                {
                    credentials: 'include'
                }
            );

            const result = await response.json();

            if (result.success) {
                console.log("Fetched detailed attendance data:", result.data);
                setAttendanceDetails(result.data);
                setDetailsDialog(true);
            } else {
                console.error('Failed to fetch attendance details:', result.error);
                alert('Failed to fetch attendance details: ' + result.error);
            }
        } catch (error) {
            console.error('Error fetching attendance details:', error);
            alert('Error fetching attendance details: ' + error.message);
        } finally {
            setDetailsLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendanceData();
    }, [selectedDate]);

    // Approve attendance
    const handleApprove = async (attendanceId) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/hr/attendance-dashboard/approve-attendance/${attendanceId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        finalStatus: 'Approved',
                        remarks: remarks
                    })
                }
            );

            const result = await response.json();

            if (result.success) {
                fetchAttendanceData();
                setApprovalDialog(false);
                setRemarks('');
            } else {
                alert(result.error || 'Failed to approve attendance');
            }
        } catch (error) {
            console.error('Error approving attendance:', error);
            alert('Error approving attendance');
        }
    };

    // Update status
    const handleStatusUpdate = async () => {
        if (!selectedAttendance || !selectedStatus) return;

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/hr/attendance-dashboard/update-status/${selectedAttendance.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        status: selectedStatus,
                        remarks: remarks
                    })
                }
            );

            const result = await response.json();

            if (result.success) {
                fetchAttendanceData();
                setStatusDialog(false);
                setSelectedStatus('');
                setRemarks('');
            } else {
                alert(result.error || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status');
        }
    };

    // Filter data based on selections
    const filteredData = attendanceData.filter(employee => {
        // Department filter
        if (departmentFilter !== 'all' && employee.department !== departmentFilter) {
            return false;
        }

        // Status filter
        if (statusFilter !== 'all' && employee.status !== statusFilter) {
            return false;
        }

        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return (
                employee.name.toLowerCase().includes(searchLower) ||
                employee.department.toLowerCase().includes(searchLower) ||
                employee.role.toLowerCase().includes(searchLower)
            );
        }

        return true;
    });

    // Format time display
    const formatTime = (time) => {
        if (!time) return 'Not recorded';
        return format(new Date(time), 'PPpp');
    };

    // Format duration display
    const formatDuration = (hours) => {
        if (!hours || hours === 0) return '0h 0m';
        const totalMinutes = hours * 60;
        const hrs = Math.floor(totalMinutes / 60);
        const mins = Math.floor(totalMinutes % 60);
        return `${hrs}h ${mins}m`;
    };

    // Format simple time (hours:minutes)
    const formatSimpleTime = (time) => {
        if (!time) return '-';
        return format(new Date(time), 'HH:mm');
    };

    // Get status badge variant
    const getStatusVariant = (status) => {
        switch (status) {
            case 'Present': return 'default';
            case 'Active': return 'secondary';
            case 'Half Day': return 'outline';
            case 'Early Leave': return 'destructive';
            case 'Absent': return 'secondary';
            case 'AwaitingApproval': return 'outline';
            case 'Holiday': return 'default';
            default: return 'outline';
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Present': return 'bg-green-100 text-green-800';
            case 'Active': return 'bg-blue-100 text-blue-800';
            case 'Half Day': return 'bg-yellow-100 text-yellow-800';
            case 'Early Leave': return 'bg-orange-100 text-orange-800';
            case 'Absent': return 'bg-red-100 text-red-800';
            case 'AwaitingApproval': return 'bg-purple-100 text-purple-800';
            case 'Holiday': return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Render coordinate information
    const renderCoordinates = (coordinates, label) => {
        if (!coordinates) return null;

        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{label}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-blue-50 p-2 rounded">
                        <span className="text-blue-700">Lat: {coordinates.latitude}</span>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                        <span className="text-blue-700">Lng: {coordinates.longitude}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Holiday Banner */}
                {isHoliday && holidayInfo && (
                    <Card className="bg-indigo-50 border-indigo-200 mb-6">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-indigo-100 rounded-lg">
                                        <AlertCircle className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-indigo-800">Holiday Notice</h3>
                                        <p className="text-indigo-700 text-sm">
                                            {holidayInfo.title} - {holidayInfo.description}
                                        </p>
                                        {holidayInfo.departments && (
                                            <p className="text-indigo-600 text-xs mt-1">
                                                Affected departments: {holidayInfo.departments.join(', ')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Badge variant="secondary" className="bg-indigo-200 text-indigo-800">
                                    Holiday
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4 mb-4 lg:mb-0">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Attendance Dashboard</h1>
                                <p className="text-gray-600 mt-1">Monitor daily attendance across all departments</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button onClick={fetchAttendanceData} disabled={loading}>
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total</p>
                                    <p className="text-2xl font-bold text-gray-900">{summary.totalEmployees || 0}</p>
                                </div>
                                <Users className="w-8 h-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Present</p>
                                    <p className="text-2xl font-bold text-green-600">{summary.present || 0}</p>
                                </div>
                                <UserCheck className="w-8 h-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active</p>
                                    <p className="text-2xl font-bold text-blue-600">{summary.active || 0}</p>
                                </div>
                                <Clock className="w-8 h-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Half Day</p>
                                    <p className="text-2xl font-bold text-yellow-600">{summary.halfDay || 0}</p>
                                </div>
                                <AlertCircle className="w-8 h-8 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Early Leave</p>
                                    <p className="text-2xl font-bold text-orange-600">{summary.earlyLeave || 0}</p>
                                </div>
                                <AlertCircle className="w-8 h-8 text-orange-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Absent</p>
                                    <p className="text-2xl font-bold text-red-600">{summary.absent || 0}</p>
                                </div>
                                <UserX className="w-8 h-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending</p>
                                    <p className="text-2xl font-bold text-purple-600">{summary.awaitingApproval || 0}</p>
                                </div>
                                <AlertCircle className="w-8 h-8 text-purple-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Holiday</p>
                                    <p className="text-2xl font-bold text-indigo-600">{summary.holiday || 0}</p>
                                </div>
                                <AlertCircle className="w-8 h-8 text-indigo-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    type="date"
                                    id="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Departments" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Departments</SelectItem>
                                        {departments.map(dept => (
                                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        {statusOptions.map(status => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="search">Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Search employees..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Attendance Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Attendance</CardTitle>
                        <CardDescription>
                            {format(new Date(selectedDate), 'EEEE, MMMM dd, yyyy')} •
                            Showing {filteredData.length} of {attendanceData.length} employees
                            {isHoliday && ' • Holiday Today'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center p-8">
                                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                                <span className="ml-2 text-gray-600">Loading attendance data...</span>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee Name</TableHead>
                                            <TableHead>Role/Department</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Start Time</TableHead>
                                            <TableHead>End Time</TableHead>
                                            <TableHead>Total Hours</TableHead>
                                            <TableHead>Work Type</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredData.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                                    No attendance records found for the selected criteria
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredData.map((employee) => (
                                                <TableRow key={employee.id} className="hover:bg-gray-50">
                                                    <TableCell>
                                                        <button
                                                            onClick={() => {
                                                                if (employee.id && !employee.id.startsWith('absent-')) {
                                                                    setSelectedAttendance(employee);
                                                                    fetchAttendanceDetails(employee.id);
                                                                }
                                                            }}
                                                            className={`font-medium text-left flex items-center gap-2 ${employee.id && !employee.id.startsWith('absent-')
                                                                ? 'text-blue-600 hover:text-blue-800 hover:underline cursor-pointer'
                                                                : 'text-gray-900 cursor-default'
                                                                }`}
                                                        >
                                                            <User className="h-4 w-4" />
                                                            {employee.name}
                                                            {employee.holidayInfo && (
                                                                <span className="ml-2 text-xs text-indigo-600">🎉</span>
                                                            )}
                                                        </button>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{employee.role}</div>
                                                            <div className="text-sm text-muted-foreground">{employee.department}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={getStatusVariant(employee.status)}
                                                            className={getStatusColor(employee.status)}
                                                        >
                                                            {employee.status}
                                                            {employee.isActive && ' 🔵'}
                                                        </Badge>
                                                        {employee.holidayInfo && (
                                                            <div className="text-xs text-indigo-600 mt-1">
                                                                {employee.holidayInfo.title}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{formatSimpleTime(employee.startTime)}</TableCell>
                                                    <TableCell>{formatSimpleTime(employee.endTime)}</TableCell>
                                                    <TableCell>{formatDuration(employee.totalHours)}</TableCell>
                                                    <TableCell>
                                                        <span className="text-sm text-muted-foreground">
                                                            {employee.workType || '-'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex space-x-2">
                                                            {employee.requiresApproval && (
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSelectedAttendance(employee);
                                                                        setApprovalDialog(true);
                                                                    }}
                                                                    className="bg-green-600 hover:bg-green-700"
                                                                >
                                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                                    Approve
                                                                </Button>
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setSelectedAttendance(employee);
                                                                    setStatusDialog(true);
                                                                }}
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Approval Dialog */}
            <Dialog open={approvalDialog} onOpenChange={setApprovalDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Attendance</DialogTitle>
                        <DialogDescription>
                            Approve attendance for {selectedAttendance?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="remarks">Remarks (Optional)</Label>
                            <Input
                                id="remarks"
                                placeholder="Add remarks..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setApprovalDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => handleApprove(selectedAttendance?.id)}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Attendance
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Status Update Dialog */}
            <Dialog open={statusDialog} onOpenChange={setStatusDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Attendance Status</DialogTitle>
                        <DialogDescription>
                            Update status for {selectedAttendance?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusUpdateOptions.map(status => (
                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="remarks">Remarks (Optional)</Label>
                            <Input
                                id="remarks"
                                placeholder="Add remarks..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setStatusDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleStatusUpdate}
                            disabled={!selectedStatus}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Update Status
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Employee Details Dialog - COMPLETE WITH ALL DATA */}
            <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5" />
                            Attendance Details
                        </DialogTitle>
                        <DialogDescription>
                            Complete attendance information for {attendanceDetails?.employeeInfo?.name}
                        </DialogDescription>
                    </DialogHeader>

                    {detailsLoading ? (
                        <div className="flex justify-center items-center p-8">
                            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                            <span className="ml-2 text-gray-600">Loading detailed information...</span>
                        </div>
                    ) : attendanceDetails ? (
                        <div className="space-y-6">
                            {/* Employee Information Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Employee Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <IdCard className="h-4 w-4 text-blue-600" />
                                                <Label>Employee ID</Label>
                                            </div>
                                            <p className="font-medium">{attendanceDetails.employeeInfo.employeeId || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-blue-600" />
                                                <Label>Full Name</Label>
                                            </div>
                                            <p className="font-medium">{attendanceDetails.employeeInfo.name}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-blue-600" />
                                                <Label>Email</Label>
                                            </div>
                                            <p className="font-medium">{attendanceDetails.employeeInfo.email || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-blue-600" />
                                                <Label>Phone</Label>
                                            </div>
                                            <p className="font-medium">{attendanceDetails.employeeInfo.phone || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Building className="h-4 w-4 text-blue-600" />
                                                <Label>Department</Label>
                                            </div>
                                            <p className="font-medium">{attendanceDetails.employeeInfo.department}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-blue-600" />
                                                <Label>Employee Model</Label>
                                            </div>
                                            <p className="font-medium">{attendanceDetails.employeeInfo.employeeModel || 'N/A'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Attendance Timeline */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CalendarDays className="h-5 w-5" />
                                        Attendance Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="font-semibold flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Work Date
                                            </h4>
                                            <p className="text-lg font-medium">
                                                {format(new Date(attendanceDetails.attendanceDetails.date), 'PPPP')}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-semibold flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                Check-In
                                            </h4>
                                            <div className="space-y-2">
                                                <p className="font-medium">
                                                    {formatTime(attendanceDetails.attendanceDetails.workModeOnTime)}
                                                </p>
                                                {attendanceDetails.locationData.workModeOnLocation && (
                                                    <div className="text-sm text-gray-600">
                                                        {attendanceDetails.locationData.workModeOnLocation.address}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-semibold flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                Check-Out
                                            </h4>
                                            <div className="space-y-2">
                                                <p className="font-medium">
                                                    {formatTime(attendanceDetails.attendanceDetails.workModeOffTime)}
                                                </p>
                                                {attendanceDetails.locationData.workModeOffLocation && (
                                                    <div className="text-sm text-gray-600">
                                                        {attendanceDetails.locationData.workModeOffLocation.address}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Duration Summary */}
                                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">Total Duration</p>
                                                <p className="text-2xl font-bold text-blue-700">
                                                    {formatDuration(attendanceDetails.attendanceDetails.totalWorkDuration)}
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">Distance Traveled</p>
                                                <p className="text-2xl font-bold text-green-700">
                                                    {attendanceDetails.travelData.totalDistance || 0} km
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">Status</p>
                                                <Badge className={getStatusColor(attendanceDetails.attendanceDetails.status)}>
                                                    {attendanceDetails.attendanceDetails.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Location Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Check-In Location */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Check-In Location
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {attendanceDetails.locationData.workModeOnLocation ? (
                                            <div className="space-y-4">
                                                {renderCoordinates(
                                                    attendanceDetails.locationData.workModeOnLocation,
                                                    "Coordinates"
                                                )}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-gray-600" />
                                                        <span className="text-sm text-gray-600">Time:</span>
                                                    </div>
                                                    <p className="font-medium">
                                                        {formatTime(attendanceDetails.attendanceDetails.workModeOnTime)}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-center py-4">No location data available</p>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Check-Out Location */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Check-Out Location
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {attendanceDetails.locationData.workModeOffLocation ? (
                                            <div className="space-y-4">
                                                {renderCoordinates(
                                                    attendanceDetails.locationData.workModeOffLocation,
                                                    "Coordinates"
                                                )}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-gray-600" />
                                                        <span className="text-sm text-gray-600">Time:</span>
                                                    </div>
                                                    <p className="font-medium">
                                                        {formatTime(attendanceDetails.attendanceDetails.workModeOffTime)}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-center py-4">No location data available</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Media and Travel Data */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Attendance Image */}
                                {attendanceDetails.mediaData.hasImage && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <ImageIcon className="h-5 w-5" />
                                                Attendance Image
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex justify-center">
                                                <img
                                                    src={attendanceDetails.mediaData.imageURL}
                                                    alt="Attendance proof"
                                                    className="max-w-full h-auto rounded-lg shadow-md max-h-80 object-cover border"
                                                    onError={(e) => {
                                                        e.target.src = '/api/placeholder/400/300';
                                                        e.target.alt = 'Image not available';
                                                    }}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Travel Logs */}
                                {attendanceDetails.travelData.totalLogs > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Navigation className="h-5 w-5" />
                                                Travel Logs ({attendanceDetails.travelData.totalLogs})
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                                {attendanceDetails.travelData.travelLogs.map((log, index) => (
                                                    <div key={index} className="p-3 border rounded-lg bg-gray-50">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                                                Log {index + 1}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {formatTime(log.timestamp)}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                                            <div className="bg-white p-2 rounded">
                                                                <span className="text-gray-600">Lat: </span>
                                                                <span className="font-medium">{log.coordinates.latitude}</span>
                                                            </div>
                                                            <div className="bg-white p-2 rounded">
                                                                <span className="text-gray-600">Lng: </span>
                                                                <span className="font-medium">{log.coordinates.longitude}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* Work Details and Approval */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Work Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            Work Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <Label>Work Type</Label>
                                                <p className="font-medium">{attendanceDetails.attendanceDetails.workType || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <Label>Description</Label>
                                                <p className="font-medium">{attendanceDetails.attendanceDetails.description || 'No description provided'}</p>
                                            </div>
                                            <div>
                                                <Label>Current Status</Label>
                                                <Badge className={getStatusColor(attendanceDetails.attendanceDetails.status)}>
                                                    {attendanceDetails.attendanceDetails.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Approval Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CheckSquare className="h-5 w-5" />
                                            Approval Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {attendanceDetails.approvalData.approvedBy ? (
                                                <>
                                                    <div>
                                                        <Label>Approved By</Label>
                                                        <p className="font-medium">{attendanceDetails.approvalData.approvedBy.name}</p>
                                                        <p className="text-sm text-gray-600">{attendanceDetails.approvalData.approvedBy.email}</p>
                                                    </div>
                                                    <div>
                                                        <Label>Approval Date</Label>
                                                        <p className="font-medium">
                                                            {formatTime(attendanceDetails.approvalData.approvalDate)}
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <XCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-gray-500">Not yet approved</p>
                                                </div>
                                            )}
                                            {attendanceDetails.approvalData.remarks && (
                                                <div>
                                                    <Label>Remarks</Label>
                                                    <p className="font-medium bg-yellow-50 p-2 rounded">
                                                        {attendanceDetails.approvalData.remarks}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* System Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        System Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label>Record Created</Label>
                                            <p className="font-medium">
                                                {formatTime(attendanceDetails.systemData.createdAt)}
                                            </p>
                                        </div>
                                        <div>
                                            <Label>Last Updated</Label>
                                            <p className="font-medium">
                                                {formatTime(attendanceDetails.systemData.updatedAt)}
                                            </p>
                                        </div>
                                        <div>
                                            <Label>Record ID</Label>
                                            <p className="font-medium text-sm font-mono">
                                                {attendanceDetails._id}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p>No details available for this attendance record</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AttendanceDashboard;