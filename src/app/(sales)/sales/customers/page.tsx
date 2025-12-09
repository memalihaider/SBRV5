'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import mockData from '@/lib/mock-data';
import { useCurrencyStore } from '@/stores/currency';
import { Customer } from '@/types';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'enterprise' | 'sme' | 'government' | 'individual'>('all');
  const { formatAmount } = useCurrencyStore();

  // Dialog states
  const [addCustomerDialog, setAddCustomerDialog] = useState(false);
  const [viewCustomerDialog, setViewCustomerDialog] = useState(false);
  const [editCustomerDialog, setEditCustomerDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Form states
  const [customerForm, setCustomerForm] = useState({
    companyName: '',
    customerType: 'sme' as Customer['customerType'],
    industry: '',
    website: '',
    taxId: '',
    primaryContact: {
      name: '',
      email: '',
      phone: '',
      designation: '',
    },
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    creditLimit: '',
    paymentTerms: 'Net 30',
    assignedSalesRep: '',
    projectId: 'none',
  });

  const getFilteredCustomers = () => {
    let filtered = mockData.customers;

    if (filterType !== 'all') {
      filtered = filtered.filter(c => c.customerType === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.primaryContact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.primaryContact.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const customers = getFilteredCustomers();
  const totalCustomers = mockData.customers.length;
  const enterpriseCount = mockData.customers.filter(c => c.customerType === 'enterprise').length;
  const smeCount = mockData.customers.filter(c => c.customerType === 'sme').length;
  const totalRevenue = mockData.customers.reduce((sum, c) => sum + c.totalRevenue, 0);

  const getTypeBadge = (type: string) => {
    const badges: Record<string, string> = {
      enterprise: 'bg-purple-100 text-purple-800',
      sme: 'bg-blue-100 text-blue-800',
      government: 'bg-green-100 text-green-800',
      individual: 'bg-gray-100 text-gray-800',
    };
    return badges[type] || 'bg-gray-100 text-gray-800';
  };

  // Event handlers
  const handleAddCustomer = () => {
    if (!customerForm.companyName || !customerForm.primaryContact.name || !customerForm.primaryContact.email) {
      toast.error('Please fill in all required fields (Company Name, Contact Name, Email).');
      return;
    }

    // In a real app, this would make an API call
    toast.success(`${customerForm.companyName} has been added as a customer.`);

    // Reset form
    setCustomerForm({
      companyName: '',
      customerType: 'sme',
      industry: '',
      website: '',
      taxId: '',
      primaryContact: {
        name: '',
        email: '',
        phone: '',
        designation: '',
      },
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
      },
      creditLimit: '',
      paymentTerms: 'Net 30',
      assignedSalesRep: '',
      projectId: 'none',
    });

    setAddCustomerDialog(false);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewCustomerDialog(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerForm({
      companyName: customer.companyName,
      customerType: customer.customerType,
      industry: customer.industry,
      website: customer.website || '',
      taxId: customer.taxId || '',
      primaryContact: customer.primaryContact,
      address: customer.address,
      creditLimit: customer.creditLimit.toString(),
      paymentTerms: customer.paymentTerms,
      assignedSalesRep: customer.assignedSalesRep,
      projectId: 'none',
    });
    setEditCustomerDialog(true);
  };

  const handleUpdateCustomer = () => {
    if (!customerForm.companyName || !customerForm.primaryContact.name || !customerForm.primaryContact.email) {
      toast.error('Please fill in all required fields (Company Name, Contact Name, Email).');
      return;
    }

    // In a real app, this would make an API call
    toast.success(`${customerForm.companyName}'s information has been updated.`);

    setEditCustomerDialog(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customer relationships</p>
        </div>
        <Dialog open={addCustomerDialog} onOpenChange={setAddCustomerDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-2 border-gray-200 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add New Customer</span>
              </DialogTitle>
              <DialogDescription>
                Create a new customer account with complete business information
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name *</Label>
                    <Input
                      id="company-name"
                      value={customerForm.companyName}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="Enter company name"
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-type">Customer Type *</Label>
                    <Select value={customerForm.customerType} onValueChange={(value: Customer['customerType']) => setCustomerForm(prev => ({ ...prev, customerType: value }))}>
                      <SelectTrigger className="bg-white border-gray-300">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                        <SelectItem value="sme">SME</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="individual">Individual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={customerForm.industry}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, industry: e.target.value }))}
                      placeholder="e.g., Manufacturing, Healthcare"
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={customerForm.website}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://www.company.com"
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tax-id">Tax ID</Label>
                    <Input
                      id="tax-id"
                      value={customerForm.taxId}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, taxId: e.target.value }))}
                      placeholder="Tax identification number"
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="credit-limit">Credit Limit</Label>
                    <Input
                      id="credit-limit"
                      type="number"
                      value={customerForm.creditLimit}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, creditLimit: e.target.value }))}
                      placeholder="50000"
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Primary Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Primary Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Contact Name *</Label>
                    <Input
                      id="contact-name"
                      value={customerForm.primaryContact.name}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, primaryContact: { ...prev.primaryContact, name: e.target.value } }))}
                      placeholder="Full name"
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-designation">Designation</Label>
                    <Input
                      id="contact-designation"
                      value={customerForm.primaryContact.designation}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, primaryContact: { ...prev.primaryContact, designation: e.target.value } }))}
                      placeholder="Job title"
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email *</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={customerForm.primaryContact.email}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, primaryContact: { ...prev.primaryContact, email: e.target.value } }))}
                      placeholder="contact@company.com"
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Phone</Label>
                    <Input
                      id="contact-phone"
                      value={customerForm.primaryContact.phone}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, primaryContact: { ...prev.primaryContact, phone: e.target.value } }))}
                      placeholder="+1 (555) 123-4567"
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={customerForm.address.street}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, address: { ...prev.address, street: e.target.value } }))}
                    placeholder="123 Business Street"
                    className="bg-white border-gray-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={customerForm.address.city}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, address: { ...prev.address, city: e.target.value } }))}
                      placeholder="City name"
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={customerForm.address.state}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, address: { ...prev.address, state: e.target.value } }))}
                      placeholder="State or Province"
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={customerForm.address.country}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, address: { ...prev.address, country: e.target.value } }))}
                      placeholder="Country"
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip-code">ZIP/Postal Code</Label>
                    <Input
                      id="zip-code"
                      value={customerForm.address.zipCode}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, address: { ...prev.address, zipCode: e.target.value } }))}
                      placeholder="12345"
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Business Terms */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Business Terms</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-terms">Payment Terms</Label>
                    <Select value={customerForm.paymentTerms} onValueChange={(value) => setCustomerForm(prev => ({ ...prev, paymentTerms: value }))}>
                      <SelectTrigger className="bg-white border-gray-300">
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="Net 15">Net 15</SelectItem>
                        <SelectItem value="Net 30">Net 30</SelectItem>
                        <SelectItem value="Net 45">Net 45</SelectItem>
                        <SelectItem value="Net 60">Net 60</SelectItem>
                        <SelectItem value="2/10 Net 30">2/10 Net 30</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sales-rep">Assigned Sales Rep</Label>
                    <Input
                      id="sales-rep"
                      value={customerForm.assignedSalesRep}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, assignedSalesRep: e.target.value }))}
                      placeholder="Sales representative ID"
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Project Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Project Association (Optional)</h3>
                <div className="space-y-2">
                  <Label htmlFor="projectId">Associate with Project</Label>
                  <Select
                    value={customerForm.projectId}
                    onValueChange={(value) => setCustomerForm(prev => ({ ...prev, projectId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No project association</SelectItem>
                      {mockData.projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name} ({project.projectNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setAddCustomerDialog(false)} className="bg-white border-gray-300">
                Cancel
              </Button>
              <Button onClick={handleAddCustomer} className="bg-green-600 hover:bg-green-700">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Customer Dialog */}
        <Dialog open={viewCustomerDialog} onOpenChange={setViewCustomerDialog}>
          <DialogContent className="bg-white border-2 border-gray-200 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Customer Details</span>
              </DialogTitle>
              <DialogDescription>
                Complete information for {selectedCustomer?.companyName}
              </DialogDescription>
            </DialogHeader>

            {selectedCustomer && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Company Name</Label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.companyName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Customer Type</Label>
                      <div className="mt-1">
                        <Badge className={getTypeBadge(selectedCustomer.customerType)}>
                          {selectedCustomer.customerType.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Industry</Label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.industry}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Website</Label>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedCustomer.website ? (
                          <a href={selectedCustomer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {selectedCustomer.website}
                          </a>
                        ) : (
                          'Not provided'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Tax ID</Label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.taxId || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Total Revenue</Label>
                      <p className="text-sm font-bold text-green-600 mt-1">{formatAmount(selectedCustomer.totalRevenue)}</p>
                    </div>
                  </div>
                </div>

                {/* Primary Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Primary Contact</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Contact Name</Label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.primaryContact.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Designation</Label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.primaryContact.designation}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email</Label>
                      <p className="text-sm text-gray-900 mt-1">
                        <a href={`mailto:${selectedCustomer.primaryContact.email}`} className="text-blue-600 hover:underline">
                          {selectedCustomer.primaryContact.email}
                        </a>
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Phone</Label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.primaryContact.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900">{selectedCustomer.address.street}</p>
                    <p className="text-sm text-gray-900">
                      {selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.zipCode}
                    </p>
                    <p className="text-sm text-gray-900">{selectedCustomer.address.country}</p>
                  </div>
                </div>

                {/* Business Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Credit Limit</Label>
                      <p className="text-sm text-gray-900 mt-1">{formatAmount(selectedCustomer.creditLimit)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Payment Terms</Label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.paymentTerms}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Status</Label>
                      <div className="mt-1">
                        <Badge variant={selectedCustomer.isActive ? 'default' : 'secondary'}>
                          {selectedCustomer.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Active Projects</Label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.projects.length}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Assigned Sales Rep</Label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.assignedSalesRep}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Created Date</Label>
                      <p className="text-sm text-gray-900 mt-1">{selectedCustomer.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setViewCustomerDialog(false)} className="bg-white border-gray-300">
                Close
              </Button>
              {selectedCustomer && (
                <Button onClick={() => { setViewCustomerDialog(false); handleEditCustomer(selectedCustomer); }} className="bg-blue-600 hover:bg-blue-700">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Customer
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Customer Dialog */}
        <Dialog open={editCustomerDialog} onOpenChange={setEditCustomerDialog}>
          <DialogContent className="bg-white border-2 border-gray-200 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Customer</span>
              </DialogTitle>
              <DialogDescription>
                Update customer information and business details
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-company-name">Company Name *</Label>
                    <Input
                      id="edit-company-name"
                      value={customerForm.companyName}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="Enter company name"
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-customer-type">Customer Type *</Label>
                    <Select value={customerForm.customerType} onValueChange={(value: Customer['customerType']) => setCustomerForm(prev => ({ ...prev, customerType: value }))}>
                      <SelectTrigger className="bg-white border-gray-300">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                        <SelectItem value="sme">SME</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="individual">Individual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-industry">Industry</Label>
                    <Input
                      id="edit-industry"
                      value={customerForm.industry}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, industry: e.target.value }))}
                      placeholder="e.g., Manufacturing, Healthcare"
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-website">Website</Label>
                    <Input
                      id="edit-website"
                      value={customerForm.website}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://www.company.com"
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-tax-id">Tax ID</Label>
                    <Input
                      id="edit-tax-id"
                      value={customerForm.taxId}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, taxId: e.target.value }))}
                      placeholder="Tax identification number"
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-credit-limit">Credit Limit</Label>
                    <Input
                      id="edit-credit-limit"
                      type="number"
                      value={customerForm.creditLimit}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, creditLimit: e.target.value }))}
                      placeholder="50000"
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Primary Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Primary Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-contact-name">Contact Name *</Label>
                    <Input
                      id="edit-contact-name"
                      value={customerForm.primaryContact.name}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, primaryContact: { ...prev.primaryContact, name: e.target.value } }))}
                      placeholder="Full name"
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-contact-designation">Designation</Label>
                    <Input
                      id="edit-contact-designation"
                      value={customerForm.primaryContact.designation}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, primaryContact: { ...prev.primaryContact, designation: e.target.value } }))}
                      placeholder="Job title"
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-contact-email">Email *</Label>
                    <Input
                      id="edit-contact-email"
                      type="email"
                      value={customerForm.primaryContact.email}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, primaryContact: { ...prev.primaryContact, email: e.target.value } }))}
                      placeholder="contact@company.com"
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-contact-phone">Phone</Label>
                    <Input
                      id="edit-contact-phone"
                      value={customerForm.primaryContact.phone}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, primaryContact: { ...prev.primaryContact, phone: e.target.value } }))}
                      placeholder="+1 (555) 123-4567"
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                <div className="space-y-2">
                  <Label htmlFor="edit-street">Street Address</Label>
                  <Input
                    id="edit-street"
                    value={customerForm.address.street}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, address: { ...prev.address, street: e.target.value } }))}
                    placeholder="123 Business Street"
                    className="bg-white border-gray-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-city">City</Label>
                    <Input
                      id="edit-city"
                      value={customerForm.address.city}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, address: { ...prev.address, city: e.target.value } }))}
                      placeholder="City name"
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-state">State/Province</Label>
                    <Input
                      id="edit-state"
                      value={customerForm.address.state}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, address: { ...prev.address, state: e.target.value } }))}
                      placeholder="State or Province"
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-country">Country</Label>
                    <Input
                      id="edit-country"
                      value={customerForm.address.country}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, address: { ...prev.address, country: e.target.value } }))}
                      placeholder="Country"
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-zip-code">ZIP/Postal Code</Label>
                    <Input
                      id="edit-zip-code"
                      value={customerForm.address.zipCode}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, address: { ...prev.address, zipCode: e.target.value } }))}
                      placeholder="12345"
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Business Terms */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Business Terms</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-payment-terms">Payment Terms</Label>
                    <Select value={customerForm.paymentTerms} onValueChange={(value) => setCustomerForm(prev => ({ ...prev, paymentTerms: value }))}>
                      <SelectTrigger className="bg-white border-gray-300">
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="Net 15">Net 15</SelectItem>
                        <SelectItem value="Net 30">Net 30</SelectItem>
                        <SelectItem value="Net 45">Net 45</SelectItem>
                        <SelectItem value="Net 60">Net 60</SelectItem>
                        <SelectItem value="2/10 Net 30">2/10 Net 30</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-sales-rep">Assigned Sales Rep</Label>
                    <Input
                      id="edit-sales-rep"
                      value={customerForm.assignedSalesRep}
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, assignedSalesRep: e.target.value }))}
                      placeholder="Sales representative ID"
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setEditCustomerDialog(false)} className="bg-white border-gray-300">
                Cancel
              </Button>
              <Button onClick={handleUpdateCustomer} className="bg-blue-600 hover:bg-blue-700">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Update Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalCustomers}</div>
            <p className="text-sm text-gray-500 mt-1">Active accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Enterprise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{enterpriseCount}</div>
            <p className="text-sm text-gray-500 mt-1">Large accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">SME</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{smeCount}</div>
            <p className="text-sm text-gray-500 mt-1">Small/Medium</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{formatAmount(totalRevenue)}</div>
            <p className="text-sm text-gray-500 mt-1">Customer value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by company, contact, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
              >
                All
              </Button>
              <Button
                variant={filterType === 'enterprise' ? 'default' : 'outline'}
                onClick={() => setFilterType('enterprise')}
              >
                Enterprise
              </Button>
              <Button
                variant={filterType === 'sme' ? 'default' : 'outline'}
                onClick={() => setFilterType('sme')}
              >
                SME
              </Button>
              <Button
                variant={filterType === 'government' ? 'default' : 'outline'}
                onClick={() => setFilterType('government')}
              >
                Government
              </Button>
              <Button
                variant={filterType === 'individual' ? 'default' : 'outline'}
                onClick={() => setFilterType('individual')}
              >
                Individual
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Accounts ({customers.length} accounts)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Company</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact Person</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Revenue</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Active Projects</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{customer.companyName}</div>
                      <div className="text-sm text-gray-500">{customer.industry}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900">{customer.primaryContact.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{customer.primaryContact.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{customer.primaryContact.phone}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={getTypeBadge(customer.customerType)}>
                        {customer.customerType.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-bold text-green-600">{formatAmount(customer.totalRevenue)}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-medium text-gray-900">{customer.projects.length}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewCustomer(customer)}>
                          View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEditCustomer(customer)}>
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {customers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-lg font-medium">No customers found</p>
              <p className="text-sm">Try adjusting your filters or search term</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
