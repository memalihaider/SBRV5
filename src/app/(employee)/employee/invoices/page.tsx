"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, DollarSign, Clock, CheckCircle, AlertCircle, Download, Eye, Calendar, Receipt } from 'lucide-react';
import { toast } from 'sonner';

import EmployeeInvoiceFormDialog from '@/components/employee-invoice-form-dialog';
import InvoiceDetailsDialog from '@/components/invoice-details-dialog';
import InvoicePaymentDialog from '@/components/invoice-payment-dialog';

export default function EmployeeInvoicesPage() {
  const invoiceStats = [
    {
      title: 'Total Invoices',
      value: '24',
      change: '+3',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Payment',
      value: '$12,450',
      change: '+$2,100',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Paid This Month',
      value: '$8,750',
      change: '+$1,250',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Average Processing',
      value: '5 days',
      change: '-1 day',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const [recentInvoices, setRecentInvoices] = useState([
    {
      id: 1,
      invoiceNumber: 'INV-2024-0124',
      description: 'Business Travel - Client Meeting',
      amount: '2450.00',
      status: 'pending',
      dueDate: '2024-12-15',
      issuedDate: '2024-11-28',
      category: 'Travel',
    },
    {
      id: 2,
      invoiceNumber: 'INV-2024-0123',
      description: 'Software License Renewal',
      amount: '1299.00',
      status: 'paid',
      dueDate: '2024-12-01',
      issuedDate: '2024-11-25',
      category: 'Software',
    },
    {
      id: 3,
      invoiceNumber: 'INV-2024-0122',
      description: 'Office Supplies - Q4',
      amount: '345.50',
      status: 'paid',
      dueDate: '2024-11-30',
      issuedDate: '2024-11-20',
      category: 'Supplies',
    },
    {
      id: 4,
      invoiceNumber: 'INV-2024-0121',
      description: 'Training Course - Leadership Development',
      amount: '850.00',
      status: 'overdue',
      dueDate: '2024-11-25',
      issuedDate: '2024-11-15',
      category: 'Training',
    },
  ]);

  const expenseCategories = [
    {
      name: 'Travel',
      total: '$8,450',
      count: 8,
      pending: '$3,200',
      color: 'bg-blue-500',
    },
    {
      name: 'Software',
      total: '$4,250',
      count: 5,
      pending: '$1,299',
      color: 'bg-green-500',
    },
    {
      name: 'Supplies',
      total: '$2,180',
      count: 6,
      pending: '$450',
      color: 'bg-purple-500',
    },
    {
      name: 'Training',
      total: '$3,200',
      count: 4,
      pending: '$850',
      color: 'bg-yellow-500',
    },
  ];

  const [paymentHistory, setPaymentHistory] = useState([
    {
      id: 1,
      invoiceNumber: 'INV-2024-0118',
      description: 'Conference Registration',
      amount: '$599.00',
      paidDate: '2024-11-10',
      method: 'Company Card',
    },
    {
      id: 2,
      invoiceNumber: 'INV-2024-0115',
      description: 'Home Office Setup',
      amount: '$1,250.00',
      paidDate: '2024-11-05',
      method: 'Direct Deposit',
    },
    {
      id: 3,
      invoiceNumber: 'INV-2024-0112',
      description: 'Professional Development Books',
      amount: '$145.50',
      paidDate: '2024-10-28',
      method: 'Company Card',
    },
  ]);

  const handleCreateInvoice = (invoice: any) => {
    setRecentInvoices((prev) => [{
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      description: invoice.description,
      amount: invoice.amount,
      status: invoice.status,
      dueDate: invoice.dueDate,
      issuedDate: invoice.issuedDate,
      category: invoice.category,
    }, ...prev]);
  };

  const handleRecordPayment = (id: number, method: string) => {
    const inv = recentInvoices.find((i) => i.id === id);
    if (!inv) return toast.error('Invoice not found');
    setRecentInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'paid' } : i)));
    setPaymentHistory((prev) => [{ id: Date.now(), invoiceNumber: inv.invoiceNumber, description: inv.description, amount: `$${Number(inv.amount).toFixed(2)}`, paidDate: new Date().toISOString(), method }, ...prev]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Travel':
        return <Badge className="bg-blue-100 text-blue-800">Travel</Badge>;
      case 'Software':
        return <Badge className="bg-green-100 text-green-800">Software</Badge>;
      case 'Supplies':
        return <Badge className="bg-purple-100 text-purple-800">Supplies</Badge>;
      case 'Training':
        return <Badge className="bg-yellow-100 text-yellow-800">Training</Badge>;
      default:
        return <Badge variant="secondary">{category}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-red-600 to-red-700 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white">My Invoices</h1>
        <p className="text-red-100 mt-1 text-lg">Track your expense reimbursements and invoice payments</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {invoiceStats.map((stat, index) => {
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
        {/* Recent Invoices */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 rounded-t-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl text-gray-900">Recent Invoices</CardTitle>
                <CardDescription className="text-gray-600 font-medium">
                  Your latest expense reimbursements and invoices
                </CardDescription>
              </div>
              <EmployeeInvoiceFormDialog categories={expenseCategories.map(c => c.name)} onCreate={handleCreateInvoice}>
                <Button className="bg-red-600 hover:bg-red-700 text-white shadow-md">
                  <Receipt className="h-4 w-4 mr-2" />
                  Submit Expense
                </Button>
              </EmployeeInvoiceFormDialog>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <FileText className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {invoice.invoiceNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          {invoice.description}
                        </p>
                        <p className="text-xs text-gray-400">
                          Issued: {new Date(invoice.issuedDate).toLocaleDateString()} • Due: {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">${Number(invoice.amount).toLocaleString()}</p>
                        {getCategoryBadge(invoice.category)}
                      </div>
                      {getStatusBadge(invoice.status)}
                      <InvoiceDetailsDialog invoice={invoice}>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </InvoiceDetailsDialog>
                      {invoice.status !== 'paid' && (
                        <InvoicePaymentDialog invoice={invoice} onPay={handleRecordPayment}>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                            Pay
                          </Button>
                        </InvoicePaymentDialog>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Expense Categories</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Breakdown of expenses by category
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {expenseCategories.map((category, index) => (
                <div key={index} className="p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                      <h3 className="text-sm font-semibold text-gray-900">{category.name}</h3>
                    </div>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-300">
                      {category.count} invoices
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total</p>
                      <p className="font-semibold text-gray-900">{category.total}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Pending</p>
                      <p className="font-semibold text-yellow-600">{category.pending}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card className="shadow-lg">
        <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <CardTitle className="text-xl text-gray-900">Payment History</CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Recently processed expense reimbursements
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {payment.invoiceNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        {payment.description}
                      </p>
                      <p className="text-xs text-gray-400">
                        Paid: {new Date(payment.paidDate).toLocaleDateString()} • {payment.method}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <p className="text-sm font-bold text-green-600">{payment.amount}</p>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                    <Download className="h-4 w-4 mr-1" />
                    Receipt
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader className="bg-linear-to-r from-emerald-50 to-teal-50 rounded-t-lg">
          <CardTitle className="text-xl text-gray-900">Expense Actions</CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Common expense and invoice management tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="p-5 border-2 border-red-200 rounded-xl hover:bg-linear-to-br hover:from-red-50 hover:to-green-50 hover:border-red-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <Receipt className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Submit Expense</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Create new expense reimbursement request
              </p>
            </Button>
            <Button className="p-5 border-2 border-blue-200 rounded-xl hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">View All Invoices</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Browse complete invoice history
              </p>
            </Button>
            <Button className="p-5 border-2 border-purple-200 rounded-xl hover:bg-linear-to-br hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Download className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Export Reports</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Download expense reports and summaries
              </p>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}