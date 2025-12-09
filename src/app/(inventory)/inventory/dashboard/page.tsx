'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingDown, AlertTriangle, CheckCircle, ShoppingCart, Truck, DollarSign, BarChart3, Users, RotateCcw, FolderOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurrencyStore } from '@/stores/currency';

export default function InventoryDashboard() {
  const router = useRouter();
  const { formatAmount } = useCurrencyStore();
  const metrics = [
    {
      title: 'Total Products',
      value: '524',
      change: '+12',
      changeType: 'positive' as const,
      icon: Package,
      description: 'Active inventory items'
    },
    {
      title: 'Low Stock Items',
      value: '23',
      change: '+5',
      changeType: 'negative' as const,
      icon: AlertTriangle,
      description: 'Items below minimum stock'
    },
    {
      title: 'Active Suppliers',
      value: '47',
      change: '+3',
      changeType: 'positive' as const,
      icon: Users,
      description: 'Current supplier relationships'
    },
    {
      title: 'Pending Orders',
      value: '12',
      change: '+2',
      changeType: 'neutral' as const,
      icon: ShoppingCart,
      description: 'Purchase orders in progress'
    },
    {
      title: 'Monthly Returns',
      value: '8',
      change: '-3',
      changeType: 'positive' as const,
      icon: RotateCcw,
      description: 'Return requests this month'
    },
    {
      title: 'Stock Value',
      value: '$125K',
      change: '+8.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      description: 'Total inventory value'
    },
  ];

  const lowStockItems = [
    { name: 'LED Panel 600x600', sku: 'SKU-12345', current: 15, minimum: 50, status: 'low' },
    { name: 'Circuit Breaker 32A', sku: 'SKU-12346', current: 8, minimum: 30, status: 'critical' },
    { name: 'Cable Wire 2.5mm', sku: 'SKU-12347', current: 120, minimum: 200, status: 'low' },
    { name: 'Junction Box IP65', sku: 'SKU-12348', current: 0, minimum: 25, status: 'out' },
  ];

  const recentOrders = [
    { id: 'PO-2024-001', supplier: 'ElectroSupply Co', items: 15, total: 12450, status: 'pending', date: '2024-10-20' },
    { id: 'PO-2024-002', supplier: 'PowerTech Ltd', items: 8, total: 8900, status: 'delivered', date: '2024-10-19' },
    { id: 'PO-2024-003', supplier: 'LightWorks Inc', items: 22, total: 18750, status: 'in_transit', date: '2024-10-18' },
    { id: 'PO-2024-004', supplier: 'ElectroSupply Co', items: 12, total: 9200, status: 'delivered', date: '2024-10-17' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white">Inventory Overview</h1>
        <p className="text-blue-100 mt-1 text-lg">Monitor stock levels and manage supply chain</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">
                  {metric.title}
                </CardTitle>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <IconComponent className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                <p className="text-sm mt-1">
                  <span
                    className={
                      metric.changeType === 'positive'
                        ? 'text-green-600 font-semibold'
                        : metric.changeType === 'negative'
                        ? 'text-red-600 font-semibold'
                        : 'text-gray-600 font-semibold'
                    }
                  >
                    {metric.change}
                  </span>{' '}
                  <span className="text-gray-500">from last week</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-orange-50 to-red-50 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Stock Alerts</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Items requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.sku}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Current: <span className="font-semibold">{item.current}</span> / Min: <span className="font-semibold">{item.minimum}</span>
                    </p>
                  </div>
                  <Badge
                    variant={
                      item.status === 'out' ? 'destructive' :
                      item.status === 'critical' ? 'destructive' : 'secondary'
                    }
                    className="font-semibold"
                  >
                    {item.status === 'out' ? 'OUT OF STOCK' :
                     item.status === 'critical' ? 'CRITICAL' : 'LOW STOCK'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Purchase Orders */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Recent Orders</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Latest purchase orders
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-bold text-gray-900">{order.id}</p>
                      <Badge
                        variant={
                          order.status === 'delivered' ? 'default' :
                          order.status === 'in_transit' ? 'secondary' : 'outline'
                        }
                      >
                        {order.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{order.supplier}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.items} items • {formatAmount(order.total)} • {order.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 rounded-t-lg">
          <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Access all inventory management modules
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button onClick={() => router.push('/inventory/products')} className="p-5 border-2 border-gray-200 rounded-xl hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Products</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Manage inventory items and details
              </p>
            </button>
            <button onClick={() => router.push('/inventory/categories')} className="p-5 border-2 border-gray-200 rounded-xl hover:bg-linear-to-br hover:from-green-50 hover:to-emerald-50 hover:border-green-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <FolderOpen className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Categories</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Organize products by category
              </p>
            </button>
            <button onClick={() => router.push('/inventory/stock')} className="p-5 border-2 border-gray-200 rounded-xl hover:bg-linear-to-br hover:from-orange-50 hover:to-yellow-50 hover:border-orange-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Stock Management</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Monitor and adjust stock levels
              </p>
            </button>
            <button onClick={() => router.push('/inventory/suppliers')} className="p-5 border-2 border-gray-200 rounded-xl hover:bg-linear-to-br hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Suppliers</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Manage supplier relationships
              </p>
            </button>
            <button onClick={() => router.push('/inventory/orders')} className="p-5 border-2 border-gray-200 rounded-xl hover:bg-linear-to-br hover:from-cyan-50 hover:to-blue-50 hover:border-cyan-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-cyan-100 rounded-lg group-hover:bg-cyan-200 transition-colors">
                  <ShoppingCart className="h-5 w-5 text-cyan-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Purchase Orders</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Create and track purchase orders
              </p>
            </button>
            <button onClick={() => router.push('/inventory/returns')} className="p-5 border-2 border-gray-200 rounded-xl hover:bg-linear-to-br hover:from-red-50 hover:to-pink-50 hover:border-red-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <RotateCcw className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Returns</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Process product returns
              </p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
