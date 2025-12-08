'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import mockData from '@/lib/mock-data';
import { useCurrencyStore } from '@/stores/currency';
import { Lead } from '@/types';

export default function PipelinePage() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const { formatAmount } = useCurrencyStore();

  // Modal states
  const [addLeadDialog, setAddLeadDialog] = useState(false);
  const [editLeadDialog, setEditLeadDialog] = useState(false);
  const [viewLeadDialog, setViewLeadDialog] = useState(false);
  const [moveStageDialog, setMoveStageDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Form states
  const [leadForm, setLeadForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    estimatedValue: '',
    source: '',
    status: 'new',
    probability: '',
    expectedCloseDate: '',
    notes: '',
  });

  // Group leads by status
  const leadsByStatus = {
    new: mockData.leads.filter(l => l.status === 'new'),
    contacted: mockData.leads.filter(l => l.status === 'contacted'),
    qualified: mockData.leads.filter(l => l.status === 'qualified'),
    proposal_sent: mockData.leads.filter(l => l.status === 'proposal_sent'),
    negotiating: mockData.leads.filter(l => l.status === 'negotiating'),
    closed_won: mockData.leads.filter(l => l.status === 'closed_won'),
    closed_lost: mockData.leads.filter(l => l.status === 'closed_lost'),
  };

  const stages = [
    { 
      id: 'new', 
      name: 'New Leads', 
      color: 'bg-gray-500',
      borderColor: 'border-gray-500',
      leads: leadsByStatus.new,
      value: leadsByStatus.new.reduce((sum, l) => sum + l.estimatedValue, 0)
    },
    { 
      id: 'contacted', 
      name: 'Contacted', 
      color: 'bg-blue-500',
      borderColor: 'border-blue-500',
      leads: leadsByStatus.contacted,
      value: leadsByStatus.contacted.reduce((sum, l) => sum + l.estimatedValue, 0)
    },
    { 
      id: 'qualified', 
      name: 'Qualified', 
      color: 'bg-cyan-500',
      borderColor: 'border-cyan-500',
      leads: leadsByStatus.qualified,
      value: leadsByStatus.qualified.reduce((sum, l) => sum + l.estimatedValue, 0)
    },
    { 
      id: 'proposal_sent', 
      name: 'Proposal Sent', 
      color: 'bg-yellow-500',
      borderColor: 'border-yellow-500',
      leads: leadsByStatus.proposal_sent,
      value: leadsByStatus.proposal_sent.reduce((sum, l) => sum + l.estimatedValue, 0)
    },
    { 
      id: 'negotiating', 
      name: 'Negotiating', 
      color: 'bg-orange-500',
      borderColor: 'border-orange-500',
      leads: leadsByStatus.negotiating,
      value: leadsByStatus.negotiating.reduce((sum, l) => sum + l.estimatedValue, 0)
    },
    { 
      id: 'closed_won', 
      name: 'Closed Won', 
      color: 'bg-green-500',
      borderColor: 'border-green-500',
      leads: leadsByStatus.closed_won,
      value: leadsByStatus.closed_won.reduce((sum, l) => sum + l.estimatedValue, 0)
    },
    { 
      id: 'closed_lost', 
      name: 'Closed Lost', 
      color: 'bg-red-500',
      borderColor: 'border-red-500',
      leads: leadsByStatus.closed_lost,
      value: leadsByStatus.closed_lost.reduce((sum, l) => sum + l.estimatedValue, 0)
    },
  ];

  const totalPipelineValue = stages.reduce((sum, stage) => sum + stage.value, 0);
  const totalLeads = mockData.leads.length;
  const wonLeads = leadsByStatus.closed_won.length;
  const wonValue = stages.find(s => s.id === 'closed_won')?.value || 0;
  const winRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0';

  // Event handlers
  const handleAddLead = () => {
    if (!leadForm.companyName || !leadForm.contactPerson || !leadForm.email) {
      toast.error('Please fill in all required fields (Company Name, Contact Person, Email).');
      return;
    }

    // In a real app, this would make an API call
    toast.success(`${leadForm.companyName} has been added to the pipeline.`);

    // Reset form
    setLeadForm({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      estimatedValue: '',
      source: '',
      status: 'new',
      probability: '',
      expectedCloseDate: '',
      notes: '',
    });
    setAddLeadDialog(false);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setLeadForm({
      companyName: lead.companyName,
      contactPerson: lead.contactPerson,
      email: lead.email,
      phone: lead.phone,
      estimatedValue: lead.estimatedValue.toString(),
      source: lead.source,
      status: lead.status,
      probability: lead.probability.toString(),
      expectedCloseDate: lead.expectedCloseDate.toISOString().split('T')[0],
      notes: lead.notes.join('\n'),
    });
    setEditLeadDialog(true);
  };

  const handleUpdateLead = () => {
    if (!leadForm.companyName || !leadForm.contactPerson || !leadForm.email) {
      toast.error('Please fill in all required fields (Company Name, Contact Person, Email).');
      return;
    }

    // In a real app, this would make an API call
    toast.success(`${leadForm.companyName}'s information has been updated.`);

    setEditLeadDialog(false);
    setSelectedLead(null);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setViewLeadDialog(true);
  };

  const handleMoveStage = (lead: Lead) => {
    setSelectedLead(lead);
    setMoveStageDialog(true);
  };

  const handleMoveStageConfirm = (newStatus: string) => {
    if (!selectedLead) return;

    // In a real app, this would make an API call
    toast.success(`${selectedLead.companyName} has been moved to ${newStatus.replace('_', ' ').toUpperCase()} stage.`);

    setMoveStageDialog(false);
    setSelectedLead(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-600 mt-1">Visual pipeline and deal tracking</p>
        </div>
        <Dialog open={addLeadDialog} onOpenChange={setAddLeadDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-2 border-gray-200 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add New Lead</span>
              </DialogTitle>
              <DialogDescription>
                Create a new lead to track potential business opportunities in your sales pipeline
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
                  <Label htmlFor="contact-person">Contact Person *</Label>
                  <Input
                    id="contact-person"
                    value={leadForm.contactPerson}
                    onChange={(e) => setLeadForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                    placeholder="Enter contact person name"
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
                  <Label htmlFor="estimated-value">Estimated Value</Label>
                  <Input
                    id="estimated-value"
                    type="number"
                    value={leadForm.estimatedValue}
                    onChange={(e) => setLeadForm(prev => ({ ...prev, estimatedValue: e.target.value }))}
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
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                      <SelectItem value="Cold Call">Cold Call</SelectItem>
                      <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                      <SelectItem value="Trade Show">Trade Show</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={leadForm.status} onValueChange={(value) => setLeadForm(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                      <SelectItem value="negotiating">Negotiating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="probability">Probability (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    min="0"
                    max="100"
                    value={leadForm.probability}
                    onChange={(e) => setLeadForm(prev => ({ ...prev, probability: e.target.value }))}
                    placeholder="25"
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected-close-date">Expected Close Date</Label>
                <Input
                  id="expected-close-date"
                  type="date"
                  value={leadForm.expectedCloseDate}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
                  className="bg-white border-gray-300"
                />
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
              <Button onClick={handleAddLead} className="bg-green-600 hover:bg-green-700">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Lead
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatAmount(totalPipelineValue)}</div>
            <p className="text-sm text-gray-500 mt-1">{totalLeads} opportunities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Closed Won</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{formatAmount(wonValue)}</div>
            <p className="text-sm text-gray-500 mt-1">{wonLeads} deals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{winRate}%</div>
            <p className="text-sm text-gray-500 mt-1">Conversion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Deal Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {formatAmount(totalLeads > 0 ? Math.round(totalPipelineValue / totalLeads) : 0)}
            </div>
            <p className="text-sm text-gray-500 mt-1">Per opportunity</p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {stages.map((stage) => (
          <Card 
            key={stage.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedStage === stage.id ? 'ring-2 ring-green-500' : ''}`}
            onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
          >
            <CardHeader className="pb-3">
              <div className={`w-full h-2 rounded-full ${stage.color} mb-2`}></div>
              <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900">{stage.leads.length}</div>
                <div className="text-sm font-semibold text-green-600">{formatAmount(stage.value)}</div>
                <div className="text-xs text-gray-500">
                  {((stage.leads.length / totalLeads) * 100).toFixed(1)}% of pipeline
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View */}
      {selectedStage && (
        <Card>
          <CardHeader>
            <CardTitle>
              {stages.find(s => s.id === selectedStage)?.name} - Detailed View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stages.find(s => s.id === selectedStage)?.leads.map((lead) => (
                <div key={lead.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{lead.companyName}</h3>
                        <Badge variant="outline">{lead.source}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Contact:</span>
                          <p className="font-medium">{lead.contactPerson}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <p className="font-medium">{lead.email}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Estimated Value:</span>
                          <p className="font-bold text-green-600">{formatAmount(lead.estimatedValue)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Probability:</span>
                          <p className="font-medium">{lead.probability}%</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all"
                              style={{ width: `${lead.probability}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{lead.probability}%</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Expected Close: {new Date(lead.expectedCloseDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleViewLead(lead)}>
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditLead(lead)}>
                        Edit
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleMoveStage(lead)}>
                        Move Stage
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {stages.find(s => s.id === selectedStage)?.leads.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No leads in this stage</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedStage && (
        <Card>
          <CardContent className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <p className="text-lg font-medium">Click on a pipeline stage above</p>
            <p className="text-sm">View and manage leads in each stage of your sales pipeline</p>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <ViewLeadModal
        lead={selectedLead}
        open={viewLeadDialog}
        onOpenChange={setViewLeadDialog}
        formatAmount={formatAmount}
      />

      <EditLeadModal
        lead={selectedLead}
        form={leadForm}
        setForm={setLeadForm}
        open={editLeadDialog}
        onOpenChange={setEditLeadDialog}
        onSave={handleUpdateLead}
      />

      <MoveStageModal
        lead={selectedLead}
        open={moveStageDialog}
        onOpenChange={setMoveStageDialog}
        onMove={handleMoveStageConfirm}
      />

    </div>
  );
}

// View Lead Modal
function ViewLeadModal({ lead, open, onOpenChange, formatAmount }: { lead: Lead | null; open: boolean; onOpenChange: (open: boolean) => void; formatAmount: (amount: number) => string }) {
  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-2 border-gray-200 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Lead Details - {lead.companyName}</span>
          </DialogTitle>
          <DialogDescription>
            Detailed information about this lead and its pipeline progress
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lead Overview */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Company Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Company:</span>
                  <span className="font-medium">{lead.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact Person:</span>
                  <span className="font-medium">{lead.contactPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{lead.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{lead.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Source:</span>
                  <Badge variant="outline">{lead.source}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Pipeline Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Status:</span>
                  <Badge variant="default">{lead.status.replace('_', ' ').toUpperCase()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Probability:</span>
                  <span className="font-medium">{lead.probability}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Value:</span>
                  <span className="font-bold text-green-600">{formatAmount(lead.estimatedValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Close:</span>
                  <span className="font-medium">{new Date(lead.expectedCloseDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Assigned To:</span>
                  <span className="font-medium">{lead.assignedTo}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Probability Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Conversion Probability</span>
              <span className="font-medium">{lead.probability}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${lead.probability}%` }}
              />
            </div>
          </div>

          {/* Notes */}
          {lead.notes && lead.notes.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Notes</h3>
              <div className="space-y-2">
                {lead.notes.map((note, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities */}
          {lead.activities && lead.activities.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Recent Activities</h3>
              <div className="space-y-2">
                {lead.activities.map((activity, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{activity.subject}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                      <Badge variant="outline">{activity.type}</Badge>
                    </div>
                    {activity.scheduledAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        Scheduled: {new Date(activity.scheduledAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-white border-gray-300">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Edit Lead Modal
function EditLeadModal({ lead, form, setForm, open, onOpenChange, onSave }: {
  lead: Lead | null;
  form: any;
  setForm: (form: (prev: any) => any) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}) {
  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-2 border-gray-200 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit Lead - {lead.companyName}</span>
          </DialogTitle>
          <DialogDescription>
            Update lead information and pipeline details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-company-name">Company Name *</Label>
              <Input
                id="edit-company-name"
                value={form.companyName}
                onChange={(e) => setForm(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Enter company name"
                className="bg-white border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contact-person">Contact Person *</Label>
              <Input
                id="edit-contact-person"
                value={form.contactPerson}
                onChange={(e) => setForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                placeholder="Enter contact person name"
                className="bg-white border-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="contact@company.com"
                className="bg-white border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={form.phone}
                onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
                className="bg-white border-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-estimated-value">Estimated Value</Label>
              <Input
                id="edit-estimated-value"
                type="number"
                value={form.estimatedValue}
                onChange={(e) => setForm(prev => ({ ...prev, estimatedValue: e.target.value }))}
                placeholder="50000"
                className="bg-white border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-source">Lead Source</Label>
              <Select value={form.source} onValueChange={(value) => setForm(prev => ({ ...prev, source: value }))}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Cold Call">Cold Call</SelectItem>
                  <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                  <SelectItem value="Trade Show">Trade Show</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={form.status} onValueChange={(value) => setForm(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                  <SelectItem value="negotiating">Negotiating</SelectItem>
                  <SelectItem value="closed_won">Closed Won</SelectItem>
                  <SelectItem value="closed_lost">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-probability">Probability (%)</Label>
              <Input
                id="edit-probability"
                type="number"
                min="0"
                max="100"
                value={form.probability}
                onChange={(e) => setForm(prev => ({ ...prev, probability: e.target.value }))}
                placeholder="25"
                className="bg-white border-gray-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-expected-close-date">Expected Close Date</Label>
            <Input
              id="edit-expected-close-date"
              type="date"
              value={form.expectedCloseDate}
              onChange={(e) => setForm(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
              className="bg-white border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              value={form.notes}
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this lead..."
              rows={3}
              className="bg-white border-gray-300"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-white border-gray-300">
            Cancel
          </Button>
          <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Update Lead
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Move Stage Modal
function MoveStageModal({ lead, open, onOpenChange, onMove }: {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMove: (newStatus: string) => void;
}) {
  if (!lead) return null;

  const stages = [
    { id: 'new', name: 'New Leads', color: 'bg-gray-500' },
    { id: 'contacted', name: 'Contacted', color: 'bg-blue-500' },
    { id: 'qualified', name: 'Qualified', color: 'bg-cyan-500' },
    { id: 'proposal_sent', name: 'Proposal Sent', color: 'bg-yellow-500' },
    { id: 'negotiating', name: 'Negotiating', color: 'bg-orange-500' },
    { id: 'closed_won', name: 'Closed Won', color: 'bg-green-500' },
    { id: 'closed_lost', name: 'Closed Lost', color: 'bg-red-500' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-2 border-gray-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span>Move Lead to New Stage</span>
          </DialogTitle>
          <DialogDescription>
            Move {lead.companyName} to a different pipeline stage
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Current Stage:</p>
            <p className="font-medium">{stages.find(s => s.id === lead.status)?.name || lead.status.replace('_', ' ').toUpperCase()}</p>
          </div>

          <div className="space-y-2">
            <Label>Select New Stage</Label>
            <div className="space-y-2">
              {stages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => onMove(stage.id)}
                  className={`w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors ${
                    stage.id === lead.status ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${stage.color}`} />
                    <span className="font-medium">{stage.name}</span>
                    {stage.id === lead.status && (
                      <Badge variant="outline" className="ml-auto">Current</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-white border-gray-300">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
