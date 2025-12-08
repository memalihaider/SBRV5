'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle, Eye, Edit, Download, Plus, Filter, ChevronLeft, ChevronRight, Users, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

// Firebase imports
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  serverTimestamp,
  query,
  where,
  orderBy 
} from 'firebase/firestore';

interface Employee {
  id: string;
  name: string;
  department: string;
  email: string;
  position: string;
  status: string;
  type: 'employee' | 'manager'; // New field to distinguish
}

interface Attendance {
  id?: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string; // New field: 'Employee' or 'Manager'
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: 'present' | 'late' | 'absent' | 'half_day' | 'on_leave';
  hoursWorked: number;
  location: string;
  breakDuration: number;
  notes: string;
  createdAt: any;
  updatedAt: any;
}

// Calendar Component (same as before)
const AttendanceCalendar = ({ 
  attendance, 
  onDateSelect 
}: { 
  attendance: Attendance[]; 
  onDateSelect: (date: string) => void;
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

  const employees = Array.from(new Set(attendance.map(a => a.employeeName)));

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentDate);

  // Get attendance for a specific date
  const getAttendanceForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    let dateAttendance = attendance.filter(a => a.date === dateString);
    
    if (selectedEmployee !== 'all') {
      dateAttendance = dateAttendance.filter(a => a.employeeName === selectedEmployee);
    }
    
    return dateAttendance;
  };

  // Get status summary for a date
  const getDateStatus = (date: Date) => {
    const dateAttendance = getAttendanceForDate(date);
    
    if (dateAttendance.length === 0) return 'no-data';
    
    const statuses = dateAttendance.map(a => a.status);
    
    if (statuses.every(s => s === 'present')) return 'all-present';
    if (statuses.some(s => s === 'absent')) return 'has-absent';
    if (statuses.some(s => s === 'late')) return 'has-late';
    if (statuses.some(s => s === 'on_leave')) return 'has-leave';
    if (statuses.some(s => s === 'half_day')) return 'has-half-day';
    
    return 'mixed';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'all-present': return 'bg-green-100 border-green-400 text-green-800';
      case 'has-late': return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'has-absent': return 'bg-red-100 border-red-400 text-red-800';
      case 'has-leave': return 'bg-orange-100 border-orange-400 text-orange-800';
      case 'has-half-day': return 'bg-blue-100 border-blue-400 text-blue-800';
      case 'mixed': return 'bg-purple-100 border-purple-400 text-purple-800';
      case 'no-data': return 'bg-gray-100 border-gray-300 text-gray-500';
      default: return 'bg-gray-100 border-gray-300 text-gray-500';
    }
  };

  // Get status tooltip
  const getStatusTooltip = (date: Date) => {
    const dateAttendance = getAttendanceForDate(date);
    
    if (dateAttendance.length === 0) return 'No attendance data';
    
    const statusCount = dateAttendance.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(statusCount)
      .map(([status, count]) => `${count} ${status.replace('_', ' ')}`)
      .join(', ');
  };

  // Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const today = new Date();
  const isToday = (date: Date) => 
    date.getDate() === today.getDate() && 
    date.getMonth() === today.getMonth() && 
    date.getFullYear() === today.getFullYear();

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex space-x-1">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by employee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Employees</SelectItem>
            {employees.map(employee => (
              <SelectItem key={employee} value={employee}>
                {employee}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((date, index) => (
            <div
              key={index}
              className={`min-h-[80px] border-r border-b p-2 ${
                index % 7 === 6 ? 'border-r-0' : ''
              } ${days.length - index <= 7 ? 'border-b-0' : ''}`}
            >
              {date ? (
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`text-sm font-medium ${
                        isToday(date)
                          ? 'bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center'
                          : 'text-gray-900'
                      }`}
                    >
                      {date.getDate()}
                    </span>
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div
                      className={`text-xs p-1 rounded border text-center cursor-pointer hover:opacity-80 ${getStatusColor(
                        getDateStatus(date)
                      )}`}
                      title={getStatusTooltip(date)}
                      onClick={() => onDateSelect(date.toISOString().split('T')[0])}
                    >
                      {getAttendanceForDate(date).length > 0 && (
                        <span className="font-medium">
                          {getAttendanceForDate(date).length}
                        </span>
                      )}
                    </div>
                    
                    {/* Quick status overview */}
                    {getAttendanceForDate(date).length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center">
                        {Array.from(new Set(getAttendanceForDate(date).map(a => a.status))).slice(0, 2).map(status => (
                          <div
                            key={status}
                            className={`w-2 h-2 rounded-full ${
                              status === 'present' ? 'bg-green-500' :
                              status === 'late' ? 'bg-yellow-500' :
                              status === 'absent' ? 'bg-red-500' :
                              status === 'on_leave' ? 'bg-orange-500' :
                              'bg-blue-500'
                            }`}
                            title={status}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 h-full" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-100 border border-green-400 rounded"></div>
          <span>All Present</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-100 border border-yellow-400 rounded"></div>
          <span>Has Late</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-100 border border-red-400 rounded"></div>
          <span>Has Absent</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-orange-100 border border-orange-400 rounded"></div>
          <span>Has Leave</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-100 border border-blue-400 rounded"></div>
          <span>Has Half Day</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
          <span>No Data</span>
        </div>
      </div>
    </div>
  );
};

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    checkInTime: '',
    checkOutTime: '',
    status: 'present' as 'present' | 'late' | 'absent' | 'half_day' | 'on_leave',
    location: '',
    breakDuration: 0,
    notes: ''
  });

  // Add form state
  const [addFormData, setAddFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    checkInTime: '',
    checkOutTime: '',
    status: 'present' as 'present' | 'late' | 'absent' | 'half_day' | 'on_leave',
    location: 'Office',
    breakDuration: 60,
    notes: ''
  });

  // Real-time data states
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [managers, setManagers] = useState<{id: string, name: string}[]>([]);
  const [allPeople, setAllPeople] = useState<Employee[]>([]); // Combined employees + managers
  const [loading, setLoading] = useState(true);

  // Firebase data fetch
  useEffect(() => {
    const unsubscribe = fetchRealTimeData();
    return () => unsubscribe();
  }, []);

  const fetchRealTimeData = () => {
    setLoading(true);

    // Real-time attendance data
    const attendanceUnsubscribe = onSnapshot(
      collection(db, 'attendance'), 
      (snapshot) => {
        const attendanceData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date || '',
          checkInTime: doc.data().checkInTime || '',
          checkOutTime: doc.data().checkOutTime || '',
          hoursWorked: doc.data().hoursWorked || 0,
          breakDuration: doc.data().breakDuration || 0,
          designation: doc.data().designation || 'Employee', // Default to Employee
        })) as Attendance[];
        setAttendance(attendanceData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching attendance:', error);
        toast.error('Failed to load attendance data');
        setLoading(false);
      }
    );

    // Fetch Employees from employeeList collection
    const fetchEmployees = async () => {
      try {
        const employeesSnapshot = await getDocs(collection(db, 'employeeList'));
        const employeesData = employeesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          department: doc.data().department || 'N/A',
          email: doc.data().email || '',
          position: doc.data().position || '',
          status: doc.data().status || 'active',
          type: 'employee' as const
        }));
        setEmployees(employeesData);
        
        // Fetch Managers and combine with employees
        const fetchManagers = async () => {
          try {
            const departmentsSnapshot = await getDocs(collection(db, 'departments'));
            const managersData = departmentsSnapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: `manager_${doc.id}`, // Unique ID for managers
                name: data.head,
                department: data.name || 'Management', // Department name
                email: '',
                position: 'Manager',
                status: 'active',
                type: 'manager' as const
              };
            }).filter(manager => manager.name); // Only include managers with names
            
            setManagers(managersData);
            
            // Combine employees and managers
            const combinedPeople = [...employeesData, ...managersData];
            setAllPeople(combinedPeople);
          } catch (error) {
            console.error('Error fetching managers:', error);
            toast.error('Failed to load managers');
          }
        };

        fetchManagers();
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast.error('Failed to load employees');
      }
    };

    fetchEmployees();

    return attendanceUnsubscribe;
  };

  // Get today's attendance data
  const todayAttendance = attendance.filter(record => {
    return record.date === selectedDate;
  }).filter(record => {
    if (filterStatus === 'all') return true;
    return record.status === filterStatus;
  });

  // Calculate stats PROPERLY - FIXED: Real-time accurate counts
  const totalActiveEmployees = employees.filter(e => e.status === 'active').length;
  const totalManagers = managers.length;
  const totalPeople = totalActiveEmployees + totalManagers;
  
  // Calculate present/absent/late counts separately for employees and managers
  const presentEmployees = todayAttendance.filter(a => 
    a.status === 'present' && a.designation === 'Employee'
  ).length;
  
  const presentManagers = todayAttendance.filter(a => 
    a.status === 'present' && a.designation === 'Manager'
  ).length;
  
  const absentEmployees = todayAttendance.filter(a => 
    a.status === 'absent' && a.designation === 'Employee'
  ).length;
  
  const absentManagers = todayAttendance.filter(a => 
    a.status === 'absent' && a.designation === 'Manager'
  ).length;
  
  const lateEmployees = todayAttendance.filter(a => 
    a.status === 'late' && a.designation === 'Employee'
  ).length;
  
  const lateManagers = todayAttendance.filter(a => 
    a.status === 'late' && a.designation === 'Manager'
  ).length;
  
  const onLeaveEmployees = todayAttendance.filter(a => 
    a.status === 'on_leave' && a.designation === 'Employee'
  ).length;
  
  const onLeaveManagers = todayAttendance.filter(a => 
    a.status === 'on_leave' && a.designation === 'Manager'
  ).length;

  // Total counts for stats - FIXED: Proper calculations
  const totalPresentToday = presentEmployees + presentManagers;
  const totalAbsentToday = absentEmployees + absentManagers;
  const totalLateToday = lateEmployees + lateManagers;
  const totalOnLeaveToday = onLeaveEmployees + onLeaveManagers;

  // Calculate percentages properly
  const presentPercentage = totalPeople > 0 ? Math.round((totalPresentToday / totalPeople) * 100) : 0;
  const absentPercentage = totalPeople > 0 ? Math.round((totalAbsentToday / totalPeople) * 100) : 0;
  const latePercentage = totalPeople > 0 ? Math.round((totalLateToday / totalPeople) * 100) : 0;
  const onLeavePercentage = totalPeople > 0 ? Math.round((totalOnLeaveToday / totalPeople) * 100) : 0;

  const attendanceStats = [
    {
      title: 'Total Staff',
      value: todayAttendance.length.toString(),
      change: '',
          subtitle: `${presentEmployees + presentManagers} Present • ${absentEmployees + absentManagers} Absent`,

      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Present Today',
      value: totalPresentToday.toString(),
      subtitle: `${presentEmployees} Employees • ${presentManagers} Managers`,
      
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Absent Today',
      value: totalAbsentToday.toString(),
      subtitle: `${absentEmployees} Employees • ${absentManagers} Managers`,
     
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Late Arrivals',
      value: totalLateToday.toString(),
      subtitle: `${lateEmployees} Employees • ${lateManagers} Managers`,
     
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'On Leave',
      value: totalOnLeaveToday.toString(),
      subtitle: `${onLeaveEmployees} Employees • ${onLeaveManagers} Managers`,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">Present</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
      case 'half_day':
        return <Badge className="bg-blue-100 text-blue-800">Half Day</Badge>;
      case 'on_leave':
        return <Badge className="bg-orange-100 text-orange-800">On Leave</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getDesignationBadge = (designation: string) => {
    switch (designation) {
      case 'Manager':
        return <Badge className="bg-purple-100 text-purple-800">Manager</Badge>;
      case 'Employee':
      default:
        return <Badge className="bg-blue-100 text-blue-800">Employee</Badge>;
    }
  };

  const handleViewAttendance = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setIsViewDialogOpen(true);
  };

  const handleEditAttendance = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setEditFormData({
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      status: attendance.status,
      location: attendance.location,
      breakDuration: attendance.breakDuration,
      notes: attendance.notes
    });
    setIsEditDialogOpen(true);
  };

  const handleAddAttendance = () => {
    setSelectedEmployee('');
    setAddFormData({
      date: selectedDate,
      checkInTime: '',
      checkOutTime: '',
      status: 'present',
      location: 'Office',
      breakDuration: 60,
      notes: ''
    });
    setIsAddDialogOpen(true);
  };

  const handleExportReport = async () => {
    try {
      // Generate and export attendance report
      const reportData = {
        date: selectedDate,
        totalEmployees: totalActiveEmployees,
        totalManagers,
        present: totalPresentToday,
        absent: totalAbsentToday,
        late: totalLateToday,
        onLeave: totalOnLeaveToday,
        attendanceRecords: todayAttendance
      };
      
      // Simulate export functionality
      console.log('Exporting report:', reportData);
      toast.success('Attendance report exported successfully!');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  const handleViewCalendar = () => {
    setIsCalendarDialogOpen(true);
  };

  const handleCalendarDateSelect = (date: string) => {
    setSelectedDate(date);
    setIsCalendarDialogOpen(false);
    toast.success(`Viewing attendance for ${new Date(date).toLocaleDateString()}`);
  };

  // Calculate hours worked from check-in and check-out times
  const calculateHoursWorked = (checkIn: string, checkOut: string): number => {
    if (!checkIn || !checkOut) return 0;
    
    const [inHours, inMinutes] = checkIn.split(':').map(Number);
    const [outHours, outMinutes] = checkOut.split(':').map(Number);
    
    const checkInTime = new Date();
    checkInTime.setHours(inHours, inMinutes, 0, 0);
    
    const checkOutTime = new Date();
    checkOutTime.setHours(outHours, outMinutes, 0, 0);
    
    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return Math.max(0, diffHours);
  };

  // Handle Save Attendance (Create new)
  const handleSaveAttendance = async () => {
    try {
      if (!selectedEmployee) {
        toast.error('Please select an employee');
        return;
      }

      const person = allPeople.find(p => p.id === selectedEmployee);
      if (!person) {
        toast.error('Selected person not found');
        return;
      }

      const hoursWorked = calculateHoursWorked(addFormData.checkInTime, addFormData.checkOutTime);
      const designation = person.type === 'manager' ? 'Manager' : 'Employee';

      const attendanceData = {
        employeeId: selectedEmployee,
        employeeName: person.name,
        department: person.department,
        designation: designation,
        date: addFormData.date || selectedDate,
        checkInTime: addFormData.checkInTime || '',
        checkOutTime: addFormData.checkOutTime || '',
        status: addFormData.status || 'present',
        hoursWorked: hoursWorked,
        location: addFormData.location || 'Office',
        breakDuration: addFormData.breakDuration || 0,
        notes: addFormData.notes || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'attendance'), attendanceData);
      toast.success('Attendance record added successfully!');
      setIsAddDialogOpen(false);
      setSelectedEmployee('');
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Failed to save attendance record');
    }
  };

  // Handle Update Attendance
  const handleUpdateAttendance = async () => {
    if (!selectedAttendance?.id) return;

    try {
      const hoursWorked = calculateHoursWorked(editFormData.checkInTime, editFormData.checkOutTime);

      const updateData = {
        checkInTime: editFormData.checkInTime,
        checkOutTime: editFormData.checkOutTime,
        status: editFormData.status,
        hoursWorked: hoursWorked,
        location: editFormData.location,
        breakDuration: editFormData.breakDuration || 0,
        notes: editFormData.notes,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(doc(db, 'attendance', selectedAttendance.id), updateData);
      toast.success('Attendance record updated successfully!');
      setIsEditDialogOpen(false);
      setSelectedAttendance(null);
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Failed to update attendance record');
    }
  };

  // Handle Delete Attendance
  const handleDeleteAttendance = async (attendanceId: string) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) return;

    try {
      await deleteDoc(doc(db, 'attendance', attendanceId));
      toast.success('Attendance record deleted successfully!');
    } catch (error) {
      console.error('Error deleting attendance:', error);
      toast.error('Failed to delete attendance record');
    }
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    if (!timeString) return '-';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Attendance Data...</p>
          </div>
        </div>
      )}

      <div className="bg-linear-to-r from-red-600 to-red-700 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white">Attendance Management</h1>
        <p className="text-red-100 mt-1 text-lg">Track employee attendance and working hours</p>
      </div>

      {/* Stats Grid - Now with REAL-TIME accurate counts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {attendanceStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border hover:border-red-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {stat.subtitle}
                </p>
                {stat.change && (
                  <p className="text-xs mt-1">
                    <span className={
                      stat.title === 'Present Today' ? 'text-green-600 font-semibold' :
                      stat.title === 'Absent Today' ? 'text-red-600 font-semibold' :
                      stat.title === 'Late Arrivals' ? 'text-yellow-600 font-semibold' :
                      'text-orange-600 font-semibold'
                    }>
                      {stat.change}
                    </span>
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Rest of the component remains the same */}
      {/* Today's Attendance */}
      <Card className="shadow-lg">
        <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl text-gray-900">
                Attendance for {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                {todayAttendance.length} records found 
              </CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="half_day">Half Day</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={handleViewCalendar}>
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white shadow-md" onClick={handleExportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white shadow-md" onClick={handleAddAttendance}>
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Hours Worked
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {todayAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            record.designation === 'Manager' 
                              ? 'bg-linear-to-br from-purple-400 to-purple-600' 
                              : 'bg-linear-to-br from-red-400 to-red-600'
                          }`}>
                            <span className="text-sm font-semibold text-white">
                              {record.employeeName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {record.employeeName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getDesignationBadge(record.designation)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(record.checkInTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(record.checkOutTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {record.hoursWorked.toFixed(1)}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => handleViewAttendance(record)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => handleEditAttendance(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => record.id && handleDeleteAttendance(record.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {todayAttendance.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium">No attendance records found</p>
                      <p className="text-sm">Add attendance records to see them here</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Attendance Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-white border-2 border-gray-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Attendance Details</DialogTitle>
            <DialogDescription className="text-gray-600">
              View detailed attendance information
            </DialogDescription>
          </DialogHeader>
          {selectedAttendance && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Employee</Label>
                  <p className="text-sm text-gray-900">{selectedAttendance.employeeName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Department</Label>
                  <p className="text-sm text-gray-900">{selectedAttendance.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Designation</Label>
                  <div className="mt-1">
                    {getDesignationBadge(selectedAttendance.designation)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Date</Label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedAttendance.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedAttendance.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Check In</Label>
                  <p className="text-sm text-gray-900">
                    {formatTime(selectedAttendance.checkInTime)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Check Out</Label>
                  <p className="text-sm text-gray-900">
                    {formatTime(selectedAttendance.checkOutTime)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Hours Worked</Label>
                  <p className="text-sm text-gray-900">{selectedAttendance.hoursWorked.toFixed(1)} hours</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Location</Label>
                  <p className="text-sm text-gray-900">{selectedAttendance.location || 'Office'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Break Duration</Label>
                  <p className="text-sm text-gray-900">{selectedAttendance.breakDuration} minutes</p>
                </div>
              </div>
              {selectedAttendance.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Notes</Label>
                  <p className="text-sm text-gray-900 mt-1">{selectedAttendance.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Attendance Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white border-2 border-gray-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Edit Attendance</DialogTitle>
            <DialogDescription className="text-gray-600">
              Update attendance information
            </DialogDescription>
          </DialogHeader>
          {selectedAttendance && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editCheckInTime">Check In Time</Label>
                  <Input
                    id="editCheckInTime"
                    type="time"
                    value={editFormData.checkInTime}
                    onChange={(e) => setEditFormData({...editFormData, checkInTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="editCheckOutTime">Check Out Time</Label>
                  <Input
                    id="editCheckOutTime"
                    type="time"
                    value={editFormData.checkOutTime}
                    onChange={(e) => setEditFormData({...editFormData, checkOutTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="editStatus">Status</Label>
                  <Select 
                    value={editFormData.status} 
                    onValueChange={(value: any) => setEditFormData({...editFormData, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="half_day">Half Day</SelectItem>
                      <SelectItem value="on_leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editLocation">Location</Label>
                  <Input
                    id="editLocation"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                    placeholder="Office/Remote"
                  />
                </div>
                <div>
                  <Label htmlFor="editBreakDuration">Break Duration (minutes)</Label>
                  <Input
                    id="editBreakDuration"
                    type="number"
                    value={editFormData.breakDuration}
                    onChange={(e) => setEditFormData({...editFormData, breakDuration: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editNotes">Notes</Label>
                <Textarea
                  id="editNotes"
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleUpdateAttendance}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Attendance Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-white border-2 border-gray-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Add Attendance Record</DialogTitle>
            <DialogDescription className="text-gray-600">
              Create a new attendance record for employee or manager
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="employee">Select Person *</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee or manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Employees Section */}
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500">Employees</div>
                    {allPeople.filter(p => p.type === 'employee' && p.status === 'active').map(person => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name} - {person.department} (Employee)
                      </SelectItem>
                    ))}
                    
                    {/* Managers Section */}
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 mt-2">Managers</div>
                    {allPeople.filter(p => p.type === 'manager').map(person => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name} - {person.department} (Manager)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={addFormData.date}
                  onChange={(e) => setAddFormData({...addFormData, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={addFormData.status} 
                  onValueChange={(value: any) => setAddFormData({...addFormData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="half_day">Half Day</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="checkInTime">Check In Time</Label>
                <Input 
                  id="checkInTime" 
                  type="time" 
                  value={addFormData.checkInTime}
                  onChange={(e) => setAddFormData({...addFormData, checkInTime: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="checkOutTime">Check Out Time</Label>
                <Input 
                  id="checkOutTime" 
                  type="time" 
                  value={addFormData.checkOutTime}
                  onChange={(e) => setAddFormData({...addFormData, checkOutTime: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  placeholder="Office/Remote" 
                  value={addFormData.location}
                  onChange={(e) => setAddFormData({...addFormData, location: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                <Input 
                  id="breakDuration" 
                  type="number" 
                  placeholder="60" 
                  value={addFormData.breakDuration}
                  onChange={(e) => setAddFormData({...addFormData, breakDuration: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Additional notes..." 
                value={addFormData.notes}
                onChange={(e) => setAddFormData({...addFormData, notes: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleSaveAttendance}
              >
                Add Record
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Calendar View Dialog */}
      <Dialog open={isCalendarDialogOpen} onOpenChange={setIsCalendarDialogOpen}>
        <DialogContent className="bg-white border-2 border-gray-200 max-w-6xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Attendance Calendar</DialogTitle>
            <DialogDescription className="text-gray-600">
              View attendance patterns over time. Click on any date to view attendance for that day.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <AttendanceCalendar 
              attendance={attendance} 
              onDateSelect={handleCalendarDateSelect}
            />
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsCalendarDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}