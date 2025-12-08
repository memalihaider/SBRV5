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
  Trash2,
  ChevronLeft,
  ChevronRight,
  Upload,
  Settings,
  BarChart3,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal
} from 'lucide-react';
import mockData from '@/lib/mock-data';
import { Product, ProductCategory, ProductStatus, MainCategory, SubCategory } from '@/types';

const products = mockData.products;

export default function InventoryProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mainCategoryFilter, setMainCategoryFilter] = useState('all');
  const [subCategoryFilter, setSubCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const itemsPerPage = 15;

  // Form state for add/edit product
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    sku: '',
    description: '',
    mainCategoryId: '',
    subCategoryId: '',
    category: '' as ProductCategory,
    manufacturer: '',
    modelNumber: '',
    costPrice: 0,
    sellingPrice: 0,
    currentStock: 0,
    minStockLevel: 10,
    maxStockLevel: 1000,
    reorderPoint: 20,
    status: 'active' as ProductStatus,
    isSerialTracked: false,
    isBatchTracked: false,
  });

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMainCategory = mainCategoryFilter === 'all' || product.mainCategoryId === mainCategoryFilter;
      const matchesSubCategory = subCategoryFilter === 'all' || product.subCategoryId === subCategoryFilter;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;

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

  const productStats = [
    { title: 'Total Products', value: products.length.toString(), change: '+42', icon: Package, color: 'blue' },
    { title: 'Low Stock Items', value: products.filter(p => p.currentStock <= p.minStockLevel && p.currentStock > 0).length.toString(), change: '+8', icon: AlertTriangle, color: 'red' },
    { title: 'Out of Stock', value: products.filter(p => p.currentStock === 0).length.toString(), change: '-5', icon: TrendingDown, color: 'yellow' },
    { title: 'Total Inventory Value', value: '$' + (products.reduce((sum, p) => sum + (p.costPrice * p.currentStock), 0) / 1000000).toFixed(1) + 'M', change: '+12%', icon: DollarSign, color: 'green' },
  ];

  const getStatusBadge = (status: ProductStatus) => {
    const statusMap: Record<ProductStatus, { variant: 'default' | 'destructive' | 'secondary' | 'outline', label: string, color: string }> = {
      active: { variant: 'default', label: 'ACTIVE', color: 'green' },
      discontinued: { variant: 'secondary', label: 'DISCONTINUED', color: 'gray' },
      out_of_stock: { variant: 'destructive', label: 'OUT OF STOCK', color: 'red' },
      low_stock: { variant: 'outline', label: 'LOW STOCK', color: 'yellow' },
    };
    return statusMap[status] || statusMap.active;
  };

  const getStockStatus = (product: Product) => {
    if (product.currentStock === 0) return { status: 'out_of_stock', label: 'Out of Stock', color: 'red' };
    if (product.currentStock <= product.minStockLevel) return { status: 'low_stock', label: 'Low Stock', color: 'yellow' };
    if (product.currentStock > product.maxStockLevel) return { status: 'overstock', label: 'Overstock', color: 'blue' };
    return { status: 'in_stock', label: 'In Stock', color: 'green' };
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductForm(product);
    setIsEditDialogOpen(true);
  };

  const handleAddProduct = () => {
    setProductForm({
      name: '',
      sku: '',
      description: '',
      mainCategoryId: '',
      subCategoryId: '',
      category: '' as ProductCategory,
      manufacturer: '',
      modelNumber: '',
      costPrice: 0,
      sellingPrice: 0,
      currentStock: 0,
      minStockLevel: 10,
      maxStockLevel: 1000,
      reorderPoint: 20,
      status: 'active' as ProductStatus,
      isSerialTracked: false,
      isBatchTracked: false,
    });
    setIsAddDialogOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveProduct = () => {
    // In a real app, this would save to the database
    console.log('Saving product:', productForm);
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setProductForm({});
  };

  const handleConfirmDelete = () => {
    // In a real app, this would delete from the database
    console.log('Deleting product:', selectedProduct?.id);
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleExportProducts = () => {
    // In a real app, this would export the filtered products
    alert('Exporting products to Excel/CSV');
  };

  const handleImportProducts = () => {
    // In a real app, this would open a file picker for CSV import
    alert('Importing products from CSV');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Product Inventory</h1>
            <p className="text-blue-100 mt-1 text-lg">Complete product catalog and inventory management</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleImportProducts}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleExportProducts}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-white text-blue-600 hover:bg-blue-50" onClick={handleAddProduct}>
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productStats.map((stat, index) => {
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
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
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

      {/* Products Table */}
      <Card className="shadow-lg">
        <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-gray-900">Products</CardTitle>
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
                  <TableHead className="font-semibold text-gray-900">Sub Category</TableHead>
                  <TableHead className="font-semibold text-gray-900">Stock Status</TableHead>
                  <TableHead className="text-right font-semibold text-gray-900">Current Stock</TableHead>
                  <TableHead className="text-right font-semibold text-gray-900">Cost Price</TableHead>
                  <TableHead className="text-right font-semibold text-gray-900">Selling Price</TableHead>
                  <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  const statusBadge = getStatusBadge(product.status);
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
                        <Badge variant="outline" className="text-xs">
                          {mockData.getSubCategoryById(product.subCategoryId)?.name || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.status === 'out_of_stock' ? 'destructive' : stockStatus.status === 'low_stock' ? 'outline' : 'default'} className="text-xs">
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-gray-900">
                        <div className="font-medium">{product.currentStock}</div>
                        <div className="text-xs text-gray-500">Min: {product.minStockLevel}</div>
                      </TableCell>
                      <TableCell className="text-right text-gray-900 font-medium">
                        ${product.costPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-bold">
                        ${product.sellingPrice.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewProduct(product)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditProduct(product)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteProduct(product)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="bg-white border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">Product Details</DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              {selectedProduct?.name} - {selectedProduct?.sku}
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-6 bg-white">
              {/* Product Header */}
              <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Product Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium text-gray-700">Name:</span> <span className="text-gray-900">{selectedProduct.name}</span></p>
                    <p><span className="font-medium text-gray-700">SKU:</span> <span className="text-gray-900">{selectedProduct.sku}</span></p>
                    <p><span className="font-medium text-gray-700">Main Category:</span> <span className="text-gray-900">{mockData.getMainCategoryById(selectedProduct.mainCategoryId)?.name || 'Unknown'}</span></p>
                    <p><span className="font-medium text-gray-700">Sub Category:</span> <span className="text-gray-900">{mockData.getSubCategoryById(selectedProduct.subCategoryId)?.name || 'Unknown'}</span></p>
                    <p><span className="font-medium text-gray-700">Manufacturer:</span> <span className="text-gray-900">{selectedProduct.manufacturer}</span></p>
                    <p><span className="font-medium text-gray-700">Model:</span> <span className="text-gray-900">{selectedProduct.modelNumber || 'N/A'}</span></p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Status & Stock</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium text-gray-700">Status:</span> <Badge variant={getStatusBadge(selectedProduct.status).variant} className="ml-2">{getStatusBadge(selectedProduct.status).label}</Badge></p>
                    <p><span className="font-medium text-gray-700">Stock Status:</span> <Badge variant={getStockStatus(selectedProduct).status === 'out_of_stock' ? 'destructive' : 'default'} className="ml-2">{getStockStatus(selectedProduct).label}</Badge></p>
                    <p><span className="font-medium text-gray-700">Current Stock:</span> <span className="text-gray-900">{selectedProduct.currentStock} units</span></p>
                    <p><span className="font-medium text-gray-700">Min Level:</span> <span className="text-gray-900">{selectedProduct.minStockLevel} units</span></p>
                    <p><span className="font-medium text-gray-700">Reorder Point:</span> <span className="text-gray-900">{selectedProduct.reorderPoint} units</span></p>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Cost Price</p>
                  <p className="text-2xl font-bold text-gray-900">${selectedProduct.costPrice.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Selling Price</p>
                  <p className="text-2xl font-bold text-green-600">${selectedProduct.sellingPrice.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Margin</p>
                  <p className="text-2xl font-bold text-blue-600">{(selectedProduct.margin * 100).toFixed(1)}%</p>
                </div>
              </div>

              {/* Description */}
              {selectedProduct.description && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">{selectedProduct.description}</p>
                </div>
              )}

              {/* Specifications */}
              {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Specifications</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-700">{key}:</span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tracking Information */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tracking</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium text-gray-700">Serial Tracked:</span> <span className="text-gray-900">{selectedProduct.isSerialTracked ? 'Yes' : 'No'}</span></p>
                    <p><span className="font-medium text-gray-700">Batch Tracked:</span> <span className="text-gray-900">{selectedProduct.isBatchTracked ? 'Yes' : 'No'}</span></p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Stock Levels</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium text-gray-700">Min Stock:</span> <span className="text-gray-900">{selectedProduct.minStockLevel}</span></p>
                    <p><span className="font-medium text-gray-700">Max Stock:</span> <span className="text-gray-900">{selectedProduct.maxStockLevel}</span></p>
                    <p><span className="font-medium text-gray-700">Reorder Point:</span> <span className="text-gray-900">{selectedProduct.reorderPoint}</span></p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 bg-white">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="border-gray-300 hover:bg-gray-50">
                  Close
                </Button>
                <Button variant="outline" onClick={() => { setIsViewDialogOpen(false); handleEditProduct(selectedProduct); }} className="border-gray-300 hover:bg-gray-50">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button onClick={() => { setIsViewDialogOpen(false); handleDeleteProduct(selectedProduct); }} className="bg-red-600 hover:bg-red-700 text-white">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="bg-white border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {isAddDialogOpen ? 'Add New Product' : 'Edit Product'}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              {isEditDialogOpen ? `Editing ${selectedProduct?.name}` : 'Enter product details below'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 bg-white">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="specifications">Specs</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      value={productForm.sku}
                      onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                      placeholder="Enter SKU"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mainCategory">Main Category *</Label>
                    <Select
                      value={productForm.mainCategoryId}
                      onValueChange={(value) => {
                        setProductForm({
                          ...productForm,
                          mainCategoryId: value,
                          subCategoryId: '', // Reset subcategory when main category changes
                          category: `${mockData.getMainCategoryById(value)?.name || ''}` as ProductCategory
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select main category" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockData.mainCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subCategory">Sub Category *</Label>
                    <Select
                      value={productForm.subCategoryId}
                      onValueChange={(value) => {
                        const subCategory = mockData.getSubCategoryById(value);
                        const mainCategory = mockData.getMainCategoryById(productForm.mainCategoryId || '');
                        setProductForm({
                          ...productForm,
                          subCategoryId: value,
                          category: `${mainCategory?.name || ''}/${subCategory?.name || ''}` as ProductCategory
                        });
                      }}
                      disabled={!productForm.mainCategoryId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub category" />
                      </SelectTrigger>
                      <SelectContent>
                        {productForm.mainCategoryId && mockData.getSubCategoriesByMainCategory(productForm.mainCategoryId).map((subCategory) => (
                          <SelectItem key={subCategory.id} value={subCategory.id}>
                            {subCategory.icon} {subCategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">Manufacturer *</Label>
                    <Input
                      id="manufacturer"
                      value={productForm.manufacturer}
                      onChange={(e) => setProductForm({ ...productForm, manufacturer: e.target.value })}
                      placeholder="Enter manufacturer"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="costPrice">Cost Price *</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      step="0.01"
                      value={productForm.costPrice}
                      onChange={(e) => setProductForm({ ...productForm, costPrice: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellingPrice">Selling Price *</Label>
                    <Input
                      id="sellingPrice"
                      type="number"
                      step="0.01"
                      value={productForm.sellingPrice}
                      onChange={(e) => setProductForm({ ...productForm, sellingPrice: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Calculated Margin:</span>{' '}
                    <span className="font-bold text-green-600">
                      {productForm.costPrice && productForm.sellingPrice
                        ? (((productForm.sellingPrice - productForm.costPrice) / productForm.costPrice) * 100).toFixed(1)
                        : '0.0'
                      }%
                    </span>
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentStock">Current Stock *</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      value={productForm.currentStock}
                      onChange={(e) => setProductForm({ ...productForm, currentStock: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={productForm.status} onValueChange={(value) => setProductForm({ ...productForm, status: value as ProductStatus })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                        <SelectItem value="low_stock">Low Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minStockLevel">Min Stock Level</Label>
                    <Input
                      id="minStockLevel"
                      type="number"
                      value={productForm.minStockLevel}
                      onChange={(e) => setProductForm({ ...productForm, minStockLevel: parseInt(e.target.value) || 0 })}
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxStockLevel">Max Stock Level</Label>
                    <Input
                      id="maxStockLevel"
                      type="number"
                      value={productForm.maxStockLevel}
                      onChange={(e) => setProductForm({ ...productForm, maxStockLevel: parseInt(e.target.value) || 0 })}
                      placeholder="1000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reorderPoint">Reorder Point</Label>
                    <Input
                      id="reorderPoint"
                      type="number"
                      value={productForm.reorderPoint}
                      onChange={(e) => setProductForm({ ...productForm, reorderPoint: parseInt(e.target.value) || 0 })}
                      placeholder="20"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Tracking Options</Label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={productForm.isSerialTracked}
                        onChange={(e) => setProductForm({ ...productForm, isSerialTracked: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Serial Number Tracking</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={productForm.isBatchTracked}
                        onChange={(e) => setProductForm({ ...productForm, isBatchTracked: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Batch Number Tracking</span>
                    </label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="space-y-4">
                <div className="text-sm text-gray-600 mb-4">
                  Add product specifications (optional)
                </div>
                {/* Specifications form would go here - simplified for now */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500">
                  Specifications form would be implemented here
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="bg-gray-50 -m-6 mt-4 p-6 rounded-b-lg border-t">
              <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); setIsEditDialogOpen(false); }}>
                Cancel
              </Button>
              <Button onClick={handleSaveProduct} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isAddDialogOpen ? 'Add Product' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="bg-white border-b border-gray-200 pb-4">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center">
              <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
              Delete Product
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 bg-white">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> Deleting this product will remove all associated inventory records and may affect existing orders.
              </p>
            </div>
          </div>

          <DialogFooter className="bg-gray-50 -m-6 mt-4 p-6 rounded-b-lg border-t">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
