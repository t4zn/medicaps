'use client'

import { useState, useEffect } from 'react'
import { LuCheck, LuX, LuFileText, LuCalendar, LuUser, LuRefreshCw, LuFlag, LuEye } from 'react-icons/lu'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface PendingFile {
  id: string
  filename: string
  original_name: string
  file_size: number
  program: string
  year: string
  subject: string
  category: string
  created_at: string
  profiles?: {
    full_name: string
    email: string
  }
}

interface FileReport {
  id: string
  reason: string
  description: string
  status: string
  created_at: string
  files: {
    id: string
    original_name: string
    program: string
    year: string
    subject: string
    category: string
  }
  profiles: {
    full_name: string
    email: string
  }
}

export default function AdminPanel() {
  const { user } = useAuth()
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
  const [reports, setReports] = useState<FileReport[]>([])
  const [loading, setLoading] = useState(true)
  const [reportsLoading, setReportsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchPendingFiles = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await fetch(`/api/admin/files?userId=${user.id}`)
      const data = await response.json()

      if (response.ok) {
        setPendingFiles(data.files || [])
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to fetch files' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setLoading(false)
    }
  }

  const fetchReports = async () => {
    if (!user) return

    try {
      setReportsLoading(true)
      const response = await fetch(`/api/report?userId=${user.id}`)
      const data = await response.json()

      if (response.ok) {
        setReports(data.reports || [])
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to fetch reports' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setReportsLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingFiles()
    fetchReports()
  }, [user])

  const handleFileAction = async (fileId: string, action: 'approve' | 'reject') => {
    if (!user) return

    try {
      setActionLoading(fileId)
      const response = await fetch('/api/admin/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, action, userId: user.id }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        // Remove the file from the list
        setPendingFiles(prev => prev.filter(file => file.id !== fileId))
      } else {
        setMessage({ type: 'error', text: data.error || 'Action failed' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setActionLoading(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleReportAction = async (reportId: string, action: 'resolve' | 'dismiss') => {
    if (!user) return

    try {
      setActionLoading(reportId)
      const response = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, action, userId: user.id }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        // Remove the report from the list
        setReports(prev => prev.filter(report => report.id !== reportId))
      } else {
        setMessage({ type: 'error', text: data.error || 'Action failed' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading pending files...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="files" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="files" className="flex items-center gap-2">
            <LuFileText className="h-4 w-4" />
            Pending Files ({pendingFiles.length})
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <LuFlag className="h-4 w-4" />
            Reports ({reports.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="files">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending File Approvals</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchPendingFiles}
                disabled={loading}
              >
                <LuRefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-4">
              {message.type === 'success' ? (
                <LuCheck className="h-4 w-4" />
              ) : (
                <LuX className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {pendingFiles.length === 0 ? (
            <div className="text-center py-8">
              <LuFileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No pending files</h3>
              <p className="text-muted-foreground">All uploaded files have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingFiles.map((file) => (
                <Card key={file.id} className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <LuFileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                          <h3 className="font-medium truncate">{file.original_name}</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <div className="text-sm text-muted-foreground">Program & Year</div>
                            <div className="font-medium">
                              {file.program.toUpperCase()} - {file.year.replace('-', ' ')}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Subject</div>
                            <div className="font-medium capitalize">
                              {file.subject ? file.subject.replace('-', ' ') : 'General'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <Badge variant="outline" className="capitalize">
                            {file.category.replace('-', ' ')}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <LuCalendar className="h-3 w-3" />
                            {formatDate(file.created_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <LuUser className="h-3 w-3" />
                            {file.profiles?.full_name || 'Anonymous'}
                          </div>
                          <span>{formatFileSize(file.file_size)}</span>
                        </div>

                        {file.profiles?.email && (
                          <div className="text-xs text-muted-foreground">
                            Uploaded by: {file.profiles.email}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleFileAction(file.id, 'approve')}
                          disabled={actionLoading === file.id}
                        >
                          {actionLoading === file.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          ) : (
                            <LuCheck className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleFileAction(file.id, 'reject')}
                          disabled={actionLoading === file.id}
                        >
                          {actionLoading === file.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <LuX className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="reports">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>File Reports</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchReports}
            disabled={reportsLoading}
          >
            <LuRefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {reportsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8">
              <LuFlag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No pending reports</h3>
              <p className="text-muted-foreground">All reports have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <LuFlag className="h-5 w-5 text-red-500 flex-shrink-0" />
                          <h3 className="font-medium truncate">{report.files.original_name}</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <div className="text-sm text-muted-foreground">Reason</div>
                            <div className="font-medium capitalize">
                              {report.reason.replace('_', ' ')}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Reported by</div>
                            <div className="font-medium">
                              {report.profiles.full_name}
                            </div>
                          </div>
                        </div>

                        {report.description && (
                          <div className="mb-3">
                            <div className="text-sm text-muted-foreground">Description</div>
                            <div className="text-sm bg-muted p-2 rounded">
                              {report.description}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Badge variant="outline" className="capitalize">
                            {report.files.category.replace('-', ' ')}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <LuCalendar className="h-3 w-3" />
                            {formatDate(report.created_at)}
                          </div>
                          <span>{report.files.program.toUpperCase()} - {report.files.year.replace('-', ' ')}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          onClick={() => window.open(`/notes/${report.files.program}/${report.files.year}/${report.files.subject}`, '_blank')}
                        >
                          <LuEye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleReportAction(report.id, 'resolve')}
                          disabled={actionLoading === report.id}
                        >
                          {actionLoading === report.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          ) : (
                            <LuCheck className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleReportAction(report.id, 'dismiss')}
                          disabled={actionLoading === report.id}
                        >
                          {actionLoading === report.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <LuX className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</div>
)
}