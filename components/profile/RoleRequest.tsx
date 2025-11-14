'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { LuShield, LuClock, LuCheck, LuX, LuUpload, LuUserCheck } from 'react-icons/lu'

interface RoleRequest {
  id: string
  requested_role: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string
  created_at: string
  reviewed_at?: string
}

export function RoleRequest() {
  const { user, profile } = useAuth()
  const [requests, setRequests] = useState<RoleRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    requested_role: '',
    reason: ''
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (user) {
      fetchRequests()
    }
  }, [user])

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('role_requests')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error('Error fetching role requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitRequest = async () => {
    if (!user || !formData.requested_role || !formData.reason.trim()) return

    setSubmitting(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('role_requests')
        .insert({
          user_id: user.id,
          requested_role: formData.requested_role,
          reason: formData.reason.trim()
        })

      if (error) throw error

      setMessage({ type: 'success', text: 'Role request submitted successfully!' })
      setFormData({ requested_role: '', reason: '' })
      setShowForm(false)
      fetchRequests()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && error.message.includes('duplicate') 
        ? 'You already have a pending request for this role'
        : 'Failed to submit request. Please try again.'
      
      setMessage({ 
        type: 'error', 
        text: errorMessage
      })
    } finally {
      setSubmitting(false)
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

  // const getRoleDescription = (role: string) => {
    switch (role) {
      case 'uploader': return 'Upload files without approval'
      case 'moderator': return 'Upload files and moderate content'
      default: return ''
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'uploader': return <LuUpload className="h-4 w-4" />
      case 'moderator': return <LuUserCheck className="h-4 w-4" />
      default: return <LuShield className="h-4 w-4" />
    }
  }

  const canRequestRole = () => {
    if (!profile) return false
    if (profile.role !== 'user') return false // Only regular users can request roles
    
    // Check if user has any pending requests
    const hasPendingRequest = requests.some(req => req.status === 'pending')
    return !hasPendingRequest
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LuShield className="h-5 w-5" />
            Role Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Role */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Current Role</p>
                <p className="text-xs text-muted-foreground">Your current permission level</p>
              </div>
              <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                {profile?.role || 'User'}
              </Badge>
            </div>
          </div>

          {/* Request Form */}
          {canRequestRole() && !showForm && (
            <Button 
              onClick={() => setShowForm(true)}
              className="w-full"
              variant="outline"
            >
              <LuShield className="h-4 w-4 mr-2" />
              Request Role Upgrade
            </Button>
          )}

          {showForm && (
            <div className="space-y-4 p-4 border rounded-lg">
              <div>
                <label className="text-sm font-medium">Requested Role</label>
                <Select value={formData.requested_role} onValueChange={(value) => setFormData({...formData, requested_role: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uploader">
                      <div className="flex items-center gap-2">
                        <LuUpload className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Uploader</div>
                          <div className="text-xs text-muted-foreground">Upload files without approval</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="moderator">
                      <div className="flex items-center gap-2">
                        <LuUserCheck className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Moderator</div>
                          <div className="text-xs text-muted-foreground">Upload and moderate content</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Reason for Request</label>
                <Textarea
                  placeholder="Explain why you need this role and how you plan to contribute..."
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="mt-1"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {500 - formData.reason.length} characters remaining
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={submitRequest}
                  disabled={submitting || !formData.requested_role || !formData.reason.trim()}
                  className="flex-1"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setFormData({ requested_role: '', reason: '' })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Status Message */}
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              {message.type === 'success' ? <LuCheck className="h-4 w-4" /> : <LuX className="h-4 w-4" />}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Existing Requests */}
          {requests.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Your Requests</h3>
              {requests.map((request) => (
                <div key={request.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(request.requested_role)}
                      <span className="font-medium capitalize">{request.requested_role}</span>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{request.reason}</p>
                  
                  {request.status === 'rejected' && request.rejection_reason && (
                    <div className="p-2 bg-red-50 dark:bg-red-950 rounded text-sm text-red-800 dark:text-red-200">
                      <strong>Rejection reason:</strong> {request.rejection_reason}
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Submitted {new Date(request.created_at).toLocaleDateString()}
                    {request.reviewed_at && (
                      <> • Reviewed {new Date(request.reviewed_at).toLocaleDateString()}</>
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!canRequestRole() && profile?.role !== 'user' && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                You already have an elevated role. No further requests needed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}