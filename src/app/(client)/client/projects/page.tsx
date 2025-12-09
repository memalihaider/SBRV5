"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import AddClientProjectDialog from '@/components/add-client-project-dialog';
import ClientProjectDetailsDialog from '@/components/client-project-details-dialog';

export default function ClientProjectsPage() {
  const projectsInitial = [
    {
      id: 1,
      name: 'Smart Office Building Installation',
      status: 'in_progress',
      progress: 85,
      startDate: '2024-08-15',
      completionDate: '2024-11-15',
      value: '$450,000',
      manager: 'John Wilson',
    },
    {
      id: 2,
      name: 'Data Center Electrical Setup',
      status: 'completed',
      progress: 100,
      startDate: '2024-06-01',
      completionDate: '2024-09-30',
      value: '$280,000',
      manager: 'Sarah Chen',
    },
    {
      id: 3,
      name: 'Warehouse Lighting Upgrade',
      status: 'planning',
      progress: 15,
      startDate: '2024-10-01',
      completionDate: '2024-12-15',
      value: '$125,000',
      manager: 'Mike Anderson',
    },
  ];

  const recentInvoices = [
    { id: 'INV-2024-156', project: 'Smart Office Building', amount: '$90,000', status: 'paid', date: '2024-10-01' },
    { id: 'INV-2024-157', project: 'Smart Office Building', amount: '$85,000', status: 'pending', date: '2024-10-20' },
    { id: 'INV-2024-155', project: 'Data Center Setup', amount: '$280,000', status: 'paid', date: '2024-09-25' },
  ];

  const supportTickets = [
    { id: 'TKT-145', subject: 'Progress report request', status: 'open', priority: 'medium', date: '2024-10-22' },
    { id: 'TKT-142', subject: 'Invoice inquiry', status: 'resolved', priority: 'low', date: '2024-10-18' },
    { id: 'TKT-139', subject: 'Site access coordination', status: 'in_progress', priority: 'high', date: '2024-10-15' },
  ];

  const [projects, setProjects] = useState(projectsInitial);

  const handleCreate = (project: any) => {
    setProjects((p) => [project, ...p]);
  };

  const handleDelete = (projectId: number) => {
    setProjects((p) => p.filter((x) => x.id !== projectId));
    alert('Project deleted (mock).');
  };

  const handleEdit = (projectId: number) => {
    // simple mock edit: toggle status/progress for demo
    setProjects((p) =>
      p.map((proj) =>
        proj.id === projectId
          ? { ...proj, status: proj.status === 'completed' ? 'in_progress' : 'completed', progress: proj.status === 'completed' ? 50 : 100 }
          : proj
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white">Welcome to Your Portal</h1>
        <p className="text-indigo-100 mt-1 text-lg">Track projects, invoices, and support tickets</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-indigo-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Active Projects</CardTitle>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Briefcase className="h-5 w-5 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">2</div>
            <p className="text-sm text-gray-500 mt-1">In progress</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Completed</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">1</div>
            <p className="text-sm text-gray-500 mt-1">Finished projects</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Pending Invoices</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FileText className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">$85K</div>
            <p className="text-sm text-gray-500 mt-1">Outstanding</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Support Tickets</CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">2</div>
            <p className="text-sm text-gray-500 mt-1">Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Section */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
          <CardTitle className="text-xl text-gray-900">Your Projects</CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Current and completed projects
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="p-4 rounded-lg hover:bg-gray-50 transition-colors border-2 border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-base">{project.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">Project Manager: {project.manager}</p>
                  </div>
                  <Badge
                    variant={
                      project.status === 'completed' ? 'default' :
                      project.status === 'in_progress' ? 'secondary' : 'outline'
                    }
                    className="font-semibold"
                  >
                    {project.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="text-sm font-semibold text-gray-900">{project.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Completion Date</p>
                    <p className="text-sm font-semibold text-gray-900">{project.completionDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Project Value</p>
                    <p className="text-sm font-semibold text-gray-900">{project.value}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        project.status === 'completed' ? 'bg-green-500' :
                        project.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-3">
                  <ClientProjectDetailsDialog project={project} onEdit={() => handleEdit(project.id)} onDelete={() => handleDelete(project.id)}>
                    <button className="px-3 py-1 text-sm border rounded-md">View Details</button>
                  </ClientProjectDetailsDialog>
                  <button
                    className="px-3 py-1 text-sm border rounded-md"
                    onClick={() => {
                      const report = `Project: ${project.name}\nManager: ${project.manager}\nValue: ${project.value}\nProgress: ${project.progress}%`;
                      const blob = new Blob([report], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${project.name.replace(/\s+/g, '_')}_report.txt`;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download Report
                  </button>
                  <button
                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md"
                    onClick={() => window.location.href = `mailto:${project.manager.replace(' ', '.').toLowerCase()}@example.com?subject=Project%20${encodeURIComponent(project.name)}`}
                  >
                    Contact Manager
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Recent Invoices</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Your billing history
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-bold text-gray-900">{invoice.id}</p>
                      <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                        {invoice.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{invoice.project}</p>
                    <p className="text-xs text-gray-500 mt-1">{invoice.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{invoice.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support Tickets */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Support Tickets</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Your recent inquiries
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <div key={ticket.id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-gray-900">{ticket.id}</p>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          ticket.status === 'resolved' ? 'default' :
                          ticket.status === 'in_progress' ? 'secondary' : 'outline'
                        }
                      >
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge
                        variant={
                          ticket.priority === 'high' ? 'destructive' :
                          ticket.priority === 'medium' ? 'secondary' : 'outline'
                        }
                      >
                        {ticket.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{ticket.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">{ticket.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
