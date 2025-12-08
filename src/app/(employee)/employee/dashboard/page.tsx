'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth';
import { Calendar, Clock, DollarSign, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { LogTimeDialog } from '@/components/log-time-dialog';
import { RequestLeaveDialog } from '@/components/request-leave-dialog';
import { ViewPayslipDialog } from '@/components/view-payslip-dialog';

export default function EmployeeDashboard() {
  const { user } = useAuthStore();

  const personalStats = [
    {
      title: 'Days Worked This Month',
      value: '18',
      change: '+2 from last month',
      changeType: 'positive' as const,
      icon: Calendar,
    },
    {
      title: 'Hours Logged',
      value: '142.5',
      change: '98% of target',
      changeType: 'positive' as const,
      icon: Clock,
    },
    {
      title: 'Pending Tasks',
      value: '7',
      change: '3 due today',
      changeType: 'warning' as const,
      icon: AlertCircle,
    },
    {
      title: 'Completed Tasks',
      value: '23',
      change: '+15% completion rate',
      changeType: 'positive' as const,
      icon: CheckCircle,
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: 'Complete Project Proposal',
      project: 'Q4 Marketing Campaign',
      dueDate: 'Today',
      priority: 'high',
      status: 'in_progress',
    },
    {
      id: 2,
      title: 'Review Design Mockups',
      project: 'Website Redesign',
      dueDate: 'Tomorrow',
      priority: 'medium',
      status: 'pending',
    },
    {
      id: 3,
      title: 'Client Presentation',
      project: 'Product Launch',
      dueDate: 'Dec 18',
      priority: 'high',
      status: 'pending',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Submitted timesheet',
      details: 'Week of Dec 9-15',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      action: 'Completed task',
      details: 'Database optimization',
      timestamp: '1 day ago',
    },
    {
      id: 3,
      action: 'Updated profile',
      details: 'Emergency contact information',
      timestamp: '3 days ago',
    },
  ];

  const upcomingEvents = [
    { event: 'Team Meeting', date: 'Today, 2:00 PM', type: 'meeting' },
    { event: 'Performance Review', date: 'Dec 20, 10:00 AM', type: 'review' },
    { event: 'Holiday Party', date: 'Dec 20, 6:00 PM', type: 'event' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white">Welcome back, {user?.firstName}!</h1>
        <p className="text-green-100 mt-1 text-lg">Here's your personal dashboard overview</p>
      </div>

      {/* Personal Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {personalStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">
                  {stat.title}
                </CardTitle>
                <div className="p-2 bg-green-100 rounded-lg">
                  <IconComponent className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-sm mt-1">
                  <span
                    className={
                      stat.changeType === 'positive'
                        ? 'text-green-600 font-semibold'
                        : stat.changeType === 'warning'
                        ? 'text-yellow-600 font-semibold'
                        : 'text-red-600 font-semibold'
                    }
                  >
                    {stat.change}
                  </span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">My Tasks</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Current and upcoming assignments
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                      <Badge
                        variant={
                          task.status === 'completed' ? 'default' :
                          task.status === 'in_progress' ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{task.project}</p>
                    <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Recent Activity</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Your latest actions and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-2.5 h-2.5 bg-green-600 rounded-full mt-2 shadow-md"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {activity.details}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Upcoming Events</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Important dates and meetings
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-900">{event.event}</span>
                      <p className="text-xs text-gray-500">{event.date}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      event.type === 'meeting' ? 'default' :
                      event.type === 'review' ? 'secondary' : 'outline'
                    }
                    className="font-semibold"
                  >
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-yellow-50 to-orange-50 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Common employee tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-3">
              <LogTimeDialog>
                <button className="p-4 border-2 border-gray-200 rounded-xl hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Log Time</h3>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Record your work hours for today
                  </p>
                </button>
              </LogTimeDialog>

              <RequestLeaveDialog>
                <button className="p-4 border-2 border-gray-200 rounded-xl hover:bg-linear-to-br hover:from-green-50 hover:to-emerald-50 hover:border-green-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Request Leave</h3>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Submit a leave request
                  </p>
                </button>
              </RequestLeaveDialog>

              <ViewPayslipDialog>
                <button className="p-4 border-2 border-gray-200 rounded-xl hover:bg-linear-to-br hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">View Payslip</h3>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Access your latest payslip
                  </p>
                </button>
              </ViewPayslipDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}