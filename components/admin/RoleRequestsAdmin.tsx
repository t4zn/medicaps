'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ProfilePicture } from '@/components/ui/profile-picture'
import { canManageUsers } from '@/lib/roles'
import { canManageUsersFallback } from '@/lib/roles-fallback'
import { 
  LuShield, 
  LuClock, 
  LuCheck, 
  LuX, 
  LuUpload, 
  LuUserCheck, 
  LuUser,
  LuCalendar 
} from 'react-icons/lu'

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

  // Check if current user can manage users
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
      // Update the role request
      const { error: requestError } = await supabase
        .from('role_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: profile?.id
        })
        .eq('id', requestId)

      if (requestError) throw requestError

      // Update the user's role
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <LuClock className="h-4 w-4" />
      case 'approved': return <LuCheck className="h-4 w-4" />
      case 'rejected': return <LuX className="h-4 w-4" />
      default: return <LuShield className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300'
      case 'approved': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300'
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
      <Card>
        <CardContent className="py-8 text-center">
          <LuShield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">You don&apos;t have permission to manage role requests.</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading role requests...</p>
        </CardContent>
      </Card>
    )
  }

  const pendingRequests = requests.filter(req => req.status === 'pending')
  const reviewedRequests = requests.filter(req => req.status !== 'pending')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LuShield className="h-5 w-5" />
            Role Requests Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Message */}
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              {message.type === 'success' ? <LuCheck className="h-4 w-4" /> : <LuX className="h-4 w-4" />}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Pending Requests */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <LuClock className="h-5 w-5 text-yellow-600" />
              Pending Requests ({pendingRequests.length})
            </h3>
            
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <LuCheck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No pending role requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 space-y-4">
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <ProfilePicture 
                        avatarUrl={request.profiles.avatar_url} 
                        fullName={request.profiles.full_name} 
                        size={40} 
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{request.profiles.full_name}</h4>
                        <p className="text-sm text-muted-foreground">{request.profiles.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Current: {request.profiles.role}
                          </Badge>
                          <span className="text-xs text-muted-foreground">→</span>
                          <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {getRoleIcon(request.requested_role)}
                            <span className="ml-1">Requested: {request.requested_role}</span>
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <LuCalendar className="h-3 w-3" />
                          {new Date(request.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Role Info */}
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {getRoleIcon(request.requested_role)}
                        <span className="font-medium capitalize">{request.requested_role}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{getRoleDescription(request.requested_role)}</p>
                    </div>

                    {/* Reason */}
                    <div>
                      <p className="text-sm font-medium mb-1">Reason:</p>
                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">{request.reason}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => approveRequest(request.id, request.user_id, request.requested_role)}
                        disabled={processingId === request.id}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <LuCheck className="h-4 w-4 mr-2" />
                        {processingId === request.id ? 'Approving...' : 'Approve'}
                      </Button>
                      
                      <Button
                        variant="destructive"
                        onClick={() => setShowRejectionForm(request.id)}
                        disabled={processingId === request.id}
                        className="flex-1"
                      >
                        <LuX className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>

                    {/* Rejection Form */}
                    {showRejectionForm === request.id && (
                      <div className="space-y-3 p-3 border rounded-lg bg-red-50 dark:bg-red-950">
                        <label className="text-sm font-medium">Rejection Reason</label>
                        <Textarea
                          placeholder="Explain why this request is being rejected..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => rejectRequest(request.id)}
                            disabled={!rejectionReason.trim() || processingId === request.id}
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
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviewed Requests */}
          {reviewedRequests.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <LuUser className="h-5 w-5" />
                Recent Reviews ({reviewedRequests.slice(0, 5).length})
              </h3>
              
              <div className="space-y-3">
                {reviewedRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="border rounded-lg p-3 opacity-75">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ProfilePicture 
                          avatarUrl={request.profiles.avatar_url} 
                          fullName={request.profiles.full_name} 
                          size={32} 
                        />
                        <div>
                          <p className="font-medium text-sm">{request.profiles.full_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Requested {request.requested_role} role
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}