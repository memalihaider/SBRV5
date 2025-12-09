'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import mockData from '@/lib/mock-data';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
  skills: string[];
  currentProjects: number;
  totalCapacity: number;
  allocatedHours: number;
  availability: 'available' | 'partial' | 'full' | 'overloaded';
  projectAssignments: {
    projectId: string;
    projectName: string;
    role: string;
    allocatedHours: number;
    startDate: Date;
    endDate: Date;
  }[];
  avatar?: string;
}

export default function ResourcesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'available' | 'partial' | 'full' | 'overloaded'>('all');

  const handleAddResource = () => {
    router.push('/project/resources/new');
  };

  const handleViewProfile = (resourceId: string) => {
    router.push(`/project/resources/${resourceId}`);
  };

  const handleAssignResource = (resourceId: string) => {
    // Navigate to resource profile with assignment modal open
    router.push(`/project/resources/${resourceId}?action=assign`);
  };

  // Generate mock team members
  const teamMembers: TeamMember[] = Array.from({ length: 20 }, (_, i) => {
    const roles = ['Project Manager', 'Developer', 'Designer', 'QA Engineer', 'Business Analyst', 'DevOps Engineer'];
    const departments = ['Engineering', 'Design', 'QA', 'Operations', 'Management'];
    const skillSets = [
      ['React', 'TypeScript', 'Node.js'],
      ['UI/UX', 'Figma', 'Photoshop'],
      ['Testing', 'Automation', 'Selenium'],
      ['AWS', 'Docker', 'Kubernetes'],
      ['Project Planning', 'Agile', 'Scrum'],
    ];
    
    const totalCapacity = 40;
    const allocatedHours = Math.floor(Math.random() * 60);
    const utilizationRate = (allocatedHours / totalCapacity) * 100;
    
    let availability: 'available' | 'partial' | 'full' | 'overloaded';
    if (utilizationRate < 50) availability = 'available';
    else if (utilizationRate < 80) availability = 'partial';
    else if (utilizationRate <= 100) availability = 'full';
    else availability = 'overloaded';

    const projectAssignments = mockData.projects
      .slice(0, Math.floor(Math.random() * 3) + 1)
      .map(project => ({
        projectId: project.id,
        projectName: project.name,
        role: roles[Math.floor(Math.random() * roles.length)],
        allocatedHours: Math.floor(Math.random() * 20) + 5,
        startDate: new Date(project.startDate),
        endDate: new Date(project.endDate),
      }));

    return {
      id: `TM-${i + 1}`,
      name: `Team Member ${i + 1}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      email: `member${i + 1}@company.com`,
      department: departments[Math.floor(Math.random() * departments.length)],
      skills: skillSets[Math.floor(Math.random() * skillSets.length)],
      currentProjects: projectAssignments.length,
      totalCapacity,
      allocatedHours,
      availability,
      projectAssignments,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + i}?w=100&h=100&fit=crop&crop=face`,
    };
  });

  const getFilteredMembers = () => {
    let filtered = teamMembers;

    if (filterAvailability !== 'all') {
      filtered = filtered.filter(m => m.availability === filterAvailability);
    }

    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const filteredMembers = getFilteredMembers();
  const availableMembers = teamMembers.filter(m => m.availability === 'available').length;
  const totalUtilization = Math.round(
    (teamMembers.reduce((sum, m) => sum + m.allocatedHours, 0) / 
     teamMembers.reduce((sum, m) => sum + m.totalCapacity, 0)) * 100
  );
  const activeResources = teamMembers.filter(m => m.currentProjects > 0).length;

  const getAvailabilityBadge = (availability: string) => {
    const badges: Record<string, string> = {
      available: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      full: 'bg-orange-100 text-orange-800',
      overloaded: 'bg-red-100 text-red-800',
    };
    return badges[availability] || 'bg-gray-100 text-gray-800';
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization < 50) return 'bg-green-500';
    if (utilization < 80) return 'bg-yellow-500';
    if (utilization <= 100) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-600 mt-1">Team members and resource allocation</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleAddResource}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Resource
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{teamMembers.length}</div>
            <p className="text-sm text-gray-500 mt-1">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{availableMembers}</div>
            <p className="text-sm text-gray-500 mt-1">Under 50% utilization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{totalUtilization}%</div>
            <p className="text-sm text-gray-500 mt-1">Overall capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active on Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{activeResources}</div>
            <p className="text-sm text-gray-500 mt-1">Currently assigned</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, role, department, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button variant={filterAvailability === 'all' ? 'default' : 'outline'} onClick={() => setFilterAvailability('all')}>
                All
              </Button>
              <Button variant={filterAvailability === 'available' ? 'default' : 'outline'} onClick={() => setFilterAvailability('available')}>
                Available
              </Button>
              <Button variant={filterAvailability === 'partial' ? 'default' : 'outline'} onClick={() => setFilterAvailability('partial')}>
                Partial
              </Button>
              <Button variant={filterAvailability === 'full' ? 'default' : 'outline'} onClick={() => setFilterAvailability('full')}>
                Full
              </Button>
              <Button variant={filterAvailability === 'overloaded' ? 'default' : 'outline'} onClick={() => setFilterAvailability('overloaded')}>
                Overloaded
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMembers.map((member) => {
          const utilizationRate = Math.round((member.allocatedHours / member.totalCapacity) * 100);
          
          return (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 bg-purple-600 text-white">
                      {member.avatar ? (
                        <AvatarImage src={member.avatar} alt={member.name} />
                      ) : null}
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                  <Badge className={getAvailabilityBadge(member.availability)}>
                    {member.availability.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{member.department}</span>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Utilization */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">Capacity Utilization</p>
                    <span className="text-sm font-semibold text-gray-900">{utilizationRate}%</span>
                  </div>
                  <Progress value={Math.min(utilizationRate, 100)} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {member.allocatedHours}h / {member.totalCapacity}h per week
                  </p>
                </div>

                {/* Project Assignments */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Current Projects ({member.currentProjects})
                  </p>
                  {member.projectAssignments.length > 0 ? (
                    <div className="space-y-2">
                      {member.projectAssignments.map((assignment) => (
                        <div key={assignment.projectId} className="bg-gray-50 rounded-lg p-3 text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-gray-900">{assignment.projectName}</p>
                            <span className="text-xs text-gray-500">{assignment.allocatedHours}h/week</span>
                          </div>
                          <p className="text-xs text-gray-600">{assignment.role}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {assignment.startDate.toLocaleDateString()} - {assignment.endDate.toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3 text-center">
                      No active assignments
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleViewProfile(member.id)}>View Profile</Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleAssignResource(member.id)}>Assign</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-lg font-medium">No resources found</p>
            <p className="text-sm">Try adjusting your filters or search term</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
