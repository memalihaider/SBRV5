'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import mockData from '@/lib/mock-data';

interface TimelineEvent {
  id: string;
  projectId: string;
  projectName: string;
  type: 'milestone' | 'task' | 'phase' | 'deadline';
  title: string;
  description: string;
  date: Date;
  status: 'completed' | 'in_progress' | 'upcoming' | 'overdue';
  isCompleted: boolean;
  completedDate?: Date;
}

export default function TimelinePage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'all' | 'month' | 'quarter'>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');

  const handleAddMilestone = () => {
    router.push('/project/timeline/new');
  };

  const handleViewEvent = (event: TimelineEvent) => {
    if (event.type === 'milestone') {
      // Navigate to project detail page where milestones are shown
      router.push(`/project/projects/${event.projectId}`);
    } else if (event.type === 'task') {
      // Navigate to task detail page
      router.push(`/project/tasks/${event.id}`);
    } else {
      // For phases and deadlines, navigate to project detail
      router.push(`/project/projects/${event.projectId}`);
    }
  };

  const handleEditEvent = (event: TimelineEvent) => {
    if (event.type === 'milestone') {
      // Navigate to project edit page
      router.push(`/project/projects/${event.projectId}/edit`);
    } else if (event.type === 'task') {
      // Navigate to task edit page (assuming we have one)
      router.push(`/project/tasks/${event.id}/edit`);
    } else {
      // For phases and deadlines, navigate to project edit
      router.push(`/project/projects/${event.projectId}/edit`);
    }
  };

  // Generate timeline events from projects
  const timelineEvents: TimelineEvent[] = mockData.projects.flatMap((project) => {
    const events: TimelineEvent[] = [];

    // Add project start
    events.push({
      id: `${project.id}-start`,
      projectId: project.id,
      projectName: project.name,
      type: 'phase',
      title: 'Development Start',
      description: `Kickoff for ${project.name} development`,
      date: new Date(project.startDate),
      status: new Date(project.startDate) > new Date() ? 'upcoming' : 'completed',
      isCompleted: new Date(project.startDate) <= new Date(),
      completedDate: new Date(project.startDate) <= new Date() ? new Date(project.startDate) : undefined,
    });

    // Add milestones
    project.milestones.forEach((milestone, idx) => {
      const milestoneDate = new Date(milestone.dueDate);
      const now = new Date();
      let status: 'completed' | 'in_progress' | 'upcoming' | 'overdue';
      
      if (milestone.isCompleted) {
        status = 'completed';
      } else if (milestoneDate < now) {
        status = 'overdue';
      } else if (milestoneDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
        status = 'in_progress';
      } else {
        status = 'upcoming';
      }

      events.push({
        id: `${project.id}-milestone-${idx}`,
        projectId: project.id,
        projectName: project.name,
        type: 'milestone',
        title: milestone.name,
        description: milestone.description,
        date: milestoneDate,
        status,
        isCompleted: milestone.isCompleted,
        completedDate: milestone.completedDate ? new Date(milestone.completedDate) : undefined,
      });
    });

    // Add project end
    events.push({
      id: `${project.id}-end`,
      projectId: project.id,
      projectName: project.name,
      type: 'deadline',
      title: 'Launch Deadline',
      description: `Expected launch for ${project.name}`,
      date: new Date(project.endDate),
      status: project.status === 'completed' ? 'completed' : new Date(project.endDate) < new Date() ? 'overdue' : 'upcoming',
      isCompleted: project.status === 'completed',
      completedDate: project.status === 'completed' ? new Date(project.endDate) : undefined,
    });

    return events;
  });

  // Sort by date
  timelineEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Filter events
  const getFilteredEvents = () => {
    let filtered = timelineEvents;

    if (selectedProject !== 'all') {
      filtered = filtered.filter(e => e.projectId === selectedProject);
    }

    const now = new Date();
    if (viewMode === 'month') {
      const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(e => e.date >= now && e.date <= oneMonthFromNow);
    } else if (viewMode === 'quarter') {
      const threeMonthsFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(e => e.date >= now && e.date <= threeMonthsFromNow);
    }

    return filtered;
  };

  const filteredEvents = getFilteredEvents();
  const upcomingMilestones = timelineEvents.filter(e => e.type === 'milestone' && e.status === 'upcoming').length;
  const overdueMilestones = timelineEvents.filter(e => e.type === 'milestone' && e.status === 'overdue').length;
  const completedMilestones = timelineEvents.filter(e => e.type === 'milestone' && e.isCompleted).length;

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      upcoming: 'bg-gray-100 text-gray-800',
      overdue: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactElement> = {
      milestone: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      task: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      phase: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      deadline: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
    return icons[type] || icons.milestone;
  };

  // Group events by month
  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const monthYear = event.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(event);
    return groups;
  }, {} as Record<string, TimelineEvent[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Development Timeline</h1>
          <p className="text-gray-600 mt-1">Product development milestones and deadlines</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Projects</option>
            {mockData.projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleAddMilestone}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Milestone
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Development Phases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {timelineEvents.filter(e => e.type === 'milestone').length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Across all products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{upcomingMilestones}</div>
            <p className="text-sm text-gray-500 mt-1">Due soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{overdueMilestones}</div>
            <p className="text-sm text-gray-500 mt-1">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{completedMilestones}</div>
            <p className="text-sm text-gray-500 mt-1">Launched</p>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button variant={viewMode === 'all' ? 'default' : 'outline'} onClick={() => setViewMode('all')}>
              All Events
            </Button>
            <Button variant={viewMode === 'month' ? 'default' : 'outline'} onClick={() => setViewMode('month')}>
              Next 30 Days
            </Button>
            <Button variant={viewMode === 'quarter' ? 'default' : 'outline'} onClick={() => setViewMode('quarter')}>
              Next Quarter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-8">
        {Object.entries(groupedEvents).map(([monthYear, events]) => (
          <div key={monthYear}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 sticky top-0 bg-white py-2 z-10">
              {monthYear}
            </h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              {/* Events */}
              <div className="space-y-6">
                {events.map((event, idx) => (
                  <div key={event.id} className="relative pl-16">
                    {/* Timeline dot */}
                    <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      event.isCompleted
                        ? 'bg-green-100 text-green-600'
                        : event.status === 'overdue'
                        ? 'bg-red-100 text-red-600'
                        : event.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getTypeIcon(event.type)}
                    </div>

                    {/* Event card */}
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg text-gray-900">{event.title}</h3>
                              <Badge className={getStatusBadge(event.status)}>
                                {event.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {event.type.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span>{event.projectName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{event.date.toLocaleDateString()}</span>
                              </div>
                              {event.completedDate && (
                                <div className="flex items-center gap-2 text-green-600">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>Completed {event.completedDate.toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button size="sm" variant="outline" onClick={() => handleViewEvent(event)}>View</Button>
                            {!event.isCompleted && (
                              <Button size="sm" variant="outline" onClick={() => handleEditEvent(event)}>Edit</Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium">No events found</p>
            <p className="text-sm">Try adjusting your filters or date range</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
