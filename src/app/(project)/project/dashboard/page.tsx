'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurrencyStore } from '@/stores/currency';

export default function ProjectDashboard() {
  const router = useRouter();
  const { formatAmount } = useCurrencyStore();
  const metrics = [
    {
      title: 'Active Products',
      value: '28',
      change: '+4',
      changeType: 'positive' as const,
      icon: Briefcase,
    },
    {
      title: 'On Schedule',
      value: '22',
      change: '+2',
      changeType: 'positive' as const,
      icon: CheckCircle,
    },
    {
      title: 'Delayed',
      value: '6',
      change: '+2',
      changeType: 'negative' as const,
      icon: AlertCircle,
    },
    {
      title: 'Development Rate',
      value: '78%',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Clock,
    },
  ];

  const activeProjects = [
    {
      name: 'IoT Sensor Network - Tech Corp',
      client: 'Tech Corp Industries',
      progress: 85,
      status: 'on_track',
      deadline: '2024-11-15',
      budget: 450000,
    },
    {
      name: 'Industrial Control System',
      client: 'LogiFlow Solutions',
      progress: 45,
      status: 'delayed',
      deadline: '2024-10-30',
      budget: 280000,
    },
    {
      name: 'Smart Grid Controller - Phase 2',
      client: 'MegaMart Retail',
      progress: 92,
      status: 'on_track',
      deadline: '2024-10-25',
      budget: 175000,
    },
    {
      name: 'Medical Device Interface',
      client: 'HealthCare Central',
      progress: 60,
      status: 'at_risk',
      deadline: '2024-11-20',
      budget: 520000,
    },
  ];

  const upcomingTasks = [
    { task: 'Circuit design review - Tech Corp', project: 'IoT Sensor Network', due: 'Today', priority: 'high' },
    { task: 'Component sourcing meeting', project: 'Industrial Control System', due: 'Tomorrow', priority: 'high' },
    { task: 'Firmware testing approval', project: 'Smart Grid Controller', due: 'Oct 25', priority: 'medium' },
    { task: 'Compliance testing - Phase 1', project: 'Medical Device Interface', due: 'Oct 27', priority: 'medium' },
  ];

  // Navigation handlers
  const handleNewProject = () => {
    router.push('/project/projects');
  };

  const handleAddTask = () => {
    router.push('/project/tasks');
  };

  const handleViewTimeline = () => {
    router.push('/project/timeline');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white">Product Development Dashboard</h1>
        <p className="text-purple-100 mt-1 text-lg">Manage and track all your electronic products</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">
                  {metric.title}
                </CardTitle>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <IconComponent className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                <p className="text-sm mt-1">
                  <span
                    className={
                      metric.changeType === 'positive'
                        ? 'text-green-600 font-semibold'
                        : 'text-red-600 font-semibold'
                    }
                  >
                    {metric.change}
                  </span>{' '}
                  <span className="text-gray-500">from last month</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Active Products</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Current product development status and progress
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {activeProjects.map((project, index) => (
                <div key={index} className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm">{project.name}</h4>
                      <p className="text-xs text-gray-600 mt-0.5">{project.client}</p>
                    </div>
                    <Badge
                      variant={
                        project.status === 'on_track' ? 'default' :
                        project.status === 'at_risk' ? 'secondary' : 'destructive'
                      }
                      className="font-semibold text-xs"
                    >
                      {project.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          project.status === 'on_track' ? 'bg-green-500' :
                          project.status === 'at_risk' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
                    <span>Due: <span className="font-semibold">{project.deadline}</span></span>
                    <span className="font-semibold text-gray-900">{formatAmount(project.budget)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Development Tasks</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Engineering tasks requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {upcomingTasks.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                  <div className={`w-2.5 h-2.5 rounded-full mt-2 ${
                    item.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{item.task}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{item.project}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-xs text-gray-500">Due: {item.due}</span>
                      <Badge
                        variant={item.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {item.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
          <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Common product development tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              className="p-5 border-2 border-gray-200 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl"
              onClick={handleNewProject}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">New Product</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Start new product development
              </p>
            </button>
            <button 
              className="p-5 border-2 border-gray-200 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl"
              onClick={handleAddTask}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Add Engineering Task</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Create development task
              </p>
            </button>
            <button 
              className="p-5 border-2 border-gray-200 rounded-xl hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:border-green-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl"
              onClick={handleViewTimeline}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Development Timeline</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Product development schedules
              </p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
