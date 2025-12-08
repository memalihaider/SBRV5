'use client';

import React, { useState, useMemo } from 'react';
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
  Plus,
  Edit,
  Search,
  Filter,
  Package,
  Truck,
  DollarSign,
  Calendar,
  User,
  FileText,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Printer,
  Send,
  Check,
  ArrowRight,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import mockData from '@/lib/mock-data';
import { Product, ProductCategory, ProductStatus } from '@/types';
import { toast } from 'sonner';
import { faker } from '@faker-js/faker';

interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity?: number;
  notes?: string;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  supplierEmail: string;
  supplierPhone: string;
  orderDate: Date;
  expectedDelivery: Date;
  actualDelivery?: Date;
  status: 'pending' | 'hold' | 'delivered';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  items: PurchaseOrderItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  notes?: string;
  terms?: string;
  createdBy: string;
  approvedBy?: string;
  trackingNumber?: string;
  carrier?: string;
}

// Mock purchase orders data
const purchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-001',
    poNumber: 'PO-2024-0001',
    supplierId: 'SUP-001',
    supplierName: 'TechSupply Co.',
    supplierEmail: 'john@techsupply.com',
    supplierPhone: '+1 234 567 8900',
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    expectedDelivery: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    status: 'pending',
    priority: 'high',
    items: [
      {
        id: 'POI-001',
        productId: mockData.products[0].id,
        productName: mockData.products[0].name,
        productSku: mockData.products[0].sku,
        quantity: 50,
        unitPrice: 100,
        totalPrice: 5000,
        receivedQuantity: 0,
      },
      {
        id: 'POI-002',
        productId: mockData.products[1].id,
        productName: mockData.products[1].name,
        productSku: mockData.products[1].sku,
        quantity: 30,
        unitPrice: 150,
        totalPrice: 4500,
        receivedQuantity: 0,
      },
    ],
    subtotal: 9500,
    taxRate: 10,
    taxAmount: 950,
    shippingCost: 150,
    discountAmount: 0,
    totalAmount: 10600,
    notes: 'Rush order - please expedite delivery',
    terms: 'Net 30 days',
    createdBy: 'John Doe',
    trackingNumber: 'TRK123456789',
    carrier: 'FedEx',
  },
  {
    id: 'PO-002',
    poNumber: 'PO-2024-0002',
    supplierId: 'SUP-002',
    supplierName: 'Global Parts Ltd.',
    supplierEmail: 'sarah@globalparts.com',
    supplierPhone: '+1 234 567 8901',
    orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    expectedDelivery: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    status: 'hold',
    priority: 'normal',
    items: [
      {
        id: 'POI-003',
        productId: mockData.products[2].id,
        productName: mockData.products[2].name,
        productSku: mockData.products[2].sku,
        quantity: 100,
        unitPrice: 75,
        totalPrice: 7500,
        receivedQuantity: 0,
      },
    ],
    subtotal: 7500,
    taxRate: 10,
    taxAmount: 750,
    shippingCost: 200,
    discountAmount: 100,
    totalAmount: 8350,
    terms: 'Net 15 days',
    createdBy: 'Jane Smith',
    trackingNumber: 'TRK987654321',
    carrier: 'UPS',
  },
  {
    id: 'PO-003',
    poNumber: 'PO-2024-0003',
    supplierId: 'SUP-003',
    supplierName: 'Premium Supplies Inc.',
    supplierEmail: 'mike@premiumsupplies.com',
    supplierPhone: '+1 234 567 8902',
    orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    expectedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    actualDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'delivered',
    priority: 'normal',
    items: [
      {
        id: 'POI-004',
        productId: mockData.products[3].id,
        productName: mockData.products[3].name,
        productSku: mockData.products[3].sku,
        quantity: 25,
        unitPrice: 200,
        totalPrice: 5000,
        receivedQuantity: 25,
      },
      {
        id: 'POI-005',
        productId: mockData.products[4].id,
        productName: mockData.products[4].name,
        productSku: mockData.products[4].sku,
        quantity: 40,
        unitPrice: 120,
        totalPrice: 4800,
        receivedQuantity: 40,
      },
    ],
    subtotal: 9800,
    taxRate: 10,
    taxAmount: 980,
    shippingCost: 100,
    discountAmount: 0,
    totalAmount: 10880,
    notes: 'Regular monthly order',
    terms: 'Net 30 days',
    createdBy: 'Bob Johnson',
    approvedBy: 'Alice Wilson',
    trackingNumber: 'TRK456789123',
    carrier: 'DHL',
  },
  {
    id: 'PO-004',
    poNumber: 'PO-2024-0004',
    supplierId: 'SUP-001',
    supplierName: 'TechSupply Co.',
    supplierEmail: 'john@techsupply.com',
    supplierPhone: '+1 234 567 8900',
    orderDate: new Date(),
    expectedDelivery: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: 'pending',
    priority: 'urgent',
    items: [
      {
        id: 'POI-006',
        productId: mockData.products[5].id,
        productName: mockData.products[5].name,
        productSku: mockData.products[5].sku,
        quantity: 60,
        unitPrice: 90,
        totalPrice: 5400,
        receivedQuantity: 0,
      },
    ],
    subtotal: 5400,
    taxRate: 10,
    taxAmount: 540,
    shippingCost: 75,
    discountAmount: 50,
    totalAmount: 5965,
    notes: 'Emergency stock replenishment',
    terms: 'Net 7 days',
    createdBy: 'John Doe',
  },
];

export default function InventoryOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false);
  const itemsPerPage = 10;

  // Create order form state
  const [createForm, setCreateForm] = useState({
    supplierId: '',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    expectedDelivery: '',
    notes: '',
    terms: 'Net 30 days',
    items: [] as Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
      notes: string;
    }>
  });

  // Receive order form state
  const [receiveForm, setReceiveForm] = useState({
    items: [] as Array<{
      itemId: string;
      receivedQuantity: number;
      condition: 'good' | 'damaged' | 'defective';
      notes: string;
    }>,
    notes: '',
  });

  // Filter orders based on search and filters
  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter(order => {
      const matchesSearch = order.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesSupplier = supplierFilter === 'all' || order.supplierId === supplierFilter;
      const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesSupplier && matchesPriority;
    });
  }, [searchTerm, statusFilter, supplierFilter, priorityFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const orderStats = [
    { title: 'Total Orders', value: purchaseOrders.length.toString(), change: '+5', icon: ShoppingCart, color: 'blue' },
    { title: 'Pending Orders', value: purchaseOrders.filter(o => o.status === 'pending').length.toString(), change: '+2', icon: Clock, color: 'yellow' },
    { title: 'Orders on Hold', value: purchaseOrders.filter(o => o.status === 'hold').length.toString(), change: '+1', icon: AlertTriangle, color: 'orange' },
    { title: 'Delivered Orders', value: purchaseOrders.filter(o => o.status === 'delivered').length.toString(), change: '+3', icon: CheckCircle, color: 'green' },
  ];

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-blue-100 text-blue-800', label: 'Pending' },
      hold: { color: 'bg-orange-100 text-orange-800', label: 'On Hold' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: 'bg-gray-100 text-gray-800',
      normal: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.normal}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const getDeliveryStatus = (order: PurchaseOrder) => {
    const today = new Date();
    const expected = new Date(order.expectedDelivery);

    if (order.status === 'delivered') {
      return { status: 'delivered', color: 'text-green-600', label: 'Delivered' };
    }

    if (order.status === 'hold') {
      return { status: 'on_hold', color: 'text-orange-600', label: 'On Hold' };
    }

    if (expected < today) {
      return { status: 'overdue', color: 'text-red-600', label: 'Overdue' };
    }

    if (expected.getTime() - today.getTime() < 3 * 24 * 60 * 60 * 1000) {
      return { status: 'due_soon', color: 'text-orange-600', label: 'Due Soon' };
    }

    return { status: 'pending', color: 'text-blue-600', label: 'Pending' };
  };

  const handleViewDetails = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  const handleCreateOrder = () => {
    setCreateForm({
      supplierId: '',
      priority: 'normal',
      expectedDelivery: '',
      notes: '',
      terms: 'Net 30 days',
      items: []
    });
    setIsCreateDialogOpen(true);
  };

  const handleReceiveOrder = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setReceiveForm({
      items: order.items.map(item => ({
        itemId: item.id,
        receivedQuantity: item.quantity,
        condition: 'good',
        notes: '',
      })),
      notes: '',
    });
    setIsReceiveDialogOpen(true);
  };

  const handleAddOrderItem = () => {
    setCreateForm({
      ...createForm,
      items: [...createForm.items, {
        productId: '',
        quantity: 1,
        unitPrice: 0,
        notes: ''
      }]
    });
  };

  const handleRemoveOrderItem = (index: number) => {
    setCreateForm({
      ...createForm,
      items: createForm.items.filter((_, i) => i !== index)
    });
  };

  const handleUpdateOrderItem = (index: number, field: string, value: any) => {
    const updatedItems = [...createForm.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setCreateForm({ ...createForm, items: updatedItems });
  };

  const handleSaveCreateOrder = () => {
    if (!createForm.supplierId) {
      toast.error('Please select a supplier');
      return;
    }

    if (createForm.items.length === 0) {
      toast.error('Please add at least one item to the order');
      return;
    }

    // Validate all items have required fields
    for (const item of createForm.items) {
      if (!item.productId || item.quantity <= 0 || item.unitPrice <= 0) {
        toast.error('Please fill in all required fields for order items');
        return;
      }
    }

    // Calculate totals
    const subtotal = createForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = subtotal * 0.1; // 10% tax
    const totalAmount = subtotal + taxAmount + 100; // Adding shipping cost

    const newOrder: PurchaseOrder = {
      id: faker.string.uuid(),
      poNumber: `PO-2024-${faker.string.numeric(4)}`,
      supplierId: createForm.supplierId,
      supplierName: 'Supplier Name', // Would be looked up from supplier data
      supplierEmail: 'supplier@email.com',
      supplierPhone: '+1 234 567 8900',
      orderDate: new Date(),
      expectedDelivery: new Date(createForm.expectedDelivery),
      status: 'pending',
      priority: createForm.priority,
      items: createForm.items.map(item => ({
        id: faker.string.uuid(),
        productId: item.productId,
        productName: 'Product Name', // Would be looked up from product data
        productSku: 'SKU-001',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice,
        notes: item.notes,
      })),
      subtotal,
      taxRate: 10,
      taxAmount,
      shippingCost: 100,
      discountAmount: 0,
      totalAmount,
      notes: createForm.notes,
      terms: createForm.terms,
      createdBy: 'Current User',
    };

    // In a real app, this would save to the database
    console.log('Creating purchase order:', newOrder);
    toast.success(`Purchase order ${newOrder.poNumber} created successfully`);

    setIsCreateDialogOpen(false);
    setCreateForm({
      supplierId: '',
      priority: 'normal',
      expectedDelivery: '',
      notes: '',
      terms: 'Net 30 days',
      items: []
    });
  };

  const handleSaveReceiveOrder = () => {
    if (!selectedOrder) return;

    // Update stock for received items
    receiveForm.items.forEach(receiveItem => {
      const orderItem = selectedOrder.items.find(item => item.id === receiveItem.itemId);
      if (orderItem && receiveItem.condition === 'good') {
        const product = mockData.getProductById(orderItem.productId);
        if (product) {
          console.log(`Adding stock for ${product.name}: ${product.currentStock} + ${receiveItem.receivedQuantity} = ${product.currentStock + receiveItem.receivedQuantity}`);
          // product.currentStock += receiveItem.receivedQuantity; // This would be done in the database
        }
      }
    });

    // In a real app, this would update the order status to delivered
    console.log('Receiving order:', selectedOrder.id, receiveForm);
    toast.success(`Order ${selectedOrder.poNumber} received successfully! Status updated to Delivered.`);

    setIsReceiveDialogOpen(false);
    setSelectedOrder(null);
    setReceiveForm({
      items: [],
      notes: '',
    });
  };

  const handleSendOrder = (order: PurchaseOrder) => {
    // In a real app, this would send the order to the supplier
    console.log('Sending order:', order.id);
    toast.success(`Order ${order.poNumber} sent to supplier successfully`);
  };

  const handlePrintOrder = (order: PurchaseOrder) => {
    // In a real app, this would generate and print a PDF
    console.log('Printing order:', order.poNumber);
    toast.success('Order printed successfully');
  };

  const handleExportOrders = () => {
    // In a real app, this would export the filtered orders data
    alert('Exporting orders data to Excel/CSV');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Purchase Orders</h1>
            <p className="text-blue-100 mt-1 text-lg">Manage supplier orders and deliveries</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleExportOrders}>
              <Printer className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-white text-blue-600 hover:bg-blue-50" onClick={handleCreateOrder}>
              <Plus className="h-5 w-5 mr-2" />
              Create Order
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {orderStats.map((stat, index) => {
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
              <Label htmlFor="search">Search Orders</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="PO number, supplier..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="hold">On Hold</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Supplier</Label>
              <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  <SelectItem value="SUP-001">TechSupply Co.</SelectItem>
                  <SelectItem value="SUP-002">Global Parts Ltd.</SelectItem>
                  <SelectItem value="SUP-003">Premium Supplies Inc.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setSupplierFilter('all');
                setPriorityFilter('all');
                setCurrentPage(1);
              }}>
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="shadow-lg">
        <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-gray-900">Purchase Orders</CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                {filteredOrders.length} of {purchaseOrders.length} orders
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
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="font-semibold text-gray-900">PO Number</TableHead>
                  <TableHead className="font-semibold text-gray-900">Supplier</TableHead>
                  <TableHead className="font-semibold text-gray-900">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900">Priority</TableHead>
                  <TableHead className="text-right font-semibold text-gray-900">Items</TableHead>
                  <TableHead className="text-right font-semibold text-gray-900">Total Value</TableHead>
                  <TableHead className="font-semibold text-gray-900">Expected Delivery</TableHead>
                  <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => {
                  const isExpanded = expandedOrders.has(order.id);
                  const deliveryStatus = getDeliveryStatus(order);

                  return (
                    <React.Fragment key={order.id}>
                      <TableRow className="hover:bg-gray-50">
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleOrderExpansion(order.id)}
                            className="h-6 w-6 p-0"
                          >
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{order.poNumber}</div>
                            <div className="text-sm text-gray-500">{order.orderDate.toLocaleDateString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{order.supplierName}</div>
                            <div className="text-sm text-gray-500">{order.supplierEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {getStatusBadge(order.status)}
                            <span className={`text-xs ${deliveryStatus.color}`}>
                              {deliveryStatus.label}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(order.priority)}
                        </TableCell>
                        <TableCell className="text-right text-gray-900 font-medium">
                          {order.items.length} items
                        </TableCell>
                        <TableCell className="text-right text-gray-900 font-medium">
                          ${order.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm text-gray-900">{order.expectedDelivery.toLocaleDateString()}</div>
                            {order.trackingNumber && (
                              <div className="text-xs text-gray-500">Track: {order.trackingNumber}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewDetails(order)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {order.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSendOrder(order)}
                                className="h-8 w-8 p-0 text-blue-600"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                            {order.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleReceiveOrder(order)}
                                className="h-8 w-8 p-0 text-green-600"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handlePrintOrder(order)}
                              className="h-8 w-8 p-0"
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={9} className="bg-gray-50 p-4">
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
                                  <div className="space-y-2">
                                    {order.items.map((item, index) => (
                                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                                        <div>
                                          <p className="font-medium text-sm">{item.productName}</p>
                                          <p className="text-xs text-gray-600">SKU: {item.productSku} | Qty: {item.quantity}</p>
                                          {item.receivedQuantity !== undefined && (
                                            <p className="text-xs text-green-600">Received: {item.receivedQuantity}</p>
                                          )}
                                        </div>
                                        <div className="text-right">
                                          <p className="font-medium text-sm">${item.totalPrice.toLocaleString()}</p>
                                          <p className="text-xs text-gray-500">${item.unitPrice}/unit</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">Order Summary</h4>
                                  <div className="space-y-2 text-sm bg-white p-3 rounded border">
                                    <div className="flex justify-between">
                                      <span>Subtotal:</span>
                                      <span className="font-medium">${order.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Tax ({order.taxRate}%):</span>
                                      <span className="font-medium">${order.taxAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Shipping:</span>
                                      <span className="font-medium">${order.shippingCost.toLocaleString()}</span>
                                    </div>
                                    {order.discountAmount > 0 && (
                                      <div className="flex justify-between">
                                        <span>Discount:</span>
                                        <span className="font-medium text-green-600">-${order.discountAmount.toLocaleString()}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between border-t pt-2 font-bold">
                                      <span>Total:</span>
                                      <span className="text-green-600">${order.totalAmount.toLocaleString()}</span>
                                    </div>
                                  </div>
                                  {order.notes && (
                                    <div className="mt-3">
                                      <span className="font-medium text-sm">Notes:</span>
                                      <p className="text-sm text-gray-600 mt-1">{order.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
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
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-xl text-gray-900">Recent Orders</CardTitle>
          <CardDescription className="text-gray-600">
            Latest purchase order activities
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {purchaseOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    order.status === 'delivered' ? 'bg-green-100' :
                    order.status === 'hold' ? 'bg-orange-100' : 'bg-blue-100'
                  }`}>
                    {order.status === 'delivered' ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : order.status === 'hold' ? (
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{order.poNumber}</p>
                    <p className="text-sm text-gray-600">{order.supplierName} • {order.items.length} items</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>{order.orderDate.toLocaleDateString()}</span>
                      <span>•</span>
                      <span>${order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="bg-white border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Order Details - {selectedOrder?.poNumber}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Complete details for purchase order
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 bg-white">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Status:</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Priority:</span>
                  {getPriorityBadge(selectedOrder.priority)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Delivery:</span>
                  <span className={getDeliveryStatus(selectedOrder).color}>
                    {getDeliveryStatus(selectedOrder).label}
                  </span>
                </div>
              </div>

              {/* Supplier Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Supplier Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-900">{selectedOrder.supplierName}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.supplierEmail}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.supplierPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm"><span className="font-medium">Terms:</span> {selectedOrder.terms}</p>
                      {selectedOrder.trackingNumber && (
                        <p className="text-sm"><span className="font-medium">Tracking:</span> {selectedOrder.trackingNumber}</p>
                      )}
                      {selectedOrder.carrier && (
                        <p className="text-sm"><span className="font-medium">Carrier:</span> {selectedOrder.carrier}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-gray-600">SKU: {item.productSku}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm">Qty: {item.quantity}</span>
                            <span className="text-sm">Unit Price: ${item.unitPrice}</span>
                            {item.receivedQuantity !== undefined && (
                              <span className="text-sm text-green-600">Received: {item.receivedQuantity}</span>
                            )}
                          </div>
                          {item.notes && (
                            <p className="text-sm text-gray-600 mt-2">Notes: {item.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">${item.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Order Date:</span>
                        <span className="font-medium">{selectedOrder.orderDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Delivery:</span>
                        <span className="font-medium">{selectedOrder.expectedDelivery.toLocaleDateString()}</span>
                      </div>
                      {selectedOrder.actualDelivery && (
                        <div className="flex justify-between">
                          <span>Actual Delivery:</span>
                          <span className="font-medium">{selectedOrder.actualDelivery.toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Created By:</span>
                        <span className="font-medium">{selectedOrder.createdBy}</span>
                      </div>
                      {selectedOrder.approvedBy && (
                        <div className="flex justify-between">
                          <span>Approved By:</span>
                          <span className="font-medium">{selectedOrder.approvedBy}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">${selectedOrder.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax ({selectedOrder.taxRate}%):</span>
                        <span className="font-medium">${selectedOrder.taxAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span className="font-medium">${selectedOrder.shippingCost.toLocaleString()}</span>
                      </div>
                      {selectedOrder.discountAmount > 0 && (
                        <div className="flex justify-between">
                          <span>Discount:</span>
                          <span className="font-medium text-green-600">-${selectedOrder.discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t pt-2 font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-green-600">${selectedOrder.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {selectedOrder.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{selectedOrder.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter className="bg-gray-50 -m-6 mt-4 p-6 rounded-b-lg border-t">
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
            {selectedOrder?.status === 'pending' && (
              <Button onClick={() => handleReceiveOrder(selectedOrder)} className="bg-blue-600 hover:bg-blue-700 text-white">
                Receive Order
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Order Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="bg-white border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Create New Purchase Order
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Create a new purchase order for supplier
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 bg-white max-h-96 overflow-y-auto">
            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier *</Label>
                <Select
                  value={createForm.supplierId}
                  onValueChange={(value) => setCreateForm({ ...createForm, supplierId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUP-001">TechSupply Co.</SelectItem>
                    <SelectItem value="SUP-002">Global Parts Ltd.</SelectItem>
                    <SelectItem value="SUP-003">Premium Supplies Inc.</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={createForm.priority}
                  onValueChange={(value) => setCreateForm({ ...createForm, priority: value as 'low' | 'normal' | 'high' | 'urgent' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected-delivery">Expected Delivery *</Label>
                <Input
                  id="expected-delivery"
                  type="date"
                  value={createForm.expectedDelivery}
                  onChange={(e) => setCreateForm({ ...createForm, expectedDelivery: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">Payment Terms</Label>
                <Select
                  value={createForm.terms}
                  onValueChange={(value) => setCreateForm({ ...createForm, terms: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net 7 days">Net 7 days</SelectItem>
                    <SelectItem value="Net 15 days">Net 15 days</SelectItem>
                    <SelectItem value="Net 30 days">Net 30 days</SelectItem>
                    <SelectItem value="Net 45 days">Net 45 days</SelectItem>
                    <SelectItem value="Net 60 days">Net 60 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Order Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Order Notes</Label>
              <Textarea
                id="notes"
                value={createForm.notes}
                onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                placeholder="Enter any special instructions or notes for this order"
                rows={3}
              />
            </div>

            {/* Order Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Order Items</h3>
                <Button onClick={handleAddOrderItem} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {createForm.items.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="space-y-2">
                          <Label>Product *</Label>
                          <Select
                            value={item.productId}
                            onValueChange={(value) => handleUpdateOrderItem(index, 'productId', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockData.products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} (SKU: {product.sku}) - Stock: {product.currentStock}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Quantity *</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Unit Price *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) => handleUpdateOrderItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Total</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={(item.quantity * item.unitPrice).toFixed(2)}
                            readOnly
                            className="bg-gray-50"
                          />
                        </div>

                        <div className="flex items-end space-x-2">
                          <div className="flex-1 space-y-2">
                            <Label>Notes</Label>
                            <Input
                              value={item.notes}
                              onChange={(e) => handleUpdateOrderItem(index, 'notes', e.target.value)}
                              placeholder="Optional notes"
                            />
                          </div>
                          <Button
                            onClick={() => handleRemoveOrderItem(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {createForm.items.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">No items added yet</p>
                  <p className="text-sm">Click "Add Item" to start adding products to the order</p>
                </div>
              )}

              {/* Order Total Preview */}
              {createForm.items.length > 0 && (
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Order Total Preview:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${createForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Excluding tax and shipping</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <DialogFooter className="bg-gray-50 -m-6 mt-4 p-6 rounded-b-lg border-t">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCreateOrder} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receive Order Dialog */}
      <Dialog open={isReceiveDialogOpen} onOpenChange={setIsReceiveDialogOpen}>
        <DialogContent className="max-w-4xl bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="bg-white border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Receive Order - {selectedOrder?.poNumber}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Record received quantities and update inventory
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 bg-white">
            {selectedOrder && (
              <div className="space-y-4">
                {selectedOrder.items.map((item, index) => {
                  const receiveItem = receiveForm.items.find(ri => ri.itemId === item.id) || {
                    itemId: item.id,
                    receivedQuantity: item.quantity,
                    condition: 'good' as 'good' | 'damaged' | 'defective',
                    notes: '',
                  };

                  return (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <h4 className="font-medium">{item.productName}</h4>
                            <p className="text-sm text-gray-600">SKU: {item.productSku}</p>
                            <p className="text-sm text-gray-600">Ordered: {item.quantity}</p>
                          </div>

                          <div className="space-y-2">
                            <Label>Received Quantity *</Label>
                            <Input
                              type="number"
                              min="0"
                              max={item.quantity}
                              value={receiveItem.receivedQuantity}
                              onChange={(e) => {
                                const updatedItems = [...receiveForm.items];
                                const existingIndex = updatedItems.findIndex(ri => ri.itemId === item.id);
                                if (existingIndex >= 0) {
                                  updatedItems[existingIndex].receivedQuantity = parseInt(e.target.value) || 0;
                                } else {
                                  updatedItems.push({
                                    ...receiveItem,
                                    receivedQuantity: parseInt(e.target.value) || 0,
                                  });
                                }
                                setReceiveForm({ ...receiveForm, items: updatedItems });
                              }}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Condition</Label>
                            <Select
                              value={receiveItem.condition}
                              onValueChange={(value) => {
                                const updatedItems = [...receiveForm.items];
                                const existingIndex = updatedItems.findIndex(ri => ri.itemId === item.id);
                                if (existingIndex >= 0) {
                                  updatedItems[existingIndex].condition = value as 'good' | 'damaged' | 'defective';
                                } else {
                                  updatedItems.push({
                                    ...receiveItem,
                                    condition: value as 'good' | 'damaged' | 'defective',
                                  });
                                }
                                setReceiveForm({ ...receiveForm, items: updatedItems });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="damaged">Damaged</SelectItem>
                                <SelectItem value="defective">Defective</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Notes</Label>
                            <Input
                              value={receiveItem.notes}
                              onChange={(e) => {
                                const updatedItems = [...receiveForm.items];
                                const existingIndex = updatedItems.findIndex(ri => ri.itemId === item.id);
                                if (existingIndex >= 0) {
                                  updatedItems[existingIndex].notes = e.target.value;
                                } else {
                                  updatedItems.push({
                                    ...receiveItem,
                                    notes: e.target.value,
                                  });
                                }
                                setReceiveForm({ ...receiveForm, items: updatedItems });
                              }}
                              placeholder="Optional notes"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="receive-notes">Receiving Notes</Label>
              <Textarea
                id="receive-notes"
                value={receiveForm.notes}
                onChange={(e) => setReceiveForm({ ...receiveForm, notes: e.target.value })}
                placeholder="Enter any notes about the receiving process"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="bg-gray-50 -m-6 mt-4 p-6 rounded-b-lg border-t">
            <Button variant="outline" onClick={() => setIsReceiveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveReceiveOrder} className="bg-blue-600 hover:bg-blue-700 text-white">
              <CheckCircle className="h-4 w-4 mr-2" />
              Receive Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}