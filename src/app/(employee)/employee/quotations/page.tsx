"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, DollarSign, Clock, CheckCircle, AlertTriangle, Eye, Download, MessageSquare, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

import EmployeeQuotationFormDialog from '@/components/employee-quotation-form-dialog';
import QuotationDetailsDialog from '@/components/quotation-details-dialog';

export default function EmployeeQuotationsPage() {
  const quotationStats = [
    {
      title: 'Active Quotations',
      value: '12',
      change: '+3',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Value',
      value: '$245K',
      change: '+15%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pending Approval',
      value: '5',
      change: '-2',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Approved This Month',
      value: '8',
      change: '+4',
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const [activeQuotations, setActiveQuotations] = useState([
    {
      id: 1,
      title: 'Website Redesign Project',
      client: 'TechCorp Solutions',
      value: 45000,
      status: 'approved',
      submittedDate: '2024-11-25',
      validUntil: '2024-12-25',
      progress: 100,
      priority: 'high',
      assignedTo: 'Sarah Johnson',
    },
    {
      id: 2,
      title: 'Mobile App Development',
      client: 'StartupXYZ',
      value: 75000,
      status: 'pending-approval',
      submittedDate: '2024-11-28',
      validUntil: '2024-12-28',
      progress: 75,
      priority: 'high',
      assignedTo: 'Mike Chen',
    },
    {
      id: 3,
      title: 'E-commerce Platform',
      client: 'RetailPlus Inc',
      value: 120000,
      status: 'draft',
      submittedDate: '2024-11-30',
      validUntil: '2025-01-30',
      progress: 45,
      priority: 'medium',
      assignedTo: 'Lisa Rodriguez',
    },
    {
      id: 4,
      title: 'Data Analytics Dashboard',
      client: 'DataCorp',
      value: 35000,
      status: 'rejected',
      submittedDate: '2024-11-20',
      validUntil: '2024-12-20',
      progress: 0,
      priority: 'medium',
      assignedTo: 'David Kim',
    },
  ]);

  const [quotationTemplates, setQuotationTemplates] = useState([
    {
      id: 1,
      name: 'Web Development Standard',
      description: 'Standard quotation template for web development projects',
      lastUsed: '2024-11-25',
      usageCount: 15,
      items: [
        { id: 'tpl-1-i1', description: 'Website development', qty: 1, unitPrice: 45000, discount: 0, tax: 5 },
      ],
    },
    {
      id: 2,
      name: 'Mobile App Premium',
      description: 'Premium template for mobile application development',
      lastUsed: '2024-11-28',
      usageCount: 8,
      items: [
        { id: 'tpl-2-i1', description: 'Mobile app development', qty: 1, unitPrice: 75000, discount: 0, tax: 5 },
      ],
    },
    {
      id: 3,
      name: 'Consulting Services',
      description: 'Template for consulting and advisory services',
      lastUsed: '2024-11-15',
      usageCount: 12,
      items: [
        { id: 'tpl-3-i1', description: 'Consulting (per day)', qty: 10, unitPrice: 1000, discount: 0, tax: 0 },
      ],
    },
  ]);

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      action: 'Quotation Approved',
      quotation: 'Website Redesign Project',
      client: 'TechCorp Solutions',
      timestamp: '2024-12-01 10:30',
      value: 45000,
      type: 'approval',
    },
    {
      id: 2,
      action: 'New Quotation Submitted',
      quotation: 'Mobile App Development',
      client: 'StartupXYZ',
      timestamp: '2024-11-28 14:15',
      value: 75000,
      type: 'submission',
    },
    {
      id: 3,
      action: 'Quotation Rejected',
      quotation: 'Data Analytics Dashboard',
      client: 'DataCorp',
      timestamp: '2024-11-27 09:45',
      value: 35000,
      type: 'rejection',
    },
    {
      id: 4,
      action: 'Template Updated',
      quotation: 'Web Development Standard',
      client: 'System',
      timestamp: '2024-11-26 16:20',
      value: 0,
      type: 'update',
    },
  ]);

  const [upcomingDeadlines, setUpcomingDeadlines] = useState([
    {
      id: 1,
      quotation: 'Mobile App Development',
      client: 'StartupXYZ',
      deadline: '2024-12-28',
      daysLeft: 3,
      status: 'urgent',
    },
    {
      id: 2,
      quotation: 'E-commerce Platform',
      client: 'RetailPlus Inc',
      deadline: '2025-01-30',
      daysLeft: 35,
      status: 'normal',
    },
    {
      id: 3,
      quotation: 'Website Redesign Project',
      client: 'TechCorp Solutions',
      deadline: '2024-12-25',
      daysLeft: 0,
      status: 'expired',
    },
  ]);

  const handleCreateQuotation = (q: any) => {
    setActiveQuotations((prev) => [
      { id: q.id, title: q.title, client: q.client, value: q.totalAmount, status: q.status, submittedDate: q.submittedDate, validUntil: q.validUntil, progress: 0, priority: 'medium', assignedTo: 'You' },
      ...prev,
    ]);
    setRecentActivities((prev) => [
      { id: Date.now(), action: 'New Quotation Created', quotation: q.title, client: q.client, timestamp: new Date().toISOString(), value: q.totalAmount, type: 'submission' },
      ...prev,
    ]);
    toast.success('Quotation created');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending-approval':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
      case 'draft':
        return <Badge className="bg-blue-100 text-blue-800">Draft</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
      case 'normal':
        return <Badge className="bg-blue-100 text-blue-800">Normal</Badge>;
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-800">Expired</Badge>;
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

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'submission':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'rejection':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'update':
        return <TrendingUp className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-red-600 to-red-700 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white">My Quotations</h1>
        <p className="text-red-100 mt-1 text-lg">Manage your project quotations, track approvals, and monitor client responses</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quotationStats.map((stat, index) => {
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
        {/* Active Quotations */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Active Quotations</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Quotations you're currently working on
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {activeQuotations.map((quotation) => (
                <div key={quotation.id} className="p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <FileText className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {quotation.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {quotation.client} • ${quotation.value.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(quotation.priority)}
                      {getStatusBadge(quotation.status)}
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">{quotation.progress}%</span>
                    </div>
                    <Progress value={quotation.progress} className="h-2" />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-3">
                    <span>Submitted: {new Date(quotation.submittedDate).toLocaleDateString()}</span>
                    <span>Valid until: {new Date(quotation.validUntil).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <QuotationDetailsDialog quotation={{ id: quotation.id, title: quotation.title, client: quotation.client, items: [{ id: 'i-1', description: quotation.title, qty: 1, unitPrice: quotation.value, discount: 0, tax: 0 }], totalAmount: quotation.value, status: quotation.status, submittedDate: quotation.submittedDate, validUntil: quotation.validUntil }}>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </QuotationDetailsDialog>
                    <Button onClick={() => {
                      const blob = new Blob([`Quotation: ${quotation.title}\nClient: ${quotation.client}\nTotal: $${quotation.value}`], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${quotation.title.replace(/\s+/g, '_')}_quotation.txt`;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                    }} variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button onClick={() => toast('Open comments (mock)')} variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Comments
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quotation Templates */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Quotation Templates</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Reusable templates for quick quotation creation
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {quotationTemplates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {template.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {template.description}
                        </p>
                        <p className="text-xs text-gray-400">
                          Last used: {new Date(template.lastUsed).toLocaleDateString()} • Used {template.usageCount} times
                        </p>
                      </div>
                    </div>
                  </div>
                    <div className="flex items-center space-x-2">
                    <EmployeeQuotationFormDialog templates={quotationTemplates} initialTemplateId={template.id} onCreate={handleCreateQuotation}>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                        Use Template
                      </Button>
                    </EmployeeQuotationFormDialog>
                    <Button onClick={() => toast('Edit template (mock)')} variant="outline" size="sm" className="text-gray-600 border-gray-300 hover:bg-gray-50">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Recent Activities</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Latest quotation updates and actions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getActivityTypeIcon(activity.type)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.quotation} • {activity.client}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(activity.timestamp).toLocaleString()}
                          {activity.value > 0 && ` • $${activity.value.toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-amber-50 to-orange-50 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Upcoming Deadlines</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Quotation validity periods approaching
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {deadline.quotation}
                        </p>
                        <p className="text-xs text-gray-500">
                          {deadline.client}
                        </p>
                        <p className="text-xs text-gray-400">
                          Expires: {new Date(deadline.deadline).toLocaleDateString()} • {deadline.daysLeft} days left
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(deadline.status)}
                    {deadline.daysLeft <= 7 && deadline.daysLeft > 0 && (
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                        Extend
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader className="bg-linear-to-r from-emerald-50 to-green-50 rounded-t-lg">
          <CardTitle className="text-xl text-gray-900">Quotation Actions</CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Common quotation management tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EmployeeQuotationFormDialog templates={quotationTemplates} onCreate={handleCreateQuotation}>
            <Button className="p-5 border-2 border-emerald-200 rounded-xl hover:bg-linear-to-br hover:from-emerald-50 hover:to-green-50 hover:border-emerald-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Create New Quotation</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Start a new quotation from scratch or template
              </p>
            </Button>
            </EmployeeQuotationFormDialog>
            <Button className="p-5 border-2 border-blue-200 rounded-xl hover:bg-linear-to-br hover:from-blue-50 hover:to-cyan-50 hover:border-blue-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">View Analytics</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Analyze quotation performance and trends
              </p>
            </Button>
            <Button className="p-5 border-2 border-purple-200 rounded-xl hover:bg-linear-to-br hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Client Communication</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Send follow-ups and negotiate terms
              </p>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}