'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import mockData from '@/lib/mock-data';

interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  assignedTo: string;
  assigneeName: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: Date;
  createdDate: Date;
  completedDate?: Date;
  estimatedHours: number;
  actualHours?: number;
}

export default function TasksPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in_progress' | 'review' | 'done'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Mock tasks data - properly assigned to team members
  const tasks: Task[] = mockData.projects.flatMap((project, projIdx) => 
    Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, taskIdx) => {
      const statuses: ('todo' | 'in_progress' | 'review' | 'done')[] = ['todo', 'in_progress', 'review', 'done'];
      const priorities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Assign task to a random team member from the project
      const assignedMemberId = project.teamMembers[Math.floor(Math.random() * project.teamMembers.length)];
      const assignedEmployee = mockData.employees.find(e => e.id === assignedMemberId);
      
      return {
        id: `TASK-${projIdx}-${taskIdx}`,
        title: `Design ${['Circuit', 'Firmware', 'Testing', 'Documentation', 'Integration'][Math.floor(Math.random() * 5)]} for ${project.name}`,
        description: `Complete ${['schematic design', 'code development', 'validation testing', 'technical documentation', 'system integration'][Math.floor(Math.random() * 5)]} for project ${project.name}`,
        projectId: project.id,
        projectName: project.name,
        assignedTo: assignedMemberId || 'unassigned',
        assigneeName: assignedEmployee ? `${assignedEmployee.firstName} ${assignedEmployee.lastName}` : 'Unassigned',
        status,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        createdDate: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
        completedDate: status === 'done' ? new Date() : undefined,
        estimatedHours: Math.floor(Math.random() * 40) + 8,
        actualHours: status === 'done' ? Math.floor(Math.random() * 50) + 5 : undefined,
      };
    })
  );

  const getFilteredTasks = () => {
    let filtered = tasks;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.projectName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const reviewTasks = tasks.filter(t => t.status === 'review').length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;

  const handleNewTask = () => {
    router.push('/project/tasks/new');
  };

  const handleViewTask = (taskId: string) => {
    router.push(`/project/tasks/${taskId}`);
  };

  const handleEditTask = (taskId: string) => {
    router.push(`/project/tasks/${taskId}`);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      todo: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      review: 'bg-yellow-100 text-yellow-800',
      done: 'bg-green-100 text-green-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };
    return badges[priority] || 'bg-gray-100 text-gray-800';
  };

  const KanbanColumn = ({ status, title, tasks: columnTasks }: { status: string; title: string; tasks: Task[] }) => (
    <div className="flex-1 min-w-[280px]">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            <Badge className={getStatusBadge(status)}>{columnTasks.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
          {columnTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-sm line-clamp-2">{task.title}</h4>
                  <Badge className={getPriorityBadge(task.priority)} >
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="line-clamp-1">{task.projectName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Due: {task.dueDate.toLocaleDateString()}</span>
                  <span className="text-gray-500">{task.estimatedHours}h</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {columnTasks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No tasks</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage project tasks and assignments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="text-xs"
            >
              List
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              onClick={() => setViewMode('kanban')}
              className="text-xs"
            >
              Kanban
            </Button>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleNewTask}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">To Do</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{todoTasks}</div>
            <p className="text-sm text-gray-500 mt-1">Pending tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{inProgressTasks}</div>
            <p className="text-sm text-gray-500 mt-1">Active work</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">In Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{reviewTasks}</div>
            <p className="text-sm text-gray-500 mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{doneTasks}</div>
            <p className="text-sm text-gray-500 mt-1">Done</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search tasks by title, description, or project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button variant={filterStatus === 'all' ? 'default' : 'outline'} onClick={() => setFilterStatus('all')}>
                All
              </Button>
              <Button variant={filterStatus === 'todo' ? 'default' : 'outline'} onClick={() => setFilterStatus('todo')}>
                To Do
              </Button>
              <Button variant={filterStatus === 'in_progress' ? 'default' : 'outline'} onClick={() => setFilterStatus('in_progress')}>
                In Progress
              </Button>
              <Button variant={filterStatus === 'review' ? 'default' : 'outline'} onClick={() => setFilterStatus('review')}>
                Review
              </Button>
              <Button variant={filterStatus === 'done' ? 'default' : 'outline'} onClick={() => setFilterStatus('done')}>
                Done
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          <KanbanColumn 
            status="todo" 
            title="To Do" 
            tasks={filteredTasks.filter(t => t.status === 'todo')} 
          />
          <KanbanColumn 
            status="in_progress" 
            title="In Progress" 
            tasks={filteredTasks.filter(t => t.status === 'in_progress')} 
          />
          <KanbanColumn 
            status="review" 
            title="Review" 
            tasks={filteredTasks.filter(t => t.status === 'review')} 
          />
          <KanbanColumn 
            status="done" 
            title="Done" 
            tasks={filteredTasks.filter(t => t.status === 'done')} 
          />
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card>
          <CardHeader>
            <CardTitle>Task List ({filteredTasks.length} tasks)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 w-8"></th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Task</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Project</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Priority</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Due Date</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Hours</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Checkbox checked={task.status === 'done'} />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{task.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{task.description}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">{task.projectName}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={getPriorityBadge(task.priority)}>
                          {task.priority.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={getStatusBadge(task.status)}>
                          {task.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">{task.dueDate.toLocaleDateString()}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm text-gray-700">
                          {task.actualHours || task.estimatedHours}h
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewTask(task.id)}>View</Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditTask(task.id)}>Edit</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className="text-lg font-medium">No tasks found</p>
                <p className="text-sm">Try adjusting your filters or search term</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
