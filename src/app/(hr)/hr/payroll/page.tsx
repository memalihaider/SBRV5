'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { CurrencySelector } from '@/components/ui/currency-selector';
import { useCurrencyStore } from '@/stores/currency';
import mockData from '@/lib/mock-data';
import { Payroll } from '@/types';
import { DollarSign, Users, Clock, CheckCircle, AlertTriangle, Calculator, Plus, Eye, Edit, Download, CalendarIcon, FileText, TrendingUp, Award, UserCheck, X, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function HRPayrollPage() {
  const { formatAmount } = useCurrencyStore();

  // State management
  const [activeTab, setActiveTab] = useState('overview');

  // Dialog states
  const [processPayrollOpen, setProcessPayrollOpen] = useState(false);
  const [manageBonusesOpen, setManageBonusesOpen] = useState(false);
  const [employeeCompensationOpen, setEmployeeCompensationOpen] = useState(false);
  const [payrollDetailsOpen, setPayrollDetailsOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);

  // Form states
  const [processPayrollForm, setProcessPayrollForm] = useState({
    period: {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    },
    paymentDate: new Date(),
    paymentMethod: 'Direct Deposit',
    includeBonuses: true,
    includeOvertime: true,
    notes: '',
  });

  const [bonusForm, setBonusForm] = useState({
    employeeId: '',
    employeeName: '',
    type: 'performance',
    amount: 0,
    description: '',
    effectiveDate: new Date(),
  });

  const [compensationForm, setCompensationForm] = useState({
    employeeId: '',
    employeeName: '',
    currentSalary: 0,
    newSalary: 0,
    effectiveDate: new Date(),
    reason: '',
    notes: '',
  });

  // Mock data
  const payrolls = mockData.payrolls;
  const employees = mockData.employees;

  // Convert static amounts to numbers for currency conversion
  const payrollStats = [
    {
      title: 'Total Payroll This Month',
      value: 284750,
      change: '+8.2%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Employees Paid',
      value: '142',
      change: '+2',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Approvals',
      value: '8',
      change: '-3',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Payroll Errors',
      value: '0',
      change: '-100%',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  const recentPayrolls = [
    {
      id: 1,
      period: 'November 2024',
      status: 'completed',
      totalAmount: 284750,
      employees: 142,
      processedDate: '2024-12-01',
      paymentMethod: 'Direct Deposit',
    },
    {
      id: 2,
      period: 'October 2024',
      status: 'completed',
      totalAmount: 263420,
      employees: 140,
      processedDate: '2024-11-01',
      paymentMethod: 'Direct Deposit',
    },
    {
      id: 3,
      period: 'December 2024',
      status: 'processing',
      totalAmount: 291850,
      employees: 142,
      processedDate: '2024-12-15',
      paymentMethod: 'Direct Deposit',
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      employee: 'Alice Johnson',
      type: 'Overtime Request',
      amount: 450,
      date: '2024-12-10',
      status: 'pending',
      description: 'Weekend project work',
    },
    {
      id: 2,
      employee: 'Bob Smith',
      type: 'Bonus Payment',
      amount: 2500,
      date: '2024-12-08',
      status: 'pending',
      description: 'Q4 performance bonus',
    },
    {
      id: 3,
      employee: 'Carol Davis',
      type: 'Salary Adjustment',
      amount: 1200,
      date: '2024-12-05',
      status: 'pending',
      description: 'Annual salary increase',
    },
  ];

  const salaryStructure = [
    {
      level: 'Entry Level',
      employees: 45,
      avgSalary: 55000,
      range: { min: 45000, max: 65000 },
    },
    {
      level: 'Mid Level',
      employees: 67,
      avgSalary: 75000,
      range: { min: 65000, max: 85000 },
    },
    {
      level: 'Senior Level',
      employees: 23,
      avgSalary: 105000,
      range: { min: 90000, max: 120000 },
    },
    {
      level: 'Executive',
      employees: 7,
      avgSalary: 150000,
      range: { min: 130000, max: 180000 },
    },
  ];

  // Filtered data
  const filteredPayrolls = useMemo(() => {
    return payrolls.filter(payroll => {
      // Add any filtering logic here if needed
      return true;
    });
  }, [payrolls]);

  // Status badge components
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  // Handle functions
  const handleProcessPayroll = () => {
    toast.success('Payroll processing started successfully!');
    setProcessPayrollOpen(false);
    // Reset form
    setProcessPayrollForm({
      period: {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      },
      paymentDate: new Date(),
      paymentMethod: 'Direct Deposit',
      includeBonuses: true,
      includeOvertime: true,
      notes: '',
    });
  };

  const handleManageBonus = () => {
    toast.success('Bonus added successfully!');
    setManageBonusesOpen(false);
    setBonusForm({
      employeeId: '',
      employeeName: '',
      type: 'performance',
      amount: 0,
      description: '',
      effectiveDate: new Date(),
    });
  };

  const handleEmployeeCompensation = () => {
    toast.success('Salary adjustment processed successfully!');
    setEmployeeCompensationOpen(false);
    setCompensationForm({
      employeeId: '',
      employeeName: '',
      currentSalary: 0,
      newSalary: 0,
      effectiveDate: new Date(),
      reason: '',
      notes: '',
    });
  };

  const handleViewPayrollDetails = (payroll: any) => {
    setSelectedPayroll(payroll);
    setPayrollDetailsOpen(true);
  };

  const handleApproveRequest = (requestId: number) => {
    toast.success('Request approved successfully!');
  };

  const handleRejectRequest = (requestId: number) => {
    toast.success('Request rejected successfully!');
  };

  const handleExportReport = () => {
    toast.success('Report exported successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-green-600 to-green-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Payroll Management</h1>
            <p className="text-green-100 mt-1 text-lg">Process salaries, bonuses, and employee compensation</p>
          </div>
          <CurrencySelector />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {payrollStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                  <IconComponent className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{typeof stat.value === 'number' ? formatAmount(stat.value) : stat.value}</div>
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payrolls">Payroll History</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="compensation">Compensation</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Payrolls */}
            <Card className="shadow-lg">
              <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl text-gray-900">Recent Payrolls</CardTitle>
                    <CardDescription className="text-gray-600 font-medium">
                      Payroll processing history and status
                    </CardDescription>
                  </div>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                    onClick={() => setProcessPayrollOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Process New Payroll
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {recentPayrolls.map((payroll) => (
                    <div key={payroll.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {payroll.period}
                            </p>
                            <p className="text-xs text-gray-500">
                              {payroll.employees} employees • {payroll.paymentMethod}
                            </p>
                            <p className="text-xs text-gray-400">
                              Processed: {new Date(payroll.processedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{formatAmount(payroll.totalAmount)}</p>
                          {getStatusBadge(payroll.status)}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-300 hover:bg-green-50"
                          onClick={() => handleViewPayrollDetails(payroll)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card className="shadow-lg">
              <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <CardTitle className="text-xl text-gray-900">Pending Approvals</CardTitle>
                <CardDescription className="text-gray-600 font-medium">
                  Compensation changes requiring approval
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div key={approval.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {approval.employee}
                            </p>
                            <p className="text-xs text-gray-500">
                              {approval.type} • {approval.description}
                            </p>
                            <p className="text-xs text-gray-400">
                              Requested: {new Date(approval.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{formatAmount(approval.amount)}</p>
                          {getApprovalBadge(approval.status)}
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-300 hover:bg-green-50"
                            onClick={() => handleApproveRequest(approval.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            onClick={() => handleRejectRequest(approval.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Salary Structure */}
          <Card className="shadow-lg">
            <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 rounded-t-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl text-gray-900">Salary Structure</CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    Compensation levels and employee distribution
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  className="text-green-600 border-green-300 hover:bg-green-50"
                  onClick={handleExportReport}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {salaryStructure.map((level, index) => (
                  <div key={index} className="p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">{level.level}</h3>
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        {level.employees} emp
                      </Badge>
                    </div>
                    <p className="text-lg font-bold text-gray-900 mb-1">{formatAmount(level.avgSalary)}</p>
                    <p className="text-xs text-gray-500">{formatAmount(level.range.min)} - {formatAmount(level.range.max)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg">
            <CardHeader className="bg-linear-to-r from-green-50 to-emerald-50 rounded-t-lg">
              <CardTitle className="text-xl text-gray-900">Payroll Actions</CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                Common payroll management tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  className="p-5 border-2 border-green-200 rounded-xl hover:bg-linear-to-br hover:from-green-50 hover:to-emerald-50 hover:border-green-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl"
                  onClick={() => setProcessPayrollOpen(true)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <Calculator className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Process Payroll</h3>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Run monthly payroll processing
                  </p>
                </Button>
                <Button
                  className="p-5 border-2 border-blue-200 rounded-xl hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl"
                  onClick={() => setManageBonusesOpen(true)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Award className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Manage Bonuses</h3>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Handle bonus payments and adjustments
                  </p>
                </Button>
                <Button
                  className="p-5 border-2 border-purple-200 rounded-xl hover:bg-linear-to-br hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl"
                  onClick={() => setEmployeeCompensationOpen(true)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <UserCheck className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Employee Compensation</h3>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Review and adjust employee salaries
                  </p>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payroll History Tab */}
        <TabsContent value="payrolls" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>Complete history of all payroll processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPayrolls.map((payroll: any) => (
                  <div key={payroll.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {format(payroll.period.startDate, 'MMMM yyyy')}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {payroll.paymentMethod} • {payroll.status}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold">{formatAmount(payroll.netPay)}</p>
                        <p className="text-sm text-muted-foreground">
                          {payroll.status === 'paid' ? `Paid ${format(payroll.paymentDate || new Date(), 'MMM dd')}` : 'Pending'}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPayrollDetails(payroll)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Review and approve compensation changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((approval) => (
                  <Card key={approval.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{approval.employee}</h4>
                          <p className="text-sm text-muted-foreground">{approval.type}</p>
                          <p className="text-sm">{approval.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Requested: {format(new Date(approval.date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold">{formatAmount(approval.amount)}</p>
                            {getApprovalBadge(approval.status)}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveRequest(approval.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => handleRejectRequest(approval.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compensation Tab */}
        <TabsContent value="compensation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Salary Adjustments</CardTitle>
                <CardDescription>Manage employee salary changes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => setEmployeeCompensationOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Salary Adjustment
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bonus Management</CardTitle>
                <CardDescription>Handle performance bonuses and incentives</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => setManageBonusesOpen(true)}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Add New Bonus
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Process Payroll Dialog */}
      <Dialog open={processPayrollOpen} onOpenChange={setProcessPayrollOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Process New Payroll</DialogTitle>
            <DialogDescription>
              Configure and process payroll for the selected period
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payroll Period Start</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !processPayrollForm.period.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {processPayrollForm.period.startDate ? format(processPayrollForm.period.startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={processPayrollForm.period.startDate}
                      onSelect={(date) => date && setProcessPayrollForm(prev => ({
                        ...prev,
                        period: { ...prev.period, startDate: date }
                      }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Payroll Period End</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !processPayrollForm.period.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {processPayrollForm.period.endDate ? format(processPayrollForm.period.endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={processPayrollForm.period.endDate}
                      onSelect={(date) => date && setProcessPayrollForm(prev => ({
                        ...prev,
                        period: { ...prev.period, endDate: date }
                      }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !processPayrollForm.paymentDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {processPayrollForm.paymentDate ? format(processPayrollForm.paymentDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={processPayrollForm.paymentDate}
                      onSelect={(date) => date && setProcessPayrollForm(prev => ({ ...prev, paymentDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={processPayrollForm.paymentMethod} onValueChange={(value) => setProcessPayrollForm(prev => ({ ...prev, paymentMethod: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Direct Deposit">Direct Deposit</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                    <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeBonuses"
                  checked={processPayrollForm.includeBonuses}
                  onCheckedChange={(checked) => setProcessPayrollForm(prev => ({ ...prev, includeBonuses: !!checked }))}
                />
                <Label htmlFor="includeBonuses">Include approved bonuses</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeOvertime"
                  checked={processPayrollForm.includeOvertime}
                  onCheckedChange={(checked) => setProcessPayrollForm(prev => ({ ...prev, includeOvertime: !!checked }))}
                />
                <Label htmlFor="includeOvertime">Include overtime payments</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={processPayrollForm.notes}
                onChange={(e) => setProcessPayrollForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Optional notes for this payroll run"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setProcessPayrollOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProcessPayroll}>
              Process Payroll
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Bonuses Dialog */}
      <Dialog open={manageBonusesOpen} onOpenChange={setManageBonusesOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Bonus</DialogTitle>
            <DialogDescription>
              Create a bonus payment for an employee
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeName">Employee Name</Label>
                <Select value={bonusForm.employeeId} onValueChange={(value) => {
                  const employee = employees.find(e => e.id === value);
                  setBonusForm(prev => ({
                    ...prev,
                    employeeId: value,
                    employeeName: employee ? `${employee.firstName} ${employee.lastName}` : ''
                  }));
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bonusType">Bonus Type</Label>
                <Select value={bonusForm.type} onValueChange={(value) => setBonusForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Performance Bonus</SelectItem>
                    <SelectItem value="project">Project Completion</SelectItem>
                    <SelectItem value="referral">Employee Referral</SelectItem>
                    <SelectItem value="annual">Annual Bonus</SelectItem>
                    <SelectItem value="spot">Spot Bonus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Bonus Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={bonusForm.amount}
                  onChange={(e) => setBonusForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label>Effective Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !bonusForm.effectiveDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bonusForm.effectiveDate ? format(bonusForm.effectiveDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={bonusForm.effectiveDate}
                      onSelect={(date) => date && setBonusForm(prev => ({ ...prev, effectiveDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={bonusForm.description}
                onChange={(e) => setBonusForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the reason for this bonus"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setManageBonusesOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleManageBonus}>
              Add Bonus
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Employee Compensation Dialog */}
      <Dialog open={employeeCompensationOpen} onOpenChange={setEmployeeCompensationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Salary Adjustment</DialogTitle>
            <DialogDescription>
              Adjust an employee's salary and compensation
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="employeeName">Employee Name</Label>
              <Select value={compensationForm.employeeId} onValueChange={(value) => {
                const employee = employees.find(e => e.id === value);
                setCompensationForm(prev => ({
                  ...prev,
                  employeeId: value,
                  employeeName: employee ? `${employee.firstName} ${employee.lastName}` : '',
                  currentSalary: employee ? employee.salary : 0
                }));
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Salary</Label>
                <div className="p-2 bg-gray-50 rounded border">
                  {formatAmount(compensationForm.currentSalary)}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newSalary">New Salary</Label>
                <Input
                  id="newSalary"
                  type="number"
                  value={compensationForm.newSalary}
                  onChange={(e) => setCompensationForm(prev => ({ ...prev, newSalary: parseFloat(e.target.value) || 0 }))}
                  placeholder="Enter new salary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Effective Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !compensationForm.effectiveDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {compensationForm.effectiveDate ? format(compensationForm.effectiveDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={compensationForm.effectiveDate}
                      onSelect={(date) => date && setCompensationForm(prev => ({ ...prev, effectiveDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Select value={compensationForm.reason} onValueChange={(value) => setCompensationForm(prev => ({ ...prev, reason: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Performance Review</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="cost_of_living">Cost of Living</SelectItem>
                    <SelectItem value="market_adjustment">Market Adjustment</SelectItem>
                    <SelectItem value="retention">Retention</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={compensationForm.notes}
                onChange={(e) => setCompensationForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about this salary adjustment"
              />
            </div>

            {compensationForm.currentSalary > 0 && compensationForm.newSalary > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Salary Change Summary</h4>
                <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700">Current</p>
                    <p className="font-bold">{formatAmount(compensationForm.currentSalary)}</p>
                  </div>
                  <div>
                    <p className="text-blue-700">New</p>
                    <p className="font-bold">{formatAmount(compensationForm.newSalary)}</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Change</p>
                    <p className={`font-bold ${compensationForm.newSalary > compensationForm.currentSalary ? 'text-green-600' : 'text-red-600'}`}>
                      {compensationForm.newSalary > compensationForm.currentSalary ? '+' : ''}
                      {formatAmount(compensationForm.newSalary - compensationForm.currentSalary)}
                      ({((compensationForm.newSalary - compensationForm.currentSalary) / compensationForm.currentSalary * 100).toFixed(1)}%)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEmployeeCompensationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEmployeeCompensation}>
              Process Adjustment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payroll Details Dialog */}
      <Dialog open={payrollDetailsOpen} onOpenChange={setPayrollDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Payroll Details</DialogTitle>
            <DialogDescription>
              Detailed breakdown of payroll processing
            </DialogDescription>
          </DialogHeader>
          {selectedPayroll && (
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Payroll Summary */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Period</Label>
                        <div className="mt-1">
                          {selectedPayroll.period && typeof selectedPayroll.period === 'object' && 'startDate' in selectedPayroll.period
                            ? format(selectedPayroll.period.startDate, 'MMMM yyyy')
                            : selectedPayroll.period || 'November 2024'}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <div className="mt-1">
                          {getStatusBadge(selectedPayroll.status)}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Total Amount</Label>
                        <div className="mt-1 font-bold">
                          {formatAmount(selectedPayroll.totalAmount)}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Employees</Label>
                        <div className="mt-1">
                          {selectedPayroll.employees}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Employee Breakdown (Mock Data) */}
                <Card>
                  <CardHeader>
                    <CardTitle>Employee Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {employees.slice(0, 5).map((employee) => (
                        <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{employee.firstName} {employee.lastName}</h4>
                            <p className="text-sm text-muted-foreground">{employee.position}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatAmount(employee.salary)}</p>
                            <p className="text-sm text-muted-foreground">Basic Salary</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}