'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Copy,
  Trash2,
  Plus,
  Calendar,
  User,
  Building2,
  Mail,
  Phone,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  Send,
  Archive
} from 'lucide-react';
import Link from 'next/link';
import mockData from '@/lib/mock-data';
import { useCurrencyStore } from '@/stores/currency';
import { Customer } from '@/types';

// Use shared quotations data from mockData
const quotations = mockData.quotations;

// Helper function to get customer info
const getCustomerInfo = (customerId: string) => {
  return mockData.getCustomerById(customerId);
};

// Helper function to get user info
const getUserInfo = (userId: string) => {
  // For now, return a placeholder. In a real app, you'd have a users table
  return { name: `User ${userId.split('-')[1]}` };
};

// Helper function to get product info
const getProductInfo = (productId: string) => {
  return mockData.getProductById(productId);
};

// Calculate quotation totals and enrich data
const enrichedQuotations = quotations.map(quotation => {
  const customer = quotation.customerId ? getCustomerInfo(quotation.customerId) : null;
  const createdByUser = quotation.createdBy ? getUserInfo(quotation.createdBy) : { name: 'System' };
  
  // Calculate totals from items
  const subtotal = quotation.items.reduce((sum, item) => sum + (item.totalPrice || item.amount || 0), 0);
  
  return {
    ...quotation,
    customerName: customer?.companyName || 'Unknown Customer',
    customerCompany: customer?.companyName || 'Unknown Company',
    createdByName: createdByUser.name,
    subtotal,
    totalAmount: quotation.totalAmount,
    issueDate: quotation.createdAt,
    validUntil: quotation.validUntil,
    status: quotation.status,
    items: quotation.items.map(item => {
      const product = getProductInfo(item.productId);
      return {
        ...item,
        productName: product?.name || 'Unknown Product',
        productSku: product?.sku || 'N/A'
      };
    })
  };
});

export default function SalesQuotationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const itemsPerPage = 15;
  const { formatAmount } = useCurrencyStore();

  // Filter quotations based on search and filters
  const filteredQuotations = useMemo(() => {
    return enrichedQuotations.filter(quotation => {
      const matchesSearch = quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           quotation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           quotation.customerCompany.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
      const matchesCustomer = customerFilter === 'all' || quotation.customerId === customerFilter;

      let matchesDate = true;
      if (dateFilter !== 'all' && quotation.issueDate) {
        const now = new Date();
        const quotationDate = new Date(quotation.issueDate);
        const daysDiff = Math.floor((now.getTime() - quotationDate.getTime()) / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case 'today':
            matchesDate = daysDiff === 0;
            break;
          case 'week':
            matchesDate = daysDiff <= 7;
            break;
          case 'month':
            matchesDate = daysDiff <= 30;
            break;
          case 'quarter':
            matchesDate = daysDiff <= 90;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesCustomer && matchesDate;
    });
  }, [searchTerm, statusFilter, customerFilter, dateFilter, enrichedQuotations]);

  // Pagination
  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
  const paginatedQuotations = filteredQuotations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const quotationStats = [
    { title: 'Total Quotations', value: enrichedQuotations.length.toString(), change: '+24', icon: FileText, color: 'blue' },
    { title: 'Pending Review', value: enrichedQuotations.filter(q => q.status === 'sent' || q.status === 'under_review').length.toString(), change: '+8', icon: Clock, color: 'yellow' },
    { title: 'Approved', value: enrichedQuotations.filter(q => q.status === 'approved').length.toString(), change: '+12', icon: CheckCircle, color: 'green' },
    { title: 'Total Value', value: formatAmount(enrichedQuotations.reduce((sum, q) => sum + q.totalAmount, 0)), change: '+18%', icon: DollarSign, color: 'purple' },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'destructive' | 'secondary' | 'outline', label: string, color: string }> = {
      draft: { variant: 'secondary', label: 'DRAFT', color: 'gray' },
      sent: { variant: 'default', label: 'SENT', color: 'blue' },
      under_review: { variant: 'outline', label: 'UNDER REVIEW', color: 'yellow' },
      approved: { variant: 'default', label: 'APPROVED', color: 'green' },
      rejected: { variant: 'destructive', label: 'REJECTED', color: 'red' },
      expired: { variant: 'outline', label: 'EXPIRED', color: 'orange' },
      converted: { variant: 'default', label: 'CONVERTED', color: 'purple' },
    };
    return statusMap[status] || statusMap.draft;
  };

  const handleViewQuotation = (quotation: any) => {
    setSelectedQuotation(quotation);
    setIsViewDialogOpen(true);
  };

  const handleDuplicateQuotation = (quotation: any) => {
    // In a real app, this would create a new quotation based on the existing one
    alert(`Duplicating quotation ${quotation.quotationNumber}`);
  };

  const handleConvertToInvoice = (quotation: any) => {
    // In a real app, this would convert the quotation to an invoice
    alert(`Converting quotation ${quotation.quotationNumber} to invoice`);
  };

  const handleExportQuotations = () => {
    // In a real app, this would export the filtered quotations
    alert('Exporting quotations to Excel/CSV');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Sales Quotations</h1>
            <p className="text-blue-100 mt-1 text-lg">Create and manage comprehensive sales proposals</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleExportQuotations}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Link href="/sales/quotations/new">
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                <Plus className="h-5 w-5 mr-2" />
                New Quotation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quotationStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">{stat.title}</CardTitle>
                <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                  <IconComponent className={`h-5 w-5 text-${stat.color}-600`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-sm mt-1">
                  <span className="text-green-600 font-semibold">{stat.change}</span>
                  <span className="text-gray-500"> this quarter</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters and Search */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search quotations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Customer</Label>
              <Select value={customerFilter} onValueChange={setCustomerFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {mockData.customers.slice(0, 10).map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCustomerFilter('all');
                setDateFilter('all');
                setCurrentPage(1);
              }}>
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotations Table */}
      <Card className="shadow-lg">
        <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-gray-900">Quotations</CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                {filteredQuotations.length} of {enrichedQuotations.length} quotations
              </CardDescription>
            </div>
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quotation #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedQuotations.map((quotation) => {
                  const statusBadge = getStatusBadge(quotation.status);
                  return (
                    <TableRow key={quotation.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-bold text-gray-900">{quotation.quotationNumber}</div>
                          <div className="text-xs text-gray-500">by {quotation.createdByName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{quotation.customerName}</div>
                          <div className="text-sm text-gray-500">{quotation.customerCompany}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadge.variant} className={`bg-${statusBadge.color}-100 text-${statusBadge.color}-800`}>
                          {statusBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{quotation.issueDate ? new Date(quotation.issueDate).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>{quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>{quotation.items.length} items</TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        {formatAmount(quotation.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewQuotation(quotation)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Link href="/sales/quotations/new">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDuplicateQuotation(quotation)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleConvertToInvoice(quotation)}
                            className="h-8 w-8 p-0"
                            disabled={quotation.status !== 'approved'}
                          >
                            <FileCheck className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredQuotations.length)} of {filteredQuotations.length} quotations
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Quotation Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="bg-white border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">Quotation Details</DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              {selectedQuotation?.quotationNumber} - {selectedQuotation?.customerName}
            </DialogDescription>
          </DialogHeader>

          {selectedQuotation && (
            <div className="space-y-6 bg-white">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Quotation Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium text-gray-700">Number:</span> <span className="text-gray-900">{selectedQuotation.quotationNumber}</span></p>
                    <p><span className="font-medium text-gray-700">Status:</span> <Badge variant={getStatusBadge(selectedQuotation.status).variant} className="ml-2">{getStatusBadge(selectedQuotation.status).label}</Badge></p>
                    <p><span className="font-medium text-gray-700">Issue Date:</span> <span className="text-gray-900">{new Date(selectedQuotation.issueDate).toLocaleDateString()}</span></p>
                    <p><span className="font-medium text-gray-700">Valid Until:</span> <span className="text-gray-900">{new Date(selectedQuotation.validUntil).toLocaleDateString()}</span></p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium text-gray-700">Name:</span> <span className="text-gray-900">{selectedQuotation.customerName}</span></p>
                    <p><span className="font-medium text-gray-700">Company:</span> <span className="text-gray-900">{selectedQuotation.customerCompany}</span></p>
                    <p><span className="font-medium text-gray-700">Email:</span> <span className="text-gray-900">{selectedQuotation.customerEmail}</span></p>
                    <p><span className="font-medium text-gray-700">Phone:</span> <span className="text-gray-900">{selectedQuotation.customerPhone}</span></p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Quotation Items</h4>
                <div className="rounded-md border border-gray-300 bg-white shadow-sm">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="font-semibold text-gray-900">Item</TableHead>
                        <TableHead className="font-semibold text-gray-900">Description</TableHead>
                        <TableHead className="text-right font-semibold text-gray-900">Qty</TableHead>
                        <TableHead className="text-right font-semibold text-gray-900">Rate</TableHead>
                        <TableHead className="text-right font-semibold text-gray-900">Discount</TableHead>
                        <TableHead className="text-right font-semibold text-gray-900">Tax</TableHead>
                        <TableHead className="text-right font-semibold text-gray-900">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedQuotation.items.map((item: any, index: number) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-gray-900">{item.productName}</TableCell>
                          <TableCell className="text-gray-700">{item.description || 'N/A'}</TableCell>
                          <TableCell className="text-right text-gray-900">{item.quantity}</TableCell>
                          <TableCell className="text-right text-gray-900">{formatAmount(item.rate)}</TableCell>
                          <TableCell className="text-right text-gray-900">{item.discount}%</TableCell>
                          <TableCell className="text-right text-gray-900">{item.tax}%</TableCell>
                          <TableCell className="text-right font-medium text-gray-900">
                            {formatAmount((item.quantity * item.rate * (1 - item.discount / 100) * (1 + item.tax / 100)))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Totals */}
              <div className="grid grid-cols-2 gap-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Subtotal:</span>
                    <span className="font-medium text-gray-900">{formatAmount(selectedQuotation.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Discount:</span>
                    <span className="font-medium text-red-600">-{formatAmount(selectedQuotation.totalDiscount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Tax:</span>
                    <span className="font-medium text-gray-900">{formatAmount(selectedQuotation.totalTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Service Charges:</span>
                    <span className="font-medium text-gray-900">{formatAmount(selectedQuotation.serviceCharges)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    Total: {formatAmount(selectedQuotation.totalAmount)}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedQuotation.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">{selectedQuotation.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 bg-white">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="border-gray-300 hover:bg-gray-50">
                  Close
                </Button>
                <Button variant="outline" onClick={() => handleDuplicateQuotation(selectedQuotation)} className="border-gray-300 hover:bg-gray-50">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
                <Link href="/sales/quotations/new">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                {selectedQuotation.status === 'approved' && (
                  <Button onClick={() => handleConvertToInvoice(selectedQuotation)} className="bg-green-600 hover:bg-green-700 text-white">
                    <FileCheck className="h-4 w-4 mr-2" />
                    Convert to Invoice
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
