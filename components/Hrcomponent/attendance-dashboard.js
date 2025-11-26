// components/Hrcomponent/attendance-dashboard.js
"use client"

import React, { useState, useEffect } from 'react';
import { format, isFuture } from 'date-fns';
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
    CheckSquare,
    XCircle,
    Eye,
    CalendarOff
} from 'lucide-react';

// Import Components
import SummaryCards from './attendance-components/SummaryCards';
import HolidayBanner from './attendance-components/HolidayBanner';
import AttendanceDetailsModal from './attendance-components/AttendanceDetailsModal';

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

    // Check if selected date is in future
    const isFutureDate = isFuture(new Date(selectedDate));

    // Fetch attendance data
    const fetchAttendanceData = async () => {
        // Don't fetch for future dates
        if (isFutureDate) {
            setAttendanceData([]);
            setSummary({
                totalEmployees: 0,
                present: 0,
                halfDay: 0,
                earlyLeave: 0,
                absent: 0,
                active: 0,
                awaitingApproval: 0,
                holiday: 0,
                presentPercentage: '0.0'
            });
            setIsHoliday(false);
            setHolidayInfo(null);
            return;
        }

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
                setAttendanceData([]);
                setSummary({
                    totalEmployees: 0,
                    present: 0,
                    halfDay: 0,
                    earlyLeave: 0,
                    absent: 0,
                    active: 0,
                    awaitingApproval: 0,
                    holiday: 0,
                    presentPercentage: '0.0'
                });
            }
        } catch (error) {
            console.error('Error fetching attendance data:', error);
            setAttendanceData([]);
            setSummary({
                totalEmployees: 0,
                present: 0,
                halfDay: 0,
                earlyLeave: 0,
                absent: 0,
                active: 0,
                awaitingApproval: 0,
                holiday: 0,
                presentPercentage: '0.0'
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch detailed attendance data
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

    useEffect(() => {
        fetchAttendanceData();
    }, [selectedDate]);

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
                employee.department.toLowerCase().includes(searchLower)
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

    // Enhanced status color with better holiday styling
    const getStatusColor = (status, isHoliday = false) => {
        if (isHoliday) {
            return 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border border-purple-200 shadow-sm';
        }
        
        switch (status) {
            case 'Present': return 'bg-green-100 text-green-800 border border-green-200';
            case 'Active': return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'Half Day': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'Early Leave': return 'bg-orange-100 text-orange-800 border border-orange-200';
            case 'Absent': return 'bg-red-100 text-red-800 border border-red-200';
            case 'AwaitingApproval': return 'bg-purple-100 text-purple-800 border border-purple-200';
            case 'Holiday': return 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border border-purple-200 shadow-sm';
            default: return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    // Future date message component
    const FutureDateMessage = () => (
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarOff className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Future Date Selected
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
                Attendance records are not available for future dates. 
                Please select today's date or a past date to view attendance data.
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Holiday Banner */}
                <HolidayBanner isHoliday={isHoliday} holidayInfo={holidayInfo} />

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
                            <Button onClick={fetchAttendanceData} disabled={loading || isFutureDate}>
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button variant="outline" disabled={isFutureDate}>
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <SummaryCards summary={summary} />

                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </CardTitle>
                        {isFutureDate && (
                            <CardDescription className="text-amber-600 font-medium">
                                Future date selected - Attendance data unavailable
                            </CardDescription>
                        )}
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
                                    max={new Date().toISOString().split('T')[0]} // Disable future dates
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Select value={departmentFilter} onValueChange={setDepartmentFilter} disabled={isFutureDate}>
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
                                <Select value={statusFilter} onValueChange={setStatusFilter} disabled={isFutureDate}>
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
                                        disabled={isFutureDate}
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
                            {!isFutureDate && ` Showing ${filteredData.length} of ${attendanceData.length} employees`}
                            {isHoliday && ' • Holiday Today'}
                            {isFutureDate && ' • Future Date - No Data Available'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center p-8">
                                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                                <span className="ml-2 text-gray-600">Loading attendance data...</span>
                            </div>
                        ) : isFutureDate ? (
                            <FutureDateMessage />
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee Name</TableHead>
                                            <TableHead>Department</TableHead>
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
                                                                <span className="ml-2 text-xs text-purple-600">🎉</span>
                                                            )}
                                                        </button>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium text-gray-900">
                                                            {employee.department}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <Badge className={getStatusColor(employee.status, employee.status === 'Holiday')}>
                                                                {employee.status === 'Holiday' && '🎉 '}
                                                                {employee.status}
                                                                {employee.isActive && employee.status !== 'Holiday' && ' 🔵'}
                                                            </Badge>
                                                            {employee.holidayInfo && (
                                                                <div className="text-xs text-purple-600 font-medium">
                                                                    {employee.holidayInfo.title}
                                                                </div>
                                                            )}
                                                        </div>
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
                                                            {employee.requiresApproval && employee.status !== 'Holiday' && (
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
                                                                disabled={employee.status === 'Holiday'}
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

            {/* Employee Details Dialog */}
            <AttendanceDetailsModal
                detailsDialog={detailsDialog}
                setDetailsDialog={setDetailsDialog}
                detailsLoading={detailsLoading}
                attendanceDetails={attendanceDetails}
                selectedAttendance={selectedAttendance}
                formatTime={formatTime}
                formatDuration={formatDuration}
                getStatusColor={getStatusColor}
            />
        </div>
    );
};

export default AttendanceDashboard;