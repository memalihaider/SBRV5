'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Eye, Edit, CheckCircle, Clock, AlertTriangle, Users, FileText, Target, UserCheck, Settings, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCurrencyStore } from '@/stores/currency';
import mockData from '@/lib/mock-data';
import { OnboardingProcess, OnboardingTemplate, OnboardingTask, OnboardingStatus, OnboardingTaskStatus } from '@/types';
import { toast } from 'sonner';

export default function HROnboardingPage() {
  const { formatAmount } = useCurrencyStore();

  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Dialog states
  const [startOnboardingOpen, setStartOnboardingOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [updateProgressOpen, setUpdateProgressOpen] = useState(false);
  const [editTemplateOpen, setEditTemplateOpen] = useState(false);
  const [manageTemplatesOpen, setManageTemplatesOpen] = useState(false);
  const [assignMentorsOpen, setAssignMentorsOpen] = useState(false);

  // Selected items
  const [selectedProcess, setSelectedProcess] = useState<OnboardingProcess | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<OnboardingTemplate | null>(null);

  // Form states
  const [newOnboardingForm, setNewOnboardingForm] = useState({
    employeeId: '',
    employeeName: '',
    position: '',
    department: '',
    templateId: '',
    mentorId: '',
    startDate: new Date(),
  });

  const [taskUpdateForm, setTaskUpdateForm] = useState({
    taskId: '',
    status: 'completed' as OnboardingTaskStatus,
    notes: '',
  });

  // Mock data
  const processes = mockData.processes;
  const templates = mockData.templates;

  // Filtered processes
  const filteredProcesses = useMemo(() => {
    return processes.filter((process: any) => {
      const matchesSearch = process.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          process.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          process.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || process.status === statusFilter;
      const matchesDepartment = departmentFilter === 'all' || process.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [processes, searchTerm, statusFilter, departmentFilter]);

  // Statistics
  const stats = useMemo(() => {
    const active = processes.filter((p: any) => ['not-started', 'in-progress', 'almost-complete'].includes(p.status)).length;
    const completed = processes.filter((p: any) => p.status === 'completed').length;
    const overdueTasks = mockData.getOverdueTasks().length;
    const avgCompletion = processes.length > 0 ?
      Math.round(processes.reduce((sum: number, p: any) => sum + p.progress, 0) / processes.length) : 0;

    return { active, completed, overdueTasks, avgCompletion };
  }, [processes]);

  // Status badge component
  const StatusBadge = ({ status }: { status: OnboardingStatus }) => {
    const variants = {
      'not-started': 'secondary',
      'in-progress': 'default',
      'almost-complete': 'outline',
      'completed': 'default',
      'on-hold': 'secondary',
      'cancelled': 'destructive'
    } as const;

    const labels = {
      'not-started': 'Not Started',
      'in-progress': 'In Progress',
      'almost-complete': 'Almost Complete',
      'completed': 'Completed',
      'on-hold': 'On Hold',
      'cancelled': 'Cancelled'
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status]}
      </Badge>
    );
  };

  // Task status badge
  const TaskStatusBadge = ({ status }: { status: OnboardingTaskStatus }) => {
    const variants = {
      'pending': 'secondary',
      'in-progress': 'default',
      'completed': 'default',
      'overdue': 'destructive',
      'cancelled': 'outline'
    } as const;

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Priority badge
  const PriorityBadge = ({ priority }: { priority: string }) => {
    const colors = {
      'low': 'text-green-600',
      'medium': 'text-yellow-600',
      'high': 'text-orange-600',
      'urgent': 'text-red-600'
    };

    return (
      <Badge variant="outline" className={colors[priority as keyof typeof colors] || 'text-gray-600'}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  // Handle start new onboarding
  const handleStartOnboarding = () => {
    // In a real app, this would make an API call
    toast.success('New onboarding process started successfully!');
    setStartOnboardingOpen(false);
    setNewOnboardingForm({
      employeeId: '',
      employeeName: '',
      position: '',
      department: '',
      templateId: '',
      mentorId: '',
      startDate: new Date(),
    });
  };

  // Handle task completion
  const handleTaskCompletion = (processId: string, taskId: string) => {
    // In a real app, this would make an API call
    toast.success('Task marked as completed!');
  };

  // Handle view details
  const handleViewDetails = (process: OnboardingProcess) => {
    setSelectedProcess(process);
    setViewDetailsOpen(true);
  };

  // Handle update progress
  const handleUpdateProgress = (process: OnboardingProcess) => {
    setSelectedProcess(process);
    setUpdateProgressOpen(true);
  };

  // Handle edit template
  const handleEditTemplate = (template: OnboardingTemplate) => {
    setSelectedTemplate(template);
    setEditTemplateOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Employee Onboarding</h1>
          <p className="text-muted-foreground">Manage employee onboarding processes and templates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setManageTemplatesOpen(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Manage Templates
          </Button>
          <Button variant="outline" onClick={() => setAssignMentorsOpen(true)}>
            <Users className="w-4 h-4 mr-2" />
            Assign Mentors
          </Button>
          <Button onClick={() => setStartOnboardingOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Start New Onboarding
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Onboardings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueTasks}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgCompletion}%</div>
            <p className="text-xs text-muted-foreground">Across all processes</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="processes">Onboarding Processes</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest onboarding activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {processes.slice(0, 5).map((process: any) => (
                    <div key={process.id} className="flex items-center space-x-4">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{process.employeeName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{process.employeeName}</p>
                        <p className="text-xs text-muted-foreground">
                          {process.status === 'completed' ? 'Completed onboarding' : `Progress: ${process.progress}%`}
                        </p>
                      </div>
                      <StatusBadge status={process.status} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Tasks due in the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {processes.flatMap((process: any) =>
                    process.tasks
                      .filter((task: any) => task.status !== 'completed' && task.dueDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
                      .slice(0, 5)
                      .map((task: any) => (
                        <div key={task.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{task.title}</p>
                            <p className="text-xs text-muted-foreground">{process.employeeName}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <PriorityBadge priority={task.priority} />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTaskCompletion(process.id, task.id)}
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Processes Tab */}
        <TabsContent value="processes" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search employees, positions, or departments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="almost-complete">Almost Complete</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {Array.from(new Set(processes.map((p: any) => p.department))).map((dept) => (
                      <SelectItem key={dept as string} value={dept as string}>{dept as string}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Processes List */}
          <div className="grid gap-4">
            {filteredProcesses.map((process: any) => (
              <Card key={process.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{process.employeeName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{process.employeeName}</h3>
                        <p className="text-sm text-muted-foreground">{process.position} • {process.department}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusBadge status={process.status} />
                          <span className="text-sm text-muted-foreground">
                            Started {format(process.startDate, 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold">{process.progress}%</div>
                        <Progress value={process.progress} className="w-24" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {process.completedTasks}/{process.totalTasks} tasks
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(process)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateProgress(process)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template: any) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {template.name}
                    <Badge variant="outline">{template.department}</Badge>
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Duration:</span>
                      <span>{template.duration} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tasks:</span>
                      <span>{template.tasks.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Used:</span>
                      <span>{template.usageCount} times</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Start New Onboarding Dialog */}
      <Dialog open={startOnboardingOpen} onOpenChange={setStartOnboardingOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Start New Onboarding Process</DialogTitle>
            <DialogDescription>
              Create a new onboarding process for a new employee
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeName">Employee Name</Label>
                <Input
                  id="employeeName"
                  value={newOnboardingForm.employeeName}
                  onChange={(e) => setNewOnboardingForm(prev => ({ ...prev, employeeName: e.target.value }))}
                  placeholder="Enter employee name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={newOnboardingForm.employeeId}
                  onChange={(e) => setNewOnboardingForm(prev => ({ ...prev, employeeId: e.target.value }))}
                  placeholder="Enter employee ID"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={newOnboardingForm.position}
                  onChange={(e) => setNewOnboardingForm(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="Enter position"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={newOnboardingForm.department} onValueChange={(value) => setNewOnboardingForm(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(new Set(templates.map((t: any) => t.department))).map((dept) => (
                      <SelectItem key={dept as string} value={dept as string}>{dept as string}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template">Onboarding Template</Label>
                <Select value={newOnboardingForm.templateId} onValueChange={(value) => setNewOnboardingForm(prev => ({ ...prev, templateId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.filter((t: any) => !newOnboardingForm.department || t.department === newOnboardingForm.department).map((template: any) => (
                      <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mentor">Mentor (Optional)</Label>
                <Input
                  id="mentor"
                  value={newOnboardingForm.mentorId}
                  onChange={(e) => setNewOnboardingForm(prev => ({ ...prev, mentorId: e.target.value }))}
                  placeholder="Enter mentor name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newOnboardingForm.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newOnboardingForm.startDate ? format(newOnboardingForm.startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newOnboardingForm.startDate}
                    onSelect={(date) => date && setNewOnboardingForm(prev => ({ ...prev, startDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setStartOnboardingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStartOnboarding}>
              Start Onboarding
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Onboarding Details - {selectedProcess?.employeeName}</DialogTitle>
            <DialogDescription>
              Complete overview of the onboarding process
            </DialogDescription>
          </DialogHeader>
          {selectedProcess && (
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Process Overview */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <div className="mt-1">
                          <StatusBadge status={selectedProcess.status} />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Progress</Label>
                        <div className="mt-1">
                          <div className="text-2xl font-bold">{selectedProcess.progress}%</div>
                          <Progress value={selectedProcess.progress} className="mt-2" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Start Date</Label>
                        <div className="mt-1 text-sm">
                          {format(selectedProcess.startDate, 'MMM dd, yyyy')}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Expected End</Label>
                        <div className="mt-1 text-sm">
                          {format(selectedProcess.expectedEndDate, 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                    {selectedProcess.mentorName && (
                      <div className="mt-4">
                        <Label className="text-sm font-medium">Mentor</Label>
                        <div className="mt-1 flex items-center gap-2">
                          <UserCheck className="w-4 h-4" />
                          <span>{selectedProcess.mentorName}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle>Onboarding Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedProcess.tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{task.title}</h4>
                              <TaskStatusBadge status={task.status} />
                              <PriorityBadge priority={task.priority} />
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Due: {format(task.dueDate, 'MMM dd, yyyy')}</span>
                              <span>Category: {task.category}</span>
                            </div>
                          </div>
                          {task.status !== 'completed' && (
                            <Button
                              size="sm"
                              onClick={() => handleTaskCompletion(selectedProcess.id, task.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Complete
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Feedback */}
                {selectedProcess.feedback && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Completion Feedback</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label>Employee Rating</Label>
                          <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={i < selectedProcess.feedback!.employeeRating ? 'text-yellow-400' : 'text-gray-300'}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label>Mentor Rating</Label>
                          <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={i < selectedProcess.feedback!.mentorRating ? 'text-yellow-400' : 'text-gray-300'}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>Comments</Label>
                        <p className="mt-1 text-sm">{selectedProcess.feedback.comments}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Progress Dialog */}
      <Dialog open={updateProgressOpen} onOpenChange={setUpdateProgressOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Onboarding Progress</DialogTitle>
            <DialogDescription>
              Update the progress of tasks for {selectedProcess?.employeeName}
            </DialogDescription>
          </DialogHeader>
          {selectedProcess && (
            <div className="space-y-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedProcess.tasks.map((task) => (
                  <Card key={task.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <TaskStatusBadge status={task.status} />
                            <PriorityBadge priority={task.priority} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select defaultValue={task.status}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="overdue">Overdue</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="outline">
                            Update
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setUpdateProgressOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success('Progress updated successfully!');
                  setUpdateProgressOpen(false);
                }}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={editTemplateOpen} onOpenChange={setEditTemplateOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Edit Onboarding Template</DialogTitle>
            <DialogDescription>
              Modify the tasks and settings for this onboarding template
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="templateName">Template Name</Label>
                    <Input id="templateName" defaultValue={selectedTemplate.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (days)</Label>
                    <Input id="duration" type="number" defaultValue={selectedTemplate.duration} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" defaultValue={selectedTemplate.description} />
                </div>

                <div>
                  <Label className="text-base font-medium">Tasks</Label>
                  <div className="space-y-4 mt-4">
                    {selectedTemplate.tasks.map((task, index) => (
                      <Card key={task.id}>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Task Title</Label>
                              <Input defaultValue={task.title} />
                            </div>
                            <div className="space-y-2">
                              <Label>Priority</Label>
                              <Select defaultValue={task.priority}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label>Description</Label>
                              <Textarea defaultValue={task.description} />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox defaultChecked={task.isRequired} />
                              <Label>Required Task</Label>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setEditTemplateOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    toast.success('Template updated successfully!');
                    setEditTemplateOpen(false);
                  }}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Manage Templates Dialog */}
      <Dialog open={manageTemplatesOpen} onOpenChange={setManageTemplatesOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Onboarding Templates</DialogTitle>
            <DialogDescription>
              Create, edit, or deactivate onboarding templates
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Available Templates</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Template
              </Button>
            </div>
            <div className="space-y-2">
              {templates.map((template: any) => (
                <Card key={template.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{template.tasks.length} tasks</span>
                          <span>{template.duration} days</span>
                          <span>Used {template.usageCount} times</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Mentors Dialog */}
      <Dialog open={assignMentorsOpen} onOpenChange={setAssignMentorsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Mentors</DialogTitle>
            <DialogDescription>
              Assign mentors to employees who need guidance during onboarding
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {processes.filter((p: any) => !p.mentorId).map((process: any) => (
                <Card key={process.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{process.employeeName}</h4>
                        <p className="text-sm text-muted-foreground">{process.position} • {process.department}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusBadge status={process.status} />
                          <span className="text-xs text-muted-foreground">
                            Progress: {process.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select mentor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mentor1">Sarah Johnson</SelectItem>
                            <SelectItem value="mentor2">Mike Davis</SelectItem>
                            <SelectItem value="mentor3">Emily Brown</SelectItem>
                            <SelectItem value="mentor4">David Wilson</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="sm">
                          Assign
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setAssignMentorsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}