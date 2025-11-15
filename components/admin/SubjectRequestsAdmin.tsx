'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Pagination } from '@/components/ui/pagination'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

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

export function SubjectRequestsAdmin() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<SubjectRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<SubjectRequest | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Pagination states
  const [pendingPage, setPendingPage] = useState(1)
  const [reviewedPage, setReviewedPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (user) {
      fetchRequests()
    }
  }, [user])

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
      'ece': 'Electronics & Communication',
      'civil': 'Civil Engineering',
      'electrical': 'Electrical Engineering',
      'mechanical': 'Mechanical Engineering',
      'it': 'Information Technology'
    }
    return branchMap[branch] || branch
  }

  const pendingRequests = requests.filter(req => req.status === 'pending')
  const reviewedRequests = requests.filter(req => req.status !== 'pending')
  
  // Pagination helpers
  const getPaginatedItems = <T,>(items: T[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return items.slice(startIndex, endIndex)
  }

  const getTotalPages = (totalItems: number) => {
    return Math.ceil(totalItems / itemsPerPage)
  }
  
  const paginatedPendingRequests = getPaginatedItems(pendingRequests, pendingPage)
  const paginatedReviewedRequests = getPaginatedItems(reviewedRequests, reviewedPage)
  const pendingTotalPages = getTotalPages(pendingRequests.length)
  const reviewedTotalPages = getTotalPages(reviewedRequests.length)

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading subject requests...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 space-y-4">
        <XCircle className="h-12 w-12 mx-auto text-red-500" />
        <div>
          <h3 className="text-lg font-light text-black dark:text-white mb-2">Error</h3>
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-light text-black dark:text-white">Subject Requests</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pendingRequests.length} pending • {reviewedRequests.length} reviewed
          </p>
        </div>
      </div>

      {/* Pending Requests */}
      <div>
        <h3 className="text-lg font-medium mb-4">Pending Requests ({pendingRequests.length})</h3>
        
        {pendingRequests.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <CheckCircle className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600" />
            <div>
              <h3 className="text-lg font-light text-black dark:text-white mb-2">All caught up</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No pending subject requests</p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedPendingRequests.map((request) => (
              <div key={request.id} className="py-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-black dark:text-white text-sm">{request.subject_name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                        Pending
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <span>{request.subject_code}</span>
                      <span>{getBranchLabel(request.branch)}</span>
                      <span>{request.year.replace('-', ' ')}</span>
                      <span>By {request.requested_by_profile.full_name}</span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{request.description}</p>
                    
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {formatDate(request.created_at)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReviewRequest(request, 'approve')}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReviewRequest(request, 'reject')}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              ))}
            </div>
            
            <Pagination
              currentPage={pendingPage}
              totalPages={pendingTotalPages}
              onPageChange={setPendingPage}
              className="mt-6"
            />
          </>
        )}
      </div>

      {/* Reviewed Requests */}
      {reviewedRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Recent Reviews ({reviewedRequests.length})</h3>
          {reviewedRequests.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No reviewed requests yet</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {paginatedReviewedRequests.map((request) => (
              <div key={request.id} className="py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0 opacity-75">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm text-black dark:text-white">{request.subject_name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {request.subject_code} • {getBranchLabel(request.branch)} • {request.year.replace('-', ' ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      request.status === 'approved' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {request.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {request.reviewed_at && formatDate(request.reviewed_at)}
                    </p>
                  </div>
                </div>
                
                {request.status === 'rejected' && request.rejection_reason && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-950 rounded text-xs text-red-800 dark:text-red-200">
                    <strong>Rejected:</strong> {request.rejection_reason}
                  </div>
                )}
                </div>
                ))}
              </div>
              
              <Pagination
                currentPage={reviewedPage}
                totalPages={reviewedTotalPages}
                onPageChange={setReviewedPage}
                className="mt-6"
              />
            </>
          )}
        </div>
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
                  You are about to {reviewAction} the request for &quot;{selectedRequest.subject_name}&quot; 
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
    </div>
  )
}