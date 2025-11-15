'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ProfilePicture } from '@/components/ui/profile-picture'
import { Pagination } from '@/components/ui/pagination'
import { canManageUsers } from '@/lib/roles'
import { canManageUsersFallback } from '@/lib/roles-fallback'
import { LuShield, LuClock, LuCheck, LuX, LuUpload, LuUserCheck, LuUser } from 'react-icons/lu'

interface RoleRequestWithProfile {
  id: string
  user_id: string
  requested_role: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string
  created_at: string
  reviewed_at?: string
  profiles: {
    full_name: string
    email: string
    avatar_url: string | null
    role: string
  }
}

export function RoleRequestsAdmin() {
  const { profile } = useAuth()
  const [requests, setRequests] = useState<RoleRequestWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectionForm, setShowRejectionForm] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Pagination states
  const [pendingPage, setPendingPage] = useState(1)
  const [reviewedPage, setReviewedPage] = useState(1)
  const itemsPerPage = 10

  const canManage = profile ? (
    canManageUsers(profile.email || '', profile.role) || 
    canManageUsersFallback(profile.email || '')
  ) : false

  useEffect(() => {
    if (canManage) {
      fetchRequests()
    }
  }, [canManage])

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('role_requests')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            avatar_url,
            role
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error('Error fetching role requests:', error)
      setMessage({ type: 'error', text: 'Failed to fetch role requests' })
    } finally {
      setLoading(false)
    }
  }

  const approveRequest = async (requestId: string, userId: string, requestedRole: string) => {
    setProcessingId(requestId)
    setMessage(null)

    try {
      const { error: requestError } = await supabase
        .from('role_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: profile?.id
        })
        .eq('id', requestId)

      if (requestError) throw requestError

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: requestedRole })
        .eq('id', userId)

      if (profileError) throw profileError

      setMessage({ type: 'success', text: 'Role request approved successfully!' })
      fetchRequests()
    } catch (error) {
      console.error('Error approving request:', error)
      setMessage({ type: 'error', text: 'Failed to approve request' })
    } finally {
      setProcessingId(null)
    }
  }

  const rejectRequest = async (requestId: string) => {
    if (!rejectionReason.trim()) return

    setProcessingId(requestId)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('role_requests')
        .update({
          status: 'rejected',
          rejection_reason: rejectionReason.trim(),
          reviewed_at: new Date().toISOString(),
          reviewed_by: profile?.id
        })
        .eq('id', requestId)

      if (error) throw error

      setMessage({ type: 'success', text: 'Role request rejected' })
      setRejectionReason('')
      setShowRejectionForm(null)
      fetchRequests()
    } catch (error) {
      console.error('Error rejecting request:', error)
      setMessage({ type: 'error', text: 'Failed to reject request' })
    } finally {
      setProcessingId(null)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'uploader': return <LuUpload className="h-4 w-4" />
      case 'moderator': return <LuUserCheck className="h-4 w-4" />
      default: return <LuShield className="h-4 w-4" />
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'uploader': return 'Can upload files without approval'
      case 'moderator': return 'Can upload files and moderate content'
      default: return ''
    }
  }

  if (!canManage) {
    return (
      <div className="text-center py-12 space-y-4">
        <LuShield className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600" />
        <div>
          <h3 className="text-lg font-light text-black dark:text-white mb-2">Access Denied</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">You don&apos;t have permission to manage role requests</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading role requests...</p>
      </div>
    )
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-light text-black dark:text-white mb-6">Role Requests</h2>
      </div>

      {message && (
        <div className={`text-center text-sm ${
          message.type === 'error' 
            ? 'text-red-600 dark:text-red-400' 
            : 'text-green-600 dark:text-green-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Pending Requests */}
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <LuClock className="h-5 w-5 text-yellow-600" />
          Pending Requests ({pendingRequests.length})
        </h3>
        
        {pendingRequests.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <LuCheck className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600" />
            <div>
              <h3 className="text-lg font-light text-black dark:text-white mb-2">All caught up</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No pending role requests</p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedPendingRequests.map((request) => (
              <div key={request.id} className="py-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <ProfilePicture 
                      avatarUrl={request.profiles.avatar_url} 
                      fullName={request.profiles.full_name}
                      userId={request.user_id}
                      size={40} 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-black dark:text-white text-sm">{request.profiles.full_name}</h4>
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          {request.profiles.role}
                        </span>
                        <span className="text-xs text-gray-400">→</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          {request.requested_role}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{request.profiles.email}</p>
                      
                      <div className="flex items-center gap-2 mb-2">
                        {getRoleIcon(request.requested_role)}
                        <span className="text-xs text-gray-600 dark:text-gray-400">{getRoleDescription(request.requested_role)}</span>
                      </div>
                      
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{request.reason}</p>
                      
                      <p className="text-xs text-gray-400">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => approveRequest(request.id, request.user_id, request.requested_role)}
                      disabled={processingId === request.id}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                    >
                      {processingId === request.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                      ) : (
                        <LuCheck className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRejectionForm(request.id)}
                      disabled={processingId === request.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <LuX className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Rejection Form */}
                {showRejectionForm === request.id && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 rounded space-y-3">
                    <label className="text-sm font-medium text-red-800 dark:text-red-200">Rejection Reason</label>
                    <Textarea
                      placeholder="Explain why this request is being rejected..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={2}
                      className="border-red-200 dark:border-red-800"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => rejectRequest(request.id)}
                        disabled={!rejectionReason.trim() || processingId === request.id}
                        className="flex-1"
                      >
                        {processingId === request.id ? 'Rejecting...' : 'Confirm Rejection'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowRejectionForm(null)
                          setRejectionReason('')
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
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
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <LuUser className="h-5 w-5" />
            Recent Reviews ({reviewedRequests.length})
          </h3>
          
          {reviewedRequests.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <LuCheck className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No reviewed requests yet</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {paginatedReviewedRequests.map((request) => (
              <div key={request.id} className="py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0 opacity-75">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ProfilePicture 
                      avatarUrl={request.profiles.avatar_url} 
                      fullName={request.profiles.full_name} 
                      size={32} 
                    />
                    <div>
                      <p className="font-medium text-sm text-black dark:text-white">{request.profiles.full_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Requested {request.requested_role} role
                      </p>
                    </div>
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
                      {request.reviewed_at && new Date(request.reviewed_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {request.status === 'rejected' && request.rejection_reason && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-950 rounded text-xs text-red-800 dark:text-red-200">
                    <strong>Reason:</strong> {request.rejection_reason}
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
    </div>
  )
}