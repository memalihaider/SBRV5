"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FolderOpen, Users, Clock, CheckCircle, AlertTriangle, Calendar, Eye, Edit, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

import ProjectDetailsDialog from '@/components/project-details-dialog';
import ProjectUpdatesDialog from '@/components/project-updates-dialog';
import EditTaskDialog from '@/components/edit-task-dialog';

export default function EmployeeProjectsPage() {
  const projectStats = [
    {
      title: 'Active Projects',
      value: '8',
      change: '+2',
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Team Members',
      value: '24',
      change: '+3',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Tasks Completed',
      value: '156',
      change: '+12',
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Upcoming Deadlines',
      value: '5',
      change: '-1',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  const [activeProjects, setActiveProjects] = useState([
    {
      id: 1,
      name: 'Mobile App Redesign',
      description: 'Complete UI/UX overhaul of the company mobile application',
      progress: 75,
      status: 'in-progress',
      dueDate: '2024-12-20',
      teamSize: 6,
      priority: 'high',
      manager: 'Sarah Johnson',
    },
    {
      id: 2,
      name: 'CRM Integration',
      description: 'Integrate new CRM system with existing tools',
      progress: 60,
      status: 'in-progress',
      dueDate: '2024-12-15',
      teamSize: 4,
      priority: 'high',
      manager: 'Mike Chen',
    },
    {
      id: 3,
      name: 'Data Analytics Dashboard',
      description: 'Build comprehensive analytics dashboard for management',
      progress: 45,
      status: 'in-progress',
      dueDate: '2025-01-10',
      teamSize: 5,
      priority: 'medium',
      manager: 'Lisa Rodriguez',
    },
    {
      id: 4,
      name: 'Security Audit',
      description: 'Comprehensive security assessment and improvements',
      progress: 90,
      status: 'almost-complete',
      dueDate: '2024-12-05',
      teamSize: 3,
      priority: 'high',
      manager: 'David Kim',
    },
  ]);

  const [myTasks, setMyTasks] = useState([
    {
      id: 1,
      project: 'Mobile App Redesign',
      task: 'Design user authentication flow',
      status: 'completed',
      dueDate: '2024-11-30',
      priority: 'high',
    },
    {
      id: 2,
      project: 'CRM Integration',
      task: 'API documentation review',
      status: 'in-progress',
      dueDate: '2024-12-05',
      priority: 'medium',
    },
    {
      id: 3,
      project: 'Data Analytics Dashboard',
      task: 'Create wireframes for dashboard',
      status: 'pending',
      dueDate: '2024-12-08',
      priority: 'medium',
    },
    {
      id: 4,
      project: 'Security Audit',
      task: 'Review access control policies',
      status: 'completed',
      dueDate: '2024-12-01',
      priority: 'high',
    },
  ]);

  const upcomingMilestones = [
    {
      id: 1,
      project: 'Mobile App Redesign',
      milestone: 'Beta Release',
      dueDate: '2024-12-10',
      status: 'upcoming',
    },
    {
      id: 2,
      project: 'CRM Integration',
      milestone: 'System Testing',
      dueDate: '2024-12-12',
      status: 'upcoming',
    },
    {
      id: 3,
      project: 'Data Analytics Dashboard',
      milestone: 'Data Model Completion',
      dueDate: '2024-12-15',
      status: 'upcoming',
    },
  ];

  const [projectUpdates, setProjectUpdates] = useState([
    {
      id: 1,
      project: 'Mobile App Redesign',
      update: 'UI mockups approved by design team',
      author: 'Sarah Johnson',
      timestamp: '2024-12-01 14:30',
      type: 'approval',
    },
    {
      id: 2,
      project: 'CRM Integration',
      update: 'API endpoints successfully tested',
      author: 'Mike Chen',
      timestamp: '2024-11-30 11:15',
      type: 'progress',
    },
    {
      id: 3,
      project: 'Data Analytics Dashboard',
      update: 'New requirement added for real-time updates',
      author: 'Lisa Rodriguez',
      timestamp: '2024-11-29 16:45',
      type: 'change',
    },
  ]);

  const handleTaskSave = (updatedTask: typeof myTasks[number]) => {
    setMyTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'almost-complete':
        return <Badge className="bg-green-100 text-green-800">Almost Complete</Badge>;
      case 'completed':
        return <Badge className="bg-purple-100 text-purple-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'upcoming':
        return <Badge className="bg-indigo-100 text-indigo-800">Upcoming</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low Priority</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getUpdateTypeIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'progress':
        return <AlertTriangle className="h-4 w-4 text-blue-600" />;
      case 'change':
        return <MessageSquare className="h-4 w-4 text-yellow-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-red-600 to-red-700 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white">My Projects</h1>
        <p className="text-red-100 mt-1 text-lg">Track your project assignments, tasks, and team collaboration</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projectStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-red-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                  <IconComponent className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-sm mt-1">
                  <span
                    className={
                      stat.change.startsWith('+') && !stat.change.includes('-')
                        ? 'text-green-600 font-semibold'
                        : stat.change.startsWith('-')
                        ? 'text-red-600 font-semibold'
                        : 'text-gray-600 font-semibold'
                    }
                  >
                    {stat.change}
                  </span>{' '}
                  <span className="text-gray-500">from last month</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Active Projects</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Projects you're currently assigned to
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <div key={project.id} className="p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <FolderOpen className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {project.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Manager: {project.manager} • {project.teamSize} members
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(project.priority)}
                      {getStatusBadge(project.status)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{project.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                      <span>{project.teamSize} team members</span>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3 space-x-2">
                    <ProjectDetailsDialog project={project}>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </ProjectDetailsDialog>
                    <ProjectUpdatesDialog updates={projectUpdates.filter((u) => u.project === project.name)}>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Updates
                      </Button>
                    </ProjectUpdatesDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Tasks */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">My Tasks</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Your assigned tasks across all projects
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {myTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {task.task}
                        </p>
                        <p className="text-xs text-gray-500">
                          {task.project} • Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getPriorityBadge(task.priority)}
                    {getStatusBadge(task.status)}
                    <EditTaskDialog task={task} onSave={handleTaskSave}>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                        <Edit className="h-4 w-4 mr-1" />
                        Update
                      </Button>
                    </EditTaskDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Milestones & Project Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Milestones */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-amber-50 to-orange-50 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Upcoming Milestones</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Important project deadlines approaching
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {upcomingMilestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {milestone.milestone}
                        </p>
                        <p className="text-xs text-gray-500">
                          {milestone.project}
                        </p>
                        <p className="text-xs text-gray-400">
                          Due: {new Date(milestone.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(milestone.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Updates */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Recent Updates</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Latest project news and changes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {projectUpdates.map((update) => (
                <div key={update.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getUpdateTypeIcon(update.type)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {update.project}
                        </p>
                        <p className="text-xs text-gray-500">
                          {update.update}
                        </p>
                        <p className="text-xs text-gray-400">
                          {update.author} • {new Date(update.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ProjectUpdatesDialog updates={projectUpdates.filter((u) => u.project === update.project)}>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </ProjectUpdatesDialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader className="bg-linear-to-r from-cyan-50 to-blue-50 rounded-t-lg">
          <CardTitle className="text-xl text-gray-900">Project Actions</CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Common project management tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => toast('Opening project list (mock)')} className="p-5 border-2 border-cyan-200 rounded-xl hover:bg-linear-to-br hover:from-cyan-50 hover:to-blue-50 hover:border-cyan-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-cyan-100 rounded-lg group-hover:bg-cyan-200 transition-colors">
                  <FolderOpen className="h-5 w-5 text-cyan-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">View All Projects</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Browse complete project portfolio
              </p>
            </Button>
            <Button onClick={() => toast('Open task manager (mock)')} className="p-5 border-2 border-green-200 rounded-xl hover:bg-linear-to-br hover:from-green-50 hover:to-emerald-50 hover:border-green-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Update Tasks</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Mark tasks complete and update progress
              </p>
            </Button>
            <Button onClick={() => toast('Open team chat (mock)')} className="p-5 border-2 border-purple-200 rounded-xl hover:bg-linear-to-br hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Team Communication</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Connect with project team members
              </p>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}