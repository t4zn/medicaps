'use client'

import { useState, useEffect, useCallback } from 'react'
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

  const fetchRequests = useCallback(async () => {
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
  }, [user])

  useEffect(() => {
    if (user) {
      fetchRequests()
    }
  }, [user, fetchRequests])

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
  //   switch (role) {
  //     case 'uploader': return 'Upload files without approval'
  //     case 'moderator': return 'Upload files and moderate content'
  //     default: return ''
  //   }
  // }

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
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Current Role */}
      <div className="text-center py-4 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Role</p>
        <span className="text-lg font-light text-black dark:text-white capitalize">
          {profile?.role || 'User'}
        </span>
      </div>

      {/* Request Form */}
      {canRequestRole() && !showForm && (
        <Button 
          onClick={() => setShowForm(true)}
          className="w-full bg-black dark:bg-white text-white dark:text-black hover:opacity-80"
        >
          Request Role Upgrade
        </Button>
      )}

      {showForm && (
        <div className="space-y-4">
          <div>
            <Select value={formData.requested_role} onValueChange={(value) => setFormData({...formData, requested_role: value})}>
              <SelectTrigger className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent focus:border-black dark:focus:border-white">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uploader">
                  <div className="flex items-center gap-2">
                    <LuUpload className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Uploader</div>
                      <div className="text-xs text-gray-500">Upload files without approval</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="moderator">
                  <div className="flex items-center gap-2">
                    <LuUserCheck className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Moderator</div>
                      <div className="text-xs text-gray-500">Upload and moderate content</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Textarea
              placeholder="Why do you need this role? How will you contribute?"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              className="border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent focus:border-black dark:focus:border-white resize-none"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {500 - formData.reason.length} characters left
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={submitRequest}
              disabled={submitting || !formData.requested_role || !formData.reason.trim()}
              className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:opacity-80"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowForm(false)
                setFormData({ requested_role: '', reason: '' })
              }}
              className="text-gray-500 hover:text-black dark:hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Status Message */}
      {message && (
        <div className={`text-center text-sm ${
          message.type === 'error' 
            ? 'text-red-600 dark:text-red-400' 
            : 'text-green-600 dark:text-green-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Existing Requests */}
      {requests.length > 0 && (
        <div className="space-y-3">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">Previous Requests</p>
          {requests.map((request) => (
            <div key={request.id} className="py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getRoleIcon(request.requested_role)}
                  <span className="font-medium text-black dark:text-white capitalize">{request.requested_role}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{request.reason}</p>
              
              {request.status === 'rejected' && request.rejection_reason && (
                <div className="text-sm text-red-600 dark:text-red-400 mb-2">
                  <strong>Rejected:</strong> {request.rejection_reason}
                </div>
              )}
              
              <p className="text-xs text-gray-400">
                {new Date(request.created_at).toLocaleDateString()}
                {request.reviewed_at && (
                  <> • Reviewed {new Date(request.reviewed_at).toLocaleDateString()}</>
                )}
              </p>
            </div>
          ))}
        </div>
      )}

      {!canRequestRole() && profile?.role !== 'user' && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You have an elevated role
          </p>
        </div>
      )}
    </div>
  )
}