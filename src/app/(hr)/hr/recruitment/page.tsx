'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Users, UserPlus, Clock, CheckCircle, XCircle, Briefcase, Plus, Eye, Edit, Save, Calendar, FileText, Star } from 'lucide-react';
import { useCurrencyStore } from '@/stores/currency';
import { toast } from 'sonner';

export default function HRRecruitmentPage() {
  const { formatAmount } = useCurrencyStore();

  // State management
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isViewJobDialogOpen, setIsViewJobDialogOpen] = useState(false);
  const [isCandidateDialogOpen, setIsCandidateDialogOpen] = useState(false);
  const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  // Form state for job posting
  const [jobFormData, setJobFormData] = useState({
    title: '',
    department: '',
    description: '',
    requirements: '',
    salaryMin: '',
    salaryMax: '',
    priority: 'medium',
    location: 'Remote',
    employmentType: 'full-time',
  });

  // Form state for interview scheduling
  const [interviewFormData, setInterviewFormData] = useState({
    candidateId: '',
    candidateName: '',
    position: '',
    interviewer: '',
    date: '',
    time: '',
    type: 'technical',
    notes: '',
  });

  const [openPositions, setOpenPositions] = useState([
    {
      id: 1,
      title: 'Senior Software Developer',
      department: 'Engineering',
      applicants: 24,
      status: 'active',
      postedDate: '2024-11-15',
      priority: 'high',
      salaryMin: 85000,
      salaryMax: 110000,
      description: 'We are looking for a Senior Software Developer to join our engineering team. You will be responsible for designing, developing, and maintaining high-quality software solutions.',
      requirements: '5+ years of experience in software development, proficiency in React, Node.js, and cloud technologies.',
      location: 'Remote',
      employmentType: 'full-time',
    },
    {
      id: 2,
      title: 'Sales Representative',
      department: 'Sales',
      applicants: 18,
      status: 'active',
      postedDate: '2024-11-20',
      priority: 'medium',
      salaryMin: 45000,
      salaryMax: 60000,
      description: 'Join our sales team as a Sales Representative. You will be responsible for generating leads, closing deals, and building relationships with clients.',
      requirements: '2+ years of sales experience, excellent communication skills, and a proven track record of meeting sales targets.',
      location: 'Hybrid',
      employmentType: 'full-time',
    },
    {
      id: 3,
      title: 'Marketing Specialist',
      department: 'Marketing',
      applicants: 12,
      status: 'active',
      postedDate: '2024-11-25',
      priority: 'medium',
      salaryMin: 50000,
      salaryMax: 65000,
      description: 'We are seeking a creative Marketing Specialist to develop and execute marketing campaigns that drive brand awareness and customer engagement.',
      requirements: '3+ years of marketing experience, proficiency in digital marketing tools, and strong analytical skills.',
      location: 'On-site',
      employmentType: 'full-time',
    },
    {
      id: 4,
      title: 'HR Coordinator',
      department: 'HR',
      applicants: 8,
      status: 'active',
      postedDate: '2024-12-01',
      priority: 'high',
      salaryMin: 55000,
      salaryMax: 70000,
      description: 'Support our HR team as a Coordinator, managing recruitment, employee relations, and HR administrative tasks.',
      requirements: '2+ years of HR experience, knowledge of HR best practices, and excellent organizational skills.',
      location: 'Remote',
      employmentType: 'full-time',
    },
  ]);

  const [recentCandidates, setRecentCandidates] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      position: 'Senior Software Developer',
      stage: 'Technical Interview',
      status: 'in-progress',
      appliedDate: '2024-11-28',
      experience: '5 years',
      phone: '+1 (555) 123-4567',
      resume: 'alice_johnson_resume.pdf',
      notes: 'Strong technical background, excellent problem-solving skills.',
      rating: 4,
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob.smith@email.com',
      position: 'Sales Representative',
      stage: 'Offer Extended',
      status: 'offered',
      appliedDate: '2024-11-25',
      experience: '3 years',
      phone: '+1 (555) 234-5678',
      resume: 'bob_smith_resume.pdf',
      notes: 'Great sales track record, strong communication skills.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol.davis@email.com',
      position: 'Marketing Specialist',
      stage: 'Final Interview',
      status: 'in-progress',
      appliedDate: '2024-11-30',
      experience: '4 years',
      phone: '+1 (555) 345-6789',
      resume: 'carol_davis_resume.pdf',
      notes: 'Creative and analytical, good understanding of digital marketing.',
      rating: 4,
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      position: 'HR Coordinator',
      stage: 'Rejected',
      status: 'rejected',
      appliedDate: '2024-11-20',
      experience: '2 years',
      phone: '+1 (555) 456-7890',
      resume: 'david_wilson_resume.pdf',
      notes: 'Good HR knowledge but limited experience in coordination roles.',
      rating: 3,
    },
  ]);

  const recruitmentStats = [
    {
      title: 'Open Positions',
      value: openPositions.length.toString(),
      change: '+2',
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Candidates',
      value: recentCandidates.length.toString(),
      change: '+12%',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Interviews Scheduled',
      value: '23',
      change: '+5%',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Offers Extended',
      value: recentCandidates.filter(c => c.status === 'offered').length.toString(),
      change: '+3',
      icon: UserPlus,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low Priority</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'offered':
        return <Badge className="bg-green-100 text-green-800">Offer Extended</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'hired':
        return <Badge className="bg-purple-100 text-purple-800">Hired</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  // Handler functions
  const handlePostNewJob = () => {
    if (!jobFormData.title || !jobFormData.department || !jobFormData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newJob = {
      id: Math.max(...openPositions.map(p => p.id)) + 1,
      ...jobFormData,
      applicants: 0,
      status: 'active',
      postedDate: new Date().toISOString().split('T')[0],
      salaryMin: parseFloat(jobFormData.salaryMin) || 0,
      salaryMax: parseFloat(jobFormData.salaryMax) || 0,
    };

    setOpenPositions([...openPositions, newJob]);
    setJobFormData({
      title: '',
      department: '',
      description: '',
      requirements: '',
      salaryMin: '',
      salaryMax: '',
      priority: 'medium',
      location: 'Remote',
      employmentType: 'full-time',
    });
    setIsJobDialogOpen(false);
    toast.success('Job posted successfully');
  };

  const handleViewJob = (job: any) => {
    setSelectedJob(job);
    setIsViewJobDialogOpen(true);
  };

  const handleReviewCandidate = (candidate: any) => {
    setSelectedCandidate(candidate);
    setIsCandidateDialogOpen(true);
  };

  const handleScheduleInterview = () => {
    if (!interviewFormData.candidateName || !interviewFormData.date || !interviewFormData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Here you would typically save the interview to a database
    toast.success(`Interview scheduled for ${interviewFormData.candidateName} on ${interviewFormData.date} at ${interviewFormData.time}`);
    setInterviewFormData({
      candidateId: '',
      candidateName: '',
      position: '',
      interviewer: '',
      date: '',
      time: '',
      type: 'technical',
      notes: '',
    });
    setIsInterviewDialogOpen(false);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'post-job':
        setIsJobDialogOpen(true);
        break;
      case 'review-candidates':
        // Open candidates review interface
        toast.info('Opening candidates review interface...');
        break;
      case 'schedule-interviews':
        setIsInterviewDialogOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-indigo-600 to-indigo-700 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white">Recruitment Management</h1>
        <p className="text-indigo-100 mt-1 text-lg">Manage job postings, candidates, and hiring processes</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recruitmentStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-indigo-200">
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
        {/* Open Positions */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl text-gray-900">Open Positions</CardTitle>
                <CardDescription className="text-gray-600 font-medium">
                  Current job openings and requirements
                </CardDescription>
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md" onClick={() => setIsJobDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {openPositions.map((position) => (
                <div key={position.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Briefcase className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {position.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {position.department} • {position.applicants} applicants • {formatAmount(position.salaryMin)} - {formatAmount(position.salaryMax)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getPriorityBadge(position.priority)}
                    <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-300 hover:bg-indigo-50" onClick={() => handleViewJob(position)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Candidates */}
        <Card className="shadow-lg">
          <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Recent Candidates</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Latest candidate activities and progress
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-linear-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {candidate.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {candidate.position} • {candidate.experience} experience
                        </p>
                        <p className="text-xs text-gray-400">
                          Applied: {new Date(candidate.appliedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-xs text-gray-600">{candidate.stage}</p>
                      {getStatusBadge(candidate.status)}
                    </div>
                    <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-300 hover:bg-indigo-50" onClick={() => handleReviewCandidate(candidate)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader className="bg-linear-to-r from-indigo-50 to-purple-50 rounded-t-lg">
          <CardTitle className="text-xl text-gray-900">Recruitment Actions</CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Common recruitment management tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="p-5 border-2 border-indigo-200 rounded-xl hover:bg-linear-to-br hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl" onClick={() => handleQuickAction('post-job')}>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                  <Briefcase className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Post New Job</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Create and publish job openings
              </p>
            </Button>
            <Button className="p-5 border-2 border-green-200 rounded-xl hover:bg-linear-to-br hover:from-green-50 hover:to-emerald-50 hover:border-green-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl" onClick={() => handleQuickAction('review-candidates')}>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Review Candidates</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Evaluate and shortlist applicants
              </p>
            </Button>
            <Button className="p-5 border-2 border-blue-200 rounded-xl hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 text-left transition-all duration-200 group shadow-md hover:shadow-xl" onClick={() => handleQuickAction('schedule-interviews')}>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Schedule Interviews</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Arrange candidate interviews
              </p>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Post New Job Dialog */}
      <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post New Job Opening</DialogTitle>
            <DialogDescription>
              Create a new job posting with all necessary details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title *</Label>
                <Input
                  id="job-title"
                  value={jobFormData.title}
                  onChange={(e) => setJobFormData({...jobFormData, title: e.target.value})}
                  placeholder="e.g. Senior Software Developer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-department">Department *</Label>
                <Select value={jobFormData.department} onValueChange={(value) => setJobFormData({...jobFormData, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job-location">Location</Label>
                <Select value={jobFormData.location} onValueChange={(value) => setJobFormData({...jobFormData, location: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="On-site">On-site</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-type">Employment Type</Label>
                <Select value={jobFormData.employmentType} onValueChange={(value) => setJobFormData({...jobFormData, employmentType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary-min">Salary Range (Min)</Label>
                <Input
                  id="salary-min"
                  type="number"
                  value={jobFormData.salaryMin}
                  onChange={(e) => setJobFormData({...jobFormData, salaryMin: e.target.value})}
                  placeholder="50000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary-max">Salary Range (Max)</Label>
                <Input
                  id="salary-max"
                  type="number"
                  value={jobFormData.salaryMax}
                  onChange={(e) => setJobFormData({...jobFormData, salaryMax: e.target.value})}
                  placeholder="70000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-priority">Priority Level</Label>
              <Select value={jobFormData.priority} onValueChange={(value) => setJobFormData({...jobFormData, priority: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description *</Label>
              <Textarea
                id="job-description"
                value={jobFormData.description}
                onChange={(e) => setJobFormData({...jobFormData, description: e.target.value})}
                placeholder="Describe the role, responsibilities, and what the ideal candidate should bring..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-requirements">Requirements</Label>
              <Textarea
                id="job-requirements"
                value={jobFormData.requirements}
                onChange={(e) => setJobFormData({...jobFormData, requirements: e.target.value})}
                placeholder="List the required skills, experience, and qualifications..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsJobDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePostNewJob} className="bg-indigo-600 hover:bg-indigo-700">
              <Save className="h-4 w-4 mr-2" />
              Post Job
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Job Dialog */}
      <Dialog open={isViewJobDialogOpen} onOpenChange={setIsViewJobDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
            <DialogDescription>
              Complete information about this job opening.
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h3>
                  <p className="text-gray-600">{selectedJob.department} • {selectedJob.location} • {selectedJob.employmentType}</p>
                </div>
                {getPriorityBadge(selectedJob.priority)}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Salary Range</Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatAmount(selectedJob.salaryMin)} - {formatAmount(selectedJob.salaryMax)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Applicants</Label>
                    <p className="text-lg font-semibold text-gray-900">{selectedJob.applicants}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Posted Date</Label>
                    <p className="text-sm text-gray-900">{new Date(selectedJob.postedDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Location</Label>
                    <p className="text-sm text-gray-900">{selectedJob.location}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Employment Type</Label>
                    <p className="text-sm text-gray-900">{selectedJob.employmentType}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Job Description</Label>
                  <p className="text-sm text-gray-900 mt-1">{selectedJob.description}</p>
                </div>
                {selectedJob.requirements && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Requirements</Label>
                    <p className="text-sm text-gray-900 mt-1">{selectedJob.requirements}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsViewJobDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => { setIsViewJobDialogOpen(false); setIsJobDialogOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700">
              <Edit className="h-4 w-4 mr-2" />
              Edit Job
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Candidate Dialog */}
      <Dialog open={isCandidateDialogOpen} onOpenChange={setIsCandidateDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Candidate Review</DialogTitle>
            <DialogDescription>
              Review and evaluate candidate information and progress.
            </DialogDescription>
          </DialogHeader>
          {selectedCandidate && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-linear-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                  <span className="text-xl font-semibold text-white">
                    {selectedCandidate.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedCandidate.name}</h3>
                  <p className="text-gray-600">{selectedCandidate.position}</p>
                  <p className="text-sm text-gray-500">{selectedCandidate.email} • {selectedCandidate.phone}</p>
                </div>
                <div className="text-right">
                  {getStatusBadge(selectedCandidate.status)}
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < selectedCandidate.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Experience</Label>
                    <p className="text-sm text-gray-900">{selectedCandidate.experience}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Applied Date</Label>
                    <p className="text-sm text-gray-900">{new Date(selectedCandidate.appliedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Current Stage</Label>
                    <p className="text-sm text-gray-900">{selectedCandidate.stage}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Resume</Label>
                    <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-300 hover:bg-indigo-50">
                      <FileText className="h-4 w-4 mr-2" />
                      View Resume
                    </Button>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Interview Status</Label>
                    <p className="text-sm text-gray-900">{selectedCandidate.status === 'in-progress' ? 'Scheduled' : 'Not Scheduled'}</p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Notes</Label>
                <p className="text-sm text-gray-900 mt-1 bg-gray-50 p-3 rounded-md">{selectedCandidate.notes}</p>
              </div>

              <div className="flex space-x-4">
                <Button onClick={() => handleQuickAction('schedule-interviews')} className="bg-indigo-600 hover:bg-indigo-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button variant="outline" className="text-green-600 border-green-300 hover:bg-green-50">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Move to Next Stage
                </Button>
                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Candidate
                </Button>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCandidateDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Interview Dialog */}
      <Dialog open={isInterviewDialogOpen} onOpenChange={setIsInterviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Arrange an interview for a candidate.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="candidate-name">Candidate Name</Label>
                <Input
                  id="candidate-name"
                  value={interviewFormData.candidateName}
                  onChange={(e) => setInterviewFormData({...interviewFormData, candidateName: e.target.value})}
                  placeholder="Enter candidate name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={interviewFormData.position}
                  onChange={(e) => setInterviewFormData({...interviewFormData, position: e.target.value})}
                  placeholder="Enter position"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interview-date">Date *</Label>
                <Input
                  id="interview-date"
                  type="date"
                  value={interviewFormData.date}
                  onChange={(e) => setInterviewFormData({...interviewFormData, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interview-time">Time *</Label>
                <Input
                  id="interview-time"
                  type="time"
                  value={interviewFormData.time}
                  onChange={(e) => setInterviewFormData({...interviewFormData, time: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interviewer">Interviewer</Label>
                <Input
                  id="interviewer"
                  value={interviewFormData.interviewer}
                  onChange={(e) => setInterviewFormData({...interviewFormData, interviewer: e.target.value})}
                  placeholder="Enter interviewer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interview-type">Interview Type</Label>
                <Select value={interviewFormData.type} onValueChange={(value) => setInterviewFormData({...interviewFormData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="final">Final Round</SelectItem>
                    <SelectItem value="panel">Panel Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="interview-notes">Notes</Label>
              <Textarea
                id="interview-notes"
                value={interviewFormData.notes}
                onChange={(e) => setInterviewFormData({...interviewFormData, notes: e.target.value})}
                placeholder="Any special instructions or notes..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsInterviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleInterview} className="bg-indigo-600 hover:bg-indigo-700">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}