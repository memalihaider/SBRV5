'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  TrendingUp,
  Star,
  DollarSign,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  History,
  Activity,
  Building,
  User,
  Award,
  Clock,
  ShoppingCart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import mockData from '@/lib/mock-data';
import { Product, ProductCategory, ProductStatus } from '@/types';
import { toast } from 'sonner';

interface Supplier {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  category: string;
  rating: number;
  totalOrders: number;
  totalValue: number;
  status: 'active' | 'inactive' | 'pending';
  since: Date;
  lastOrder: Date;
  paymentTerms: string;
  leadTime: number; // in days
  reliability: number; // percentage
  contactPerson: string;
  website?: string;
  notes?: string;
}

interface SupplierOrder {
  id: string;
  supplierId: string;
  orderNumber: string;
  date: Date;
  totalValue: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
}

// Mock suppliers data
const suppliers: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'John Williams',
    company: 'TechSupply Co.',
    email: 'john@techsupply.com',
    phone: '+1 234 567 8900',
    address: '123 Supply St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    category: 'Electronics',
    rating: 4.8,
    totalOrders: 45,
    totalValue: 125000,
    status: 'active',
    since: new Date(2023, 0, 15),
    lastOrder: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    paymentTerms: 'Net 30',
    leadTime: 7,
    reliability: 98,
    contactPerson: 'John Williams',
    website: 'https://techsupply.com',
    notes: 'Reliable supplier for electronic components',
  },
  {
    id: 'SUP-002',
    name: 'Sarah Chen',
    company: 'Global Parts Ltd.',
    email: 'sarah@globalparts.com',
    phone: '+1 234 567 8901',
    address: '456 Trade Ave',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'USA',
    category: 'Hardware',
    rating: 4.6,
    totalOrders: 32,
    totalValue: 98000,
    status: 'active',
    since: new Date(2023, 2, 10),
    lastOrder: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    paymentTerms: 'Net 15',
    leadTime: 5,
    reliability: 95,
    contactPerson: 'Sarah Chen',
    website: 'https://globalparts.com',
    notes: 'Good quality hardware components',
  },
  {
    id: 'SUP-003',
    name: 'Mike Johnson',
    company: 'Premium Supplies Inc.',
    email: 'mike@premiumsupplies.com',
    phone: '+1 234 567 8902',
    address: '789 Commerce Rd',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    country: 'USA',
    category: 'Office Supplies',
    rating: 4.5,
    totalOrders: 28,
    totalValue: 76000,
    status: 'active',
    since: new Date(2023, 4, 20),
    lastOrder: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    paymentTerms: 'Net 30',
    leadTime: 3,
    reliability: 92,
    contactPerson: 'Mike Johnson',
    website: 'https://premiumsupplies.com',
    notes: 'Excellent office supplies with fast delivery',
  },
  {
    id: 'SUP-004',
    name: 'Emily Davis',
    company: 'Quality Materials Co.',
    email: 'emily@qualitymaterials.com',
    phone: '+1 234 567 8903',
    address: '321 Industrial Blvd',
    city: 'Houston',
    state: 'TX',
    zipCode: '77001',
    country: 'USA',
    category: 'Raw Materials',
    rating: 4.2,
    totalOrders: 18,
    totalValue: 52000,
    status: 'inactive',
    since: new Date(2022, 11, 5),
    lastOrder: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    paymentTerms: 'Net 45',
    leadTime: 10,
    reliability: 85,
    contactPerson: 'Emily Davis',
    website: 'https://qualitymaterials.com',
    notes: 'Raw materials supplier - currently inactive',
  },
];

// Mock supplier orders data
const supplierOrders: SupplierOrder[] = [
  {
    id: 'ORD-001',
    supplierId: 'SUP-001',
    orderNumber: 'PO-2024-001',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    totalValue: 25000,
    status: 'delivered',
    items: 15,
  },
  {
    id: 'ORD-002',
    supplierId: 'SUP-002',
    orderNumber: 'PO-2024-002',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    totalValue: 18000,
    status: 'shipped',
    items: 12,
  },
  {
    id: 'ORD-003',
    supplierId: 'SUP-003',
    orderNumber: 'PO-2024-003',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    totalValue: 12000,
    status: 'pending',
    items: 8,
  },
];

export default function InventorySuppliersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isOrdersDialogOpen, setIsOrdersDialogOpen] = useState(false);
  const itemsPerPage = 10;

  // Add supplier form state
  const [addSupplierForm, setAddSupplierForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    category: '',
    paymentTerms: 'Net 30',
    leadTime: '',
    contactPerson: '',
    website: '',
    notes: '',
  });

  // Contact form state
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });

  // Filter suppliers based on search and filters
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           supplier.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || supplier.category === categoryFilter;

      let matchesStatus = true;
      if (statusFilter !== 'all') {
        matchesStatus = supplier.status === statusFilter;
      }

      let matchesRating = true;
      if (ratingFilter !== 'all') {
        switch (ratingFilter) {
          case 'excellent':
            matchesRating = supplier.rating >= 4.5;
            break;
          case 'good':
            matchesRating = supplier.rating >= 4.0 && supplier.rating < 4.5;
            break;
          case 'average':
            matchesRating = supplier.rating >= 3.5 && supplier.rating < 4.0;
            break;
          case 'poor':
            matchesRating = supplier.rating < 3.5;
            break;
        }
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesRating;
    });
  }, [searchTerm, categoryFilter, statusFilter, ratingFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const supplierStats = [
    { title: 'Total Suppliers', value: suppliers.length.toString(), change: '+3', icon: Users, color: 'blue' },
    { title: 'Active Suppliers', value: suppliers.filter(s => s.status === 'active').length.toString(), change: '+2', icon: CheckCircle, color: 'green' },
    { title: 'Average Rating', value: (suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1), change: '+0.2', icon: Star, color: 'yellow' },
    { title: 'Total Value', value: '$' + (suppliers.reduce((sum, s) => sum + s.totalValue, 0) / 1000000).toFixed(1) + 'M', change: '+15%', icon: DollarSign, color: 'purple' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 95) return 'bg-green-100';
    if (reliability >= 90) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const handleViewDetails = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDetailsDialogOpen(true);
  };

  const handleAddSupplier = () => {
    setAddSupplierForm({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      category: '',
      paymentTerms: 'Net 30',
      leadTime: '',
      contactPerson: '',
      website: '',
      notes: '',
    });
    setIsAddDialogOpen(true);
  };

  const handleContactSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setContactForm({
      subject: '',
      message: '',
    });
    setIsContactDialogOpen(true);
  };

  const handleViewOrders = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsOrdersDialogOpen(true);
  };

  const handleSaveSupplier = () => {
    if (!addSupplierForm.name || !addSupplierForm.company || !addSupplierForm.email || !addSupplierForm.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    // In a real app, this would save to the database
    console.log('Saving new supplier:', addSupplierForm);

    toast.success(`Supplier ${addSupplierForm.company} added successfully`);

    setIsAddDialogOpen(false);
    setAddSupplierForm({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      category: '',
      paymentTerms: 'Net 30',
      leadTime: '',
      contactPerson: '',
      website: '',
      notes: '',
    });
  };

  const handleSendMessage = () => {
    if (!contactForm.subject || !contactForm.message) {
      toast.error('Please fill in all fields');
      return;
    }

    // In a real app, this would send an email
    console.log('Sending message to supplier:', {
      supplierId: selectedSupplier?.id,
      ...contactForm
    });

    toast.success(`Message sent to ${selectedSupplier?.company}`);

    setIsContactDialogOpen(false);
    setContactForm({
      subject: '',
      message: '',
    });
  };

  const handleExportSuppliers = () => {
    // In a real app, this would export the filtered suppliers data
    alert('Exporting suppliers data to Excel/CSV');
  };

  const handleImportSuppliers = () => {
    // In a real app, this would open a file picker for CSV import
    alert('Importing suppliers from CSV');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Supplier Management</h1>
            <p className="text-blue-100 mt-1 text-lg">Manage supplier relationships and performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleImportSuppliers}>
              <Download className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleExportSuppliers}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-white text-blue-600 hover:bg-blue-50" onClick={handleAddSupplier}>
              <Plus className="h-5 w-5 mr-2" />
              Add Supplier
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {supplierStats.map((stat, index) => {
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
                  <span className={stat.change.startsWith('+') ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{stat.change}</span>
                  <span className="text-gray-500"> from last month</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filters */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg">Search & Filters</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Suppliers</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Name, company, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Hardware">Hardware</SelectItem>
                  <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                  <SelectItem value="Raw Materials">Raw Materials</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="excellent">Excellent (4.5+)</SelectItem>
                  <SelectItem value="good">Good (4.0-4.5)</SelectItem>
                  <SelectItem value="average">Average (3.5-4.0)</SelectItem>
                  <SelectItem value="poor">Poor (&lt;3.5)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStatusFilter('all');
                setRatingFilter('all');
                setCurrentPage(1);
              }}>
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Table */}
      <Card className="shadow-lg">
        <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-gray-900">Suppliers</CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                {filteredSuppliers.length} of {suppliers.length} suppliers
              </CardDescription>
            </div>
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-md border border-gray-300 bg-white shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-900">Company</TableHead>
                  <TableHead className="font-semibold text-gray-900">Contact</TableHead>
                  <TableHead className="font-semibold text-gray-900">Category</TableHead>
                  <TableHead className="font-semibold text-gray-900">Status</TableHead>
                  <TableHead className="text-right font-semibold text-gray-900">Rating</TableHead>
                  <TableHead className="text-right font-semibold text-gray-900">Orders</TableHead>
                  <TableHead className="text-right font-semibold text-gray-900">Total Value</TableHead>
                  <TableHead className="text-right font-semibold text-gray-900">Reliability</TableHead>
                  <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSuppliers.map((supplier) => (
                  <TableRow key={supplier.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{supplier.company}</div>
                        <div className="text-sm text-gray-500">{supplier.contactPerson}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          {supplier.email}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          {supplier.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {supplier.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(supplier.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`font-medium ${getRatingColor(supplier.rating)}`}>
                        ⭐ {supplier.rating}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-gray-900 font-medium">
                      {supplier.totalOrders}
                    </TableCell>
                    <TableCell className="text-right text-gray-900 font-medium">
                      ${supplier.totalValue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-sm font-medium">{supplier.reliability}%</span>
                        <div className={`w-16 h-2 rounded-full ${getReliabilityColor(supplier.reliability)}`}>
                          <div
                            className="h-full bg-green-600 rounded-full"
                            style={{ width: `${supplier.reliability}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetails(supplier)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleContactSupplier(supplier)}
                          className="h-8 w-8 p-0"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewOrders(supplier)}
                          className="h-8 w-8 p-0"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSuppliers.length)} of {filteredSuppliers.length} suppliers
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

      {/* Top Suppliers */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-xl text-gray-900">Top Performing Suppliers</CardTitle>
          <CardDescription className="text-gray-600">
            Suppliers ranked by total order value
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {suppliers
              .filter(s => s.status === 'active')
              .sort((a, b) => b.totalValue - a.totalValue)
              .slice(0, 5)
              .map((supplier, index) => (
                <div key={supplier.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{supplier.company}</p>
                      <p className="text-sm text-gray-600">{supplier.category} • {supplier.totalOrders} orders</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>⭐ {supplier.rating}</span>
                        <span>•</span>
                        <span>{supplier.reliability}% reliability</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ${supplier.totalValue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Total Value</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Supplier Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="bg-white border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">Supplier Details</DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              {selectedSupplier?.company} - {selectedSupplier?.contactPerson}
            </DialogDescription>
          </DialogHeader>

          {selectedSupplier && (
            <div className="space-y-6 bg-white">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedSupplier.totalOrders}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Total Value</p>
                  <p className="text-2xl font-bold text-green-600">${selectedSupplier.totalValue.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">⭐ {selectedSupplier.rating}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Reliability</p>
                  <p className="text-2xl font-bold text-purple-600">{selectedSupplier.reliability}%</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{selectedSupplier.contactPerson}</p>
                        <p className="text-sm text-gray-500">Contact Person</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{selectedSupplier.company}</p>
                        <p className="text-sm text-gray-500">Company</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{selectedSupplier.email}</p>
                        <p className="text-sm text-gray-500">Email</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{selectedSupplier.phone}</p>
                        <p className="text-sm text-gray-500">Phone</p>
                      </div>
                    </div>
                    {selectedSupplier.website && (
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{selectedSupplier.website}</p>
                          <p className="text-sm text-gray-500">Website</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Business Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{selectedSupplier.address}</p>
                        <p className="text-sm text-gray-500">{selectedSupplier.city}, {selectedSupplier.state} {selectedSupplier.zipCode}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{selectedSupplier.category}</p>
                        <p className="text-sm text-gray-500">Category</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{selectedSupplier.leadTime} days</p>
                        <p className="text-sm text-gray-500">Lead Time</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{selectedSupplier.paymentTerms}</p>
                        <p className="text-sm text-gray-500">Payment Terms</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{selectedSupplier.since.toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">Supplier Since</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Notes */}
              {selectedSupplier.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{selectedSupplier.notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {supplierOrders
                      .filter(order => order.supplierId === selectedSupplier.id)
                      .slice(0, 3)
                      .map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium">{order.orderNumber}</p>
                            <p className="text-sm text-gray-500">{order.date.toLocaleDateString()} • {order.items} items</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${order.totalValue.toLocaleString()}</p>
                            <Badge variant={order.status === 'delivered' ? 'default' : 'outline'} className="text-xs">
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="bg-gray-50 -m-6 mt-4 p-6 rounded-b-lg border-t">
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => handleContactSupplier(selectedSupplier!)} className="bg-blue-600 hover:bg-blue-700 text-white">
              Contact Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Supplier Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="bg-white border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">Add New Supplier</DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Enter supplier information to add them to your network
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  value={addSupplierForm.company}
                  onChange={(e) => setAddSupplierForm({ ...addSupplierForm, company: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-person">Contact Person *</Label>
                <Input
                  id="contact-person"
                  value={addSupplierForm.contactPerson}
                  onChange={(e) => setAddSupplierForm({ ...addSupplierForm, contactPerson: e.target.value })}
                  placeholder="Enter contact person name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={addSupplierForm.email}
                  onChange={(e) => setAddSupplierForm({ ...addSupplierForm, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={addSupplierForm.phone}
                  onChange={(e) => setAddSupplierForm({ ...addSupplierForm, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={addSupplierForm.category} onValueChange={(value) => setAddSupplierForm({ ...addSupplierForm, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Hardware">Hardware</SelectItem>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                    <SelectItem value="Raw Materials">Raw Materials</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-terms">Payment Terms</Label>
                <Select value={addSupplierForm.paymentTerms} onValueChange={(value) => setAddSupplierForm({ ...addSupplierForm, paymentTerms: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net 15">Net 15</SelectItem>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 45">Net 45</SelectItem>
                    <SelectItem value="Net 60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-time">Lead Time (days)</Label>
                <Input
                  id="lead-time"
                  type="number"
                  value={addSupplierForm.leadTime}
                  onChange={(e) => setAddSupplierForm({ ...addSupplierForm, leadTime: e.target.value })}
                  placeholder="Enter lead time in days"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={addSupplierForm.website}
                  onChange={(e) => setAddSupplierForm({ ...addSupplierForm, website: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={addSupplierForm.address}
                onChange={(e) => setAddSupplierForm({ ...addSupplierForm, address: e.target.value })}
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={addSupplierForm.city}
                  onChange={(e) => setAddSupplierForm({ ...addSupplierForm, city: e.target.value })}
                  placeholder="City"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={addSupplierForm.state}
                  onChange={(e) => setAddSupplierForm({ ...addSupplierForm, state: e.target.value })}
                  placeholder="State"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  value={addSupplierForm.zipCode}
                  onChange={(e) => setAddSupplierForm({ ...addSupplierForm, zipCode: e.target.value })}
                  placeholder="ZIP"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={addSupplierForm.country}
                  onChange={(e) => setAddSupplierForm({ ...addSupplierForm, country: e.target.value })}
                  placeholder="Country"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={addSupplierForm.notes}
                onChange={(e) => setAddSupplierForm({ ...addSupplierForm, notes: e.target.value })}
                placeholder="Additional notes about the supplier..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="bg-gray-50 -m-6 mt-4 p-6 rounded-b-lg border-t">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSupplier} className="bg-blue-600 hover:bg-blue-700 text-white">
              Add Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Supplier Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="max-w-md bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="bg-white border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">Contact Supplier</DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Send a message to {selectedSupplier?.company}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 bg-white">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="Enter message subject"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Enter your message..."
                rows={5}
              />
            </div>
          </div>

          <DialogFooter className="bg-gray-50 -m-6 mt-4 p-6 rounded-b-lg border-t">
            <Button variant="outline" onClick={() => setIsContactDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 text-white">
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Supplier Orders Dialog */}
      <Dialog open={isOrdersDialogOpen} onOpenChange={setIsOrdersDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="bg-white border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">Supplier Orders</DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Order history with {selectedSupplier?.company}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 bg-white">
            <div className="space-y-3">
              {supplierOrders
                .filter(order => order.supplierId === selectedSupplier?.id)
                .map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        order.status === 'delivered' ? 'bg-green-100' : order.status === 'shipped' ? 'bg-blue-100' : 'bg-yellow-100'
                      }`}>
                        {order.status === 'delivered' ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : order.status === 'shipped' ? (
                          <Package className="w-6 h-6 text-blue-600" />
                        ) : (
                          <Clock className="w-6 h-6 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">{order.date.toLocaleDateString()} • {order.items} items</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        ${order.totalValue.toLocaleString()}
                      </p>
                      <Badge variant={order.status === 'delivered' ? 'default' : 'outline'} className="text-xs mt-1">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <DialogFooter className="bg-gray-50 -m-6 mt-4 p-6 rounded-b-lg border-t">
            <Button onClick={() => setIsOrdersDialogOpen(false)} className="bg-gray-900 hover:bg-gray-800 text-white">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}