'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Users, TrendingUp, Target, RefreshCw, Filter, Download, MessageSquare, Plus, FileText, BarChart3 } from 'lucide-react';
import { useCurrencyStore } from '@/stores/currency';
import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function SalesDashboard() {
  const { formatAmount } = useCurrencyStore();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('6months');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dialog states
  const [addLeadDialog, setAddLeadDialog] = useState(false);
  const [createDealDialog, setCreateDealDialog] = useState(false);
  const [viewReportsDialog, setViewReportsDialog] = useState(false);
  const [advancedFilterDialog, setAdvancedFilterDialog] = useState(false);

  // Form states
  const [leadForm, setLeadForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    value: '',
    source: '',
    notes: ''
  });

  const [dealForm, setDealForm] = useState({
    title: '',
    customerId: '',
    value: '',
    expectedCloseDate: '',
    probability: '',
    description: ''
  });

  const [filterForm, setFilterForm] = useState({
    dateRange: '',
    leadStatus: '',
    valueRange: '',
    assignedTo: '',
    source: ''
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleSendUpdateToAdmin = () => {
    // This would send a message to admin portal about sales performance
    toast.success('Sales performance update sent to Admin Portal');
  };

  // New handler functions
  const handleAddLead = () => {
    if (!leadForm.companyName.trim() || !leadForm.contactName.trim() || !leadForm.email.trim()) {
      toast.error('Please fill in required fields: Company Name, Contact Name, and Email');
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Adding lead:', leadForm);
    toast.success('Lead added successfully!');

    // Reset form
    setLeadForm({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      value: '',
      source: '',
      notes: ''
    });
    setAddLeadDialog(false);
  };

  const handleCreateDeal = () => {
    if (!dealForm.title.trim() || !dealForm.customerId.trim() || !dealForm.value.trim()) {
      toast.error('Please fill in required fields: Title, Customer, and Value');
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Creating deal:', dealForm);
    toast.success('Deal created successfully!');

    // Reset form
    setDealForm({
      title: '',
      customerId: '',
      value: '',
      expectedCloseDate: '',
      probability: '',
      description: ''
    });
    setCreateDealDialog(false);
  };

  const handleViewReports = () => {
    // Navigate to reports page or open reports dialog
    router.push('/sales/reports');
    toast.info('Navigating to Reports page...');
  };

  const handleAdvancedFilter = () => {
    // Apply filters to the dashboard data
    console.log('Applying filters:', filterForm);
    toast.success('Filters applied successfully!');
    setAdvancedFilterDialog(false);
  };

  const handleExport = () => {
    // Export dashboard data
    const exportData = {
      metrics,
      pipelineData,
      recentLeads,
      teamPerformance,
      timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `sales-dashboard-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast.success('Dashboard data exported successfully!');
  };

  const handleLeadClick = (leadId: number) => {
    // Navigate to lead details page
    router.push(`/sales/leads/${leadId}`);
    toast.info('Opening lead details...');
  };

  const handlePipelineStageClick = (stage: string) => {
    // Navigate to filtered leads page for this stage
    router.push(`/sales/leads?stage=${encodeURIComponent(stage)}`);
    toast.info(`Filtering leads by ${stage} stage...`);
  };

  const handleTeamMemberClick = (memberName: string) => {
    // Navigate to team member performance page
    router.push(`/sales/team/${memberName.toLowerCase().replace(' ', '_')}`);
    toast.info(`Viewing ${memberName}'s performance...`);
  };

  // Base amounts in USD
  const baseMetrics = [
    {
      title: 'Monthly Revenue',
      value: 245678, // Base USD amount
      change: '+18%',
      changeType: 'positive' as const,
      icon: DollarSign,
    },
    {
      title: 'Active Leads',
      value: 156,
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      title: 'Conversion Rate',
      value: '24.5%',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: TrendingUp,
    },
    {
      title: 'Quota Achievement',
      value: '87%',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Target,
    },
  ];

  const basePipelineData = [
    { stage: 'New Leads', count: 45, value: 125000, color: 'bg-blue-500' },
    { stage: 'Qualified', count: 32, value: 245000, color: 'bg-yellow-500' },
    { stage: 'Proposal', count: 18, value: 430000, color: 'bg-orange-500' },
    { stage: 'Negotiation', count: 12, value: 315000, color: 'bg-purple-500' },
    { stage: 'Closed Won', count: 8, value: 185000, color: 'bg-green-500' },
  ];

  const baseRecentLeads = [
    {
      id: 1,
      company: 'Tech Solutions Inc.',
      contact: 'John Smith',
      value: 45000,
      stage: 'Proposal',
      probability: 75,
      lastActivity: '2 hours ago',
    },
    {
      id: 2,
      company: 'Global Electronics',
      contact: 'Sarah Johnson',
      value: 125000,
      stage: 'Negotiation',
      probability: 85,
      lastActivity: '4 hours ago',
    },
    {
      id: 3,
      company: 'Industrial Systems',
      contact: 'Mike Davis',
      value: 67500,
      stage: 'Qualified',
      probability: 45,
      lastActivity: '1 day ago',
    },
    {
      id: 4,
      company: 'Smart Automation',
      contact: 'Lisa Chen',
      value: 89000,
      stage: 'Proposal',
      probability: 60,
      lastActivity: '2 days ago',
    },
  ];

  const baseTeamPerformance = [
    { id: 'rep-1', name: 'Mike Davis', leads: 32, deals: 8, revenue: 185000, target: 85 },
    { id: 'rep-2', name: 'Sarah Johnson', leads: 28, deals: 6, revenue: 156000, target: 92 },
    { id: 'rep-3', name: 'Tom Wilson', leads: 24, deals: 5, revenue: 134000, target: 78 },
    { id: 'rep-4', name: 'Emma Brown', leads: 18, deals: 4, revenue: 98000, target: 65 },
  ];

  // Sales trend data for the last 6 months
  const salesTrendData = [
    { month: 'Jul', revenue: 185000, target: 200000 },
    { month: 'Aug', revenue: 210000, target: 220000 },
    { month: 'Sep', revenue: 195000, target: 210000 },
    { month: 'Oct', revenue: 235000, target: 230000 },
    { month: 'Nov', revenue: 245678, target: 240000 },
    { month: 'Dec', revenue: 265000, target: 250000 },
  ];

  // Pipeline chart data
  const pipelineChartData = basePipelineData.map(stage => ({
    name: stage.stage,
    value: stage.value,
    count: stage.count,
    color: stage.color.replace('bg-', '').replace('-500', ''),
  }));

  // Filter data based on time range
  const getFilteredData = () => {
    const now = new Date();
    let monthsBack = 6;

    switch (timeRange) {
      case '1month':
        monthsBack = 1;
        break;
      case '3months':
        monthsBack = 3;
        break;
      case '6months':
        monthsBack = 6;
        break;
      case '1year':
        monthsBack = 12;
        break;
    }

    const cutoffDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);

    // Filter sales trend data
    const filteredTrendData = salesTrendData.filter(data => {
      const dataDate = new Date(now.getFullYear(), [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ].indexOf(data.month.substring(0, 3)), 1);
      return dataDate >= cutoffDate;
    });

    return {
      trendData: filteredTrendData,
      // You can add more filtering logic here for other data
    };
  };

  const filteredData = getFilteredData();

  const formattedSalesTrendData = useMemo(() => filteredData.trendData.map(data => ({
    ...data,
    formattedRevenue: formatAmount(data.revenue),
    formattedTarget: formatAmount(data.target),
  })), [filteredData.trendData, formatAmount]);

  const formattedPipelineChartData = useMemo(() => pipelineChartData.map(data => ({
    ...data,
    formattedValue: formatAmount(data.value),
  })), [pipelineChartData, formatAmount]);

  // Format amounts based on selected currency
  const metrics = useMemo(() => baseMetrics.map(metric => ({
    ...metric,
    displayValue: typeof metric.value === 'number' && metric.icon === DollarSign ? formatAmount(metric.value) : metric.value.toString()
  })), [baseMetrics, formatAmount]);

  const pipelineData = useMemo(() => basePipelineData.map(stage => ({
    ...stage,
    displayValue: formatAmount(stage.value)
  })), [basePipelineData, formatAmount]);

  const recentLeads = useMemo(() => baseRecentLeads.map(lead => ({
    ...lead,
    displayValue: formatAmount(lead.value)
  })), [baseRecentLeads, formatAmount]);

  const teamPerformance = useMemo(() => baseTeamPerformance.map(rep => ({
    ...rep,
    displayRevenue: formatAmount(rep.revenue)
  })), [baseTeamPerformance, formatAmount]);

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-600">Track your sales performance and pipeline</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Dialog open={addLeadDialog} onOpenChange={setAddLeadDialog}>
          <DialogTrigger asChild>
            <Button className="h-20 bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center space-y-2">
              <Plus className="h-6 w-6" />
              <span className="text-sm font-medium">Add Lead</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-2 border-gray-200 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Add New Lead</span>
              </DialogTitle>
              <DialogDescription>
                Create a new lead to track potential business opportunities
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name *</Label>
                  <Input
                    id="company-name"
                    value={leadForm.companyName}
                    onChange={(e) => setLeadForm(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Enter company name"
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Contact Name *</Label>
                  <Input
                    id="contact-name"
                    value={leadForm.contactName}
                    onChange={(e) => setLeadForm(prev => ({ ...prev, contactName: e.target.value }))}
                    placeholder="Enter contact person"
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@company.com"
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value">Estimated Value</Label>
                  <Input
                    id="value"
                    value={leadForm.value}
                    onChange={(e) => setLeadForm(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="50000"
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Lead Source</Label>
                  <Select value={leadForm.source} onValueChange={(value) => setLeadForm(prev => ({ ...prev, source: value }))}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="cold_call">Cold Call</SelectItem>
                      <SelectItem value="trade_show">Trade Show</SelectItem>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="email_campaign">Email Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={leadForm.notes}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about this lead..."
                  rows={3}
                  className="bg-white border-gray-300"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setAddLeadDialog(false)} className="bg-white border-gray-300">
                Cancel
              </Button>
              <Button onClick={handleAddLead} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={createDealDialog} onOpenChange={setCreateDealDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-20 border-blue-200 hover:bg-blue-50 flex flex-col items-center justify-center space-y-2">
              <Target className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium">Create Deal</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-2 border-gray-200 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Create New Deal</span>
              </DialogTitle>
              <DialogDescription>
                Create a new deal to track a sales opportunity
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deal-title">Deal Title *</Label>
                <Input
                  id="deal-title"
                  value={dealForm.title}
                  onChange={(e) => setDealForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter deal title"
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-id">Customer *</Label>
                  <Input
                    id="customer-id"
                    value={dealForm.customerId}
                    onChange={(e) => setDealForm(prev => ({ ...prev, customerId: e.target.value }))}
                    placeholder="Select or enter customer"
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deal-value">Deal Value *</Label>
                  <Input
                    id="deal-value"
                    value={dealForm.value}
                    onChange={(e) => setDealForm(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="100000"
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="close-date">Expected Close Date</Label>
                  <Input
                    id="close-date"
                    type="date"
                    value={dealForm.expectedCloseDate}
                    onChange={(e) => setDealForm(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="probability">Probability (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    min="0"
                    max="100"
                    value={dealForm.probability}
                    onChange={(e) => setDealForm(prev => ({ ...prev, probability: e.target.value }))}
                    placeholder="75"
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deal-description">Description</Label>
                <Textarea
                  id="deal-description"
                  value={dealForm.description}
                  onChange={(e) => setDealForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Deal details and requirements..."
                  rows={3}
                  className="bg-white border-gray-300"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setCreateDealDialog(false)} className="bg-white border-gray-300">
                Cancel
              </Button>
              <Button onClick={handleCreateDeal} className="bg-blue-600 hover:bg-blue-700">
                <Target className="h-4 w-4 mr-2" />
                Create Deal
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          className="h-20 border-blue-200 hover:bg-blue-50 flex flex-col items-center justify-center space-y-2"
          onClick={handleViewReports}
        >
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <span className="text-sm font-medium">View Reports</span>
        </Button>

        <Dialog open={advancedFilterDialog} onOpenChange={setAdvancedFilterDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-20 border-blue-200 hover:bg-blue-50 flex flex-col items-center justify-center space-y-2">
              <Filter className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium">Advanced Filter</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-2 border-gray-200 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Advanced Filters</span>
              </DialogTitle>
              <DialogDescription>
                Apply advanced filters to customize your dashboard view
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select value={filterForm.dateRange} onValueChange={(value) => setFilterForm(prev => ({ ...prev, dateRange: value }))}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-status">Lead Status</Label>
                  <Select value={filterForm.leadStatus} onValueChange={(value) => setFilterForm(prev => ({ ...prev, leadStatus: value }))}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value-range">Value Range</Label>
                  <Select value={filterForm.valueRange} onValueChange={(value) => setFilterForm(prev => ({ ...prev, valueRange: value }))}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="0-50000">$0 - $50K</SelectItem>
                      <SelectItem value="50000-100000">$50K - $100K</SelectItem>
                      <SelectItem value="100000-250000">$100K - $250K</SelectItem>
                      <SelectItem value="250000+">$250K+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assigned-to">Assigned To</Label>
                  <Select value={filterForm.assignedTo} onValueChange={(value) => setFilterForm(prev => ({ ...prev, assignedTo: value }))}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Select person" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="me">Me</SelectItem>
                      <SelectItem value="team">My Team</SelectItem>
                      <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-source">Lead Source</Label>
                <Select value={filterForm.source} onValueChange={(value) => setFilterForm(prev => ({ ...prev, source: value }))}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="cold_call">Cold Call</SelectItem>
                    <SelectItem value="trade_show">Trade Show</SelectItem>
                    <SelectItem value="social_media">Social Media</SelectItem>
                    <SelectItem value="email_campaign">Email Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setAdvancedFilterDialog(false)} className="bg-white border-gray-300">
                Cancel
              </Button>
              <Button onClick={handleAdvancedFilter} className="bg-blue-600 hover:bg-blue-700">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          className="h-20 border-blue-200 hover:bg-blue-50 flex flex-col items-center justify-center space-y-2"
          onClick={handleSendUpdateToAdmin}
        >
          <MessageSquare className="h-6 w-6 text-blue-600" />
          <span className="text-sm font-medium">Update Admin</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.displayValue}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={
                      metric.changeType === 'positive'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {metric.change}
                  </span>{' '}
                  from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>
              Monthly revenue vs targets for the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formattedSalesTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatAmount(value)} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatAmount(value),
                    name === 'revenue' ? 'Revenue' : 'Target'
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={3}
                  name="revenue"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#dc2626"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="target"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pipeline Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Distribution</CardTitle>
            <CardDescription>
              Revenue distribution across pipeline stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formattedPipelineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis tickFormatter={(value) => formatAmount(value)} />
                <Tooltip
                  formatter={(value: number) => [formatAmount(value), 'Value']}
                />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Pipeline</CardTitle>
            <CardDescription>
              Current pipeline by stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineData.map((stage, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  onClick={() => handlePipelineStageClick(stage.stage)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    <span className="text-sm font-medium">{stage.stage}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{stage.count} leads</div>
                    <div className="text-xs text-gray-500">{stage.displayValue}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>
              Latest lead activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-start space-x-4 p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-200 transition-all"
                  onClick={() => handleLeadClick(lead.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {lead.company}
                    </p>
                    <p className="text-sm text-gray-500">
                      Contact: {lead.contact}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline">{lead.stage}</Badge>
                      <span className="text-sm font-medium text-green-600">
                        {lead.displayValue}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Probability</span>
                        <span>{lead.probability}%</span>
                      </div>
                      <Progress value={lead.probability} className="h-1" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{lead.lastActivity}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>
            Sales team metrics and targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Sales Rep</th>
                  <th className="text-left p-2 font-medium">Active Leads</th>
                  <th className="text-left p-2 font-medium">Closed Deals</th>
                  <th className="text-left p-2 font-medium">Revenue</th>
                  <th className="text-left p-2 font-medium">Target Achievement</th>
                </tr>
              </thead>
              <tbody>
                {teamPerformance.map((rep, index) => (
                  <tr
                    key={index}
                    className="border-b cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleTeamMemberClick(rep.id)}
                  >
                    <td className="p-2 font-medium">{rep.name}</td>
                    <td className="p-2">{rep.leads}</td>
                    <td className="p-2">{rep.deals}</td>
                    <td className="p-2 font-medium text-green-600">{rep.displayRevenue}</td>
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        <Progress value={rep.target} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{rep.target}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Conversion Funnel</CardTitle>
          <CardDescription>
            Conversion rates through the sales pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'New Leads', value: 100, count: 156 },
                      { name: 'Qualified', value: 65, count: 102 },
                      { name: 'Proposal', value: 35, count: 55 },
                      { name: 'Negotiation', value: 20, count: 31 },
                      { name: 'Closed Won', value: 12, count: 19 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#eab308" />
                    <Cell fill="#f97316" />
                    <Cell fill="#a855f7" />
                    <Cell fill="#22c55e" />
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Conversion Rate']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="font-medium">New Leads</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">156</div>
                  <div className="text-sm text-gray-600">100%</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="font-medium">Qualified</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">102</div>
                  <div className="text-sm text-gray-600">65%</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="font-medium">Proposal</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">55</div>
                  <div className="text-sm text-gray-600">35%</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="font-medium">Negotiation</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">31</div>
                  <div className="text-sm text-gray-600">20%</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="font-medium">Closed Won</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">19</div>
                  <div className="text-sm text-gray-600">12%</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}