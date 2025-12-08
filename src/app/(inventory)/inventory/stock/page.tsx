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
  Package,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Plus,
  Minus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Upload,
  Settings,
  BarChart3,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  History,
  TrendingUp,
  Activity
} from 'lucide-react';
import mockData from '@/lib/mock-data';
import { Product, ProductCategory, ProductStatus } from '@/types';
import { toast } from 'sonner';

interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  type: 'increase' | 'decrease' | 'transfer';
  quantity: number;
  reason: string;
  notes: string;
  adjustedBy: string;
  date: Date;
}

const products = mockData.products;

// Mock stock adjustments data
const stockAdjustments: StockAdjustment[] = [
  {
    id: 'ADJ-001',
    productId: products[0].id,
    productName: products[0].name,
    type: 'increase',
    quantity: 50,
    reason: 'Purchase Order Received',
    notes: 'Received from supplier ABC Corp',
    adjustedBy: 'John Doe',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'ADJ-002',
    productId: products[1].id,
    productName: products[1].name,
    type: 'decrease',
    quantity: 20,
    reason: 'Damaged Items',
    notes: 'Items damaged during shipping',
    adjustedBy: 'Jane Smith',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'ADJ-003',
    productId: products[2].id,
    productName: products[2].name,
    type: 'increase',
    quantity: 100,
    reason: 'Stock Replenishment',
    notes: 'Monthly stock replenishment',
    adjustedBy: 'John Doe',
    date: new Date(),
  },
];

export default function InventoryStockPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mainCategoryFilter, setMainCategoryFilter] = useState('all');
  const [subCategoryFilter, setSubCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isBulkAdjustDialogOpen, setIsBulkAdjustDialogOpen] = useState(false);
  const itemsPerPage = 15;

  // Adjustment form state
  const [adjustmentForm, setAdjustmentForm] = useState({
    type: 'increase' as 'increase' | 'decrease',
    quantity: '',
    reason: '',
    notes: '',
  });

  // Bulk adjustment form state
  const [bulkAdjustmentForm, setBulkAdjustmentForm] = useState({
    productId: '',
    type: 'increase' as 'increase' | 'decrease',
    quantity: '',
    reason: '',
    notes: '',
  });

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMainCategory = mainCategoryFilter === 'all' || product.mainCategoryId === mainCategoryFilter;
      const matchesSubCategory = subCategoryFilter === 'all' || product.subCategoryId === subCategoryFilter;

      let matchesStatus = true;
      if (statusFilter !== 'all') {
        switch (statusFilter) {
          case 'active':
            matchesStatus = product.status === 'active';
            break;
          case 'discontinued':
            matchesStatus = product.status === 'discontinued';
            break;
        }
      }

      let matchesStock = true;
      if (stockFilter !== 'all') {
        switch (stockFilter) {
          case 'in_stock':
            matchesStock = product.currentStock > 0;
            break;
          case 'low_stock':
            matchesStock = product.currentStock > 0 && product.currentStock <= product.minStockLevel;
            break;
          case 'out_of_stock':
            matchesStock = product.currentStock === 0;
            break;
          case 'overstock':
            matchesStock = product.currentStock > product.maxStockLevel;
            break;
        }
      }

      return matchesSearch && matchesMainCategory && matchesSubCategory && matchesStatus && matchesStock;
    });
  }, [searchTerm, mainCategoryFilter, subCategoryFilter, statusFilter, stockFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stockStats = [
    { title: 'Total Products', value: products.length.toString(), change: '+12', icon: Package, color: 'blue' },
    { title: 'Low Stock Items', value: products.filter(p => p.currentStock <= p.minStockLevel && p.currentStock > 0).length.toString(), change: '+3', icon: AlertTriangle, color: 'yellow' },
    { title: 'Out of Stock', value: products.filter(p => p.currentStock === 0).length.toString(), change: '-2', icon: TrendingDown, color: 'red' },
    { title: 'Total Stock Value', value: '$' + (products.reduce((sum, p) => sum + (p.costPrice * p.currentStock), 0) / 1000000).toFixed(1) + 'M', change: '+8.5%', icon: DollarSign, color: 'green' },
  ];

  const getStockStatus = (product: Product) => {
    if (product.currentStock === 0) return { status: 'out_of_stock', label: 'Out of Stock', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' };
    if (product.currentStock <= product.minStockLevel) return { status: 'low_stock', label: 'Low Stock', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
    if (product.currentStock > product.maxStockLevel) return { status: 'overstock', label: 'Overstock', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
    return { status: 'in_stock', label: 'In Stock', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' };
  };

  const getStockPercentage = (product: Product) => {
    if (product.minStockLevel === 0) return 100;
    return Math.min((product.currentStock / product.minStockLevel) * 100, 100);
  };

  const handleAdjustStock = (product: Product) => {
    setSelectedProduct(product);
    setAdjustmentForm({
      type: 'increase',
      quantity: '',
      reason: '',
      notes: '',
    });
    setIsAdjustDialogOpen(true);
  };

  const handleViewHistory = (product: Product) => {
    setSelectedProduct(product);
    setIsHistoryDialogOpen(true);
  };

  const handleBulkAdjustStock = () => {
    setBulkAdjustmentForm({
      productId: '',
      type: 'increase',
      quantity: '',
      reason: '',
      notes: '',
    });
    setIsBulkAdjustDialogOpen(true);
  };

  const handleSaveAdjustment = () => {
    if (!adjustmentForm.quantity || !adjustmentForm.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    const quantity = parseInt(adjustmentForm.quantity);
    if (quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    if (adjustmentForm.type === 'decrease' && selectedProduct && quantity > selectedProduct.currentStock) {
      toast.error('Cannot remove more stock than currently available');
      return;
    }

    // In a real app, this would save to the database
    console.log('Saving stock adjustment:', {
      productId: selectedProduct?.id,
      ...adjustmentForm,
      quantity
    });

    toast.success(`Stock ${adjustmentForm.type === 'increase' ? 'increased' : 'decreased'} by ${quantity} units for ${selectedProduct?.name}`);

    setIsAdjustDialogOpen(false);
    setSelectedProduct(null);
    setAdjustmentForm({
      type: 'increase',
      quantity: '',
      reason: '',
      notes: '',
    });
  };

  const handleSaveBulkAdjustment = () => {
    if (!bulkAdjustmentForm.productId || !bulkAdjustmentForm.quantity || !bulkAdjustmentForm.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    const quantity = parseInt(bulkAdjustmentForm.quantity);
    if (quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    const product = products.find(p => p.id === bulkAdjustmentForm.productId);
    if (bulkAdjustmentForm.type === 'decrease' && product && quantity > product.currentStock) {
      toast.error('Cannot remove more stock than currently available');
      return;
    }

    // In a real app, this would save to the database
    console.log('Saving bulk stock adjustment:', {
      ...bulkAdjustmentForm,
      quantity
    });

    toast.success(`Bulk stock ${bulkAdjustmentForm.type === 'increase' ? 'increased' : 'decreased'} by ${quantity} units`);

    setIsBulkAdjustDialogOpen(false);
    setBulkAdjustmentForm({
      productId: '',
      type: 'increase',
      quantity: '',
      reason: '',
      notes: '',
    });
  };

  const handleExportStock = () => {
    // In a real app, this would export the filtered stock data
    alert('Exporting stock data to Excel/CSV');
  };

  const handleImportStock = () => {
    // In a real app, this would open a file picker for CSV import
    alert('Importing stock adjustments from CSV');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Stock Management</h1>
            <p className="text-blue-100 mt-1 text-lg">Monitor inventory levels and manage stock adjustments</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleImportStock}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleExportStock}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-white text-blue-600 hover:bg-blue-50" onClick={handleBulkAdjustStock}>
              <Activity className="h-5 w-5 mr-2" />
              Bulk Adjust
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stockStats.map((stat, index) => {
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
              <Label htmlFor="search">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Name, SKU, manufacturer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Main Category</Label>
              <Select value={mainCategoryFilter} onValueChange={(value) => {
                setMainCategoryFilter(value);
                setSubCategoryFilter('all'); // Reset subcategory when main category changes
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Main Categories</SelectItem>
                  {mockData.mainCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sub Category</Label>
              <Select value={subCategoryFilter} onValueChange={setSubCategoryFilter} disabled={mainCategoryFilter === 'all'}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sub Categories</SelectItem>
                  {mainCategoryFilter !== 'all' && mockData.getSubCategoriesByMainCategory(mainCategoryFilter).map((subCategory) => (
                    <SelectItem key={subCategory.id} value={subCategory.id}>
                      {subCategory.icon} {subCategory.name}
                    </SelectItem>
                  ))}
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
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Stock Level</Label>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock Levels</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="overstock">Overstock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setMainCategoryFilter('all');
                setSubCategoryFilter('all');
                setStatusFilter('all');
                setStockFilter('all');
                setCurrentPage(1);
              }}>
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Table */}
      <Card className="shadow-lg">
        <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-gray-900">Stock Levels</CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                {filteredProducts.length} of {products.length} products
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
                  <TableHead className="font-semibold text-gray-900">Product</TableHead>
                  <TableHead className="font-semibold text-gray-900">SKU</TableHead>
                  <TableHead className="font-semibold text-gray-900">Main Category</TableHead>
                  <TableHead className="font-semibold text-gray-900">Stock Status</TableHead>
                  <TableHead className="text-right font-semibold text-gray-900">Current Stock</TableHead>
                  <TableHead className="text-right font-semibold text-gray-900">Min Level</TableHead>
                  <TableHead className="font-semibold text-gray-900">Stock Health</TableHead>
                  <TableHead className="text-right font-semibold text-gray-900">Cost Value</TableHead>
                  <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  const stockPercentage = getStockPercentage(product);
                  return (
                    <TableRow key={product.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.manufacturer}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">{product.sku}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {mockData.getMainCategoryById(product.mainCategoryId)?.name || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.status === 'out_of_stock' ? 'destructive' : stockStatus.status === 'low_stock' ? 'outline' : 'default'} className="text-xs">
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-gray-900">
                        <div className="font-medium">{product.currentStock}</div>
                        <div className="text-xs text-gray-500">Max: {product.maxStockLevel}</div>
                      </TableCell>
                      <TableCell className="text-right text-gray-900 font-medium">
                        {product.minStockLevel}
                      </TableCell>
                      <TableCell className="w-48">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{stockPercentage.toFixed(0)}%</span>
                            <span>{product.currentStock}/{product.minStockLevel}</span>
                          </div>
                          <Progress
                            value={stockPercentage}
                            className={`h-2 ${stockPercentage < 25 ? 'bg-red-100' : stockPercentage < 50 ? 'bg-yellow-100' : 'bg-green-100'}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-gray-900 font-medium">
                        ${(product.costPrice * product.currentStock).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAdjustStock(product)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewHistory(product)}
                            className="h-8 w-8 p-0"
                          >
                            <History className="h-4 w-4" />
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
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
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

      {/* Recent Adjustments */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-xl text-gray-900">Recent Stock Adjustments</CardTitle>
          <CardDescription className="text-gray-600">
            Latest stock movements and adjustments
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {stockAdjustments.slice(0, 5).map((adj) => (
              <div key={adj.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    adj.type === 'increase' ? 'bg-green-100' : adj.type === 'decrease' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {adj.type === 'increase' ? (
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    ) : adj.type === 'decrease' ? (
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    ) : (
                      <Activity className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{adj.productName}</p>
                    <p className="text-sm text-gray-600">{adj.reason}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>By: {adj.adjustedBy}</span>
                      <span>•</span>
                      <span>{adj.date.toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="font-mono">{adj.id}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    adj.type === 'increase' ? 'text-green-600' : adj.type === 'decrease' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {adj.type === 'increase' ? '+' : adj.type === 'decrease' ? '-' : ''}{adj.quantity}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{adj.type}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stock Adjustment Dialog */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent className="max-w-md bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="bg-white border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">Adjust Stock</DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              {selectedProduct?.name} - Current Stock: {selectedProduct?.currentStock} units
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 bg-white">
            <div className="space-y-2">
              <Label>Adjustment Type</Label>
              <Select value={adjustmentForm.type} onValueChange={(value: 'increase' | 'decrease') => setAdjustmentForm({ ...adjustmentForm, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="increase">Increase Stock (+)</SelectItem>
                  <SelectItem value="decrease">Decrease Stock (-)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={adjustmentForm.quantity}
                onChange={(e) => setAdjustmentForm({ ...adjustmentForm, quantity: e.target.value })}
                placeholder="Enter quantity"
                min="1"
                max={adjustmentForm.type === 'decrease' ? selectedProduct?.currentStock : undefined}
              />
            </div>

            <div className="space-y-2">
              <Label>Reason *</Label>
              <Select value={adjustmentForm.reason} onValueChange={(value) => setAdjustmentForm({ ...adjustmentForm, reason: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {adjustmentForm.type === 'increase' ? (
                    <>
                      <SelectItem value="purchase">New Purchase</SelectItem>
                      <SelectItem value="return">Customer Return</SelectItem>
                      <SelectItem value="transfer">Stock Transfer</SelectItem>
                      <SelectItem value="adjustment">Stock Adjustment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="damage">Damaged/Lost</SelectItem>
                      <SelectItem value="return">Vendor Return</SelectItem>
                      <SelectItem value="transfer">Stock Transfer</SelectItem>
                      <SelectItem value="adjustment">Stock Adjustment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={adjustmentForm.notes}
                onChange={(e) => setAdjustmentForm({ ...adjustmentForm, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="bg-gray-50 -m-6 mt-4 p-6 rounded-b-lg border-t">
            <Button variant="outline" onClick={() => setIsAdjustDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAdjustment} className="bg-blue-600 hover:bg-blue-700 text-white">
              Apply Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="bg-white border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">Stock History</DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              {selectedProduct?.name} - SKU: {selectedProduct?.sku}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 bg-white">
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-500">Current Stock</p>
                <p className="text-2xl font-bold text-gray-900">{selectedProduct?.currentStock}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Min Level</p>
                <p className="text-2xl font-bold text-blue-600">{selectedProduct?.minStockLevel}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Max Level</p>
                <p className="text-2xl font-bold text-green-600">{selectedProduct?.maxStockLevel}</p>
              </div>
            </div>

            <div className="space-y-3">
              {stockAdjustments.filter(adj => adj.productId === selectedProduct?.id).map((adj) => (
                <div key={adj.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      adj.type === 'increase' ? 'bg-green-100' : adj.type === 'decrease' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {adj.type === 'increase' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : adj.type === 'decrease' ? (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      ) : (
                        <Activity className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{adj.reason}</p>
                      <p className="text-sm text-gray-600">{adj.notes}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>By: {adj.adjustedBy}</span>
                        <span>•</span>
                        <span>{adj.date.toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="font-mono">{adj.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      adj.type === 'increase' ? 'text-green-600' : adj.type === 'decrease' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {adj.type === 'increase' ? '+' : adj.type === 'decrease' ? '-' : ''}{adj.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="bg-gray-50 -m-6 mt-4 p-6 rounded-b-lg border-t">
            <Button onClick={() => setIsHistoryDialogOpen(false)} className="bg-gray-900 hover:bg-gray-800 text-white">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Stock Adjustment Dialog */}
      <Dialog open={isBulkAdjustDialogOpen} onOpenChange={setIsBulkAdjustDialogOpen}>
        <DialogContent className="max-w-md bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="bg-white border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">Bulk Stock Adjustment</DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Adjust stock for multiple products at once
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 bg-white">
            <div className="space-y-2">
              <Label>Select Product *</Label>
              <Select value={bulkAdjustmentForm.productId} onValueChange={(value) => setBulkAdjustmentForm({ ...bulkAdjustmentForm, productId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose product" />
                </SelectTrigger>
                <SelectContent>
                  {products.slice(0, 20).map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (Current: {product.currentStock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Adjustment Type</Label>
              <Select value={bulkAdjustmentForm.type} onValueChange={(value: 'increase' | 'decrease') => setBulkAdjustmentForm({ ...bulkAdjustmentForm, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="increase">Increase Stock (+)</SelectItem>
                  <SelectItem value="decrease">Decrease Stock (-)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bulk-quantity">Quantity *</Label>
              <Input
                id="bulk-quantity"
                type="number"
                value={bulkAdjustmentForm.quantity}
                onChange={(e) => setBulkAdjustmentForm({ ...bulkAdjustmentForm, quantity: e.target.value })}
                placeholder="Enter quantity"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Reason *</Label>
              <Select value={bulkAdjustmentForm.reason} onValueChange={(value) => setBulkAdjustmentForm({ ...bulkAdjustmentForm, reason: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {bulkAdjustmentForm.type === 'increase' ? (
                    <>
                      <SelectItem value="purchase">New Purchase</SelectItem>
                      <SelectItem value="return">Customer Return</SelectItem>
                      <SelectItem value="transfer">Stock Transfer</SelectItem>
                      <SelectItem value="adjustment">Stock Adjustment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="damage">Damaged/Lost</SelectItem>
                      <SelectItem value="return">Vendor Return</SelectItem>
                      <SelectItem value="transfer">Stock Transfer</SelectItem>
                      <SelectItem value="adjustment">Stock Adjustment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bulk-notes">Notes</Label>
              <Textarea
                id="bulk-notes"
                value={bulkAdjustmentForm.notes}
                onChange={(e) => setBulkAdjustmentForm({ ...bulkAdjustmentForm, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="bg-gray-50 -m-6 mt-4 p-6 rounded-b-lg border-t">
            <Button variant="outline" onClick={() => setIsBulkAdjustDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBulkAdjustment} className="bg-blue-600 hover:bg-blue-700 text-white">
              Apply Bulk Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}