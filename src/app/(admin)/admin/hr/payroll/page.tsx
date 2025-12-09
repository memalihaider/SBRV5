// 'use client';

// import { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { DollarSign, Users, Calendar, CheckCircle, Clock, AlertCircle, Eye, Download, FileText, Calculator, Plus } from 'lucide-react';
// import { mockData } from '@/lib/mock-data';
// import { Payroll } from '@/types';
// import { toast } from 'sonner';

// export default function PayrollPage() {
//   const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
//   const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
//   const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
//   const [isPayslipDialogOpen, setIsPayslipDialogOpen] = useState(false);
//   const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
//   const [selectedPeriod, setSelectedPeriod] = useState<string>('');

//   // Get current month payroll data
//   const currentDate = new Date();
//   const currentMonth = currentDate.getMonth();
//   const currentYear = currentDate.getFullYear();

//   const currentMonthPayrolls = mockData.payrolls.filter(payroll => {
//     const payrollDate = payroll.period.startDate;
//     return payrollDate.getMonth() === currentMonth && payrollDate.getFullYear() === currentYear;
//   });

//   // Calculate stats
//   const totalEmployees = mockData.employees.filter(e => e.isActive).length;
//   const processedPayrolls = currentMonthPayrolls.filter(p => p.status === 'paid' || p.status === 'processed').length;
//   const pendingPayrolls = currentMonthPayrolls.filter(p => p.status === 'pending').length;
//   const totalPayrollAmount = currentMonthPayrolls.reduce((sum, p) => sum + p.netPay, 0);

//   const payrollStats = [
//     {
//       title: 'Monthly Payroll',
//       value: `$${(totalPayrollAmount / 1000).toFixed(0)}K`,
//       change: '+3%',
//       icon: DollarSign,
//       color: 'text-green-600',
//       bgColor: 'bg-green-100',
//     },
//     {
//       title: 'Employees Paid',
//       value: processedPayrolls.toString(),
//       change: `+${Math.round((processedPayrolls / totalEmployees) * 100)}%`,
//       icon: Users,
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-100',
//     },
//     {
//       title: 'Pending Payments',
//       value: pendingPayrolls.toString(),
//       change: `-${Math.round((pendingPayrolls / totalEmployees) * 100)}%`,
//       icon: Clock,
//       color: 'text-yellow-600',
//       bgColor: 'bg-yellow-100',
//     },
//     {
//       title: 'Payment Issues',
//       value: '2',
//       change: '-1',
//       icon: AlertCircle,
//       color: 'text-red-600',
//       bgColor: 'bg-red-100',
//     },
//   ];

//   // Get recent payrolls (last 3 months)
//   const recentPayrolls = [];
//   for (let i = 0; i < 3; i++) {
//     const targetMonth = new Date(currentYear, currentMonth - i, 1);
//     const monthPayrolls = mockData.payrolls.filter(payroll => {
//       const payrollDate = payroll.period.startDate;
//       return payrollDate.getMonth() === targetMonth.getMonth() && payrollDate.getFullYear() === targetMonth.getFullYear();
//     });

//     if (monthPayrolls.length > 0) {
//       const totalAmount = monthPayrolls.reduce((sum, p) => sum + p.netPay, 0);
//       recentPayrolls.push({
//         period: targetMonth.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
//         employees: monthPayrolls.length,
//         totalAmount: `$${totalAmount.toLocaleString()}`,
//         status: monthPayrolls.every(p => p.status === 'paid') ? 'completed' :
//                 monthPayrolls.some(p => p.status === 'processed') ? 'processing' : 'pending',
//         processedDate: targetMonth.toISOString().split('T')[0],
//         paymentDate: new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 15).toISOString().split('T')[0],
//       });
//     }
//   }

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'completed':
//         return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
//       case 'processing':
//         return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
//       case 'pending':
//         return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
//       case 'paid':
//         return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
//       case 'processed':
//         return <Badge className="bg-blue-100 text-blue-800">Processed</Badge>;
//       default:
//         return <Badge variant="secondary">Unknown</Badge>;
//     }
//   };

//   const handleViewPayroll = (payroll: Payroll) => {
//     setSelectedPayroll(payroll);
//     setIsViewDialogOpen(true);
//   };

//   const handleProcessPayroll = () => {
//     setIsProcessDialogOpen(true);
//   };

//   const handleGeneratePayslips = () => {
//     setIsPayslipDialogOpen(true);
//   };

//   const handlePayrollReports = () => {
//     setIsReportDialogOpen(true);
//   };

//   const handleProcessPayrollSubmit = () => {
//     toast.success('Payroll processing started successfully!');
//     setIsProcessDialogOpen(false);
//   };

//   const handleGeneratePayslipsSubmit = () => {
//     toast.success('Payslips generated and sent successfully!');
//     setIsPayslipDialogOpen(false);
//   };

//   const handleGenerateReport = () => {
//     toast.success('Payroll report generated successfully!');
//     setIsReportDialogOpen(false);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="bg-linear-to-r from-red-600 to-red-700 rounded-xl p-6 shadow-lg">
//         <h1 className="text-3xl font-bold text-white">Payroll Management</h1>
//         <p className="text-red-100 mt-1 text-lg">Process and manage employee payroll</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {payrollStats.map((stat, index) => {
//           const IconComponent = stat.icon;
//           return (
//             <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-red-200">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-semibold text-gray-700">
//                   {stat.title}
//                 </CardTitle>
//                 <div className={`p-2 ${stat.bgColor} rounded-lg`}>
//                   <IconComponent className={`h-5 w-5 ${stat.color}`} />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
//                 <p className="text-sm mt-1">
//                   <span
//                     className={
//                       stat.change.startsWith('+') && !stat.change.includes('-')
//                         ? 'text-green-600 font-semibold'
//                         : stat.change.startsWith('-')
//                         ? 'text-red-600 font-semibold'
//                         : 'text-gray-600 font-semibold'
//                     }
//                   >
//                     {stat.change}
//                   </span>{' '}
//                   <span className="text-gray-500">from last month</span>
//                 </p>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Payrolls */}
//         <Card className="shadow-lg">
//           <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 rounded-t-lg">
//             <CardTitle className="text-xl text-gray-900">Recent Payrolls</CardTitle>
//             <CardDescription className="text-gray-600 font-medium">
//               Payroll processing history
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="pt-6">
//             <div className="space-y-4">
//               {recentPayrolls.map((payroll, index) => (
//                 <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border">
//                   <div className="flex-1">
//                     <div className="flex items-center space-x-3">
//                       <div className="p-2 bg-red-100 rounded-lg">
//                         <Calendar className="h-5 w-5 text-red-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-semibold text-gray-900">
//                           {payroll.period}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           {payroll.employees} employees • {payroll.totalAmount}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     {getStatusBadge(payroll.status)}
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="text-red-600 border-red-300 hover:bg-red-50"
//                       onClick={() => handleViewPayroll(currentMonthPayrolls[index] || currentMonthPayrolls[0])}
//                     >
//                       View
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Current Month Payroll */}
//         <Card className="shadow-lg">
//           <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 rounded-t-lg">
//             <CardTitle className="text-xl text-gray-900">Current Month Payroll</CardTitle>
//             <CardDescription className="text-gray-600 font-medium">
//               {currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} employee payments
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="pt-6">
//             <div className="space-y-4 max-h-96 overflow-y-auto">
//               {currentMonthPayrolls.slice(0, 10).map((payroll) => {
//                 const employee = mockData.getEmployeeById(payroll.employeeId);
//                 return (
//                   <div key={payroll.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border">
//                     <div className="flex-1">
//                       <div className="flex items-center space-x-3">
//                         <div className="shrink-0 h-10 w-10">
//                           <div className="h-10 w-10 rounded-full bg-linear-to-br from-red-400 to-red-600 flex items-center justify-center">
//                             <span className="text-sm font-semibold text-white">
//                               {employee ? `${employee.firstName[0]}${employee.lastName[0]}` : '??'}
//                             </span>
//                           </div>
//                         </div>
//                         <div>
//                           <p className="text-sm font-semibold text-gray-900">
//                             {employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee'}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {employee?.department || 'N/A'}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm font-semibold text-gray-900">
//                         ${payroll.netPay.toLocaleString()}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         Base: ${payroll.basicSalary.toLocaleString()}
//                       </p>
//                     </div>
//                     <div className="ml-4">
//                       {getStatusBadge(payroll.status)}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Quick Actions */}
//       <Card className="shadow-lg">
//         <CardHeader className="bg-linear-to-r from-red-50 to-red-100 rounded-t-lg">
//           <CardTitle className="text-xl text-gray-900">Payroll Actions</CardTitle>
//           <CardDescription className="text-gray-600 font-medium">
//             Common payroll management tasks
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="pt-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Button
//               className="p-5 border-2 border-red-200 rounded-xl hover:bg-linear-to-br hover:from-red-50 hover:to-red-100 hover:border-red-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl"
//               onClick={handleProcessPayroll}
//             >
//               <div className="flex items-center space-x-3 mb-2">
//                 <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
//                   <CheckCircle className="h-5 w-5 text-red-600" />
//                 </div>
//                 <h3 className="font-bold text-gray-900 text-lg">Process Payroll</h3>
//               </div>
//               <p className="text-sm text-gray-600 font-medium">
//                 Run payroll for current month
//               </p>
//             </Button>
//             <Button
//               className="p-5 border-2 border-red-200 rounded-xl hover:bg-linear-to-br hover:from-red-50 hover:to-red-100 hover:border-red-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl"
//               onClick={handleGeneratePayslips}
//             >
//               <div className="flex items-center space-x-3 mb-2">
//                 <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
//                   <FileText className="h-5 w-5 text-red-600" />
//                 </div>
//                 <h3 className="font-bold text-gray-900 text-lg">Generate Payslips</h3>
//               </div>
//               <p className="text-sm text-gray-600 font-medium">
//                 Create and distribute payslips
//               </p>
//             </Button>
//             <Button
//               className="p-5 border-2 border-red-200 rounded-xl hover:bg-linear-to-br hover:from-red-50 hover:to-red-100 hover:border-red-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl"
//               onClick={handlePayrollReports}
//             >
//               <div className="flex items-center space-x-3 mb-2">
//                 <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
//                   <Calculator className="h-5 w-5 text-red-600" />
//                 </div>
//                 <h3 className="font-bold text-gray-900 text-lg">Payroll Reports</h3>
//               </div>
//               <p className="text-sm text-gray-600 font-medium">
//                 Generate payroll analytics
//               </p>
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* View Payroll Dialog */}
//       <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
//         <DialogContent className="bg-white border-2 border-gray-200 max-w-4xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-semibold text-gray-900">Payroll Details</DialogTitle>
//             <DialogDescription className="text-gray-600">
//               Detailed payroll information
//             </DialogDescription>
//           </DialogHeader>
//           {selectedPayroll && (
//             <div className="space-y-6">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-sm font-medium text-gray-700">Employee</Label>
//                   <p className="text-sm text-gray-900">
//                     {(() => {
//                       const employee = mockData.getEmployeeById(selectedPayroll.employeeId);
//                       return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
//                     })()}
//                   </p>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-700">Period</Label>
//                   <p className="text-sm text-gray-900">
//                     {selectedPayroll.period.startDate.toLocaleDateString()} - {selectedPayroll.period.endDate.toLocaleDateString()}
//                   </p>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-700">Status</Label>
//                   <div className="mt-1">
//                     {getStatusBadge(selectedPayroll.status)}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-700">Payment Method</Label>
//                   <p className="text-sm text-gray-900">{selectedPayroll.paymentMethod}</p>
//                 </div>
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Breakdown</h3>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Description</TableHead>
//                       <TableHead className="text-right">Amount</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     <TableRow>
//                       <TableCell>Basic Salary</TableCell>
//                       <TableCell className="text-right">${selectedPayroll.basicSalary.toLocaleString()}</TableCell>
//                     </TableRow>
//                     {selectedPayroll.allowances.map((allowance, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{allowance.type}</TableCell>
//                         <TableCell className="text-right">${allowance.amount.toLocaleString()}</TableCell>
//                       </TableRow>
//                     ))}
//                     <TableRow className="font-semibold">
//                       <TableCell>Gross Pay</TableCell>
//                       <TableCell className="text-right">${selectedPayroll.grossPay.toLocaleString()}</TableCell>
//                     </TableRow>
//                     {selectedPayroll.deductions.map((deduction, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{deduction.type}</TableCell>
//                         <TableCell className="text-right text-red-600">-${deduction.amount.toLocaleString()}</TableCell>
//                       </TableRow>
//                     ))}
//                     <TableRow className="font-bold text-lg">
//                       <TableCell>Net Pay</TableCell>
//                       <TableCell className="text-right">${selectedPayroll.netPay.toLocaleString()}</TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Process Payroll Dialog */}
//       <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
//         <DialogContent className="bg-white border-2 border-gray-200 max-w-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-semibold text-gray-900">Process Payroll</DialogTitle>
//             <DialogDescription className="text-gray-600">
//               Run payroll calculation for the selected period
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="period">Payroll Period</Label>
//               <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select payroll period" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="current">Current Month ({currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })})</SelectItem>
//                   <SelectItem value="previous">Previous Month</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <p className="text-sm text-blue-800">
//                 This will calculate salaries for {totalEmployees} active employees and prepare payroll for processing.
//               </p>
//             </div>
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={() => setIsProcessDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 className="bg-red-600 hover:bg-red-700 text-white"
//                 onClick={handleProcessPayrollSubmit}
//               >
//                 Start Processing
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Generate Payslips Dialog */}
//       <Dialog open={isPayslipDialogOpen} onOpenChange={setIsPayslipDialogOpen}>
//         <DialogContent className="bg-white border-2 border-gray-200 max-w-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-semibold text-gray-900">Generate Payslips</DialogTitle>
//             <DialogDescription className="text-gray-600">
//               Create and distribute payslips to employees
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="payslipPeriod">Period</Label>
//               <Select>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select period" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="current">Current Month</SelectItem>
//                   <SelectItem value="previous">Previous Month</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label htmlFor="distribution">Distribution Method</Label>
//               <Select>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select method" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="email">Email to Employees</SelectItem>
//                   <SelectItem value="download">Download PDFs</SelectItem>
//                   <SelectItem value="both">Both Email and Download</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="bg-green-50 p-4 rounded-lg">
//               <p className="text-sm text-green-800">
//                 Payslips will be generated for {processedPayrolls} processed payroll records.
//               </p>
//             </div>
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={() => setIsPayslipDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 className="bg-red-600 hover:bg-red-700 text-white"
//                 onClick={handleGeneratePayslipsSubmit}
//               >
//                 <Download className="h-4 w-4 mr-2" />
//                 Generate Payslips
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Payroll Reports Dialog */}
//       <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
//         <DialogContent className="bg-white border-2 border-gray-200 max-w-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-semibold text-gray-900">Payroll Reports</DialogTitle>
//             <DialogDescription className="text-gray-600">
//               Generate comprehensive payroll analytics and reports
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="reportType">Report Type</Label>
//               <Select>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select report type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="summary">Payroll Summary</SelectItem>
//                   <SelectItem value="department">Department-wise Report</SelectItem>
//                   <SelectItem value="tax">Tax Report</SelectItem>
//                   <SelectItem value="yearly">Yearly Comparison</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label htmlFor="reportPeriod">Period</Label>
//               <Select>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select period" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="current">Current Month</SelectItem>
//                   <SelectItem value="quarter">Current Quarter</SelectItem>
//                   <SelectItem value="year">Current Year</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label htmlFor="format">Format</Label>
//               <Select>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select format" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="pdf">PDF Report</SelectItem>
//                   <SelectItem value="excel">Excel Spreadsheet</SelectItem>
//                   <SelectItem value="csv">CSV Export</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <p className="text-sm text-blue-800">
//                 Report will include data for {totalEmployees} employees and total payroll of ${(totalPayrollAmount / 1000).toFixed(0)}K.
//               </p>
//             </div>
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 className="bg-red-600 hover:bg-red-700 text-white"
//                 onClick={handleGenerateReport}
//               >
//                 <FileText className="h-4 w-4 mr-2" />
//                 Generate Report
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
// neww code// app/payroll/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, Users, Calendar, CheckCircle, Clock, AlertCircle, Eye, Download, FileText, Calculator, Mail, Edit, User, Phone, Briefcase, CreditCard, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { fetchEmployees, fetchSalaryRecords, generatePayroll, updateSalaryStatus, getPayrollStats, type Employee, type SalaryRecord, type Allowance, type Deduction } from '@/lib/salary';
import { generateCustomInvoicePDF, downloadPDF } from '@/lib/pdf-generator';

export default function PayrollPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState<string | null>(null);
  
  const [customInvoiceData, setCustomInvoiceData] = useState({
    // Company Information
    companyName: 'TechCorp Inc.',
    companySubtitle: 'SALARY INVOICE',
    companyAddress: '123 Business Street, Lahore, Pakistan',
    companyPhone: '+92 300 1234567',
    companyEmail: 'accounts@techcorp.com',
    
    // Invoice Details
    invoiceNumber: '',
    invoiceDate: new Date().toLocaleDateString(),
    
    // Payment Information
    bankName: 'UBL Bank',
    accountNumber: '1234 5678 9012 3456',
    paymentMethod: 'Bank Transfer',
    
    // Salary Breakdown
    allowances: [
      { type: 'Basic Salary', amount: 0 },
      { type: 'House Rent', amount: 0 },
      { type: 'Medical Allowance', amount: 1500 }
    ] as Allowance[],
    deductions: [
      { type: 'Income Tax', amount: 0 },
      { type: 'Provident Fund', amount: 0 }
    ] as Deduction[],
    
    // Additional Content
    additionalNotes: 'Thank you for your hard work!',
    contactText: 'For any queries, contact',
    footerText: 'This is a computer-generated invoice. No signature is required.',
    
    // Styling
    headerColor: '#dc3545', // Red color
  });

  const [stats, setStats] = useState({
    totalEmployees: 0,
    processedPayrolls: 0,
    pendingPayrolls: 0,
    totalPayrollAmount: 0,
    totalMonthlySalary: 0,
  });

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      const payroll = getEmployeePayroll(selectedEmployee.id);
      const basicSalary = selectedEmployee.salary;
      
      setCustomInvoiceData(prev => ({
        ...prev,
        invoiceNumber: `INV-${selectedEmployee.id}-${getCurrentMonth()}`,
        allowances: [
          { type: 'Basic Salary', amount: basicSalary },
          { type: 'House Rent', amount: basicSalary * 0.4 },
          { type: 'Medical Allowance', amount: 1500 }
        ],
        deductions: [
          { type: 'Income Tax', amount: basicSalary * 0.1 },
          { type: 'Provident Fund', amount: basicSalary * 0.05 }
        ]
      }));
    }
  }, [selectedEmployee]);

  const loadData = async () => {
    try {
      setLoading(true);
      const currentMonth = getCurrentMonth();
      
      const [employeesData, payrollStats] = await Promise.all([
        fetchEmployees(),
        getPayrollStats(currentMonth)
      ]);
      
      setEmployees(employeesData);
      setSalaryRecords(payrollStats.records);
      
      const totalMonthlySalary = employeesData
        .filter(emp => emp.status === 'active')
        .reduce((sum, emp) => sum + emp.salary, 0);

      setStats({
        totalEmployees: payrollStats.totalEmployees,
        processedPayrolls: payrollStats.processedPayrolls,
        pendingPayrolls: payrollStats.pendingPayrolls,
        totalPayrollAmount: payrollStats.totalPayrollAmount,
        totalMonthlySalary,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  const payrollStats = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees.toString(),
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Active staff members'
    },
    {
      title: 'Monthly Salary',
      value: `$${(stats.totalMonthlySalary / 1000).toFixed(1)}K`,
      change: '+8%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Total monthly payroll'
    },
    {
      title: 'Paid This Month',
      value: stats.processedPayrolls.toString(),
      change: `+${Math.round((stats.processedPayrolls / stats.totalEmployees) * 100)}%`,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Employees paid'
    },
    {
      title: 'Pending Payments',
      value: stats.pendingPayrolls.toString(),
      change: `${Math.round((stats.pendingPayrolls / stats.totalEmployees) * 100)}%`,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      description: 'Awaiting processing'
    },
  ];

  const getStatusBadge = (employee: Employee) => {
    const payroll = salaryRecords.find(record => 
      record.employeeId === employee.id && record.month === getCurrentMonth()
    );
    
    if (!payroll) return <Badge className="bg-gray-100 text-gray-800">Not Processed</Badge>;
    
    switch (payroll.status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'processed':
        return <Badge className="bg-blue-100 text-blue-800">Processed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getEmployeePayroll = (employeeId: string) => {
    return salaryRecords.find(record => 
      record.employeeId === employeeId && record.month === getCurrentMonth()
    );
  };

  const handleGenerateInvoice = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsInvoiceDialogOpen(true);
  };

  const handleAddAllowance = () => {
    setCustomInvoiceData(prev => ({
      ...prev,
      allowances: [...prev.allowances, { type: 'New Allowance', amount: 0 }]
    }));
  };

  const handleRemoveAllowance = (index: number) => {
    setCustomInvoiceData(prev => ({
      ...prev,
      allowances: prev.allowances.filter((_, i) => i !== index)
    }));
  };

  const handleAddDeduction = () => {
    setCustomInvoiceData(prev => ({
      ...prev,
      deductions: [...prev.deductions, { type: 'New Deduction', amount: 0 }]
    }));
  };

  const handleRemoveDeduction = (index: number) => {
    setCustomInvoiceData(prev => ({
      ...prev,
      deductions: prev.deductions.filter((_, i) => i !== index)
    }));
  };

  const updateAllowance = (index: number, field: keyof Allowance, value: string | number) => {
    setCustomInvoiceData(prev => ({
      ...prev,
      allowances: prev.allowances.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const updateDeduction = (index: number, field: keyof Deduction, value: string | number) => {
    setCustomInvoiceData(prev => ({
      ...prev,
      deductions: prev.deductions.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateNetPay = () => {
    const totalAllowances = customInvoiceData.allowances.reduce((sum, item) => sum + item.amount, 0);
    const totalDeductions = customInvoiceData.deductions.reduce((sum, item) => sum + item.amount, 0);
    return totalAllowances - totalDeductions;
  };

  const handleDownloadInvoice = async (employee: Employee) => {
    try {
      setPdfLoading(employee.id);
      
      const payroll = getEmployeePayroll(employee.id) || {
        employeeId: employee.id,
        employeeName: employee.name,
        month: getCurrentMonth(),
        year: new Date().getFullYear(),
        basicSalary: employee.salary,
        allowances: customInvoiceData.allowances,
        deductions: customInvoiceData.deductions,
        netPay: calculateNetPay(),
        status: 'paid',
        paymentMethod: customInvoiceData.paymentMethod,
        createdAt: { toDate: () => new Date() } as any,
      };

      const pdfBlob = await generateCustomInvoicePDF(payroll, employee, customInvoiceData);
      const filename = `invoice-${employee.name.replace(/\s+/g, '-').toLowerCase()}-${getCurrentMonth()}.pdf`;
      downloadPDF(pdfBlob, filename);

      toast.success(`Invoice generated for ${employee.name}!`);
      setIsInvoiceDialogOpen(false);
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice');
    } finally {
      setPdfLoading(null);
    }
  };

  const handleProcessPayroll = async () => {
    try {
      setLoading(true);
      const currentDate = new Date();
      const month = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      
      await generatePayroll(month, currentDate.getFullYear());
      await loadData();
      
      toast.success('Payroll processed successfully!');
      setIsProcessDialogOpen(false);
    } catch (error) {
      console.error('Error processing payroll:', error);
      toast.error('Failed to process payroll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-red-600 to-red-700 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Payroll Management</h1>
            <p className="text-red-100 mt-1 text-lg">Manage employee salaries and generate invoices</p>
          </div>
       
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {payrollStats.map((stat, index) => {
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
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
                <p className="text-sm mt-2">
                  <span className="text-green-600 font-semibold">{stat.change}</span>{' '}
                  <span className="text-gray-500">from last month</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Employees Table */}
      <Card className="shadow-lg">
        <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 rounded-t-lg border-b">
          <CardTitle className="text-xl text-gray-900">Employee Payroll Records</CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Manage salaries and generate payment invoices for all employees
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-900">Employee</TableHead>
                <TableHead className="font-semibold text-gray-900">Contact</TableHead>
                <TableHead className="font-semibold text-gray-900">Position</TableHead>
                <TableHead className="font-semibold text-gray-900">Department</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">Salary</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.filter(emp => emp.status === 'active').map((employee) => (
                <TableRow key={employee.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-linear-to-br from-red-400 to-red-600 flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{employee.name}</p>
                        <p className="text-xs text-gray-500">{employee.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{employee.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{employee.position}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {employee.department}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      ${employee.salary.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(employee)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateInvoice(employee)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customize Invoice Dialog */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="bg-white border-2 border-gray-200 max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Customize Invoice - {selectedEmployee?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Edit all invoice fields and customize the layout
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column - Editable Fields */}
                <div className="space-y-6">
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={customInvoiceData.companyName}
                          onChange={(e) => setCustomInvoiceData(prev => ({
                            ...prev,
                            companyName: e.target.value
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companySubtitle">Invoice Title</Label>
                        <Input
                          id="companySubtitle"
                          value={customInvoiceData.companySubtitle}
                          onChange={(e) => setCustomInvoiceData(prev => ({
                            ...prev,
                            companySubtitle: e.target.value
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyAddress">Company Address</Label>
                        <Input
                          id="companyAddress"
                          value={customInvoiceData.companyAddress}
                          onChange={(e) => setCustomInvoiceData(prev => ({
                            ...prev,
                            companyAddress: e.target.value
                          }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="companyPhone">Company Phone</Label>
                          <Input
                            id="companyPhone"
                            value={customInvoiceData.companyPhone}
                            onChange={(e) => setCustomInvoiceData(prev => ({
                              ...prev,
                              companyPhone: e.target.value
                            }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companyEmail">Company Email</Label>
                          <Input
                            id="companyEmail"
                            value={customInvoiceData.companyEmail}
                            onChange={(e) => setCustomInvoiceData(prev => ({
                              ...prev,
                              companyEmail: e.target.value
                            }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          value={customInvoiceData.bankName}
                          onChange={(e) => setCustomInvoiceData(prev => ({
                            ...prev,
                            bankName: e.target.value
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={customInvoiceData.accountNumber}
                          onChange={(e) => setCustomInvoiceData(prev => ({
                            ...prev,
                            accountNumber: e.target.value
                          }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Input
                        id="paymentMethod"
                        value={customInvoiceData.paymentMethod}
                        onChange={(e) => setCustomInvoiceData(prev => ({
                          ...prev,
                          paymentMethod: e.target.value
                        }))}
                      />
                    </div>
                  </div>

                  {/* Allowances */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Allowances</h3>
                      <Button variant="outline" size="sm" onClick={handleAddAllowance}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {customInvoiceData.allowances.map((allowance, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={allowance.type}
                            onChange={(e) => updateAllowance(index, 'type', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={allowance.amount}
                            onChange={(e) => updateAllowance(index, 'amount', Number(e.target.value))}
                            className="w-32"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveAllowance(index)}
                            disabled={customInvoiceData.allowances.length === 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Deductions</h3>
                      <Button variant="outline" size="sm" onClick={handleAddDeduction}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {customInvoiceData.deductions.map((deduction, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={deduction.type}
                            onChange={(e) => updateDeduction(index, 'type', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={deduction.amount}
                            onChange={(e) => updateDeduction(index, 'amount', Number(e.target.value))}
                            className="w-32"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveDeduction(index)}
                            disabled={customInvoiceData.deductions.length === 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Additional Settings */}
                <div className="space-y-6">
                  {/* Additional Content */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Additional Content</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="additionalNotes">Additional Notes</Label>
                        <Textarea
                          id="additionalNotes"
                          value={customInvoiceData.additionalNotes}
                          onChange={(e) => setCustomInvoiceData(prev => ({
                            ...prev,
                            additionalNotes: e.target.value
                          }))}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactText">Contact Text</Label>
                        <Input
                          id="contactText"
                          value={customInvoiceData.contactText}
                          onChange={(e) => setCustomInvoiceData(prev => ({
                            ...prev,
                            contactText: e.target.value
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="footerText">Footer Text</Label>
                        <Input
                          id="footerText"
                          value={customInvoiceData.footerText}
                          onChange={(e) => setCustomInvoiceData(prev => ({
                            ...prev,
                            footerText: e.target.value
                          }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Invoice Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Invoice Details</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="invoiceNumber">Invoice Number</Label>
                        <Input
                          id="invoiceNumber"
                          value={customInvoiceData.invoiceNumber}
                          onChange={(e) => setCustomInvoiceData(prev => ({
                            ...prev,
                            invoiceNumber: e.target.value
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="invoiceDate">Invoice Date</Label>
                        <Input
                          id="invoiceDate"
                          value={customInvoiceData.invoiceDate}
                          onChange={(e) => setCustomInvoiceData(prev => ({
                            ...prev,
                            invoiceDate: e.target.value
                          }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preview Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Salary Summary</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Allowances:</span>
                        <span className="font-semibold text-green-600">
                          ${customInvoiceData.allowances.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Deductions:</span>
                        <span className="font-semibold text-red-600">
                          ${customInvoiceData.deductions.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-bold text-lg">Net Payable Amount:</span>
                        <span className="font-bold text-lg text-blue-600">
                          ${calculateNetPay().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end border-t pt-4">
                <Button variant="outline" onClick={() => setIsInvoiceDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleDownloadInvoice(selectedEmployee)}
                  disabled={pdfLoading === selectedEmployee.id}
                >
                  {pdfLoading === selectedEmployee.id ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Generate PDF Invoice
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Process Payroll Dialog */}
      <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
        <DialogContent className="bg-white border-2 border-gray-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Process Payroll</DialogTitle>
            <DialogDescription className="text-gray-600">
              Generate payroll for all active employees
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                This will process payroll for {stats.totalEmployees} active employees with total monthly salary of ${stats.totalMonthlySalary.toLocaleString()}.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsProcessDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleProcessPayroll}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Process Payroll'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


