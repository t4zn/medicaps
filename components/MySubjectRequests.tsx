'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Clock, CheckCircle, XCircle, FileText } from 'lucide-react'

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
  reviewed_by_profile?: {
    full_name: string
  }
}

export function MySubjectRequests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<SubjectRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading your requests...
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
      {requests.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400 mb-1">No subject requests found</p>
          <p className="text-sm text-gray-500">Submit a request to add a new subject</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 space-y-4 bg-white dark:bg-gray-950"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{request.subject_name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {request.subject_code} • {getBranchLabel(request.branch)} • {request.year.replace('-', ' ')}
                  </p>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                  <span className="capitalize">{request.status}</span>
                </div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300">{request.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Submitted: {formatDate(request.created_at)}</span>
                {request.reviewed_at && (
                  <span>
                    Reviewed: {formatDate(request.reviewed_at)}
                    {request.reviewed_by_profile && ` by ${request.reviewed_by_profile.full_name}`}
                  </span>
                )}
              </div>

              {request.status === 'rejected' && request.rejection_reason && (
                <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span className="text-sm text-red-800 dark:text-red-200">
                      <strong>Rejection Reason:</strong> {request.rejection_reason}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}