'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Folder,
  FolderOpen,
  Tag,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import mockData from '@/lib/mock-data';
import { MainCategory, SubCategory } from '@/types';
import { toast } from 'sonner';

export default function InventoryCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<MainCategory | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Dialog states
  const [isAddMainCategoryDialogOpen, setIsAddMainCategoryDialogOpen] = useState(false);
  const [isEditMainCategoryDialogOpen, setIsEditMainCategoryDialogOpen] = useState(false);
  const [isDeleteMainCategoryDialogOpen, setIsDeleteMainCategoryDialogOpen] = useState(false);
  const [isAddSubCategoryDialogOpen, setIsAddSubCategoryDialogOpen] = useState(false);
  const [isEditSubCategoryDialogOpen, setIsEditSubCategoryDialogOpen] = useState(false);
  const [isDeleteSubCategoryDialogOpen, setIsDeleteSubCategoryDialogOpen] = useState(false);

  // Form states
  const [mainCategoryForm, setMainCategoryForm] = useState<Partial<MainCategory>>({
    name: '',
    description: '',
    icon: '',
    isActive: true,
  });

  const [subCategoryForm, setSubCategoryForm] = useState<Partial<SubCategory>>({
    name: '',
    description: '',
    mainCategoryId: '',
    icon: '',
    isActive: true,
  });

  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);

  // Filter categories based on search
  const filteredMainCategories = useMemo(() => {
    return mockData.mainCategories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddMainCategory = () => {
    setMainCategoryForm({
      name: '',
      description: '',
      icon: '',
      isActive: true,
    });
    setIsAddMainCategoryDialogOpen(true);
  };

  const handleEditMainCategory = (category: MainCategory) => {
    setSelectedMainCategory(category);
    setMainCategoryForm(category);
    setIsEditMainCategoryDialogOpen(true);
  };

  const handleDeleteMainCategory = (category: MainCategory) => {
    setSelectedMainCategory(category);
    setIsDeleteMainCategoryDialogOpen(true);
  };

  const handleAddSubCategory = (mainCategoryId: string) => {
    setSubCategoryForm({
      name: '',
      description: '',
      mainCategoryId,
      icon: '',
      isActive: true,
    });
    setIsAddSubCategoryDialogOpen(true);
  };

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setSubCategoryForm(subCategory);
    setIsEditSubCategoryDialogOpen(true);
  };

  const handleDeleteSubCategory = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setIsDeleteSubCategoryDialogOpen(true);
  };

  const handleSaveMainCategory = () => {
    if (!mainCategoryForm.name?.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    // In a real app, this would save to the database
    console.log('Saving main category:', mainCategoryForm);
    toast.success(`Main category "${mainCategoryForm.name}" ${isAddMainCategoryDialogOpen ? 'added' : 'updated'} successfully!`);

    setIsAddMainCategoryDialogOpen(false);
    setIsEditMainCategoryDialogOpen(false);
    setMainCategoryForm({});
    setSelectedMainCategory(null);
  };

  const handleSaveSubCategory = () => {
    if (!subCategoryForm.name?.trim()) {
      toast.error('Please enter a sub-category name');
      return;
    }

    if (!subCategoryForm.mainCategoryId) {
      toast.error('Please select a main category');
      return;
    }

    // In a real app, this would save to the database
    console.log('Saving sub category:', subCategoryForm);
    toast.success(`Sub-category "${subCategoryForm.name}" ${isAddSubCategoryDialogOpen ? 'added' : 'updated'} successfully!`);

    setIsAddSubCategoryDialogOpen(false);
    setIsEditSubCategoryDialogOpen(false);
    setSubCategoryForm({});
    setSelectedSubCategory(null);
  };

  const handleConfirmDeleteMainCategory = () => {
    // In a real app, this would delete from the database
    console.log('Deleting main category:', selectedMainCategory?.id);
    toast.success(`Main category "${selectedMainCategory?.name}" deleted successfully!`);

    setIsDeleteMainCategoryDialogOpen(false);
    setSelectedMainCategory(null);
  };

  const handleConfirmDeleteSubCategory = () => {
    // In a real app, this would delete from the database
    console.log('Deleting sub category:', selectedSubCategory?.id);
    toast.success(`Sub-category "${selectedSubCategory?.name}" deleted successfully!`);

    setIsDeleteSubCategoryDialogOpen(false);
    setSelectedSubCategory(null);
  };

  const getCategoryStats = (mainCategoryId: string) => {
    const subCategories = mockData.getSubCategoriesByMainCategory(mainCategoryId);
    const products = mockData.getProductsByMainCategory(mainCategoryId);
    return {
      subCategories: subCategories.length,
      products: products.length,
      activeProducts: products.filter(p => p.status === 'active').length
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Category Management</h1>
            <p className="text-blue-100 mt-1 text-lg">Manage main categories and sub-categories for inventory organization</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button className="bg-white text-blue-600 hover:bg-blue-50" onClick={handleAddMainCategory}>
              <Plus className="h-5 w-5 mr-2" />
              Add Main Category
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Main Categories</CardTitle>
            <Folder className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{mockData.mainCategories.length}</div>
            <p className="text-sm text-gray-500 mt-1">Active categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Sub Categories</CardTitle>
            <Tag className="h-5 w-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{mockData.subCategories.length}</div>
            <p className="text-sm text-gray-500 mt-1">Total sub-categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Products</CardTitle>
            <Settings className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{mockData.products.length}</div>
            <p className="text-sm text-gray-500 mt-1">Across all categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories Tree */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-xl text-gray-900">Category Hierarchy</CardTitle>
          <CardDescription className="text-gray-600">
            {filteredMainCategories.length} main categories with hierarchical sub-categories
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {filteredMainCategories.map((mainCategory) => {
              const stats = getCategoryStats(mainCategory.id);
              const subCategories = mockData.getSubCategoriesByMainCategory(mainCategory.id);
              const isExpanded = expandedCategories.has(mainCategory.id);

              return (
                <div key={mainCategory.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Main Category Header */}
                  <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCategoryExpansion(mainCategory.id)}
                          className="h-8 w-8 p-0"
                        >
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{mainCategory.icon}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900">{mainCategory.name}</h3>
                            <p className="text-sm text-gray-600">{mainCategory.description}</p>
                          </div>
                        </div>
                        <Badge variant={mainCategory.isActive ? "default" : "secondary"}>
                          {mainCategory.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="text-right text-sm text-gray-500">
                          <div>{stats.subCategories} sub-categories</div>
                          <div>{stats.products} products ({stats.activeProducts} active)</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddSubCategory(mainCategory.id)}
                          className="h-8"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Sub
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMainCategory(mainCategory)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMainCategory(mainCategory)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Sub Categories */}
                  {isExpanded && (
                    <div className="bg-gray-50">
                      {subCategories.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                          {subCategories.map((subCategory) => {
                            const subCategoryProducts = mockData.getProductsBySubCategory(subCategory.id);
                            const activeProducts = subCategoryProducts.filter(p => p.status === 'active');

                            return (
                              <div key={subCategory.id} className="p-4 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <span className="text-xl">{subCategory.icon}</span>
                                    <div>
                                      <h4 className="font-medium text-gray-900">{subCategory.name}</h4>
                                      <p className="text-sm text-gray-600">{subCategory.description}</p>
                                    </div>
                                    <Badge variant={subCategory.isActive ? "outline" : "secondary"} className="text-xs">
                                      {subCategory.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <div className="text-right text-sm text-gray-500">
                                      <div>{subCategoryProducts.length} products ({activeProducts.length} active)</div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditSubCategory(subCategory)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteSubCategory(subCategory)}
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          <Tag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-lg font-medium">No sub-categories yet</p>
                          <p className="text-sm">Click "Add Sub" to create the first sub-category</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredMainCategories.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Folder className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No categories found</p>
              <p className="text-sm">Try adjusting your search term or add a new category</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Main Category Dialog */}
      <Dialog open={isAddMainCategoryDialogOpen || isEditMainCategoryDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddMainCategoryDialogOpen(false);
          setIsEditMainCategoryDialogOpen(false);
          setMainCategoryForm({});
          setSelectedMainCategory(null);
        }
      }}>
        <DialogContent className="max-w-md bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="bg-white border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {isAddMainCategoryDialogOpen ? 'Add Main Category' : 'Edit Main Category'}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              {isEditMainCategoryDialogOpen ? `Editing ${selectedMainCategory?.name}` : 'Create a new main category for organizing products'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 bg-white">
            <div className="space-y-2">
              <Label htmlFor="mainCategoryName">Category Name *</Label>
              <Input
                id="mainCategoryName"
                value={mainCategoryForm.name}
                onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainCategoryDescription">Description</Label>
              <Textarea
                id="mainCategoryDescription"
                value={mainCategoryForm.description}
                onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainCategoryIcon">Icon (Emoji)</Label>
              <Input
                id="mainCategoryIcon"
                value={mainCategoryForm.icon}
                onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, icon: e.target.value })}
                placeholder="e.g., ⚡, ⚙️, 🔧"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="mainCategoryActive"
                checked={mainCategoryForm.isActive}
                onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, isActive: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="mainCategoryActive">Active</Label>
            </div>
          </div>

          <DialogFooter className="bg-gray-50 -m-6 mt-4 p-6 rounded-b-lg border-t">
            <Button variant="outline" onClick={() => {
              setIsAddMainCategoryDialogOpen(false);
              setIsEditMainCategoryDialogOpen(false);
              setMainCategoryForm({});
              setSelectedMainCategory(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveMainCategory} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isAddMainCategoryDialogOpen ? 'Add Category' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Sub Category Dialog */}
      <Dialog open={isAddSubCategoryDialogOpen || isEditSubCategoryDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddSubCategoryDialogOpen(false);
          setIsEditSubCategoryDialogOpen(false);
          setSubCategoryForm({});
          setSelectedSubCategory(null);
        }
      }}>
        <DialogContent className="max-w-md bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="bg-white border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {isAddSubCategoryDialogOpen ? 'Add Sub Category' : 'Edit Sub Category'}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              {isEditSubCategoryDialogOpen ? `Editing ${selectedSubCategory?.name}` : 'Create a new sub-category under the selected main category'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 bg-white">
            <div className="space-y-2">
              <Label htmlFor="subCategoryName">Sub Category Name *</Label>
              <Input
                id="subCategoryName"
                value={subCategoryForm.name}
                onChange={(e) => setSubCategoryForm({ ...subCategoryForm, name: e.target.value })}
                placeholder="Enter sub-category name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subCategoryDescription">Description</Label>
              <Textarea
                id="subCategoryDescription"
                value={subCategoryForm.description}
                onChange={(e) => setSubCategoryForm({ ...subCategoryForm, description: e.target.value })}
                placeholder="Enter sub-category description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainCategorySelect">Main Category *</Label>
              <Select
                value={subCategoryForm.mainCategoryId}
                onValueChange={(value) => setSubCategoryForm({ ...subCategoryForm, mainCategoryId: value })}
                disabled={isEditSubCategoryDialogOpen} // Don't allow changing main category when editing
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
              <Label htmlFor="subCategoryIcon">Icon (Emoji)</Label>
              <Input
                id="subCategoryIcon"
                value={subCategoryForm.icon}
                onChange={(e) => setSubCategoryForm({ ...subCategoryForm, icon: e.target.value })}
                placeholder="e.g., 🔸, 🔌, 🔩"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="subCategoryActive"
                checked={subCategoryForm.isActive}
                onChange={(e) => setSubCategoryForm({ ...subCategoryForm, isActive: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="subCategoryActive">Active</Label>
            </div>
          </div>

          <DialogFooter className="bg-gray-50 -m-6 mt-4 p-6 rounded-b-lg border-t">
            <Button variant="outline" onClick={() => {
              setIsAddSubCategoryDialogOpen(false);
              setIsEditSubCategoryDialogOpen(false);
              setSubCategoryForm({});
              setSelectedSubCategory(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveSubCategory} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isAddSubCategoryDialogOpen ? 'Add Sub Category' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Main Category Dialog */}
      <Dialog open={isDeleteMainCategoryDialogOpen} onOpenChange={setIsDeleteMainCategoryDialogOpen}>
        <DialogContent className="max-w-md bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="bg-white border-b border-gray-200 pb-4">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center">
              <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
              Delete Main Category
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Are you sure you want to delete "{selectedMainCategory?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 bg-white">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> Deleting this main category will also delete all associated sub-categories and may affect existing products.
              </p>
            </div>
          </div>

          <DialogFooter className="bg-gray-50 -m-6 mt-4 p-6 rounded-b-lg border-t">
            <Button variant="outline" onClick={() => setIsDeleteMainCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDeleteMainCategory} className="bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Sub Category Dialog */}
      <Dialog open={isDeleteSubCategoryDialogOpen} onOpenChange={setIsDeleteSubCategoryDialogOpen}>
        <DialogContent className="max-w-md bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="bg-white border-b border-gray-200 pb-4">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center">
              <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
              Delete Sub Category
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Are you sure you want to delete "{selectedSubCategory?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 bg-white">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> Deleting this sub-category may affect existing products that are assigned to it.
              </p>
            </div>
          </div>

          <DialogFooter className="bg-gray-50 -m-6 mt-4 p-6 rounded-b-lg border-t">
            <Button variant="outline" onClick={() => setIsDeleteSubCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDeleteSubCategory} className="bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Sub Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}