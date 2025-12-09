'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { TrendingUp, Users, Target, Award, Clock, CheckCircle, Plus, Eye, Edit, BarChart3, Calendar as CalendarIcon, Star, Trophy, Gift, FileText, UserCheck, AlertTriangle, X } from 'lucide-react';

export default function HRPerformancePage() {
  // Dialog states
  const [scheduleReviewOpen, setScheduleReviewOpen] = useState(false);
  const [setGoalsOpen, setSetGoalsOpen] = useState(false);
  const [conductReviewOpen, setConductReviewOpen] = useState(false);
  const [viewReviewDetailsOpen, setViewReviewDetailsOpen] = useState(false);
  const [updateGoalProgressOpen, setUpdateGoalProgressOpen] = useState(false);
  const [employeeRecognitionOpen, setEmployeeRecognitionOpen] = useState(false);

  // Selected items
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  // Form states
  const [scheduleReviewForm, setScheduleReviewForm] = useState({
    employee: '',
    reviewer: '',
    reviewType: 'annual',
    reviewPeriod: 'Q4 2024',
    scheduledDate: undefined as Date | undefined,
    notes: '',
  });

  const [setGoalsForm, setSetGoalsForm] = useState({
    employee: '',
    goalTitle: '',
    description: '',
    category: 'performance',
    targetDate: undefined as Date | undefined,
    measurementCriteria: '',
    weight: 1,
  });

  const [conductReviewForm, setConductReviewForm] = useState({
    overallRating: 5,
    communication: 5,
    teamwork: 5,
    leadership: 5,
    technicalSkills: 5,
    achievements: '',
    areasForImprovement: '',
    developmentPlan: '',
    reviewerComments: '',
  });

  const [updateGoalForm, setUpdateGoalForm] = useState({
    progress: 0,
    status: 'on-track',
    comments: '',
    nextMilestone: '',
  });

  const [recognitionForm, setRecognitionForm] = useState({
    employee: '',
    recognitionType: 'employee-of-month',
    title: '',
    description: '',
    awardAmount: 0,
    effectiveDate: undefined as Date | undefined,
  });

  // Handler functions
  const handleScheduleReview = () => {
    if (!scheduleReviewForm.employee || !scheduleReviewForm.reviewer || !scheduleReviewForm.scheduledDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Performance review scheduled successfully!');
    setScheduleReviewOpen(false);
    setScheduleReviewForm({
      employee: '',
      reviewer: '',
      reviewType: 'annual',
      reviewPeriod: 'Q4 2024',
      scheduledDate: undefined,
      notes: '',
    });
  };

  const handleSetGoals = () => {
    if (!setGoalsForm.employee || !setGoalsForm.goalTitle || !setGoalsForm.targetDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Performance goal set successfully!');
    setSetGoalsOpen(false);
    setSetGoalsForm({
      employee: '',
      goalTitle: '',
      description: '',
      category: 'performance',
      targetDate: undefined,
      measurementCriteria: '',
      weight: 1,
    });
  };

  const handleConductReview = () => {
    toast.success('Performance review completed successfully!');
    setConductReviewOpen(false);
    setConductReviewForm({
      overallRating: 5,
      communication: 5,
      teamwork: 5,
      leadership: 5,
      technicalSkills: 5,
      achievements: '',
      areasForImprovement: '',
      developmentPlan: '',
      reviewerComments: '',
    });
  };

  const handleUpdateGoalProgress = () => {
    toast.success('Goal progress updated successfully!');
    setUpdateGoalProgressOpen(false);
    setUpdateGoalForm({
      progress: 0,
      status: 'on-track',
      comments: '',
      nextMilestone: '',
    });
  };

  const handleEmployeeRecognition = () => {
    if (!recognitionForm.employee || !recognitionForm.title) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Employee recognition awarded successfully!');
    setEmployeeRecognitionOpen(false);
    setRecognitionForm({
      employee: '',
      recognitionType: 'employee-of-month',
      title: '',
      description: '',
      awardAmount: 0,
      effectiveDate: undefined,
    });
  };

  const handleViewReview = (review: any) => {
    setSelectedReview(review);
    setViewReviewDetailsOpen(true);
  };

  const handleUpdateGoal = (goal: any) => {
    setSelectedGoal(goal);
    setUpdateGoalForm({
      progress: goal.progress,
      status: goal.status,
      comments: '',
      nextMilestone: '',
    });
    setUpdateGoalProgressOpen(true);
  };
  const performanceStats = [
    {
      title: 'Average Performance Score',
      value: '8.4/10',
      change: '+0.3',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Reviews Completed',
      value: '89',
      change: '+12',
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Reviews',
      value: '23',
      change: '-5',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Top Performers',
      value: '15',
      change: '+3',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentReviews = [
    {
      id: 1,
      employee: 'Alice Johnson',
      reviewer: 'John Smith',
      period: 'Q4 2024',
      score: 9.2,
      status: 'completed',
      reviewDate: '2024-12-01',
      type: 'annual',
    },
    {
      id: 2,
      employee: 'Bob Smith',
      reviewer: 'Sarah Davis',
      period: 'Q4 2024',
      score: 8.7,
      status: 'completed',
      reviewDate: '2024-11-28',
      type: 'annual',
    },
    {
      id: 3,
      employee: 'Carol Davis',
      reviewer: 'Mike Wilson',
      period: 'Q4 2024',
      score: 7.8,
      status: 'in-progress',
      reviewDate: '2024-12-10',
      type: 'annual',
    },
  ];

  const performanceGoals = [
    {
      id: 1,
      employee: 'Alice Johnson',
      goal: 'Increase sales by 25%',
      progress: 85,
      target: 'Q4 2024',
      status: 'on-track',
      category: 'Sales',
    },
    {
      id: 2,
      employee: 'Bob Smith',
      goal: 'Complete project milestone',
      progress: 60,
      target: 'Dec 2024',
      status: 'on-track',
      category: 'Project',
    },
    {
      id: 3,
      employee: 'Carol Davis',
      goal: 'Improve customer satisfaction',
      progress: 45,
      target: 'Q4 2024',
      status: 'behind',
      category: 'Customer Service',
    },
  ];

  const departmentPerformance = [
    {
      department: 'Sales',
      avgScore: 8.6,
      employees: 25,
      topPerformer: 'Alice Johnson',
      improvement: '+0.4',
    },
    {
      department: 'Engineering',
      avgScore: 8.9,
      employees: 35,
      topPerformer: 'Bob Smith',
      improvement: '+0.2',
    },
    {
      department: 'Marketing',
      avgScore: 8.2,
      employees: 15,
      topPerformer: 'Carol Davis',
      improvement: '+0.6',
    },
    {
      department: 'HR',
      avgScore: 8.7,
      employees: 8,
      topPerformer: 'David Wilson',
      improvement: '+0.3',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'on-track':
        return <Badge className="bg-green-100 text-green-800">On Track</Badge>;
      case 'behind':
        return <Badge className="bg-red-100 text-red-800">Behind</Badge>;
      case 'at-risk':
        return <Badge className="bg-orange-100 text-orange-800">At Risk</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 8) return 'text-blue-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white">Performance Management</h1>
        <p className="text-purple-100 mt-1 text-lg">Track employee performance, reviews, and development goals</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200">
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
        {/* Recent Reviews */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl text-gray-900">Recent Reviews</CardTitle>
                <CardDescription className="text-gray-600 font-medium">
                  Latest performance reviews and evaluations
                </CardDescription>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-md" onClick={() => setScheduleReviewOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Review
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">
                            {review.employee.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {review.employee}
                        </p>
                        <p className="text-xs text-gray-500">
                          {review.period} • {review.type} review • Reviewer: {review.reviewer}
                        </p>
                        <p className="text-xs text-gray-400">
                          Completed: {new Date(review.reviewDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getScoreColor(review.score)}`}>
                        {review.score}/10
                      </p>
                      {getStatusBadge(review.status)}
                    </div>
                    <Button variant="outline" size="sm" className="text-purple-600 border-purple-300 hover:bg-purple-50" onClick={() => handleViewReview(review)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Goals */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Performance Goals</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Employee goals and progress tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {performanceGoals.map((goal) => (
                <div key={goal.id} className="p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Target className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {goal.employee}
                        </p>
                        <p className="text-xs text-gray-500">
                          {goal.category} • Target: {goal.target}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(goal.status)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{goal.goal}</span>
                      <span className="font-semibold text-gray-900">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  <div className="flex justify-end mt-3 space-x-2">
                    <Button variant="outline" size="sm" className="text-purple-600 border-purple-300 hover:bg-purple-50" onClick={() => handleUpdateGoal(goal)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Update
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card className="shadow-lg">
        <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl text-gray-900">Department Performance</CardTitle>
              <CardDescription className="text-gray-600 font-medium">
                Performance metrics by department
              </CardDescription>
            </div>
            <Button variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-50" onClick={() => toast.info('Detailed performance report feature coming soon!')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              View Detailed Report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departmentPerformance.map((dept, index) => (
              <div key={index} className="p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">{dept.department}</h3>
                  <Badge variant="outline" className="text-purple-600 border-purple-300">
                    {dept.employees} emp
                  </Badge>
                </div>
                <p className={`text-2xl font-bold mb-1 ${getScoreColor(dept.avgScore)}`}>
                  {dept.avgScore}/10
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Top: {dept.topPerformer}
                </p>
                <p className="text-xs text-green-600 font-semibold">
                  ↑ {dept.improvement} this quarter
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader className="bg-linear-to-r from-purple-50 to-indigo-50 rounded-t-lg">
          <CardTitle className="text-xl text-gray-900">Performance Actions</CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Common performance management tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="p-5 border-2 border-purple-200 rounded-xl hover:bg-linear-to-br hover:from-purple-50 hover:to-indigo-50 hover:border-purple-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl" onClick={() => setConductReviewOpen(true)}>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Conduct Reviews</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Schedule and complete performance reviews
              </p>
            </Button>
            <Button className="p-5 border-2 border-blue-200 rounded-xl hover:bg-linear-to-br hover:from-blue-50 hover:to-cyan-50 hover:border-blue-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl" onClick={() => setSetGoalsOpen(true)}>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Set Goals</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Define and track employee objectives
              </p>
            </Button>
            <Button className="p-5 border-2 border-green-200 rounded-xl hover:bg-linear-to-br hover:from-green-50 hover:to-emerald-50 hover:border-green-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl" onClick={() => setEmployeeRecognitionOpen(true)}>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Recognition</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Reward and recognize top performers
              </p>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Review Dialog */}
      <Dialog open={scheduleReviewOpen} onOpenChange={setScheduleReviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Performance Review</DialogTitle>
            <DialogDescription>
              Schedule a new performance review for an employee
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Employee *</Label>
                <Select value={scheduleReviewForm.employee} onValueChange={(value) => setScheduleReviewForm(prev => ({ ...prev, employee: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alice Johnson">Alice Johnson</SelectItem>
                    <SelectItem value="Bob Smith">Bob Smith</SelectItem>
                    <SelectItem value="Carol Davis">Carol Davis</SelectItem>
                    <SelectItem value="David Wilson">David Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviewer">Reviewer *</Label>
                <Select value={scheduleReviewForm.reviewer} onValueChange={(value) => setScheduleReviewForm(prev => ({ ...prev, reviewer: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="John Smith">John Smith</SelectItem>
                    <SelectItem value="Sarah Davis">Sarah Davis</SelectItem>
                    <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reviewType">Review Type</Label>
                <Select value={scheduleReviewForm.reviewType} onValueChange={(value) => setScheduleReviewForm(prev => ({ ...prev, reviewType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">Annual Review</SelectItem>
                    <SelectItem value="mid-year">Mid-Year Review</SelectItem>
                    <SelectItem value="probation">Probation Review</SelectItem>
                    <SelectItem value="project">Project Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviewPeriod">Review Period</Label>
                <Select value={scheduleReviewForm.reviewPeriod} onValueChange={(value) => setScheduleReviewForm(prev => ({ ...prev, reviewPeriod: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Q4 2024">Q4 2024</SelectItem>
                    <SelectItem value="Q1 2025">Q1 2025</SelectItem>
                    <SelectItem value="Q2 2025">Q2 2025</SelectItem>
                    <SelectItem value="Q3 2025">Q3 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Scheduled Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !scheduleReviewForm.scheduledDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduleReviewForm.scheduledDate ? format(scheduleReviewForm.scheduledDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduleReviewForm.scheduledDate}
                    onSelect={(date) => date && setScheduleReviewForm(prev => ({ ...prev, scheduledDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={scheduleReviewForm.notes}
                onChange={(e) => setScheduleReviewForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes or preparation requirements"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setScheduleReviewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleReview}>
              Schedule Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Set Goals Dialog */}
      <Dialog open={setGoalsOpen} onOpenChange={setSetGoalsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Set Performance Goals</DialogTitle>
            <DialogDescription>
              Define objectives and targets for employee development
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goalEmployee">Employee *</Label>
                <Select value={setGoalsForm.employee} onValueChange={(value) => setSetGoalsForm(prev => ({ ...prev, employee: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alice Johnson">Alice Johnson</SelectItem>
                    <SelectItem value="Bob Smith">Bob Smith</SelectItem>
                    <SelectItem value="Carol Davis">Carol Davis</SelectItem>
                    <SelectItem value="David Wilson">David Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goalCategory">Category</Label>
                <Select value={setGoalsForm.category} onValueChange={(value) => setSetGoalsForm(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="customer-service">Customer Service</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goalTitle">Goal Title *</Label>
              <Input
                id="goalTitle"
                value={setGoalsForm.goalTitle}
                onChange={(e) => setSetGoalsForm(prev => ({ ...prev, goalTitle: e.target.value }))}
                placeholder="Enter goal title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goalDescription">Description</Label>
              <Textarea
                id="goalDescription"
                value={setGoalsForm.description}
                onChange={(e) => setSetGoalsForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the goal"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !setGoalsForm.targetDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {setGoalsForm.targetDate ? format(setGoalsForm.targetDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={setGoalsForm.targetDate}
                      onSelect={(date) => date && setSetGoalsForm(prev => ({ ...prev, targetDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goalWeight">Weight (1-10)</Label>
                <Input
                  id="goalWeight"
                  type="number"
                  min="1"
                  max="10"
                  value={setGoalsForm.weight}
                  onChange={(e) => setSetGoalsForm(prev => ({ ...prev, weight: parseInt(e.target.value) || 1 }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="measurementCriteria">Measurement Criteria</Label>
              <Textarea
                id="measurementCriteria"
                value={setGoalsForm.measurementCriteria}
                onChange={(e) => setSetGoalsForm(prev => ({ ...prev, measurementCriteria: e.target.value }))}
                placeholder="How will success be measured?"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSetGoalsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetGoals}>
              Set Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Conduct Review Dialog */}
      <Dialog open={conductReviewOpen} onOpenChange={setConductReviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Conduct Performance Review</DialogTitle>
            <DialogDescription>
              Complete a comprehensive performance evaluation
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reviewEmployee">Employee</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alice Johnson">Alice Johnson</SelectItem>
                    <SelectItem value="Bob Smith">Bob Smith</SelectItem>
                    <SelectItem value="Carol Davis">Carol Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviewPeriod">Review Period</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Q4 2024">Q4 2024</SelectItem>
                    <SelectItem value="Q1 2025">Q1 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Performance Ratings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Overall Performance (1-10)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={conductReviewForm.overallRating}
                      onChange={(e) => setConductReviewForm(prev => ({ ...prev, overallRating: parseInt(e.target.value) || 5 }))}
                      className="w-20"
                    />
                    <div className="flex space-x-1">
                      {[1,2,3,4,5,6,7,8,9,10].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= conductReviewForm.overallRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Communication Skills</Label>
                  <RadioGroup value={conductReviewForm.communication.toString()} onValueChange={(value) => setConductReviewForm(prev => ({ ...prev, communication: parseInt(value) }))}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="comm-1" />
                      <Label htmlFor="comm-1">1 - Needs Improvement</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="comm-2" />
                      <Label htmlFor="comm-2">2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="comm-3" />
                      <Label htmlFor="comm-3">3 - Satisfactory</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="comm-4" />
                      <Label htmlFor="comm-4">4</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="comm-5" />
                      <Label htmlFor="comm-5">5 - Excellent</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Teamwork</Label>
                  <RadioGroup value={conductReviewForm.teamwork.toString()} onValueChange={(value) => setConductReviewForm(prev => ({ ...prev, teamwork: parseInt(value) }))}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="team-1" />
                      <Label htmlFor="team-1">1 - Needs Improvement</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="team-2" />
                      <Label htmlFor="team-2">2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="team-3" />
                      <Label htmlFor="team-3">3 - Satisfactory</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="team-4" />
                      <Label htmlFor="team-4">4</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="team-5" />
                      <Label htmlFor="team-5">5 - Excellent</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Leadership</Label>
                  <RadioGroup value={conductReviewForm.leadership.toString()} onValueChange={(value) => setConductReviewForm(prev => ({ ...prev, leadership: parseInt(value) }))}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="lead-1" />
                      <Label htmlFor="lead-1">1 - Needs Improvement</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="lead-2" />
                      <Label htmlFor="lead-2">2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="lead-3" />
                      <Label htmlFor="lead-3">3 - Satisfactory</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="lead-4" />
                      <Label htmlFor="lead-4">4</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="lead-5" />
                      <Label htmlFor="lead-5">5 - Excellent</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Technical Skills</Label>
                  <RadioGroup value={conductReviewForm.technicalSkills.toString()} onValueChange={(value) => setConductReviewForm(prev => ({ ...prev, technicalSkills: parseInt(value) }))}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="tech-1" />
                      <Label htmlFor="tech-1">1 - Needs Improvement</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="tech-2" />
                      <Label htmlFor="tech-2">2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="tech-3" />
                      <Label htmlFor="tech-3">3 - Satisfactory</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="tech-4" />
                      <Label htmlFor="tech-4">4</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="tech-5" />
                      <Label htmlFor="tech-5">5 - Excellent</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Feedback & Development</h3>

              <div className="space-y-2">
                <Label htmlFor="achievements">Key Achievements</Label>
                <Textarea
                  id="achievements"
                  value={conductReviewForm.achievements}
                  onChange={(e) => setConductReviewForm(prev => ({ ...prev, achievements: e.target.value }))}
                  placeholder="List major accomplishments and contributions"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="areasForImprovement">Areas for Improvement</Label>
                <Textarea
                  id="areasForImprovement"
                  value={conductReviewForm.areasForImprovement}
                  onChange={(e) => setConductReviewForm(prev => ({ ...prev, areasForImprovement: e.target.value }))}
                  placeholder="Areas that need development or attention"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="developmentPlan">Development Plan</Label>
                <Textarea
                  id="developmentPlan"
                  value={conductReviewForm.developmentPlan}
                  onChange={(e) => setConductReviewForm(prev => ({ ...prev, developmentPlan: e.target.value }))}
                  placeholder="Recommended training, goals, or actions for improvement"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewerComments">Reviewer Comments</Label>
                <Textarea
                  id="reviewerComments"
                  value={conductReviewForm.reviewerComments}
                  onChange={(e) => setConductReviewForm(prev => ({ ...prev, reviewerComments: e.target.value }))}
                  placeholder="Additional comments from the reviewer"
                  rows={3}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConductReviewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConductReview}>
              Complete Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Review Details Dialog */}
      <Dialog open={viewReviewDetailsOpen} onOpenChange={setViewReviewDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Performance Review Details</DialogTitle>
            <DialogDescription>
              Complete performance review information and feedback
            </DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <span className="text-xl font-semibold text-white">
                    {selectedReview.employee.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedReview.employee}</h3>
                  <p className="text-gray-600">{selectedReview.period} • {selectedReview.type} review</p>
                  <p className="text-sm text-gray-500">Reviewer: {selectedReview.reviewer}</p>
                  <p className="text-sm text-gray-500">Completed: {new Date(selectedReview.reviewDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getScoreColor(selectedReview.score)}`}>
                        {selectedReview.score}/10
                      </div>
                      <p className="text-sm text-gray-600">Overall Rating</p>
                      <div className="flex justify-center mt-2">
                        {[1,2,3,4,5,6,7,8,9,10].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= selectedReview.score ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">
                        {getStatusBadge(selectedReview.status)}
                      </div>
                      <p className="text-sm text-gray-600">Review Status</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Performance Ratings</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Communication</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold">4/5</span>
                        <div className="flex space-x-1">
                          {[1,2,3,4,5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Teamwork</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold">5/5</span>
                        <div className="flex space-x-1">
                          {[1,2,3,4,5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${star <= 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Leadership</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold">4/5</span>
                        <div className="flex space-x-1">
                          {[1,2,3,4,5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Technical Skills</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold">4/5</span>
                        <div className="flex space-x-1">
                          {[1,2,3,4,5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Review Summary</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-green-700">Key Achievements:</p>
                      <p className="text-gray-600">• Exceeded quarterly sales targets by 15%</p>
                      <p className="text-gray-600">• Led successful client presentation</p>
                      <p className="text-gray-600">• Mentored junior team member</p>
                    </div>
                    <div>
                      <p className="font-medium text-orange-700">Areas for Improvement:</p>
                      <p className="text-gray-600">• Project documentation could be more detailed</p>
                      <p className="text-gray-600">• Could improve time management on complex tasks</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-700">Development Plan:</p>
                      <p className="text-gray-600">• Advanced project management training</p>
                      <p className="text-gray-600">• Leadership development program</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Reviewer Comments</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 italic">
                    "{selectedReview.employee} has shown excellent growth this quarter. Their ability to take initiative and lead projects has been particularly impressive. 
                    With some focus on process documentation and time management, they will be ready for the next level of responsibility."
                  </p>
                  <p className="text-sm text-gray-500 mt-2">- {selectedReview.reviewer}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Goal Progress Dialog */}
      <Dialog open={updateGoalProgressOpen} onOpenChange={setUpdateGoalProgressOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Goal Progress</DialogTitle>
            <DialogDescription>
              Track progress and update goal status
            </DialogDescription>
          </DialogHeader>
          {selectedGoal && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{selectedGoal.goal}</h4>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{selectedGoal.employee}</span>
                  <span>{selectedGoal.category} • Target: {selectedGoal.target}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="progress">Progress Percentage</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="progress"
                      type="number"
                      min="0"
                      max="100"
                      value={updateGoalForm.progress}
                      onChange={(e) => setUpdateGoalForm(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-600">%</span>
                    <Progress value={updateGoalForm.progress} className="flex-1" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goalStatus">Goal Status</Label>
                  <Select value={updateGoalForm.status} onValueChange={(value) => setUpdateGoalForm(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on-track">On Track</SelectItem>
                      <SelectItem value="ahead">Ahead of Schedule</SelectItem>
                      <SelectItem value="behind">Behind Schedule</SelectItem>
                      <SelectItem value="at-risk">At Risk</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextMilestone">Next Milestone</Label>
                  <Input
                    id="nextMilestone"
                    value={updateGoalForm.nextMilestone}
                    onChange={(e) => setUpdateGoalForm(prev => ({ ...prev, nextMilestone: e.target.value }))}
                    placeholder="Describe the next milestone or action"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goalComments">Comments</Label>
                  <Textarea
                    id="goalComments"
                    value={updateGoalForm.comments}
                    onChange={(e) => setUpdateGoalForm(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Additional notes about progress or challenges"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setUpdateGoalProgressOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateGoalProgress}>
              Update Progress
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Employee Recognition Dialog */}
      <Dialog open={employeeRecognitionOpen} onOpenChange={setEmployeeRecognitionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Employee Recognition</DialogTitle>
            <DialogDescription>
              Award achievements and recognize outstanding performance
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recognitionEmployee">Employee *</Label>
                <Select value={recognitionForm.employee} onValueChange={(value) => setRecognitionForm(prev => ({ ...prev, employee: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alice Johnson">Alice Johnson</SelectItem>
                    <SelectItem value="Bob Smith">Bob Smith</SelectItem>
                    <SelectItem value="Carol Davis">Carol Davis</SelectItem>
                    <SelectItem value="David Wilson">David Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recognitionType">Recognition Type</Label>
                <Select value={recognitionForm.recognitionType} onValueChange={(value) => setRecognitionForm(prev => ({ ...prev, recognitionType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee-of-month">Employee of the Month</SelectItem>
                    <SelectItem value="star-performer">Star Performer</SelectItem>
                    <SelectItem value="innovation-award">Innovation Award</SelectItem>
                    <SelectItem value="leadership-award">Leadership Award</SelectItem>
                    <SelectItem value="customer-service">Customer Service Excellence</SelectItem>
                    <SelectItem value="team-player">Team Player Award</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recognitionTitle">Award Title *</Label>
              <Input
                id="recognitionTitle"
                value={recognitionForm.title}
                onChange={(e) => setRecognitionForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter award title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recognitionDescription">Description</Label>
              <Textarea
                id="recognitionDescription"
                value={recognitionForm.description}
                onChange={(e) => setRecognitionForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the achievement and why it's being recognized"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Effective Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !recognitionForm.effectiveDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {recognitionForm.effectiveDate ? format(recognitionForm.effectiveDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={recognitionForm.effectiveDate}
                      onSelect={(date) => date && setRecognitionForm(prev => ({ ...prev, effectiveDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="awardAmount">Award Amount ($)</Label>
                <Input
                  id="awardAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={recognitionForm.awardAmount}
                  onChange={(e) => setRecognitionForm(prev => ({ ...prev, awardAmount: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Recognition Preview</span>
              </div>
              <div className="text-sm text-yellow-700">
                <p><strong>Award:</strong> {recognitionForm.title || 'Award Title'}</p>
                <p><strong>Recipient:</strong> {recognitionForm.employee || 'Employee Name'}</p>
                {recognitionForm.awardAmount > 0 && (
                  <p><strong>Bonus:</strong> ${recognitionForm.awardAmount.toFixed(2)}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEmployeeRecognitionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEmployeeRecognition}>
              <Trophy className="h-4 w-4 mr-2" />
              Award Recognition
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}