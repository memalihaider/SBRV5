'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Users, Phone, Mail, Calendar, DollarSign, TrendingUp, Plus, Search, Filter, Download, Edit, Eye, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurrencyStore } from '@/stores/currency';

export default function SalesLeadsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formatAmount } = useCurrencyStore();

  // State management
  const [addLeadDialog, setAddLeadDialog] = useState(false);
  const [editLeadDialog, setEditLeadDialog] = useState(false);
  const [filterDialog, setFilterDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    source: 'all',
  });

  // Get stage from URL parameters
  const stageFromUrl = searchParams.get('stage') ? decodeURIComponent(searchParams.get('stage')!) : null;

  // Update filters when stage parameter changes
  useEffect(() => {
    if (stageFromUrl) {
      // Map pipeline stages to lead statuses
      const stageToStatusMap: { [key: string]: string } = {
        'New Leads': 'new',
        'Qualified': 'warm',
        'Proposal': 'hot',
        'Negotiation': 'hot',
        'Closed Won': 'hot',
      };

      const mappedStatus = stageToStatusMap[stageFromUrl] || 'all';
      setFilters(prev => ({ ...prev, status: mappedStatus }));
    }
  }, [stageFromUrl]);

  // Form states
  const [leadForm, setLeadForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    value: '',
    source: '',
    status: 'new',
    priority: 'medium',
    notes: '',
  });

  const [filterForm, setFilterForm] = useState({
    status: 'all',
    priority: 'all',
    source: 'all',
    dateRange: 'all',
  });
  const myLeads = [
    {
      id: 'lead-1',
      name: 'Sarah Johnson',
      company: 'TechStart Solutions',
      email: 'sarah.j@techstart.com',
      phone: '+1 (555) 123-4567',
      status: 'hot',
      value: 45000,
      source: 'Website',
      lastContact: '2 hours ago',
      nextAction: 'Demo scheduled for tomorrow',
      priority: 'high',
      notes: 'Very interested in our enterprise package. CEO of growing tech startup.',
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 'lead-2',
      name: 'Michael Chen',
      company: 'Global Logistics Inc',
      email: 'm.chen@globallog.com',
      phone: '+1 (555) 234-5678',
      status: 'warm',
      value: 32000,
      source: 'Referral',
      lastContact: '1 day ago',
      nextAction: 'Send proposal',
      priority: 'high',
      notes: 'Referred by existing client. Looking for supply chain optimization.',
      createdAt: '2024-01-12T14:20:00Z',
    },
    {
      id: 'lead-3',
      name: 'Emily Rodriguez',
      company: 'Retail Plus',
      email: 'emily.r@retailplus.com',
      phone: '+1 (555) 345-6789',
      status: 'warm',
      value: 28500,
      source: 'Cold Call',
      lastContact: '3 days ago',
      nextAction: 'Follow-up call needed',
      priority: 'medium',
      notes: 'Retail chain expanding operations. Interested in inventory management.',
      createdAt: '2024-01-10T09:15:00Z',
    },
    {
      id: 'lead-4',
      name: 'David Martinez',
      company: 'SmartBuild Construction',
      email: 'david.m@smartbuild.com',
      phone: '+1 (555) 456-7890',
      status: 'cold',
      value: 52000,
      source: 'Trade Show',
      lastContact: '1 week ago',
      nextAction: 'Initial contact',
      priority: 'low',
      notes: 'Construction company. Met at industry trade show last month.',
      createdAt: '2024-01-08T16:45:00Z',
    },
    {
      id: 'lead-5',
      name: 'Lisa Anderson',
      company: 'HealthCare Partners',
      email: 'l.anderson@hcpartners.com',
      phone: '+1 (555) 567-8901',
      status: 'hot',
      value: 67000,
      source: 'LinkedIn',
      lastContact: 'Today',
      nextAction: 'Contract negotiation',
      priority: 'high',
      notes: 'Healthcare network. Ready to move forward with implementation.',
      createdAt: '2024-01-14T11:00:00Z',
    },
  ];

  const leadStats = [
    {
      title: 'My Active Leads',
      value: '34',
      change: '+8',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      title: 'Contacted Today',
      value: '12',
      change: '+5',
      changeType: 'positive' as const,
      icon: Phone,
    },
    {
      title: 'Follow-ups Due',
      value: '7',
      change: '+2',
      changeType: 'negative' as const,
      icon: Calendar,
    },
    {
      title: 'Potential Value',
      value: formatAmount(myLeads.reduce((sum, lead) => sum + lead.value, 0)),
      change: '+15%',
      changeType: 'positive' as const,
      icon: DollarSign,
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      hot: { bg: 'bg-red-100', text: 'text-red-700', badge: 'destructive' as const },
      warm: { bg: 'bg-yellow-100', text: 'text-yellow-700', badge: 'secondary' as const },
      cold: { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'outline' as const },
      new: { bg: 'bg-green-100', text: 'text-green-700', badge: 'default' as const },
    };
    return colors[status as keyof typeof colors] || colors.new;
  };

  // Simple inline WhatsApp SVG icon (keeps bundle small)
  const WhatsappIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.52 3.48A11.9 11.9 0 1 0 21 12a11.87 11.87 0 0 0-0.48-8.52zM12 21c-1.1 0-2.18-0.18-3.18-0.52L6 20l1.54-2.9A9.04 9.04 0 0 1 3 12c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9z" />
      <path d="M17.3 14.2c-0.3-0.2-1.6-0.8-1.8-0.9s-0.4-0.15-0.6 0.2c-0.2 0.35-0.7 0.9-0.9 1.1-0.2 0.2-0.4 0.25-0.7 0.08-0.3-0.16-1.2-0.44-2.3-1.4-0.85-0.75-1.42-1.66-1.58-1.97-0.16-0.32 0-0.48 0.12-0.61 0.12-0.12 0.27-0.32 0.4-0.48 0.13-0.16 0.17-0.27 0.27-0.45 0.1-0.18 0.05-0.33-0.03-0.45-0.08-0.12-0.6-1.46-0.8-2.02-0.22-0.55-0.45-0.48-0.62-0.49-0.16-0.01-0.35-0.01-0.54-0.01-0.18 0-0.47 0.06-0.72 0.33-0.25 0.27-0.96 0.94-0.96 2.3s0.98 2.67 1.12 2.86c0.14 0.18 1.94 3 4.7 4.08 2.76 1.09 2.76 0.73 3.25 0.68 0.49-0.05 1.6-0.65 1.83-1.28 0.23-0.63 0.23-1.17 0.16-1.28-0.07-0.12-0.28-0.2-0.58-0.39z" fill="#fff"/>
    </svg>
  );

  // Filtered and searched leads
  const filteredLeads = useMemo(() => {
    return myLeads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filters.status === 'all' || lead.status === filters.status;
      const matchesPriority = filters.priority === 'all' || lead.priority === filters.priority;
      const matchesSource = filters.source === 'all' || lead.source === filters.source;

      return matchesSearch && matchesStatus && matchesPriority && matchesSource;
    });
  }, [myLeads, searchTerm, filters]);

  // Event handlers
  const handleAddLead = () => {
    if (!leadForm.name || !leadForm.company || !leadForm.email) {
      toast.error('Please fill in all required fields (Name, Company, Email).');
      return;
    }

    // Add lead logic here
    toast.success(`${leadForm.name} from ${leadForm.company} has been added to your pipeline.`);

    setLeadForm({
      name: '',
      company: '',
      email: '',
      phone: '',
      value: '',
      source: '',
      status: 'new',
      priority: 'medium',
      notes: '',
    });
    setAddLeadDialog(false);
  };

  const handleEditLead = (lead: any) => {
    // kept for backward compatibility if an object is passed
    const leadObj = typeof lead === 'string' ? myLeads.find(l => l.id === lead) : lead;
    if (!leadObj) {
      toast.error('Lead not found');
      return;
    }
    setSelectedLead(leadObj);
    setLeadForm({
      name: leadObj.name,
      company: leadObj.company,
      email: leadObj.email,
      phone: leadObj.phone,
      value: leadObj.value?.toString?.() ?? '',
      source: leadObj.source,
      status: leadObj.status,
      priority: leadObj.priority,
      notes: leadObj.notes,
    });
    setEditLeadDialog(true);
  };

  const handleUpdateLead = () => {
    if (!leadForm.name || !leadForm.company || !leadForm.email) {
      toast.error('Please fill in all required fields (Name, Company, Email).');
      return;
    }

    // Update lead logic here
    toast.success(`${leadForm.name}'s information has been updated.`);

    setEditLeadDialog(false);
    setSelectedLead(null);
  };

  // Helper: sanitize phone for WhatsApp (digits only, keep country code)
  const sanitizePhoneForWhatsApp = (phone?: string) => {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    return digits;
  };

  const handleWhatsAppLead = (leadId: string) => {
    const lead = myLeads.find((l) => l.id === leadId);
    if (!lead) {
      toast.error('Lead not found');
      return;
    }
    const phoneDigits = sanitizePhoneForWhatsApp(lead.phone);
    if (!phoneDigits) {
      toast.error('No valid phone number for this lead');
      return;
    }
    const url = `https://wa.me/${phoneDigits}`;
    window.open(url, '_blank');
    toast.success(`Opening WhatsApp chat with ${lead.name}`);
  };

  const handleEmailLead = (leadId: string) => {
    const lead = myLeads.find((l) => l.id === leadId);
    if (!lead) {
      toast.error('Lead not found');
      return;
    }
    if (!lead.email) {
      toast.error('No email address available for this lead');
      return;
    }
    // open mail client
    window.location.href = `mailto:${lead.email}`;
    toast.info(`Composing email to ${lead.name}`);
  };

  const handleViewLead = (leadId: string) => {
    router.push(`/sales/leads/${leadId}`);
  };

  const handleApplyFilters = () => {
    setFilters(filterForm);
    setFilterDialog(false);
    toast.success('Lead list has been filtered according to your criteria.');
  };

  const handleExport = () => {
    toast.success('Your leads data is being exported. Download will start shortly.');
    // In a real app, this would generate and download a CSV/Excel file
  };

  const handleSendUpdateToAdmin = () => {
    toast.info('Lead pipeline update has been sent to admin.');
  };

  const todayTasks = [
    { time: '09:00 AM', task: 'Call Sarah Johnson - Demo prep', lead: 'TechStart Solutions', priority: 'high' },
    { time: '11:30 AM', task: 'Send proposal to Michael Chen', lead: 'Global Logistics', priority: 'high' },
    { time: '02:00 PM', task: 'Follow-up with Emily Rodriguez', lead: 'Retail Plus', priority: 'medium' },
    { time: '04:00 PM', task: 'Team meeting - Pipeline review', lead: 'Internal', priority: 'low' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white">
          {stageFromUrl ? `${stageFromUrl} Leads` : 'My Lead Pipeline'}
        </h1>
        <p className="text-blue-100 mt-1 text-lg">
          {stageFromUrl
            ? `Leads in the ${stageFromUrl.toLowerCase()} stage`
            : 'Manage and convert your leads to customers'
          }
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search leads by name, company, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Dialog open={filterDialog} onOpenChange={setFilterDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-2 border-gray-200 max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filter Leads</span>
                </DialogTitle>
                <DialogDescription>
                  Apply filters to narrow down your leads
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="filter-status">Status</Label>
                  <Select value={filterForm.status} onValueChange={(value) => setFilterForm(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="hot">Hot</SelectItem>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="cold">Cold</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filter-priority">Priority</Label>
                  <Select value={filterForm.priority} onValueChange={(value) => setFilterForm(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="All priorities" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filter-source">Source</Label>
                  <Select value={filterForm.source} onValueChange={(value) => setFilterForm(prev => ({ ...prev, source: value }))}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="All sources" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                      <SelectItem value="Cold Call">Cold Call</SelectItem>
                      <SelectItem value="Trade Show">Trade Show</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setFilterDialog(false)} className="bg-white border-gray-300">
                  Cancel
                </Button>
                <Button onClick={handleApplyFilters} className="bg-blue-600 hover:bg-blue-700">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={handleExport} className="border-blue-200 hover:bg-blue-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button variant="outline" onClick={handleSendUpdateToAdmin} className="border-blue-200 hover:bg-blue-50">
            <MessageSquare className="h-4 w-4 mr-2" />
            Update Admin
          </Button>
        </div>
      </div>

      {/* Lead Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {leadStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">
                  {stat.title}
                </CardTitle>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <IconComponent className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-sm mt-1">
                  <span
                    className={
                      stat.changeType === 'positive'
                        ? 'text-green-600 font-semibold'
                        : 'text-red-600 font-semibold'
                    }
                  >
                    {stat.change}
                  </span>{' '}
                  <span className="text-gray-500">from last week</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Leads - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-900">My Leads</CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    Active leads in your pipeline ({filteredLeads.length} of {myLeads.length})
                  </CardDescription>
                </div>
                <Dialog open={addLeadDialog} onOpenChange={setAddLeadDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lead
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
                          <Label htmlFor="lead-name">Name *</Label>
                          <Input
                            id="lead-name"
                            value={leadForm.name}
                            onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter contact name"
                            className="bg-white border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lead-company">Company *</Label>
                          <Input
                            id="lead-company"
                            value={leadForm.company}
                            onChange={(e) => setLeadForm(prev => ({ ...prev, company: e.target.value }))}
                            placeholder="Enter company name"
                            className="bg-white border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="lead-email">Email *</Label>
                          <Input
                            id="lead-email"
                            type="email"
                            value={leadForm.email}
                            onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="contact@company.com"
                            className="bg-white border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lead-phone">Phone</Label>
                          <Input
                            id="lead-phone"
                            value={leadForm.phone}
                            onChange={(e) => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+1 (555) 123-4567"
                            className="bg-white border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="lead-value">Estimated Value</Label>
                          <Input
                            id="lead-value"
                            value={leadForm.value}
                            onChange={(e) => setLeadForm(prev => ({ ...prev, value: e.target.value }))}
                            placeholder="50000"
                            className="bg-white border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lead-source">Lead Source</Label>
                          <Select value={leadForm.source} onValueChange={(value) => setLeadForm(prev => ({ ...prev, source: value }))}>
                            <SelectTrigger className="bg-white border-gray-300">
                              <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200">
                              <SelectItem value="Website">Website</SelectItem>
                              <SelectItem value="Referral">Referral</SelectItem>
                              <SelectItem value="Cold Call">Cold Call</SelectItem>
                              <SelectItem value="Trade Show">Trade Show</SelectItem>
                              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                              <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="lead-status">Status</Label>
                          <Select value={leadForm.status} onValueChange={(value) => setLeadForm(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger className="bg-white border-gray-300">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200">
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="hot">Hot</SelectItem>
                              <SelectItem value="warm">Warm</SelectItem>
                              <SelectItem value="cold">Cold</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lead-priority">Priority</Label>
                          <Select value={leadForm.priority} onValueChange={(value) => setLeadForm(prev => ({ ...prev, priority: value }))}>
                            <SelectTrigger className="bg-white border-gray-300">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200">
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lead-notes">Notes</Label>
                        <Textarea
                          id="lead-notes"
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

                <Dialog open={editLeadDialog} onOpenChange={setEditLeadDialog}>
                  <DialogContent className="bg-white border-2 border-gray-200 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <Edit className="h-5 w-5" />
                        <span>Edit Lead</span>
                      </DialogTitle>
                      <DialogDescription>
                        Update lead information and tracking details
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-lead-name">Name *</Label>
                          <Input
                            id="edit-lead-name"
                            value={leadForm.name}
                            onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter contact name"
                            className="bg-white border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-lead-company">Company *</Label>
                          <Input
                            id="edit-lead-company"
                            value={leadForm.company}
                            onChange={(e) => setLeadForm(prev => ({ ...prev, company: e.target.value }))}
                            placeholder="Enter company name"
                            className="bg-white border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-lead-email">Email *</Label>
                          <Input
                            id="edit-lead-email"
                            type="email"
                            value={leadForm.email}
                            onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="contact@company.com"
                            className="bg-white border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-lead-phone">Phone</Label>
                          <Input
                            id="edit-lead-phone"
                            value={leadForm.phone}
                            onChange={(e) => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+1 (555) 123-4567"
                            className="bg-white border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-lead-value">Estimated Value</Label>
                          <Input
                            id="edit-lead-value"
                            value={leadForm.value}
                            onChange={(e) => setLeadForm(prev => ({ ...prev, value: e.target.value }))}
                            placeholder="50000"
                            className="bg-white border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-lead-source">Lead Source</Label>
                          <Select value={leadForm.source} onValueChange={(value) => setLeadForm(prev => ({ ...prev, source: value }))}>
                            <SelectTrigger className="bg-white border-gray-300">
                              <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200">
                              <SelectItem value="Website">Website</SelectItem>
                              <SelectItem value="Referral">Referral</SelectItem>
                              <SelectItem value="Cold Call">Cold Call</SelectItem>
                              <SelectItem value="Trade Show">Trade Show</SelectItem>
                              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                              <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-lead-status">Status</Label>
                          <Select value={leadForm.status} onValueChange={(value) => setLeadForm(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger className="bg-white border-gray-300">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200">
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="hot">Hot</SelectItem>
                              <SelectItem value="warm">Warm</SelectItem>
                              <SelectItem value="cold">Cold</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-lead-priority">Priority</Label>
                          <Select value={leadForm.priority} onValueChange={(value) => setLeadForm(prev => ({ ...prev, priority: value }))}>
                            <SelectTrigger className="bg-white border-gray-300">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200">
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-lead-notes">Notes</Label>
                        <Textarea
                          id="edit-lead-notes"
                          value={leadForm.notes}
                          onChange={(e) => setLeadForm(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Additional notes about this lead..."
                          rows={3}
                          className="bg-white border-gray-300"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-6">
                      <Button variant="outline" onClick={() => setEditLeadDialog(false)} className="bg-white border-gray-300">
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateLead} className="bg-blue-600 hover:bg-blue-700">
                        <Edit className="h-4 w-4 mr-2" />
                        Update Lead
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {filteredLeads.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || filters.status || filters.priority || filters.source
                      ? "Try adjusting your search or filters"
                      : "Get started by adding your first lead"}
                  </p>
                  {!searchTerm && !filters.status && !filters.priority && !filters.source && (
                    <Button onClick={() => setAddLeadDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Lead
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredLeads.map((lead) => (
                    <Card
                      key={lead.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-300 bg-white"
                      onClick={() => handleViewLead(lead.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg">{lead.name}</h3>
                            <p className="text-sm text-gray-600">{lead.company}</p>
                          </div>
                          <Badge
                            variant={lead.status === 'hot' ? 'default' : lead.status === 'warm' ? 'secondary' : 'outline'}
                            className={`${
                              lead.status === 'hot'
                                ? 'bg-red-100 text-red-800 border-red-200'
                                : lead.status === 'warm'
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                            }`}
                          >
                            {lead.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <WhatsappIcon className="h-4 w-4 mr-2 text-green-600" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWhatsAppLead(lead.id);
                                }}
                                className="text-blue-600 underline text-sm"
                              >
                                {lead.phone}
                              </button>
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="h-4 w-4 mr-2" />
                            {formatAmount(lead.value)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWhatsAppLead(lead.id);
                              }}
                              className="h-8 px-2 border-gray-300 hover:bg-gray-50"
                            >
                              <WhatsappIcon className="h-3 w-3 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEmailLead(lead.id);
                              }}
                              className="h-8 px-2 border-gray-300 hover:bg-gray-50"
                            >
                              <Mail className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditLead(lead.id);
                              }}
                              className="h-8 px-2 border-gray-300 hover:bg-gray-50"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Today's Tasks - Takes 1 column */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="text-xl text-gray-900">Today's Tasks</CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                Your schedule for today
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {todayTasks.map((task, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border-2 border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="shrink-0 w-16">
                        <p className="text-xs font-bold text-blue-600">{task.time}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 mb-1">{task.task}</p>
                        <p className="text-xs text-gray-600">{task.lead}</p>
                        {task.priority === 'high' && (
                          <Badge variant="destructive" className="mt-2 text-xs">
                            HIGH
                          </Badge>
                        )}
                        {task.priority === 'medium' && (
                          <Badge variant="secondary" className="mt-2 text-xs">
                            MEDIUM
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card className="shadow-lg mt-6">
            <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 rounded-t-lg">
              <CardTitle className="text-xl text-gray-900">This Week</CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                Your performance summary
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Calls Made</p>
                    <p className="text-2xl font-bold text-gray-900">48</p>
                  </div>
                  <Phone className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Emails Sent</p>
                    <p className="text-2xl font-bold text-gray-900">32</p>
                  </div>
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Meetings</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Conversions</p>
                    <p className="text-2xl font-bold text-gray-900">5</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
