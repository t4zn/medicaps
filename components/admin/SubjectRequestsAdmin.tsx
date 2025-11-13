'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Loader2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText, 
  User, 
  Calendar,
  Settings,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SubjectRequest {
  id: string
  subject_name: string
  subject_code: string
  description: string
  program: string
  branch: string
  year: string
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string
  created_at: string
  reviewed_at?: string
  requested_by_profile: {
    full_name: string
    email: string
  }
  reviewed_by_profile?: {
    full_name: string
  }
}

const BTECH_BRANCHES = [
  { value: 'cse', label: 'Computer Science & Engineering' },
  { value: 'cse-ai', label: 'CSE - Artificial Intelligence' },
  { value: 'cse-ds', label: 'CSE - Data Science' },
  { value: 'cse-networks', label: 'CSE - Networks' },
  { value: 'cse-ai-ml', label: 'CSE - AI & ML' },
  { value: 'cyber-security', label: 'Cyber Security' },
  { value: 'cse-iot', label: 'CSE - IoT' },
  { value: 'csbs', label: 'CSBS' },
  { value: 'ece', label: 'Electronics & Communication' },
  { value: 'civil', label: 'Civil Engineering' },
  { value: 'electrical', label: 'Electrical Engineering' },
  { value: 'automobile-ev', label: 'Automobile (EV)' },
  { value: 'it', label: 'Information Technology' },
  { value: 'mechanical', label: 'Mechanical Engineering' },
  { value: 'robotics-automation', label: 'Robotics & Automation' }
]

const YEARS = [
  { value: '1st-year', label: '1st Year' },
  { value: '2nd-year', label: '2nd Year' },
  { value: '3rd-year', label: '3rd Year' },
  { value: '4th-year', label: '4th Year' }
]

export function SubjectRequestsAdmin() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<SubjectRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<SubjectRequest | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editFormData, setEditFormData] = useState({
    subject_name: '',
    subject_code: '',
    description: '',
    program: 'btech',
    branch: '',
    year: ''
  })

  useEffect(() => {
    if (user) {
      fetchRequests()
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRequests = async () => {
    if (!user) return
    
    try {
      const response = await fetch(`/api/subject-requests?userId=${user.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch requests')
      }

      setRequests(data.requests || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch requests')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReviewRequest = (request: SubjectRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request)
    setReviewAction(action)
    setRejectionReason('')
    setIsReviewDialogOpen(true)
  }

  const handleEditRequest = (request: SubjectRequest) => {
    setSelectedRequest(request)
    setEditFormData({
      subject_name: request.subject_name,
      subject_code: request.subject_code,
      description: request.description,
      program: request.program,
      branch: request.branch,
      year: request.year
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteRequest = (request: SubjectRequest) => {
    setSelectedRequest(request)
    setIsDeleteDialogOpen(true)
  }

  const submitReview = async () => {
    if (!selectedRequest || !reviewAction || !user) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/subject-requests/${selectedRequest.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: reviewAction === 'approve' ? 'approved' : 'rejected',
          rejection_reason: reviewAction === 'reject' ? rejectionReason : undefined,
          userId: user.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update request')
      }

      // Update the request in the list
      setRequests(prev => prev.map(req => 
        req.id === selectedRequest.id ? data.request : req
      ))

      setIsReviewDialogOpen(false)
      setSelectedRequest(null)
      setReviewAction(null)
      setRejectionReason('')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitEdit = async () => {
    if (!selectedRequest || !user) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/subject-requests/${selectedRequest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...editFormData,
          userId: user.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update request')
      }

      // Update the request in the list
      setRequests(prev => prev.map(req => 
        req.id === selectedRequest.id ? data.request : req
      ))

      setIsEditDialogOpen(false)
      setSelectedRequest(null)
      setEditFormData({
        subject_name: '',
        subject_code: '',
        description: '',
        program: 'btech',
        branch: '',
        year: ''
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitDelete = async () => {
    if (!selectedRequest || !user) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/subject-requests/${selectedRequest.id}?userId=${user.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete request')
      }

      // Remove the request from the list
      setRequests(prev => prev.filter(req => req.id !== selectedRequest.id))

      setIsDeleteDialogOpen(false)
      setSelectedRequest(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getBranchLabel = (branch: string) => {
    const branchMap: { [key: string]: string } = {
      'cse': 'Computer Science & Engineering',
      'cse-ai': 'CSE - Artificial Intelligence',
      'cse-ds': 'CSE - Data Science',
      'cse-networks': 'CSE - Networks',
      'cse-ai-ml': 'CSE - AI & ML',
      'cyber-security': 'Cyber Security',
      'cse-iot': 'CSE - IoT',
      'csbs': 'CSBS',
      'ece': 'Electronics & Communication',
      'civil': 'Civil Engineering',
      'electrical': 'Electrical Engineering',
      'automobile-ev': 'Automobile (EV)',
      'it': 'Information Technology',
      'mechanical': 'Mechanical Engineering',
      'robotics-automation': 'Robotics & Automation'
    }
    return branchMap[branch] || branch
  }

  const pendingRequests = requests.filter(req => req.status === 'pending')
  const reviewedRequests = requests.filter(req => req.status !== 'pending')

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading subject requests...
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Pending Subject Requests
            {pendingRequests.length > 0 && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                {pendingRequests.length}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Review and approve/reject new subject requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending requests</p>
              <p className="text-sm">All subject requests have been reviewed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border rounded-lg">
                  {/* Mobile Layout */}
                  <div className="block sm:hidden p-3 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm leading-tight mb-1">{request.subject_name}</h3>
                        <p className="text-xs text-muted-foreground mb-1">
                          {request.subject_code}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getBranchLabel(request.branch)} • {request.year.replace('-', ' ')}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(request.status)} text-xs`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status}</span>
                      </Badge>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">{request.description}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{request.requested_by_profile.full_name}</span>
                      <span>{formatDate(request.created_at)}</span>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={() => handleReviewRequest(request, 'approve')}
                        className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700 flex-1"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReviewRequest(request, 'reject')}
                        className="h-8 px-3 text-xs flex-1"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditRequest(request)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteRequest(request)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:block sm:p-4 sm:space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="font-medium text-lg">{request.subject_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {request.subject_code} • {getBranchLabel(request.branch)} • {request.year.replace('-', ' ')}
                        </p>
                        <p className="text-sm text-gray-600">{request.description}</p>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status}</span>
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {request.requested_by_profile.full_name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(request.created_at)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleReviewRequest(request, 'approve')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReviewRequest(request, 'reject')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditRequest(request)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteRequest(request)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviewed Requests */}
      {reviewedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Reviewed Requests
            </CardTitle>
            <CardDescription>
              Previously reviewed subject requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviewedRequests.map((request) => (
                <div key={request.id} className="border rounded-lg">
                  {/* Mobile Layout */}
                  <div className="block sm:hidden p-3 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm leading-tight mb-1">{request.subject_name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {request.subject_code} • {getBranchLabel(request.branch)} • {request.year.replace('-', ' ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge className={`${getStatusColor(request.status)} text-xs`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditRequest(request)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteRequest(request)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">{request.description}</p>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Requested by: {request.requested_by_profile.full_name}</div>
                      {request.reviewed_at && (
                        <div>
                          Reviewed: {formatDate(request.reviewed_at)}
                          {request.reviewed_by_profile && ` by ${request.reviewed_by_profile.full_name}`}
                        </div>
                      )}
                    </div>

                    {request.status === 'rejected' && request.rejection_reason && (
                      <Alert className="border-red-200 bg-red-50">
                        <XCircle className="h-3 w-3 text-red-600" />
                        <AlertDescription className="text-red-800 text-xs">
                          <strong>Rejection Reason:</strong> {request.rejection_reason}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:block sm:p-4 sm:space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{request.subject_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {request.subject_code} • {getBranchLabel(request.branch)} • {request.year.replace('-', ' ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditRequest(request)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteRequest(request)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600">{request.description}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Requested by: {request.requested_by_profile.full_name}</span>
                      {request.reviewed_at && (
                        <span>
                          Reviewed: {formatDate(request.reviewed_at)}
                          {request.reviewed_by_profile && ` by ${request.reviewed_by_profile.full_name}`}
                        </span>
                      )}
                    </div>

                    {request.status === 'rejected' && request.rejection_reason && (
                      <Alert className="border-red-200 bg-red-50">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          <strong>Rejection Reason:</strong> {request.rejection_reason}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} Subject Request
            </DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <>
                  You are about to {reviewAction} the request for &ldquo;{selectedRequest.subject_name}&rdquo; 
                  ({selectedRequest.subject_code}) for {getBranchLabel(selectedRequest.branch)} {selectedRequest.year.replace('-', ' ')}.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {reviewAction === 'reject' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Rejection Reason *</label>
              <Textarea
                placeholder="Please provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={submitReview}
              disabled={isSubmitting || (reviewAction === 'reject' && !rejectionReason.trim())}
              className={reviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
              variant={reviewAction === 'reject' ? 'destructive' : 'default'}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {reviewAction === 'approve' ? (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                  )}
                  {reviewAction === 'approve' ? 'Approve' : 'Reject'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Subject Request</DialogTitle>
            <DialogDescription>
              Update the subject request details.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject Name *</label>
                <Input
                  value={editFormData.subject_name}
                  onChange={(e) => setEditFormData({...editFormData, subject_name: e.target.value})}
                  placeholder="e.g., Machine Learning"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject Code *</label>
                <Input
                  value={editFormData.subject_code}
                  onChange={(e) => setEditFormData({...editFormData, subject_code: e.target.value})}
                  placeholder="e.g., CS301"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Branch *</label>
                <Select 
                  value={editFormData.branch} 
                  onValueChange={(value) => setEditFormData({...editFormData, branch: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BTECH_BRANCHES.map((branch) => (
                      <SelectItem key={branch.value} value={branch.value}>
                        {branch.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Year *</label>
                <Select 
                  value={editFormData.year} 
                  onValueChange={(value) => setEditFormData({...editFormData, year: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={editFormData.description}
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                placeholder="Brief description of the subject"
                maxLength={150}
                rows={3}
              />
              <div className="text-xs text-muted-foreground text-right">
                {150 - editFormData.description.length} characters remaining
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={submitEdit}
              disabled={isSubmitting || !editFormData.subject_name || !editFormData.subject_code || !editFormData.description || !editFormData.branch || !editFormData.year}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Update
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subject Request</DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <>
                  Are you sure you want to delete the request for &ldquo;{selectedRequest.subject_name}&rdquo;? 
                  This action cannot be undone.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={submitDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}